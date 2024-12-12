import type { Metadata } from 'next';
import '@/styles/globals.css';
import { lato } from '../config/fonts/fonts';
import { AuthProvider } from '@/features/auth/providers/auth-context';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Community Connect App',
  description: 'A platform for connecting immigrants in tech'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${lato.variable} font-sans antialiased`}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
