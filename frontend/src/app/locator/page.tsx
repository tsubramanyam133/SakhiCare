'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Star, Video, MessageSquare, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';

import { useDataStore } from '@/store/dataStore';

export default function LocatorPage() {
  const { doctors, fetchDoctors } = useDataStore();
  
  useEffect(() => {
    fetchDoctors();
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Gynecologist', 'Pediatrician', 'Psychiatrist', 'Nutritionist', 'NGO'];

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) || doc.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || doc.specialty.toLowerCase().includes(activeFilter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Find Healthcare</h1>
          <p className="text-muted-foreground mt-1">Consult verified gynecologists, pediatricians, and therapists.</p>
        </div>
      </div>

      <div className="flex gap-2 w-full max-w-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search doctors, specialties, clinics..." 
            className="pl-10 h-12 rounded-full border-muted-foreground/30 shadow-sm focus-visible:ring-emerald-500" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md px-6 hidden sm:flex">
          Search
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map(filter => (
          <Badge 
            key={filter}
            variant="secondary" 
            className={`px-4 py-2 cursor-pointer whitespace-nowrap ${activeFilter === filter ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-muted hover:bg-muted/80'}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map(doc => (
          <Card key={doc.id} className="shadow-sm hover:shadow-md transition-shadow border-muted-foreground/10 overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-300 flex items-center justify-center text-white font-bold text-xl border-2 border-white shadow-sm">
                      {doc.name.split(' ')[1][0]}
                    </div>
                    {doc.isOnline && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-base">{doc.name}</CardTitle>
                    <p className="text-xs text-emerald-600 font-medium">{doc.specialty}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{doc.experience}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              <div className="flex items-center gap-1 text-sm font-medium">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                {doc.rating} <span className="text-muted-foreground font-normal">({doc.reviews} reviews)</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <div>
                  <p>{doc.location}</p>
                  <p className="text-xs">{doc.distance}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {doc.languages.map(lang => (
                  <Badge key={lang} variant="outline" className="text-[10px] bg-muted/30">{lang}</Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 p-4 border-t flex flex-col gap-3">
              <div className="flex justify-between items-center w-full">
                <span className="text-sm text-muted-foreground">Consultation</span>
                <span className="font-bold">{doc.consultationFee}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full">
                <a href="tel:9391361665" className={cn(buttonVariants({ variant: "outline" }), "w-full h-9 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50")}>
                  <Video className="h-3 w-3 mr-1.5" /> Video Consult
                </a>
                <a 
                  href={`https://wa.me/9391361665?text=${encodeURIComponent(`Hello ${doc.name}, I would like to book a clinic appointment.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: "default" }), "w-full h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white")}
                >
                  Book Clinic
                </a>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
