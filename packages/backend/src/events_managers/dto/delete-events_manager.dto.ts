import { IsInt } from 'class-validator';

export class DeleteEventsManagerDto {
  @IsInt()
  user_id: number;

  @IsInt()
  event_id: number;
}
