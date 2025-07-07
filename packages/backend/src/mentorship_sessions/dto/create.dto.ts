import { IsString, IsOptional, IsUrl, IsInt, IsDate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMentorshipSessionDto {
  @ApiProperty({ description: 'User ID of the mentee', example: '10' })
  @IsInt()
  menteeId: number;

  @ApiProperty({ description: 'Call link', example: 'https://meet.google.com' })
  @IsString()
  @IsUrl()
  link: string;

  @ApiProperty({
    description: 'Start date and time',
    example: '2025-01-01T10:00:00Z',
  })
  @IsDate()
  dateStart: Date;

  @ApiProperty({
    description: 'End date and time',
    example: '2025-01-01T10:00:00Z',
  })
  @IsDate()
  dateEnd: Date;

  @ApiPropertyOptional({
    description: 'Description',
    example: 'Description of the session',
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class CreateSessionMenteeNoteDto {
  @ApiProperty({
    description: 'ID for the session to take notes',
    example: '10',
  })
  @IsInt()
  sessionId: number;

  @ApiProperty({
    description: 'Mentee notes for the session',
    example: 'Mentee note',
  })
  @IsString()
  note: string;
}

export class CreateSessionRatingDto {
  @ApiProperty({ description: 'ID for the rated session', example: '10' })
  @IsInt()
  sessionId: number;

  @ApiProperty({ description: 'Mentor rating for the mentee', example: 5 })
  @IsInt()
  rate: number;

  @ApiPropertyOptional({
    description: 'Mentor notes for the mentee',
    example: 'Mentor note',
  })
  @IsString()
  @IsOptional()
  note?: string;
}

export class CreateMatchingDto {
  @ApiProperty({
    description: 'ID of the mentor to match with a mentee',
    example: '10',
  })
  @IsInt()
  mentorId: number;

  @ApiProperty({
    description: 'ID of the mentee to match with a mentor',
    example: '10',
  })
  @IsInt()
  menteeId: number;
}
