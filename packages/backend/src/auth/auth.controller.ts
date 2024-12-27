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
import { AuthService, EmailService } from './services';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  GenerateResetTokenDto,
  LoginUserDto,
  ResendVerificationEmailDto,
  ResetPasswordDto,
} from './dto';
import { GetUser } from './decorators';
import { GoogleUser, LoginResponse } from './types';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

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
  async loginUser(@Body() credentials: LoginUserDto): Promise<LoginResponse> {
    return await this.authService.loginUser(credentials);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetUser('sub') userId: number): Promise<{ message: string }> {
    return this.authService.logoutUser(userId);
  }

  @Public()
  @Get('verify-email')
  @HttpCode(HttpStatus.OK)
  verifyEmail(
    @Query('token') token: string,
  ): Promise<{ message: string; userId: number }> {
    return this.authService.verifyEmail(token);
  }

  @Public()
  @Post('resend-verification-email')
  resendVerificationEmail(
    @Body() resendVerificationEmailDto: ResendVerificationEmailDto,
  ): Promise<{ message: string }> {
    return this.authService.resendVerificationEmail(resendVerificationEmailDto);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(
    @Body() generateResetTokenDto: GenerateResetTokenDto,
  ): Promise<{ message: string }> {
    return this.authService.forgotPassword(generateResetTokenDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(
    @GetUser('userId') userId: number,
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.resetPassword(userId, resetPasswordDto);
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Guard will redirect to google
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
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
