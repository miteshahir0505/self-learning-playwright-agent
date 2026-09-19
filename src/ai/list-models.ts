import * as dotenv from 'dotenv';
import * as fs from 'fs';
dotenv.config();

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
  );
  const data = await response.json();

  const relevant = data.models
    .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
    .map((m: any) => m.name);

  fs.writeFileSync('logs/available-models.txt', relevant.join('\n'));
  console.log(`Found ${relevant.length} models. Written to logs/available-models.txt`);
}

listModels();