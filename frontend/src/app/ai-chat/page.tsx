'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, Send, MicOff, Sparkles, Volume2, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Message = { id: string; role: 'user' | 'assistant'; content: string };

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: "Hello! I am SAKHI AI. You can ask me anything about women's health, menstrual tracking, or maternal care. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = () => setIsRecording(false);
      recognitionRef.current.onend = () => setIsRecording(false);
    }
  }, []);

  const toggleRecording = () => {
    // Require login for chat
    const userStr = localStorage.getItem('sakhi_user');
    if (!userStr) {
      alert("Please login to continue chatting with SAKHI AI.");
      return;
    }

    if (!recognitionRef.current) {
      alert("Your browser doesn't support web voice recording. Please use the microphone icon on your mobile keyboard instead!");
      return;
    }


    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (e: any) {
        console.error("Mic error:", e);
        if (e.name === 'InvalidStateError') {
          // Already recording, just sync the state
          setIsRecording(true);
        } else {
          alert("Microphone access was denied or failed. Please check permissions or use your keyboard's mic.");
          setIsRecording(false);
        }
      }
    }
  };

  const speakText = (rawText: string) => {
    // Remove the English translation parentheses and emojis so the TTS doesn't read them
    let text = rawText.replace(/\(Here is a .*? joke for you!\)/g, '');
    // Strip common emojis
    text = text.replace(/[\u{1F300}-\u{1F9FF}]/gu, '');
    text = text.replace(/[\u{2700}-\u{27BF}]/gu, '');
    text = text.trim();

    let lang = 'en-US';
    let ttsLang = 'en';

    // 1. Extract language from the translation string before stripping
    if (rawText.includes('Telugu')) { lang = 'te-IN'; ttsLang = 'te'; }
    else if (rawText.includes('Hindi')) { lang = 'hi-IN'; ttsLang = 'hi'; }
    else if (rawText.includes('Tamil')) { lang = 'ta-IN'; ttsLang = 'ta'; }
    else if (rawText.includes('Kannada')) { lang = 'kn-IN'; ttsLang = 'kn'; }
    else if (rawText.includes('Malayalam')) { lang = 'ml-IN'; ttsLang = 'ml'; }
    else if (rawText.includes('Marathi')) { lang = 'mr-IN'; ttsLang = 'mr'; }
    else if (rawText.includes('Bengali')) { lang = 'bn-IN'; ttsLang = 'bn'; }
    else if (rawText.includes('Gujarati')) { lang = 'gu-IN'; ttsLang = 'gu'; }
    else if (rawText.includes('Punjabi')) { lang = 'pa-IN'; ttsLang = 'pa'; }
    else if (rawText.includes('Urdu')) { lang = 'ur-IN'; ttsLang = 'ur'; }

    // 2. Fallback to unicode detection for greetings
    if (lang === 'en-US') {
      if (/[\u0C00-\u0C7F]/.test(rawText)) { lang = 'te-IN'; ttsLang = 'te'; }
      else if (/[\u0900-\u097F]/.test(rawText)) { lang = 'hi-IN'; ttsLang = 'hi'; } // Hindi/Marathi
      else if (/[\u0B80-\u0BFF]/.test(rawText)) { lang = 'ta-IN'; ttsLang = 'ta'; }
      else if (/[\u0C80-\u0CFF]/.test(rawText)) { lang = 'kn-IN'; ttsLang = 'kn'; }
      else if (/[\u0D00-\u0D7F]/.test(rawText)) { lang = 'ml-IN'; ttsLang = 'ml'; }
      else if (/[\u0980-\u09FF]/.test(rawText)) { lang = 'bn-IN'; ttsLang = 'bn'; }
      else if (/[\u0A80-\u0AFF]/.test(rawText)) { lang = 'gu-IN'; ttsLang = 'gu'; }
      else if (/[\u0A00-\u0A7F]/.test(rawText)) { lang = 'pa-IN'; ttsLang = 'pa'; }
      else if (/[\u0600-\u06FF]/.test(rawText)) { lang = 'ur-IN'; ttsLang = 'ur'; }
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;

      const voices = window.speechSynthesis.getVoices();

      // 1. Try to find ANY voice for the specific language
      let selectedVoice = voices.find(v => v.lang.includes(lang.split('-')[0]));

      // 2. If NO native voice is found for regional languages,
      // fallback to our Next.js backend proxy which bypasses Google API blocks and CORS!
      if (!selectedVoice && lang !== 'en-US') {
        console.warn(`No native voice found for ${lang}. Using backend TTS proxy.`);
        try {
          const url = `/api/tts?text=${encodeURIComponent(text.substring(0, 200))}&lang=${ttsLang}`;
          const audio = new Audio(url);
          audio.play().catch(e => console.error("Proxy TTS playback failed:", e));
        } catch (e) {
          console.error("Proxy TTS setup failed", e);
        }
        return; // Exit here since we used the cloud fallback
      }

      // 3. Fallback to generic English female voice if language is English but no female found
      if (!selectedVoice) {
        selectedVoice = voices.find(v =>
          v.name.toLowerCase().includes('female') ||
          v.name.includes('Zira') ||
          v.name.includes('Samantha') ||
          v.name.includes('Google UK English Female')
        );
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.pitch = 1.1;
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Require login for chat
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
      // Mocking AI response for Hackathon Demo without needing backend
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

  return (
    <div className="relative h-full w-full flex flex-col animate-in fade-in duration-500">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 opacity-75 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: "url('/images/hero_bg.png')" }}
      />
      <div className="relative bg-white/80 backdrop-blur-md border-b flex flex-row items-center justify-between px-4 sm:px-6 py-3 shadow-sm z-10">
        <div className="flex items-center gap-3 text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-pink-200 shadow-sm bg-white flex items-center justify-center">
            <img src="icon.jpg" alt="SAKHI Logo" className="w-full h-full object-cover" />
          </div>
          SAKHI Voice AI
        </div>
        <span className="text-[10px] sm:text-xs font-bold bg-pink-100 text-pink-600 px-3 py-1 rounded-full border border-pink-200">Multilingual</span>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto w-full scrollbar-thin">
        <div className="max-w-4xl mx-auto p-3 pb-24 sm:p-4 sm:pb-32 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex items-end gap-2", msg.role === 'user' ? "justify-end pr-3" : "justify-start")}>
              {msg.role === 'assistant' && (
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center flex-shrink-0 border border-pink-200 overflow-hidden shadow-sm bg-white">
                  <img src="icon.jpg" alt="SAKHI Logo" className="w-full h-full object-cover" />
                </div>
              )}

              <div className={cn(
                "px-3 py-2 sm:px-4 sm:py-3 rounded-2xl max-w-[85%] sm:max-w-[75%] shadow-sm border",
                msg.role === 'user' ? "bg-gradient-to-tr from-pink-500 to-rose-400 text-white rounded-br-none border-transparent" : "bg-pink-100 border-pink-200 rounded-bl-none text-pink-950"
              )}>
                <p className="text-xs sm:text-sm leading-relaxed">{msg.content}</p>
                {msg.role === 'assistant' && (
                  <button onClick={() => speakText(msg.content)} className="mt-2.5 text-slate-400 hover:text-pink-500 transition-colors bg-pink-50 hover:bg-pink-100 p-1.5 rounded-full" title="Listen">
                    <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-tr from-slate-100 to-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-200">
                  <UserIcon className="h-5 w-5 sm:h-6 sm:w-6 text-slate-500" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-2 justify-start animate-pulse mb-2">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center flex-shrink-0 border border-pink-200 overflow-hidden shadow-sm">
                <img src="icon.jpg" alt="SAKHI Logo" className="w-full h-full object-cover" />
              </div>
              <div className="px-3 py-3 rounded-2xl bg-pink-100 border border-pink-200 rounded-bl-none flex items-center gap-1.5 shadow-sm">
                <div className="h-2 w-2 bg-pink-400 rounded-full animate-bounce" />
                <div className="h-2 w-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="h-2 w-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="relative z-10 w-full p-4 sm:p-6 pb-6 sm:pb-8">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center w-full bg-white/90 backdrop-blur-sm border border-pink-200 rounded-full shadow-lg p-1.5 sm:p-2 transition-all focus-within:ring-4 focus-within:ring-pink-500/10 focus-within:border-pink-300"
          >
            <Input
              placeholder="Ask SAKHI AI about your health..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isRecording}
              className="flex-1 h-10 sm:h-12 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-4 text-sm sm:text-base placeholder:text-slate-400"
            />
            <div className="flex items-center gap-1 sm:gap-2 pr-1">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className={cn("flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10 rounded-full transition-all text-slate-500 hover:text-pink-600 hover:bg-pink-50", isRecording && "text-red-500 animate-pulse bg-red-50")}
                onClick={toggleRecording}
              >
                {isRecording ? <MicOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Mic className="h-4 w-4 sm:h-5 sm:w-5" />}
              </Button>
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-md shadow-pink-500/20 hover:shadow-pink-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:shadow-none transition-all"
              >
                <Send className="h-4 w-4 sm:h-4 sm:w-4 ml-0.5" />
              </Button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
