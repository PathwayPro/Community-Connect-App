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
      adminEmail: this.configService.get<string>('ADMIN_EMAIL'),
      noReplyEmail: this.configService.get<string>('NO_REPLY_EMAIL'),
    };

    // Validate config
    Object.entries(config).forEach(([key, value]) => {
      if (!value) throw new Error(`Missing configuration: ${key}`);
    });

    return config as EmailConfig;
  }

  private createTransporter(): nodemailer.Transporter {
    const isDevelopment =
      this.configService.get<string>('APP_ENVIRONMENT') === 'DEV';

    return nodemailer.createTransport({
      host: this.config.host,
      port: this.config.port,
      secure: !isDevelopment, // SET secure = false for dev environment
      auth: {
        user: this.config.user,
        pass: this.config.pass,
      },
      tls: {
        rejectUnauthorized: !isDevelopment, // SET secure = false for dev environment
      },
    });
  }

  private async sendEmail(
    options: EmailOptions,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const info = await this.transporter.sendMail({
        from: `Community Connect <${this.config.noReplyEmail}>`,
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

  private getEmailTemplate(
    header: string,
    content: string,
    buttonText: string,
    buttonUrl: string,
    footerText?: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Community Connect</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #262626;
            background-color: #f8f9fa;
          }
          
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          
          .header {
            background: linear-gradient(135deg, #374983 0%, #546495 100%);
            padding: 40px 30px;
            text-align: center;
          }
          
          .logo {
            display: inline-block;
            width: 60px;
            height: 60px;
            background: #ffffff;
            border-radius: 50%;
            margin-bottom: 20px;
            position: relative;
          }
          
          .logo::before {
            content: "CC";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 24px;
            font-weight: bold;
            color: #374983;
          }
          
          .header h1 {
            color: #ffffff;
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 8px;
          }
          
          .header p {
            color: #e8edff;
            font-size: 16px;
            opacity: 0.9;
          }
          
          .content {
            padding: 40px 30px;
            text-align: center;
          }
          
          .content h2 {
            color: #374983;
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 20px;
          }
          
          .content p {
            color: #262626;
            font-size: 16px;
            margin-bottom: 30px;
            line-height: 1.7;
          }
          
          .button-container {
            margin: 40px 0;
          }
          
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #D6A04D 0%, #FCBC5B 100%);
            color: #ffffff;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            box-shadow: 0 4px 12px rgba(214, 160, 77, 0.3);
            transition: all 0.3s ease;
          }
          
          .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(214, 160, 77, 0.4);
          }
          
          .footer {
            background-color: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
          }
          
          .footer p {
            color: #6c757d;
            font-size: 14px;
            margin-bottom: 10px;
          }
          
          .footer a {
            color: #374983;
            text-decoration: none;
          }
          
          .footer a:hover {
            text-decoration: underline;
          }
          
          .security-note {
            background-color: #e8edff;
            border-left: 4px solid #374983;
            padding: 20px;
            margin: 30px 0;
            border-radius: 0 8px 8px 0;
          }
          
          .security-note p {
            color: #374983;
            font-size: 14px;
            margin: 0;
          }
          
          @media only screen and (max-width: 600px) {
            .email-container {
              margin: 10px;
              border-radius: 8px;
            }
            
            .header {
              padding: 30px 20px;
            }
            
            .header h1 {
              font-size: 24px;
            }
            
            .content {
              padding: 30px 20px;
            }
            
            .content h2 {
              font-size: 20px;
            }
            
            .cta-button {
              padding: 14px 28px;
              font-size: 14px;
            }
            
            .footer {
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <div class="logo"></div>
            <h1>Community Connect</h1>
            <p>Connecting immigrants in tech</p>
          </div>
          
          <div class="content">
            <h2>${header}</h2>
            <p>${content}</p>
            
            <div class="button-container">
              <a href="${buttonUrl}" class="cta-button">${buttonText}</a><br /><br />
              Or copy and paste the following link into your browser: ${buttonUrl}
            </div>
            
            ${footerText ? `<div class="security-note"><p>${footerText}</p></div>` : ''}
          </div>
          
          <div class="footer">
            <p>© 2024 Community Connect. All rights reserved.</p>
            <p>If you have any questions, please contact us at <a href="mailto:immigranttechiesab@gmail.com ">immigranttechiesab@gmail.com </a></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  public async sendVerificationEmail(
    email: string,
    token: string,
  ): Promise<{ success: boolean; message: string }> {
    const verificationLink = `${this.config.frontendUrl}/auth/verify-email?token=${token}`;

    const html = this.getEmailTemplate(
      'Verify Your Email Address',
      'Welcome to Community Connect! To complete your registration and start connecting with fellow immigrants in tech, please verify your email address by clicking the button below.',
      'Verify Email Address',
      verificationLink,
      "This verification link will expire in 1 hour for your security. If you didn't create an account, you can safely ignore this email.",
    );

    const response = await this.sendEmail({
      to: email,
      subject: 'Welcome to Community Connect - Verify Your Email',
      text: `Welcome to Community Connect! Please verify your email by clicking: ${verificationLink}`,
      html,
    });

    console.log('RESPONSE EN sendVerificationEmail: ', response);

    return response;
  }

  public async sendPasswordResetEmail(
    email: string,
    token: string,
  ): Promise<{ success: boolean; message: string }> {
    const resetLink = `${this.config.frontendUrl}/auth/reset-password?token=${token}`;

    const html = this.getEmailTemplate(
      'Reset Your Password',
      'We received a request to reset your password for your Community Connect account. Click the button below to create a new password and regain access to your account.',
      'Reset Password',
      resetLink,
      "This password reset link will expire in 1 hour for your security. If you didn't request a password reset, you can safely ignore this email.",
    );

    const response = await this.sendEmail({
      to: email,
      subject: 'Reset Your Community Connect Password',
      text: `To reset your password, click: ${resetLink}`,
      html,
    });

    return response;
  }

  public async sendEmailToAdmin(
    contact_message: string,
    email: string,
    first_name: string,
    last_name: string | null,
    phone: string | null,
    company_name: string | null,
  ): Promise<{ success: boolean; message: string }> {
    const adminEmail = this.config.adminEmail;

    if (!adminEmail) {
      throw new Error('Admin email is not configured');
    }

    const fullName = last_name ? `${first_name} ${last_name}` : first_name;
    const subject = `New Contact Message from ${fullName}`;
    const senderEmail = `"${fullName}" <${email}>`;

    // Build text content conditionally
    const text = `
      Subject: ${subject}
      Email: ${email}
      First Name: ${first_name}
      ${last_name ? `Last Name: ${last_name}\n` : ''}${phone ? `Phone: ${phone}\n` : ''}${company_name ? `Company Name: ${company_name}\n` : ''}Contact Message: ${contact_message}
    `;

    // Create styled HTML for admin contact form
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Message - Community Connect</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #262626;
            background-color: #f8f9fa;
          }
          
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          
          .header {
            background: linear-gradient(135deg, #374983 0%, #546495 100%);
            padding: 30px;
            text-align: center;
          }
          
          .header h1 {
            color: #ffffff;
            font-size: 24px;
            font-weight: 600;
          }
          
          .content {
            padding: 30px;
          }
          
          .message-card {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 25px;
            margin-bottom: 20px;
            border-left: 4px solid #374983;
          }
          
          .field {
            margin-bottom: 15px;
          }
          
          .field-label {
            font-weight: 600;
            color: #374983;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
          }
          
          .field-value {
            color: #262626;
            font-size: 16px;
            padding: 8px 0;
          }
          
          .message-content {
            background-color: #ffffff;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            padding: 15px;
            margin-top: 10px;
          }
          
          .footer {
            background-color: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
          }
          
          .footer p {
            color: #6c757d;
            font-size: 14px;
          }
          
          @media only screen and (max-width: 600px) {
            .email-container {
              margin: 10px;
              border-radius: 8px;
            }
            
            .header, .content, .footer {
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>New Contact Message</h1>
          </div>
          
          <div class="content">
            <div class="message-card">
              <div class="field">
                <div class="field-label">From</div>
                <div class="field-value">${fullName}</div>
              </div>
              
              <div class="field">
                <div class="field-label">Email</div>
                <div class="field-value">${email}</div>
              </div>
              
              ${
                phone
                  ? `
                <div class="field">
                  <div class="field-label">Phone</div>
                  <div class="field-value">${phone}</div>
                </div>
              `
                  : ''
              }
              
              ${
                company_name
                  ? `
                <div class="field">
                  <div class="field-label">Company</div>
                  <div class="field-value">${company_name}</div>
                </div>
              `
                  : ''
              }
              
              <div class="field">
                <div class="field-label">Message</div>
                <div class="message-content">${contact_message}</div>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p>This message was sent from the Community Connect contact form</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const response = await this.sendEmail({
      to: adminEmail,
      from: senderEmail,
      subject,
      text,
      html,
    });

    return response;
  }

  public verifyToken(token: string): { message: string; userId: number } {
    console.log('token here first', token);
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
