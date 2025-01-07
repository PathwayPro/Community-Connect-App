import { Module } from '@nestjs/common';
import { EventsManagersService } from './events_managers.service';
import { EventsManagersController } from './events_managers.controller';
import { PrismaService } from 'src/database';

@Module({
  controllers: [EventsManagersController],
  providers: [PrismaService, EventsManagersService],
})
export class EventsManagersModule {}
