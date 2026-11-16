/**
 * One taxonomy for every role list on the site: homepage catalog, hub, generator,
 * bullet page. Page availability is computed from the content files, so a new
 * profession or job description shows up everywhere after one data edit.
 */
import professions from './professions.json';
import jobDescriptions from './jobDescriptions.json';
import { NO_EXPERIENCE_SLUGS } from './noExperience';
import { GENERATOR_FAMILIES, type GeneratorFamily } from './generatorFamilies';

export const ROLE_GROUPS: { name: string; slugs: string[] }[] = [
  { name: 'Healthcare', slugs: ['nursing', 'cna', 'phlebotomist', 'caregiver'] },
  { name: 'Childcare and education', slugs: ['nanny', 'teacher', 'substitute-teacher'] },
  { name: 'Office and business', slugs: ['administrative-assistant', 'accountant', 'hr-assistant', 'project-manager', 'receptionist', 'sales'] },
  { name: 'Retail and hospitality', slugs: ['customer-service', 'retail', 'store-manager', 'cashier', 'server', 'waitress', 'bartender', 'barista', 'housekeeping'] },
  { name: 'Logistics and public safety', slugs: ['warehouse', 'driver', 'security-guard', 'correctional-officer'] },
];

/** Words people type for a role. Matching picks the longest synonym found in the input. */
export const ROLE_SYNONYMS: Record<string, string[]> = {
  nursing: ['registered nurse', 'nurse', 'rn', 'lpn', 'nursing'],
  cna: ['cna', 'certified nursing assistant', 'nursing assistant', 'nurse aide', 'stna', 'patient care technician'],
  phlebotomist: ['phlebotomist', 'phlebotomy', 'phlebotomy tech', 'phlebotomy technician'],
  caregiver: ['caregiver', 'care giver', 'caretaker', 'home health aide', 'personal care aide', 'home care'],
  nanny: ['nanny', 'babysitter', 'au pair', 'childcare', 'child care'],
  teacher: ['teacher', 'educator', 'tutor', 'teaching'],
  'substitute-teacher': ['substitute teacher', 'substitute'],
  'administrative-assistant': ['administrative assistant', 'admin assistant', 'administrative', 'secretary', 'office assistant'],
  accountant: ['accountant', 'accounting', 'bookkeeper', 'cpa'],
  'hr-assistant': ['hr assistant', 'hr', 'human resources'],
  'project-manager': ['project manager', 'pm', 'project management', 'program manager'],
  receptionist: ['receptionist', 'front desk'],
  sales: ['sales', 'sales representative', 'sales rep', 'account executive', 'salesperson', 'salesman', 'sdr', 'bdr'],
  'customer-service': ['customer service', 'customer service representative', 'customer support', 'call center', 'support specialist', 'csr'],
  retail: ['retail', 'sales associate', 'store associate', 'retail associate'],
  'store-manager': ['store manager', 'assistant manager', 'retail manager', 'shift manager'],
  cashier: ['cashier', 'checkout'],
  server: ['server', 'waiter'],
  waitress: ['waitress'],
  bartender: ['bartender', 'barback', 'mixologist'],
  barista: ['barista', 'coffee'],
  housekeeping: ['housekeeping', 'housekeeper', 'house cleaner', 'cleaner', 'room attendant', 'janitor'],
  warehouse: ['warehouse', 'picker', 'packer', 'forklift', 'warehouse associate'],
  driver: ['driver', 'delivery', 'truck', 'cdl', 'courier'],
  'security-guard': ['security guard', 'security', 'guard', 'security officer'],
  'correctional-officer': ['correctional officer', 'correctional', 'corrections', 'detention officer', 'jailer'],
};

const EXTRA_FAMILIES: Record<string, GeneratorFamily> = {
  cna: 'healthcare',
  phlebotomist: 'healthcare',
  caregiver: 'healthcare',
  nanny: 'education',
  'substitute-teacher': 'education',
  cashier: 'hospitality',
  barista: 'hospitality',
  housekeeping: 'hospitality',
};

/** Skills for roles that only have a job-description page. */
const EXTRA_SKILLS: Record<string, string[]> = {
  cna: ['Vital signs', 'ADL assistance', 'Patient transfers', 'Infection control', 'EHR charting', 'Intake and output records'],
  phlebotomist: ['Venipuncture', 'Capillary puncture', 'Specimen labeling', 'Order of draw', 'LIS data entry', 'Patient identification'],
  caregiver: ['Personal care', 'Medication reminders', 'Dementia care', 'Meal preparation', 'Safe transfers', 'Companionship'],
  nanny: ['Infant care', 'Early learning activities', 'Meal preparation', 'School pickups', 'Sleep routines', 'CPR and first aid'],
  'substitute-teacher': ['Classroom management', 'Following lesson plans', 'Attendance records', 'Student support', 'Clear notes for teachers', 'Flexible scheduling'],
  cashier: ['POS systems', 'Cash handling', 'Returns and exchanges', 'Fast checkout', 'Customer service', 'Drawer balancing'],
  barista: ['Espresso drinks', 'POS and cash handling', 'Food safety', 'Fast service', 'Upselling', 'Opening and closing'],
  housekeeping: ['Room turnover', 'Deep cleaning', 'Laundry and linens', 'Chemical safety', 'Inventory of supplies', 'Guest requests'],
};

const AUDIENCE: Record<GeneratorFamily, string> = {
  healthcare: 'patients and families',
  hospitality: 'guests',
  'customer-office': 'customers and colleagues',
  business: 'clients and stakeholders',
  'operations-safety': 'teams and the public',
  education: 'students and families',
};
const AUDIENCE_BY_ROLE: Record<string, string> = {
  cna: 'residents and patients',
  phlebotomist: 'patients',
  caregiver: 'seniors and their families',
  nanny: 'children and parents',
  retail: 'shoppers',
  cashier: 'customers',
  'store-manager': 'customers and store teams',
  'customer-service': 'customers',
  sales: 'buyers',
  warehouse: 'the operations team',
  driver: 'customers on every route',
  'correctional-officer': 'staff and incarcerated people',
};

/** Credential named in an entry-level objective. Empty means a [placeholder] is shown. */
const CREDENTIAL: Record<string, string> = {
  nursing: 'an active RN license',
  cna: 'state CNA certification',
  phlebotomist: 'phlebotomy certification',
  caregiver: 'CPR and first aid certification',
  nanny: 'CPR and first aid certification',
  bartender: 'responsible alcohol service training',
  'security-guard': 'a state guard license',
};

export type RoleInfo = {
  slug: string;
  name: string;
  group: string;
  family: GeneratorFamily;
  /** Which pages exist: s = resume summary, d = job description, n = no experience. */
  pages: { s: boolean; d: boolean; n: boolean };
  synonyms: string[];
  skills: string[];
  audience: string;
  credential: string;
};

const P = professions as Record<string, { name: string; skills: string[] }>;
const J = jobDescriptions as Record<string, { name: string }>;
const N = NO_EXPERIENCE_SLUGS as readonly string[];

export const ROLES: RoleInfo[] = ROLE_GROUPS.flatMap((g) =>
  g.slugs.map((slug) => {
    const family = GENERATOR_FAMILIES[slug] ?? EXTRA_FAMILIES[slug] ?? 'business';
    return {
      slug,
      name: P[slug]?.name ?? J[slug]?.name ?? slug,
      group: g.name,
      family,
      pages: { s: slug in P, d: slug in J, n: N.includes(slug) },
      synonyms: ROLE_SYNONYMS[slug] ?? [slug.replace(/-/g, ' ')],
      skills: (P[slug]?.skills ?? EXTRA_SKILLS[slug] ?? []).slice(0, 8),
      audience: AUDIENCE_BY_ROLE[slug] ?? AUDIENCE[family],
      credential: CREDENTIAL[slug] ?? '',
    };
  })
);

export const ROLE_BY_SLUG: Record<string, RoleInfo> = Object.fromEntries(ROLES.map((r) => [r.slug, r]));

export const pageHref = (slug: string, kind: 's' | 'd' | 'n') =>
  kind === 's' ? `/resume-summary/${slug}/` : kind === 'd' ? `/job-description/${slug}/` : `/no-experience/${slug}/`;

/** Same matcher on the server and in the browser (it is inlined into client scripts). */
export function matchRole(input: string, roles: Pick<RoleInfo, 'slug' | 'name' | 'synonyms'>[] = ROLES): string | null {
  const q = input.toLowerCase().trim();
  if (!q) return null;
  let best: string | null = null;
  let score = 0;
  for (const r of roles) {
    for (const c of [r.name.toLowerCase(), ...r.synonyms]) {
      const s = q === c ? 100 + c.length : c.length >= 3 && q.includes(c) ? c.length : 0;
      if (s > score) { score = s; best = r.slug; }
    }
  }
  return best;
}
