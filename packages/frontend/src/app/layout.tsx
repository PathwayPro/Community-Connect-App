import type { Metadata } from 'next';
import '@/styles/globals.css';
import { lato } from '../config/fonts/fonts';
import { RootLayoutClient } from '@/shared/components/layout';

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
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
