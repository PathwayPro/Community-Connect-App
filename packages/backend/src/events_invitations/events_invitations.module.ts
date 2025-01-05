import { Module } from '@nestjs/common';
import { EventsInvitationsService } from './events_invitations.service';
import { EventsInvitationsController } from './events_invitations.controller';
import { PrismaService } from 'src/database';
import { EventsManagersService } from '../events_managers/events_managers.service';

@Module({
  controllers: [EventsInvitationsController],
  providers: [PrismaService, EventsInvitationsService, EventsManagersService],
})
export class EventsInvitationsModule {}
