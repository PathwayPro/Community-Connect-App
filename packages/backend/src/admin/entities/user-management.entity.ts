import { ApiProperty } from '@nestjs/swagger';
import { users_roles } from '@prisma/client';

export class UserManagementItem {
  @ApiProperty({ description: 'User ID' })
  id: number;

  @ApiProperty({ description: 'First name' })
  firstName: string;

  @ApiProperty({ description: 'Middle name' })
  middleName?: string;

  @ApiProperty({ description: 'User biography' })
  bio?: string;

  @ApiProperty({ description: 'Last name' })
  lastName: string;

  @ApiProperty({ description: 'Email address' })
  email: string;

  @ApiProperty({ description: 'User role', enum: users_roles })
  role: users_roles;

  @ApiProperty({ description: 'User active status' })
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'DELETED';

  @ApiProperty({ description: 'Profile picture URL' })
  picture_upload_link: string | null;

  @ApiProperty({ description: 'User profession' })
  profession: string | null;

  @ApiProperty({ description: 'Date of birth' })
  dob?: string;

  @ApiProperty({ description: 'Age range' })
  ageRange?: string;

  @ApiProperty({ description: 'Arrival in Canada date' })
  arrivalInCanada?: string;

  @ApiProperty({ description: 'Goal ID' })
  goalId?: string;

  @ApiProperty({
    description: 'User skills (array of skill IDs)',
    type: [Number],
  })
  skills?: number[];

  @ApiProperty({ description: 'Province' })
  province?: string;

  @ApiProperty({ description: 'City' })
  city?: string;

  @ApiProperty({ description: 'Work experience' })
  experience?: string;

  @ApiProperty({ description: 'LinkedIn profile link' })
  linkedinLink?: string;

  @ApiProperty({ description: 'Languages spoken' })
  languages?: string;

  @ApiProperty({ description: 'Country of origin' })
  countryOfOrigin?: string;

  @ApiProperty({ description: 'Work status' })
  workStatus?: string;

  @ApiProperty({ description: 'Company name' })
  companyName?: string;

  @ApiProperty({ description: 'Actively searching for opportunities' })
  activelySearching?: boolean;

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
