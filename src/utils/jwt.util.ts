import jwt from 'jsonwebtoken';
import { Config } from '../config';
import { IAuthAccessTokenPayload } from '../interfaces/IAuthAccessTokenPayload';

export const signAccessToken = (payload: { sub: string; email?: string }): string => {
  return jwt.sign(payload, Config.JWT_SECRET, { expiresIn: Config.JWT_ACCESS_EXPIRY } as jwt.SignOptions);
};

export const signRefreshToken = (payload: { sub: string }): string => {
  return jwt.sign(payload, Config.JWT_REFRESH_SECRET, {
    expiresIn: Config.JWT_REFRESH_EXPIRY,
  } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string): IAuthAccessTokenPayload => {
  return jwt.verify(token, Config.JWT_SECRET) as IAuthAccessTokenPayload;
};

export const verifyRefreshToken = (token: string): IAuthAccessTokenPayload => {
  return jwt.verify(token, Config.JWT_REFRESH_SECRET) as IAuthAccessTokenPayload;
};
