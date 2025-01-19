import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsDate,
  IsNotEmpty,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReadUserDto {
  @ApiProperty({ description: 'User ID', example: 1 })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'User first name', example: 'John' })
  @IsString()
  firstName: string;

  @ApiPropertyOptional({ description: 'User middle name', example: 'Robert' })
  @IsOptional()
  @IsString()
  middleName?: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  // @IsString()
  // password_hash: string;

  @IsOptional()
  @IsDate() // Ensure dob is a valid Date object
  dob?: Date;

  @IsOptional()
  @IsBoolean()
  showDob?: boolean;

  @IsOptional()
  @IsDate() // Ensure arrival_in_canada is a valid Date object
  arrivalInCanada?: Date;

  @IsOptional()
  @IsNumber()
  goalId?: number;

  @ApiPropertyOptional({
    description: 'User role',
    enum: ['USER', 'ADMIN', 'MENTOR'],
    example: 'USER',
  })
  @IsOptional()
  @IsEnum(['USER', 'ADMIN', 'MENTOR'])
  role?: 'USER' | 'ADMIN' | 'MENTOR';
}

export class CreateUserDto {
  @ApiProperty({ description: 'User first name', example: 'John' })
  @IsString()
  firstName: string;

  @ApiPropertyOptional({ description: 'User middle name', example: 'Robert' })
  @IsOptional()
  @IsString()
  middleName?: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password',
    minLength: 9,
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  passwordHash: string;

  @ApiProperty({
    description: 'Password confirmation',
    minLength: 9,
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  dob?: string;

  @IsOptional()
  @IsBoolean()
  showDob?: boolean;

  @IsOptional()
  @IsString()
  arrivalInCanada?: string;

  @IsOptional()
  @IsString()
  goalId?: number;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  profession?: string;

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  pictureUploadLink?: string;

  @IsOptional()
  @IsString()
  resumeUploadLink?: string;

  @IsOptional()
  @IsString()
  linkedinLink?: string;

  @IsOptional()
  @IsString()
  githubLink?: string;

  @IsOptional()
  @IsString()
  twitterLink?: string;

  @IsOptional()
  @IsString()
  portfolioLink?: string;

  @IsOptional()
  @IsString()
  otherLinks?: string;

  @IsOptional()
  @IsArray()
  additionalLinks?: string[];

  @IsOptional()
  @IsString()
  languages?: string;
}

export class DeleteUserDto {
  @IsNumber()
  id: number;
}

export class PublicReadUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsDate() // Ensures arrival_in_canada is a valid Date object
  arrivalInCanada?: Date;

  @IsOptional()
  @IsEnum(['USER', 'ADMIN', 'MENTOR'])
  role?: 'USER' | 'ADMIN' | 'MENTOR';
}

export class LoginUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password hash',
    example: 'hashedPassword123',
  })
  @IsString()
  passwordHash: string;
}

export class NewUserFromDbDto {
  @IsNumber()
  id: number;

  @IsString()
  first_name: string;

  @IsOptional()
  @IsString()
  middle_name?: string;

  @IsString()
  last_name: string;

  @IsString()
  email: string;

  @IsOptional()
  @IsDate()
  dob?: Date;

  @IsOptional()
  @IsBoolean()
  show_dob?: boolean;

  @IsOptional()
  @IsNumber()
  arrival_in_canada?: number;

  @IsOptional()
  @IsNumber()
  goal_id?: number;

  @IsOptional()
  @IsEnum(['USER', 'ADMIN', 'MENTOR'])
  role?: 'USER' | 'ADMIN' | 'MENTOR';
}
