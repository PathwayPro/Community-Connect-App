import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Roles, GetUser, Public, GetUserOptional } from 'src/auth/decorators';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { JwtPayload } from 'src/auth/util/JwtPayload.interface';
import { FilterEventDto } from './dto/filter-event.dto';
import { Events } from './entities/events.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Roles('ADMIN', 'MENTOR')
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({ type: CreateEventDto })
  @ApiCreatedResponse({ type: Events })
  @ApiInternalServerErrorResponse({
    description: 'Error creating the event: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Create events record',
    description:
      'Creates an event or throws Internal Server Error Exception. \n\n Using form-data for images (file) \n\n REQUIRED ROLES: **ADMIN | MENTOR**',
  })
  @ApiBearerAuth()
  create(
    @GetUser() user: JwtPayload,
    @Body() createEventDto: CreateEventDto,
    @UploadedFile() file: Express.Multer.File | null,
  ) {
    const newEvent: CreateEventDto = {
      title: createEventDto.title,
      description: createEventDto.description,
      location: createEventDto.location,
      link: createEventDto.link,
      category_id: +createEventDto.category_id,
      is_free:
        typeof createEventDto.is_free === 'string'
          ? createEventDto.is_free === 'true'
          : createEventDto.is_free,
      start_date: createEventDto.start_date,
      end_date: createEventDto.end_date,
      type: createEventDto.type || 'PUBLIC',
      requires_confirmation:
        typeof createEventDto.requires_confirmation === 'string'
          ? createEventDto.requires_confirmation === 'true'
          : createEventDto.requires_confirmation,
      accept_subscriptions:
        typeof createEventDto.accept_subscriptions === 'string'
          ? createEventDto.accept_subscriptions === 'true'
          : createEventDto.accept_subscriptions,
    };
    return this.eventsService.create(user, newEvent, file);
  }

  @Public()
  @Get()
  @ApiOkResponse({ type: Events, isArray: true })
  @ApiInternalServerErrorResponse({
    description: 'Error fetching events: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Fetch events',
    description: `
    Fetch events. 
    \n\n REQUIRED ROLES: **PUBLIC**
    \n\n OPTIONAL ROLES: **ADMIN**
    \n\n **VALIDATIONS:**
    \n\n * ONLY ADMIN USERS CAN FETCH "PRIVATE" EVENTS
    \n\n * IF THERE IS NO USER OR THE USER IS NOT ADMIN, "TYPE" FILTER IS FORCED TO "PUBLIC"
  `,
  })
  findAll(
    @GetUserOptional() user: JwtPayload | undefined,
    @Query() filters: FilterEventDto,
  ) {
    // Set filter "Date to" to the end of the day if exists
    const filterDateTo = filters.date_to ? new Date(filters.date_to) : null;
    if (filterDateTo) {
      filterDateTo.setUTCHours(23, 59, 59);
    }

    const searchFilters: FilterEventDto = {
      title: filters.title,
      description: filters.description,
      location: filters.location,
      category_id: +filters.category_id,
      is_free:
        typeof filters.is_free === 'string'
          ? filters.is_free === 'true'
          : filters.is_free,
      type: user?.roles === 'ADMIN' ? filters.type : 'PUBLIC', // USER: public events | MENTOR: Public events | ADMIN: All events
      requires_confirmation:
        typeof filters.requires_confirmation === 'string'
          ? filters.requires_confirmation === 'true'
          : filters.requires_confirmation,
      accept_subscriptions:
        typeof filters.accept_subscriptions === 'string'
          ? filters.accept_subscriptions === 'true'
          : filters.accept_subscriptions,
      start_date: filters.start_date ? new Date(filters.start_date) : null,
      //end_date: filters.end_date ? new Date(filters.end_date) : null,
      date_from: filters.date_from ? new Date(filters.date_from) : new Date(), // If not specified, fetch only future events
      date_to: filterDateTo ? new Date(filterDateTo.toISOString()) : null,
    };
    return this.eventsService.findAll(searchFilters);
  }

  @Public()
  @Get(':id')
  @ApiOkResponse({ type: Events })
  @ApiInternalServerErrorResponse({
    description: 'Error fetching event: [ERROR MESSAGE]',
  })
  @ApiNotFoundResponse({ description: 'There is no event with ID #[:id]' })
  @ApiUnauthorizedResponse({
    description:
      'If the event is "private" and the user is not logged, admin, invitee or manager',
  })
  @ApiOperation({
    summary: 'Fetch events by ID',
    description: `
    Fetch one event by ID. 
    \n\n REQUIRED ROLES: **PUBLIC**
    \n\n OPTIONAL ROLES: **ADMIN | MENTOR | USER**
    \n\n **VALIDATIONS:**
    \n\n * IF THE EVENT IS PUBLIC: Always return the event.
    \n\n * IF THE USER ROLE IS "ADMIN": Always return the event.
    \n\n * IF THE EVENT IS PRIVATE AND THE USER IS MANAGER: Returns the event.
    \n\n * IF THE EVENT IS PRIVATE AND THE USER IS INVITEE: Returns the event.
    \n\n * IF THE EVENT IS PRIVATE AND THE USER IS **NOT** ADMIN, INVITEE OR MAnAGER: Returns unauthorized.
  `,
  })
  @ApiParam({ name: 'id' })
  findOne(
    @GetUserOptional() user: JwtPayload | undefined,
    @Param('id') id: string,
  ) {
    return this.eventsService.findOne(+id, user);
  }

  @Roles('ADMIN', 'MENTOR')
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({ type: UpdateEventDto })
  @ApiOkResponse({ type: Events })
  @ApiNotFoundResponse({ description: 'There is no event with ID #[:id]' })
  @ApiInternalServerErrorResponse({
    description: 'Error updating event with ID #[:id]: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Update event',
    description: `
    Update event with ID {:id}
    \n\n Using form-data for images (file)
    \n\n REQUIRED ROLES: **ADMIN | MENTOR**
    \n\n **VALIDATIONS:**
    \n\n * ADMIN can update any event
    \n\n * MENTOR can update events where they are managers
  `,
  })
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @GetUser() user: JwtPayload,
    @Body() updateEventDto: UpdateEventDto,
    @UploadedFile() file: Express.Multer.File | null,
  ) {
    const updatedEvent: UpdateEventDto = {
      title: updateEventDto.title,
      description: updateEventDto.description,
      location: updateEventDto.location,
      link: updateEventDto.link,
      category_id: +updateEventDto.category_id,
      is_free:
        typeof updateEventDto.is_free === 'string'
          ? updateEventDto.is_free === 'true'
          : updateEventDto.is_free,
      start_date: updateEventDto.start_date,
      end_date: updateEventDto.end_date,
      type: updateEventDto.type,
      requires_confirmation:
        typeof updateEventDto.requires_confirmation === 'string'
          ? updateEventDto.requires_confirmation === 'true'
          : updateEventDto.requires_confirmation,
      accept_subscriptions:
        typeof updateEventDto.accept_subscriptions === 'string'
          ? updateEventDto.accept_subscriptions === 'true'
          : updateEventDto.accept_subscriptions,
    };
    return this.eventsService.update(+id, user, updatedEvent, file);
  }

  @Roles('ADMIN', 'MENTOR')
  @Put(':id')
  @ApiOkResponse({ type: Events })
  @ApiNotFoundResponse({
    description:
      'There is no event with ID #[:id] to update its subscriptions status',
  })
  @ApiInternalServerErrorResponse({ description: '[ERROR MESSAGE]' })
  @ApiOperation({
    summary: 'Toggle `accept_subscription` status',
    description: `
    Toggle \`accept_subscription\` status. 
    \n\n When \`accept_subscriptions\` is \`false\`, the event keeps showing in the lists, but it wont allow users to subscribe. 
    \n\n REQUIRED ROLES: **ADMIN | MENTOR**
    \n\n **VALIDATIONS:**
    \n\n * ADMIN can update any event
    \n\n * MENTOR can update events where they are managers
  `,
  })
  @ApiBearerAuth()
  toggleSubscription(
    @GetUser() user: JwtPayload,
    @Param('id') event_id: string,
  ) {
    return this.eventsService.toggleSubscription(user, +event_id);
  }

  @Roles('ADMIN', 'MENTOR')
  @Delete(':id')
  @ApiOkResponse({ type: Number })
  @ApiNotFoundResponse({
    description: 'There is no event with ID #[:id] to delete',
  })
  @ApiInternalServerErrorResponse({ description: '[ERROR MESSAGE]' })
  @ApiOperation({
    summary: 'Delete event',
    description:
      'Delete event with ID. \n\n REQUIRED ROLES: **ADMIN | MENTOR**',
  })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.eventsService.remove(+id);
  }
}
