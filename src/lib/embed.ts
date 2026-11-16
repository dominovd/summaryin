/**
 * Chrome extension support for /tailor-resume-summary/ (side panel frames the page with ?embed=1).
 *
 * Extension -> page: { type: 'summaryin:posting', version: 1, text, source }
 * Page -> extension: { type: 'summaryin:ready' } only. The posting and the summary never go back.
 */

export const MAX_POSTING_CHARS = 6000;
const PROFILE_KEY = 'summaryin:tailor-profile:v1';
const HOSTNAME = /^(?=.{1,253}$)[a-z0-9-]+(\.[a-z0-9-]+)*$/i;

export const isEmbed = (): boolean => new URLSearchParams(location.search).get('embed') === '1';

let jobSite: string | undefined;

/**
 * Adds `surface` and `jobSite` (hostname of the job page) to props of the `tailor` and `copy` events.
 * Not `source`: the write event already uses it for ai/template.
 */
export function withSurface<T extends Record<string, string | number | boolean>>(props: T) {
  const out: Record<string, string | number | boolean> = { ...props, surface: isEmbed() ? 'extension' : 'site' };
  if (jobSite) out.jobSite = jobSite;
  return out;
}

function allowedOrigins(): string[] {
  return String(import.meta.env.PUBLIC_EXTENSION_IDS || '')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => /^[a-p]{32}$/.test(s))
    .map((id) => `chrome-extension://${id}`);
}

/** Calls `fill` with each posting (and the job site hostname) from an allowed extension. Nothing runs on its own. */
export function listenForPostings(fill: (text: string, jobSite?: string) => void) {
  const origins = allowedOrigins();
  if (window.parent === window || !origins.length) return;
  window.addEventListener('message', (e: MessageEvent) => {
    if (!origins.includes(e.origin) || e.source !== window.parent) return;
    const d = e.data;
    if (!d || d.type !== 'summaryin:posting' || d.version !== 1 || typeof d.text !== 'string') return;
    jobSite = typeof d.source === 'string' && HOSTNAME.test(d.source) ? d.source.toLowerCase() : undefined;
    fill(d.text.slice(0, MAX_POSTING_CHARS), jobSite);
  });
  // targetOrigin is each allowed extension, never '*'.
  for (const o of origins) window.parent.postMessage({ type: 'summaryin:ready' }, o);
}

/** In embed mode every link opens in a new tab instead of replacing the panel. */
export function linksToNewTab() {
  document.addEventListener('click', (e) => {
    const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
    if (!a || a.target === '_blank' || a.getAttribute('href')!.startsWith('#')) return;
    a.target = '_blank';
    a.rel = 'noopener';
  }, true);
}

export type Profile = { title?: string; level?: string; skills?: string; facts?: string };

export function loadProfile(): Profile {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}') || {};
  } catch {
    return {};
  }
}

export function saveProfile(p: Profile) {
  try {
    if ([p.title, p.skills, p.facts].some((v) => v && v.trim())) localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    else localStorage.removeItem(PROFILE_KEY);
  } catch { /* storage blocked: nothing is remembered */ }
}

export function clearProfile() {
  try { localStorage.removeItem(PROFILE_KEY); } catch { /* ignore */ }
}
