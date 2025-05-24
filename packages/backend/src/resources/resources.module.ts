import { Module } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { PrismaService } from 'src/database';
import { FilesService } from 'src/files/files.service';
@Module({
  controllers: [ResourcesController],
  providers: [PrismaService, ResourcesService, FilesService],
})
export class ResourcesModule {}
