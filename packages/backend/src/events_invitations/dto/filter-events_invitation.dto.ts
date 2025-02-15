import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, IsDateString } from 'class-validator';

export class FilterEventsInvitationDto {
  @ApiPropertyOptional({
    description: 'Filter by inviter user ID',
    example: '1',
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  inviter_id?: number;

  @ApiPropertyOptional({
    description: 'Filter by invitee user ID',
    example: '1',
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  invitee_id?: number;

  @ApiPropertyOptional({
    description: 'Filter by event where the user is inviter or invitee',
    example: '1',
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  event_id?: number;

  @ApiPropertyOptional({
    description:
      '`created_at` greater than inserted date, ignoring time. `Y-m-d 00:00:00.000`',
    example: '2025-01-02',
  })
  @IsDateString()
  @IsOptional()
  date_from?: Date = null;

  @ApiPropertyOptional({
    description:
      '`created_at` lower than inserted date, ignoring time. `Y-m-d 23:59:59.999`',
    example: '2025-01-05',
  })
  @IsDateString()
  @IsOptional()
  date_to?: Date = null;
}
