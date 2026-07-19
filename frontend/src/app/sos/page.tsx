'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Phone, ShieldAlert, AlertTriangle, MapPin, MessageSquareWarning } from 'lucide-react';
import { useState } from 'react';

export default function SOSPage() {
  const [isSent, setIsSent] = useState(false);

  const handleTriggerSOS = () => {
    // In a real app, this would get navigator.geolocation and POST to backend
    setIsSent(true);
    setTimeout(() => setIsSent(false), 5000);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl inline-flex mb-2 border border-red-100">
          <ShieldAlert className="h-10 w-10" />
        </div>
        
        <h1 className="text-4xl font-extrabold text-red-600 tracking-tight">Emergency SOS</h1>
        <p className="text-muted-foreground text-lg">
          If you are in immediate danger, use the buttons below to alert authorities or trusted contacts instantly.
        </p>

        {isSent ? (
          <Card className="bg-red-600 text-white border-0 shadow-xl animate-in fade-in zoom-in-95">
            <CardContent className="p-8 flex flex-col items-center justify-center space-y-4">
              <AlertTriangle className="h-12 w-12 animate-pulse" />
              <h3 className="text-2xl font-bold">Alert Sent!</h3>
              <p className="text-red-100">Your location and emergency message have been dispatched to your trusted contacts and local authorities.</p>
            </CardContent>
          </Card>
        ) : (
          <button 
            onClick={handleTriggerSOS}
            className="w-48 h-48 rounded-full bg-gradient-to-br from-red-500 to-rose-600 shadow-2xl text-white font-bold text-2xl flex flex-col items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-95 mx-auto border-4 border-red-200 hover:border-red-100"
          >
            <MapPin className="h-10 w-10" />
            <span>SEND SOS</span>
          </button>
        )}

        <div className="grid grid-cols-2 gap-4 mt-8">
          <a href="tel:1091" className={cn(buttonVariants({ variant: "outline" }), "h-14 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700")}>
            <Phone className="h-5 w-5 mr-2" /> Women Helpline (1091)
          </a>
          <a href="tel:100" className={cn(buttonVariants({ variant: "outline" }), "h-14 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700")}>
            <Phone className="h-5 w-5 mr-2" /> Police (100)
          </a>
          <a href="sms:100" className={cn(buttonVariants({ variant: "outline" }), "h-14 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 col-span-2")}>
            <MessageSquareWarning className="h-5 w-5 mr-2" /> Message Trusted Contacts
          </a>
        </div>
      </div>
    </div>
  );
}
