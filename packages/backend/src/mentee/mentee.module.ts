import { Module } from '@nestjs/common';
import { MenteeService } from './mentee.service';
import { MenteeController } from './mentee.controller';
import { PrismaService } from 'src/database';
import { FilesService } from 'src/files/files.service';

@Module({
  controllers: [MenteeController],
  providers: [PrismaService, MenteeService, FilesService],
})
export class MenteeModule {}
