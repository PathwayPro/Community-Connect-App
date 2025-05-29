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
  city?: string;
  province?: string;
  companyName?: string;
  experience?: string;
  workStatus?: string;
  arrivalInCanada?: string;
  skills?: number[];
  languages?: string[];
  bio?: string;
  countryOfOrigin?: string;
  activelySearching?: boolean;
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
