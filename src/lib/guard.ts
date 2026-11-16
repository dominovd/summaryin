/**
 * Abuse guard for AI routes: Cloudflare Turnstile, per-visitor daily limits,
 * and a global daily cap. Counters live in Upstash Redis (REST), which is what
 * the Vercel marketplace "Upstash for Redis" / KV integration provides.
 */

const env = (k: string) => ((import.meta as any).env?.[k] as string | undefined) ?? process.env[k];

export const DAILY = {
  extract: Number(env('AI_EXTRACT_PER_DAY') ?? 10),
  write: Number(env('AI_WRITE_PER_DAY') ?? 5),
  global: Number(env('AI_GLOBAL_PER_DAY') ?? 1000),
};

const REDIS_URL = env('UPSTASH_REDIS_REST_URL') ?? env('KV_REST_API_URL');
const REDIS_TOKEN = env('UPSTASH_REDIS_REST_TOKEN') ?? env('KV_REST_API_TOKEN');
const IS_PROD = env('VERCEL_ENV') === 'production';

const memory = new Map<string, number>();

async function incr(key: string): Promise<number> {
  if (!REDIS_URL || !REDIS_TOKEN) {
    if (IS_PROD) throw new Error('limits-not-configured');
    const n = (memory.get(key) ?? 0) + 1;
    memory.set(key, n);
    return n;
  }
  const res = await fetch(`${REDIS_URL}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([['INCR', key], ['EXPIRE', key, '90000']]),
  });
  if (!res.ok) throw new Error('limits-unavailable');
  const data = (await res.json()) as { result: number }[];
  return Number(data[0]?.result ?? 0);
}

async function get(key: string): Promise<number> {
  if (!REDIS_URL || !REDIS_TOKEN) return memory.get(key) ?? 0;
  const res = await fetch(`${REDIS_URL}/get/${encodeURIComponent(key)}`, { headers: { Authorization: `Bearer ${REDIS_TOKEN}` } });
  if (!res.ok) return 0;
  return Number(((await res.json()) as { result: string | null }).result ?? 0);
}

async function visitorId(request: Request, clientAddress: string) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || clientAddress || 'unknown';
  const salt = env('AI_LIMIT_SALT') ?? 'summaryin';
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${salt}:${ip}`));
  return Array.from(new Uint8Array(buf).slice(0, 12), (b) => b.toString(16).padStart(2, '0')).join('');
}

const today = () => new Date().toISOString().slice(0, 10);

export async function remaining(request: Request, clientAddress: string, kind: 'extract' | 'write') {
  const id = await visitorId(request, clientAddress);
  return Math.max(0, DAILY[kind] - (await get(`ai:${kind}:${today()}:${id}`)));
}

/** Throws a user-facing message when the call is not allowed. Returns calls left today. */
export async function spend(request: Request, clientAddress: string, kind: 'extract' | 'write') {
  const id = await visitorId(request, clientAddress);
  const used = await incr(`ai:${kind}:${today()}:${id}`);
  if (used > DAILY[kind]) {
    throw new LimitError(kind === 'write' ? `You have used all ${DAILY.write} tailored summaries for today. The free generator still works without limits.` : 'Daily keyword limit reached. Try again tomorrow.');
  }
  const total = await incr(`ai:global:${today()}`);
  if (total > DAILY.global) throw new LimitError('The tailoring tool is busy today. Please use the free generator or try again tomorrow.');
  return DAILY[kind] - used;
}

export class LimitError extends Error {}

export async function verifyTurnstile(token: unknown, request: Request) {
  const secret = env('TURNSTILE_SECRET_KEY');
  if (!secret) {
    if (IS_PROD) throw new Error('turnstile-not-configured');
    return;
  }
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', String(token ?? ''));
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (ip) form.append('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
  const data = (await res.json()) as { success: boolean };
  if (!data.success) throw new LimitError('Human check failed. Reload the page and try again.');
}

/** In production the tool stays off until both counters and Turnstile are configured. */
export const guardReady = () => !IS_PROD || Boolean(REDIS_URL && REDIS_TOKEN && env('TURNSTILE_SECRET_KEY'));
