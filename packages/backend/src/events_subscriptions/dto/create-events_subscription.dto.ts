import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventsSubscriptionDto {
  @ApiProperty({ description: 'ID of the event to subscribe', example: '1' })
  @IsInt()
  event_id: number;
}
