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
  IsInt,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

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
  @IsString()
  dob?: string;

  @IsOptional()
  @IsString()
  ageRange?: string;

  @IsOptional()
  @IsString()
  arrivalInCanada?: string;

  @IsOptional()
  @IsString()
  goalId?: string;

  @IsOptional()
  @IsNumber()
  skills?: number[];

  @IsOptional()
  @IsString()
  provider?: string;

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
  @Transform(({ value }) => value || undefined)
  firstName?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  middleName?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  lastName?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  dob?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  ageRange?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  arrivalInCanada?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  goalId?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  province?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  city?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  profession?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  experience?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  bio?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  linkedinLink?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  githubLink?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  twitterLink?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  portfolioLink?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  otherLinks?: string;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    return value || [];
  })
  additionalLinks?: string[];

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  languages?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  countryOfOrigin?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  workStatus?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  companyName?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value || false;
  })
  activelySearching?: boolean;

  @ApiPropertyOptional({
    description: 'Array of skill IDs (Number[])',
    example: [1, 2, 3],
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed)
          ? parsed.map((item: any) => parseInt(item, 10))
          : [];
      } catch (e) {
        return [];
      }
    }
    return value || [];
  })
  skills?: number[];

  // @IsOptional()
  // @IsDate()
  // lastLogin?: Date;

  // @IsOptional()
  // @IsBoolean()
  // deletedAt?: boolean;
}

export class DeleteUserDto {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsBoolean()
  deletedAt?: boolean;
}

export class PublicReadUserDto {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  middle_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsDate() // Ensures arrival_in_canada is a valid Date object
  arrival_in_canada?: Date;

  @IsOptional()
  @IsEnum(['USER', 'ADMIN', 'MENTOR'])
  role?: 'USER' | 'ADMIN' | 'MENTOR';

  @IsOptional()
  @IsString()
  country_of_origin?: string;

  @IsOptional()
  @IsString()
  company_name?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsArray()
  skills?: number[];

  @IsOptional()
  @IsString()
  profession?: string;

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsString()
  linkedin_link?: string;

  @IsOptional()
  @IsString()
  github_link?: string;

  @IsOptional()
  @IsString()
  twitter_link?: string;

  @IsOptional()
  @IsString()
  portfolio_link?: string;

  @IsOptional()
  @IsString()
  other_links?: string;

  @IsOptional()
  @IsArray()
  additional_links?: string[];

  @IsOptional()
  @IsString()
  languages?: string;

  @IsOptional()
  @IsString()
  provider?: string;
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
  @IsString()
  dob?: string;

  @IsOptional()
  @IsBoolean()
  show_dob?: boolean;

  @IsOptional()
  @IsString()
  arrival_in_canada?: string;

  @IsOptional()
  @IsString()
  goalId?: string;

  @IsOptional()
  @IsEnum(['USER', 'ADMIN', 'MENTOR'])
  role?: 'USER' | 'ADMIN' | 'MENTOR';
}
