import { askGemini } from './geminiClient';

async function main() {
  try {
    const response = await askGemini('Say "connection successful" and nothing else.');
    console.log('Gemini says:', response);
  } catch (error: any) {
    console.log('--- FULL ERROR DETAILS ---');
    console.log('Message:', error?.message);
    console.log('Full object:', JSON.stringify(error, null, 2));
  }
}

main();