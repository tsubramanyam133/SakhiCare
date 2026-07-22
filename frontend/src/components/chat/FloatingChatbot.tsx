'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Sparkles, Send, Mic, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

type Message = { id: string; role: 'user' | 'assistant'; content: string };

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: "Hello! I am SAKHI AI. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);


  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Require login
    const userStr = localStorage.getItem('sakhi_user');
    if (!userStr) {
      alert("Please login to continue chatting with SAKHI AI.");
      return;
    }

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Mocking AI response for Hackathon Demo
      await new Promise(resolve => setTimeout(resolve, 1500));

      const responses = [
        "That's a great question! Based on common health guidelines, you should stay hydrated and get plenty of rest.",
        "It's completely normal to experience that. Listen to your body and take it easy.",
        "Please consult a certified gynecologist if the pain persists for more than 48 hours.",
        "Yes, tracking your cycle can help predict these mood changes. Anything else I can help with?"
      ];

      let aiContent = responses[Math.floor(Math.random() * responses.length)];
      const lowerInput = input.toLowerCase();

      if (lowerInput.includes('joke') || lowerInput.includes('joake')) {
        if (lowerInput.includes('telugu') || lowerInput.includes('telgu')) {
          const teluguJokes = [
            "టీచర్: నేను అడిగిన ప్రశ్నకు సమాధానం ఇస్తే వంద రూపాయలు ఇస్తాను. రాము: అడగండి మాస్టారు. టీచర్: భూమి గుండ్రంగా ఎందుకుంది? రాము: బల్ల మీద పెడితే కిందపడిపోతుందని! 😄 (Here is a Telugu joke for you!)",
            "భార్య: ఏవండీ, మీ షర్ట్ కి చిల్లు పడింది, కుట్టమంటారా? భర్త: వద్దులే, అది లేటెస్ట్ ఫ్యాషన్. భార్య: మరి మీ జేబులో ఉన్న పది వేలు ఎలా పోయాయి? భర్త: ఆ చిల్లులో నుంచే! 🤣 (Here is a Telugu joke for you!)"
          ];
          aiContent = teluguJokes[Math.floor(Math.random() * teluguJokes.length)];
        } else if (lowerInput.includes('hindi')) {
          const hindiJokes = [
            "टीचर: एक तरफ पैसा, दूसरी तरफ अक्कल, क्या चुनोगे? छात्र: पैसा. टीचर: गलत, मैं अक्कल चुनती. छात्र: आप सही कह रही हैं, जिसके पास जिस चीज़ की कमी होती है वो वही चुनता है! 😄 (Here is a Hindi joke for you!)",
            "संता: डॉक्टर साहब, मेरे कान में फोन की घंटी बजती है! डॉक्टर: तो कान में उठा लिया करो! 🤣 (Here is a Hindi joke for you!)"
          ];
          aiContent = hindiJokes[Math.floor(Math.random() * hindiJokes.length)];
        } else if (lowerInput.includes('tamil')) {
          aiContent = "ஆசிரியை: உனக்கு தெரிந்த இரண்டு விலங்குகளின் பெயர்களைச் சொல். மாணவன்: ஒரு நாய், இன்னொரு நாய்! 🤣 (Here is a Tamil joke for you!)";
        } else if (lowerInput.includes('kannada')) {
          aiContent = "ಶಿಕ್ಷಕ: ನಿನಗೆ ಗೊತ್ತಿರುವ ಎರಡು ಪ್ರಾಣಿಗಳ ಹೆಸರು ಹೇಳು. ವಿದ್ಯಾರ್ಥಿ: ಒಂದು ನಾಯಿ, ಇನ್ನೊಂದು ನಾಯಿ! 😄 (Here is a Kannada joke for you!)";
        } else if (lowerInput.includes('malayalam')) {
          aiContent = "ടീച്ചർ: നിനക്കറിയാവുന്ന രണ്ട് മൃഗങ്ങളുടെ പേര് പറയുക. കുട്ടി: ഒരു പട്ടി, മറ്റൊരു പട്ടി! 😅 (Here is a Malayalam joke for you!)";
        } else if (lowerInput.includes('marathi')) {
          aiContent = "शिक्षक: तुला माहित असलेल्या दोन प्राण्यांची नावे सांग. विद्यार्थी: एक कुत्रा, दुसरा कुत्रा! 😄 (Here is a Marathi joke for you!)";
        } else if (lowerInput.includes('bengali')) {
          aiContent = "শিক্ষক: তোমার জানা দুটি প্রাণীর নাম বলো। ছাত্র: একটা কুকুর, আরেকটা কুকুর! 🤣 (Here is a Bengali joke for you!)";
        } else if (lowerInput.includes('gujarati')) {
          aiContent = "શિક્ષક: તમને ખબર હોય તેવા બે પ્રાણીઓના નામ આપો. વિદ્યાર્થી: એક કૂતરો, બીજો કૂતરો! 😅 (Here is a Gujarati joke for you!)";
        } else if (lowerInput.includes('punjabi')) {
          aiContent = "ਅਧਿਆਪਕ: ਦੋ ਜਾਨਵਰਾਂ ਦੇ ਨਾਮ ਦੱਸੋ ਜੋ ਤੁਸੀਂ ਜਾਣਦੇ ਹੋ। ਵਿਦਿਆਰਥੀ: ਇੱਕ ਕੁੱਤਾ, ਦੂਜਾ ਕੁੱਤਾ! 😄 (Here is a Punjabi joke for you!)";
        } else if (lowerInput.includes('urdu')) {
          aiContent = "استاد: دو جانوروں کے نام بتائیں جنہیں آپ جانتے ہیں۔ طالب علم: ایک کتا، دوسرا کتا! 🤣 (Here is an Urdu joke for you!)";
        } else {
          const englishJokes = [
            "Why did the developer cross the road? To fix the bugs on the other side! 😄",
            "Why do programmers prefer dark mode? Because light attracts bugs! 🤣",
            "How many programmers does it take to change a light bulb? None, that's a hardware problem! 😅"
          ];
          aiContent = englishJokes[Math.floor(Math.random() * englishJokes.length)];
        }
      } else if (lowerInput.includes('hindi')) {
        aiContent = "नमस्ते! मैं सखी एआई हूँ। मैं आपकी कैसे मदद कर सकती हूँ?";
      } else if (lowerInput.includes('telugu') || lowerInput.includes('telgu')) {
        aiContent = "నమస్కారం! నేను సఖి AI ని. నేను మీకు ఎలా సహాయపడగలను?";
      } else if (lowerInput.includes('tamil')) {
        aiContent = "வணக்கம்! நான் சகி AI. நான் உங்களுக்கு எப்படி உதவ முடியும்?";
      } else if (lowerInput.includes('kannada')) {
        aiContent = "ನಮಸ್ಕಾರ! ನಾನು ಸಖಿ AI. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?";
      } else if (lowerInput.includes('malayalam')) {
        aiContent = "നമസ്കാരം! ഞാൻ സഖി AI ആണ്. എനിക്ക് നിങ്ങളെ എങ്ങനെ സഹായിക്കാനാകും?";
      } else if (lowerInput.includes('marathi')) {
        aiContent = "नमस्कार! मी सखी एआय आहे. मी तुम्हाला कशी मदत करू शकेन?";
      } else if (lowerInput.includes('bengali')) {
        aiContent = "নমস্কার! আমি সখী এআই। আমি আপনাকে কীভাবে সাহায্য করতে পারি?";
      } else if (lowerInput.includes('gujarati')) {
        aiContent = "નમસ્તે! હું સખી AI છું. હું તમને કેવી રીતે મદદ કરી શકું?";
      } else if (lowerInput.includes('punjabi')) {
        aiContent = "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਸਖੀ AI ਹਾਂ। ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?";
      } else if (lowerInput.includes('urdu')) {
        aiContent = "ہیلو! میں سخی اے آئی ہوں۔ میں آپ کی کیسے مدد کر سکتا ہوں؟";
      }

      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: aiContent }]);
    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: "Network error. Make sure you are connected." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Hide the floating chatbot if we are already on the full AI Chat page or Admin Portal
  if (pathname?.startsWith('/ai-chat') || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <Card className="relative w-[320px] sm:w-[380px] h-[500px] mb-4 flex flex-col shadow-2xl border-pink-100 overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Background Image */}
          <div
            className="absolute inset-0 z-0 opacity-75 bg-cover bg-center bg-no-repeat pointer-events-none"
            style={{ backgroundImage: "url('/images/hero_bg.png')" }}
          />
          <CardHeader className="relative z-10 bg-gradient-to-r from-pink-500 to-rose-400 text-white flex flex-row items-center justify-between shadow-sm px-4 py-3">
            <div className="flex items-center gap-2">
              <img src="/logo.jpg" alt="SAKHI AI" className="h-6 w-6 rounded-full object-cover border border-white/50 shadow-sm" />
              <CardTitle className="text-lg">SAKHI AI</CardTitle>
            </div>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="relative flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 sm:space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("relative z-10 flex gap-2 sm:gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden",
                  msg.role === 'user' ? "bg-slate-800 text-white" : "bg-white border border-pink-200"
                )}>
                  {msg.role === 'user' ? <UserIcon className="h-4 w-4" /> : <img src="/logo.jpg" alt="AI" className="w-full h-full object-cover" />}
                </div>
                <div className={cn(
                  "rounded-2xl px-3 py-2 sm:p-3 max-w-[80%] shadow-sm text-sm border",
                  msg.role === 'user' ? "bg-slate-800 text-white rounded-tr-sm border-transparent" : "bg-pink-100 text-pink-950 border-pink-200 rounded-tl-sm"
                )}>
                  {msg.content.replace(/\*\*/g, '').replace(/\*/g, '')}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="relative z-10 flex gap-2 sm:gap-3">
                <div className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 bg-white border border-pink-200 shadow-sm overflow-hidden">
                  <img src="/logo.jpg" alt="AI" className="w-full h-full object-cover animate-pulse" />
                </div>
                <div className="bg-pink-100 border border-pink-200 rounded-2xl p-3 flex gap-1 items-center max-w-[50%]">
                  <div className="w-2 h-2 rounded-full bg-pink-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-pink-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-pink-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>
          <CardFooter className="relative z-10 p-3 pt-2 bg-transparent border-t-0">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex w-full items-center bg-white/90 backdrop-blur-sm border border-pink-200 rounded-full shadow-lg p-1 transition-all focus-within:ring-4 focus-within:ring-pink-500/10 focus-within:border-pink-300">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask SAKHI AI..."
                className="flex-1 h-9 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-3 text-sm placeholder:text-slate-400"
              />
              <Button type="submit" size="icon" className="h-8 w-8 rounded-full flex-shrink-0 bg-gradient-to-tr from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-md transition-transform active:scale-95 disabled:opacity-50 disabled:shadow-none" disabled={isLoading || !input.trim()}>
                <Send className="h-3.5 w-3.5 ml-0.5" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}

      {/* Blinking Floating Action Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full shadow-2xl bg-gradient-to-br from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 border-2 border-white flex items-center justify-center group relative p-0"
        >
          {/* Pulsing rings for attention */}
          <div className="absolute inset-0 rounded-full border-2 border-pink-400 animate-ping opacity-75 duration-1000"></div>
          <div className="absolute inset-0 rounded-full border border-rose-300 animate-pulse opacity-50 duration-700"></div>

          <img src="/logo.jpg" alt="SAKHI AI" className="w-full h-full object-cover z-10 group-hover:scale-110 transition-transform drop-shadow-md rounded-full" />
        </Button>
      )}
    </div>
  );
}
