import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service'; // Adjust the path accordingly
import { JwtService } from '@nestjs/jwt';
import { EmailService } from './email.Service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService, // Assuming you have a Prisma service
    private readonly jwtService: JwtService, // JWT service for token generation
    private readonly emailService: EmailService,
  ) {}

  async loginUser(
    username: string,
    password: string,
  ): Promise<{ token: string } | { message: string }> {
    console.log(username, password);
    if (!username || !password) {
      throw new UnauthorizedException('Username and password are required');
    }

    const user = await this.prisma.users.findUnique({
      where: { email: username },
    });
    console.log('user found', user);
    if (!user) {
      const message = `User ${username} not found`;
      console.error(message);
      throw new UnauthorizedException('Invalid username or password');
    }
    if (!user.email_verified) {
      console.log('Email not verified!!');
      throw new UnauthorizedException('Email not verified');
    }

    const hashedPassword = user.password_hash;
    const passwordMatch = await this.verifyPassword(password, hashedPassword);
    if (!passwordMatch) {
      console.log('Password mismatch!!');
      throw new UnauthorizedException('Invalid username or password');
    }

    // Generate JWT
    const payload = { sub: user.id, email: user.email }; // `sub` is typically the user ID
    const token = this.jwtService.sign(payload);

    console.log('Login successful. Token generated:', token);

    return { token };
  }

  //   async loginUser(username: string, password: string): Promise<boolean> {
  //     if (!username || !password) {
  //       return false;
  //     }

  //     const user = await this.prisma.users.findUnique({
  //       where: { email: username },
  //     });
  //     if (!user) {
  //       return false;
  //     }
  //     const hashedPassword = user.password_hash;

  //     const passwordMatch = await this.verifyPassword(password, hashedPassword);
  //     if (!passwordMatch) {
  //       console.log('Password mismatch!!');
  //       return false;
  //     }
  //     console.log('Password matched');
  //     return true;
  //   }

  async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async isValidPassword(password: string): Promise<boolean> {
    if (!password) {
      return false; // Password cannot be empty
    }

    if (password.length < 9) {
      return false; // Minimum length is 9
    }
    console.log(`isValidPassword check password: ${password}`);
    // Regular expression to check for at least one letter, one number, and one special character
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,}$/;
    console.log(`Regex test for password: ${regex.test(password)}`);

    return regex.test(password); // Returns true if password matches the criteria
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async resetPassword(
    email: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<void> {
    try {
      const user = await this.prisma.users.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const oldPasswordMatch = await this.verifyPassword(
        oldPassword,
        user.password_hash,
      );
      if (!oldPasswordMatch) {
        throw new Error('Old password does not match');
      }

      if (newPassword !== confirmPassword) {
        throw new Error('New password and confirm password do not match');
      }

      const hashedNewPassword = await this.hashPassword(newPassword);
      await this.prisma.users.update({
        where: { id: user.id },
        data: { password_hash: hashedNewPassword },
      });
    } catch (err) {
      console.error('Error in resetPassword service: ', err);
      throw new Error(
        err.message || 'An error occurred while resetting password',
      );
    }
  }

  async generateResetToken(email: string) {
    try {
      if (!email) {
        throw new Error('email is required');
      }
      console.log('generating reset token email : ' + email);
      //   const userId = Number(id);
      const user = await this.prisma.users.findUnique({
        where: { email: email },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const token = this.emailService.generateVerificationToken(user.id);
      console.log('Reset token generated:', token);
      await this.prisma.users.update({
        where: { id: user.id },
        data: {
          verification_token: token,
        },
      });

      return token;
    } catch (err) {
      console.error('Error in generateResetToken service: ', err);
      throw new Error(
        err.message || 'An error occurred while generating reset token',
      );
    }
  }

  async updateNewPassword(userId: string, newPassword: string) {
    try {
      const id = Number(userId);
      const hashedNewPassword = await this.hashPassword(newPassword);

      // Update the password
      await this.prisma.users.update({
        where: { id },
        data: { password_hash: hashedNewPassword },
      });

      // Log and return success response
      console.log('Password updated successfully!');
      return { message: 'Password updated successfully!' };
    } catch (err) {
      console.error('Error in updateNewPassword service: ', err);
      throw new Error(
        err.message || 'An error occurred while updating the new password',
      );
    }
  }

  //   async logout(user: string): Promise<boolean> {
  //     // Implement logout logic (e.g., invalidate JWT token)
  //     // Example:
  //     // const token = await this.jwtService.signAsync({ userId: user.id });
  //     // await this.jwtService.deleteToken(token);

  //     // For now, we will just return true
  //     return true;
  //   }
}
