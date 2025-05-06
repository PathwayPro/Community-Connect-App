import { Module } from '@nestjs/common';
import { ContactUsService } from './contact_us.service';
import { ContactUsController } from './contact_us.controller';
import { PrismaService } from 'src/database/prisma.service';
import { EmailService } from 'src/auth/services/email.service';

@Module({
  controllers: [ContactUsController],
  providers: [ContactUsService, PrismaService, EmailService],
})
export class ContactUsModule {}
