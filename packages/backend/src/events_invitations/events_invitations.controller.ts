import { Controller, Get, Post, Body, Delete, UseGuards } from '@nestjs/common';
import { EventsInvitationsService } from './events_invitations.service';
import { CreateEventsInvitationDto } from './dto/create-events_invitation.dto';
import { FilterEventsInvitationDto } from './dto/filter-events_invitation.dto';
import { DeleteEventsInvitationDto } from './dto/delete-events_invitation.dto';
import { Roles, GetUser } from 'src/auth/decorators';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { JwtPayload } from 'src/auth/util/JwtPayload.interface';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('events-invitations')
export class EventsInvitationsController {
  constructor(
    private readonly eventsInvitationsService: EventsInvitationsService,
  ) {}

  @Post()
  @Roles('ADMIN', 'MENTOR')
  create(
    @GetUser() user: JwtPayload,
    @Body() createEventsInvitationDto: CreateEventsInvitationDto,
  ) {
    const newInvitation: CreateEventsInvitationDto = {
      inviter_id: user.sub,
      invitee_id: createEventsInvitationDto.invitee_id,
      event_id: createEventsInvitationDto.event_id,
      message: createEventsInvitationDto.message,
    };
    return this.eventsInvitationsService.create(newInvitation);
  }

  @Get()
  @Roles('ADMIN', 'MENTOR', 'USER')
  findAll(
    @GetUser() user: JwtPayload,
    @Body() filters: FilterEventsInvitationDto,
  ) {
    const searchFilters: FilterEventsInvitationDto = {
      inviter_id: filters.inviter_id,
      invitee_id: filters.invitee_id,
      event_id: filters.event_id,
      date_from: filters.date_from ? new Date(filters.date_from) : null,
      date_to: filters.date_to,
    };

    return this.eventsInvitationsService.findAll(user, searchFilters);
  }

  @Delete()
  @Roles('ADMIN', 'MENTOR', 'USER')
  remove(
    @GetUser() user: JwtPayload,
    @Body() deleteEventsInvitationDto: DeleteEventsInvitationDto,
  ) {
    const deleteInvitation: DeleteEventsInvitationDto = {
      inviter_id: deleteEventsInvitationDto.inviter_id,
      invitee_id: deleteEventsInvitationDto.invitee_id,
      event_id: deleteEventsInvitationDto.event_id,
    };
    return this.eventsInvitationsService.remove(user, deleteInvitation);
  }
}
