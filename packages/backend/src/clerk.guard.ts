import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { createClerkClient } from '@clerk/backend';

@Injectable()
export class ClerkGuard implements CanActivate {
  private clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];
    const sessionId = request.headers['x-clerk-session-id'];

    if (!token || !request.headers['authorization']?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid or missing authorization token');
    }

    if (!sessionId) {
      throw new UnauthorizedException('Session ID is required');
    }

    try {
      const session = await this.clerkClient.sessions.verifySession(
        sessionId,
        token,
      );
      request.user = session.userId;
      return true;
    } catch (error) {
      console.error('Error verifying Clerk session:', error);
      throw new UnauthorizedException('Invalid token or session');
    }
  }
}
