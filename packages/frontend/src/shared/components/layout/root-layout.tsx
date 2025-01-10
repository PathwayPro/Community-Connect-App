'use client';

import { Toaster } from 'sonner';
import { AuthProvider } from '@/features/auth/providers/auth-context';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@/styles/theme-provider';
import MainLayout from './main-layout';

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
        {isAuth ? (
          children
        ) : (
          <MainLayout>
            <div className="flex w-full">{children}</div>
          </MainLayout>
        )}
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}
