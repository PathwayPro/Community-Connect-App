import {
  IsInt,
  IsString,
  IsBoolean,
  IsOptional,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { users, mentors_status } from '@prisma/client';
import { ReadUserDto } from 'src/users/dto';
import { ApiProperty } from '@nestjs/swagger';

export class Mentors {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty()
  @IsInt()
  max_mentees: number;

  @ApiProperty()
  @IsString()
  availability: string;

  @ApiProperty()
  @IsBoolean()
  has_experience: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  experience_details: string | null;

  @ApiProperty()
  @IsEnum(mentors_status)
  status: mentors_status;

  @ApiProperty()
  @ValidateNested()
  @Type(() => ReadUserDto) // Important for nested objects
  user: users;

  @ApiProperty()
  @IsInt()
  user_id: number;
}
