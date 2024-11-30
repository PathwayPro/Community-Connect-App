import { Module } from '@nestjs/common';
import { ClerkAuthController } from './clerk_auth.controller';
import { ClerkAuthService } from './clerk_auth.service';

@Module({
  controllers: [ClerkAuthController],
  providers: [ClerkAuthService],
})
export class ClerkAuthModule {}
