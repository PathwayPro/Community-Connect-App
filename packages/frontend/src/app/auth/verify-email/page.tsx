'use client';

import { Icons } from '@/features/auth/components';
import { VerifyEmail } from '@/features/auth/components';
import { AccessToken } from '@/features/auth/types';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const VerifyEmailPageContent = () => {
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get('token');
  const token = tokenParam ? (tokenParam as unknown as AccessToken) : null;

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center space-y-6 p-8">
        <Icons.logo className="h-[84px] w-[84px]" />
        {token && <VerifyEmail token={token} />}
      </div>
    </div>
  );
};

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen w-full items-center justify-center">
          Loading...
        </div>
      }
    >
      <VerifyEmailPageContent />
    </Suspense>
  );
}
