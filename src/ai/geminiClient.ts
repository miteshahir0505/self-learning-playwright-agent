import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    'GEMINI_API_KEY is missing. Add it to your .env file in the project root.'
  );
}

const ai = new GoogleGenAI({ apiKey });
const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

export async function askGemini(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });
    return response.text ?? '';
  } catch (error) {
    console.error('Gemini API call failed:', error);
    throw error;
  }
}

export async function askGeminiForJSON<T>(prompt: string): Promise<T> {
  const raw = await askGemini(prompt);
  const cleaned = raw.replace(/```json\s*|\s*```/g, '').trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch (error) {
    console.error('Failed to parse Gemini JSON response:', cleaned);
    throw new Error('Gemini did not return valid JSON');
  }
}