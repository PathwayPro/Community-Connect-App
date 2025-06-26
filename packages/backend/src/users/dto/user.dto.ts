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
  IsUrl,
  MaxLength,
  MinLength,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class ReadUserDto {
  @ApiProperty({ description: 'User ID', example: 1 })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'User first name', example: 'John' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  firstName: string;

  @ApiPropertyOptional({ description: 'User middle name', example: 'Robert' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  middleName?: string;

  @ApiProperty({ description: 'User last name', example: 'Doe' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  lastName: string;

  @ApiProperty({ description: 'User email', example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ description: 'Date of birth', example: '1990-01-01' })
  @IsOptional()
  @IsDateString()
  dob?: string;

  @ApiPropertyOptional({ description: 'Age range', example: '25-35' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  ageRange?: string;

  @ApiPropertyOptional({
    description: 'Arrival date in Canada',
    example: '2020-01-01',
  })
  @IsOptional()
  @IsDateString()
  arrivalInCanada?: string;

  @ApiPropertyOptional({ description: 'Goal ID', example: '1' })
  @IsOptional()
  @IsString()
  goalId?: string;

  @ApiPropertyOptional({ description: 'User skills', example: [1, 2, 3] })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  skills?: number[];

  @ApiPropertyOptional({
    description: 'Authentication provider',
    example: 'email',
  })
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

  @ApiPropertyOptional({ description: 'Province', example: 'Ontario' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  province?: string;

  @ApiPropertyOptional({ description: 'City', example: 'Toronto' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  city?: string;

  @ApiPropertyOptional({ description: 'Languages', example: 'English, French' })
  @IsOptional()
  @IsString()
  languages?: string;

  @ApiPropertyOptional({
    description: 'Profession',
    example: 'Software Engineer',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  profession?: string;

  @ApiPropertyOptional({ description: 'Experience', example: '5 years' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  experience?: string;

  @ApiPropertyOptional({
    description: 'Bio',
    example: 'Experienced software engineer...',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;

  @ApiPropertyOptional({ description: 'Profile picture URL' })
  @IsOptional()
  @IsString()
  pictureUploadLink?: string;

  @ApiPropertyOptional({ description: 'Resume URL' })
  @IsOptional()
  @IsString()
  resumeUploadLink?: string;

  @ApiPropertyOptional({ description: 'LinkedIn URL' })
  @IsOptional()
  @IsUrl()
  linkedinLink?: string;

  @ApiPropertyOptional({ description: 'GitHub URL' })
  @IsOptional()
  @IsUrl()
  githubLink?: string;

  @ApiPropertyOptional({ description: 'Twitter URL' })
  @IsOptional()
  @IsUrl()
  twitterLink?: string;

  @ApiPropertyOptional({ description: 'Portfolio URL' })
  @IsOptional()
  @IsUrl()
  portfolioLink?: string;

  @ApiPropertyOptional({ description: 'Other links' })
  @IsOptional()
  @IsString()
  otherLinks?: string;

  @ApiPropertyOptional({ description: 'Additional links', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  additionalLinks?: string[];

  @ApiPropertyOptional({ description: 'Work status', example: 'Employed' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  workStatus?: string;

  @ApiPropertyOptional({ description: 'Company name', example: 'Tech Corp' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  companyName?: string;

  @ApiPropertyOptional({ description: 'Country of origin', example: 'Canada' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  countryOfOrigin?: string;

  @ApiPropertyOptional({
    description: 'Actively searching for opportunities',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  activelySearching?: boolean;

  @ApiPropertyOptional({ description: 'Last login date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastLogin?: Date;

  @ApiPropertyOptional({
    description: 'Account deletion status',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  deletedAt?: boolean;

  @ApiPropertyOptional({
    description: 'Email verification status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;

  @ApiPropertyOptional({ description: 'User status', example: 'ACTIVE' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class CreateUserDto {
  @ApiProperty({ description: 'User first name', example: 'John' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  firstName: string;

  @ApiPropertyOptional({ description: 'User middle name', example: 'Robert' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  middleName?: string;

  @ApiProperty({ description: 'User last name', example: 'Doe' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  lastName: string;

  @ApiProperty({ description: 'User email', example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password',
    minLength: 9,
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(9)
  passwordHash: string;

  @ApiProperty({
    description: 'Password confirmation',
    minLength: 9,
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(9)
  confirmPassword: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'User first name', example: 'John' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Transform(({ value }) => value?.trim() || undefined)
  firstName?: string;

  @ApiPropertyOptional({ description: 'User middle name', example: 'Robert' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => value?.trim() || undefined)
  middleName?: string;

  @ApiPropertyOptional({ description: 'User last name', example: 'Doe' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Transform(({ value }) => value?.trim() || undefined)
  lastName?: string;

  @ApiPropertyOptional({ description: 'Date of birth', example: '1990-01-01' })
  @IsOptional()
  @IsDateString()
  dob?: string;

  @ApiPropertyOptional({ description: 'Age range', example: '25-35' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  ageRange?: string;

  @ApiPropertyOptional({
    description: 'Arrival date in Canada',
    example: '2020-01-01',
  })
  @IsOptional()
  @IsDateString()
  arrivalInCanada?: string;

  @ApiPropertyOptional({ description: 'Goal ID', example: '1' })
  @IsOptional()
  @IsString()
  goalId?: string;

  @ApiPropertyOptional({ description: 'Province', example: 'Ontario' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  province?: string;

  @ApiPropertyOptional({ description: 'City', example: 'Toronto' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  city?: string;

  @ApiPropertyOptional({
    description: 'Profession',
    example: 'Software Engineer',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  profession?: string;

  @ApiPropertyOptional({ description: 'Experience', example: '5 years' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  experience?: string;

  @ApiPropertyOptional({
    description: 'Bio',
    example: 'Experienced software engineer...',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;

  @ApiPropertyOptional({ description: 'LinkedIn URL' })
  @IsOptional()
  @IsUrl()
  linkedinLink?: string;

  @ApiPropertyOptional({ description: 'GitHub URL' })
  @IsOptional()
  @IsUrl()
  githubLink?: string;

  @ApiPropertyOptional({ description: 'Twitter URL' })
  @IsOptional()
  @IsUrl()
  twitterLink?: string;

  @ApiPropertyOptional({ description: 'Portfolio URL' })
  @IsOptional()
  @IsUrl()
  portfolioLink?: string;

  @ApiPropertyOptional({ description: 'Other links' })
  @IsOptional()
  @IsString()
  otherLinks?: string;

  @ApiPropertyOptional({ description: 'Additional links', type: [String] })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return value || [];
  })
  additionalLinks?: string[];

  @ApiPropertyOptional({ description: 'Languages', example: 'English, French' })
  @IsOptional()
  @IsString()
  languages?: string;

  @ApiPropertyOptional({ description: 'Country of origin', example: 'Canada' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  countryOfOrigin?: string;

  @ApiPropertyOptional({ description: 'Work status', example: 'Employed' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  workStatus?: string;

  @ApiPropertyOptional({ description: 'Company name', example: 'Tech Corp' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  companyName?: string;

  @ApiPropertyOptional({
    description: 'Actively searching for opportunities',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value || false;
  })
  activelySearching?: boolean;

  @ApiPropertyOptional({
    description: 'Array of skill IDs',
    example: [1, 2, 3],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed)
          ? parsed.map((item: any) => parseInt(item, 10))
          : [];
      } catch {
        return [];
      }
    }
    return value || [];
  })
  skills?: number[];
}

export class DeleteUserDto {
  @ApiProperty({ description: 'User ID', example: 1 })
  @IsNumber()
  id: number;

  @ApiPropertyOptional({
    description: 'Account deletion status',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  deletedAt?: boolean;
}

export class PublicReadUserDto {
  @ApiProperty({ description: 'User ID', example: 1 })
  @IsNumber()
  id: number;

  @ApiPropertyOptional({ description: 'User first name', example: 'John' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ description: 'User middle name', example: 'Robert' })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiPropertyOptional({ description: 'User last name', example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'User email',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Arrival date in Canada' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  arrivalInCanada?: Date;

  @ApiPropertyOptional({
    description: 'User role',
    enum: ['USER', 'ADMIN', 'MENTOR'],
  })
  @IsOptional()
  @IsEnum(['USER', 'ADMIN', 'MENTOR'])
  role?: 'USER' | 'ADMIN' | 'MENTOR';

  @ApiPropertyOptional({ description: 'Country of origin', example: 'Canada' })
  @IsOptional()
  @IsString()
  countryOfOrigin?: string;

  @ApiPropertyOptional({ description: 'Company name', example: 'Tech Corp' })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiPropertyOptional({
    description: 'Bio',
    example: 'Experienced software engineer...',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ description: 'User skills', example: [1, 2, 3] })
  @IsOptional()
  @IsArray()
  skills?: number[];

  @ApiPropertyOptional({
    description: 'Profession',
    example: 'Software Engineer',
  })
  @IsOptional()
  @IsString()
  profession?: string;

  @ApiPropertyOptional({ description: 'Experience', example: '5 years' })
  @IsOptional()
  @IsString()
  experience?: string;

  @ApiPropertyOptional({ description: 'LinkedIn URL' })
  @IsOptional()
  @IsUrl()
  linkedinLink?: string;

  @ApiPropertyOptional({ description: 'GitHub URL' })
  @IsOptional()
  @IsUrl()
  githubLink?: string;

  @ApiPropertyOptional({ description: 'Twitter URL' })
  @IsOptional()
  @IsUrl()
  twitterLink?: string;

  @ApiPropertyOptional({ description: 'Portfolio URL' })
  @IsOptional()
  @IsUrl()
  portfolioLink?: string;

  @ApiPropertyOptional({ description: 'Other links' })
  @IsOptional()
  @IsString()
  otherLinks?: string;

  @ApiPropertyOptional({ description: 'Additional links', type: [String] })
  @IsOptional()
  @IsArray()
  additionalLinks?: string[];

  @ApiPropertyOptional({ description: 'Languages', example: 'English, French' })
  @IsOptional()
  @IsString()
  languages?: string;

  @ApiPropertyOptional({
    description: 'Authentication provider',
    example: 'email',
  })
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

  @ApiProperty({ description: 'Password hash', example: 'hashedPassword123' })
  @IsString()
  @MinLength(1)
  passwordHash: string;
}

export class NewUserFromDbDto {
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

  @ApiProperty({ description: 'User last name', example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'User email', example: 'john.doe@example.com' })
  @IsString()
  email: string;

  @ApiPropertyOptional({ description: 'Date of birth', example: '1990-01-01' })
  @IsOptional()
  @IsString()
  dob?: string;

  @ApiPropertyOptional({ description: 'Show date of birth', example: false })
  @IsOptional()
  @IsBoolean()
  showDob?: boolean;

  @ApiPropertyOptional({
    description: 'Arrival date in Canada',
    example: '2020-01-01',
  })
  @IsOptional()
  @IsString()
  arrivalInCanada?: string;

  @ApiPropertyOptional({ description: 'Goal ID', example: '1' })
  @IsOptional()
  @IsString()
  goalId?: string;

  @ApiPropertyOptional({
    description: 'User role',
    enum: ['USER', 'ADMIN', 'MENTOR'],
  })
  @IsOptional()
  @IsEnum(['USER', 'ADMIN', 'MENTOR'])
  role?: 'USER' | 'ADMIN' | 'MENTOR';
}
