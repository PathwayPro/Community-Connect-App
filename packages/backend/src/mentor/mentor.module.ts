import { Module } from '@nestjs/common';
import { MentorService } from './mentor.service';
import { MentorController } from './mentor.controller';
import { PrismaService } from 'src/database';
import { FilesService } from 'src/files/files.service';

@Module({
  controllers: [MentorController],
  providers: [PrismaService, MentorService, FilesService],
})
export class MentorModule {}
