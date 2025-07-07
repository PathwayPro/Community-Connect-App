import { useState } from 'react';
import { useAuthContext } from '../providers/auth-context';
import { authApi } from '@/features/auth/api';
import {
  AccessToken,
  ChangePasswordCredentials,
  ForgotPasswordCredentials,
  LoginCredentials,
  RefreshToken,
  RegisterCredentials,
  // ResetPasswordCredentials,
  UpdatePasswordCredentials
} from '@/features/auth/types';
import { userApi } from '@/features/user-profile/api/user-api';
import Cookies from 'js-cookie';
import { useAlertDialog } from '@/shared/hooks/use-alert-dialog';
import { ApiError } from '@/shared/types';
// import { useSearchParams } from 'next/navigation';
import { ResetPasswordWithTokenFormValues } from '../validations/auth.schema';

const USER_STORAGE_KEY = 'user_data';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const { loginContext, logoutContext } = useAuthContext();
  const { showAlert } = useAlertDialog();
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await authApi.login(credentials);

      if (!response.data.tokens) {
        throw new Error('No tokens received from login request');
      }

      const accessToken = response.data.tokens.accessToken;
      const refreshToken = response.data.tokens.refreshToken;

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

        if (responseUserData.success) {
          // Store user data in localStorage
          localStorage.setItem(
            USER_STORAGE_KEY,
            JSON.stringify(responseUserData.data)
          );
          loginContext(responseUserData.data);
          showAlert({
            title: 'Login successful!',
            description: 'Welcome back to the app!',
            type: 'success',
            redirect: '/home'
          });
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

      if (response.success) {
        showAlert({
          title: 'Registration successful!',
          description:
            'Welcome to the app! Please check your email for a verification link.',
          type: 'success',
          redirect: '/auth/login'
        });
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
          type: 'success',
          redirect: '/auth/login'
        });
      }
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.response?.data?.message || 'Please try again.');
      showAlert({
        title: 'Verification Failed!',
        description: apiError.response?.data?.message || 'Please try again.',
        type: 'error',
        redirect: '/auth/login'
      });
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
          type: 'success',
          redirect: '/auth/login'
        });
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
          type: 'success',
          redirect: '/auth/login'
        });
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

  const resetPassword = async (
    credentials: ResetPasswordWithTokenFormValues & { token?: string }
  ) => {
    try {
      setIsLoading(true);
      const response = await authApi.resetPassword(credentials);

      if (response.success) {
        showAlert({
          title: 'Password reset successfully!',
          description:
            'Your password has been reset. You can now login with your new password.',
          type: 'success',
          redirect: '/auth/login'
        });
      }
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

  const changePassword = async (credentials: ChangePasswordCredentials) => {
    try {
      setIsLoading(true);
      const response = await authApi.changePassword(credentials);

      if (response.success) {
        showAlert({
          title: 'Password updated successfully!',
          description: 'You can now login with your new password.',
          type: 'success',
          redirect: '/auth/login'
        });
      }

      return response;
    } catch (error) {
      const apiError = error as ApiError;
      showAlert({
        title: 'Failed to change password',
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

      // Call the API (but we've already handled the logout locally)
      const response = await authApi.logout();

      logoutContext();

      return response;
    } catch (error) {
      console.error('Logout error:', error);

      logoutContext();

      const apiError = error as ApiError;
      showAlert({
        title: 'Logout completed with warning',
        description:
          apiError.response?.data?.message ||
          'You have been logged out, but there was an issue on our server.',
        type: 'warning',
        redirect: '/'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async (credentials: RefreshToken) => {
    try {
      setIsLoading(true);
      const response = await authApi.refreshToken(credentials);

      if (response.success) {
        showAlert({
          title: 'Token refreshed successfully!',
          description: 'You can now login with your new password.',
          type: 'success',
          redirect: '/'
        });
      }

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
    changePassword,
    logout,
    refreshToken,
    isLoading,
    setIsLoading,
    error,
    setError
  };
}
