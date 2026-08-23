import { Request, Response, NextFunction } from 'express';
import { firebase } from '../services';
import { logError, ResponseHandler } from '../handlers';
import { IAuthAccessTokenPayload } from '../interfaces/IAuthAccessTokenPayload';
import { User } from '../models';

const publicRoutes = ['/register'];
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
  const endpoint = req.path;

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await firebase.auth().verifyIdToken(idToken);
    req.authUser = decodedToken as IAuthAccessTokenPayload;
    const user = await User.findOne({ authId: req.authUser.sub });
    if (user?.isBlocked) {
      ResponseHandler.error(res, {
        msg: 'Your account has been blocked. Please contact support for more information.',
        statusCode: 403,
      });
      return;
    }
    if (user?.isDeleted) {
      ResponseHandler.error(res, {
        msg: 'Your account has been deleted. Please contact support for more information.',
        statusCode: 403,
      });
      return;
    }
    req.user = user;

    if (!publicRoutes.includes(endpoint) && !user) {
      ResponseHandler.error(res, {
        msg: 'Please register this user using register endpoint.',
        statusCode: 401,
      });
      return;
    }
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
