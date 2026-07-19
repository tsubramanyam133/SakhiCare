import { AppError } from '../utils/AppError';

export class AIService {
  /**
   * Mocked AI response generator
   */
  static async generateChatResponse(userId: string, message: string) {
    // In a real implementation, we would fetch User Profile for context
    // and call OpenAI API via SSE stream here.

    const keywords = message.toLowerCase();
    let response = "I am SAKHI AI. How can I help you today?";

    if (keywords.includes('period') || keywords.includes('cramp')) {
      response = "It sounds like you might be experiencing menstrual cramps. Drinking warm water, applying a heating pad, and gentle stretching can help. If the pain is severe, please consult a doctor.";
    } else if (keywords.includes('pregnant') || keywords.includes('baby')) {
      response = "Maternal wellness is crucial. Ensure you are taking your prescribed prenatal vitamins and attending regular checkups. Do you have any specific concerns today?";
    } else if (keywords.includes('diet') || keywords.includes('food')) {
      response = "A balanced diet rich in iron (like spinach and lentils) and vitamin C is highly recommended for women's health. Would you like a personalized weekly nutrition plan?";
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      role: 'assistant',
      content: response
    };
  }
}
