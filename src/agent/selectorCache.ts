import * as fs from 'fs';
import * as path from 'path';

interface CacheEntry {
  brokenSelector: string;
  intent: string;
  healedSelector: string;
  timestamp: string;
}

const CACHE_PATH = path.join('src', 'agent', 'selector-cache.json');

function loadCache(): CacheEntry[] {
  if (!fs.existsSync(CACHE_PATH)) return [];
  const raw = fs.readFileSync(CACHE_PATH, 'utf-8');
  return raw.trim() ? JSON.parse(raw) : [];
}

function saveCache(entries: CacheEntry[]) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(entries, null, 2));
}

export function getCachedFix(brokenSelector: string, intent: string): string | null {
  const cache = loadCache();
  const match = cache.find(
    (e) => e.brokenSelector === brokenSelector && e.intent === intent
  );
  return match ? match.healedSelector : null;
}

export function saveFix(brokenSelector: string, intent: string, healedSelector: string) {
  const cache = loadCache();
  cache.push({
    brokenSelector,
    intent,
    healedSelector,
    timestamp: new Date().toISOString(),
  });
  saveCache(cache);
}