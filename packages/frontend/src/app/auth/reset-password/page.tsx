'use client';

import { AuthCarousel } from '@/features/auth/components';
import { Separator } from '@/shared/components/ui/separator';
import { ForgotPasswordForm } from '@/features/auth/components';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from '@/shared/hooks/use-toast';

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      router.push('/auth/login');
      toast({
        title: 'Authentication Error!',
        description: 'Invalid or missing reset token. Please try again.',
        variant: 'destructive'
      });
      return;
    }
  }, [router, searchParams]);

  return (
    <div className="container-wide relative flex h-[100vh] items-center justify-between">
      <div className="w-1/4 min-w-[420px]">
        <ForgotPasswordForm />
      </div>
      <Separator orientation="vertical" className="h-full" />
      <div className="w-2/4">
        <AuthCarousel />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
