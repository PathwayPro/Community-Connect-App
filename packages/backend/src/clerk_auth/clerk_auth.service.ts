import { clerkClient } from '@clerk/clerk-sdk-node';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClerkAuthService {
  getLoginMessage(): string {
    return 'user logged in!';
  }

  getLogoutMessage(): string {
    return 'User logged out!';
  }

  getUsers(): string {
    users = clerkClient.
    return 'users';
  }

  getUserById(id: string): string {
    return `User ${id}`;
  }
}
