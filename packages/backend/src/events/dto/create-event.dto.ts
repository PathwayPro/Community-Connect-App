import { EventsTypes } from '@prisma/client';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsEnum,
  IsInt,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  description: string;

  @IsInt()
  category_id: number;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  link?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  price?: string;

  @IsEnum(EventsTypes)
  type: EventsTypes = 'PUBLIC';

  @IsBoolean()
  requires_confirmation: boolean = false;

  @IsBoolean()
  accept_subscriptions: boolean = true;

  @IsString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  start_time?: string;

  @IsString()
  @IsOptional()
  end_time?: string;
}
