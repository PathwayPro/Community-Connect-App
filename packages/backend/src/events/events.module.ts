import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaService } from 'src/database';
import { EventsCategoriesService } from 'src/events_categories/events_categories.service';

@Module({
  controllers: [EventsController],
  providers: [PrismaService, EventsService, EventsCategoriesService],
})
export class EventsModule {}
