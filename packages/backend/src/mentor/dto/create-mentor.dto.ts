import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';
import { mentors_status } from '@prisma/client';

export class CreateMentorDto {
  @IsInt()
  max_mentees: number;

  @IsString()
  availability: string;

  @IsBoolean()
  has_experience?: boolean = false;

  @IsString()
  @IsOptional()
  experience_details?: string;

  @IsEnum(mentors_status)
  @IsOptional()
  status?: mentors_status = 'PENDING';

  @IsInt()
  @IsOptional()
  user_id?: number;

  @IsInt({ each: true })
  @IsOptional()
  interests?: Array<number>;
}
