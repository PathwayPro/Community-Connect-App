import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
  BadRequestException,
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
import { findUserById, userEmailExists } from 'src/common/utils/helper';
import { RolesEnum } from 'src/auth/util';
import { SettingsService } from '../settings/settings.services';
import { FileValidationEnum } from 'src/files/util/files-validation.enum';
import { FilesService } from 'src/files/files.service';
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly settingsService: SettingsService,
    private readonly filesService: FilesService,
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

    await this.settingsService.createUserSettings(newUser.id);

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
    const user = await this.prisma.users.findFirst({
      where: {
        id: Number(userIdNumber),
        deleted_at: false,
      },
      include: {
        skills: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userIdNumber} not found`);
    }

    const userData = this.mapToReadUserDto(user);
    return userData;
  }

  async getUserByUsername(email: string): Promise<ReadUserDto> {
    const user = await this.prisma.users.findFirst({
      where: {
        email,
        deleted_at: false,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return this.mapToReadUserDto(user);
  }

  async getUsers(): Promise<ReadUserDto[]> {
    const users = await this.prisma.users.findMany({});
    return users.map(this.mapToReadUserDto);
  }

  async getUsersPublicInfo(): Promise<PublicReadUserDto[]> {
    const users = await this.prisma.users.findMany({});

    console.log('users in public', users);

    const publicUsers = users.map((user) => this.mapToPublicReadUserDto(user));

    console.log('publicUsers', publicUsers);

    return publicUsers;
  }

  async getUserPublicInfoById(
    userIdNumber: string,
  ): Promise<PublicReadUserDto> {
    const user = await this.prisma.users.findFirst({
      where: {
        id: Number(userIdNumber),
        deleted_at: false,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const publicUser = this.mapToPublicReadUserDto(user);
    return publicUser;
  }

  async getUserByEmail(email: string): Promise<PublicReadUserDto> {
    try {
      const user = await this.prisma.users.findFirst({
        where: {
          email,
          deleted_at: false,
        },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const publicUser = this.mapToPublicReadUserDto(user);

      return publicUser;
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
  async addUser(user: CreateUserDto): Promise<ReadUserDto> {
    try {
      const newUser = await this.createUserInDatabase(user);

      await this.setupEmailVerification(newUser);

      const newUserDto = this.mapToReadUserDto(newUser);
      return newUserDto;
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
    file?: Express.Multer.File,
    resumeFile?: Express.Multer.File,
  ): Promise<ReadUserDto> {
    console.log('updateData', updateData);

    try {
      let fileLink = null;
      let resumeLink = null;

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

      // update the user's profile picture and only attempt yo upload if file was provided
      if (file) {
        const uploadedFile = await this.filesService.upload(
          FileValidationEnum.PROFILE_PICTURE,
          file,
        );

        if (!uploadedFile) {
          throw new BadRequestException('Failed to upload file');
        }

        fileLink = `${uploadedFile.path}/${uploadedFile.fileName}`;
      }

      // update the user's resume and only attempt yo upload if resumeFile was provided
      if (resumeFile) {
        const uploadedResume = await this.filesService.upload(
          FileValidationEnum.RESUME,
          resumeFile,
        );

        if (!uploadedResume) {
          throw new BadRequestException('Failed to upload resume');
        }

        resumeLink = `${uploadedResume.path}/${uploadedResume.fileName}`;
      }

      // Handle skills update - if skills is provided (even empty array), update them
      if (updateData.skills !== undefined) {
        try {
          const updatedSkills = await this.addUserSkillsFormatted(
            targetUserId,
            updateData.skills as unknown as number[],
          );
          console.log(`updatedSkills: ${updatedSkills}`);
          // No need to check updatedSkills since addUserSkillsFormatted handles empty arrays
        } catch (error) {
          this.logger.error(`Error updating skills: ${error.message}`);
          throw new InternalServerErrorException(
            'There was an error updating your skills. Please try again later.',
          );
        }
      }

      const updatedUser = await this.prisma.users.update({
        where: { id: targetUserId },
        data: {
          first_name: updateData.firstName,
          last_name: updateData.lastName,
          province: updateData.province,
          city: updateData.city,
          dob: updateData.dob,
          age_range: updateData.ageRange,
          languages: updateData.languages,
          profession: updateData.profession,
          experience: updateData.experience,
          bio: updateData.bio,
          picture_upload_link: fileLink,
          resume_upload_link: resumeLink,
          arrival_in_canada: updateData.arrivalInCanada,
          goal_id: updateData.goalId,
          linkedin_link: updateData.linkedinLink,
          github_link: updateData.githubLink,
          twitter_link: updateData.twitterLink,
          portfolio_link: updateData.portfolioLink,
          other_links: updateData.otherLinks,
          additional_links: updateData.additionalLinks,
          work_status: updateData.workStatus,
          company_name: updateData.companyName,
          country_of_origin: updateData.countryOfOrigin,
          actively_searching: updateData.activelySearching,
          // last_login: updateData.lastLogin,
          // deleted_at: updateData.deletedAt,
        },
      });

      const updatedUserDto = this.mapToReadUserDto(updatedUser);
      return updatedUserDto;
    } catch (error) {
      this.logger.error(
        `Error updating user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException ||
        error instanceof HttpException
      ) {
        throw error;
      }

      // Handle Prisma foreign key violation specifically
      if (error.code === 'P2003') {
        throw new HttpException(
          'Invalid goal ID provided',
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        'Failed to update user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(
    currentUserId: number,
    targetUserId: number,
  ): Promise<{ message: string }> {
    if (isNaN(targetUserId)) {
      throw new HttpException('Invalid user ID', HttpStatus.BAD_REQUEST);
    }

    try {
      // check if the user is an admin
      const currentUser = await this.prisma.users.findUnique({
        where: { id: currentUserId },
        select: { id: true, role: true },
      });

      if (!currentUser) {
        throw new NotFoundException(`User with ID ${currentUserId} not found`);
      }

      // check if the target user exists
      const targetUser = await findUserById(this.prisma, targetUserId);

      if (!targetUser) {
        throw new NotFoundException(`User with ID ${targetUserId} not found`);
      }

      // check if the current user is same as target user or current user is an admin
      if (
        currentUser.id !== targetUser.id &&
        currentUser.role !== RolesEnum.ADMIN
      ) {
        throw new UnauthorizedException(
          'You are not allowed to delete this user',
        );
      }

      await this.prisma.users.update({
        where: { id: targetUserId },
        data: { deleted_at: true },
      });

      return { message: `User with ID ${targetUserId} deleted successfully` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error(`Failed to delete user ${targetUserId}:`, error);
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
        provider: 'email',
        created_at: new Date(),
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

  async getUserProfessions(): Promise<string[]> {
    // Get all users and extract their professions
    const users = await this.prisma.users.findMany({
      where: {
        deleted_at: false,
        profession: {
          not: null,
        },
      },
      select: {
        profession: true,
      },
    });

    // Extract professions and filter out any empty strings
    const allProfessions = users
      .map((user) => user.profession)
      .filter((profession) => profession && profession.trim() !== '');

    // Create a unique list using Set
    const uniqueProfessions = [...new Set(allProfessions)];

    // Sort alphabetically
    return uniqueProfessions.sort();
  }

  private mapToReadUserDto(user: any): ReadUserDto {
    const readUser = new ReadUserDto();

    // Determine user status with clearer logic
    let status: string;
    const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    const isInactive =
      user.last_login &&
      Date.now() - new Date(user.last_login).getTime() > ONE_WEEK_MS;

    if (user.deleted_at === true) {
      status = 'DELETED';
    } else if (user.email_verified === true) {
      // Email verified users are active regardless of provider, but check last login
      status = isInactive ? 'INACTIVE' : 'ACTIVE';
    } else if (user.provider === 'google') {
      // Google users are active by default but still check last login
      status = isInactive ? 'INACTIVE' : 'ACTIVE';
    } else if (user.email_verified === false) {
      status = 'PENDING';
    } else {
      status = 'INACTIVE';
    }

    Object.assign(readUser, {
      id: user.id,
      firstName: user.first_name,
      middleName: user.middle_name,
      lastName: user.last_name,
      email: user.email,
      dob: user.dob,
      ageRange: user.age_range,
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
      workStatus: user.work_status,
      companyName: user.company_name,
      countryOfOrigin: user.country_of_origin,
      activelySearching: user.actively_searching,
      lastLogin: user.last_login,
      deletedAt: user.deleted_at,
      emailVerified: user.email_verified,
      status: status,
      skills: user.skills?.map((skill: any) => skill?.skill_id),
      provider: user.provider,
    });
    return readUser;
  }

  private mapToPublicReadUserDto(user: any): PublicReadUserDto {
    const publicUser = new PublicReadUserDto();
    Object.assign(publicUser, {
      id: user.id,
      firstName: user.first_name,
      middleName: user.middle_name,
      lastName: user.last_name,
      email: user.email,
      arrivalInCanada: user.arrival_in_canada,
      role: user.role as 'USER' | 'ADMIN' | 'MENTOR',
      countryOfOrigin: user.country_of_origin,
      companyName: user.company_name,
      bio: user.bio,
      profession: user.profession,
      experience: user.experience,
      linkedinLink: user.linkedin_link,
      githubLink: user.github_link,
      twitterLink: user.twitter_link,
      portfolioLink: user.portfolio_link,
      otherLinks: user.other_links,
      additionalLinks: user.additional_links,
      languages: user.languages,
      provider: user.provider,
    });
    return publicUser;
  }

  private async addUserSkillsFormatted(
    user_id: number,
    skills: string | number[],
  ) {
    try {
      // Handle null/undefined input
      if (!skills) {
        return [];
      }

      // Transform skills input into array of integers
      let skillsToArray: number[];
      try {
        skillsToArray =
          typeof skills === 'string'
            ? JSON.parse(skills).map((item: any) => parseInt(item, 10))
            : skills.map((item: any) => parseInt(item, 10));
      } catch (parseError) {
        this.logger.error(`Error parsing skills: ${parseError.message}`);
        return [];
      }

      // Remove previous skills for the user
      await this.prisma.usersSkills.deleteMany({
        where: { user_id: user_id },
      });

      // If no skills provided or parsing failed, return empty array
      if (!skillsToArray || !skillsToArray.length) {
        return [];
      }

      // Validate only existing skills and return formatted values
      const validSkillIds = await this.prisma.skills
        .findMany({
          where: { id: { in: skillsToArray } },
          select: { id: true },
        })
        .then((skills) =>
          skills.map((skill) => ({
            user_id: user_id,
            skill_id: skill.id,
          })),
        );

      // Add validated skills to the user
      if (validSkillIds.length > 0) {
        await this.prisma.usersSkills.createMany({
          data: validSkillIds,
          skipDuplicates: true,
        });
      }

      return validSkillIds;
    } catch (error) {
      this.logger.error(`Error in addUserSkillsFormatted: ${error.message}`);
      throw new InternalServerErrorException(
        'Error saving skills: ' + error.message,
      );
    }
  }
}
