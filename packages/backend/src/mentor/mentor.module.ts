import { Module } from '@nestjs/common';
import { MentorService } from './mentor.service';
import { MentorController } from './mentor.controller';
import { PrismaService } from 'src/database';
import { InterestsService } from 'src/interests/interests.service';

@Module({
  controllers: [MentorController],
  providers: [PrismaService, MentorService, InterestsService],
})
export class MentorModule {}
