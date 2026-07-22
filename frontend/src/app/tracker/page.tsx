'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Droplets, Smile, Activity, MessageCircleHeart, X, Lock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDataStore } from '@/store/dataStore';
import Link from 'next/link';
import { apiClient } from '@/services/apiClient';

// ── Generate a personalized suggestion based on a log entry ──
function generateSuggestion(log: any, logIndex: number): string {
  const flow = log.flow || 'None';
  const mood = log.mood || '';
  const symptoms: string[] = log.symptoms || [];

  if (symptoms.includes('Cramps') && flow === 'Heavy') {
    return `🩸 On day ${logIndex + 1}: Heavy flow with cramps detected. Try a warm heating pad on your lower abdomen, stay hydrated with warm ginger tea, and avoid caffeine. Rest when possible.`;
  }
  if (symptoms.includes('Headache')) {
    return `💊 On day ${logIndex + 1}: Headache reported. Stay well-hydrated (aim for 8+ glasses), avoid bright screens, and consider a gentle neck/shoulder massage. Magnesium-rich foods like dark chocolate or nuts can help.`;
  }
  if (symptoms.includes('Bloating')) {
    return `🥗 On day ${logIndex + 1}: Bloating noticed. Reduce salt intake, avoid carbonated drinks, and eat smaller meals. Light yoga stretches like the "child's pose" can provide quick relief.`;
  }
  if (symptoms.includes('Fatigue')) {
    return `😴 On day ${logIndex + 1}: Fatigue logged. Prioritize 7–8 hours of sleep, eat iron-rich foods like spinach and lentils to counter blood loss, and consider a 10-min afternoon nap.`;
  }
  if (symptoms.includes('Acne')) {
    return `✨ On day ${logIndex + 1}: Skin sensitivity noted. Keep your skin clean but avoid over-washing. Use non-comedogenic products, and drink plenty of water. Hormonal acne often peaks before periods.`;
  }
  if (mood === 'Anxious' || mood === 'Sad') {
    return `💜 On day ${logIndex + 1}: Mood dip noted — totally normal! Low estrogen before periods can affect serotonin. Try a 15-min walk in sunlight, practice deep breathing, or talk to someone you trust.`;
  }
  if (mood === 'Angry') {
    return `🌿 On day ${logIndex + 1}: Feeling irritable? Hormonal shifts are the cause. Channel energy into light exercise, journaling, or creative activities. Avoid high-sugar foods that can amplify mood swings.`;
  }
  if (flow === 'Light' && symptoms.length === 0) {
    return `🌸 Day ${logIndex + 1} looks great! Light flow and no major symptoms — your body is doing well. Keep maintaining good sleep, balanced nutrition, and stay physically active.`;
  }
  if (flow === 'Medium') {
    return `💧 Day ${logIndex + 1}: Medium flow. Change your pad/tampon every 4–6 hours, wear breathable cotton underwear, and keep iron-rich snacks like dates or almonds handy to maintain energy levels.`;
  }
  return `📋 Day ${logIndex + 1} logged! Every entry helps SAKHI understand your unique cycle patterns better. Keep logging consistently for more accurate predictions and personalized health tips.`;
}

export default function TrackerPage() {
  const { addNotification } = useDataStore();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [flow, setFlow] = useState<string>('None');
  const [mood, setMood] = useState<string>('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [savedLogs, setSavedLogs] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Suggestion popup state
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState<string>('');
  const [hasNewSuggestion, setHasNewSuggestion] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('sakhi_user');
    if (userStr) {
      try { setCurrentUser(JSON.parse(userStr)); } catch (e) { }
    }
    const saved = localStorage.getItem('sakhi_cycle_logs');
    if (saved) {
      try { setSavedLogs(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const toggleSymptom = (s: string) => {
    setSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const handleSaveLog = async () => {
    if (!date) return;

    // Convert to the string format used by the frontend
    const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const newLog = {
      date: dateString,
      flow,
      mood,
      symptoms
    };

    try {
      const userStr = localStorage.getItem('sakhi_user');
      const tokenStr = localStorage.getItem('admin_token'); // <--- CHANGED HERE

      if (userStr && tokenStr) {
        // We stored the raw token string in admin_token during signup
        const accessToken = tokenStr;
        // Call backend API to save cycle and trigger prediction email using apiClient
        await apiClient.post('/tracker/cycles', {
          startDate: date.toISOString(), // Send standard ISO string to backend
          cycleLength: 28, // Default
          periodLength: 5  // Default
        });
      }
    } catch (e) {
      console.error('Failed to save to backend', e);
    }

    setSavedLogs(prev => {
      const filtered = prev.filter(l => l.date !== newLog.date);
      const updated = [newLog, ...filtered];
      localStorage.setItem('sakhi_cycle_logs', JSON.stringify(updated));

      // Dispatch event to notify Navbar immediately
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('sakhi_log_updated'));
      }

      // Generate suggestion for the newest log
      const suggestion = generateSuggestion(newLog, 0);
      setActiveSuggestion(suggestion);
      setHasNewSuggestion(true);
      return updated;
    });

    const isPeriodFlow = flow && flow !== 'None';
    const notificationMsg = isPeriodFlow 
      ? `🩸 Active Period Day logged! (${flow} flow). Remember to maintain hygiene, stay hydrated, and rest.`
      : `📋 Log entry saved for ${dateString}. Keep tracking regularly with SAKHI!`;

    addNotification({
      message: notificationMsg,
      type: isPeriodFlow ? 'alert' : 'info'
    });

    setFlow('None');
    setMood('');
    setSymptoms([]);
  };

  const handleOpenSuggestion = (log: any, idx: number) => {
    setActiveSuggestion(generateSuggestion(log, idx));
    setSuggestionOpen(true);
    setHasNewSuggestion(false);
  };

  // Mock data
  const nextPeriod = new Date();
  nextPeriod.setDate(nextPeriod.getDate() + 14);
  const ovulation = new Date();
  ovulation.setDate(ovulation.getDate() + 2);

  // ── Helper: prompt login if user tries an action without being logged in ──
  const requireLogin = (action: () => void) => {
    if (!currentUser) {
      alert('Please log in first to log your cycle data. Click "Log In" or "Get Started" in the top navigation.');
      return;
    }
    action();
  };
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Suggestion Popup Modal */}
      {suggestionOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center shadow-md">
                  <MessageCircleHeart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">SAKHI Health Tip</h3>
                  <p className="text-xs text-muted-foreground">Personalised suggestion based on your log</p>
                </div>
              </div>
              <button
                onClick={() => setSuggestionOpen(false)}
                className="p-1.5 rounded-full hover:bg-muted text-muted-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
              <p className="text-slate-700 leading-relaxed text-sm">{activeSuggestion}</p>
            </div>
            <Button
              className="w-full mt-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0"
              onClick={() => setSuggestionOpen(false)}
            >
              Got it, Thanks! 💗
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menstrual Tracker</h1>
          <p className="text-muted-foreground mt-1">Log your cycle and get personalised health suggestions.</p>
        </div>
        <Button
          className="bg-pink-600 hover:bg-pink-700 text-white shadow-lg transition-transform hover:scale-105"
          onClick={() => document.getElementById('log-form')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <Droplets className="mr-2 h-4 w-4" />
          {savedLogs.length > 0 ? `${savedLogs.length} Day${savedLogs.length !== 1 ? 's' : ''} Logged` : 'Log Period Today'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="md:col-span-5 lg:col-span-4 space-y-6">
          <Card className="border-pink-100 shadow-md">
            <CardHeader className="bg-pink-50/50 pb-4 border-b">
              <CardTitle className="text-lg flex items-center gap-2 text-pink-900">
                <CalendarDays className="h-5 w-5 text-pink-500" />
                Cycle Calendar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
                modifiers={{
                  period: savedLogs.map(l => new Date(l.date)),
                  ovulation: [ovulation]
                }}
                modifiersStyles={{
                  period: { backgroundColor: '#fdf2f8', color: '#db2777', fontWeight: 'bold' },
                  ovulation: { backgroundColor: '#eff6ff', color: '#2563eb', fontWeight: 'bold' }
                }}
              />
            </CardContent>
          </Card>

          {/* AI Prediction Card */}
          <Card className="bg-gradient-to-br from-pink-500 to-rose-400 text-white shadow-lg border-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Activity className="h-24 w-24" />
            </div>
            <CardHeader>
              <CardTitle className="text-lg">
                {savedLogs.length > 0 ? 'Cycle Prediction' : 'No Data Yet'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              {savedLogs.length === 0 ? (
                <p className="text-pink-100 text-sm leading-relaxed">
                  Please log your period days below to receive AI-powered cycle predictions and personalised health insights.
                </p>
              ) : (
                <>
                  <div>
                    <p className="text-pink-100 text-sm">Next Period In</p>
                    <h3 className="text-4xl font-extrabold mt-1">14 Days</h3>
                    <p className="text-sm mt-1">{nextPeriod.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                  <div className="pt-4 border-t border-pink-400/30">
                    <p className="text-pink-100 text-sm">Fertile Window Approaching</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0 py-4 ml-0">
                        High Chance of Ovulation in 2 Days
                      </Badge>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-pink-400/30">
                    <p className="text-pink-100 text-sm">Total Cycle Logs Saved</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="bg-pink-100 text-pink-700 hover:bg-pink-200 border-0 text-lg px-3 py-4">
                        {savedLogs.length} Day{savedLogs.length !== 1 ? 's' : ''} Logged
                      </Badge>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* How It Works Infographic (Desktop) */}
          <div className="w-full mt-6 hidden md:block">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-slate-800">How SAKHI Tracker Works</h3>
              <p className="text-sm text-slate-600 mt-1">Smart Technology. Personal Care. Better Health.</p>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-pink-100 bg-white p-2 cursor-pointer group">
              <img
                src="/images/education/tracker_works.jpg"
                alt="How SAKHI Tracker Works"
                className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Log Form */}
        <div className="md:col-span-7 lg:col-span-8 space-y-6">
          <Card id="log-form" className="shadow-md bg-gradient-to-br from-emerald-50 to-orange-50 border-emerald-100">
            <CardHeader>
              <CardTitle>Log for {date?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</CardTitle>
              <CardDescription>Track your symptoms for personalised health suggestions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">

              {/* Login Banner for guests */}
              {!currentUser && (
                <div className="flex items-center gap-3 bg-pink-50 border border-pink-200 rounded-xl px-4 py-3">
                  <Lock className="h-5 w-5 text-pink-500 flex-shrink-0" />
                  <p className="text-sm text-pink-700 flex-1">
                    <strong>Login required</strong> — Please{' '}
                    <Link href="/login" className="underline font-semibold hover:text-pink-900">log in</Link>
                    {' '}to save your cycle data.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-emerald-600" /> Flow Intensity
                </h4>
                <div className="flex flex-wrap gap-3">
                  {['None', 'Light', 'Medium', 'Heavy'].map(level => (
                    <Button
                      key={level}
                      variant={flow === level ? 'default' : 'outline'}
                      onClick={() => setFlow(level)}
                      className={flow === level ? 'bg-emerald-600 text-white hover:bg-emerald-700' : ''}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Smile className="h-4 w-4 text-orange-500" /> Mood
                </h4>
                <div className="flex flex-wrap gap-3">
                  {['Happy', 'Sensitive', 'Sad', 'Anxious', 'Angry'].map(m => (
                    <Button
                      key={m}
                      variant={mood === m ? 'default' : 'outline'}
                      onClick={() => setMood(m)}
                      className={cn("rounded-full px-6", mood === m && "bg-orange-200 text-orange-950 hover:bg-orange-300")}
                    >
                      {m}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-600" /> Symptoms
                </h4>
                <div className="flex flex-wrap gap-3">
                  {['Cramps', 'Headache', 'Bloating', 'Fatigue', 'Acne'].map(symptom => (
                    <Button
                      key={symptom}
                      variant={symptoms.includes(symptom) ? 'default' : 'outline'}
                      onClick={() => toggleSymptom(symptom)}
                      className={cn("rounded-full px-6", symptoms.includes(symptom) && "bg-emerald-600 text-white hover:bg-emerald-700")}
                    >
                      {symptom}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <Button
                  className="w-full sm:w-auto h-11 px-8 bg-pink-600 hover:bg-pink-700 text-white"
                  onClick={() => requireLogin(handleSaveLog)}
                >
                  Save Log
                </Button>
              </div>

              {/* Past Logs with Suggestion Icons */}
              {savedLogs.length > 0 && (
                <div className="pt-8 border-t mt-8">
                  <h4 className="text-lg font-bold mb-4">Past Logs</h4>
                  <div className="space-y-4">
                    {savedLogs.map((log, idx) => (
                      <div key={idx} className="p-4 bg-white/80 rounded-xl border border-pink-100 shadow-sm flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-semibold text-pink-600">{log.date}</p>
                          <p className="text-sm mt-1"><strong>Flow:</strong> {log.flow}</p>
                          {log.mood && <p className="text-sm"><strong>Mood:</strong> {log.mood}</p>}
                          {log.symptoms.length > 0 && <p className="text-sm"><strong>Symptoms:</strong> {log.symptoms.join(', ')}</p>}
                        </div>
                        {/* Suggestion Icon Button */}
                        <button
                          onClick={() => handleOpenSuggestion(log, idx)}
                          className="relative flex-shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-md hover:shadow-lg hover:scale-110 transition-all duration-200 group"
                          title="View health suggestion for this log"
                        >
                          <MessageCircleHeart className="h-5 w-5 text-white" />
                          {idx === 0 && hasNewSuggestion && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        </div>


        {/* How It Works Infographic (Mobile) */}
        <div className="w-full mt-6 block md:hidden">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-slate-800">How SAKHI Tracker Works</h3>
            <p className="text-sm text-slate-600 mt-1">Smart Technology. Personal Care. Better Health.</p>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-lg border border-pink-100 bg-white p-2 cursor-pointer group">
            <img
              src="/images/education/tracker_works.jpg"
              alt="How SAKHI Tracker Works"
              className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
