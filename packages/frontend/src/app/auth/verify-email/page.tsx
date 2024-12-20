'use client';

import { Icons } from '@/features/auth/components/icons';
import { VerifyEmail } from '@/features/auth/components/verify-email';
import { useSearchParams } from 'next/navigation';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  console.log('token', token);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Icons.logo className="mx-auto h-[84px] w-[84px]" />

      {token ? (
        <VerifyEmail token={token} />
      ) : (
        <VerifyEmailError message="No verification token provided" />
      )}
    </div>
  );
}

const VerifyEmailError = ({ message }: { message: string }) => (
  <div className="text-center">
    <h1 className="mb-4 text-2xl font-semibold text-destructive">
      Verification Error
    </h1>
    <p className="text-muted-foreground">{message}</p>
  </div>
);
