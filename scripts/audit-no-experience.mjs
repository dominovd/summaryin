import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = async (p) => JSON.parse(await readFile(path.join(root, p), 'utf8'));
const own = await read('src/data/noExperienceExamples.json');
const professions = await read('src/data/professions.json');
const errors = [];
const PATHS = ['school', 'job', 'side'];
const norm = (t) => t.toLowerCase().replace(/\s+/g, ' ').trim();

for (const [slug, list] of Object.entries(own)) {
  if (!professions[slug]) errors.push(`${slug}: no profession page with this slug`);
  if (list.length !== 6) errors.push(`${slug}: needs 6 examples, has ${list.length}`);
  const labels = new Set();
  const summaryTexts = new Set(Object.values(professions[slug]?.examples ?? {}).flat().map((e) => norm(e.paragraphs.join(' '))));
  for (const ex of list) {
    if (!PATHS.includes(ex.path)) errors.push(`${slug}: unknown path "${ex.path}"`);
    if (labels.has(ex.label)) errors.push(`${slug}: duplicate label "${ex.label}"`);
    labels.add(ex.label);
    if (summaryTexts.has(norm(ex.text))) errors.push(`${slug}: "${ex.label}" repeats a resume-summary example`);
    if (/[—–]/.test(ex.text + ex.label)) errors.push(`${slug}: "${ex.label}" has a long dash`);
    if (/[Ѐ-ӿ]/.test(ex.text + ex.label)) errors.push(`${slug}: "${ex.label}" has Cyrillic`);
    if (/\b\d+\s+years?\b/i.test(ex.text)) errors.push(`${slug}: "${ex.label}" states years of experience without a [placeholder]`);
    const words = ex.text.split(/\s+/).length;
    if (words < 20 || words > 60) errors.push(`${slug}: "${ex.label}" has ${words} words (20 to 60)`);
  }
  for (const p of PATHS) if (!list.some((e) => e.path === p)) errors.push(`${slug}: no example for path "${p}"`);
}

if (errors.length) {
  console.error('No-experience audit failed:');
  errors.forEach((e) => console.error(`- ${e}`));
  process.exit(1);
}
console.log(`No-experience audit passed for ${Object.keys(own).length} professions with their own examples.`);
