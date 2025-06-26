import { ReadUserDto, PublicReadUserDto } from '../dto/user.dto';

export type RegisterUserResponse = {
  message: string;
  data: ReadUserDto;
};

export type UpdateUserResponse = {
  success: boolean;
  message: string;
  data: ReadUserDto;
};

export type DeleteUserResponse = {
  success: boolean;
  message: string;
};

export type GetUserResponse = {
  success: boolean;
  data: ReadUserDto;
};

export type GetUsersResponse = {
  success: boolean;
  data: ReadUserDto[];
};

export type GetPublicUsersResponse = {
  success: boolean;
  data: PublicReadUserDto[];
};

export type GetProfessionsResponse = {
  success: boolean;
  data: string[];
};

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'DELETED';

export type UserRole = 'USER' | 'ADMIN' | 'MENTOR';

export type AuthProvider = 'email' | 'google';

export interface UserProfile {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  provider: AuthProvider;
  emailVerified: boolean;
  deletedAt: boolean;
  lastLogin?: Date;
  // Profile fields
  dob?: string;
  ageRange?: string;
  arrivalInCanada?: string;
  goalId?: string;
  province?: string;
  city?: string;
  languages?: string;
  profession?: string;
  experience?: string;
  bio?: string;
  pictureUploadLink?: string;
  resumeUploadLink?: string;
  linkedinLink?: string;
  githubLink?: string;
  twitterLink?: string;
  portfolioLink?: string;
  otherLinks?: string;
  additionalLinks?: string[];
  workStatus?: string;
  companyName?: string;
  countryOfOrigin?: string;
  activelySearching?: boolean;
  skills?: number[];
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  deletedUsers: number;
  usersByRole: Record<UserRole, number>;
  usersByProvider: Record<AuthProvider, number>;
}

export interface UserFilters {
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  provider?: AuthProvider;
  profession?: string;
  countryOfOrigin?: string;
  activelySearching?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserSearchResult {
  users: UserProfile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
