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
import { Decimal } from '@prisma/client/runtime/library'; // Import Decimal
/*
import { EventsDates } from './events-dates.entity'; // Import EventsDates entity
import { eventsSpeakers } from './events-speakers.entity'; // Import eventsSpeakers entity
import { EventsManagers } from './events-managers.entity'; // Import EventsManagers entity
import { EventsSubscriptions } from './events-subscriptions.entity'; // Import EventsSubscriptions entity
import { EventsInvitations } from './events-invitations.entity'; // Import EventsInvitations entity
*/
import { EventsTypes } from '@prisma/client';
import { EventsCategory } from 'src/events_categories/entities/events_category.entity';

export class Events {
  @IsInt()
  id: number;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  subtitle: string | null;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  location: string | null;

  @IsOptional()
  @IsString()
  link: string | null;

  @IsOptional()
  @IsString()
  image: string | null;

  @Type(() => Decimal) // Transform to Decimal
  price: Decimal;

  @IsEnum(EventsTypes)
  type: EventsTypes;

  @IsBoolean()
  requires_confirmation: boolean;

  @IsBoolean()
  accept_subscriptions: boolean;

  @IsDate()
  @Type(() => Date)
  created_at: Date;

  @IsDate()
  @Type(() => Date)
  updated_at: Date;

  @ValidateNested()
  @Type(() => EventsCategory)
  category: EventsCategory;

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
