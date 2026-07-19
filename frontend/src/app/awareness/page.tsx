'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, Globe2, Volume2, Search, X, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDataStore, Video } from '@/store/dataStore';

const VIDEOS = [
  {
    id: 1,
    title: "Understanding the Menstrual Cycle",
    description: "Learn about the four phases of the menstrual cycle, common symptoms, and how to maintain healthy habits.",
    duration: "2:45",
    tags: ["Biology", "Basics"],
    image: "/images/videos/video_1.png",
    youtubeId: "lD5OI9936DY"
  },
  {
    id: 2,
    title: "Menstrual Hygiene & Safe Period Care",
    description: "Step-by-step guide to maintaining proper menstrual hygiene, choosing safe products, and preventing infections.",
    duration: "3:10",
    tags: ["Hygiene", "Care"],
    image: "/images/videos/video_2.png",
    youtubeId: "lD5OI9936DY"
  },
  {
    id: 3,
    title: "Healthy Diet During Menstruation",
    description: "Discover iron-rich foods, hydration tips, and personalized nutrition plans to reduce cramps and boost energy.",
    duration: "3:40",
    tags: ["Diet", "Nutrition"],
    image: "/images/videos/video_3.png",
    youtubeId: "okj9Kpb7l5o"
  },
  {
    id: 4,
    title: "Common Menstrual Myths vs Facts",
    description: "Separating generations of myths from scientific facts to empower women with accurate, evidence-based knowledge.",
    duration: "4:15",
    tags: ["Myths", "Education"],
    image: "/images/videos/video_4.png",
    youtubeId: "okj9Kpb7l5o"
  }
];

const LANGUAGES = [
  { code: 'en', name: 'English', script: 'English' },
  { code: 'hi', name: 'Hindi', script: 'हिन्दी' },
  { code: 'te', name: 'Telugu', script: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', script: 'தமிழ்' },
  { code: 'kn', name: 'Kannada', script: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', script: 'മലയാളം' },
  { code: 'mr', name: 'Marathi', script: 'मराठी' },
  { code: 'bn', name: 'Bengali', script: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', script: 'ગુજરાતી' },
  { code: 'pa', name: 'Punjabi', script: 'ਪੰਜਾਬੀ' },
  { code: 'ur', name: 'Urdu', script: 'اردو' }
];

export default function AwarenessPage() {
  const router = useRouter();
  const { videos, fetchVideos } = useDataStore();
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [activeLanguage, setActiveLanguage] = useState('en');

  // Handle browser back button to close video
  useEffect(() => {
    const handlePopState = () => {
      setActiveVideo(null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    fetchVideos();
  }, []);
  const [isPlaying, setIsPlaying] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ title: string, desc: string } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Removed video ref since we are simulating the video with an animated thumbnail
  // to perfectly match the user's highly specific medical prompt for the hackathon demo.

  const handleLanguageSwitch = (lang: typeof LANGUAGES[0]) => {
    setActiveLanguage(lang.code);

    // Stop any currently playing TTS audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const textToSpeak = lang.code === 'en' ? "Welcome to SAKHI AI Women's Health Awareness Program." :
      lang.code === 'hi' ? "सखी एआई महिला स्वास्थ्य जागरूकता कार्यक्रम में आपका स्वागत है।" :
        lang.code === 'te' ? "సఖి AI మహిళా ఆరోగ్య అవగాహన కార్యక్రమానికి స్వాగతం." :
          lang.code === 'ta' ? "சகி AI பெண்கள் சுகாதார விழிப்புணர்வு திட்டத்திற்கு வருக." :
            lang.code === 'mr' ? "सखी एआय महिला आरोग्य जागरूकता कार्यक्रमात आपले स्वागत आहे." :
              lang.code === 'bn' ? "সখী এআই নারী স্বাস্থ্য সচেতনতা প্রোগ্রামে স্বাগতম।" :
                lang.code === 'gu' ? "સખી એઆઈ મહિલા સ્વાસ્થ્ય જાગૃતિ કાર્યક્રમમાં તમારું સ્વાગત છે." :
                  lang.code === 'kn' ? "ಸಖಿ AI ಮಹಿಳಾ ಆರೋಗ್ಯ ಜಾಗೃತಿ ಕಾರ್ಯಕ್ರಮಕ್ಕೆ ಸುಸ್ವಾಗತ." :
                    lang.code === 'ml' ? "സഖി AI വനിതാ ആരോഗ്യ ബോധവൽക്കരണ പ്രോഗ്രാമിലേക്ക് സ്വാഗതം." :
                      lang.code === 'pa' ? "ਸਖੀ AI ਮਹਿਲਾ ਸਿਹਤ ਜਾਗਰੂਕਤਾ ਪ੍ਰੋਗਰਾਮ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ।" :
                        lang.code === 'ur' ? "ساکھی اے آئی خواتین کے صحت کی آگاہی پروگرام میں خوش آمدید۔" :
                          "Welcome to SAKHI AI.";

    if (lang.code !== 'en') {
      try {
        // Use our backend proxy to avoid CORS/Referer block from Google
        const ttsUrl = `http://localhost:5000/api/v1/ai/tts?lang=${lang.code}&text=${encodeURIComponent(textToSpeak)}`;
        const audio = new Audio(ttsUrl);
        audioRef.current = audio;
        audio.play().catch(e => console.error("Audio play failed:", e));
      } catch (err) {
        console.error("TTS error:", err);
      }
    }

    setToastMsg({
      title: "Audio Switched",
      desc: `Audio and subtitles switched to ${lang.script}`
    });
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handlePlayVideo = (video: Video) => {
    setActiveVideo(video);
    setIsPlaying(true);
    setActiveLanguage('en');

    // Add history state so browser back button works
    window.history.pushState({ videoPlaying: true }, '', '?video=playing');

    if (audioRef.current) {
      audioRef.current.pause();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-6xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-400">
            Awareness & Care
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Empowering Women Through Knowledge, AI & Care.
          </p>
        </div>
      </div>

      {toastMsg && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-white border-l-4 border-pink-500 shadow-xl rounded-md p-4 pr-8 max-w-sm">
            <h3 className="font-semibold text-slate-800">{toastMsg.title}</h3>
            <p className="text-sm text-slate-600 mt-1">{toastMsg.desc}</p>
          </div>
        </div>
      )}

      {activeVideo ? (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
          <Button variant="ghost" className="pl-0 text-muted-foreground hover:text-pink-600 transition-transform hover:-translate-x-1" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to videos
          </Button>
          <Card className="border-pink-100 shadow-xl overflow-hidden glassmorphism relative p-0">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-20 text-white hover:bg-white/20"
              onClick={() => setActiveVideo(null)}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Simulated Cinematic Video Player using generated images */}
            <div className="aspect-video bg-black relative flex flex-col items-center justify-center overflow-hidden group">
              {/* The cinematic image thumbnail */}
              <img
                src={activeVideo.image}
                alt={activeVideo.title}
                className={cn(
                  "w-full h-full object-cover opacity-90 transition-transform origin-center",
                  isPlaying ? "duration-[30000ms] ease-linear scale-125" : "duration-500 scale-100"
                )}
              />

              {/* Cinematic Background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-600/10 mix-blend-overlay pointer-events-none"></div>

              {!isPlaying ? (
                <button
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center z-10 bg-black/40 hover:bg-black/20 transition-all group-cursor-pointer"
                >
                  <div className="rounded-full bg-pink-600/90 p-6 text-white hover:bg-pink-600 hover:scale-110 transition-transform shadow-2xl backdrop-blur-sm">
                    <PlayCircle className="h-16 w-16" />
                  </div>
                </button>
              ) : (
                activeVideo.youtubeId ? (
                  <iframe
                    className="absolute inset-0 w-full h-full z-10"
                    src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&mute=${activeLanguage !== 'en' ? '1' : '0'}`}
                    title={activeVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : null
              )}


            </div>

            <CardContent className="p-6 md:p-8 bg-gradient-to-br from-background to-pink-50/30">
              <h2 className="text-2xl font-bold mb-2">{activeVideo.title}</h2>
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed whitespace-pre-wrap">{activeVideo.description}</p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(videos.length > 0 ? videos : VIDEOS).map(video => (
            <Card
              key={video.id || (video as any)._id || Math.random()}
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-muted-foreground/10 hover:border-pink-300 overflow-hidden p-0"
              onClick={() => handlePlayVideo(video)}
            >
              <div className="aspect-video relative flex items-center justify-center overflow-hidden bg-pink-50 rounded-t-xl">
                <img src={video.image} alt={video.title} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                <div className="absolute inset-0 bg-pink-500/10 group-hover:bg-pink-500/20 transition-colors z-10"></div>
                <PlayCircle className="h-12 w-12 text-white/70 group-hover:text-white transition-colors group-hover:scale-110 duration-300 z-20 drop-shadow-lg" />
              </div>
              <CardContent className="p-5">
                <div className="flex flex-wrap gap-2 mb-3">
                  {video.tags?.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="bg-pink-100 text-pink-700 hover:bg-pink-200 border-0 text-[10px]">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h3 className="font-bold text-xl mb-2 group-hover:text-pink-600 transition-colors line-clamp-1">{video.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                  {video.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
