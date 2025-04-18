import { PartialType } from '@nestjs/mapped-types';
import { CreateMentorDto } from './create-mentor.dto';
import { IsArray, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { mentors_status } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateMentorDto extends PartialType(CreateMentorDto) {
  @ApiPropertyOptional({ description: 'Profession, related to mentoring' })
  @IsString()
  @IsOptional()
  profession?: string;

  @ApiPropertyOptional({
    description: 'Experience in years. "0" for no experience.',
    example: 5,
    minimum: 0,
  })
  @IsInt()
  @IsOptional()
  experience_years?: number;

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
    description: 'Description of previous experience in mentoring others',
  })
  @IsString()
  @IsOptional()
  experience_details?: string;

  // @ApiPropertyOptional({
  //   description: 'Array of interests IDs to match with mentees (String)',
  //   example: '[1, 2, 3]',
  // })
  // @IsString()
  // @IsOptional()
  // interests?: string;

  @ApiPropertyOptional({
    description: 'Array of interests IDs to match with mentees (Number[])',
    example: [1, 2, 3],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return JSON.parse(value).map((item: any) => parseInt(item, 10));
    } else if (Array.isArray(value)) {
      return value.map((item: any) => parseInt(item, 10));
    } else {
      return [];
    }
  })
  interests?: number[];
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
