import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TokensResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTYzNTY4OTYwMCwiZXhwIjoxNjM1NjkzMjAwfQ.example',
  })
  accessToken: string;

  @ApiProperty({
    description: 'JWT refresh token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTYzNTY4OTYwMCwiZXhwIjoxNjM1NzUyNDAwfQ.example',
  })
  refreshToken: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT tokens for authentication',
    type: TokensResponseDto,
  })
  tokens: TokensResponseDto;

  @ApiProperty({
    description: 'Success message',
    example: 'Login successful',
  })
  message: string;
}

export class LogoutResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Logout successful',
  })
  message: string;
}

export class EmailVerificationResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Email verified successfully',
  })
  message: string;

  @ApiProperty({
    description: 'User ID of the verified user',
    example: 1,
  })
  userId: number;
}

export class ResendVerificationEmailResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Verification email sent successfully',
  })
  message: string;
}

export class ForgotPasswordResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Password reset email sent successfully',
  })
  message: string;
}

export class ResetPasswordResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Password reset successfully',
  })
  message: string;
}

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Error message',
    example: 'Invalid credentials',
  })
  message: string;

  @ApiPropertyOptional({
    description: 'Error code',
    example: 'UNAUTHORIZED',
  })
  error?: string;

  @ApiPropertyOptional({
    description: 'HTTP status code',
    example: 401,
  })
  statusCode?: number;
}
