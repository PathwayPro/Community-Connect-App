import { Transform, Type } from 'class-transformer';
import { IsInt, IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterEventsManagerDto {
  @ApiPropertyOptional({ description: 'ID of the manager user', example: '1' })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  user_id?: number;

  @ApiPropertyOptional({ description: 'ID of the managed event', example: '1' })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  event_id?: number;

  @ApiPropertyOptional({
    description: 'If the manager is also a speaker.',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @Transform(({ value }) => value === 'true')
  is_speaker?: boolean = null;
}
