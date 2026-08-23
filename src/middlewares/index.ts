import { Request, Response, NextFunction } from 'express';
import { logError, ResponseHandler } from '../handlers';
import { verifyAccessToken } from '../utils/jwt.util';
import { User } from '../models';

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    ResponseHandler.error(res, {
      msg: 'Unauthorized: Missing token',
      statusCode: 401,
    });
    return;
  }

  const accessToken = authHeader.split('Bearer ')[1];

  try {
    req.authUser = verifyAccessToken(accessToken);
    const user = await User.findOne({ _id: req.authUser.sub });

    if (!user) {
      ResponseHandler.error(res, {
        msg: 'User not found.',
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
    req.user = user;

    next();
  } catch (error) {
    logError(req.path, req.method, error as Error);
    ResponseHandler.error(res, {
      msg: 'Token expired!!',
      statusCode: 401,
    });
    return;
  }
};
