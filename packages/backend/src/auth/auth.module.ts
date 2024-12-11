import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PrismaService } from 'prisma/prisma.service';
import { AuthController } from './auth.controller';
import { EmailService } from './email.Service';

@Module({
  imports: [
    ConfigModule.forRoot(), // This will load your environment variables
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule if not globally available
      inject: [ConfigService], // Inject ConfigService into the JwtModule
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') },
      }),
    }),
  ],
  providers: [AuthService, PrismaService, EmailService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
