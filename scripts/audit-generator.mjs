import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFile(path.join(projectRoot, p), 'utf8');
const generator = await read('src/components/Generator.astro');
const bullets = await read('src/components/BulletBuilder.astro');
const roles = await read('src/data/roles.ts');
const errors = [];

// The generator must never invent tenure or results: numbers stay as [X] placeholders.
const closingBlock = generator.slice(generator.indexOf('closing: {'), generator.indexOf('pdf:'));
if (!closingBlock.includes('healthcare')) errors.push('Generator.astro: closing lines block not found');
if (/\b\d+\s+(years?|%|percent)\b/i.test(closingBlock)) errors.push('Generator.astro: closing lines contain an invented number');
for (const family of ['healthcare', 'hospitality', 'customer-office', 'business', 'operations-safety', 'education']) {
  const m = closingBlock.match(new RegExp(`'?${family}'?: \\[([^\\]]+)\\]`));
  if (!m || (m[1].match(/'/g) || []).length < 6) errors.push(`Generator.astro: ${family} needs three closing lines (professional, confident, friendly)`);
}
if (!generator.includes("M('[X]')")) errors.push('Generator.astro: tenure placeholder [X] is missing');
if (!/const lc = /.test(generator)) errors.push('Generator.astro no longer normalizes skill capitalization');
if (/results-driven|hard-working|team player/i.test(generator)) errors.push('Generator.astro: uses an empty adjective the guides tell readers to avoid');

// Bullet builder: no invented numbers in rewrites, placeholders instead.
if (!bullets.includes("M('[X]')")) errors.push('BulletBuilder.astro: number placeholder [X] is missing');

// Every role in the taxonomy needs synonyms; skills come from professions.json or EXTRA_SKILLS.
const groupSlugs = [...roles.matchAll(/slugs: \[([^\]]+)\]/g)].flatMap((m) => [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]));
for (const slug of groupSlugs) {
  if (!new RegExp(`'?${slug}'?: \\[`).test(roles.slice(roles.indexOf('ROLE_SYNONYMS'), roles.indexOf('EXTRA_FAMILIES')))) {
    errors.push(`roles.ts: ${slug} has no synonyms`);
  }
}

if (errors.length) {
  console.error('Generator audit failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Generator audit passed: 6 closing families, ${groupSlugs.length} roles with synonyms.`);
