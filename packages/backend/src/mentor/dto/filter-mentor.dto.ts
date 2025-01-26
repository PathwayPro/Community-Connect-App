import { mentors_status } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsOptional } from 'class-validator';

export class FilterMentorDto {
  @ApiPropertyOptional({
    description:
      'Filter for "greater than" or "equal to" the defined amount of mentees they can handle',
    example: 5,
    minimum: 0,
    maximum: 5,
  })
  @IsInt()
  @IsOptional()
  max_mentees?: number;

  @ApiPropertyOptional({
    description:
      'If the applicant has previous specific experience in mentoring others',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  has_experience?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by application status',
    example: 'PENDING',
    enum: mentors_status,
  })
  @IsEnum(mentors_status)
  @IsOptional()
  status?: mentors_status;
}
