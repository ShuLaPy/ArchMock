const WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const MAX_REQUESTS = 5;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

export function rateLimit(ip: string): {
  success: boolean;
  remaining: number;
} {
  const now = Date.now();

  // Clean stale entries
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
  }

  const entry = store.get(ip);

  if (!entry || entry.resetAt < now) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { success: true, remaining: MAX_REQUESTS - 1 };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { success: false, remaining: 0 };
  }

  entry.count++;
  return { success: true, remaining: MAX_REQUESTS - entry.count };
}
