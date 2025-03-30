import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsEnum,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { WorkSettings } from '@prisma/client';

export class FilterOpportunityDto {
  @ApiPropertyOptional({
    description: 'Job Role / Title containing this word / phrase',
    example: 'LIKE "%search%"',
  })
  @IsOptional()
  @IsString()
  job?: string;

  @ApiPropertyOptional({
    description: 'Company name containing this word / phrase',
    example: 'LIKE "%search%"',
  })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({
    description: 'Opportunities for this specific province',
    example: 'province = "search"',
  })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional({
    description: 'Opportunities for this specific city',
    example: 'city = "search"',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'Opportunities for this specific salary range',
    example: 'salary_range_id = search',
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  salary_range_id?: number;

  @ApiPropertyOptional({
    description: 'Opportunities for this specific settings',
    example: 'settings = "REMOTE"',
  })
  @IsOptional()
  @IsEnum(WorkSettings)
  settings?: WorkSettings;

  @ApiPropertyOptional({
    description: 'Job description containing this word / phrase',
    example: 'LIKE "%search%"',
  })
  @IsOptional()
  @IsString()
  description?: string;

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
