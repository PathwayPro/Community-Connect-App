import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsInt,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { ResourceType } from '@prisma/client';

export class FilterResourceDto {
  @ApiPropertyOptional({
    description: 'Title containing this word / phrase',
    example: 'LIKE "%search%"',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Details containing this word / phrase',
    example: 'LIKE "%search%"',
  })
  @IsString()
  @IsOptional()
  details?: string;

  @ApiPropertyOptional({
    description: 'Type of resource [INVOICE | RESUME | BANNER]',
    example: 'RESUME',
  })
  @IsEnum(ResourceType)
  @IsOptional()
  type?: ResourceType;

  @ApiPropertyOptional({
    description: 'Resources from a specific user',
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

  @ApiPropertyOptional({
    description: 'File name containing this word / phrase',
    example: 'LIKE "%search%"',
  })
  @IsString()
  @IsOptional()
  file?: string;
}
