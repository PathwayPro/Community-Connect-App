/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useUserStore } from '../store';
import { useAlertDialog } from '@/shared/hooks/use-alert-dialog';
import { UserProfile } from '../types';
import { userApi } from '../api/user-api';

interface UseFetchProfileResult {
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  data: UserProfile | null;
}

export const useFetchProfile = (userId?: string): UseFetchProfileResult => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<UserProfile | null>(null);
  const { fetchUserProfile, fetchUserById, user } = useUserStore();
  const { showAlert } = useAlertDialog();

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('userIdwwwwwwwwwwwwwwwwwwwww', userId);

      if (!userId) {
        // Fetch current user's profile

        console.log('fetching current user profile');
        const response = await fetchUserProfile();

        if (!response.success) {
          throw new Error('Failed to fetch user profile');
        }

        const userData = response.data;
        setData(userData);
      } else {
        // Fetch other user's profile
        console.log('fetching other user profile');
        const response = await fetchUserById(Number(userId));

        if (!response.success) {
          throw new Error('Failed to fetch user profile');
        }

        console.log('userData for the other user', response.data);
        const userData = response.data;
        setData(userData);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch profile';
      setError(err instanceof Error ? err : new Error(errorMessage));

      showAlert({
        title: 'Profile Error',
        description: errorMessage || 'Failed to fetch profile',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  return {
    isLoading,
    error,
    refetch: fetchProfile,
    data: userId ? data : user // Return data from API for other users, user store for current user
  };
};
