import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Logger,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  UpdateUserDto,
  ReadUserDto,
  PublicReadUserDto,
} from './dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { RolesGuard } from '../auth/guards';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import {
  UserRegistrationResponseDto,
  UserDeleteResponseDto,
  ProfessionsResponseDto,
  UserUpdateResponseDto,
} from './dto/user-response.dto';

@ApiTags('Users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'Register new user',
    description: 'Create a new user account with email and password',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User registration data',
  })
  @ApiCreatedResponse({
    description: 'User successfully registered',
    type: UserRegistrationResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or email already exists',
  })
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.registerUser(createUserDto);
  }

  @Public()
  @Get('public-data')
  @ApiOperation({
    summary: 'Get public user data',
    description:
      'Retrieve public information for all users (no authentication required)',
  })
  @ApiOkResponse({
    description: 'Public user data retrieved successfully',
    type: [PublicReadUserDto],
  })
  getUsersPublicData() {
    return this.usersService.getUsersPublicInfo();
  }

  @Public()
  @Get('professions')
  @ApiOperation({
    summary: 'Get user professions',
    description: 'Retrieve list of all user professions',
  })
  @ApiOkResponse({
    description: 'Professions retrieved successfully',
    type: ProfessionsResponseDto,
  })
  async getProfessions() {
    return await this.usersService.getUserProfessions();
  }

  @Public()
  @Get('public-data/:userId')
  @ApiOperation({
    summary: 'Get public user data by ID',
    description:
      'Retrieve public information for a specific user (no authentication required)',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: '1',
  })
  @ApiOkResponse({
    description: 'Public user data retrieved successfully',
    type: PublicReadUserDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  async getUserPublicDataById(@Param('userId') userId: string) {
    return await this.usersService.getUserPublicInfoById(userId);
  }

  @Get('all')
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve all users (requires authentication)',
  })
  @ApiOkResponse({
    description: 'All users retrieved successfully',
    type: [ReadUserDto],
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  async getAllUsers() {
    return this.usersService.getUsers();
  }

  @Get('profile')
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Get current user profile',
    description: "Retrieve the authenticated user's profile information",
  })
  @ApiOkResponse({
    description: 'User profile retrieved successfully',
    type: ReadUserDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  async getUserProfile(@GetUser('sub') userId: string) {
    return await this.usersService.getUserById(userId);
  }

  @Get(':id')
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve user information by user ID',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '1',
  })
  @ApiOkResponse({
    description: 'User retrieved successfully',
    type: ReadUserDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  async getUserById(@Param('id') userId: string) {
    return await this.usersService.getUserById(userId);
  }

  @Get('email/:email')
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Get user by email',
    description: 'Retrieve user information by email address',
  })
  @ApiParam({
    name: 'email',
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @ApiOkResponse({
    description: 'User retrieved successfully',
    type: ReadUserDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  async getUserByEmail(@Param('email') email: string) {
    return await this.usersService.getUserByEmail(email);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Update user',
    description:
      'Update user information including profile picture and resume uploads',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID to update',
    example: '1',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UpdateUserDto,
    description: 'User update data and optional file uploads',
  })
  @ApiOkResponse({
    description: 'User updated successfully',
    type: UserUpdateResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or update failed',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'pictureUploadLink', maxCount: 1 },
      { name: 'resumeUploadLink', maxCount: 1 },
    ]),
  )
  async updateUser(
    @GetUser('sub') currentUserId: number,
    @Param('id', ParseIntPipe) targetUserId: number,
    @Req() request: Request,
    @UploadedFiles()
    files: {
      pictureUploadLink?: Express.Multer.File[];
      resumeUploadLink?: Express.Multer.File[];
    },
  ) {
    try {
      this.logger.debug(
        `Update request for user ${targetUserId} by user ${currentUserId}`,
      );

      // Parse FormData fields manually since @Body() doesn't work with FormData
      const updateUserDto = this.parseFormDataToUpdateUserDto(request.body);

      // Validate updateUserDto
      if (!updateUserDto || Object.keys(updateUserDto).length === 0) {
        throw new BadRequestException('Update data cannot be empty');
      }

      // Extract files
      const profilePictureFile = files?.pictureUploadLink?.[0];
      const resumeFile = files?.resumeUploadLink?.[0];

      // Check for file removal indicators
      const removeProfilePicture = request.body.removeProfilePicture === 'true';
      const removeResume = request.body.removeResume === 'true';

      this.logger.debug(
        `Files received: profile=${profilePictureFile?.originalname || 'none'}, resume=${resumeFile?.originalname || 'none'}`,
      );
      this.logger.debug(
        `File removal indicators: profile=${removeProfilePicture}, resume=${removeResume}`,
      );

      this.logger.debug(
        `Parsed update data: ${JSON.stringify(updateUserDto, null, 2)}`,
      );

      return await this.usersService.updateUser(
        currentUserId,
        targetUserId,
        updateUserDto,
        profilePictureFile,
        resumeFile,
        removeProfilePicture,
        removeResume,
      );
    } catch (error) {
      this.logger.error(
        `Error updating user ${targetUserId}: ${error.message}`,
      );

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(error.message || 'Failed to update user');
    }
  }

  private parseFormDataToUpdateUserDto(body: any): UpdateUserDto {
    const updateUserDto = new UpdateUserDto();

    // Map FormData fields to UpdateUserDto properties
    if (body.firstName !== undefined) updateUserDto.firstName = body.firstName;
    if (body.middleName !== undefined)
      updateUserDto.middleName = body.middleName;
    if (body.lastName !== undefined) updateUserDto.lastName = body.lastName;
    if (body.dob !== undefined) updateUserDto.dob = body.dob;
    if (body.ageRange !== undefined) updateUserDto.ageRange = body.ageRange;
    if (body.arrivalInCanada !== undefined)
      updateUserDto.arrivalInCanada = body.arrivalInCanada;
    if (body.goalId !== undefined) updateUserDto.goalId = body.goalId;
    if (body.province !== undefined) updateUserDto.province = body.province;
    if (body.city !== undefined) updateUserDto.city = body.city;
    if (body.profession !== undefined)
      updateUserDto.profession = body.profession;
    if (body.experience !== undefined)
      updateUserDto.experience = body.experience;
    if (body.bio !== undefined) updateUserDto.bio = body.bio;
    if (body.linkedinLink !== undefined)
      updateUserDto.linkedinLink = body.linkedinLink;
    if (body.githubLink !== undefined)
      updateUserDto.githubLink = body.githubLink;
    if (body.twitterLink !== undefined)
      updateUserDto.twitterLink = body.twitterLink;
    if (body.portfolioLink !== undefined)
      updateUserDto.portfolioLink = body.portfolioLink;
    if (body.otherLinks !== undefined)
      updateUserDto.otherLinks = body.otherLinks;
    if (body.languages !== undefined) updateUserDto.languages = body.languages;
    if (body.countryOfOrigin !== undefined)
      updateUserDto.countryOfOrigin = body.countryOfOrigin;
    if (body.workStatus !== undefined)
      updateUserDto.workStatus = body.workStatus;
    if (body.companyName !== undefined)
      updateUserDto.companyName = body.companyName;
    if (body.activelySearching !== undefined) {
      updateUserDto.activelySearching = body.activelySearching === 'true';
    }

    // Handle arrays that come as JSON strings
    if (body.additionalLinks !== undefined) {
      try {
        updateUserDto.additionalLinks = JSON.parse(body.additionalLinks);
      } catch {
        updateUserDto.additionalLinks = [];
      }
    }

    if (body.skills !== undefined) {
      try {
        updateUserDto.skills = JSON.parse(body.skills);
      } catch {
        updateUserDto.skills = [];
      }
    }

    return updateUserDto;
  }

  @Delete(':id')
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Delete user',
    description: 'Delete a user account (requires appropriate permissions)',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID to delete',
    example: '1',
  })
  @ApiOkResponse({
    description: 'User deleted successfully',
    type: UserDeleteResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  async deleteUser(
    @GetUser('sub') currentUserId: number,
    @Param('id', ParseIntPipe) targetUserId: number,
  ) {
    this.logger.debug(
      `Delete request for user ${targetUserId} by user ${currentUserId}`,
    );

    return await this.usersService.deleteUser(currentUserId, targetUserId);
  }
}
