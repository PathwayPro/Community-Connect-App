import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventsSubscriptionsStatus } from '@prisma/client';
import {
  IsInt,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Events } from 'src/events/entities/events.entity';
import { User } from 'src/users/entities';

export class EventsSubscription {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  event_id: number;

  @ApiProperty({
    description:
      'ENUM FROM EventsSubscriptionsStatus [PENDING | IN_PROGRESS | APPROVED | REJECTED]',
  })
  @IsEnum(EventsSubscriptionsStatus)
  @IsNotEmpty()
  status: EventsSubscriptionsStatus;

  @ApiProperty()
  @IsNotEmpty()
  created_at: Date;

  @ApiProperty()
  @IsNotEmpty()
  updated_at: Date;

  @ApiPropertyOptional({ description: 'Can include `user` information' })
  @IsOptional()
  user?: User;

  @ApiPropertyOptional({ description: 'Can include `event` information' })
  @IsOptional()
  event?: Events;

  @ApiPropertyOptional({
    description: 'Can include `subscription_updates` information',
  })
  @IsOptional()
  updates?: EventsSubscriptionsUpdates[];
}

export class EventsSubscriptionsUpdates {
  @ApiProperty({ description: 'ID of the update' })
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ description: 'ID of the updated subscription' })
  @IsInt()
  @IsNotEmpty()
  subscription_id: number;

  @ApiProperty({
    description:
      'Status before updating [PENDING | IN_PROGRESS | APPROVED | REJECTED]',
  })
  @IsEnum(EventsSubscriptionsStatus)
  @IsNotEmpty()
  prev_status: EventsSubscriptionsStatus;

  @ApiProperty({
    description:
      'Status after updating [PENDING | IN_PROGRESS | APPROVED | REJECTED]',
  })
  @IsEnum(EventsSubscriptionsStatus)
  @IsNotEmpty()
  new_status: EventsSubscriptionsStatus;

  @ApiPropertyOptional({
    description: 'The message updating a subscription is optional',
  })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty()
  @IsNotEmpty()
  created_at: Date;
}
