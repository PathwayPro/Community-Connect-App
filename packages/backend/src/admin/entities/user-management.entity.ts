import { ApiProperty } from '@nestjs/swagger';
import { users_roles } from '@prisma/client';

export class UserManagementItem {
  @ApiProperty({ description: 'User ID' })
  id: number;

  @ApiProperty({ description: 'First name' })
  firstName: string;

  @ApiProperty({ description: 'Last name' })
  lastName: string;

  @ApiProperty({ description: 'Email address' })
  email: string;

  @ApiProperty({ description: 'User role', enum: users_roles })
  role: users_roles;

  @ApiProperty({ description: 'User active status' })
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'DELETED';

  @ApiProperty({ description: 'Profile picture URL' })
  pictureUploadLink: string | null;

  @ApiProperty({ description: 'User profession' })
  profession: string | null;

  @ApiProperty({ description: 'Last login timestamp' })
  lastLogin: string | null;
}

export class PaginatedUsers {
  @ApiProperty({ description: 'List of users', type: [UserManagementItem] })
  users: UserManagementItem[];

  @ApiProperty({ description: 'Total count of users' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of pages' })
  totalPages: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;
}
