import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';
import { MentorStatus } from '@prisma/client';

export class CreateMentorDto {
  @IsInt()
  maxMentees: number;

  @IsString()
  availability: string;

  @IsBoolean()
  hasExperience?: boolean = false;

  @IsString()
  @IsOptional()
  experienceDetails?: string;

  @IsEnum(MentorStatus)
  @IsOptional()
  status?: MentorStatus = 'PENDING';

  @IsInt()
  userId: number;
}
