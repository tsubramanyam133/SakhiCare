import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text');
  const lang = searchParams.get('lang');

  if (!text || !lang) {
    return NextResponse.json({ error: 'Missing text or lang' }, { status: 400 });
  }

  try {
    const googleUrl = `https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}`;
    
    // Server-side fetch to bypass CORS and browser restrictions
    const response = await fetch(googleUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Google TTS API rejected the request' }, { status: response.status });
    }

    const arrayBuffer = await response.arrayBuffer();
    
    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error("TTS Proxy Error:", error);
    return NextResponse.json({ error: 'Failed to fetch TTS' }, { status: 500 });
  }
}
