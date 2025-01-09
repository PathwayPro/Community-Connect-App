import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
  CreateUserDto,
  PublicReadUserDto,
  ReadUserDto,
  UpdateUserDto,
} from './dto/user.dto';
import { AuthService } from '../auth/services/auth.service';
import { EmailService } from '../auth/services/email.service';
import {
  findUserByEmail,
  findUserById,
  userEmailExists,
} from 'src/common/utils/helper';
import { RolesEnum } from 'src/auth/util';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  // User Registration and Creation
  async registerUser(user: CreateUserDto) {
    await this.validateRegistration(user);

    const hashedPassword = await this.authService.hashPassword(
      user.passwordHash,
    );

    const userToCreate = {
      ...user,
      passwordHash: hashedPassword,
    };

    const newUser = await this.createUserInDatabase(userToCreate);

    await this.setupEmailVerification(newUser);

    const data = this.mapToReadUserDto(newUser);

    return {
      message: 'User registered, please check your email for verification link',
      ...data,
    };
  }

  private async validateRegistration(user: CreateUserDto): Promise<void> {
    if (user.passwordHash !== user.confirmPassword) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }

    if (!(await this.authService.isValidPassword(user.passwordHash))) {
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
    }

    if (await userEmailExists(this.prisma, user.email)) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }
  }

  // User Retrieval Methods
  async getUserById(userIdNumber: string): Promise<ReadUserDto> {
    const user = await findUserById(this.prisma, Number(userIdNumber));
    return this.mapToReadUserDto(user);
  }

  async getUserByUsername(email: string): Promise<ReadUserDto> {
    const user = await findUserByEmail(this.prisma, email);
    return this.mapToReadUserDto(user);
  }

  async getUsers(): Promise<ReadUserDto[]> {
    const users = await this.prisma.users.findMany();
    return users.map(this.mapToReadUserDto);
  }

  async getUsersPublicInfo(): Promise<PublicReadUserDto[]> {
    const users = await this.prisma.users.findMany();
    return users.map(this.mapToPublicReadUserDto);
  }

  async getUserPublicInfoById(
    userIdNumber: string,
  ): Promise<{ message: string; data: PublicReadUserDto }> {
    const user = await findUserById(this.prisma, Number(userIdNumber));

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const publicUser = this.mapToPublicReadUserDto(user);
    return { message: 'User found', data: publicUser };
  }

  async getUserByEmail(
    email: string,
  ): Promise<{ message: string; data: PublicReadUserDto }> {
    try {
      const user = await findUserByEmail(this.prisma, email);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const publicUser = this.mapToPublicReadUserDto(user);

      return { message: 'User found', data: publicUser };
    } catch (error) {
      this.logger.error(
        `Error fetching user by email: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new HttpException(
        'Failed to fetch user by email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // User Management Methods
  async addUser(
    user: CreateUserDto,
  ): Promise<{ message: string; data: ReadUserDto }> {
    try {
      const newUser = await this.createUserInDatabase(user);

      await this.setupEmailVerification(newUser);

      const newUserDto = this.mapToReadUserDto(newUser);
      return { message: 'User added successfully', data: newUserDto };
    } catch (error) {
      this.logger.error(
        `Error adding user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new HttpException(
        'User creation failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(
    currentUserId: number,
    targetUserId: number,
    updateData: UpdateUserDto,
  ): Promise<{ message: string; data: ReadUserDto }> {
    try {
      const existingUser = await this.prisma.users.findUnique({
        where: { id: targetUserId },
      });

      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      // Only allow users to update their own profile unless they're an admin
      if (
        existingUser.id !== currentUserId &&
        existingUser.role !== RolesEnum.ADMIN
      ) {
        throw new UnauthorizedException(
          'You are not allowed to update this user',
        );
      }

      const updatedUser = await this.prisma.users.update({
        where: { id: targetUserId },
        data: {
          first_name: updateData.firstName,
          last_name: updateData.lastName,
          province: updateData.province,
          city: updateData.city,
          dob: updateData.dob ? updateData.dob : undefined,
          languages: updateData.languages,
          profession: updateData.profession,
          experience: updateData.experience,
          bio: updateData.bio,
          picture_upload_link: updateData.pictureUploadLink,
          arrival_in_canada: updateData.arrivalInCanada,
          goal_id: updateData.goalId ? updateData.goalId : undefined,
          linkedin_link: updateData.linkedinLink,
          github_link: updateData.githubLink,
          twitter_link: updateData.twitterLink,
          portfolio_link: updateData.portfolioLink,
          other_links: updateData.otherLinks,
          additional_links: updateData.additionalLinks,
        },
      });

      const updatedUserDto = this.mapToReadUserDto(updatedUser);
      return { message: 'User updated successfully', data: updatedUserDto };
    } catch (error) {
      this.logger.error(
        `Error updating user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      throw new HttpException(
        'Failed to update user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(
    userId: number,
    currentUserId: number,
  ): Promise<{ message: string }> {
    if (isNaN(userId)) {
      throw new HttpException('Invalid user ID', HttpStatus.BAD_REQUEST);
    }

    try {
      const user = await findUserById(this.prisma, userId);

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      if (user.id !== currentUserId && user.role !== RolesEnum.ADMIN) {
        throw new UnauthorizedException(
          'You are not allowed to delete this user',
        );
      }

      await this.prisma.users.delete({ where: { id: userId } });
      return { message: `User with ID ${userId} deleted successfully` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error(`Failed to delete user ${userId}:`, error);
      throw new HttpException(
        'Failed to delete user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private convertToDateTime(dateString: string | Date): Date {
    return dateString instanceof Date ? dateString : new Date(dateString);
  }

  private async createUserInDatabase(
    userData: CreateUserDto,
  ): Promise<ReadUserDto> {
    const newUser = await this.prisma.users.create({
      data: {
        first_name: userData.firstName,
        middle_name: userData.middleName,
        last_name: userData.lastName,
        email: userData.email,
        password_hash: userData.passwordHash,
      },
    });

    return this.mapToReadUserDto(newUser);
  }

  private async setupEmailVerification(
    user: ReadUserDto,
  ): Promise<{ success: boolean; message: string }> {
    const token = this.emailService.generateToken(user.id);

    await this.prisma.users.update({
      where: { id: user.id },
      data: { verification_token: token },
    });

    const response = await this.emailService.sendVerificationEmail(
      user.email,
      token,
    );

    if (response.success) {
      return { success: true, message: 'Email verification sent' };
    } else {
      return { success: false, message: 'Failed to send email verification' };
    }
  }

  private mapToReadUserDto(user: any): ReadUserDto {
    const readUser = new ReadUserDto();
    Object.assign(readUser, {
      id: user.id,
      firstName: user.first_name,
      middleName: user.middle_name,
      lastName: user.last_name,
      email: user.email,
      dob: user.dob,
      showDob: user.show_dob,
      arrivalInCanada: user.arrival_in_canada,
      goalId: user.goal_id,
      role: user.role as 'USER' | 'ADMIN' | 'MENTOR',
      province: user.province,
      city: user.city,
      languages: user.languages,
      profession: user.profession,
      experience: user.experience,
      bio: user.bio,
      pictureUploadLink: user.picture_upload_link,
      resumeUploadLink: user.resume_upload_link,
      linkedinLink: user.linkedin_link,
      githubLink: user.github_link,
      twitterLink: user.twitter_link,
      portfolioLink: user.portfolio_link,
      otherLinks: user.other_links,
      additionalLinks: user.additional_links,
    });
    return readUser;
  }

  private mapToPublicReadUserDto(user: PublicReadUserDto): PublicReadUserDto {
    const publicUser = new PublicReadUserDto();
    Object.assign(publicUser, {
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      email: user.email,
      arrivalInCanada: user.arrivalInCanada,
      role: user.role as 'USER' | 'ADMIN' | 'MENTOR',
    });
    return publicUser;
  }
}
