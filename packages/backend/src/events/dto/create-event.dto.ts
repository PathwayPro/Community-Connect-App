import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventsTypes } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsEnum,
  IsInt,
  IsUrl,
  IsDateString,
} from 'class-validator';

export class CreateEventDto {
  @ApiProperty({
    description: 'Title for the event',
    example: 'Title for the event',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Event description',
    example: 'Event full description',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Event location',
    example: 'Can be a place, address or platform (Zoom, Meet, etc)',
  })
  @IsString()
  location: string;

  @ApiProperty({
    description: 'Source link for the event',
    example: 'https://some-event.com',
  })
  @IsString()
  @IsOptional()
  @IsUrl()
  link?: string;

  @ApiProperty({
    description: 'Event category ID (from events_categories)',
    example: '1',
  })
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
    description: 'DEFAULT: TRUE | If is a free event or not.',
    example: true,
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
  is_free?: boolean = false;

  @ApiPropertyOptional({
    description:
      'Event start date and time. ISO 8601 format `YYYY-MM-DDTHH:mm:ss.sssZ`',
    example: '2025-01-21T10:30:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  start_date?: Date; // Format ISO 8601

  @ApiPropertyOptional({
    description:
      'Event end date and time. ISO 8601 format `YYYY-MM-DDTHH:mm:ss.sssZ`',
    example: '2025-01-21T10:30:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  end_date?: Date; // Format ISO 8601

  @ApiProperty({
    description: 'Uploaded file. Will use validation for events (OPTIONAL)',
  })
  @IsOptional()
  file?: Express.Multer.File;

  @ApiProperty({
    description:
      'DEFAULT: PUBLIC. ENUM [PUBLIC | PRIVATE]. To show or hide the event. Privete events are only showed with invitation',
  })
  @IsEnum(EventsTypes)
  @IsOptional()
  type?: EventsTypes = 'PUBLIC';

  @ApiProperty({
    description:
      'DEFAULT: FALSE. To validate if there will be an approval for subscription or if any subscription is approved directly.',
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
  requires_confirmation?: boolean = false;

  @ApiProperty({
    description:
      'DEFAULT: TRUE. To allow or prevent users to send subscriptions',
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
  accept_subscriptions?: boolean = true;
}
