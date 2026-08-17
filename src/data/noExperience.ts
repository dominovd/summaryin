import type { GeneratorFamily } from './generatorFamilies';

export const NO_EXPERIENCE_SLUGS = [
  'customer-service',
  'nursing',
  'administrative-assistant',
  'teacher',
  'retail',
  'receptionist',
  'server',
  'warehouse',
  'driver',
  'bartender',
  'waitress',
  'security-guard',
  'correctional-officer',
  'hr-assistant',
] as const;

export const NO_EXPERIENCE_GUIDANCE: Record<GeneratorFamily, {
  lead: string;
  evidence: string[];
  proof: string;
}> = {
  healthcare: {
    lead: 'Use clinical placements, skills labs, current credentials, and patient-facing work to show that your training has already been applied in a supervised setting.',
    evidence: ['Clinical rotations and unit types', 'License status and current certifications', 'Skills lab or simulation practice', 'Patient, resident, or family support experience'],
    proof: 'Name the unit, placement hours, patient group, or procedure count only when you can verify it.',
  },
  hospitality: {
    lead: 'Use customer-facing work, cash handling, food or alcohol training, and experience staying organized during a busy shift.',
    evidence: ['Customers or transactions handled per shift', 'POS, cash, or order-entry experience', 'Food-handler or responsible-service certification', 'Events, catering, barback, host, or volunteer service'],
    proof: 'A typical shift volume or training result is more useful than saying you are friendly or hard-working.',
  },
  'customer-office': {
    lead: 'Use scheduling, records, phone work, customer contact, office software, and any situation where other people depended on your follow-through.',
    evidence: ['Calls, appointments, files, or requests handled', 'Microsoft 365, Google Workspace, CRM, HRIS, or booking tools', 'Volunteer, campus, internship, or family-business administration', 'Accuracy, response time, or completion results'],
    proof: 'Choose one example that shows organization and one that shows how you communicated with people.',
  },
  business: {
    lead: 'Use coursework, projects, internships, part-time work, and responsibilities that show planning, analysis, ownership, or commercial awareness.',
    evidence: ['A project with a clear goal and deadline', 'Reports, budgets, forecasts, or presentations produced', 'Software used in a realistic assignment', 'A result such as accuracy, growth, savings, or on-time delivery'],
    proof: 'Explain what you owned and what changed instead of presenting a course title as work experience.',
  },
  'operations-safety': {
    lead: 'Use licenses, safety training, equipment practice, military or volunteer service, and reliable work in controlled or time-sensitive environments.',
    evidence: ['Current license, permit, endorsement, or certification', 'Equipment, vehicles, monitoring, or reporting systems used', 'Safety drills, inspections, or procedure-based training', 'Shift volume, route size, site size, or an accurate safety record'],
    proof: 'Keep authority, credentials, and safety claims exact. Do not imply a license or responsibility you did not hold.',
  },
  education: {
    lead: 'Use student teaching, tutoring, coaching, camps, classroom support, and projects where you planned learning or guided a group.',
    evidence: ['Grade level, subject, and placement setting', 'Lessons, learners, or tutoring sessions completed', 'Classroom technology and assessment methods', 'Feedback from a mentor or a measurable learning result'],
    proof: 'Describe the learners and the work you performed instead of relying on broad claims about passion.',
  },
};
