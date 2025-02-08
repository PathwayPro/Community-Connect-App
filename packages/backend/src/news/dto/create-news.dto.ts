import {
  IsString,
  IsBoolean,
  IsOptional,
  IsUrl,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NewsType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';

export class CreateNewsDto {
  @ApiProperty({
    description: 'Title for the news',
    example: 'Title for the news',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'News full content',
    example: 'News full content',
  })
  @IsString()
  details: string;

  @ApiProperty({
    description: 'Type of news [FEATURED_POST | EDITORS_PICK]',
    example: 'EDITORS_PICK',
  })
  @IsEnum(NewsType)
  type: NewsType;

  @ApiProperty({ description: 'Source link', example: 'https://news.com' })
  @IsString()
  @IsUrl()
  link: string;

  @ApiPropertyOptional({
    description:
      'DEFAULT: FALSE | Published news are shown to all the users. If it is not published, only admins can see them.',
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
  published?: boolean = false;

  @ApiProperty({
    description: 'Uploaded file. Will use validation for news (OPTIONAL)',
  })
  @IsOptional()
  file?: Express.Multer.File;
}
