import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EventsSubscriptionsStatus } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEventsSubscriptionStatusDto {
  @ApiProperty({
    description:
      'New subscription status [PENDING | IN_PROGRESS | APPROVED | REJECTED]',
  })
  @IsEnum(EventsSubscriptionsStatus)
  new_status: EventsSubscriptionsStatus;

  @ApiPropertyOptional({
    description: 'Optional message to show with the subscription status update',
  })
  @IsString()
  @IsOptional()
  message?: string;
}
