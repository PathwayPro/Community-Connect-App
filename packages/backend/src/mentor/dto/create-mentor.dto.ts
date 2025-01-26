import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';
import { mentors_status } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMentorDto {
  @ApiProperty({
    description: 'Maximum amount of mentees they can handle',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  max_mentees: number;

  @ApiProperty({
    description: 'Description of availability for mentorship sessions',
    example: 'Monday to Friday after 2PM',
  })
  @IsString()
  availability: string;

  @ApiPropertyOptional({
    description:
      'If the applicant has previous specific experience in mentoring others. Default: FALSE',
    example: true,
  })
  @IsBoolean()
  has_experience?: boolean = false;

  @ApiPropertyOptional({
    description: 'Description of previous experience in mentoring others',
  })
  @IsString()
  @IsOptional()
  experience_details?: string;

  @IsEnum(mentors_status)
  @IsOptional()
  status?: mentors_status = 'PENDING';

  @IsInt()
  @IsOptional()
  user_id?: number;

  @ApiProperty({
    description: 'Array of interests IDs to match with mentees',
    example: [1, 2, 3],
  })
  @IsInt({ each: true })
  @IsOptional()
  interests?: Array<number>;
}
