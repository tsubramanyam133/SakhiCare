'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Landmark, ArrowUpRight, GraduationCap, Baby, Shield, MessageCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useDataStore } from '@/store/dataStore';

export default function SchemesPage() {
  const { schemes, fetchSchemes } = useDataStore();
  
  useEffect(() => {
    if (schemes.length === 0) {
      fetchSchemes();
    }
  }, [schemes.length, fetchSchemes]);
  
  // Helper to map icon names to actual Lucide components
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Baby': return Baby;
      case 'GraduationCap': return GraduationCap;
      case 'Landmark': return Landmark;
      case 'Shield': return Shield;
      case 'MessageCircle': return MessageCircle;
      default: return Landmark;
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Government Schemes</h1>
          <p className="text-muted-foreground mt-1">Explore and apply for verified health and welfare schemes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schemes.map(scheme => {
          const Icon = getIcon(scheme.iconName);
          return (
          <Card key={scheme.id} className="flex flex-col h-full shadow-sm hover:shadow-md transition-all hover:border-blue-300 overflow-hidden">
            {scheme.imageUrl ? (
              <div className="h-40 w-full relative bg-muted">
                <img src={scheme.imageUrl} alt={scheme.title} className="w-full h-full object-contain bg-white p-2" />
                <Badge variant="secondary" className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm border-blue-200 text-blue-800 shadow-sm">
                  {scheme.category}
                </Badge>
              </div>
            ) : (
              <CardHeader className="bg-blue-50/50 pb-4 border-b">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 bg-blue-100 text-blue-700 rounded-lg">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="bg-white border-blue-200 text-blue-800">
                    {scheme.category}
                  </Badge>
                </div>
              </CardHeader>
            )}
            
            <CardHeader className={scheme.imageUrl ? "pt-4 pb-2" : "pt-0 pb-2"}>
              <CardTitle className="text-lg mt-0 leading-tight">{scheme.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pt-4 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                {scheme.description}
              </p>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">Eligibility</span>
                <p className="text-sm font-medium">{scheme.eligibility}</p>
              </div>
            </CardContent>
            <CardFooter className="pt-0 border-t p-4 flex flex-col gap-3">
              <a 
                href={scheme.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "default" }), "w-full bg-blue-600 hover:bg-blue-700 text-white")}
              >
                Apply Now <ArrowUpRight className="ml-2 h-4 w-4" />
              </a>
            </CardFooter>
          </Card>
        )})}
      </div>
    </div>
  );
}
