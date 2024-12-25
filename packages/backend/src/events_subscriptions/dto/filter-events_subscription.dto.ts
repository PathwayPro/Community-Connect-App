import { PartialType } from '@nestjs/swagger';
import { CreateEventsSubscriptionDto } from './create-events_subscription.dto';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { EventsSubscriptionsStatus } from '@prisma/client';

export class FilterEventsSubscriptionDto extends PartialType(
  CreateEventsSubscriptionDto,
) {
  @IsInt()
  @IsOptional()
  user_id?: number = null;

  @IsInt()
  @IsOptional()
  event_id?: number = null;

  @IsString()
  @IsOptional()
  status?: EventsSubscriptionsStatus = null;
}
