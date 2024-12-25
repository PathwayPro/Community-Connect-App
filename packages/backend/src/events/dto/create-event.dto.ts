import { EventsTypes } from '@prisma/client';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsEnum,
  IsDecimal,
  IsInt,
  ValidateIf,
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

  @IsDecimal()
  @IsOptional()
  @ValidateIf((o) => o.price !== undefined)
  price?: number = 0.0;

  @IsEnum(EventsTypes)
  type: EventsTypes = 'PUBLIC';

  @IsBoolean()
  requires_confirmation: boolean = false;

  @IsBoolean()
  accept_subscriptions: boolean = true;
}
