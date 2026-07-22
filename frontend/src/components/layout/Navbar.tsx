'use client';

import Link from 'next/link';
import { Menu, X, User as UserIcon, Bell } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useDataStore } from '@/store/dataStore';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export const Navbar = () => {
  const { isSidebarOpen, toggleSidebar, user, setUser } = useUIStore();
  const { notifications, clearNotifications } = useDataStore();
  const [activePeriodMsg, setActivePeriodMsg] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const savedUser = localStorage.getItem('sakhi_user');
    if (savedUser && !user) setUser(JSON.parse(savedUser));

    // Check for active period (logged within last 5 days with active flow)
    try {
      const logsStr = localStorage.getItem('sakhi_cycle_logs');
      if (logsStr) {
        const logs = JSON.parse(logsStr);
        if (Array.isArray(logs) && logs.length > 0) {
          const activeLog = logs.find((l: any) => l.flow && l.flow !== 'None');
          if (activeLog && activeLog.date) {
            const latestLogDate = new Date(activeLog.date);
            const today = new Date();
            if (!isNaN(latestLogDate.getTime())) {
              const diffTime = today.getTime() - latestLogDate.getTime();
              const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

              if (diffDays >= 1 && diffDays <= 5) {
                setActivePeriodMsg(`Active Period Alert: You are on day ${diffDays} of your cycle. Remember to maintain hygiene, stay hydrated, and rest!`);
              } else {
                setActivePeriodMsg(null);
              }
            } else {
              setActivePeriodMsg(null);
            }
          } else {
            setActivePeriodMsg(null);
          }
        } else {
          setActivePeriodMsg(null);
        }
      } else {
        setActivePeriodMsg(null);
      }
    } catch (e) {
      setActivePeriodMsg(null);
    }
  }, [setUser, user]);

  const handleLogout = () => {
    localStorage.removeItem('sakhi_user');
    localStorage.removeItem('sakhi_cycle_logs');
    setUser(null);
    router.push('/');
  };

  const isHomePage = pathname === '/';
  const [isHovered, setIsHovered] = useState(false);
  const showNavbar = isHomePage || isHovered;

  return (
    <>
      {/* Invisible hover trigger */}
      {!isHomePage && (
        <div 
          className="fixed top-0 left-0 w-full h-4 z-[60]"
          onMouseEnter={() => setIsHovered(true)}
          style={{ pointerEvents: showNavbar ? 'none' : 'auto' }}
        />
      )}

      <header 
        className={cn(
          "w-full h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm transition-all duration-300 z-50 shrink-0",
          showNavbar ? "mt-0" : "-mt-16"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <button
              type="button"
              className="lg:hidden p-2 -ml-2 mr-2 text-muted-foreground hover:bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={toggleSidebar}
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/logo.jpg"
                alt="SAKHI Logo"
                className="h-14 w-auto object-contain rounded-md"
              />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-6">
            {/* Navlinks removed as per request */}
          </nav>          <div className="flex items-center gap-2 sm:gap-4">
            {user && (notifications.length > 0 || activePeriodMsg) && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-pink-600 hover:text-pink-700 hover:bg-pink-50"
                  onClick={() => {
                    const el = document.getElementById('notification-dropdown');
                    if (el) el.classList.toggle('hidden');
                  }}
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                </Button>

                {/* Notification Dropdown */}
                <div id="notification-dropdown" className="hidden absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-pink-100 overflow-hidden z-[100] animate-in slide-in-from-top-2">
                  <div className="bg-pink-50/80 px-4 py-3 border-b border-pink-100 flex justify-between items-center">
                    <h3 className="font-semibold text-pink-900">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {activePeriodMsg && (
                      <div className="p-4 border-b border-pink-100 bg-pink-50/50 hover:bg-pink-50 transition-colors cursor-pointer" onClick={() => alert("SAKHI Advice: Drink 8 glasses of water, avoid caffeine, and use a heating pad if you have cramps.")}>
                        <div className="flex gap-3 items-start">
                          <div className="mt-0.5 w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                          <p className="text-sm text-pink-900 font-medium leading-relaxed">{activePeriodMsg}</p>
                        </div>
                      </div>
                    )}
                    {notifications.map((n, i) => (
                      <div key={i} className="p-4 border-b border-gray-50 hover:bg-slate-50 transition-colors">
                        <div className="flex gap-3 items-start">
                          <div className={cn("mt-0.5 w-2 h-2 rounded-full", n.type === 'alert' ? 'bg-red-500' : n.type === 'success' ? 'bg-emerald-500' : 'bg-pink-500')} />
                          <p className="text-sm text-slate-700 leading-relaxed">{n.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-300 flex items-center justify-center text-white font-bold shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium hidden md:block">Hi, {user.name}</span>
                </div>
                <Button
                  size="sm"
                  onClick={handleLogout}
                  className="text-sm bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-md border-0 transition-all"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden sm:flex text-sm font-medium")}>
                  Log in
                </Link>
                <Link href="/signup" className={cn(buttonVariants({ size: "sm" }), "text-sm font-medium shadow-md transition-transform hover:scale-105")}>
                  Get Started
                </Link>
              </>
            )}

            {/* Mobile Profile Icon */}
            <div className="sm:hidden ml-1">
              {user ? (
                <div
                  className="h-8 w-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-300 flex items-center justify-center text-white font-bold shadow-sm cursor-pointer"
                  onClick={() => router.push('/tracker')}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => router.push('/login')}>
                  <UserIcon className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
    </>
  );
};
