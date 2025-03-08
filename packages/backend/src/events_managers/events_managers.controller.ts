import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Put,
  UseGuards,
  Param,
  Query,
} from '@nestjs/common';
import { EventsManagersService } from './events_managers.service';
import { CreateEventsManagerDto } from './dto/create-events_manager.dto';
import { FilterEventsManagerDto } from './dto/filter-events_manager.dto';
import { Roles, GetUser } from 'src/auth/decorators';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { JwtPayload } from 'src/auth/util/JwtPayload.interface';
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
import { EventsManager } from './entities/events_manager.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Events Managers')
@Controller('events-managers')
export class EventsManagersController {
  constructor(private readonly eventsManagersService: EventsManagersService) {}

  @Post()
  @Roles('ADMIN', 'MENTOR')
  @ApiBody({ type: CreateEventsManagerDto })
  @ApiCreatedResponse({ type: EventsManager })
  @ApiInternalServerErrorResponse({
    description: 'Error creating manager: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Create new event manager',
    description: `Creates event manager.
            \n\n REQUIRED ROLES: **ADMIN | MENTOR**
            \n\n **VALIDATIONS:**
            \n\n * If the user is an ADMIN, they can add anyone.
            \n\n * If the user is a MENTOR, they can add to events they manage. `,
  })
  @ApiBearerAuth()
  create(
    @GetUser() user: JwtPayload,
    @Body() createEventsManagerDto: CreateEventsManagerDto,
  ) {
    const newManager: CreateEventsManagerDto = {
      user_id: createEventsManagerDto.user_id
        ? createEventsManagerDto.user_id
        : user.sub,
      event_id: createEventsManagerDto.event_id,
      is_speaker: createEventsManagerDto.is_speaker,
    };
    return this.eventsManagersService.create(user, newManager, false);
  }

  @Get()
  @Roles('ADMIN', 'MENTOR')
  @ApiCreatedResponse({ type: EventsManager })
  @ApiInternalServerErrorResponse({ description: '[ERROR MESSAGE]' })
  @ApiQuery({ type: FilterEventsManagerDto })
  @ApiOperation({
    summary: 'Fetch managers with filters (limitations by role)',
    description: `Fetch invitations with filters. \n\n REQUIRED ROLES: **ADMIN | MENTOR**`,
  })
  @ApiBearerAuth()
  findAll(
    @GetUser() user: JwtPayload,
    @Query() filters: FilterEventsManagerDto,
  ) {
    const searchFilters: FilterEventsManagerDto = {
      user_id: filters.user_id ? +filters.user_id : null,
      event_id: filters.event_id ? +filters.event_id : null,
      is_speaker:
        typeof filters.is_speaker === 'string'
          ? filters.is_speaker === 'true'
          : filters.is_speaker,
    };

    return this.eventsManagersService.findAll(user, searchFilters);
  }

  @Put(':id')
  @Roles('ADMIN', 'MENTOR')
  @ApiParam({
    name: 'id',
    description: 'ID for the event_manager to toggle is_speaker status',
  })
  @ApiCreatedResponse({ type: EventsManager })
  @ApiInternalServerErrorResponse({ description: '[ERROR MESSAGE]' })
  @ApiNotFoundResponse({
    description: 'Tere is no event manager with ID: {ID}',
  })
  @ApiUnauthorizedResponse({
    description: 'You are not authorized to delete this manager.',
  })
  @ApiOperation({
    summary: 'Toggle is_speaker status',
    description: `Toggle is_speaker status for a manager.
      \n\n REQUIRED ROLES: **ADMIN | MENTOR**
      \n\n **VALIDATIONS:**
      \n\n * role MENTOR: Can toggle the status in events they manage.
      \n\n * role ADMIN: Can toggle the status in any event.`,
  })
  @ApiBearerAuth()
  switchIsSpeaker(@GetUser() user: JwtPayload, @Param() id: string) {
    return this.eventsManagersService.toggleIsSpeaker(user, +id);
  }

  @Delete(':id')
  @Roles('ADMIN', 'MENTOR')
  @ApiParam({ name: 'id', description: 'ID for the event_manager to delete' })
  @ApiCreatedResponse({ type: EventsManager })
  @ApiInternalServerErrorResponse({ description: '[ERROR MESSAGE]' })
  @ApiNotFoundResponse({
    description: 'Tere is no event manager with ID: {ID}',
  })
  @ApiUnauthorizedResponse({
    description: 'You are not authorized to delete this manager.',
  })
  @ApiOperation({
    summary: 'Delete manager',
    description: `Delete manager.
      \n\n REQUIRED ROLES: **ADMIN | MENTOR**
      \n\n **VALIDATIONS:**
      \n\n * role MENTOR: Can delete managers from events they currently manage.
      \n\n * role ADMIN: Can delete any manager.`,
  })
  @ApiBearerAuth()
  remove(@GetUser() user: JwtPayload, @Param() id: string) {
    return this.eventsManagersService.remove(user, +id);
  }
}
