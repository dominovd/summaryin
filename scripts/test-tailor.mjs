// Offline check of /api/tailor: mocked model answers, real validator, limits and fallback.
import { build } from 'esbuild';
import { tmpdir } from 'node:os';
import path from 'node:path';

const out = path.join(tmpdir(), `tailor-${Date.now()}.mjs`);
await build({ entryPoints: ['src/pages/api/tailor.ts'], bundle: true, platform: 'node', format: 'esm', outfile: out, logLevel: 'warning' });
process.env.AI_API_KEY = 'test';
const queue = [];
globalThis.fetch = async () => new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify(queue.shift()) } }] }));
console.warn = () => {};
const { POST } = await import(out);
const call = async (body) => {
  const r = await POST({ request: new Request('http://x/api/tailor/', { method: 'POST', body: JSON.stringify(body), headers: { 'x-forwarded-for': '9.9.9.9' } }), clientAddress: '9.9.9.9' });
  return [r.status, await r.json()];
};
const fail = (m) => { console.error(`Tailor test failed: ${m}`); process.exit(1); };

const posting = 'We are hiring a Retail Sales Associate. You will operate the POS system, handle cash, process returns, and keep the sales floor stocked. Experience with Square POS and visual merchandising preferred. Must work weekends.';
queue.push({ keywords: [{ term: 'Square POS', type: 'tool' }, { term: 'inventory forecasting', type: 'skill' }] });
let [, r] = await call({ step: 'extract', posting });
if (r.keywords.length !== 1) fail('keyword not present in the posting was accepted');

const base = { step: 'write', title: 'Retail Sales Associate', level: 'mid', skills: 'cash handling, customer service', facts: '2 years at a sporting goods store, trained 4 new hires', confirmed: ['Square POS'] };
queue.push({ summary: 'Retail Sales Associate with 5 years at Target, certified in Square POS, who boosted sales by 30%. Skilled in cash handling and customer service, and trained 4 new hires on returns and store procedures for a busy team.' });
queue.push({ summary: 'Retail Sales Associate with 2 years in sporting goods retail, skilled in cash handling, customer service, and Square POS. Trained 4 new hires on returns and checkout, and raised add-on sales by [X]% during busy weekends. Brings steady, friendly service to every shopper.' });
[, r] = await call(base);
if (r.source !== 'ai' || /Target|30%|certified/.test(r.summary)) fail('invented facts passed the validator');

queue.push({ summary: 'Retail Sales Associate at Walmart.' }, { summary: 'Retail Sales Associate at Walmart.' });
[, r] = await call(base);
if (r.source !== 'template' || /Walmart/.test(r.summary)) fail('fallback did not replace an invalid answer');
console.log('Tailor test passed: keyword grounding, retry with feedback, template fallback.');
