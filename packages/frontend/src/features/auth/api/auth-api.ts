import { apiMethods } from '@/shared/api';
import {
  LoginCredentials,
  AuthResponse,
  AuthResponseWithUser,
  AuthResponseMessage,
  RegisterCredentials
} from '@/features/auth/types';

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiMethods.post<AuthResponseWithUser>('/auth/login', credentials),

  register: (credentials: RegisterCredentials) =>
    apiMethods.post<AuthResponse>('/auth/register', credentials),

  verifyEmail: (email: string) =>
    apiMethods.post<AuthResponseMessage>('/auth/verify-email', { email }),

  updatePassword: (password: string) =>
    apiMethods.post<AuthResponseMessage>('/auth/update-password', { password }),

  forgotPassword: (email: string) =>
    apiMethods.post<AuthResponseMessage>('/auth/forgot-password', { email }),

  logout: () => apiMethods.post<AuthResponseMessage>('/auth/logout'),

  refreshToken: (refreshToken: string) =>
    apiMethods.post<AuthResponse>('/auth/refresh', { refreshToken }),

  signInWithGoogle: () => apiMethods.get<AuthResponse>('/auth/google/callback')
};
