export type JwtPayload = {
  sub: number;
  email: string;
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
};

export type EmailOptions = {
  to: string;
  subject: string;
  text: string;
  html: string;
};
