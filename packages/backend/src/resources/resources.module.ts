import { Module } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { PrismaService } from 'src/database';

@Module({
  controllers: [ResourcesController],
  providers: [PrismaService,ResourcesService],
})
export class ResourcesModule {}
