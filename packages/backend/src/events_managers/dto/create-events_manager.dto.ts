import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional } from 'class-validator';

export class CreateEventsManagerDto {
  @ApiPropertyOptional({
    description: 'ID of the new manager user',
    example: '1',
  })
  @IsInt()
  @IsOptional()
  user_id?: number;

  @ApiProperty({ description: 'ID of the event to manage', example: '1' })
  @IsInt()
  event_id: number;

  @ApiPropertyOptional({
    description: 'DEFAULT: FALSE | If the manager is also a speaker.',
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
  is_speaker: boolean = false;
}
