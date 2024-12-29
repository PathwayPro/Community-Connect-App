import { IsInt } from 'class-validator';

export class UpdateEventsManagerDto {
  @IsInt()
  user_id: number;

  @IsInt()
  event_id: number;
}
