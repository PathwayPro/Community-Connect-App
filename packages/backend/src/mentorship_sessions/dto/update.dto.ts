import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { matching_status } from '@prisma/client';

export class UpdateMentorshipSessionDto {
  @ApiPropertyOptional({
    description: 'Call link',
    example: 'https://meet.google.com',
  })
  @IsString()
  @IsUrl()
  @IsOptional()
  link?: string;

  @ApiPropertyOptional({
    description: 'Start date and time',
    example: '2025-01-01T10:00:00Z',
  })
  @IsDate()
  @IsOptional()
  dateStart?: Date;

  @ApiPropertyOptional({
    description: 'End date and time',
    example: '2025-01-01T10:00:00Z',
  })
  @IsDate()
  @IsOptional()
  dateEnd?: Date;

  @ApiPropertyOptional({
    description: 'Description',
    example: 'Description of the session',
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateSessionMenteeNoteDto {
  @ApiPropertyOptional({
    description: 'Mentee notes for the session',
    example: 'Mentee note',
  })
  @IsString()
  @IsOptional()
  note?: string;
}

export class UpdateMatchingDto {
  @ApiProperty({ description: 'New matching status', example: 'APPROVED' })
  @IsEnum(matching_status)
  status: matching_status;
}
