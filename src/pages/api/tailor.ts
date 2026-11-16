import type { APIRoute } from 'astro';
import { chatJson, aiConfigured } from '../../lib/llm';
import { spend, remaining, verifyTurnstile, LimitError, DAILY, guardReady } from '../../lib/guard';
import {
  readExtractInput, readWriteInput, validateKeywords, validateSummary, fallbackSummary,
  EXTRACT_SYSTEM, extractUser, WRITE_SYSTEM, writeUser,
} from '../../lib/tailor';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export const GET: APIRoute = async ({ request, clientAddress }) => {
  if (!aiConfigured() || !guardReady()) return json({ ready: false, left: 0, limit: DAILY.write });
  try {
    return json({ ready: true, left: await remaining(request, clientAddress, 'write'), limit: DAILY.write });
  } catch {
    return json({ ready: false, left: 0, limit: DAILY.write });
  }
};

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!aiConfigured() || !guardReady()) return json({ error: 'The tailoring tool is not switched on yet.' }, 503);
  if (Number(request.headers.get('content-length') ?? 0) > 20000) return json({ error: 'Request is too large.' }, 413);
  let body: any;
  try { body = await request.json(); } catch { return json({ error: 'Bad request.' }, 400); }

  try {
    if (body?.step === 'extract') {
      const input = readExtractInput(body);
      await verifyTurnstile(body.token, request);
      await spend(request, clientAddress, 'extract');
      const raw = await chatJson(EXTRACT_SYSTEM, extractUser(input.posting, input.title), { maxTokens: 400, temperature: 0 });
      const keywords = validateKeywords(raw, input.posting);
      return json({ keywords });
    }

    if (body?.step === 'write') {
      const input = readWriteInput(body);
      await verifyTurnstile(body.token, request);
      const left = await spend(request, clientAddress, 'write');
      let problems: string[] = [];
      for (let attempt = 0; attempt < 2; attempt++) {
        const raw = await chatJson(WRITE_SYSTEM, writeUser(input, problems), { maxTokens: 300, temperature: attempt ? 0.2 : 0.4 });
        const out = validateSummary(raw, input);
        if (!out.problems.length) return json({ summary: out.text, source: 'ai', left });
        problems = out.problems;
        console.warn('tailor: rejected draft', problems);
      }
      return json({ summary: fallbackSummary(input), source: 'template', left });
    }
    return json({ error: 'Unknown step.' }, 400);
  } catch (e) {
    if (e instanceof LimitError) return json({ error: e.message }, 429);
    const msg = e instanceof Error ? e.message : '';
    if (/Paste|Add/.test(msg)) return json({ error: msg }, 400);
    console.error('tailor:', msg);
    return json({ error: 'Something went wrong. Please try again in a minute.' }, 502);
  }
};
