import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SAKHI Admin Portal',
  description: 'Secure Admin Dashboard for SAKHI platform management.',
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Standalone layout: NO Navbar, NO Sidebar — admin has its own navigation
  return <>{children}</>;
}
