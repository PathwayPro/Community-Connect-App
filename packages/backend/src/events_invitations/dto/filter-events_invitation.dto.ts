import { IsOptional, IsInt, IsDateString } from 'class-validator';

export class FilterEventsInvitationDto {
  @IsInt()
  @IsOptional()
  inviter_id?: number;

  @IsInt()
  @IsOptional()
  invitee_id?: number;

  @IsInt()
  @IsOptional()
  event_id?: number;

  @IsDateString()
  @IsOptional()
  date_from?: Date; // Format ISO 8601

  @IsDateString()
  @IsOptional()
  date_to?: Date; // Format ISO 8601
}
