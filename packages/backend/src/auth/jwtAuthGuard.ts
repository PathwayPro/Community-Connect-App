import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    // const token =
    // request.cookies['jwt'] || request.headers['authorization']?.split(' ')[1];
    const token =
      request.headers['authorization']?.split(' ')[1] || request.cookies['jwt'];
    console.log(
      'Token from Authorization header:',
      request.headers['authorization'],
    );
    // console.log('Token from Cookie:', request.cookies['jwt']);

    if (!token) return false;

    try {
      // const decoded = this.jwtService.verify(token);
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      request.user = decoded; // Attach decoded info to the request
      console.log(`decoded token :${decoded}`);
      return true;
    } catch (error) {
      console.error('Invalid JWT token:', error);
      // You might want to handle the error differently, for example, throw an error or
      return false;
    }
  }
}
