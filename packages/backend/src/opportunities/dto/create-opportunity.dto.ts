import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsEnum, IsUrl, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { WorkSettings } from '@prisma/client';

export class CreateOpportunityDto {
  @ApiProperty({ description: 'Job Role / Title' })
  @IsString()
  job: string;

  @ApiProperty({ description: 'Company name' })
  @IsString()
  company: string;

  @ApiProperty({ description: 'Province location' })
  @IsString()
  province: string;

  @ApiProperty({ description: 'City location' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'ID of the salary range' })
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  salary_range_id: number;

  @ApiProperty({ description: 'ENUM: REMOTE | HYBRID | ON_SITE' })
  @IsEnum(WorkSettings)
  settings: WorkSettings;

  @ApiProperty({ description: 'Link to apply directly' })
  @IsString()
  @IsUrl()
  link_apply: string;

  @ApiProperty({ description: 'Link to the original job post' })
  @IsString()
  @IsUrl()
  link_post: string;

  @ApiProperty({ description: 'Job description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Experience level' })
  @IsString()
  experience: string;

  @ApiPropertyOptional({
    description: 'Uploaded file. Will use validation for logos (OPTIONAL)',
  })
  @IsOptional()
  file?: Express.Multer.File;
}
