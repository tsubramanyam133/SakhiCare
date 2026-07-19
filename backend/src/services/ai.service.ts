import { AppError } from '../utils/AppError';
import { GoogleGenerativeAI } from '@google/generative-ai';

export class AIService {
  static async generateChatResponse(userId: string, message: string) {
    if (!process.env.GEMINI_API_KEY) {
      return {
        role: 'assistant',
        content: "I'm sorry, my AI connection is not configured yet. Please provide the Gemini API key in the backend environment variables."
      };
    }

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

      const prompt = `You are SAKHI AI, a helpful, empathetic, and knowledgeable assistant for a Women & Child Welfare Platform. 
      You provide guidance on menstrual tracking, maternal care, government schemes, and general women's health. 
      Keep answers concise and easy to understand.
      User message: ${message}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        role: 'assistant',
        content: text
      };
    } catch (e: any) {
      console.error("Gemini Error:", e);
      return {
        role: 'assistant',
        content: `Error from Gemini AI: ${e.message || "Unknown error"}. Please check your API key.`
      };
    }
  }
}
