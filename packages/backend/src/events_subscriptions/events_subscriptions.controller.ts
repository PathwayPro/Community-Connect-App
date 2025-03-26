import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Put,
  UseGuards,
  Query,
  Param,
} from '@nestjs/common';
import { EventsSubscriptionsService } from './events_subscriptions.service';
import { CreateEventsSubscriptionDto } from './dto/create-events_subscription.dto';
import { UpdateEventsSubscriptionStatusDto } from './dto/update-events_subscription_status.dto';
import { FilterEventsSubscriptionDto } from './dto/filter-events_subscription.dto';
import { Roles, GetUser } from 'src/auth/decorators';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { JwtPayload } from 'src/auth/util/JwtPayload.interface';
import { EventsSubscription } from './entities/events_subscription.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Events Subscriptions')
@Controller('events-subscriptions')
export class EventsSubscriptionsController {
  constructor(
    private readonly eventsSubscriptionsService: EventsSubscriptionsService,
  ) {}

  @Roles('ADMIN', 'MENTOR', 'USER')
  @Post()
  @ApiBody({ type: CreateEventsSubscriptionDto })
  @ApiCreatedResponse({ type: EventsSubscription })
  @ApiInternalServerErrorResponse({
    description: 'Error creating the subscription: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Create new subscription to an event',
    description: `Creates subscription.
        \n\n REQUIRED ROLES: **ADMIN | MENTOR | USER**
        \n\n **VALIDATIONS:**
        \n\n * If the event is NOT taking subscriptions (\`event.accept_subscriptions === false\`), throws \`BadRequestException\`
        \n\n * If the event is "PRIVATE" (\`event.type === "PRIVATE"\`), the user can subscribe with invitation only, otherwise throws \`BadRequestException\`
        \n\n * If the user is already subscribed to the event, throws \`BadRequestException\` `,
  })
  @ApiBearerAuth()
  create(
    @GetUser() user: JwtPayload,
    @Body() createEventsSubscriptionDto: CreateEventsSubscriptionDto,
  ) {
    const newSubscription: CreateEventsSubscriptionDto = {
      event_id: createEventsSubscriptionDto.event_id,
    };
    return this.eventsSubscriptionsService.create(newSubscription, user);
  }

  @Get()
  @Roles('ADMIN', 'MENTOR', 'USER')
  @ApiCreatedResponse({ type: EventsSubscription })
  @ApiInternalServerErrorResponse({
    description: 'Error fetching subscriptions: [ERROR MESSAGE]',
  })
  @ApiOperation({
    summary: 'Fetch subscriptions with filters (limitations by role)',
    description: `Fetch subscriptions with filters.
        \n\n REQUIRED ROLES: **ADMIN | MENTOR | USER**
        \n\n **VALIDATIONS:**
        \n\n * role USER: Will only fetch their own applications. Filter \`user_id\` will be ignored.
        \n\n * role MENTOR: Can fetch their own applications and those from the events they manage.
        \n\n * role ADMIN: Can fetch any application.`,
  })
  @ApiBearerAuth()
  findAll(
    @GetUser() user: JwtPayload,
    @Query() filters: FilterEventsSubscriptionDto,
  ) {
    // Set filter "Date to" to the end of the day if exists
    const filterDateTo = filters.date_to ? new Date(filters.date_to) : null;
    if (filterDateTo) {
      filterDateTo.setUTCHours(23, 59, 59);
    }

    const searchFilters: FilterEventsSubscriptionDto = {
      user_id:
        user.roles === 'USER'
          ? user.sub
          : filters.user_id
            ? +filters.user_id
            : null,
      event_id: filters.event_id ? +filters.event_id : null,
      status: filters.status,
      date_from: filters.date_from ? new Date(filters.date_from) : null,
      date_to: filterDateTo ? new Date(filterDateTo.toISOString()) : null,
    };

    return this.eventsSubscriptionsService.findAll(user, searchFilters);
  }

  @Put(':id')
  @Roles('ADMIN', 'MENTOR')
  @ApiParam({ name: 'id', description: 'ID for the subscription to update' })
  @ApiCreatedResponse({ type: EventsSubscription })
  @ApiInternalServerErrorResponse({
    description: 'There was an error updating the status for this subscription',
  })
  @ApiOperation({
    summary: 'Update subscriptions status',
    description: `Update subscriptions status.
        \n\n REQUIRED ROLES: **ADMIN | MENTOR**
        \n\n **VALIDATIONS:**
        \n\n * role ADMIN: Can update any subscription status.
        \n\n * role MENTOR: Can update subscription status for events they manage`,
  })
  @ApiBearerAuth()
  updateStatus(
    @GetUser() user: JwtPayload,
    @Param('id') id: string,
    @Body()
    updateEventsSubscriptionStatusDto: UpdateEventsSubscriptionStatusDto,
  ) {
    const updateSubscriptionStatus: UpdateEventsSubscriptionStatusDto = {
      new_status: updateEventsSubscriptionStatusDto.new_status,
      message: updateEventsSubscriptionStatusDto.message,
    };

    return this.eventsSubscriptionsService.updateStatus(
      user,
      updateSubscriptionStatus,
      +id,
    );
  }

  @Delete(':id')
  @Roles('ADMIN', 'MENTOR', 'USER')
  @ApiParam({ name: 'id', description: 'ID for the subscription to delete' })
  @ApiCreatedResponse({ type: EventsSubscription })
  @ApiInternalServerErrorResponse({
    description: 'There was an error updating the status for this subscription',
  })
  @ApiNotFoundResponse({ description: 'Tere is no subscription with ID: {ID}' })
  @ApiUnauthorizedResponse({
    description: 'You are not authorized to delete this subscription.',
  })
  @ApiOperation({
    summary: 'Delete subscription',
    description: `Delete subscription.
        \n\n REQUIRED ROLES: **ADMIN | MENTOR | USER**
        \n\n **VALIDATIONS:**
        \n\n * role ADMIN: Can delete any subscription.
        \n\n * role MENTOR: Can delete their subscriptions and those for the events they manage.
        \n\n * role USER: Can delete their own subscriptions.`,
  })
  @ApiBearerAuth()
  remove(@GetUser() user: JwtPayload, @Param('id') id: string) {
    return this.eventsSubscriptionsService.remove(user, +id);
  }
}
