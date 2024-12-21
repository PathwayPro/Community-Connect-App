import { UserProfile } from '@/features/user-profile/types';

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = {
  email: string;
  passwordHash: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
};

export type AuthResponse = {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  message: string;
};

export type AccessToken = {
  token: string;
};

export type RefreshToken = {
  refreshToken: string;
};

export interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserProfile | null) => void;
  loginContext: (user: UserProfile) => void;
  logoutContext: () => void;
}

export type ForgotPasswordCredentials = {
  email: string;
};

export type ResetPasswordCredentials = {
  passwordHash: string;
  confirmPassword: string;
};

export type AuthResponseMessage = {
  message: string;
};

export type UpdatePasswordCredentials = {
  passwordHash: string;
  confirmPassword: string;
};
