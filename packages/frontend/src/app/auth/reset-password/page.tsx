'use client';

import { AuthCarousel } from '@/features/auth/components';
import { Separator } from '@/shared/components/ui/separator';
import { ForgotPasswordForm } from '@/features/auth/components';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from '@/shared/hooks/use-toast';

const ResetPasswordContent = () => {
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
    <div className="relative mx-auto flex min-h-screen w-full max-w-screen-xl items-center justify-between px-4">
      <div className="w-full sm:w-[420px]">
        <Suspense fallback={<div>Loading...</div>}>
          <ForgotPasswordForm />
        </Suspense>
      </div>
      <div className="hidden h-full sm:block">
        <Separator orientation="vertical" className="h-[70vh]" />
      </div>
      <div className="hidden flex-1 sm:block">
        <AuthCarousel />
      </div>
    </div>
  );
};

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPasswordPage;
