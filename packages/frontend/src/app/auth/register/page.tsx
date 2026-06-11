import { AuthCarousel } from '@/features/auth/components';
import { AuthForm } from '@/features/auth/components';
import { Separator } from '@/shared/components/ui/separator';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register | CommuNet',
  description: 'Register to your account to access all features'
};

export default function RegisterPage() {
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-screen-xl items-center justify-center px-4 sm:gap-8 md:gap-12 lg:gap-16">
      <div className="w-full sm:w-[420px]">
        <AuthForm />
      </div>
      <div className="hidden sm:block">
        <Separator
          orientation="vertical"
          className="mx-6 h-[70vh] md:mx-8 lg:mx-10"
        />
      </div>
      <div className="hidden flex-1 sm:block">
        <AuthCarousel />
      </div>
    </div>
  );
}
