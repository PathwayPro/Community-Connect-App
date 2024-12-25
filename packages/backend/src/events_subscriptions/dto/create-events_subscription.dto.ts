import { IsInt, IsOptional, IsString } from 'class-validator';
import { EventsSubscriptionsStatus } from '@prisma/client';

export class CreateEventsSubscriptionDto {
  @IsInt()
  user_id: number;

  @IsInt()
  event_id: number;

  @IsString()
  @IsOptional()
  status?: EventsSubscriptionsStatus = 'PENDING';
}
