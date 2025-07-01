import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
// import { AuthService, EmailService } from './services';
import { AuthService } from './services/auth.service';
import { EmailService } from './services/email.service';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  ChangePasswordDto,
  GenerateResetTokenDto,
  LoginUserDto,
  ResendVerificationEmailDto,
  ResetPasswordDto,
} from './dto';
import { GetUser } from './decorators';
import { GoogleUser, LoginResponse } from './types';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import {
  LoginResponseDto,
  LogoutResponseDto,
  EmailVerificationResponseDto,
  ResendVerificationEmailResponseDto,
  ForgotPasswordResponseDto,
  ResetPasswordResponseDto,
  ErrorResponseDto,
} from './dto/auth-response.dto';

@ApiTags('Authentication')
@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login',
    description:
      'Authenticate a user with email and password and return JWT tokens',
  })
  @ApiBody({
    type: LoginUserDto,
    description: 'User credentials for authentication',
  })
  @ApiOkResponse({
    description: 'User successfully authenticated',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: ErrorResponseDto,
  })
  async loginUser(@Body() credentials: LoginUserDto): Promise<LoginResponse> {
    return await this.authService.loginUser(credentials);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'User logout',
    description: 'Logout the authenticated user and invalidate their session',
  })
  @ApiOkResponse({
    description: 'User successfully logged out',
    type: LogoutResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
    type: ErrorResponseDto,
  })
  logout(@GetUser('sub') userId: number): Promise<{ message: string }> {
    return this.authService.logoutUser(userId);
  }

  @Public()
  @Get('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify email address',
    description: 'Verify user email address using verification token',
  })
  @ApiQuery({
    name: 'token',
    description: 'Email verification token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @ApiOkResponse({
    description: 'Email successfully verified',
    type: EmailVerificationResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid or expired token',
    type: ErrorResponseDto,
  })
  verifyEmail(
    @Query('token') token: string,
  ): Promise<{ message: string; userId: number }> {
    return this.authService.verifyEmail(token);
  }

  @Public()
  @Post('resend-verification-email')
  @ApiOperation({
    summary: 'Resend verification email',
    description: 'Resend email verification link to user',
  })
  @ApiBody({
    type: ResendVerificationEmailDto,
    description: 'Email address to resend verification to',
  })
  @ApiOkResponse({
    description: 'Verification email sent successfully',
    type: ResendVerificationEmailResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid email address or user not found',
    type: ErrorResponseDto,
  })
  resendVerificationEmail(
    @Body() resendVerificationEmailDto: ResendVerificationEmailDto,
  ): Promise<{ message: string }> {
    return this.authService.resendVerificationEmail(resendVerificationEmailDto);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Request password reset',
    description: 'Send password reset email to user',
  })
  @ApiBody({
    type: GenerateResetTokenDto,
    description: 'Email address for password reset',
  })
  @ApiOkResponse({
    description: 'Password reset email sent successfully',
    type: ForgotPasswordResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid email address or user not found',
    type: ErrorResponseDto,
  })
  forgotPassword(
    @Body() generateResetTokenDto: GenerateResetTokenDto,
  ): Promise<{ message: string }> {
    return this.authService.forgotPassword(generateResetTokenDto);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Reset password',
    description: 'Reset user password with current password verification',
  })
  @ApiBody({
    type: ResetPasswordDto,
    description: 'Password reset data',
  })
  @ApiOkResponse({
    description: 'Password reset successfully',
    type: ResetPasswordResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid password data or current password incorrect',
    type: ErrorResponseDto,
  })
  resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  changePassword(
    @GetUser('sub') userId: number,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.changePassword(userId, changePasswordDto);
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Google OAuth login',
    description: 'Initiate Google OAuth authentication flow',
  })
  @ApiOkResponse({
    description: 'Redirects to Google OAuth consent screen',
  })
  async googleAuth() {
    // Guard will redirect to google
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Google OAuth callback',
    description:
      'Handle Google OAuth callback and redirect to frontend with tokens',
  })
  @ApiOkResponse({
    description: 'Redirects to frontend with access and refresh tokens',
  })
  @ApiBadRequestResponse({
    description: 'Google authentication failed',
    type: ErrorResponseDto,
  })
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    try {
      const authResponse = await this.authService.handleGoogleAuth(
        (req as any).user as GoogleUser,
      );

      const redirectUrl = new URL(`${process.env.FRONTEND_URL}/auth/oauth`);
      redirectUrl.searchParams.append(
        'accessToken',
        authResponse.tokens.accessToken,
      );
      redirectUrl.searchParams.append(
        'refreshToken',
        authResponse.tokens.refreshToken,
      );

      return res.redirect(redirectUrl.toString());
    } catch (error) {
      console.log(error);
      return res.redirect(
        `${process.env.FRONTEND_URL}/signin?error=google_auth_failed`,
      );
    }
  }
}
