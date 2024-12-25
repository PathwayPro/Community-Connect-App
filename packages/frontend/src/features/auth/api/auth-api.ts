import { apiMethods } from '@/shared/api';
import {
  LoginCredentials,
  AuthResponse,
  AuthResponseMessage,
  RegisterCredentials,
  ResetPasswordCredentials,
  ForgotPasswordCredentials,
  UpdatePasswordCredentials,
  AccessToken,
  RefreshToken
} from '@/features/auth/types';

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiMethods.post<AuthResponse>('/auth/login', credentials),

  register: (credentials: RegisterCredentials) =>
    apiMethods.post<AuthResponse>('/users/register', credentials),

  verifyEmail: (token: AccessToken) =>
    apiMethods.get<AuthResponseMessage>(`/auth/verify-email?token=${token}`),

  updatePassword: (credentials: UpdatePasswordCredentials) =>
    apiMethods.post<AuthResponseMessage>('/auth/update-password', credentials),

  forgotPassword: (credentials: ForgotPasswordCredentials) =>
    apiMethods.post<AuthResponseMessage>('/auth/forgot-password', credentials),

  resetPassword: (credentials: ResetPasswordCredentials) =>
    apiMethods.post<AuthResponseMessage>('/auth/reset-password', credentials),

  logout: () => apiMethods.post<AuthResponseMessage>('/auth/logout'),

  refreshToken: (refreshToken: RefreshToken) =>
    apiMethods.post<AuthResponse>('/auth/refresh', { refreshToken })
};
