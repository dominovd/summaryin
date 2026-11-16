/**
 * Site-wide config. Everything an operator tweaks lives here.
 */
export const SITE = {
  name: 'SummaryIn',
  domain: 'summaryin.com',
  url: 'https://summaryin.com',
  tagline: 'Clear, practical resume summaries for every career path.',
  /** Copyright year in the footer. */
  year: new Date().getFullYear(),

  /** Title year changes only after the content library has been reviewed. */
  contentYear: 2026,
  contentLastReviewed: 'November 16, 2026',
  contentLastReviewedIso: '2026-11-16',

  /** Contact email shown on /contact/. */
  contactEmail: 'info@summaryin.com',

  /** Keep this on the homepage until there is enough traffic to test a partner offer. */
  resumeBuilderUrl: '/#generator',

  /**
   * Email capture endpoint (Formspree / Buttondown / ConvertKit form action).
   * Until it is set, the form shows but posts nowhere harmful.
   */
  emailFormAction: '',

  /** Lead magnet name shown in the email-capture block. */
  leadMagnet: '50 ready-to-use resume summaries for your profession (PDF)',
};

/** Hub navigation. `live: false` hubs render as plain text until built. */
export const NAV = [
  { label: 'Resume Summaries', href: '/resume-summary/', live: true },
  { label: 'Job Descriptions', href: '/job-description/', live: true },
  { label: 'Bullet Points', href: '/resume-bullet-points/', live: true },
  { label: 'No Experience', href: '/no-experience/', live: true },
  { label: 'Tailor to a Job', href: '/tailor-resume-summary/', live: true },
];

/** Header menu. Each group opens as a dropdown on desktop and a section in the mobile menu. */
export const NAV_GROUPS: { label: string; items: { label: string; href: string; note: string }[] }[] = [
  {
    label: 'Examples',
    items: [
      { label: 'Resume summaries', href: '/resume-summary/', note: 'Entry, mid, and senior examples by profession' },
      { label: 'Job descriptions', href: '/job-description/', note: 'Duty bullets for the experience section' },
      { label: 'No experience', href: '/no-experience/', note: 'First-job summaries from school or side work' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { label: 'Summary generator', href: '/#generator', note: 'Summary, objective, or LinkedIn headline' },
      { label: 'Tailor to a job', href: '/tailor-resume-summary/', note: 'Match your summary to a job posting' },
      { label: 'Bullet point builder', href: '/resume-bullet-points/', note: 'Write and format experience bullets' },
      { label: 'LinkedIn headline', href: '/linkedin-headline-generator/', note: 'Headline and About section examples' },
    ],
  },
  {
    label: 'About',
    items: [
      { label: 'About us', href: '/about/', note: 'Who writes and reviews the examples' },
      { label: 'Editorial policy', href: '/editorial-policy/', note: 'How content is checked and updated' },
      { label: 'Contact', href: '/contact/', note: 'Questions, corrections, and feedback' },
    ],
  },
];
