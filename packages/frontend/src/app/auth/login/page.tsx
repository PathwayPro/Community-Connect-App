import { Metadata } from 'next';
import { AuthForm } from '@/features/auth/components/auth-form';
import AuthCarousel from '@/features/auth/components/auth-carousel';
import { Separator } from '@/shared/components/ui/separator';
export const metadata: Metadata = {
  title: 'Login | Your App Name',
  description: 'Login to your account to access all features'
};

const LoginPage = () => {
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
};

export default LoginPage;
