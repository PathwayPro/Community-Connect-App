import { Module } from '@nestjs/common';
import { OpportunitiesService } from './opportunities.service';
import { OpportunitiesController } from './opportunities.controller';
import { PrismaService } from 'src/database';
import { FilesService } from 'src/files/files.service';

@Module({
  controllers: [OpportunitiesController],
  providers: [OpportunitiesService, PrismaService, FilesService],
})
export class OpportunitiesModule {}
