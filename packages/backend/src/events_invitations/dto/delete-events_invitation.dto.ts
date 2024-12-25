import { IsInt } from 'class-validator';

export class DeleteEventsInvitationDto {
  @IsInt()
  inviter_id: number;

  @IsInt()
  invitee_id: number;

  @IsInt()
  event_id: number;
}
