import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { users_roles } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<
      (keyof typeof users_roles)[]
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const rawUserRoles = user?.roles ?? user?.role;

    // Normalize to an array of uppercased strings for robust comparison
    const normalizedUserRoles: string[] = Array.isArray(rawUserRoles)
      ? rawUserRoles.map((r: any) => String(r).toUpperCase())
      : rawUserRoles
        ? [String(rawUserRoles).toUpperCase()]
        : [];

    const normalizedRequiredRoles = requiredRoles.map((r) =>
      String(users_roles[r]).toUpperCase(),
    );

    return normalizedRequiredRoles.some((req) =>
      normalizedUserRoles.includes(req),
    );
  }
}
