import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { EventsTypes } from '@prisma/client';
import { Transform, Type } from 'class-transformer';

export class FilterEventDto {
  @ApiPropertyOptional({
    description: 'Title for the event | Filter `LIKE %{string}%`',
  })
  @IsOptional()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Event description | Filter `LIKE %{string}%`',
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'Event location | Filter `LIKE %{string}%`',
  })
  @IsOptional()
  @IsString()
  location: string;

  @ApiPropertyOptional({
    description:
      'Event category ID (from events_categories) | Filter `event.category_id = {int}`',
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Transform(({ value }) => {
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
      return value;
    }
    return parsedValue;
  })
  category_id: number;

  @ApiPropertyOptional({
    description:
      'If it is a free event or not. | Filter `event.is_free = {boolean}`',
  })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return value;
  })
  is_free: boolean;

  @ApiPropertyOptional({
    description:
      '`EventType` enum [PUBLIC | PRIVATE]. If not admin role, it will always be "PUBLIC" | Filter `event.type = {boolean}` ',
  })
  @IsEnum(EventsTypes)
  @IsOptional()
  type: EventsTypes;

  @ApiPropertyOptional({
    description:
      'To validate if there will be an approval for subscription or if any subscription is approved directly. | Filter `event.requires_confirmation = {boolean}`',
  })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return value;
  })
  requires_confirmation: boolean;

  @ApiPropertyOptional({
    description:
      'To allow or prevent users to send subscriptions | Filter `event.accept_subscription = {boolean}`',
  })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return value;
  })
  accept_subscriptions: boolean;

  @ApiPropertyOptional({
    description:
      'Events for a specific date | format `YYYY-MM-DD` | Filter `event.start_date BETWEEN "{date}T00:00:00.000" AND "{date}T23:59:59.999"`',
    example: '2025-01-02',
  })
  @IsDateString()
  @IsOptional()
  start_date: Date;

  @ApiPropertyOptional({
    description:
      'Events coming AFTER a specific date | format `YYYY-MM-DD` | Filter `event.start_date >= "{date}T00:00:00.000"`',
    example: '2025-01-02',
  })
  @IsDateString()
  @IsOptional()
  date_from: Date;

  @ApiPropertyOptional({
    description:
      'Events coming BEFORE a specific date | format `YYYY-MM-DD` | Filter `event.start_date <= "{date}T23:59:59.999"`',
    example: '2025-01-05',
  })
  @IsDateString()
  @IsOptional()
  date_to?: Date;
}
