import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { RootLayoutClient } from '@/components/layout/RootLayoutClient';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SAKHI | Women & Child Welfare Platform',
  description: 'AI-powered Women & Child Welfare platform focused on menstrual health, maternal wellness, and healthcare accessibility.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}
