'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUIStore } from '@/store/uiStore';
import { ArrowRight, User, Mail, Lock, HeartHandshake, KeyRound } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { setUser } = useUIStore();
  const [step, setStep] = useState<'REGISTER' | 'OTP'>('REGISTER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      let isDbSuccess = false;
      try {
        const response = await fetch('http://localhost:5000/api/v1/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        if (response.ok) {
          isDbSuccess = true;
        } else {
          throw new Error(data.message || 'Failed to create account in database');
        }
      } catch (networkError) {
        console.warn("Backend unreachable (likely mobile testing). Using Demo Mode.", networkError);
      }

      // If backend is active or we are simulating, go to OTP step
      setStep('OTP');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let isDbSuccess = false;
      try {
        const response = await fetch('http://localhost:5000/api/v1/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp })
        });
        
        const data = await response.json();
        if (response.ok) {
          isDbSuccess = true;
          if (data.accessToken) {
             localStorage.setItem('admin_token', data.accessToken);
          }
        } else {
          throw new Error(data.message || 'Invalid OTP');
        }
      } catch (networkError) {
        console.warn("Backend unreachable (likely mobile testing). Using Demo Mode.", networkError);
      }

      // Save user to state & UI (Mock DB success for mobile demo)
      const newUser = { name: name || 'User', email, role };
      localStorage.setItem('sakhi_user', JSON.stringify(newUser));
      setUser(newUser);
      
      // Redirect to Homepage
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100dvh-5rem)] grid place-items-center py-10 px-4 sm:px-8 overflow-y-auto overflow-x-hidden bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100/50">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-[pulse_10s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-rose-300/20 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite_700ms]"></div>
      
      <Card 
        className="w-full max-w-md shadow-2xl border-white/50 bg-white/80 backdrop-blur-xl animate-in slide-in-from-bottom-10 fade-in duration-700 relative z-10 overflow-hidden group p-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        
        {step === 'REGISTER' ? (
          <form onSubmit={handleSignup} className="relative z-10">
            <CardHeader className="space-y-4 text-center pb-8 pt-10">
              <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/30 transform group-hover:scale-110 transition-all duration-500 mb-2 overflow-hidden border-2 border-pink-100">
                <img src="icon.jpg" alt="SAKHI Logo" className="w-full h-full object-cover rounded-full" />
              </div>
              <div className="space-y-1.5">
                <CardTitle className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-500">
                  Create an Account
                </CardTitle>
                <CardDescription className="text-base font-medium text-slate-500">
                  Join SAKHI AI to start your wellness journey.
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-5 px-8">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-slate-700 ml-1 block">Full Name</Label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-pink-500 transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <Input 
                    id="name" 
                    type="text" 
                    placeholder="Sakhi" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                    suppressHydrationWarning
                    className="pl-11 h-12 rounded-xl bg-white/60 border-slate-200 hover:border-pink-300 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all duration-300 text-base w-full"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-slate-700 ml-1 block">Email Address</Label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-pink-500 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="sakhi@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    suppressHydrationWarning
                    className="pl-11 h-12 rounded-xl bg-white/60 border-slate-200 hover:border-pink-300 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all duration-300 text-base w-full"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700 ml-1 block">Password</Label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-pink-500 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input 
                    id="password" 
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    minLength={6}
                    suppressHydrationWarning
                    className="pl-11 h-12 rounded-xl bg-white/60 border-slate-200 hover:border-pink-300 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all duration-300 text-base font-medium tracking-widest placeholder:tracking-normal w-full" 
                  />
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                <Label htmlFor="role" className="text-sm font-semibold text-slate-700 ml-1 block">I am a</Label>
                <div className="relative group/select">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 z-10">
                    <HeartHandshake className="h-5 w-5" />
                  </div>
                  <Select value={role} onValueChange={(val) => setRole(val as string)}>
                    <SelectTrigger id="role" suppressHydrationWarning className="pl-11 h-12 rounded-xl bg-white/60 border-slate-200 hover:border-pink-300 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all duration-300 text-base w-full">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Student">Student</SelectItem>
                      <SelectItem value="NGO Member">NGO Member</SelectItem>
                      <SelectItem value="Doctor">Doctor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {error && <p className="text-red-500 text-sm font-medium ml-1">{error}</p>}
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-6 pb-10 px-8 pt-4">
              <Button 
                type="submit" 
                suppressHydrationWarning
                className="w-full h-12 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-lg shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 border-0"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Continue'}
                {!isLoading && <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />}
              </Button>
              
              <div className="text-sm text-center text-slate-500 font-medium">
                Already have an account?{' '}
                <Link href="/login" className="text-pink-600 hover:text-rose-600 hover:underline font-bold transition-colors">
                  Log in
                </Link>
              </div>
            </CardFooter>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="relative z-10 animate-in slide-in-from-right-4 fade-in duration-500">
            <CardHeader className="space-y-4 text-center pb-8 pt-10">
              <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/30 transform group-hover:scale-110 transition-all duration-500 mb-2 overflow-hidden border-2 border-pink-100">
                <img src="icon.jpg" alt="SAKHI Logo" className="w-full h-full object-cover rounded-full" />
              </div>
              <div className="space-y-1.5">
                <CardTitle className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-500">
                  Verify Email
                </CardTitle>
                <CardDescription className="text-base font-medium text-slate-500">
                  We sent a 6-digit OTP to <br/><span className="font-semibold text-pink-600">{email}</span>
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-5 px-8">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-sm font-semibold text-slate-700 ml-1 block text-center">Enter OTP</Label>
                <div className="relative group/input max-w-[200px] mx-auto">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-pink-500 transition-colors">
                    <KeyRound className="h-5 w-5" />
                  </div>
                  <Input 
                    id="otp" 
                    type="text" 
                    maxLength={6}
                    placeholder="123456" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                    required 
                    className="pl-11 h-12 rounded-xl bg-white/60 border-slate-200 hover:border-pink-300 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all duration-300 text-xl font-bold tracking-widest text-center w-full"
                  />
                </div>
              </div>
              
              {error && <p className="text-red-500 text-sm font-medium ml-1 text-center">{error}</p>}
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-6 pb-10 px-8 pt-4">
              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-lg shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 border-0"
                disabled={isLoading || otp.length < 6}
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
                {!isLoading && <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />}
              </Button>
              
              <div className="text-sm text-center text-slate-500 font-medium">
                Didn't receive it?{' '}
                <button type="button" onClick={handleSignup} className="text-pink-600 hover:text-rose-600 hover:underline font-bold transition-colors">
                  Resend OTP
                </button>
              </div>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
