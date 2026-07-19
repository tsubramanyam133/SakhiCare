'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { FloatingChatbot } from '@/components/chat/FloatingChatbot';
import { cn } from '@/lib/utils';

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <main className="flex-1 bg-muted/20 min-h-screen">{children}</main>;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <Navbar />
      <div className="flex flex-1 overflow-hidden transition-all duration-300">
        <Sidebar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative bg-slate-50/50">
          {pathname !== '/' && pathname !== '/ai-chat' && !isAdmin && (
            <div
              className="fixed inset-0 z-0 opacity-25 bg-cover bg-center bg-no-repeat pointer-events-none"
              style={{ backgroundImage: "url('/images/hero_bg.png')" }}
            />
          )}
          <div className="relative z-10 h-full flex flex-col">
            {children}
          </div>
          <FloatingChatbot />
        </main>
      </div>
    </div>
  );
}
