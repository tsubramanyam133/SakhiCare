'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/store/uiStore';
import { Home, Calendar, MessageSquare, BookOpen, Users, MapPin, ShieldAlert, Settings, ChevronLeft, ChevronRight, Landmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const navigation = [
  { name: 'Home', href: '/', icon: Home, iconColor: 'text-indigo-500' },
  { name: 'Menstrual Tracker', href: '/tracker', icon: Calendar, iconColor: 'text-pink-500' },
  { name: 'Sakhi AI', href: '/ai-chat', icon: MessageSquare, iconColor: 'text-violet-500' },
  { name: 'Community', href: '/community', icon: Users, iconColor: 'text-orange-500' },
  { name: 'Awareness & Care', href: '/awareness', icon: BookOpen, iconColor: 'text-emerald-500' },
  { name: 'Gov Schemes', href: '/schemes', icon: Landmark, iconColor: 'text-blue-500' },
  { name: 'Find Healthcare', href: '/locator', icon: MapPin, iconColor: 'text-teal-500' },
  { name: 'Emergency SOS', href: '/sos', icon: ShieldAlert, danger: true, iconColor: 'text-red-600' },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { isSidebarOpen, setSidebarOpen } = useUIStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname, setSidebarOpen]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-card border-r shadow-xl lg:static lg:h-full flex-col",
          isSidebarOpen ? "flex pt-16 lg:pt-0" : "hidden lg:flex",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex-1 overflow-y-auto py-4 px-3 gap-1 flex flex-col">
          {/* Toggle Button */}
          <div className="hidden lg:flex justify-end mb-4 px-2">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
          </div>
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : item.danger
                      ? "text-red-500 hover:bg-red-500/10"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  isCollapsed ? "justify-center px-0" : "px-3"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0",
                    isActive ? "text-primary" : item.danger ? "text-red-500" : item.iconColor
                  )}
                />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};
