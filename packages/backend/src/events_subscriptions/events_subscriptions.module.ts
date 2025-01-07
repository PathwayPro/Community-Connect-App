import { Module } from '@nestjs/common';
import { EventsSubscriptionsService } from './events_subscriptions.service';
import { EventsSubscriptionsController } from './events_subscriptions.controller';
import { PrismaService } from 'src/database';
import { EventsManagersService } from '../events_managers/events_managers.service';

@Module({
  controllers: [EventsSubscriptionsController],
  providers: [PrismaService, EventsSubscriptionsService, EventsManagersService],
})
export class EventsSubscriptionsModule {}
