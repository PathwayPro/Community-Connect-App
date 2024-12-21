import { IsInt } from 'class-validator';

export class DeleteEventsSubscriptionDto {
  @IsInt()
  user_id: number;

  @IsInt()
  event_id: number;
}
