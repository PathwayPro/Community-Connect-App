import type { Metadata } from 'next';
import '@/styles/globals.css';
import { lato } from '../config/fonts/fonts';
import { AuthProvider } from '@/features/auth/providers/auth-context';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/styles/theme-provider';

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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
