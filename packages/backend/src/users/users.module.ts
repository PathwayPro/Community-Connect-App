import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt'; // Import JwtModule
import { PrismaService } from '../../prisma/prisma.service'; // Adjust the path accordingly
import { AuthService } from 'src/auth/auth.service';
import { EmailService } from 'src/auth/email.Service';

@Module({
  imports: [
    JwtModule, // Add JwtModule to imports to provide JwtService
  ],
  providers: [UsersService, PrismaService, AuthService, EmailService],
  controllers: [UsersController],
})
export class UsersModule {}
