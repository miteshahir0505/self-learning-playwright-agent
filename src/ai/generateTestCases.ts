import * as fs from 'fs';
import * as path from 'path';
import { askGeminiForJSON } from './geminiClient';

interface TestCase {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  type: 'Positive' | 'Negative' | 'Edge Case';
  steps: string[];
  expectedResult: string;
}

function buildPrompt(requirementText: string): string {
  return `
You are a Senior QA Engineer. Based on the following requirement, generate a comprehensive set of test cases.

Requirement:
"""
${requirementText}
"""

Return ONLY a JSON array (no markdown, no explanation) where each item has this exact shape:
{
  "id": "TC-001",
  "title": "short descriptive title",
  "priority": "High" | "Medium" | "Low",
  "type": "Positive" | "Negative" | "Edge Case",
  "steps": ["step 1", "step 2", "..."],
  "expectedResult": "what should happen"
}

Include positive cases, negative cases, and edge cases. Aim for 6-10 test cases total.
`.trim();
}

async function main() {
  const requirementFile = process.argv[2];
  if (!requirementFile) {
    console.error('Usage: npx tsx src/ai/generateTestCases.ts <requirement-file-name>');
    console.error('Example: npx tsx src/ai/generateTestCases.ts add-to-cart.md');
    process.exit(1);
  }

  const reqPath = path.join('requirements', requirementFile);
  if (!fs.existsSync(reqPath)) {
    console.error(`Requirement file not found: ${reqPath}`);
    process.exit(1);
  }

  const requirementText = fs.readFileSync(reqPath, 'utf-8');
  console.log(`Generating test cases from ${requirementFile}...`);

  const prompt = buildPrompt(requirementText);
  const testCases = await askGeminiForJSON<TestCase[]>(prompt);

  const outputName = requirementFile.replace(/\.md$/, '.json');
  const outputPath = path.join('generated', outputName);
  fs.writeFileSync(outputPath, JSON.stringify(testCases, null, 2));

  console.log(`Generated ${testCases.length} test cases.`);
  console.log(`Saved to ${outputPath}`);
}

main();