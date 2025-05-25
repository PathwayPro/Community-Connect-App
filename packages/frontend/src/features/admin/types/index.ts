export type UserRole = 'USER' | 'MENTOR' | 'ADMIN';

export interface AdminUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'DELETED';
  pictureUploadLink?: string;
  profession?: string;
  lastLogin?: string;
}

export interface AdminState {
  users: AdminUser[];
  selectedUser: AdminUser | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}
