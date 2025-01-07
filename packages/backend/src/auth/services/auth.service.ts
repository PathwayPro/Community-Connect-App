import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from './email.service';
import {
  LoginUserDto,
  ResetPasswordDto,
  GenerateResetTokenDto,
  VerifyPasswordDto,
  ResendVerificationEmailDto,
} from '../dto/auth.dto';
import { AuthResponse, GoogleUser, LoginResponse, Tokens } from '../types';
import * as crypto from 'crypto';
import { users_roles } from '@prisma/client';

interface JwtPayload {
  sub: number;
  email: string;
  roles: users_roles;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async loginUser(loginDto: LoginUserDto): Promise<LoginResponse> {
    try {
      const { email, password } = loginDto;

      const user = await this.prisma.users.findUnique({ where: { email } });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (user.email_verified === false) {
        return {
          message: 'Email not verified',
          tokens: null,
        };
      }

      const isPasswordValid = await this.verifyPassword({
        plainPassword: password,
        hashedPassword: user.password_hash,
      });

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload: JwtPayload = {
        sub: user.id,
        email: user.email,
        roles: user.role,
      };
      const tokens = await this.getTokens(payload);

      return { tokens, message: 'Login successful' };
    } catch (error) {
      this.logger.error(`Error logging in user: ${error}`);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  private async verifyPassword({
    plainPassword,
    hashedPassword,
  }: VerifyPasswordDto): Promise<boolean> {
    try {
      if (!plainPassword || !hashedPassword) {
        this.logger.error('Missing password or hash');
        return false;
      }

      const isValid = await bcrypt.compare(plainPassword, hashedPassword);

      return isValid;
    } catch (error) {
      this.logger.error(
        `Error verifying password: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      return false;
    }
  }

  private async getTokens(payload: JwtPayload): Promise<Tokens> {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(payload),
        this.jwtService.signAsync(payload, {
          expiresIn: '7d',
        }),
      ]);
      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error(`Error getting tokens: ${error}`);
      throw new UnauthorizedException('Failed to get tokens');
    }
  }

  async refreshTokens({
    userId,
    refreshToken,
  }: {
    userId: number;
    refreshToken: string;
  }): Promise<Tokens> {
    try {
      const user = await this.prisma.users.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const isRefreshTokenValid =
        await this.jwtService.verifyAsync(refreshToken);

      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const payload: JwtPayload = {
        sub: userId,
        email: user.email,
        roles: user.role,
      };

      const tokens = await this.getTokens(payload);

      await this.updateRefreshToken(userId, tokens.refreshToken);

      return tokens;
    } catch (error) {
      this.logger.error(`Error refreshing tokens: ${error}`);
      throw new UnauthorizedException('Failed to refresh tokens');
    }
  }

  private async updateRefreshToken(
    userId: number,
    refreshToken: string | null,
  ) {
    try {
      const updatedUser = await this.prisma.users.update({
        where: { id: userId },
        data: { refresh_token: refreshToken },
      });

      if (!updatedUser) {
        throw new UnauthorizedException('Failed to update refresh token');
      }

      return { message: 'Refresh token updated successfully' };
    } catch (error) {
      this.logger.error(
        `Error updating refresh token: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new UnauthorizedException('Failed to update refresh token');
    }
  }

  public async isValidPassword(password: string): Promise<boolean> {
    if (!password || password.length < 9) {
      return false;
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,}$/;
    return passwordRegex.test(password);
  }

  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async resetPassword(
    userId: number,
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    try {
      const { oldPassword, newPassword, confirmPassword } = resetPasswordDto;

      const user = await this.prisma.users.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (!(await this.isValidPassword(newPassword))) {
        throw new UnauthorizedException(
          'New password does not meet security requirements',
        );
      }

      if (newPassword !== confirmPassword) {
        throw new UnauthorizedException(
          'New password and confirm password do not match',
        );
      }

      const isOldPasswordValid = await this.verifyPassword({
        plainPassword: oldPassword,
        hashedPassword: user.password_hash,
      });

      if (!isOldPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      const hashedNewPassword = await this.hashPassword(newPassword);

      const updatedUser = await this.prisma.users.update({
        where: { id: user.id },
        data: { password_hash: hashedNewPassword },
      });

      if (!updatedUser) {
        throw new UnauthorizedException('Failed to update password');
      }

      return { message: 'Password updated successfully' };
    } catch (error) {
      this.logger.error(`Error resetting password: ${error}`);
      throw new UnauthorizedException('Failed to reset password');
    }
  }

  async forgotPassword(
    generateResetTokenDto: GenerateResetTokenDto,
  ): Promise<{ message: string }> {
    try {
      const token = await this.generateResetToken(generateResetTokenDto);

      const response = await this.emailService.sendPasswordResetEmail(
        generateResetTokenDto.email,
        token,
      );

      if (!response.success) {
        throw new UnauthorizedException('Failed to send reset email');
      }

      return { message: 'Password reset email sent successfully.' };
    } catch (error) {
      this.logger.error(`Error sending reset email: ${error}`);
      throw new UnauthorizedException('Failed to send reset email');
    }
  }

  async generateResetToken({ email }: GenerateResetTokenDto): Promise<string> {
    try {
      const user = await this.prisma.users.findUnique({ where: { email } });
      if (!user) {
        throw new UnauthorizedException('Invalid email address');
      }

      const token = this.emailService.generateToken(user.id);

      await this.prisma.users.update({
        where: { id: user.id },
        data: { verification_token: token },
      });

      return token;
    } catch (error) {
      this.logger.error(`Error generating reset token: ${error}`);
      throw new UnauthorizedException('Failed to generate reset token');
    }
  }

  async logoutUser(userId: number) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Update user to clear refresh token
      await this.prisma.users.update({
        where: { id: userId },
        data: {
          refresh_token: null,
          last_logout: new Date(),
        },
      });

      return { message: 'Logout successful' };
    } catch (error) {
      this.logger.error(
        `Error logging out user ${userId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException('Failed to log out user');
    }
  }

  async verifyEmail(
    token: string,
  ): Promise<{ message: string; userId: number }> {
    try {
      // Verify and extract userId from token
      const decodedMessage = this.emailService.verifyToken(token);

      if (!decodedMessage.userId) {
        throw new UnauthorizedException(
          'Invalid or expired verification token',
        );
      }

      // Find and verify user in a single query
      const user = await this.prisma.users.findFirst({
        where: {
          id: decodedMessage.userId,
        },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (user.email_verified === true) {
        throw new UnauthorizedException('Email already verified');
      }

      // Update user verification status
      await this.prisma.users.update({
        where: { id: decodedMessage.userId },
        data: {
          email_verified: true,
          verification_token: null,
        },
      });

      console.log('decodedMessage', decodedMessage);

      return {
        message: 'Email verified successfully',
        userId: decodedMessage.userId,
      };
    } catch (error) {
      this.logger.error(
        `Email verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new UnauthorizedException('Failed to verify email');
    }
  }

  async resendVerificationEmail(
    resendVerificationEmailDto: ResendVerificationEmailDto,
  ): Promise<{ message: string }> {
    const token = await this.generateResetToken(resendVerificationEmailDto);

    const response = await this.emailService.sendVerificationEmail(
      resendVerificationEmailDto.email,
      token,
    );

    if (!response.success) {
      throw new UnauthorizedException('Failed to send verification email');
    }

    return { message: 'Verification email sent successfully' };
  }

  async handleGoogleAuth(googleUser: GoogleUser): Promise<AuthResponse> {
    let data: AuthResponse;
    try {
      const existingUser = await this.prisma.users.findUnique({
        where: { email: googleUser.email },
      });

      if (existingUser) {
        const tokens = await this.getTokens({
          sub: existingUser.id,
          email: existingUser.email,
          roles: existingUser.role,
        });

        await this.updateRefreshToken(existingUser.id, tokens.refreshToken);

        data = {
          message: 'Google authentication successful',
          tokens: {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          },
        };

        return data;
      } else {
        const hashedPassword = await this.hashPassword(
          crypto.randomBytes(32).toString('hex'),
        );
        const newUser = await this.prisma.users.create({
          data: {
            email: googleUser.email,
            first_name: googleUser.firstName,
            last_name: googleUser.lastName,
            password_hash: hashedPassword,
          },
        });

        const tokens = await this.getTokens({
          sub: newUser.id,
          email: newUser.email,
          roles: existingUser.role,
        });
        await this.updateRefreshToken(newUser.id, tokens.refreshToken);

        data = {
          message: 'Google authentication successful',
          tokens: {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          },
        };

        return data;
      }
    } catch (error) {
      this.logger.error(`Google authentication error: ${error.message}`);
      throw new UnauthorizedException('Failed to authenticate with Google');
    }
  }
}
