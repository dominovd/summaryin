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
  contentLastReviewed: 'August 17, 2026',
  contentLastReviewedIso: '2026-08-17',

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
  { label: 'LinkedIn', href: '/linkedin/', live: false },
  { label: 'Executive Summary', href: '/executive/', live: false },
];
