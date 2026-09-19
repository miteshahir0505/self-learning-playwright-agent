import { Page } from '@playwright/test';
import { askGemini } from '../ai/geminiClient';
import { getCachedFix, saveFix } from './selectorCache';
import * as fs from 'fs';
import * as path from 'path';

function log(message: string) {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(path.join('logs', 'agent.log'), line);
  console.log(message);
}

function buildPrompt(html: string, intent: string, brokenSelector: string): string {
  return `
You are a browser automation expert. A Playwright selector has stopped working.

Broken selector: "${brokenSelector}"
Intent: "${intent}"

Here is the current page's HTML (relevant excerpt):
"""
${html}
"""

Return ONLY a valid CSS selector (a single string, no explanation, no markdown, no quotes)
that correctly matches the element described by the intent.
`.trim();
}

export async function getWorkingSelector(
  page: Page,
  brokenSelector: string,
  intent: string
): Promise<string> {
  // 1. Try the original selector first
  const originalCount = await page.locator(brokenSelector).count();
  if (originalCount > 0) {
    return brokenSelector; // still works, no healing needed
  }

  log(`Selector broken: "${brokenSelector}" (intent: ${intent})`);

  // 2. Check cache
  const cached = getCachedFix(brokenSelector, intent);
  if (cached) {
    const cachedCount = await page.locator(cached).count();
    if (cachedCount > 0) {
      log(`Used cached fix: "${cached}" (no AI call needed)`);
      return cached;
    }
    log(`Cached fix "${cached}" no longer works either, falling back to AI`);
  }

  // 3. Ask Gemini using current page HTML
  const html = await page.content();
  // Trim HTML to avoid huge prompts - keep it reasonable
  const trimmedHtml = html.slice(0, 8000);
  const prompt = buildPrompt(trimmedHtml, intent, brokenSelector);
  const suggested = (await askGemini(prompt)).trim();

  log(`AI suggested selector: "${suggested}"`);

  // 4. Verify it works
  const suggestedCount = await page.locator(suggested).count();
  if (suggestedCount === 0) {
    throw new Error(
      `AI-suggested selector "${suggested}" did not match any elements either.`
    );
  }

  // 5. Save to cache for next time
  saveFix(brokenSelector, intent, suggested);
  log(`Healed and cached: "${brokenSelector}" -> "${suggested}"`);

  return suggested;
}