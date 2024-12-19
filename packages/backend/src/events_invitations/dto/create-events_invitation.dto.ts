import { IsString, IsInt } from 'class-validator';

export class CreateEventsInvitationDto {
  @IsInt()
  inviter_id: number;

  @IsInt()
  invitee_id: number;

  @IsInt()
  event_id: number;

  @IsString()
  message: string;
}
