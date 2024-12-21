import AuthCarousel from '@/features/auth/components/auth-carousel';
import { AuthForm } from '@/features/auth/components/auth-form';
import { Separator } from '@/shared/components/ui/separator';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register | Community Connect',
  description: 'Register to your account to access all features'
};

export default function RegisterPage() {
  return (
    <div className="container-wide relative flex h-[100vh] items-center justify-between">
      <div className="w-1/4 min-w-[420px]">
        <AuthForm />
      </div>
      <Separator orientation="vertical" className="h-full" />
      <div className="w-2/4">
        <AuthCarousel />
      </div>
    </div>
  );
}
