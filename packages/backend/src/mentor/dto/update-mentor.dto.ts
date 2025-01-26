import { PartialType } from '@nestjs/mapped-types';
import { CreateMentorDto } from './create-mentor.dto';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { mentors_status } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMentorDto extends PartialType(CreateMentorDto) {
  @ApiPropertyOptional({
    description: 'Maximum amount of mentees they can handle',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @IsOptional()
  max_mentees?: number;

  @ApiPropertyOptional({
    description: 'Description of availability for mentorship sessions',
    example: 'Monday to Friday after 2PM',
  })
  @IsString()
  @IsOptional()
  availability?: string;

  @ApiPropertyOptional({
    description:
      'If the applicant has previous specific experience in mentoring others. Default: FALSE',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  has_experience?: boolean = false;

  @ApiPropertyOptional({
    description: 'Description of previous experience in mentoring others',
  })
  @IsString()
  @IsOptional()
  experience_details?: string;
}

export class UpdateMentorStatusDto extends PartialType(CreateMentorDto) {
  @ApiPropertyOptional({
    description: 'New status for this application',
    example: 'APPROVED',
    enum: mentors_status,
  })
  @IsEnum(mentors_status)
  @IsOptional()
  status?: mentors_status;
}
