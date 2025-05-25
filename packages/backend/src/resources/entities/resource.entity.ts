import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsNotEmpty,
  IsUrl,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ResourceType } from '@prisma/client';

export class Resource {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  details: string;

  @ApiProperty()
  @IsEnum(ResourceType)
  type: ResourceType;

  @IsString()
  @IsUrl()
  link: string;

  @ApiProperty()
  @IsNotEmpty()
  created_at: Date;

  @ApiProperty()
  @IsNotEmpty()
  updated_at: Date;

  @ApiProperty()
  @IsInt()
  user_id: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  file: string;
}
