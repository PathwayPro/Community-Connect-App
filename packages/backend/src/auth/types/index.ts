import { users_roles } from '@prisma/client';

export type JwtPayload = {
  sub: number;
  email: string;
  roles?: users_roles;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type LoginResponse = {
  tokens: Tokens;
  message: string;
};

export type EmailConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  frontendUrl: string;
  jwtSecret: string;
  adminEmail: string;
};

export type EmailOptions = {
  to: string;
  from?: string;
  subject: string;
  text: string;
  html: string;
};

export type AuthResponse = {
  message: string;
  tokens: Tokens;
};

export type GoogleUser = {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
};
