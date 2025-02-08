import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';
import { IsBoolean, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { EventsTypes } from '@prisma/client';

export class FilterEventDto extends PartialType(CreateEventDto) {
  @IsEnum(EventsTypes)
  type: EventsTypes = null;

  @IsBoolean()
  accept_subscriptions: boolean = null;

  @IsBoolean()
  @IsOptional()
  requires_confirmation?: boolean = null;

  @ApiPropertyOptional({
    description:
      '`start_date` greater than inserted date, ignoring time. `YYYY-MM-DD 00:00:00.000`',
    example: '2025-01-02',
  })
  @IsDateString()
  @IsOptional()
  date_from?: Date; // Format ISO 8601

  @ApiPropertyOptional({
    description:
      '`start_date` lower than inserted date, ignoring time. `YYYY-MM-DD 59:59:59.999`',
    example: '2025-01-05',
  })
  @IsDateString()
  @IsOptional()
  date_to?: Date; // Format ISO 8601
}
