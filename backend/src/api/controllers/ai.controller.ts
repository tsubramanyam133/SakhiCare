import { Request, Response, NextFunction } from 'express';
import { AIService } from '../../services/ai.service';
import { AppError } from '../../utils/AppError';

export class AIController {
  static async chat(req: Request, res: Response, next: NextFunction) {
    try {
      const { message } = req.body;
      const userId = (req as any).user?.id || 'demo-user-id';

      if (!message) {
        throw new AppError('Message is required', 400);
      }

      const response = await AIService.generateChatResponse(userId, message);
      
      res.status(200).json({
        success: true,
        data: response
      });
    } catch (error) {
      next(error);
    }
  }

  static async tts(req: Request, res: Response, next: NextFunction) {
    try {
      const text = req.query.text as string;
      const lang = (req.query.lang as string) || 'en';
      
      if (!text) {
        throw new AppError('Text is required for TTS', 400);
      }

      const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${encodeURIComponent(text)}`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Referer': 'https://translate.google.com/'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch TTS audio: ${response.status} ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length,
        'Accept-Ranges': 'bytes'
      });
      res.end(buffer);
    } catch (error) {
      next(error);
    }
  }
}
