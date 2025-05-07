import { JwtPayload } from 'jsonwebtoken';

export interface Auth {
  email: string;
  password: string;
}

export interface JwtPayloadUser extends JwtPayload {
  email: string;
  token1: string;
  iat: number;
  exp: number;
}

export interface JwtPayloadEnv extends JwtPayload {
  username: string;
  token: string;
}
