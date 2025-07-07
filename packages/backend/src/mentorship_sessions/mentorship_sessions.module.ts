import { Module } from '@nestjs/common';
import { MentorshipSessionsService } from './mentorship_sessions.service';
import { MentorshipSessionsController } from './mentorship_sessions.controller';
import { PrismaService } from 'src/database';

@Module({
  controllers: [MentorshipSessionsController],
  providers: [PrismaService, MentorshipSessionsService],
})
export class MentorshipSessionsModule {}
