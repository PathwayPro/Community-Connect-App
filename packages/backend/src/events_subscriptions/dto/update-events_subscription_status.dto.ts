import { IsInt, IsOptional, IsString } from 'class-validator';
import { CreateEventsSubscriptionDto } from './create-events_subscription.dto';
import { EventsSubscriptionsStatus } from '@prisma/client';

export class UpdateEventsSubscriptionStatusDto extends CreateEventsSubscriptionDto {
  @IsString()
  new_status: EventsSubscriptionsStatus;

  @IsString()
  @IsOptional()
  message?: string;

  @IsInt()
  updated_by: number;
}
