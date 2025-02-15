import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsNotEmpty, IsString } from 'class-validator';

export class EventsInvitation {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  inviter_id: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  invitee_id: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  event_id: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  message: string;

  @ApiProperty()
  @IsNotEmpty()
  created_at: Date;
}
