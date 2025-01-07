import { IsBoolean, IsInt } from 'class-validator';

export class CreateEventsManagerDto {
  @IsInt()
  user_id: number;

  @IsInt()
  event_id: number;

  @IsBoolean()
  is_speaker: boolean = false;
}
