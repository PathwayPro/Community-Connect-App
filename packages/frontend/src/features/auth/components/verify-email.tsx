'use client';

/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useAuth } from '../hooks/use-auth';
import { AccessToken } from '../types';
import AlertDialogUI from '@/shared/components/notification/alert-dialog';
import { Button } from '@/shared/components/ui/button';
import { useRouter } from 'next/navigation';

interface VerifyEmailProps {
  token: AccessToken;
}

export const VerifyEmail = ({ token }: VerifyEmailProps) => {
  const { verifyEmail, dialogState, setDialogState, error, setError } =
    useAuth();
  const router = useRouter();

  useEffect(() => {
    let isVerifying = true;

    const verifyEmailToken = async () => {
      if (!isVerifying) return;

      try {
        await verifyEmail(token);
      } catch (error) {
        if (isVerifying) {
          const errorMessage =
            error instanceof Error ? error.message : 'Verification failed';
          setError(errorMessage);
        }
      }
    };

    verifyEmailToken();

    return () => {
      isVerifying = false;
    };
  }, []);

  if (dialogState.isOpen) {
    return (
      <AlertDialogUI
        title={dialogState.title}
        description={dialogState.description}
        open={dialogState.isOpen}
        onOpenChange={(open) =>
          setDialogState((prev) => ({ ...prev, isOpen: open }))
        }
      />
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

  return (
    <div className="text-center">
      <h1 className="mb-4 text-2xl font-semibold">Verifying your email...</h1>
      <p className="text-muted-foreground">
        Please wait while we verify your email address.
      </p>
    </div>
  );
};

export default VerifyEmail;
