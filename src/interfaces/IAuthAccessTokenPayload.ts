export type IAuthAccessTokenPayload = {
  sub: string;
  email?: string;
  iat: number;
  exp: number;
};
