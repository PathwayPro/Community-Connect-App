import { IsString, IsInt, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNewsDto {
  @ApiProperty({
    description: 'Title for the news',
    example: 'Title for the news',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Subitle for the news',
    example: 'Subitle for the news',
  })
  @IsString()
  @IsOptional()
  subtitle?: string;

  @ApiPropertyOptional({
    description: 'Keywords or phrases sepparated by ","',
    example: 'keyword1,keyword two, etc',
  })
  @IsString()
  @IsOptional()
  keywords?: string;

  @ApiProperty({
    description: 'News full content',
    example: 'News full content',
  })
  @IsString()
  content: string;

  @ApiPropertyOptional({
    description:
      'DEFAULT: FALSE | Published news are shown to all the users. If it is not published, only admins can see them.',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  published?: boolean = false;

  @IsInt()
  @IsOptional()
  user_id?: number;
}
