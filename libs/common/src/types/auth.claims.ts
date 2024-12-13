import { JwtPayload } from 'jsonwebtoken';

export type AuthClaims = JwtPayload & {
  email: string;
  iss: string;
  iat: number;
  exp: number;
};
