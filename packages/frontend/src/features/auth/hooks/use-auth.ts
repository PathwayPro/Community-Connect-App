import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../providers/auth-context';
import { authApi } from '@/features/auth/api';
import {
  AccessToken,
  ForgotPasswordCredentials,
  LoginCredentials,
  RefreshToken,
  RegisterCredentials,
  ResetPasswordCredentials,
  UpdatePasswordCredentials
} from '@/features/auth/types';
import { userApi } from '@/features/user-profile/api/user-api';
import Cookies from 'js-cookie';
import { DialogState, ApiError } from '@/shared/types';

export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { loginContext, logoutContext } = useAuthContext();
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    title: '',
    description: ''
  });
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      console.log('login data in hook:', credentials);
      const response = await authApi.login(credentials);

      console.log('login response in hook:', response);

      if (!response.data.tokens) {
        throw new Error('No tokens received from login request');
      }

      const accessToken = response.data.tokens.accessToken;
      const refreshToken = response.data.tokens.refreshToken;

      console.log('accessToken', accessToken);

      Cookies.set('accessToken', accessToken, {
        secure: true,
        sameSite: 'strict'
      });
      Cookies.set('refreshToken', refreshToken, {
        secure: true,
        sameSite: 'strict'
      });

      if (accessToken && refreshToken) {
        const responseUserData = await userApi.getUserProfile();

        console.log('responseUserData', responseUserData);

        if (responseUserData.success) {
          setDialogState({
            isOpen: true,
            title: 'Login successful!',
            description: 'Welcome back to the app!'
          });

          loginContext(responseUserData.data);
          router.push('/profile');
          router.refresh();
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setDialogState({
        isOpen: true,
        title: 'Login Failed!',
        description: 'Please check your credentials and try again.'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setIsLoading(true);
      const response = await authApi.register(credentials);

      console.log('register response in hook:', response);

      if (response.success) {
        setDialogState({
          isOpen: true,
          title: 'Registration successful!',
          description:
            'Welcome to the app! Please check your email for a verification link.'
        });

        setTimeout(() => {
          setDialogState((prev) => ({ ...prev, isOpen: false }));
          router.push('/auth/login');
          router.refresh();
        }, 3000);
      }
    } catch (error) {
      console.log('error in register', error);
      const apiError = error as ApiError;
      setDialogState({
        isOpen: true,
        title: 'Registration Failed!',
        description: apiError.response?.data?.message || 'Please try again.'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (token: AccessToken) => {
    try {
      setIsLoading(true);
      const response = await authApi.verifyEmail(token);

      if (response.success) {
        setDialogState({
          isOpen: true,
          title: 'Email verified successfully!',
          description:
            'Your email has been verified. You will be redirected to login.'
        });

        setTimeout(() => {
          router.push('/auth/login');
          router.refresh();
        }, 300000);
      }
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.response?.data?.message || 'Please try again.');
      setDialogState({
        isOpen: true,
        title: 'Verification Failed!',
        description: apiError.response?.data?.message || 'Please try again.'
      });
      setTimeout(() => {
        router.push('/auth/login');
        router.refresh();
      }, 300000);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (credentials: UpdatePasswordCredentials) => {
    try {
      setIsLoading(true);
      const response = await authApi.updatePassword(credentials);

      if (response.success) {
        setDialogState({
          isOpen: true,
          title: 'Password updated successfully!',
          description:
            'You have successfully reset your password. You can now login using the new password. '
        });
        setTimeout(() => {
          router.push('/auth/login');
          router.refresh();
        }, 3000);
      }
    } catch (error) {
      const apiError = error as ApiError;
      setDialogState({
        isOpen: true,
        title: 'Failed to update password',
        description: apiError.response?.data?.message || 'Please try again.'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (credentials: ForgotPasswordCredentials) => {
    try {
      setIsLoading(true);
      const response = await authApi.forgotPassword(credentials);

      if (response.success) {
        setDialogState({
          isOpen: true,
          title: 'Email Sent!',
          description:
            'A password reset link has been sent to your registered Email ID.'
        });
        setTimeout(() => {
          router.push('/auth/login');
          router.refresh();
        }, 3000);
      }
    } catch (error) {
      const apiError = error as ApiError;
      setDialogState({
        isOpen: true,
        title: 'Failed to process forgot password request',
        description: apiError.response?.data?.message || 'Please try again.'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (credentials: ResetPasswordCredentials) => {
    try {
      setIsLoading(true);
      const response = await authApi.resetPassword(credentials);
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      setDialogState({
        isOpen: true,
        title: 'Failed to reset password',
        description: apiError.response?.data?.message || 'Please try again.'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const response = await authApi.logout();

      if (response.message === 'Logout successful') {
        logoutContext();
        setDialogState({
          isOpen: true,
          title: 'Logged out successfully!',
          description: 'See you soon!'
        });

        router.push('/auth/login');
        router.refresh();
      }
    } catch (error) {
      const apiError = error as ApiError;
      setDialogState({
        isOpen: true,
        title: 'Logout Failed!',
        description: apiError.response?.data?.message || 'Please try again.'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async (credentials: RefreshToken) => {
    try {
      setIsLoading(true);
      const response = await authApi.refreshToken(credentials);
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      setDialogState({
        isOpen: true,
        title: 'Refresh Token Failed!',
        description: apiError.response?.data?.message || 'Please try again.'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    register,
    verifyEmail,
    updatePassword,
    forgotPassword,
    resetPassword,
    logout,
    refreshToken,
    isLoading,
    setIsLoading,
    dialogState,
    setDialogState,
    error,
    setError
  };
}
