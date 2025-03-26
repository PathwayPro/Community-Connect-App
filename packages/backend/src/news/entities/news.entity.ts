import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsInt,
  IsNotEmpty,
  IsEnum,
  IsUrl,
} from 'class-validator';
import { NewsType } from '@prisma/client';

export class News {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  details: string;

  @ApiProperty()
  @IsEnum(NewsType)
  type: NewsType;

  @IsString()
  @IsUrl()
  link: string;

  @ApiProperty()
  @IsBoolean()
  published: boolean;

  @ApiProperty()
  @IsNotEmpty()
  created_at: Date;

  @ApiProperty()
  @IsNotEmpty()
  updated_at: Date;

  @ApiProperty()
  @IsInt()
  user_id: number;
}
