'use client';

import { Toaster } from 'sonner';
import { AuthProvider } from '@/features/auth/providers/auth-context';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@/styles/theme-provider';
import MainLayout from './main-layout';
import { TooltipProvider } from '@/shared/components/ui/tooltip';

export function RootLayoutClient({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuth = pathname.startsWith('/auth');

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          {isAuth ? (
            children
          ) : (
            <MainLayout>
              <div className="flex w-full">{children}</div>
            </MainLayout>
          )}
        </TooltipProvider>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}
