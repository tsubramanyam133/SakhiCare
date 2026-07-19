'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Leaf, Droplets, Smartphone, X, Maximize2 } from 'lucide-react';

export function EducationalSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-20 bg-pink-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-400 mb-4">
            Understanding Your Body & Health
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A quick guide to menstruation basics, hygiene practices, and how SAKHI AI helps you track everything.
          </p>
        </div>

        <div className="space-y-24">
          {/* Section 1: Menstruation Basics */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 space-y-6">
              <div className="inline-flex items-center justify-center p-3 bg-pink-100 text-pink-600 rounded-2xl shadow-sm mb-2">
                <Leaf className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">What is Menstruation?</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                Menstruation is a natural biological process in which the uterus sheds its inner lining every month. It is a sign of good reproductive health.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-slate-800">When does it start?</h4>
                    <p className="text-sm text-slate-600 mt-1">Usually between 10 to 15 years of age, but it is different for every girl.</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-slate-800">How long does it last?</h4>
                    <p className="text-sm text-slate-600 mt-1">Usually 3 to 7 days. It may be more or less in some girls.</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-slate-800">How often does it come?</h4>
                    <p className="text-sm text-slate-600 mt-1">Usually every 21 to 35 days. It may be irregular in the first few years.</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-slate-800">Common Symptoms</h4>
                    <p className="text-sm text-slate-600 mt-1">Cramps, back pain, tiredness, mood changes, bloating, and headache.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/50 bg-white/50 p-4 cursor-pointer group" onClick={() => setIsModalOpen(true)}>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                  <div className="bg-white/90 text-pink-600 px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg transform scale-95 group-hover:scale-100 transition-transform">
                    <Maximize2 className="h-4 w-4" /> Enlarge
                  </div>
                </div>
                <img 
                  src="/images/education/menstruation_basics_new.jpg" 
                  alt="Menstruation Basics Infographic"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>

          {/* Lightbox Modal */}
          {isModalOpen && (
            <div 
              className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-6 sm:p-12 backdrop-blur-sm animate-in fade-in duration-200 cursor-zoom-out"
              onClick={() => setIsModalOpen(false)}
            >
              <button 
                onClick={(e) => { e.stopPropagation(); setIsModalOpen(false); }}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 sm:p-3 bg-pink-600 hover:bg-pink-700 text-white shadow-2xl rounded-full transition-transform hover:scale-110 z-[100] border-2 border-white/50 cursor-pointer"
                title="Close"
              >
                <X className="h-6 w-6 sm:h-8 sm:w-8 stroke-[3]" />
              </button>
              <div 
                className="relative w-full max-w-[90vw] max-h-[85vh] bg-white rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 cursor-default"
                onClick={(e) => e.stopPropagation()}
              >
                <img 
                  src="/images/education/menstruation_basics_new.jpg"
                  alt="Infographic Enlarged"
                  className="w-full h-full max-h-[85vh] object-contain p-2"
                />
              </div>
            </div>
          )}

          {/* Section 2: Hygiene */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 order-2 md:order-1">
              <div className="relative aspect-video md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/50 bg-white/50 p-4">
                <img 
                  src="/images/education/hygiene_matters_new.jpg" 
                  alt="Menstrual Hygiene Matters Infographic"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-6 order-1 md:order-2">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 text-blue-600 rounded-2xl shadow-sm mb-2">
                <Droplets className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Menstrual Hygiene Matters</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                Good menstrual hygiene prevents infections, reduces odors, and helps you stay comfortable throughout the day.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex gap-4 items-start">
                    <div className="font-bold text-2xl text-blue-300">1</div>
                    <div>
                      <h4 className="font-semibold text-slate-800">Change Frequently</h4>
                      <p className="text-sm text-slate-600 mt-1">Change pads every 4-6 hours, or tampons every 4-8 hours.</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex gap-4 items-start">
                    <div className="font-bold text-2xl text-blue-300">2</div>
                    <div>
                      <h4 className="font-semibold text-slate-800">Wash properly</h4>
                      <p className="text-sm text-slate-600 mt-1">Wash your genital area with warm water from front to back.</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex gap-4 items-start">
                    <div className="font-bold text-2xl text-blue-300">3</div>
                    <div>
                      <h4 className="font-semibold text-slate-800">Stay Hydrated</h4>
                      <p className="text-sm text-slate-600 mt-1">Drink plenty of water to reduce bloating and cramps.</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex gap-4 items-start">
                    <div className="font-bold text-2xl text-blue-300">4</div>
                    <div>
                      <h4 className="font-semibold text-slate-800">Diet & Rest</h4>
                      <p className="text-sm text-slate-600 mt-1">Eat iron-rich foods and ensure you get enough sleep.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>



        </div>
      </div>
    </section>
  );
}
