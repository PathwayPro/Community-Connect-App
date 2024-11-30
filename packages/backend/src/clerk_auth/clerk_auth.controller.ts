import { Controller, Get, Param } from '@nestjs/common';
import { ClerkAuthService } from './clerk_auth.service';

@Controller('clerk-auth')
export class ClerkAuthController {
  constructor(private readonly clerkService: ClerkAuthService) {}

  @Get('users')
  getUsers(): string {
    return this.clerkService.getUsers();
  }
  @Get('user/:id')
  getUserById(@Param('id') id: string): string {
    return this.clerkService.getUserById(id);
  }
}
