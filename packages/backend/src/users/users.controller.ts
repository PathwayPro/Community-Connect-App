import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { JwtAuthGuard } from 'src/auth/jwtAuthGuard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  async registerUser(@Body() user: CreateUserDto) {
    try {
      const result = await this.usersService.registerUser(user);
      return {
        message: 'User registered successfully.',
        data: result,
      };
    } catch (error) {
      return {
        message: 'Failed to register user.',
        error: error.message,
      };
    }
  }
  @Get('/count')
  getUserCount() {
    return this.usersService.getUserCount();
  }

  @Get('/public-data')
  getUsersPublicData() {
    return this.usersService.getUsersPublicInfo();
  }
  @Get('/public-data/:userId')
  getUserPublicDataById(@Param('userId') userId: string) {
    return this.usersService.getUserPublicInfoById(userId);
  }
  @Get('id/:userId') // Make sure the parameter is extracted correctly
  async getUserById(@Param('userId') userId: string) {
    try {
      // Call the service method to get the user by ID
      return await this.usersService.getUserById(userId);
    } catch (error) {
      // Handle the error if the user is not found
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      // For other types of errors, you might want to rethrow or handle them differently
      throw error;
    }
  }

  @Get('email/:email') // Make sure the parameter is extracted correctly
  async getUserByUsername(@Param('email') email: string) {
    try {
      // Call the service method to get the user by ID
      return await this.usersService.getUserByUsername(email);
    } catch (error) {
      // Handle the error if the user is not found
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
      // For other types of errors, you might want to rethrow or handle them differently
      throw error;
    }
  }

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  // @Post()
  // addUser(@Body() user: CreateUserDto) {
  //   // console.log('Received user data:', user); // Log the body to check if it's being parsed correctly
  //   return this.usersService.addUser(user);
  // }
  // Update a user by ID
  @Put(':id')
  updateUser(@Param('id') id: string, @Body() user: UpdateUserDto) {
    return this.usersService.updateUser(id, user);
  }

  @Delete(':id')
  DeleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
  @Get('profile')
  @UseGuards(JwtAuthGuard) // Protect this route with the JwtAuthGuard
  getProfile() {
    return { message: 'This is a protected route, user is authenticated!' };
  }
}
