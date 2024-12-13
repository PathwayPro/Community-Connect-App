import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from '../util/enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: (keyof typeof RolesEnum)[]) =>
  SetMetadata(ROLES_KEY, roles);
