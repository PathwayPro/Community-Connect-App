import { IsInt, IsString, IsOptional, IsEnum, Min, Max } from 'class-validator';
import { mentors_status } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class Mentors {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty()
  @IsString()
  resume: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(5)
  max_mentees: number;

  @ApiProperty()
  @IsString()
  availability: string;

  @ApiProperty()
  @IsString()
  profession: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  experience_years: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  experience_details?: string;

  @ApiProperty()
  @IsEnum(mentors_status)
  status: mentors_status = 'PENDING';

  @ApiProperty()
  @IsInt()
  user_id: number;
}
