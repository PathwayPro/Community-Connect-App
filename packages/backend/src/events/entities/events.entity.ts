import {
  IsInt,
  IsString,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsDate,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
/*
import { EventsDates } from './events-dates.entity'; // Import EventsDates entity
import { eventsSpeakers } from './events-speakers.entity'; // Import eventsSpeakers entity
import { EventsManagers } from './events-managers.entity'; // Import EventsManagers entity
import { EventsSubscriptions } from './events-subscriptions.entity'; // Import EventsSubscriptions entity
import { EventsInvitations } from './events-invitations.entity'; // Import EventsInvitations entity
*/
import { EventsTypes } from '@prisma/client';
import { EventsCategory } from 'src/events_categories/entities/events_category.entity';
import { ApiProperty } from '@nestjs/swagger';

export class Events {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  location: string | null;

  @ApiProperty()
  @IsOptional()
  @IsString()
  link: string | null;

  @ApiProperty()
  @IsOptional()
  @IsString()
  image: string | null;

  @ApiProperty()
  @IsBoolean()
  is_free: boolean;

  @ApiProperty()
  @IsEnum(EventsTypes)
  type: EventsTypes;

  @ApiProperty()
  @IsBoolean()
  requires_confirmation: boolean;

  @ApiProperty()
  @IsBoolean()
  accept_subscriptions: boolean;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  created_at: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  updated_at: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  start_date: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  end_date: Date;

  @ApiProperty()
  @ValidateNested()
  @Type(() => EventsCategory)
  category: EventsCategory;

  @ApiProperty()
  @IsInt()
  category_id: number;

  /*
  @ValidateNested({ each: true })
  @Type(() => EventsDates)
  dates: EventsDates[];

    @ValidateNested({ each: true })
  @Type(() => eventsSpeakers)
  speakers: eventsSpeakers[];

    @ValidateNested({ each: true })
  @Type(() => EventsManagers)
  managers: EventsManagers[];

    @ValidateNested({ each: true })
  @Type(() => EventsSubscriptions)
  subscriptions: EventsSubscriptions[];

    @ValidateNested({ each: true })
  @Type(() => EventsInvitations)
  invitations: EventsInvitations[];
  */
}
