import { PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { EventsTypes } from '@prisma/client';

export class FilterEventDto extends PartialType(CreateEventDto) {
  @IsString()
  @IsOptional()
  price?: string;

  @IsEnum(EventsTypes)
  type: EventsTypes = null;

  @IsBoolean()
  accept_subscriptions: boolean = null;

  @IsBoolean()
  @IsOptional()
  requires_confirmation?: boolean = null;
}
