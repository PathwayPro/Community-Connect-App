/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useUserStore } from '../store';
import { useAlertDialog } from '@/shared/hooks/use-alert-dialog';

interface UseFetchProfileResult {
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useFetchProfile = (): UseFetchProfileResult => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { fetchUserProfile } = useUserStore();
  const { showAlert } = useAlertDialog();

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await fetchUserProfile();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch profile';
      setError(err instanceof Error ? err : new Error(errorMessage));

      showAlert({
        title: 'Profile Error',
        description: errorMessage,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    isLoading,
    error,
    refetch: fetchProfile
  };
};
