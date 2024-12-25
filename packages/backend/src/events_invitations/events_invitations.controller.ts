import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { EventsInvitationsService } from './events_invitations.service';
import { CreateEventsInvitationDto } from './dto/create-events_invitation.dto';
import { FilterEventsInvitationDto } from './dto/filter-events_invitation.dto';
import { Public } from 'src/auth/decorators';
import { DeleteEventsInvitationDto } from './dto/delete-events_invitation.dto';

@Public()
@Controller('events-invitations')
export class EventsInvitationsController {
  constructor(
    private readonly eventsInvitationsService: EventsInvitationsService,
  ) {}

  @Post()
  create(@Body() createEventsInvitationDto: CreateEventsInvitationDto) {
    const newInvitation: CreateEventsInvitationDto = {
      inviter_id: createEventsInvitationDto.inviter_id,
      invitee_id: createEventsInvitationDto.invitee_id,
      event_id: createEventsInvitationDto.event_id,
      message: createEventsInvitationDto.message,
    };
    return this.eventsInvitationsService.create(newInvitation);
  }

  @Get()
  findAll(@Body() filters: FilterEventsInvitationDto) {
    const searchFilters: FilterEventsInvitationDto = {
      inviter_id: filters.inviter_id,
      invitee_id: filters.invitee_id,
      event_id: filters.event_id,
      date_from: filters.date_from ? new Date(filters.date_from) : null,
      date_to: filters.date_to,
    };

    return this.eventsInvitationsService.findAll(searchFilters);
  }

  @Delete()
  remove(@Body() deleteEventsInvitationDto: DeleteEventsInvitationDto) {
    const deleteInvitation: DeleteEventsInvitationDto = {
      inviter_id: deleteEventsInvitationDto.inviter_id,
      invitee_id: deleteEventsInvitationDto.invitee_id,
      event_id: deleteEventsInvitationDto.event_id,
    };
    return this.eventsInvitationsService.remove(deleteInvitation);
  }
}
