import { GoogleGenAI } from '@google/genai';

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
const aiClient = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

export const requireAiClient = () => {
  if (!aiClient) {
    throw new Error('Gemini AI is not configured. Set VITE_GEMINI_API_KEY before running the app.');
  }

  return aiClient;
};
