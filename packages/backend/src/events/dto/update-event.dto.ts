import { PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';
import { IsBoolean, IsDecimal, IsEnum, IsOptional } from 'class-validator';
import { EventsTypes } from '@prisma/client';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @IsDecimal()
  @IsOptional()
  price?: number = null;

  @IsEnum(EventsTypes)
  type: EventsTypes = null;

  @IsBoolean()
  accept_subscriptions: boolean = null;

  @IsBoolean()
  @IsOptional()
  requires_confirmation?: boolean = null;
}
