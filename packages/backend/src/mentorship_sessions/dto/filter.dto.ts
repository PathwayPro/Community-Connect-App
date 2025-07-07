import { IsInt, IsOptional, IsDate } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterMentorshipSessionsDto {
  @ApiPropertyOptional({
    description: 'Sessions after the inserted date',
    example: '2025-01-01T10:00:00Z',
  })
  @IsDate()
  @IsOptional()
  dateStartBefore?: Date;

  @ApiPropertyOptional({
    description: 'Sessions before the inserted date',
    example: '2025-01-01T10:00:00Z',
  })
  @IsDate()
  @IsOptional()
  dateStartAfter?: Date;

  @ApiPropertyOptional({
    description: 'Sessions with this mentor ID',
    example: '10',
  })
  @IsInt()
  @IsOptional()
  mentorId?: number;

  @ApiPropertyOptional({
    description: 'Sessions with this mentee ID',
    example: '10',
  })
  @IsInt()
  @IsOptional()
  menteeId?: number;
}

export class FilterMentorshipSessionRatingsDto {
  @ApiPropertyOptional({
    description: 'Ratings after the inserted date',
    example: '2025-01-01T10:00:00Z',
  })
  @IsDate()
  @IsOptional()
  dateStartBefore?: Date;

  @ApiPropertyOptional({
    description: 'Ratings before the inserted date',
    example: '2025-01-01T10:00:00Z',
  })
  @IsDate()
  @IsOptional()
  dateStartAfter?: Date;

  @ApiPropertyOptional({
    description: 'Ratings for this session ID',
    example: '10',
  })
  @IsInt()
  @IsOptional()
  sessionId?: number;

  @ApiPropertyOptional({
    description: 'Ratings with this mentor ID',
    example: '10',
  })
  @IsInt()
  @IsOptional()
  mentorId?: number;

  @ApiPropertyOptional({
    description: 'Ratings with this mentee ID',
    example: '10',
  })
  @IsInt()
  @IsOptional()
  menteeId?: number;
}
