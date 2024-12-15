import { Module } from '@nestjs/common';
import { EventsCategoriesService } from './events_categories.service';
import { EventsCategoriesController } from './events_categories.controller';
import { PrismaService } from 'src/database';

@Module({
  controllers: [EventsCategoriesController],
  providers: [PrismaService, EventsCategoriesService],
})
export class EventsCategoriesModule {}
