import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const templates = JSON.parse(await readFile(path.join(projectRoot, 'src/data/generatorTemplates.json'), 'utf8'));
const component = await readFile(path.join(projectRoot, 'src/components/Generator.astro'), 'utf8');
const errors = [];
const serialized = JSON.stringify(templates);

if (/\{years\}|\b\d+\s+years?\b/i.test(serialized)) {
  errors.push('generator templates contain an invented numeric tenure');
}

for (const [family, levels] of Object.entries(templates.families ?? {})) {
  for (const level of ['entry', 'mid', 'senior']) {
    if (!Array.isArray(levels[level]) || levels[level].length < 3) {
      errors.push(`${family}.${level} needs at least three profession-family openings`);
    }
  }
}

for (const level of ['entry', 'mid', 'senior']) {
  if (!Array.isArray(templates.impact?.[level]) || templates.impact[level].length < 4) {
    errors.push(`impact.${level} needs four variants`);
  }
  for (const tone of ['professional', 'confident', 'friendly']) {
    if (!Array.isArray(templates.toneLines?.[level]?.[tone]) || templates.toneLines[level][tone].length < 2) {
      errors.push(`toneLines.${level}.${tone} needs two variants`);
    }
  }
}

if (!component.includes('phraseCase')) {
  errors.push('Generator.astro no longer normalizes skill capitalization');
}

if (errors.length) {
  console.error('Generator audit failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Generator audit passed for ${Object.keys(templates.families).length} profession families.`);
