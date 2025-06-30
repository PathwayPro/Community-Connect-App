import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { AuthService } from '../auth/services/auth.service';
import { EmailService } from '../auth/services/email.service';
import { AuthModule } from 'src/auth/auth.module';
import { SettingsService } from 'src/settings/settings.services';
import { FilesService } from 'src/files/files.service';
import { MenteeModule } from 'src/mentee/mentee.module';
import { MentorModule } from 'src/mentor/mentor.module';
import { MenteeService } from 'src/mentee/mentee.service';
import { MentorService } from 'src/mentor/mentor.service';
@Module({
  imports: [
    JwtModule,
    forwardRef(() => AuthModule),
    forwardRef(() => MenteeModule),
    forwardRef(() => MentorModule),
  ],
  providers: [
    UsersService,
    PrismaService,
    AuthService,
    EmailService,
    SettingsService,
    FilesService,
    MenteeService,
    MentorService,
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
