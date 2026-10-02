import bcrypt from 'bcrypt';
import { logError, ResponseHandler } from '../../handlers';
import { Request, Response } from 'express';
import { User } from '../../models';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt.util';

const SALT_ROUNDS = 10;

export class AuthController {
  constructor() {}

  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        ResponseHandler.error(res, {
          msg: 'An account with this email already exists',
          statusCode: 409,
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        userType: 'user',
      });

      const accessToken = signAccessToken({ sub: user._id.toString(), email: user.email });
      const refreshToken = signRefreshToken({ sub: user._id.toString() });

      ResponseHandler.success(res, {
        msg: 'User registered successfully',
        data: { user: { id: user._id, name: user.name, email: user.email }, accessToken, refreshToken },
      });
    } catch (error) {
      logError(`/api/v1/users/auth/register`, 'POST', error as Error);
      ResponseHandler.error(res, {
        msg: 'Registration failed',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        ResponseHandler.error(res, {
          msg: 'Invalid email or password',
          statusCode: 401,
        });
        return;
      }

      if (user.isBlocked) {
        ResponseHandler.error(res, {
          msg: 'Your account has been blocked. Please contact support for more information.',
          statusCode: 403,
        });
        return;
      }
      if (user.isDeleted) {
        ResponseHandler.error(res, {
          msg: 'Your account has been deleted. Please contact support for more information.',
          statusCode: 403,
        });
        return;
      }

      if (!user.password) {
        ResponseHandler.error(res, {
          msg: 'Invalid email or password',
          statusCode: 401,
        });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        ResponseHandler.error(res, {
          msg: 'Invalid email or password',
          statusCode: 401,
        });
        return;
      }

      const accessToken = signAccessToken({ sub: user._id.toString(), email: user.email });
      const refreshToken = signRefreshToken({ sub: user._id.toString() });

      ResponseHandler.success(res, {
        msg: 'Login successful',
        data: { user: { id: user._id, name: user.name, email: user.email }, accessToken, refreshToken },
      });
    } catch (error) {
      logError(`/api/v1/users/auth/login`, 'POST', error as Error);
      ResponseHandler.error(res, {
        msg: 'Login failed',
        statusCode: 500,
        error: [(error as Error).message],
      });
    }
  }

  public async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      const payload = verifyRefreshToken(refreshToken);
      const user = await User.findOne({ _id: payload.sub });
      if (!user || user.isBlocked || user.isDeleted) {
        ResponseHandler.error(res, {
          msg: 'Unable to refresh session',
          statusCode: 401,
        });
        return;
      }

      const accessToken = signAccessToken({ sub: user._id.toString(), email: user.email });

      ResponseHandler.success(res, {
        msg: 'Token refreshed successfully',
        data: { accessToken },
      });
    } catch (error) {
      logError(`/api/v1/users/auth/refresh`, 'POST', error as Error);
      ResponseHandler.error(res, {
        msg: 'Invalid or expired refresh token',
        statusCode: 401,
      });
    }
  }
}
