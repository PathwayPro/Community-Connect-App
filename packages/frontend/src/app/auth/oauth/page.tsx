'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthContext } from '@/features/auth/providers';
import { tokens } from '@/shared/utils';
import { userApi } from '@/features/user-profile/api/user-api';
import { useToast } from '@/shared/hooks/use-toast';
import { Icons } from '@/features/auth/components/icons';

export const OAuthHandler = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { loginContext } = useAuthContext();
  const [isProcessing, setIsProcessing] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (!accessToken || !refreshToken) {
      router.push('/auth/login');
      toast({
        title: 'Authentication Error!',
        description: 'Authentication failed. Please try again.',
        variant: 'destructive'
      });
      return;
    }

    tokens.set({
      accessToken,
      refreshToken
    });

    const handleAuth = async () => {
      try {
        if (accessToken && refreshToken) {
          const responseUserData = await userApi.getUserProfile();

          console.log('responseUserData', responseUserData);

          if (!responseUserData) {
            toast({
              title: 'Login failed!',
              description: 'Please try again.'
            });
            return;
          }

          loginContext(responseUserData.data);

          toast({
            title: 'Login successful!',
            description: 'Welcome back to the app!'
          });

          router.push('/profile');
          router.refresh();
        }
      } catch (error) {
        console.error('Authentication error:', error);

        toast({
          title: 'Authentication Error!',
          description: 'Authentication failed. Please try again.',
          variant: 'destructive'
        });

        router.push('/auth/login');
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuth();
  }, [searchParams, router, loginContext, toast]);

  if (!isProcessing) return null;

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex min-h-[100%] w-full flex-col items-center gap-3 text-center">
        <div className="mb-8">
          <Icons.logo className="mx-auto h-[100px] w-[100px]" />
        </div>
        <div className="flex items-center gap-3">
          <div
            className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"
            aria-label="Loading"
          />
          <p className="text-muted-foreground">Processing your login...</p>
        </div>
      </div>
    </div>
  );
};

export default OAuthHandler;
