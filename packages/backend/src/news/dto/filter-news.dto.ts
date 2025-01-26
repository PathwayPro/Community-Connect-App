import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterNewsDto {
  @ApiPropertyOptional({
    description: 'Title containing this word / phrase',
    example: 'LIKE "%search%"',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Subitle containing this word / phrase',
    example: 'LIKE "%search%"',
  })
  @IsString()
  @IsOptional()
  subtitle?: string;

  @ApiPropertyOptional({
    description: 'Keyword list containing this word / phrase',
    example: 'LIKE "%search%"',
  })
  @IsString()
  @IsOptional()
  keywords?: string;

  @ApiPropertyOptional({
    description: 'Content containing this word / phrase',
    example: 'LIKE "%search%"',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description: 'Published or hidden news (only ADMIN roles). Default: true',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @Transform(({ value }) => value === 'true')
  published?: boolean = true;

  @ApiPropertyOptional({
    description: 'News from a specific user',
    example: 10,
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  user_id?: number;

  @ApiPropertyOptional({
    description:
      '`created_at` greater than inserted date, ignoring time. `Y-m-d 00:00:00.000`',
    example: '2025-01-02',
  })
  @IsDateString()
  @IsOptional()
  date_from?: Date; // Format ISO 8601

  @ApiPropertyOptional({
    description:
      '`created_at` lower than inserted date, ignoring time. `Y-m-d 59:59:59.999`',
    example: '2025-01-05',
  })
  @IsDateString()
  @IsOptional()
  date_to?: Date; // Format ISO 8601
}
