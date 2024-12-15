import { Module } from '@nestjs/common';
import { MentorService } from './mentor.service';
import { MentorController } from './mentor.controller';
import { PrismaService } from 'src/database';

@Module({
  controllers: [MentorController],
  providers: [PrismaService, MentorService],
})
export class MentorModule {}
