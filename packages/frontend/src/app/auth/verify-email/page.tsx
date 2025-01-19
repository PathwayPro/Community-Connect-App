'use client';

import { Icons } from '@/features/auth/components';
import { VerifyEmail } from '@/features/auth/components';
import { AccessToken } from '@/features/auth/types';
import { useSearchParams } from 'next/navigation';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get('token');
  const token = tokenParam ? (tokenParam as unknown as AccessToken) : null;

  return (
    <div className="flex flex-col items-center justify-center">
      <Icons.logo className="mx-auto h-[84px] w-[84px]" />

      {token && <VerifyEmail token={token} />}
    </div>
  );
}
