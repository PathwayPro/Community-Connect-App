'use client';

/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/use-auth';
import { AccessToken } from '../types';
import { AlertDialogUI } from '@/shared/components/notification/alert-dialog';
import { Button } from '@/shared/components/ui/button';
import { useRouter } from 'next/navigation';

interface VerifyEmailProps {
  token: AccessToken;
}

export const VerifyEmail = ({ token }: VerifyEmailProps) => {
  const { verifyEmail } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyEmailToken = async () => {
      try {
        await verifyEmail(token);
        setIsVerifying(false);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Verification failed';
        setError(errorMessage);
        setIsVerifying(false);
      }
    };

    verifyEmailToken();
  }, [token, verifyEmail]);

  if (isVerifying) {
    return (
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-semibold">Verifying your email...</h1>
        <p className="text-muted-foreground">
          Please wait while we verify your email address.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-semibold text-destructive">
          Verification Failed
        </h1>
        <p className="text-muted-foreground">{error}</p>
        <Button
          variant="outline"
          className="mt-6 w-[200px]"
          onClick={() => router.push('/auth/login')}
        >
          Go to Login
        </Button>
      </div>
    );
  }

  return <AlertDialogUI />;
};

export default VerifyEmail;
