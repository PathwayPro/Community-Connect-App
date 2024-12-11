import { Metadata } from 'next';
import { AuthForm } from '@/features/auth/components/auth-form';

export const metadata: Metadata = {
  title: 'Login | Your App Name',
  description: 'Login to your account to access all features'
};

const LoginPage = () => {
  return (
    <div className="container flex w-full max-w-[480px] flex-col items-center justify-center space-y-6 py-10">
      <AuthForm />
    </div>
  );
};

export default LoginPage;
