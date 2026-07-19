'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUIStore } from '@/store/uiStore';
import { Sparkles, ArrowRight, Phone, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useUIStore();
  const [phone, setPhone] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = localStorage.getItem('sakhi_user');
    let name = 'Nyra';
    if (existing) {
      try { name = JSON.parse(existing).name || name; } catch (e) { }
    }
    const newUser = { name, phone };
    localStorage.setItem('sakhi_user', JSON.stringify(newUser));
    localStorage.removeItem('admin_token');
    setUser(newUser);
    router.push('/');
  };

  return (
    <div className="relative min-h-[calc(100dvh-5rem)] flex flex-col justify-center items-center p-4 sm:p-8 overflow-y-auto overflow-x-hidden bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100/50">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-[pulse_10s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-rose-300/20 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite_700ms]"></div>

      <Card
        className="w-full max-w-md shadow-2xl border-white/50 bg-white/80 backdrop-blur-xl animate-in slide-in-from-bottom-10 fade-in duration-700 relative z-10 overflow-hidden group p-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        <form onSubmit={handleLogin} className="relative z-10">
          <CardHeader className="space-y-4 text-center pb-8 pt-10">
            <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/30 transform group-hover:scale-110 transition-all duration-500 mb-2 overflow-hidden border-2 border-pink-100">
              <img src="icon.jpg" alt="SAKHI Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="space-y-1.5">
              <CardTitle className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-500">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-base font-medium text-slate-500">
                Enter your credentials to access your account.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 px-8">
            <div className="space-y-2.5">
              <Label htmlFor="phone" className="text-sm font-semibold text-slate-700 ml-1 block">Phone Number</Label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-pink-500 transition-colors">
                  <Phone className="h-5 w-5" />
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  suppressHydrationWarning
                  className="pl-11 h-12 rounded-xl bg-white/60 border-slate-200 hover:border-pink-300 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all duration-300 text-base w-full"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700 block">Password</Label>
                <Link href="#" className="text-sm font-bold text-pink-600 hover:text-rose-500 hover:underline transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-pink-500 transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  suppressHydrationWarning
                  className="pl-11 h-12 rounded-xl bg-white/60 border-slate-200 hover:border-pink-300 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all duration-300 text-base font-medium tracking-widest placeholder:tracking-normal w-full"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-6 pb-10 px-8 pt-4">
            <Button
              type="submit"
              suppressHydrationWarning
              className="w-full h-12 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-lg shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 border-0"
            >
              Sign In
              <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
            </Button>

            <div className="text-sm text-center text-slate-500 font-medium">
              Don't have an account?{' '}
              <Link href="/signup" className="text-pink-600 hover:text-rose-600 hover:underline font-bold transition-colors">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
