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

    this.logger.debug(`Found ${users.length} users for public info`);

    const publicUsers = users.map((user) => this.mapToPublicReadUserDto(user));

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
    profilePictureFile?: Express.Multer.File,
    resumeFile?: Express.Multer.File,
    removeProfilePicture?: boolean,
    removeResume?: boolean,
  ): Promise<ReadUserDto> {
    this.logger.debug(`Updating user ${targetUserId} by user ${currentUserId}`);

    try {
      // Validate updateData is not empty
      if (!updateData || Object.keys(updateData).length === 0) {
        throw new BadRequestException('Update data cannot be empty');
      }

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

      // Handle file uploads and removals
      const { profilePictureLink, resumeLink } = await this.handleFileUploads(
        existingUser,
        profilePictureFile,
        resumeFile,
        removeProfilePicture,
        removeResume,
      );

      // Handle skills update
      if (updateData.skills !== undefined) {
        await this.updateUserSkills(targetUserId, updateData.skills);
      }

      // Build update data object
      const updateDataObject = this.buildUpdateDataObject(
        updateData,
        profilePictureLink,
        resumeLink,
      );

      this.logger.debug(
        `Updating user with data: ${JSON.stringify(updateDataObject, null, 2)}`,
      );

      const updatedUser = await this.prisma.users.update({
        where: { id: targetUserId },
        data: updateDataObject,
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

  private async handleFileUploads(
    existingUser: any,
    profilePictureFile?: Express.Multer.File,
    resumeFile?: Express.Multer.File,
    removeProfilePicture?: boolean,
    removeResume?: boolean,
  ): Promise<{ profilePictureLink: string | null; resumeLink: string | null }> {
    let profilePictureLink = existingUser.picture_upload_link;
    let resumeLink = existingUser.resume_upload_link;

    // Handle profile picture upload or removal
    if (profilePictureFile) {
      try {
        // Delete old profile picture if it exists
        if (existingUser.picture_upload_link) {
          await this.filesService.deleteFile(existingUser.picture_upload_link);
          this.logger.debug(
            `Deleted old profile picture: ${existingUser.picture_upload_link}`,
          );
        }

        const uploadedFile = await this.filesService.upload(
          FileValidationEnum.PROFILE_PICTURE,
          profilePictureFile,
        );

        if (!uploadedFile) {
          throw new BadRequestException('Failed to upload profile picture');
        }

        profilePictureLink = `${uploadedFile.path}/${uploadedFile.fileName}`;
        this.logger.debug(`Profile picture uploaded: ${profilePictureLink}`);
      } catch (error) {
        this.logger.error(`Profile picture upload failed: ${error.message}`);
        throw new BadRequestException('Failed to upload profile picture');
      }
    } else if (removeProfilePicture && existingUser.picture_upload_link) {
      // Handle profile picture removal
      try {
        await this.filesService.deleteFile(existingUser.picture_upload_link);
        this.logger.debug(
          `Deleted profile picture: ${existingUser.picture_upload_link}`,
        );
        profilePictureLink = null;
      } catch (error) {
        this.logger.error(`Profile picture deletion failed: ${error.message}`);
        // Don't throw error for deletion failure, just log it
      }
    }

    // Handle resume upload or removal
    if (resumeFile) {
      try {
        // Delete old resume if it exists
        if (existingUser.resume_upload_link) {
          await this.filesService.deleteFile(existingUser.resume_upload_link);
          this.logger.debug(
            `Deleted old resume: ${existingUser.resume_upload_link}`,
          );
        }

        const uploadedResume = await this.filesService.upload(
          FileValidationEnum.RESUME,
          resumeFile,
        );

        if (!uploadedResume) {
          throw new BadRequestException('Failed to upload resume');
        }

        resumeLink = `${uploadedResume.path}/${uploadedResume.fileName}`;
        this.logger.debug(`Resume uploaded: ${resumeLink}`);
      } catch (error) {
        this.logger.error(`Resume upload failed: ${error.message}`);
        throw new BadRequestException('Failed to upload resume');
      }
    } else if (removeResume && existingUser.resume_upload_link) {
      // Handle resume removal
      try {
        await this.filesService.deleteFile(existingUser.resume_upload_link);
        this.logger.debug(`Deleted resume: ${existingUser.resume_upload_link}`);
        resumeLink = null;
      } catch (error) {
        this.logger.error(`Resume deletion failed: ${error.message}`);
        // Don't throw error for deletion failure, just log it
      }
    }

    return { profilePictureLink, resumeLink };
  }

  private async updateUserSkills(
    userId: number,
    skills: number[],
  ): Promise<void> {
    try {
      // Remove previous skills for the user
      await this.prisma.usersSkills.deleteMany({
        where: { user_id: userId },
      });

      // If no skills provided, return early
      if (!skills || !skills.length) {
        return;
      }

      // Validate only existing skills
      const validSkillIds = await this.prisma.skills
        .findMany({
          where: { id: { in: skills } },
          select: { id: true },
        })
        .then((skills) =>
          skills.map((skill) => ({
            user_id: userId,
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

      this.logger.debug(
        `Updated ${validSkillIds.length} skills for user ${userId}`,
      );
    } catch (error) {
      this.logger.error(`Error updating skills: ${error.message}`);
      throw new InternalServerErrorException(
        'There was an error updating your skills. Please try again later.',
      );
    }
  }

  private buildUpdateDataObject(
    updateData: UpdateUserDto,
    profilePictureLink: string | null,
    resumeLink: string | null,
  ): any {
    const updateDataObject: any = {};

    // Map UpdateUserDto fields to database fields
    const fieldMappings = {
      firstName: 'first_name',
      lastName: 'last_name',
      middleName: 'middle_name',
      province: 'province',
      city: 'city',
      dob: 'dob',
      ageRange: 'age_range',
      languages: 'languages',
      profession: 'profession',
      experience: 'experience',
      bio: 'bio',
      arrivalInCanada: 'arrival_in_canada',
      goalId: 'goal_id',
      linkedinLink: 'linkedin_link',
      githubLink: 'github_link',
      twitterLink: 'twitter_link',
      portfolioLink: 'portfolio_link',
      otherLinks: 'other_links',
      additionalLinks: 'additional_links',
      workStatus: 'work_status',
      companyName: 'company_name',
      countryOfOrigin: 'country_of_origin',
      activelySearching: 'actively_searching',
    };

    // Only include fields that are defined in updateData
    Object.entries(fieldMappings).forEach(([dtoField, dbField]) => {
      if (updateData[dtoField] !== undefined) {
        updateDataObject[dbField] = updateData[dtoField];
      }
    });

    // Always update file links
    updateDataObject.picture_upload_link = profilePictureLink;
    updateDataObject.resume_upload_link = resumeLink;

    return updateDataObject;
  }

  async deleteUser(
    currentUserId: number,
    targetUserId: number,
  ): Promise<{ message: string }> {
    if (isNaN(targetUserId)) {
      throw new HttpException('Invalid user ID', HttpStatus.BAD_REQUEST);
    }

    try {
      // Check if the user is an admin
      const currentUser = await this.prisma.users.findUnique({
        where: { id: currentUserId },
        select: { id: true, role: true },
      });

      if (!currentUser) {
        throw new NotFoundException(`User with ID ${currentUserId} not found`);
      }

      // Check if the target user exists
      const targetUser = await findUserById(this.prisma, targetUserId);

      if (!targetUser) {
        throw new NotFoundException(`User with ID ${targetUserId} not found`);
      }

      // Check if the current user is same as target user or current user is an admin
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

  private convertToDateTime(dateString: string | Date): Date {
    return dateString instanceof Date ? dateString : new Date(dateString);
  }

  private async createUserInDatabase(
    userData: CreateUserDto,
  ): Promise<ReadUserDto> {
    try {
      // First check if user with email already exists
      const existingUser = await this.prisma.users.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        throw new HttpException(
          'User with this email already exists',
          HttpStatus.CONFLICT,
        );
      }

      // Try to create the user
      try {
        const newUser = await this.prisma.users.create({
          data: {
            first_name: userData.firstName,
            middle_name: userData.middleName,
            last_name: userData.lastName,
            email: userData.email,
            password_hash: userData.passwordHash,
            provider: 'email',
            created_at: new Date(),
            role: 'USER',
            deleted_at: false,
            email_verified: false,
          },
        });

        return this.mapToReadUserDto(newUser);
      } catch (createError) {
        // If we get a unique constraint error on id, try to fix the sequence
        if (
          createError.code === 'P2002' &&
          createError.meta?.target?.includes('id')
        ) {
          // Force a sequence reset
          await this.prisma.$queryRaw`
            SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM users), true);
          `;

          // Try creating the user again
          const newUser = await this.prisma.users.create({
            data: {
              first_name: userData.firstName,
              middle_name: userData.middleName,
              last_name: userData.lastName,
              email: userData.email,
              password_hash: userData.passwordHash,
              provider: 'email',
              created_at: new Date(),
              role: 'USER',
              deleted_at: false,
              email_verified: false,
            },
          });

          return this.mapToReadUserDto(newUser);
        }
        throw createError;
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `Error creating user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new HttpException(
        'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
}
