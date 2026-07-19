'use client';

import { useDataStore } from '@/store/dataStore';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { useEffect } from 'react';
 

export function SchemesBanner() {
  const { schemes, fetchSchemes } = useDataStore();

  useEffect(() => {
    if (schemes.length === 0) {
      fetchSchemes();
    }
  }, [schemes.length, fetchSchemes]);

  // ALWAYS return the wrapper to prevent React hydration mismatch!
  return (
    <div className="w-full bg-orange-50 border-y border-orange-100 overflow-hidden py-4 min-h-[300px]">
      <div className="container mx-auto px-4 mb-2">
        <h3 className="text-sm font-semibold text-orange-800 uppercase tracking-wider flex items-center gap-2">
          Featured Government Schemes
        </h3>
      </div>
      
      {/* Schemes Marquee container */}
      <div className="relative overflow-hidden group py-2">
        <div className="flex flex-nowrap w-max gap-6 px-4 pb-4 animate-marquee">
          {(!schemes || schemes.length === 0) ? (
          <div className="text-muted-foreground italic py-4">Loading schemes...</div>
        ) : (
          /* We map twice to create an infinite loop effect */
          [...schemes, ...schemes, ...schemes].map((scheme, idx) => (
            <Link 
              href="/schemes" 
              key={`${scheme.id}-${idx}`}
              className="flex flex-col bg-white rounded-xl shadow-sm border border-orange-100 hover:shadow-md transition-shadow shrink-0 w-[280px] overflow-hidden"
            >
              <div className="h-32 w-full relative bg-muted">
                {scheme.imageUrl ? (
                  <img src={scheme.imageUrl} alt={scheme.title || 'Scheme'} className="w-full h-full object-contain bg-white p-1" />
                ) : (
                  <div className="w-full h-full bg-orange-100 flex items-center justify-center text-orange-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex flex-col p-4">
                <span className="font-bold text-sm truncate">{scheme.title || 'Government Scheme'}</span>
                <span className="text-xs text-muted-foreground mt-1 truncate">{scheme.category || 'Welfare'}</span>
                <span className="text-xs font-semibold text-orange-600 flex items-center mt-3">
                  View Details <ExternalLink className="h-3 w-3 ml-1" />
                </span>
              </div>
            </Link>
          ))
        )}
        </div>
      </div>
    </div>
  );
}
