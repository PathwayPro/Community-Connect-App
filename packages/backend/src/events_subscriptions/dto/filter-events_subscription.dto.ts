import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator';
import { EventsSubscriptionsStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class FilterEventsSubscriptionDto {
  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  user_id?: number = null;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  event_id?: number = null;

  @ApiPropertyOptional({
    description:
      'ENUM FROM EventsSubscriptionsStatus [PENDING | IN_PROGRESS | APPROVED | REJECTED]',
  })
  @IsEnum(EventsSubscriptionsStatus)
  @IsOptional()
  status?: EventsSubscriptionsStatus = null;

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
