import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/hooks/use-toast';
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
import { useAuthContext } from '../providers/auth-context';
import { userApi } from '@/features/user-profile/api/user-api';
import Cookies from 'js-cookie';
export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { loginContext, logoutContext } = useAuthContext();
  const { toast } = useToast();

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

        if (responseUserData) {
          toast({
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
      toast({
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

      if (response.data.success) {
        toast({
          title: 'Registration successful!',
          description:
            'Welcome to the app!, Please check your email for a verification link.'
        });
        router.push('/auth/login');
        router.refresh();
      }
    } catch (error) {
      toast({
        title: 'Registration Failed!',
        description: 'Please try again.'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (credentials: AccessToken) => {
    try {
      setIsLoading(true);
      const response = await authApi.verifyEmail(credentials);

      if (response.status === 200) {
        toast({
          title: 'Email verification successful!',
          description: 'Your email has been verified.'
        });
        router.push('/auth/login');
        router.refresh();
      }
    } catch (error) {
      toast({
        title: 'Failed to verify email',
        description: 'Please try again.'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (credentials: UpdatePasswordCredentials) => {
    try {
      setIsLoading(true);
      const response = await authApi.updatePassword(credentials);

      if (response.status === 200) {
        toast({
          title: 'Password updated successfully!',
          description: 'Your password has been updated.'
        });
        router.push('/auth/login');
        router.refresh();
      }
    } catch (error) {
      toast({
        title: 'Failed to update password',
        description: 'Please try again.'
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

      return response;
    } catch (error) {
      toast({
        title: 'Failed to process forgot password request',
        description: 'Please try again.'
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
      toast({
        title: 'Failed to reset password',
        description: 'Please try again.'
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
        toast({
          title: 'Logged out successfully!',
          description: 'See you soon!'
        });

        router.push('/auth/login');
        router.refresh();
      }
    } catch (error) {
      toast({
        title: 'Logout Failed!',
        description: 'Please try again.'
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
      toast({
        title: 'Refresh Token Failed!',
        description: 'Please try again.'
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
    isLoading
  };
}
