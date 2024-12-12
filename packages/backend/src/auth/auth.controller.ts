import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service'; // Adjust the path accordingly

import { Response } from 'express'; // Import Response from express
import * as jwt from 'jsonwebtoken';
import { EmailService } from './email.Service';
import { console } from 'inspector';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  @Post('login')
  async loginUser(
    @Body('username') username: string,
    @Body('password') password: string,
    @Res() res: Response,
  ): Promise<void> {
    const token = await this.authService.loginUser(username, password);
    console.log(`login token: ${token}`);

    if (token) {
      // Send the JWT token as a cookie or in the response body
      res.cookie('jwt', token, { httpOnly: true }); // Optionally use cookies
      res.json({ message: 'Login successful', token }); // Or return as JSON
    } else {
      res.status(401).json({ message: 'Invalid username or password.' });
    }
  }
  @Get('login') // This is the route that responds to GET /auth/login
  getLoginPage() {
    return { message: 'Please log in with your username and password.' };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res() res: Response): void {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.json({ message: 'Logout successful' });
  }

  @Get('verify-email')
  async verifyEmail(
    @Query('token') token: string,
    @Res() res: Response,
  ): Promise<any> {
    try {
      // Step 1: Decode and verify the token
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

      console.log('decoded token :', decoded);
      // Step 2: Check if the token has expired (Optional, if you want to handle expiration explicitly)
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        throw new BadRequestException('Token has expired');
      }

      // Check if `userId` exists and is a valid value
      if (!decoded.userId) {
        throw new Error('User ID not found in token');
      }

      const userId = Number(decoded.userId); // Convert to number if it's a string

      // Step 3: Find the user using the decoded token data (user ID)
      const user = await this.prisma.users.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
      console.log('User ID:', user.id); // Add this log to ensure the user is retrieved correctly.

      // Step 4: If user exists and token is valid, update the `email_verified` field to true
      await this.prisma.users.update({
        where: { id: user.id },
        data: { email_verified: true, verification_token: null }, // Clear the token after verification
      });

      // Step 5: Send a success message to the user
      res.status(200).json({ message: 'Email successfully verified!' });
    } catch (error) {
      // Handle specific errors here
      console.error(error);

      // If the token is invalid or expired
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }

      // For other errors (e.g., user not found)
      const statusCode = error instanceof NotFoundException ? 404 : 400;
      return res.status(statusCode).json({
        message:
          error.message || 'Something went wrong during email verification.',
      });
    }
  }

  @Post('update-password')
  async updatePassword(
    @Body('email') email: string,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
    @Body('confirmPassword') confirmPassword: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      await this.authService.resetPassword(
        email,
        oldPassword,
        newPassword,
        confirmPassword,
      );
      return res.status(200).json({
        message: 'Password successfully reset',
      });
    } catch (err) {
      console.error('Error resetting password: ', err);
      return res.status(400).json({
        message: err.message || 'An error occurred while resetting password',
      });
    }
  }
  @Post('forgot-password')
  async forgotPassword(
    @Body('email') email: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      // Generate a reset token
      const token = await this.authService.generateResetToken(email);

      // Send the token to the user's email
      await this.emailService.sendResetEmail(email, token);

      return res.status(200).json({
        message: 'Password reset email sent successfully.',
      });
    } catch (err) {
      console.error('Error in forgot-password: ', err);
      return res.status(400).json({
        message:
          err.message ||
          'An error occurred while requesting the password reset.',
      });
    }
  }

  @Get('/reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Res() res: Response,
  ): Promise<any> {
    try {
      // Decode and verify the token
      const decoded: any = await jwt.verify(token, process.env.JWT_SECRET);

      // Check if the token has expired
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        throw new BadRequestException('Token has expired');
      }

      // Check if userId exists
      if (!decoded.userId) {
        throw new Error('User ID not found in token');
      }

      const userId = Number(decoded.userId); // Convert to number if it's a string

      // Find user using the decoded token data
      const user = await this.prisma.users.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Redirect to `/new-password` with token as query param
      return res.redirect(`/auth/new-password?token=${token}`);
    } catch (error) {
      console.error(error);
      // If the token is invalid or expired
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }
      // Handle other errors (user not found)
      const statusCode = error instanceof NotFoundException ? 404 : 400;
      return res.status(statusCode).json({
        message:
          error.message || 'Something went wrong during email verification.',
      });
    }
  }

  @Get('/new-password')
  async updateNewPasswordGet(
    @Query('token') token: string,
    @Res() res: Response,
  ): Promise<Response> {
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    // Return the token in the response (you can use this to pre-fill the form in the frontend)
    return res.status(200).json({
      message: 'Token is valid. Please proceed with resetting your password.',
      token, // Returning token for the POST request
    });
  }

  @Post('/new-password')
  async updateNewPassword(
    @Query('token') token: string,
    @Body('newPassword') newPassword: string,
    @Body('confirmPassword') confirmPassword: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      // Decode the token to extract userId
      const decoded: any = await jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;

      if (!userId) {
        return res
          .status(400)
          .json({ message: 'Invalid token, user not found' });
      }

      // Validate the new password against minimum requirements
      if (!this.authService.isValidPassword(newPassword)) {
        return res
          .status(400)
          .json({ message: 'Password does not meet minimum requirements' });
      }

      // Validate the new password against the confirm password
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }

      // Hash the new password
      const hashedPassword = await this.authService.hashPassword(newPassword);

      // Update the password in the database using the userId and hashedPassword
      const user = await this.prisma.users.update({
        where: { id: userId },
        data: { password_hash: hashedPassword },
      });

      // Clear the token after successful password update
      await this.authService.generateResetToken(user.email);

      console.log('Password updated successfully!');
      // Send a success response
      return res.status(200).json({
        message: 'Password updated successfully. Please log in again.',
      });
    } catch (err) {
      console.error('Error updating password: ', err);
      return res.status(400).json({
        message: err.message || 'An error occurred while updating password',
      });
    }
  }

  // @Post('/login')
  // async loginUser(
  //   @Body('username') username: string,
  //   @Body('password') password: string,
  //   @Res() res: Response,
  // ): Promise<void> {
  //   const isAuthenticated = await this.authService.loginUser(
  //     username,
  //     password,
  //   );

  //   if (isAuthenticated) {
  //     // Redirect to the homepage
  //     return res.redirect('/');
  //   } else {
  //     // Send an error response
  //     res.status(401).json({ message: 'Invalid username or password.' });
  //   }
  // }
}
