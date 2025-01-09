import { users_roles } from '@prisma/client';

export interface JwtPayload {
  sub: number;
  email: string;
  roles: users_roles;
}
