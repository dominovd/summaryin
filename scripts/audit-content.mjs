import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(await readFile(path.join(projectRoot, 'src/data/professions.json'), 'utf8'));
const errors = [];
const warnings = [];
const seenExamples = new Map();
const vaguePhrases = /\b(results-driven|dynamic|seasoned|passionate|highly skilled|proven track record|leverage[sd]?|detail-oriented professional)\b/i;

for (const [slug, profession] of Object.entries(data)) {
  const required = ['name', 'h1', 'metaDescription', 'shortAnswer', 'skills', 'examples', 'powerWords', 'howToAdapt', 'faq', 'relatedKeywords'];
  for (const field of required) if (!profession[field] || profession[field].length === 0) errors.push(`${slug}: missing ${field}`);

  const counts = ['entry', 'mid', 'senior'].map((level) => profession.examples[level]?.length ?? 0);
  if (counts.join(',') !== '6,7,7') errors.push(`${slug}: expected 6/7/7 examples, found ${counts.join('/')}`);

  const openings = new Map();
  for (const level of ['entry', 'mid', 'senior']) {
    for (const [index, example] of profession.examples[level].entries()) {
      const text = example.paragraphs.join(' ').trim();
      const key = text.toLowerCase().replace(/\[[^\]]+\]/g, '[x]');
      const location = `${slug}/${level}/${index + 1}`;
      if (seenExamples.has(key)) errors.push(`${location}: duplicates ${seenExamples.get(key)}`);
      seenExamples.set(key, location);
      if (!example.label) errors.push(`${location}: missing human-readable label`);
      if (/[А-Яа-яЁё]|—|–/.test(text)) errors.push(`${location}: contains Cyrillic or a long dash`);
      if (vaguePhrases.test(text)) warnings.push(`${location}: review vague phrase in "${text.slice(0, 90)}..."`);
      const wordCount = text.split(/\s+/).length;
      if (wordCount < 16 || wordCount > 75) warnings.push(`${location}: ${wordCount} words`);
      const opening = text.toLowerCase().replace(/\[[^\]]+\]/g, '').split(/\s+/).slice(0, 3).join(' ');
      openings.set(opening, (openings.get(opening) ?? 0) + 1);
    }
  }
  for (const [opening, count] of openings) {
    if (count > 2) warnings.push(`${slug}: opening "${opening}" appears ${count} times`);
  }
}

if (warnings.length) {
  console.log('Content audit warnings:');
  warnings.forEach((warning) => console.log(`- ${warning}`));
}

if (errors.length) {
  console.error('Content audit failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Content audit passed for ${Object.keys(data).length} professions and ${seenExamples.size} examples.`);
}
