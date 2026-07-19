import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight, HeartPulse, Sparkles, Stethoscope, Users, BookOpen, ShieldAlert, Landmark } from 'lucide-react';
import { SchemesBanner } from '@/components/home/SchemesBanner';
import { EducationalSection } from '@/components/home/EducationalSection';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-background/50 to-muted/30">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 opacity-75 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero_bg.png')" }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-background/80 backdrop-blur-md text-muted-foreground shadow-sm mb-4">
            <img src="logo.jpg" alt='logo' className="w-10 h-10" />
            <span>Introducing Smart Healthcare for Women</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            Empowering Women Through{' '}
            <span className="bg-gradient-to-r from-pink-500 to-rose-400 text-transparent bg-clip-text">
              Accessible Healthcare
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            SAKHI is a comprehensive Women & Child Welfare ecosystem designed to help you manage your menstrual health, consult with doctors, and access verified healthcare information in your own language.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/tracker"
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-full sm:w-auto text-base h-12 px-8 bg-pink-500 hover:bg-pink-600 text-white shadow-lg rounded-full hover:shadow-pink-300/50 hover:scale-105 transition-all duration-300"
              )}
            >
              Start Tracking
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/ai-chat"
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-full sm:w-auto h-12 px-8 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-600 to-pink-500 text-white font-semibold shadow-xl hover:from-violet-700 hover:via-fuchsia-700 hover:to-pink-600 hover:-translate-y-1 transition-all duration-300"
              )}
            >
              Chat with Sakhi AI
            </Link>
          </div>
        </div>
      </section>

      <SchemesBanner />

      {/* Features Preview */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/tracker" className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/30 border hover:bg-pink-50/50 hover:border-pink-200 transition-all shadow-sm hover:shadow-md cursor-pointer group">
              <div className="p-3 bg-pink-100 text-pink-600 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                <HeartPulse className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-pink-600 transition-colors">Smart Tracker</h3>
              <p className="text-muted-foreground">Log your periods, symptoms, and mood. Let our system predict your next cycle accurately.</p>
            </Link>

            <Link href="/ai-chat" className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/30 border hover:bg-blue-50/50 hover:border-blue-200 transition-all shadow-sm hover:shadow-md cursor-pointer group">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">Multilingual Voice Guide</h3>
              <p className="text-muted-foreground">Ask health questions in your native language and get verified voice responses instantly.</p>
            </Link>

            <Link href="/locator" className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/30 border hover:bg-emerald-50/50 hover:border-emerald-200 transition-all shadow-sm hover:shadow-md cursor-pointer group">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                <Stethoscope className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-600 transition-colors">Telemedicine</h3>
              <p className="text-muted-foreground">Connect with verified gynecologists and pediatricians via chat or video consultation.</p>
            </Link>

            <Link href="/community" className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/30 border hover:bg-violet-50/50 hover:border-violet-200 transition-all shadow-sm hover:shadow-md cursor-pointer group">
              <div className="p-3 bg-violet-100 text-violet-600 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-violet-600 transition-colors">Community Forum</h3>
              <p className="text-muted-foreground">A safe space to share experiences, ask questions, and support each other anonymously.</p>
            </Link>

            <Link href="/schemes" className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/30 border hover:bg-orange-50/50 hover:border-orange-200 transition-all shadow-sm hover:shadow-md cursor-pointer group">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                <Landmark className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-orange-600 transition-colors">Gov Schemes</h3>
              <p className="text-muted-foreground">Explore and apply for verified health and welfare schemes provided by the government.</p>
            </Link>

            <Link href="/sos" className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/30 border hover:bg-red-50/50 hover:border-red-200 transition-all shadow-sm hover:shadow-md cursor-pointer group">
              <div className="p-3 bg-red-100 text-red-600 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                <ShieldAlert className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-red-600 transition-colors">Emergency SOS</h3>
              <p className="text-muted-foreground">Instantly alert trusted contacts and local authorities if you are in immediate danger.</p>
            </Link>

            <Link href="/awareness" className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/30 border hover:bg-teal-50/50 hover:border-teal-200 transition-all shadow-sm hover:shadow-md cursor-pointer group">
              <div className="p-3 bg-teal-100 text-teal-600 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-teal-600 transition-colors">Awareness & Care</h3>
              <p className="text-muted-foreground">Watch educational videos and learn about menstrual hygiene and women's health.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* New Educational & Basics Section */}
      <EducationalSection />

    </div>
  );
}
