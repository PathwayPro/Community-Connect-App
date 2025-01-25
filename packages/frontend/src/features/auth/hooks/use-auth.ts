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
import { useAlertDialog } from '@/shared/hooks/use-alert-dialog';
import { ApiError } from '@/shared/types';

export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { loginContext, logoutContext } = useAuthContext();
  const { showAlert } = useAlertDialog();
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
          showAlert({
            title: 'Login successful!',
            description: 'Welcome back to the app!',
            type: 'success'
          });

          loginContext(responseUserData.data);
          router.push('/profile');
          router.refresh();
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      showAlert({
        title: 'Login Failed!',
        description: 'Please check your credentials and try again.',
        type: 'error'
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
        showAlert({
          title: 'Registration successful!',
          description:
            'Welcome to the app! Please check your email for a verification link.',
          type: 'success'
        });

        setTimeout(() => {
          router.push('/auth/login');
          router.refresh();
        }, 3000);
      }
    } catch (error) {
      console.log('error in register', error);
      const apiError = error as ApiError;
      showAlert({
        title: 'Registration Failed!',
        description: apiError.response?.data?.message || 'Please try again.',
        type: 'error'
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
        showAlert({
          title: 'Email verified successfully!',
          description:
            'Your email has been verified. You will be redirected to login.',
          type: 'success'
        });

        setTimeout(() => {
          router.push('/auth/login');
          router.refresh();
        }, 300000);
      }
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.response?.data?.message || 'Please try again.');
      showAlert({
        title: 'Verification Failed!',
        description: apiError.response?.data?.message || 'Please try again.',
        type: 'error'
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
        showAlert({
          title: 'Password updated successfully!',
          description:
            'You have successfully reset your password. You can now login using the new password. ',
          type: 'success'
        });
        setTimeout(() => {
          router.push('/auth/login');
          router.refresh();
        }, 3000);
      }
    } catch (error) {
      const apiError = error as ApiError;
      showAlert({
        title: 'Failed to update password',
        description: apiError.response?.data?.message || 'Please try again.',
        type: 'error'
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
        showAlert({
          title: 'Email Sent!',
          description:
            'A password reset link has been sent to your registered Email ID.',
          type: 'success'
        });
        setTimeout(() => {
          router.push('/auth/login');
          router.refresh();
        }, 3000);
      }
    } catch (error) {
      const apiError = error as ApiError;
      showAlert({
        title: 'Failed to process forgot password request',
        description: apiError.response?.data?.message || 'Please try again.',
        type: 'error'
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
      showAlert({
        title: 'Failed to reset password',
        description: apiError.response?.data?.message || 'Please try again.',
        type: 'error'
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
        showAlert({
          title: 'Logged out successfully!',
          description: 'See you soon!',
          type: 'success'
        });

        router.push('/auth/login');
        router.refresh();
      }
    } catch (error) {
      const apiError = error as ApiError;
      showAlert({
        title: 'Logout Failed!',
        description: apiError.response?.data?.message || 'Please try again.',
        type: 'error'
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
      showAlert({
        title: 'Refresh Token Failed!',
        description: apiError.response?.data?.message || 'Please try again.',
        type: 'error'
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
    error,
    setError
  };
}
