import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaService } from 'src/database';
import { FilesService } from 'src/files/files.service';
import { EventsCategoriesService } from 'src/events_categories/events_categories.service';
import { EventsManagersService } from 'src/events_managers/events_managers.service';
import { EventsInvitationsService } from 'src/events_invitations/events_invitations.service';

@Module({
  controllers: [EventsController],
  providers: [
    PrismaService,
    EventsService,
    EventsCategoriesService,
    FilesService,
    EventsManagersService,
    EventsInvitationsService,
  ],
})
export class EventsModule {}
