/**
 * Demo persistence layer.
 *
 * Implemented: localStorage so the demo works offline with no setup.
 * Optional integration (NOT configured): Supabase PostgreSQL — see the
 * Technology & Approach section. Do not describe Supabase as operational.
 */

const PREFIX = 'opportunitykit.v1.';

export function saveJSON(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage may be unavailable (private mode, quota). The demo still works
    // for the current session — persistence is best-effort by design.
  }
}

export function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function clearAll(): void {
  if (typeof window === 'undefined') return;
  const keys: string[] = [];
  for (let i = 0; i < window.localStorage.length; i += 1) {
    const k = window.localStorage.key(i);
    if (k && k.startsWith(PREFIX)) keys.push(k);
  }
  keys.forEach((k) => window.localStorage.removeItem(k));
}
