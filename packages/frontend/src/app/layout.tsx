import type { Metadata } from 'next';
import './globals.css';
import { lato } from './fonts/fonts';

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
      <body className={`${lato.variable} font-lato antialiased`}>
        {children}
      </body>
    </html>
  );
}
