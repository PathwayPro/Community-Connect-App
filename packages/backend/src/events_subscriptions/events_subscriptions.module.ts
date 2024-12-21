import { Module } from '@nestjs/common';
import { EventsSubscriptionsService } from './events_subscriptions.service';
import { EventsSubscriptionsController } from './events_subscriptions.controller';
import { PrismaService } from 'src/database';

@Module({
  controllers: [EventsSubscriptionsController],
  providers: [PrismaService, EventsSubscriptionsService],
})
export class EventsSubscriptionsModule {}
