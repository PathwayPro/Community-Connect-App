import { ApiProperty } from '@nestjs/swagger';
import { ReadUserDto } from './user.dto';

export class UserRegistrationResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'User registered successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Registered user data',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      email: { type: 'string', example: 'john.doe@example.com' },
      firstName: { type: 'string', example: 'John' },
      lastName: { type: 'string', example: 'Doe' },
      emailVerified: { type: 'boolean', example: false },
    },
  })
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    emailVerified: boolean;
  };
}

export class UserDeleteResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'User deleted successfully',
  })
  message: string;
}

export class ProfessionsResponseDto {
  @ApiProperty({
    description: 'List of user professions',
    type: [String],
    example: [
      'Software Engineer',
      'Data Scientist',
      'Product Manager',
      'UX Designer',
    ],
  })
  professions: string[];
}

export class UserUpdateResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'User updated successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Updated user data',
    type: ReadUserDto,
  })
  user: any;
}
