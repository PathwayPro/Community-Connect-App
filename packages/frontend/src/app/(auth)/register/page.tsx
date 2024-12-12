import { AuthForm } from '@/features/auth/components/auth-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register | Your App Name',
  description: 'Register to your account to access all features'
};

export default function RegisterPage() {
  return (
    <div className="container flex w-full max-w-[480px] flex-col items-center justify-center space-y-6 py-10">
      <AuthForm />
    </div>
  );
}
