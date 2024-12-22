import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { RolesGuard } from '../auth/guards';

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

  @Get('id/:userId')
  async getUserById(@Param('userId') userId: string) {
    return await this.usersService.getUserPublicInfoById(userId);
  }

  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    return await this.usersService.getUserByEmail(email);
  }

  @Put(':id')
  async updateUser(
    @GetUser('sub') currentUserId: number,
    @Param('id', ParseIntPipe) targetUserId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.updateUser(
      currentUserId,
      targetUserId,
      updateUserDto,
    );
  }

  @Delete(':id')
  async deleteUser(
    @GetUser('sub') currentUserId: number,
    @Param('id', ParseIntPipe) targetUserId: number,
  ) {
    console.log('current user :', currentUserId, targetUserId);
    return await this.usersService.deleteUser(currentUserId, targetUserId);
  }

  @Get('profile')
  getProfile() {
    return { message: 'Profile accessed successfully' };
  }
}
