import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { AuthService } from '../auth/services/auth.service';
import { EmailService } from '../auth/services/email.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [JwtModule, forwardRef(() => AuthModule)],
  providers: [UsersService, PrismaService, AuthService, EmailService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
