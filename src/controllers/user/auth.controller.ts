import { logError, ResponseHandler } from '../../handlers';
import { Request, Response } from 'express';
import { User } from '../../models';

export class AuthController {
  constructor() {}
  public async register(req: Request, res: Response): Promise<void> {
    try {
      let user = await User.findOne({ authId: req.authUser?.sub });
      if (!user) {
        user = await User.create({
          authId: req.authUser?.sub,
          email: req.authUser?.email,
          phoneNumber: req.authUser?.phone_number,
          userType: 'user',
          name: '',
        });
      }
      const userData = await User.findOne({
        _id: user?._id,
        $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
      });
      ResponseHandler.success(res, {
        msg: 'User registered successfully',
        data: userData,
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
}
