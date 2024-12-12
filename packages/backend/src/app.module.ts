import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigModule and ConfigService
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { PrismaService } from '../prisma/prisma.service';
import { MentorModule } from './mentor/mentor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // Import ConfigModule and load .env configuration
      isGlobal: true, // Makes ConfigService globally available
    }),
    JwtModule.registerAsync({
      inject: [ConfigService], // Inject ConfigService
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION'),
        },
      }),
    }),
    UsersModule,
    AuthModule,
    DatabaseModule,
    MentorModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
