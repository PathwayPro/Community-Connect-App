import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt } from 'class-validator';

export class CreateEventsInvitationDto {
  @ApiProperty({ description: 'ID of the user to invite', example: '1' })
  @IsInt()
  invitee_id: number;

  @ApiProperty({
    description: 'ID of the event you are inviting to',
    example: '1',
  })
  @IsInt()
  event_id: number;

  @ApiPropertyOptional({
    description: 'Optional message for the invitation',
    example: 'Subscribe to this event to get info about upcoming sessions',
  })
  @IsString()
  message: string;
}
