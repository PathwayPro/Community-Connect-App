import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/shared/hooks/use-toast';
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
import AlertDialogUI from '@/shared/components/notification/alert-dialog';
export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuthContext();

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      console.log('login data in hook:', credentials);
      const response = await authApi.login(credentials);

      console.log('login response in hook:', response);

      if (!response.tokens) {
        throw new Error('No tokens received from login request');
      }

      const accessToken = response.tokens.accessToken;
      const refreshToken = response.tokens.refreshToken;

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

        if (responseUserData.status === 200) {
          toast({
            title: 'Login successful!',
            description: 'Welcome back to the app!'
          });

          setUser(responseUserData.data);
          router.push('/dashboard');
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

      if (response.status === 200) {
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

  const signInWithGoogle = async () => {
    const response = await authApi.signInWithGoogle();
    return response;
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
      await authApi.logout();
      toast({
        title: 'Logged out successfully!',
        description: 'See you soon!'
      });
      router.push('/login');
      router.refresh();
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
    isLoading,
    signInWithGoogle
  };
}
