import { UserProfile } from '@/features/user-profile/types';

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = {
  email: string;
  password: string;
  name: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResponseWithUser = AuthResponse & {
  user: UserProfile;
};

export interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserProfile | null) => void;
  loginContext: (user: UserProfile) => void;
  logoutContext: () => void;
}

export type AuthResponseMessage = {
  message: string;
};
