import { Metadata } from 'next';
import AuthCarousel from '@/features/auth/components/auth-carousel';
import { Separator } from '@/shared/components/ui/separator';
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';
export const metadata: Metadata = {
  title: 'Reset Password | Community Connect',
  description: 'Reset Password'
};

const ResetPasswordPage = () => {
  return (
    <div className="container-wide relative flex h-[100vh] items-center justify-between">
      <div className="w-1/4 min-w-[420px]">
        <ForgotPasswordForm />
      </div>
      <Separator orientation="vertical" className="h-full" />
      <div className="w-2/4">
        <AuthCarousel />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
