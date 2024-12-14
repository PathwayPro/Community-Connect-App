import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'Password123!',
    minLength: 9,
  })
  @IsString()
  password: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Current password',
    example: 'OldPassword123!',
  })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    description:
      'New password (must contain at least one letter, number, and special character)',
    example: 'NewPassword123!',
    minLength: 9,
  })
  @IsString()
  @MinLength(9)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,}$/, {
    message:
      'Password must contain at least one letter, number, and special character',
  })
  newPassword: string;

  @ApiProperty({
    description: 'Confirm new password',
    example: 'NewPassword123!',
  })
  @IsString()
  confirmPassword: string;
}

export class GenerateResetTokenDto {
  @ApiProperty({
    description: 'Email address for password reset',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;
}

export class VerifyPasswordDto {
  @ApiProperty({
    description: 'Plain text password to verify',
    example: 'Password123!',
  })
  @IsString()
  @IsNotEmpty()
  plainPassword: string;

  @ApiProperty({
    description: 'Hashed password to compare against',
    example: '$2b$10$...',
  })
  @IsString()
  @IsNotEmpty()
  hashedPassword: string;
}

export class ValidatePasswordDto {
  @ApiProperty({
    description: 'Password to validate',
    example: 'Password123!',
  })
  @IsString()
  @IsNotEmpty()
  passwordHash: string;
}

export class HashPasswordDto {
  @ApiProperty({
    description: 'Password to hash',
    example: 'Password123!',
  })
  @IsString()
  @IsNotEmpty()
  passwordHash: string;
}

export class ResendVerificationEmailDto {
  @ApiProperty({
    description: 'Email address to resend verification email to',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;
}
