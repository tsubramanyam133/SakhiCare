'use client';

import Link from 'next/link';
import { LogOut, LayoutDashboard, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminNavbarProps {
  onLogout: () => void;
}

export const AdminNavbar = ({ onLogout }: AdminNavbarProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-slate-900 via-pink-950 to-slate-900 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Left: Logo + Admin Badge */}
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-3">
              <img
                src="/logo.jpg"
                alt="SAKHI Logo"
                className="h-10 w-auto object-contain rounded-md"
              />
              <div className="flex flex-col leading-tight">
                <span className="text-white font-bold text-lg tracking-wide">SAKHI</span>
                <span className="text-pink-300 text-xs font-medium tracking-widest uppercase">Admin Portal</span>
              </div>
            </Link>
            <div className="hidden sm:flex items-center gap-1.5 bg-pink-500/20 border border-pink-400/30 text-pink-300 px-3 py-1 rounded-full text-xs font-semibold">
              <Shield className="h-3 w-3" />
              Secured Access
            </div>
          </div>

          {/* Center: Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/admin"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white/10 text-white border border-white/10 transition-all"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-pink-200 hover:bg-white/10 hover:text-white transition-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Website ↗
            </Link>
          </nav>

          {/* Right: Admin Info + Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold shadow-md text-sm">
                A
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-white text-sm font-semibold">Administrator</span>
                <span className="text-pink-300 text-xs">Full Access</span>
              </div>
            </div>
            <div className="w-px h-8 bg-white/20 hidden sm:block" />
            <Button
              onClick={onLogout}
              size="sm"
              className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-md border-0 transition-all hover:shadow-lg gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>

        </div>
      </div>
    </header>
  );
};
