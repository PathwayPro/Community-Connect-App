import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/shared/hooks/use-toast';
import { authApi } from '@/features/auth/api';
import { LoginCredentials, RegisterCredentials } from '@/features/auth/types';
import { useAuthContext } from '../providers/auth-context';

export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuthContext();

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await authApi.login(credentials);
      toast({
        title: 'Login successful!',
        description: 'Welcome back to the app!'
      });
      setUser(response.data.user);

      router.push('/dashboard');
      router.refresh();

      return response;
    } catch (error) {
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
      toast({
        title: 'Registration successful!',
        description:
          'Welcome to the app!, Please check your email for a verification link.'
      });
      router.push('/dashboard');
      router.refresh();
      return response;
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

  const verifyEmail = async (email: string) => {
    try {
      setIsLoading(true);
      const response = await authApi.verifyEmail(email);
      toast({
        title: 'Email verification successful!',
        description: 'Your email has been verified.'
      });
      return response;
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

  const updatePassword = async (password: string) => {
    try {
      setIsLoading(true);
      const response = await authApi.updatePassword(password);
      toast({
        title: 'Password updated successfully!',
        description: 'Your password has been updated.'
      });
      return response;
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

  const forgotPassword = async (email: string) => {
    try {
      setIsLoading(true);
      const response = await authApi.forgotPassword(email);
      toast({
        title: 'Password reset instructions sent to your email',
        description: 'Please check your email for a reset link.'
      });
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

  const refreshToken = async (refreshToken: string) => {
    try {
      setIsLoading(true);
      const response = await authApi.refreshToken(refreshToken);
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
    logout,
    refreshToken,
    isLoading,
    signInWithGoogle
  };
}
