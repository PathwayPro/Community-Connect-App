import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/use-auth';

interface VerifyEmailProps {
  token: string;
}

export const VerifyEmail = ({ token }: VerifyEmailProps) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { verifyEmail } = useAuth();

  useEffect(() => {
    const verifyEmailToken = async () => {
      try {
        const response = await verifyEmail(token);

        console.log('response from verify email here', response);

        router.push('/auth/login');
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Verification failed';
        setError(errorMessage);
        setTimeout(() => {
          router.push('/auth/login');
        }, 10000);
      }
    };

    verifyEmailToken();
  }, [token, router, verifyEmail]);

  if (error) {
    return (
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-semibold text-destructive">
          Verification Failed
        </h1>
        <p className="text-muted-foreground">{error}</p>
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
