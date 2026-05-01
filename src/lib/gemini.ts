import type { GoogleGenAI } from '@google/genai';

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
let aiClientPromise: Promise<GoogleGenAI> | null = null;
export const isGeminiConfigured = Boolean(geminiApiKey);

export const getAiClient = async () => {
  if (!geminiApiKey) {
    throw new Error('Gemini AI is not configured. Set VITE_GEMINI_API_KEY before running the app.');
  }

  if (!aiClientPromise) {
    aiClientPromise = import('@google/genai').then(({ GoogleGenAI }) => new GoogleGenAI({ apiKey: geminiApiKey }));
  }

  return aiClientPromise;
};
