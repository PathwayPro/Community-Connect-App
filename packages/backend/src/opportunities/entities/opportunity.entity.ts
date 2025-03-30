import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNotEmpty, IsEnum, IsUrl } from 'class-validator';
import { WorkSettings } from '@prisma/client';

export class Opportunity {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty({ description: 'Job Role / Title' })
  @IsString()
  job: string;

  @ApiProperty({ description: 'Company name' })
  @IsString()
  company: string;

  @ApiProperty()
  @IsString()
  province: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  salary_range_id: number;

  @ApiProperty({ description: 'REMOTE | HYBRID | ON_SITE' })
  @IsEnum(WorkSettings)
  settings: WorkSettings;

  @ApiProperty()
  @IsString()
  @IsUrl()
  link_apply: string;

  @ApiProperty()
  @IsString()
  @IsUrl()
  link_post: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'For the company logo' })
  @IsString()
  image: string;

  @ApiProperty()
  @IsNotEmpty()
  created_at: Date;

  @ApiProperty()
  @IsNotEmpty()
  updated_at: Date;
}

export class OpportunityCard {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty({ description: 'Job Role / Title' })
  @IsString()
  job: string;

  @ApiProperty({ description: 'Company name' })
  @IsString()
  company: string;

  @ApiProperty()
  @IsString()
  province: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty({ description: 'REMOTE | HYBRID | ON_SITE' })
  @IsEnum(WorkSettings)
  settings: WorkSettings;

  @ApiProperty()
  @IsString()
  @IsUrl()
  link_apply: string;

  @ApiProperty({ description: 'For the company logo' })
  @IsString()
  image: string;

  @ApiProperty()
  @IsString()
  salary_range_id: number;
}
