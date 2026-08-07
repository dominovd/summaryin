import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(
  await readFile(path.join(projectRoot, 'src/data/jobDescriptions.json'), 'utf8')
);

const errors = [];
const warnings = [];
const seen = new Map();
const vague =
  /\b(results-driven|dynamic|seasoned|passionate|highly skilled|proven track record|leverage[sd]?|detail-oriented|team player|hard-working|go-getter|synergy)\b/i;

const COUNTS = { powerVerbs: 6, howToUse: 3, faq: 5, titles: 4, relatedKeywords: 8, related: 4 };
const DUTY_COUNTS = { core: 8, entry: 5, senior: 5 };

for (const [slug, p] of Object.entries(data)) {
  const required = [
    'name', 'h1', 'metaDescription', 'shortAnswer', 'titles',
    'duties', 'powerVerbs', 'howToUse', 'faq', 'related', 'relatedKeywords',
  ];
  for (const field of required) {
    if (!p[field] || p[field].length === 0) errors.push(`${slug}: missing ${field}`);
  }

  if (p.h1 !== `${p.name} Job Description for Resume`) {
    errors.push(`${slug}: h1 must be "<name> Job Description for Resume", found "${p.h1}"`);
  }

  const metaLen = p.metaDescription.length;
  if (metaLen < 120 || metaLen > 160) warnings.push(`${slug}: metaDescription is ${metaLen} chars`);

  const shortWords = p.shortAnswer.split(/\s+/).length;
  if (shortWords < 40 || shortWords > 80) warnings.push(`${slug}: shortAnswer is ${shortWords} words`);

  for (const [key, expected] of Object.entries(DUTY_COUNTS)) {
    const found = p.duties[key]?.length ?? 0;
    if (found !== expected) errors.push(`${slug}: duties.${key} has ${found}, expected ${expected}`);
  }
  for (const [key, expected] of Object.entries(COUNTS)) {
    if (p[key].length !== expected) {
      errors.push(`${slug}: ${key} has ${p[key].length}, expected ${expected}`);
    }
  }

  const openingVerbs = new Map();
  for (const tier of ['core', 'entry', 'senior']) {
    for (const [index, duty] of (p.duties[tier] ?? []).entries()) {
      const location = `${slug}/${tier}/${index + 1}`;
      const key = duty.toLowerCase().replace(/\[[^\]]+\]/g, '[x]');
      if (seen.has(key)) errors.push(`${location}: duplicates ${seen.get(key)}`);
      seen.set(key, location);

      if (/[Ѐ-ӿ]|—|–/.test(duty)) {
        errors.push(`${location}: contains Cyrillic or a long dash`);
      }
      if (!duty.endsWith('.')) errors.push(`${location}: must end with a period`);
      if (vague.test(duty)) warnings.push(`${location}: vague resume-speak`);

      const words = duty.split(/\s+/).length;
      if (words < 10 || words > 24) warnings.push(`${location}: ${words} words`);

      const verb = duty.split(/\s+/)[0];
      openingVerbs.set(verb, (openingVerbs.get(verb) ?? 0) + 1);
    }
  }
  const repeated = [...openingVerbs].filter(([, n]) => n > 1).map(([v]) => v);
  if (repeated.length) warnings.push(`${slug}: repeated opening verbs ${repeated.join(', ')}`);

  const placeholders = ['core', 'entry', 'senior']
    .flatMap((t) => p.duties[t] ?? [])
    .filter((d) => d.includes('[')).length;
  if (placeholders < 9) warnings.push(`${slug}: only ${placeholders}/18 duties carry a placeholder`);

  for (const r of p.related) {
    if (!(r in data)) errors.push(`${slug}: related "${r}" is not in the dataset`);
  }
}

console.log(`Checked ${Object.keys(data).length} job descriptions.`);
if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const w of warnings) console.log(`  ! ${w}`);
}
if (errors.length) {
  console.log(`\n${errors.length} error(s):`);
  for (const e of errors) console.log(`  x ${e}`);
  process.exit(1);
}
console.log('No errors.');
