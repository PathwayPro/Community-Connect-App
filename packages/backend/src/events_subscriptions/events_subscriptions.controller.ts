import { Controller, Get, Post, Body, Delete, Put } from '@nestjs/common';
import { EventsSubscriptionsService } from './events_subscriptions.service';
import { CreateEventsSubscriptionDto } from './dto/create-events_subscription.dto';
import { UpdateEventsSubscriptionStatusDto } from './dto/update-events_subscription_status.dto';
import { FilterEventsSubscriptionDto } from './dto/filter-events_subscription.dto';
import { DeleteEventsSubscriptionDto } from './dto/delete-events_subscription.dto';
import { Public } from 'src/auth/decorators';

@Public()
@Controller('events-subscriptions')
export class EventsSubscriptionsController {
  constructor(
    private readonly eventsSubscriptionsService: EventsSubscriptionsService,
  ) {}

  @Post()
  create(@Body() createEventsSubscriptionDto: CreateEventsSubscriptionDto) {
    const newSubscription: CreateEventsSubscriptionDto = {
      user_id: createEventsSubscriptionDto.user_id,
      event_id: createEventsSubscriptionDto.event_id,
      status: createEventsSubscriptionDto.status || 'PENDING',
    };
    return this.eventsSubscriptionsService.create(newSubscription);
  }

  @Get()
  findAll(@Body() filters: FilterEventsSubscriptionDto) {
    const searchFilters: FilterEventsSubscriptionDto = {
      user_id: filters.user_id,
      event_id: filters.event_id,
      status: filters.status,
    };

    return this.eventsSubscriptionsService.findAll(searchFilters);
  }

  @Put()
  updateStatus(
    @Body()
    updateEventsSubscriptionStatusDto: UpdateEventsSubscriptionStatusDto,
  ) {
    const updateSubscriptionStatus: UpdateEventsSubscriptionStatusDto = {
      user_id: updateEventsSubscriptionStatusDto.user_id,
      event_id: updateEventsSubscriptionStatusDto.event_id,
      new_status: updateEventsSubscriptionStatusDto.new_status,
      message: updateEventsSubscriptionStatusDto.message,
      updated_by: updateEventsSubscriptionStatusDto.updated_by,
    };

    return this.eventsSubscriptionsService.updateStatus(
      updateSubscriptionStatus,
    );
  }

  @Delete()
  remove(@Body() deleteEventsSubscriptionDto: DeleteEventsSubscriptionDto) {
    const deleteSubscription: DeleteEventsSubscriptionDto = {
      user_id: deleteEventsSubscriptionDto.user_id,
      event_id: deleteEventsSubscriptionDto.event_id,
    };
    return this.eventsSubscriptionsService.remove(deleteSubscription);
  }
}
