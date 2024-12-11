import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    //   this.transporter = nodemailer.createTransport({
    //     host: process.env.EMAIL_HOST,
    //     port: parseInt(process.env.EMAIL_PORT, 10),
    //     auth: {
    //       user: process.env.EMAIL_USER,
    //       pass: process.env.EMAIL_PASS,
    //     },
    //   });

    // Looking to send emails in production? Check out our Email API/SMTP product!
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Generate a verification token for the user
  generateVerificationToken(userId: number): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }
    console.log('userId: ' + userId);

    return jwt.sign({ userId }, secret, { expiresIn: '1h' });
  }

  // Send verification email
  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationLink = `${process.env.FRONTEND_URL}/auth/verify-email?token=${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: process.env.EMAIL_SUBJECT,
      text: `${process.env.EMAIL_BODY}: ${verificationLink}`,
      html: `
      <html>
        <body>
          <h1>${process.env.EMAIL_BODY}</h1>
          <p>Please click the link below to verify your email address:</p>
          <a href="${verificationLink}">${verificationLink}</a>
        </body>
      </html>
    `,
    };

    try {
      console.log(`verification link ${verificationLink}`);
      await this.transporter.sendMail(mailOptions);
      console.log('Verification email sent');
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendResetEmail(email: string, token: string): Promise<void> {
    // Construct the password reset link
    const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;

    // Create the email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request', // You can customize this
      text: `To reset your password, click the link below:\n${resetLink}`,
      html: `
      <html>
        <body>
          <h1>Password Reset Request</h1>
          <p>We received a request to reset your password. Click the link below to reset your password:</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>If you didn't request this, please ignore this email.</p>
        </body>
      </html>
    `,
    };

    try {
      console.log(`Password reset link: ${resetLink}`);
      await this.transporter.sendMail(mailOptions); // Send the email using your transporter
      console.log('Password reset email sent');
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  // Verify the token when the user clicks the verification link
  async verifyEmailToken(token: string): Promise<number> {
    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error(
          'JWT_SECRET is not defined in the environment variables',
        );
      }
      const decoded = jwt.verify(token, secret);
      return decoded['userId']; // Get user ID from the decoded token
    } catch (error) {
      console.error('Invalid or expired token:', error);
      throw new Error('Invalid or expired token');
    }
  }
}
