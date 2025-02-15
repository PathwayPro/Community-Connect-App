import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  Param,
  Query,
} from '@nestjs/common';
import { EventsInvitationsService } from './events_invitations.service';
import { CreateEventsInvitationDto } from './dto/create-events_invitation.dto';
import { FilterEventsInvitationDto } from './dto/filter-events_invitation.dto';
import { Roles, GetUser } from 'src/auth/decorators';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { JwtPayload } from 'src/auth/util/JwtPayload.interface';
import { EventsInvitation } from './entities/events_invitation.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Events Invitations')
@Controller('events-invitations')
export class EventsInvitationsController {
  constructor(
    private readonly eventsInvitationsService: EventsInvitationsService,
  ) {}

  @Post()
  @Roles('ADMIN', 'MENTOR')
  @ApiBody({ type: CreateEventsInvitationDto })
  @ApiCreatedResponse({ type: EventsInvitation })
  @ApiInternalServerErrorResponse({
    description: 'Error creating invitation: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Create new invitation to an event',
    description: `Creates event invitation.
          \n\n REQUIRED ROLES: **ADMIN | MENTOR**
          \n\n **VALIDATIONS:**
          \n\n * If the user is an ADMIN, they can invite to anything.
          \n\n * If the user is a MENTOR, they can invite to events they manage. `,
  })
  @ApiBearerAuth()
  create(
    @GetUser() user: JwtPayload,
    @Body() createEventsInvitationDto: CreateEventsInvitationDto,
  ) {
    const newInvitation: CreateEventsInvitationDto = {
      invitee_id: createEventsInvitationDto.invitee_id,
      event_id: createEventsInvitationDto.event_id,
      message: createEventsInvitationDto.message,
    };
    return this.eventsInvitationsService.create(user, newInvitation);
  }

  @Get()
  @Roles('ADMIN', 'MENTOR', 'USER')
  @ApiCreatedResponse({ type: EventsInvitation })
  @ApiInternalServerErrorResponse({ description: '[ERROR MESSAGE]' })
  @ApiQuery({ type: EventsInvitation })
  @ApiOperation({
    summary: 'Fetch invitations with filters (limitations by role)',
    description: `Fetch invitations with filters.
        \n\n REQUIRED ROLES: **ADMIN | MENTOR | USER**
        \n\n **VALIDATIONS:**
        \n\n * role USER: Will only fetch invitations where they are \`invitee_id\`
        \n\n * role MENTOR: Can fetch invitations where they are \`inviter_id\` or \`invitee_id\`
        \n\n * role ADMIN: Can fetch any invitation.`,
  })
  @ApiBearerAuth()
  findAll(
    @GetUser() user: JwtPayload,
    @Query() filters: FilterEventsInvitationDto,
  ) {
    // Set filter "Date to" to the end of the day if exists
    const filterDateTo = filters.date_to ? new Date(filters.date_to) : null;
    if (filterDateTo) {
      filterDateTo.setUTCHours(23, 59, 59);
    }

    const searchFilters: FilterEventsInvitationDto = {
      inviter_id: filters.inviter_id ? +filters.inviter_id : null,
      invitee_id: filters.invitee_id ? +filters.invitee_id : null,
      event_id: filters.event_id ? +filters.event_id : null,
      date_from: filters.date_from ? new Date(filters.date_from) : null,
      date_to: filterDateTo ? new Date(filterDateTo.toISOString()) : null,
    };

    return this.eventsInvitationsService.findAll(user, searchFilters);
  }

  @Delete(':id')
  @Roles('ADMIN', 'MENTOR', 'USER')
  @ApiParam({ name: 'id', description: 'ID for the invitation to delete' })
  @ApiCreatedResponse({ type: EventsInvitation })
  @ApiInternalServerErrorResponse({ description: '[ERROR MESSAGE]' })
  @ApiNotFoundResponse({ description: 'Tere is no invitation with ID: {ID}' })
  @ApiUnauthorizedResponse({
    description: 'You are not authorized to delete this invitation.',
  })
  @ApiOperation({
    summary: 'Delete invitation',
    description: `Delete invitation.
        \n\n REQUIRED ROLES: **ADMIN | MENTOR | USER**
        \n\n **VALIDATIONS:**
        \n\n * role USER: Can delete invitations where they are \`invitee_id\`
        \n\n * role MENTOR: Can delete invitations where they are \`inviter_id\` or \`invitee_id\`
        \n\n * role ADMIN: Can delete any invitation.`,
  })
  @ApiBearerAuth()
  remove(@GetUser() user: JwtPayload, @Param('id') id: string) {
    return this.eventsInvitationsService.remove(user, +id);
  }
}
