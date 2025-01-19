import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { PrismaService } from 'src/database';

@Module({
  controllers: [FilesController],
  providers: [PrismaService, FilesService],
})
export class FilesModule {}
