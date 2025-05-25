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
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { RolesGuard } from '../auth/guards';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.registerUser(createUserDto);
  }

  @Public()
  @Get('public-data')
  getUsersPublicData() {
    return this.usersService.getUsersPublicInfo();
  }

  @Public()
  @Get('professions')
  async getProfessions() {
    return await this.usersService.getUserProfessions();
  }

  @Public()
  @Get('public-data/:userId')
  async getUserPublicDataById(@Param('userId') userId: string) {
    return await this.usersService.getUserPublicInfoById(userId);
  }

  @Get('all')
  async getAllUsers() {
    return this.usersService.getUsers();
  }

  @Get('profile')
  async getUserProfile(@GetUser('sub') userId: string) {
    return await this.usersService.getUserById(userId);
  }

  @Get(':id')
  async getUserById(@Param('id') userId: string) {
    return await this.usersService.getUserById(userId);
  }

  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    return await this.usersService.getUserByEmail(email);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'pictureUploadLink', maxCount: 1 },
      { name: 'resumeUploadLink', maxCount: 1 },
    ]),
  )
  async updateUser(
    @GetUser('sub') currentUserId: number,
    @Param('id', ParseIntPipe) targetUserId: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFiles()
    files: {
      pictureUploadLink?: Express.Multer.File[];
      resumeUploadLink?: Express.Multer.File[];
    },
  ) {
    try {
      console.log('Request received:', {
        currentUserId,
        targetUserId,
        updateUserDto,
        files: files ? Object.keys(files) : 'no files',
      });

      const pictureUploadLink = files?.pictureUploadLink?.[0];
      const resumeUploadLink = files?.resumeUploadLink?.[0];

      if (!updateUserDto) {
        console.log(
          'updateUserDto is undefined. Raw request body:',
          updateUserDto,
        );
        throw new BadRequestException('Update data is required');
      }

      return await this.usersService.updateUser(
        currentUserId,
        targetUserId,
        updateUserDto,
        pictureUploadLink,
        resumeUploadLink,
      );
    } catch (error) {
      console.error('Error in updateUser:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message || 'Failed to update user');
    }
  }

  @Delete(':id')
  async deleteUser(
    @GetUser('sub') currentUserId: number,
    @Param('id', ParseIntPipe) targetUserId: number,
  ) {
    console.log('current user :', currentUserId, targetUserId);
    return await this.usersService.deleteUser(currentUserId, targetUserId);
  }
}
