import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { EventsSubscriptionsService } from './events_subscriptions.service';
import { CreateEventsSubscriptionDto } from './dto/create-events_subscription.dto';
import { UpdateEventsSubscriptionStatusDto } from './dto/update-events_subscription_status.dto';
import { FilterEventsSubscriptionDto } from './dto/filter-events_subscription.dto';
import { DeleteEventsSubscriptionDto } from './dto/delete-events_subscription.dto';
import { Roles, GetUser } from 'src/auth/decorators';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { JwtPayload } from 'src/auth/util/JwtPayload.interface';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('events-subscriptions')
export class EventsSubscriptionsController {
  constructor(
    private readonly eventsSubscriptionsService: EventsSubscriptionsService,
  ) {}

  @Post()
  @Roles('ADMIN', 'MENTOR', 'USER')
  create(
    @GetUser() user: JwtPayload,
    @Body() createEventsSubscriptionDto: CreateEventsSubscriptionDto,
  ) {
    const newSubscription: CreateEventsSubscriptionDto = {
      user_id: user.sub,
      event_id: createEventsSubscriptionDto.event_id,
    };
    return this.eventsSubscriptionsService.create(newSubscription);
  }

  @Get()
  @Roles('ADMIN', 'MENTOR', 'USER')
  findAll(
    @GetUser() user: JwtPayload,
    @Body() filters: FilterEventsSubscriptionDto,
  ) {
    const searchFilters: FilterEventsSubscriptionDto = {
      user_id: user.roles === 'USER' ? user.sub : filters.user_id,
      event_id: filters.event_id,
      status: filters.status,
    };

    return this.eventsSubscriptionsService.findAll(user, searchFilters);
  }

  @Put()
  @Roles('ADMIN', 'MENTOR')
  updateStatus(
    @GetUser() user: JwtPayload,
    @Body()
    updateEventsSubscriptionStatusDto: UpdateEventsSubscriptionStatusDto,
  ) {
    const updateSubscriptionStatus: UpdateEventsSubscriptionStatusDto = {
      user_id: updateEventsSubscriptionStatusDto.user_id,
      event_id: updateEventsSubscriptionStatusDto.event_id,
      new_status: updateEventsSubscriptionStatusDto.new_status,
      message: updateEventsSubscriptionStatusDto.message,
      updated_by: user.sub,
    };

    return this.eventsSubscriptionsService.updateStatus(
      user,
      updateSubscriptionStatus,
    );
  }

  @Delete()
  @Roles('ADMIN', 'MENTOR', 'USER')
  remove(
    @GetUser() user: JwtPayload,
    @Body() deleteEventsSubscriptionDto: DeleteEventsSubscriptionDto,
  ) {
    const deleteSubscription: DeleteEventsSubscriptionDto = {
      user_id:
        user.roles === 'USER' ? user.sub : deleteEventsSubscriptionDto.user_id,
      event_id: deleteEventsSubscriptionDto.event_id,
    };
    return this.eventsSubscriptionsService.remove(user, deleteSubscription);
  }
}
