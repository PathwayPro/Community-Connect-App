/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useUserStore } from '../store';

interface UseFetchProfileResult {
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useFetchProfile = (): UseFetchProfileResult => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { fetchUserProfile } = useUserStore();

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await fetchUserProfile();
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch profile')
      );
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
