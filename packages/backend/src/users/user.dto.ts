import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsDate,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

export class ReadUserDto {
  @IsNumber()
  id: number;

  @IsString()
  first_name: string;

  @IsOptional()
  @IsString()
  middle_name?: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  // @IsString()
  // password_hash: string;

  @IsOptional()
  @IsDate() // Ensure dob is a valid Date object
  dob?: Date;

  @IsOptional()
  @IsBoolean()
  show_dob?: boolean;

  @IsOptional()
  @IsDate() // Ensure arrival_in_canada is a valid Date object
  arrival_in_canada?: Date;

  @IsOptional()
  @IsNumber()
  goal_id?: number;

  @IsOptional()
  @IsEnum(['USER', 'ADMIN', 'MENTOR'])
  role?: 'USER' | 'ADMIN' | 'MENTOR';
}

export class CreateUserDto {
  @IsString()
  first_name: string;

  @IsOptional()
  @IsString()
  middle_name?: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(9)
  password: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;

  @IsOptional()
  @IsDate() // Ensure dob is a valid Date object
  dob?: Date;

  @IsOptional()
  @IsBoolean()
  show_dob?: boolean;

  @IsOptional()
  @IsDate() // Ensure arrival_in_canada is a valid Date object
  arrival_in_canada?: Date;

  @IsOptional()
  @IsNumber()
  goal_id?: number;

  @IsOptional()
  @IsEnum(['USER', 'ADMIN', 'MENTOR'])
  role?: 'USER' | 'ADMIN' | 'MENTOR';
}

export class UpdateUserDto {
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

  // @IsOptional()
  // @IsString()
  // password_hash?: string;

  @IsOptional()
  @IsDate() // Ensure dob is a valid Date object
  dob?: Date;

  @IsOptional()
  @IsBoolean()
  show_dob?: boolean;

  @IsOptional()
  @IsDate() // Ensure arrival_in_canada is a valid Date object
  arrival_in_canada?: Date;

  @IsOptional()
  @IsNumber()
  goal_id?: number;

  @IsOptional()
  @IsEnum(['USER', 'ADMIN', 'MENTOR'])
  role?: 'USER' | 'ADMIN' | 'MENTOR';
}

export class DeleteUserDto {
  @IsNumber()
  id: number;
}

export class PublicReadUserDto {
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
  @IsEnum(['USER', 'ADMIN', 'MENTOR']) // Ensures role is one of the allowed values
  role?: 'USER' | 'ADMIN' | 'MENTOR';
}

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password_hash: string;
}
