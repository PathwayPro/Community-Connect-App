import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Adjust the path accordingly
import {
  CreateUserDto,
  PublicReadUserDto,
  ReadUserDto,
  UpdateUserDto,
} from './user.dto';
import { NotFoundException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { EmailService } from 'src/auth/email.Service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  async registerUser(user: CreateUserDto): Promise<ReadUserDto> {
    // Validate password
    const passwordMatching = user.password === user.confirmPassword;
    if (!passwordMatching) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }
    const isValid = await this.authService.isValidPassword(user.password);
    if (!isValid) {
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
    }
    // Check if email already exists
    const emailExists = await this.userEmailExists(user.email);
    console.log(`Email : ${emailExists}`);
    if (emailExists) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    // Hash the password
    const hashedPassword = await this.authService.hashPassword(user.password);
    const dateTimeDob = this.convertToDateTime(user.dob);
    const dateTimeArrival = this.convertToDateTime(user.arrival_in_canada);

    // Prepare user data with hashed password
    const userToCreate = {
      ...user,
      password: hashedPassword,
      dob: dateTimeDob,
      arrival_in_canada: dateTimeArrival,
    };
    // console.log(userToCreate);
    // console.log(
    //   'User list before adding user to database : ' +
    //     (await this.prisma.users.findMany()),
    // );

    // Delegate user creation to UserService
    return this.addUser(userToCreate);
  }
  convertToDateTime(dateString: string | Date): Date {
    // If the input is already a Date object, return it directly
    if (dateString instanceof Date) {
      return dateString;
    }

    // Otherwise, convert the string to a Date object
    return new Date(dateString);
  }

  async getUserCount() {
    const users = await this.prisma.users.findMany();
    const userList = users.map(
      (user) => '\n' + user.id + ' ' + user.first_name,
    );

    console.log('UserList: \n' + userList);
    const count = users.length;
    return 'User Count : ' + count;
  }

  // Get user by ID using Prisma
  async getUserById(userIdNumber: string): Promise<ReadUserDto> {
    const userId = Number(userIdNumber);

    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.mapToReadUserDto(user);
  }

  // Get user by email (username) using Prisma
  async getUserByUsername(email: string): Promise<ReadUserDto> {
    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return this.mapToReadUserDto(user);
  }

  // Get all users using Prisma
  async getUsers(): Promise<ReadUserDto[]> {
    const users = await this.prisma.users.findMany();
    console.log(users);
    return users.map(this.mapToReadUserDto);
  }

  // Get public user info using Prisma
  async getUsersPublicInfo(): Promise<PublicReadUserDto[]> {
    const users = await this.prisma.users.findMany();
    return users.map((user) => {
      const publicUser = new PublicReadUserDto();
      publicUser.first_name = user.first_name;
      publicUser.middle_name = user.middle_name;
      publicUser.last_name = user.last_name;
      publicUser.email = user.email;
      publicUser.arrival_in_canada = user.arrival_in_canada;
      publicUser.role = user.role as 'USER' | 'ADMIN' | 'MENTOR';
      return publicUser;
    });
  }

  // Get public user info by ID
  async getUserPublicInfoById(
    userIdNumber: string,
  ): Promise<PublicReadUserDto> {
    const userId = Number(userIdNumber);
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const publicUser = new PublicReadUserDto();
    publicUser.first_name = user.first_name;
    publicUser.middle_name = user.middle_name;
    publicUser.last_name = user.last_name;
    publicUser.email = user.email;
    publicUser.arrival_in_canada = user.arrival_in_canada;
    publicUser.role = user.role as 'USER' | 'ADMIN' | 'MENTOR';
    return publicUser;
  }

  // Check if email exists using Prisma
  async userEmailExists(email: string): Promise<boolean> {
    const user = await this.prisma.users.findUnique({
      where: { email },
    });
    if (user) {
      console.log(`userEmailExists : ${user.email}`);
      return true;
    }
    return false;
  }
  async getUserByEmail(email: string): Promise<PublicReadUserDto> {
    try {
      const user = await this.prisma.users.findUnique({
        where: { email },
      });

      if (user) {
        return this.mapToPublicReadUserDto(user);
      }

      // Return an empty DTO or handle null user appropriately
      return new PublicReadUserDto();
    } catch (error) {
      console.error('Error fetching user by email:', error.message);
      throw new Error('Failed to fetch user by email.');
    }
  }

  // private mapToLoginUserDto(user: any): LoginUserDto {
  //   const loginUser = new LoginUserDto();
  //   loginUser.email = user.email;
  //   loginUser.password_hash = user.password_hash;

  //   return loginUser;
  // }
  // Add a user using Prisma
  async addUser(user: CreateUserDto): Promise<ReadUserDto> {
    try {
      // Step 1: Create the user in the database
      const newUser = await this.prisma.users.create({
        data: {
          first_name: user.first_name,
          middle_name: user.middle_name,
          last_name: user.last_name,
          email: user.email,
          password_hash: user.password, // Assuming the password is already hashed
          dob: user.dob,
          show_dob: user.show_dob,
          arrival_in_canada: user.arrival_in_canada,
          goal_id: user.goal_id,
          role: user.role,
          email_verified: false, // Ensure email is not verified initially
        },
      });
      console.log('User added successfully:', newUser);

      // Step 2: Generate the verification token for the user
      const token = this.emailService.generateVerificationToken(newUser.id);
      console.log('Generated verification token:', token);

      // Step 3: Store the verification token in the user record
      await this.prisma.users.update({
        where: { id: newUser.id },
        data: { verification_token: token },
      });

      // Step 4: Send the verification email with the token
      await this.emailService.sendVerificationEmail(newUser.email, token);

      // Return the user data (you can map this as per your requirements)
      return this.mapToReadUserDto(newUser);
    } catch (err) {
      console.error(err);
      throw new Error('User creation failed');
    }
  }

  // Update a user using Prisma
  async updateUser(
    userIdNumber: string,
    user: UpdateUserDto,
  ): Promise<ReadUserDto> {
    const id = Number(userIdNumber);

    const existingUser = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updatedUser = await this.prisma.users.update({
      where: { id },
      data: {
        first_name: user.first_name ?? existingUser.first_name,
        middle_name: user.middle_name ?? existingUser.middle_name,
        last_name: user.last_name ?? existingUser.last_name,
        email: user.email ?? existingUser.email,
        dob: user.dob ?? existingUser.dob,
        show_dob: user.show_dob ?? existingUser.show_dob,
        arrival_in_canada:
          user.arrival_in_canada ?? existingUser.arrival_in_canada,
        goal_id: user.goal_id ?? existingUser.goal_id,
        role: user.role ?? existingUser.role,
      },
    });

    return this.mapToReadUserDto(updatedUser);
  }

  // Delete a user using Prisma
  async deleteUser(userId: string): Promise<string> {
    const id = Number(userId);
    const existingUser = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.prisma.users.delete({
      where: { id },
    });

    return `User with ID ${id} deleted`;
  }

  // Map Prisma User to ReadUserDto
  private mapToReadUserDto(user: any): ReadUserDto {
    const readUser = new ReadUserDto();
    readUser.id = user.id;
    readUser.first_name = user.first_name;
    readUser.middle_name = user.middle_name;
    readUser.last_name = user.last_name;
    readUser.email = user.email;
    // readUser.password_hash = user.password_hash;
    readUser.dob = user.dob;
    readUser.show_dob = user.show_dob;
    readUser.arrival_in_canada = user.arrival_in_canada;
    readUser.goal_id = user.goal_id;
    readUser.role = user.role;

    return readUser;
  }
  private mapToPublicReadUserDto(user: any): PublicReadUserDto {
    const publicUser = new PublicReadUserDto();
    publicUser.first_name = user.first_name;
    publicUser.middle_name = user.middle_name;
    publicUser.last_name = user.last_name;
    publicUser.email = user.email;
    // readUser.password_hash = user.password_hash;
    publicUser.arrival_in_canada = user.arrival_in_canada;
    publicUser.role = user.role;

    return publicUser;
  }
}
