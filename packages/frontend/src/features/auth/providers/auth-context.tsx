'use client';

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
  useEffect,
  type ReactNode
} from 'react';

import { UserProfile } from '@/features/user-profile/types';
import { AuthContextType } from '../types';
import Cookies from 'js-cookie';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'user_data';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Initialize user data from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error reading user data from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginContext = useCallback((userData: UserProfile) => {
    setUser(userData);

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
  }, []);

  const logoutContext = useCallback(async () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');

    return 'Logout successful';
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      loginContext,
      logoutContext,
      isAuthenticated: !!user,
      isLoading
    }),
    [user, loginContext, logoutContext, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
