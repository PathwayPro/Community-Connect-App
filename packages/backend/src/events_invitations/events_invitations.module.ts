import { Module } from '@nestjs/common';
import { EventsInvitationsService } from './events_invitations.service';
import { EventsInvitationsController } from './events_invitations.controller';
import { PrismaService } from 'src/database';

@Module({
  controllers: [EventsInvitationsController],
  providers: [PrismaService, EventsInvitationsService],
})
export class EventsInvitationsModule {}
