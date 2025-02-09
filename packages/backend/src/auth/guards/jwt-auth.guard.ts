import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators';
import { JwtService } from '@nestjs/jwt';
import { Observable, of, firstValueFrom } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {
    super();
  }

  private extractTokenFromHeader(authHeader: string): string | undefined {
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }
    return undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    // ADD USER (IF EXIST) ON PUBLIC ROUTES
    if (isPublic) {
      if (authHeader) {
        const token = this.extractTokenFromHeader(authHeader); // Get token without "Bearer "
        if (token) {
          try {
            // VALIDATE TOKEN AND ADD TO THE REQUEST
            const payload = await this.jwtService.verifyAsync(token);
            req.user = payload;
          } catch (error) {
            // IGNORING TOKEN VALIDATION ERRORS IN PUBLIC ROUTES. LOG ERROR JUST IN CASE
            console.error('Invalid token on public route:', error.message);
          }
        }
      }

      // PUBLIC ROUTES CAN ACTIVATE ALWAYS (WITH OR WITHOUT VALIDATED CREDENTIALS)
      return true;
    }

    // PROTECTED ROUTES CONVERTING TYPES OF `super.canActivate` TO `Promise<boolean>`
    const authResult = super.canActivate(context);

    if (authResult instanceof Observable) {
      return firstValueFrom(authResult.pipe(switchMap((value) => of(value)))); // observable to promis
    } else if (authResult instanceof Promise) {
      return authResult;
    } else {
      return Promise.resolve(authResult);
    }
  }
}
