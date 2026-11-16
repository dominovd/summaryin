/**
 * Minimal OpenAI-compatible chat client. Works with the DeepSeek API and with
 * hosts that serve DeepSeek's open weights (OpenRouter, Together, Fireworks):
 * switch providers with AI_BASE_URL, AI_MODEL, AI_API_KEY only.
 */

const env = (k: string) => ((import.meta as any).env?.[k] as string | undefined) ?? process.env[k];

export const aiConfigured = () => Boolean(env('AI_API_KEY'));

export async function chatJson(system: string, user: string, opts: { maxTokens: number; temperature?: number }) {
  const base = (env('AI_BASE_URL') ?? 'https://api.deepseek.com').replace(/\/$/, '');
  const model = env('AI_MODEL') ?? 'deepseek-chat';
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), Number(env('AI_TIMEOUT_MS') ?? 20000));
  try {
    const res = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      signal: ctrl.signal,
      headers: { Authorization: `Bearer ${env('AI_API_KEY')}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        temperature: opts.temperature ?? 0.3,
        max_tokens: opts.maxTokens,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      }),
    });
    if (!res.ok) throw new Error(`ai-http-${res.status}`);
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = data.choices?.[0]?.message?.content ?? '';
    const json = content.slice(content.indexOf('{'), content.lastIndexOf('}') + 1);
    return JSON.parse(json || '{}');
  } finally {
    clearTimeout(timer);
  }
}
