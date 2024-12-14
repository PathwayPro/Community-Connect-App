import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { EmailConfig, EmailOptions } from '../types';
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly config: EmailConfig;

  constructor(private configService: ConfigService) {
    this.config = this.loadConfig();
    this.transporter = this.createTransporter();
  }

  private loadConfig(): EmailConfig {
    const config = {
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      user: this.configService.get<string>('EMAIL_USER'),
      pass: this.configService.get<string>('EMAIL_PASS'),
      frontendUrl: this.configService.get<string>('FRONTEND_URL'),
      jwtSecret: this.configService.get<string>('JWT_SECRET_KEY'),
    };

    // Validate config
    Object.entries(config).forEach(([key, value]) => {
      if (!value) throw new Error(`Missing configuration: ${key}`);
    });

    return config as EmailConfig;
  }

  private createTransporter(): nodemailer.Transporter {
    return nodemailer.createTransport({
      host: this.config.host,
      port: this.config.port,
      auth: {
        user: this.config.user,
        pass: this.config.pass,
      },
    });
  }

  private async sendEmail(
    options: EmailOptions,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const info = await this.transporter.sendMail({
        from: this.config.user,
        ...options,
      });

      return {
        success: true,
        message: `Email sent successfully. Message ID: ${info.messageId}`,
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new Error('Failed to send email');
    }
  }

  public generateToken(userId: number): string {
    try {
      return jwt.sign({ userId }, this.config.jwtSecret, { expiresIn: '1h' });
    } catch (error) {
      console.error('Token generation failed:', error);
      throw new Error('Failed to generate token');
    }
  }

  public async sendVerificationEmail(
    email: string,
    token: string,
  ): Promise<{ success: boolean; message: string }> {
    const verificationLink = `${this.config.frontendUrl}/auth/verify-email?token=${token}`;

    const response = await this.sendEmail({
      to: email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking: ${verificationLink}`,
      html: `
        <html>
          <body>
            <h1>Email Verification</h1>
            <p>Please click the link below to verify your email address:</p>
            <a href="${verificationLink}">${verificationLink}</a>
          </body>
        </html>
      `,
    });

    return response;
  }

  public async sendPasswordResetEmail(
    email: string,
    token: string,
  ): Promise<{ success: boolean; message: string }> {
    const resetLink = `${this.config.frontendUrl}/auth/reset-password?token=${token}`;

    const response = await this.sendEmail({
      to: email,
      subject: 'Password Reset Request',
      text: `To reset your password, click: ${resetLink}`,
      html: `
        <html>
          <body>
            <h1>Password Reset Request</h1>
            <p>Click the link below to reset your password:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>If you didn't request this, please ignore this email.</p>
          </body>
        </html>
      `,
    });

    return response;
  }

  public verifyToken(token: string): { message: string; userId: number } {
    try {
      const decoded = jwt.verify(token, this.config.jwtSecret) as {
        userId: number;
      };
      return { message: 'Token verified', userId: decoded.userId };
    } catch (error) {
      this.logger.error('Token verification failed:', error);
      // throw new Error('Invalid or expired token');
      return { message: 'Token verification failed', userId: null };
    }
  }
}
