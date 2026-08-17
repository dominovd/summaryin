import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packPath = path.resolve(projectRoot, '..', 'content-packs-batch1.md');
const dataPath = path.join(projectRoot, 'src', 'data', 'professions.json');

const pack = await readFile(packPath, 'utf8');
const existing = JSON.parse(await readFile(dataPath, 'utf8'));

const professionInfo = {
  nursing: { name: 'Nursing', roleDefault: 'Registered Nurse' },
  sales: { name: 'Sales', roleDefault: 'Sales Representative' },
  'administrative-assistant': { name: 'Administrative Assistant', roleDefault: 'Administrative Assistant' },
  teacher: { name: 'Teacher', roleDefault: 'Teacher' },
  accountant: { name: 'Accountant', roleDefault: 'Accountant' },
  retail: { name: 'Retail', roleDefault: 'Retail Sales Associate' },
  receptionist: { name: 'Receptionist', roleDefault: 'Receptionist' },
  server: { name: 'Server', roleDefault: 'Restaurant Server' },
  warehouse: { name: 'Warehouse', roleDefault: 'Warehouse Associate' },
  driver: { name: 'Driver', roleDefault: 'Delivery Driver' },
};

const howToAdapt = {
  nursing: [
    { step: 'Match the unit', text: 'Name the exact unit from the posting, such as med-surg, step-down, PCU, ICU, or labor and delivery.' },
    { step: 'Use the same clinical systems', text: 'Mention Epic, Cerner, Meditech, or another EMR only if you have used it.' },
    { step: 'Show your patient load', text: 'Include the nurse-to-patient ratio or caseload you handled safely in a comparable setting.' },
    { step: 'Move required certifications up', text: 'Put ACLS, PALS, CCRN, TNCC, or another required certification in the summary instead of hiding it near the end.' },
  ],
  sales: [
    { step: 'Match the sales motion', text: 'Make it clear whether you win new logos, grow existing accounts, or do both.' },
    { step: 'Use comparable deal numbers', text: 'Choose quota, deal size, and sales-cycle numbers that match the scale of the role.' },
    { step: 'Name the buyer and industry', text: 'Say whether you sell to healthcare, fintech, manufacturing, consumers, or another specific market.' },
    { step: 'Use the CRM from the posting', text: 'Mention Salesforce, HubSpot, or another system when it appears in the job description and you know it.' },
  ],
  'administrative-assistant': [
    { step: 'Show who you support', text: 'Name the number and seniority of the people you support, from a small department to a C-suite team.' },
    { step: 'Make the workload visible', text: 'Use calendar volume, monthly expenses, travel bookings, records, or vendor counts to show the scope.' },
    { step: 'Match the setting', text: 'Use the right language for a legal, medical, education, nonprofit, or corporate office.' },
    { step: 'Name the tools you actually use', text: 'Include Microsoft 365, Google Workspace, scheduling systems, or document platforms from the posting.' },
  ],
  teacher: [
    { step: 'Match the grade and subject', text: 'Lead with the same grade band, subject, or student population named in the posting.' },
    { step: 'Use student outcome numbers', text: 'Choose growth, proficiency, attendance, or completion results that you can explain in an interview.' },
    { step: 'Name the relevant framework', text: 'Mention IEPs, differentiated instruction, curriculum standards, or classroom technology when the role asks for it.' },
    { step: 'Bring required credentials forward', text: 'Include your license, endorsement, ESL credential, or special education certification early.' },
  ],
  accountant: [
    { step: 'Match the accounting environment', text: 'Use language that fits public accounting, industry accounting, nonprofit work, or government work.' },
    { step: 'Show volume and complexity', text: 'Use entities, accounts, invoices, reconciliations, close timelines, or revenue size to show scope.' },
    { step: 'Name the systems', text: 'Include QuickBooks, NetSuite, SAP, Oracle, or advanced Excel only when you have real experience with them.' },
    { step: 'Lead with the credential they request', text: 'Place CPA, CMA, or another requested credential in the first sentence.' },
  ],
  retail: [
    { step: 'Match the retail setting', text: 'Name a comparable environment such as apparel, grocery, electronics, luxury, or big-box retail.' },
    { step: 'Show store volume', text: 'Use annual sales, daily customers, transactions per shift, or units processed to show the pace.' },
    { step: 'Use the right performance metric', text: 'Choose sales per hour, attachment rate, conversion, shrink, or drawer accuracy based on the role.' },
    { step: 'Mention useful availability', text: 'If you can work weekends, holidays, or open shifts, say so when availability is a major hiring filter.' },
  ],
  receptionist: [
    { step: 'Name the front-desk setting', text: 'Make it clear whether your experience is in a medical, dental, legal, hospitality, or corporate office.' },
    { step: 'Show daily volume', text: 'Include calls, visitors, appointments, providers, or records handled each day or week.' },
    { step: 'Match the software', text: 'Mention the scheduling, practice management, or record system from the posting when you know it.' },
    { step: 'Prove accuracy under pressure', text: 'Use a scheduling, payment, data-entry, or documentation result instead of simply calling yourself organized.' },
  ],
  server: [
    { step: 'Match the service style', text: 'Use language that fits fine dining, casual dining, banquets, hotels, bars, or high-volume restaurants.' },
    { step: 'Show your pace', text: 'Include covers per shift, table section size, nightly sales, or average check when you know the number.' },
    { step: 'Name relevant systems and credentials', text: 'Mention the POS platform and required food safety or alcohol service certification.' },
    { step: 'Use guest and sales results', text: 'Choose upselling, repeat guests, review scores, or error-free service as proof.' },
  ],
  warehouse: [
    { step: 'Match the warehouse function', text: 'Lead with picking, packing, shipping, receiving, inventory, or forklift work based on the posting.' },
    { step: 'Show volume and accuracy', text: 'Use orders per hour, units per shift, inventory accuracy, or error rate to show performance.' },
    { step: 'Name equipment and systems', text: 'Include forklifts, pallet jacks, RF scanners, or a warehouse management system you have used.' },
    { step: 'Bring safety forward', text: 'Mention a clean safety record, certification, or improvement when the job involves equipment or heavy loads.' },
  ],
  driver: [
    { step: 'Match the driving role', text: 'Use the right language for delivery, CDL, route, rideshare, courier, or passenger transportation work.' },
    { step: 'Show route scale', text: 'Include daily stops, miles, service area, load size, or on-time delivery rate.' },
    { step: 'Name the required license', text: 'Put CDL class, endorsements, DOT status, or a clean motor vehicle record near the beginning.' },
    { step: 'Use safety and service proof', text: 'Choose preventable-accident history, inspection results, customer ratings, or delivery accuracy.' },
  ],
};

const relatedMap = {
  nursing: ['customer-service', 'administrative-assistant', 'receptionist'],
  sales: ['retail', 'customer-service', 'receptionist', 'project-manager'],
  'administrative-assistant': ['receptionist', 'customer-service', 'project-manager', 'accountant'],
  teacher: ['administrative-assistant', 'customer-service', 'project-manager'],
  accountant: ['administrative-assistant', 'project-manager', 'sales'],
  retail: ['customer-service', 'sales', 'warehouse'],
  receptionist: ['administrative-assistant', 'customer-service', 'nursing'],
  server: ['customer-service', 'sales', 'retail'],
  warehouse: ['retail', 'driver', 'customer-service'],
  driver: ['warehouse', 'customer-service', 'sales'],
};

const pageCopy = {
  nursing: {
    h1: 'Nursing Resume Summary Examples',
    metaDescription: 'Browse 20 nursing resume summary examples for new graduates, experienced RNs, charge nurses, and nurse leaders. Create your own with the free generator.',
    shortAnswer: 'A nursing resume summary should name your license, specialty, and care setting, then show one result. Use a patient load, safety record, satisfaction score, or unit improvement. Keep it to two to four lines so a recruiter can see the match quickly.',
  },
  sales: {
    h1: 'Sales Resume Summary Examples',
    metaDescription: 'Browse 20 sales resume summary examples for entry-level candidates, account executives, sales managers, and senior leaders. Includes a free generator.',
    shortAnswer: 'A sales summary needs three things: what you sell, who buys it, and the number you hit. Lead with quota attainment, revenue, pipeline, or deal size. Without a number, the summary reads like a job description.',
  },
  'administrative-assistant': {
    h1: 'Administrative Assistant Resume Summary Examples',
    metaDescription: 'Browse 20 administrative assistant resume summary examples for entry-level, experienced, executive assistant, and office manager roles.',
    shortAnswer: 'Show the scope of the office work you keep moving. Name who you support, the calendars or travel you manage, and one useful number such as monthly expenses, meetings, vendors, or records.',
  },
  teacher: {
    h1: 'Teacher Resume Summary Examples',
    metaDescription: 'Browse 20 teacher resume summary examples for new teachers, elementary and secondary educators, special education, and school leaders.',
    shortAnswer: 'Name the grade, subject, or student group you teach, then add one outcome. Student growth, proficiency, attendance, IEP progress, or course completion makes the summary more useful than a list of teaching adjectives.',
  },
  accountant: {
    h1: 'Accountant Resume Summary Examples',
    metaDescription: 'Browse 20 accountant resume summary examples for entry-level, staff, senior, CPA, accounting manager, and controller roles.',
    shortAnswer: 'Lead with your credential or accounting level, the size of the books you handle, and one process you own. Close time, invoice volume, entities, revenue, or audit results give employers a clear sense of scale.',
  },
  retail: {
    h1: 'Retail Resume Summary Examples',
    metaDescription: 'Browse 20 retail resume summary examples for sales associates, cashiers, key holders, supervisors, and store managers. Try the free generator.',
    shortAnswer: 'Start with your role and type of store, then add one number that shows pace or performance. Sales per hour, attachment rate, conversion, transaction volume, drawer accuracy, or shrink all work.',
  },
  receptionist: {
    h1: 'Receptionist Resume Summary Examples',
    metaDescription: 'Browse 20 receptionist resume summary examples for entry-level, medical, dental, legal, front desk, and supervisor roles.',
    shortAnswer: 'Name the setting, the number of calls, visitors, or appointments you handle, and the systems you use. Front-desk work is about staying accurate while being interrupted, so show volume instead of simply saying you are friendly.',
  },
  server: {
    h1: 'Server Resume Summary Examples',
    metaDescription: 'Browse 20 server resume summary examples for first jobs, casual dining, fine dining, bartending, banquets, and restaurant leadership.',
    shortAnswer: 'Name the type of service, the volume you handle, and one result. Covers per shift, table section size, average check, upselling, or guest ratings show more than saying you work well under pressure.',
  },
  warehouse: {
    h1: 'Warehouse Resume Summary Examples',
    metaDescription: 'Browse 20 warehouse resume summary examples for entry-level workers, picker packers, forklift operators, leads, and supervisors.',
    shortAnswer: 'Lead with the work you do, such as picking, packing, receiving, inventory, or forklift operation. Add units per hour, accuracy, safety, or attendance so the employer can see your pace and reliability.',
  },
  driver: {
    h1: 'Driver Resume Summary Examples',
    metaDescription: 'Browse 20 driver resume summary examples for delivery, CDL, local, regional, route, passenger, and fleet leadership roles.',
    shortAnswer: 'Put your license class, route type, and safety record in the first lines. Daily stops, on-time rate, accident-free miles, inspections, or a clean MVR tell the employer what kind of route you can handle.',
  },
};

const powerWordUsage = {
  nursing: [
    'Assessed a six-patient assignment and documented changes in condition in Epic.',
    'Titrated critical-care medications according to protocol and patient response.',
    'Precepted eight new graduate nurses through their first independent shifts.',
    'Escalated early signs of deterioration before a rapid response was needed.',
    'Coordinated discharge teaching, medication review, and follow-up care.',
    'Reduced 30-day readmissions through structured post-discharge calls.',
    'Maintained full compliance with infection-control and medication-safety procedures.',
  ],
  sales: [
    'Closed $1.2M in annual recurring revenue at 112% of quota.',
    'Exceeded quota for seven consecutive quarters.',
    'Sourced 40% of new pipeline through targeted outbound work.',
    'Expanded existing accounts by identifying new teams and use cases.',
    'Negotiated multi-year contracts without giving up margin.',
    'Displaced an incumbent competitor in a $400K hospital account.',
    'Forecasted monthly revenue within 5% of the final result.',
  ],
  'administrative-assistant': [
    'Coordinated travel across five time zones for four executives.',
    'Owned calendars, expenses, and meeting preparation for three directors.',
    'Streamlined onboarding paperwork and cut turnaround from five days to two.',
    'Reconciled 80 monthly expense reports with accurate supporting records.',
    'Triaged more than 200 weekly requests for a busy executive office.',
    'Negotiated vendor terms that reduced annual supply spending by 18%.',
    'Standardized scheduling and document workflows across six assistants.',
  ],
  teacher: [
    'Raised reading proficiency from 58% to 76% in one school year.',
    'Differentiated lessons for mixed reading levels and IEP goals.',
    'Mentored four first-year teachers through planning and classroom management.',
    'Aligned units and assessments to state curriculum standards.',
    'Moved 82% of students at least one full level in reading.',
    'Facilitated family conferences with clear next steps and follow-up.',
    'Piloted a math intervention later adopted across the grade level.',
  ],
  accountant: [
    'Reconciled 35 balance-sheet accounts each month with no aged exceptions.',
    'Closed the monthly books in five days instead of eight.',
    'Consolidated reporting for seven legal entities into one package.',
    'Reduced audit adjustments by improving supporting schedules and review.',
    'Implemented NetSuite for a finance team supporting $40M in revenue.',
    'Captured $90K in early-payment discounts through a new AP schedule.',
    'Explained material variances to department leaders in plain language.',
  ],
  retail: [
    'Converted 24% of store visitors into buyers during the holiday season.',
    'Raised warranty and accessory attachment from 22% to 31%.',
    'Reduced shrink from 1.8% to 0.9% through tighter floor routines.',
    'Merchandised six seasonal floor sets ahead of deadline.',
    'Reconciled daily cash drawers with 99.8% accuracy.',
    'Trained ten new associates on register and floor procedures.',
    'Exceeded store sales plan for six consecutive quarters.',
  ],
  receptionist: [
    'Managed a 12-line phone system and routed 90 calls per day.',
    'Checked in 70 patients each week while keeping records current.',
    'Verified insurance before appointments and reduced day-of delays.',
    'Reconciled copays and daily front-desk totals without variances.',
    'Triaged calls so urgent requests reached the right clinical team quickly.',
    'Coordinated calendars for six providers across two locations.',
    'Reduced no-shows with reminder calls and clear rescheduling options.',
  ],
  server: [
    'Turned an eight-table section efficiently during weekend dinner service.',
    'Averaged a $68 guest check through relevant menu recommendations.',
    'Upsold wine pairings and desserts without slowing table turns.',
    'Executed banquet service for 250 guests with accurate course timing.',
    'Trained six new servers on POS, menu, and service standards.',
    'Coordinated with the kitchen to handle allergies and pacing changes.',
  ],
  warehouse: [
    'Picked and packed 120 orders per hour at 99.7% accuracy.',
    'Operated reach truck and sit-down forklifts during receiving shifts.',
    'Staged outbound pallets in route order to speed dock loading.',
    'Reconciled cycle counts and corrected location errors in the WMS.',
    'Reduced inventory shrink through tighter scan and handoff controls.',
    'Maintained 99.5% inventory accuracy across 12,000 SKUs.',
    'Completed three years with no recordable safety incidents.',
  ],
  driver: [
    'Logged one million accident-free miles across regional routes.',
    'Maintained a clean MVR and current DOT medical card.',
    'Completed 130 last-mile stops per day at 98.6% on-time performance.',
    'Secured mixed freight with no cargo claims across six states.',
    'Passed four consecutive DOT inspections with no violations.',
    'Optimized routes to reduce fuel use and late deliveries.',
  ],
};

const exampleRewrites = {
  nursing: {
    'entry.2': 'BSN graduate with a critical-care capstone and [180] ICU clinical hours. Holds ACLS and BLS certification and caught documentation errors during chart review before they became part of the final record.',
  },
  sales: {
    'entry.1': 'Recent business graduate whose SDR internship produced [120] qualified leads and [35] discovery calls in four months. Comfortable with Salesforce, cold email sequences, and the steady follow-up needed after an initial no.',
    'entry.3': 'Entry-level account executive candidate with [1] year of door-to-door fundraising that brought in [$40K] across two campaigns. Responds well to coaching, tracks the numbers, and stays composed when a prospect declines.',
  },
  'administrative-assistant': {
    'entry.0': 'Administrative support candidate with [2] years of part-time office work, maintaining [400+] client records and covering the front desk for a [15]-person team. Comfortable in Google Workspace and careful about naming, filing, and retrieval.',
  },
  warehouse: {
    'entry.1': 'Construction laborer moving into warehouse work after [2] years of material handling, repetitive lifting, and early-shift schedules. Available for nights and weekends and comfortable working around active equipment.',
    'entry.4': 'Grocery stocker moving into warehouse work after handling [40] pallets each week. Experienced with rotation, date checks, clean aisles, and finishing a delivery before the store opens.',
  },
  driver: {
    'senior.1': 'Owner-operator with [11] years under independent authority, producing [$280K] in annual revenue and maintaining direct relationships with [12] recurring shippers.',
  },
};

function field(section, label, nextLabel) {
  const end = nextLabel ? `(?=\\n\\*\\*${nextLabel})` : '(?=\\n\\*\\*|\\n\\n|$)';
  const match = section.match(new RegExp(`\\*\\*${label}:\\*\\*\\s*([\\s\\S]*?)${end}`));
  return match?.[1]?.trim() ?? '';
}

function cleanText(value) {
  return value
    .replace(/\*+/g, '')
    .replace(/(\d)–(\d)/g, '$1 to $2')
    .replace(/\s+—\s+/g, ', ')
    .replace(/—/g, ',')
    .replace(/–/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function parsePowerWords(section) {
  const raw = section.match(/\*\*Power words:\*\*\s*([\s\S]*?)(?=\n\n\*\*Worksheet)/)?.[1] ?? '';
  return raw.split('·').map((part) => cleanText(part.split(/\s+—\s+/)[0].replace(/[А-Яа-яЁё].*$/, ''))).filter(Boolean).map((part) => {
    const word = part.match(/^([^()]+?)(?:\s*\(|$)/)?.[1]?.trim() ?? part;
    const rawNote = part.match(/\(([^)]+)\)/)?.[1];
    const note = rawNote && !/[А-Яа-яЁё]/.test(rawNote) ? rawNote : undefined;
    return {
      word,
      usage: note ? `Use ${word} when you can show the result. ${note.replace(/^not\s+/i, 'Avoid vague wording such as ')}.` : `Use ${word} with a number or a specific result from your work.`,
    };
  }).slice(0, 8);
}

function normalizeValue(value) {
  if (typeof value === 'string') return cleanText(value);
  if (Array.isArray(value)) return value.map(normalizeValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, normalizeValue(child)]));
  }
  return value;
}

function parseFaq(section) {
  const raw = section.match(/\*\*FAQ:\*\*\s*([\s\S]*?)(?=\n\n\*\*Related keywords:)/)?.[1] ?? '';
  return [...raw.matchAll(/^-\s+\*([^*]+)\*\s+—\s+(.+)$/gm)].map((match) => ({
    q: cleanText(match[1]),
    a: cleanText(match[2]),
  }));
}

function parseExamples(section) {
  const beforePowerWords = section.split('**Power words:**')[0];
  const blocks = [...beforePowerWords.matchAll(/^###\s+(.+)\n\n([\s\S]*?)(?=^###\s+|(?![\s\S]))/gm)];
  const parsed = blocks.slice(0, 3).map((block) =>
    [...block[2].matchAll(/^\d+\.\s+(.+)$/gm)].map((match) => ({ paragraphs: [cleanText(match[1])] })),
  );
  return { entry: parsed[0] ?? [], mid: parsed[1] ?? [], senior: parsed[2] ?? [] };
}

function makeExampleLabel(text, fallback) {
  const firstClause = text.split(/[.,;]/)[0]
    .split(/\s+(?:with|who|transitioning|moving|seeking|supporting|running|covering|handling|managing|selling|owning|responsible)\s+/i)[0]
    .replace(/\[[^\]]+\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const words = firstClause.split(' ').filter(Boolean);
  return words.length >= 2 ? words.slice(0, 7).join(' ') : fallback;
}

const sectionMatches = [...pack.matchAll(/^##\s+\d+\.\s+.+?`\/resume-summary\/([^/]+)\/`\n([\s\S]*?)(?=^##\s+\d+\.|(?![\s\S]))/gm)];
const imported = {};

for (const match of sectionMatches) {
  const slug = match[1];
  const section = match[2];
  const info = professionInfo[slug];
  if (!info) continue;

  const skills = field(section, 'Скиллы генератора').split('·').map(cleanText).filter(Boolean);
  const h1 = cleanText(field(section, 'H1')).replace(/\s*\(2026\)\s*$/, '');
  const relatedKeywords = field(section, 'Related keywords', 'Внутренние ссылки')
    .split('·').map(cleanText).filter(Boolean);

  const examples = parseExamples(section);
  for (const [location, text] of Object.entries(exampleRewrites[slug] ?? {})) {
    const [level, rawIndex] = location.split('.');
    const example = examples[level]?.[Number(rawIndex)];
    if (example) example.paragraphs = [text];
  }
  for (const [level, items] of Object.entries(examples)) {
    items.forEach((example, index) => {
      example.label = makeExampleLabel(example.paragraphs[0], `${level} example ${index + 1}`);
    });
  }
  const powerWords = parsePowerWords(section).map((item, index) => ({
    word: item.word,
    usage: powerWordUsage[slug][index] ?? item.usage,
  }));

  imported[slug] = {
    name: info.name,
    roleDefault: info.roleDefault,
    h1: pageCopy[slug].h1 ?? h1,
    metaDescription: pageCopy[slug].metaDescription,
    shortAnswer: pageCopy[slug].shortAnswer,
    skills,
    defaultSkills: skills.slice(0, 3),
    examples,
    powerWords,
    howToAdapt: howToAdapt[slug],
    faq: parseFaq(section),
    related: relatedMap[slug],
    relatedKeywords,
  };
}

if (Object.keys(imported).length !== 10) {
  throw new Error(`Expected 10 profession packs, parsed ${Object.keys(imported).length}`);
}

for (const [slug, profession] of Object.entries(imported)) {
  const counts = Object.values(profession.examples).map((items) => items.length);
  if (counts.join(',') !== '6,7,7') throw new Error(`${slug}: expected 6,7,7 examples, got ${counts.join(',')}`);
  if (profession.faq.length < 4) throw new Error(`${slug}: expected at least 4 FAQ entries`);
}

const supplemental = {
  'customer-service': {
    ...normalizeValue(existing['customer-service']),
    h1: 'Customer Service Resume Summary Examples',
    metaDescription: 'Browse 20 customer service resume summary examples for entry-level, experienced, team lead, and management roles. Includes a free generator.',
    shortAnswer: 'A customer service summary should name the channels and tools you know, then show how you helped customers or improved the work. Use a satisfaction score, ticket volume, first-contact resolution, retention, or response time instead of general claims about being helpful.',
    skills: ['Phone support', 'Email support', 'Live chat', 'CRM', 'De-escalation', 'Order management', 'First-contact resolution', 'Retention', 'Zendesk', 'Salesforce', 'Quality coaching', 'Team leadership'],
    defaultSkills: ['Phone support', 'CRM', 'De-escalation'],
    examples: {
      entry: [
        { label: 'Retail to customer service', paragraphs: ['Customer service candidate with [2] years in high-volume retail, helping [80+] shoppers per shift and resolving most returns without manager support. Comfortable with POS systems, order questions, and calm conversations when a customer is frustrated.'] },
        { label: 'Hospitality background', paragraphs: ['Front-desk associate moving into customer support after [18] months handling guest requests, billing questions, and last-minute room changes. Maintained a [4.8/5] guest rating by explaining options clearly and following through before the end of each shift.'] },
        { label: 'Bilingual support', paragraphs: ['Bilingual English and Spanish support candidate with volunteer experience answering [35+] weekly calls for a community program. Comfortable translating complex instructions into plain language and keeping accurate notes for the next person who helps.'] },
        { label: 'First office role', paragraphs: ['Recent graduate with campus office experience responding to [50] student questions each week by phone and email. Built a simple FAQ that reduced repeated questions by [20%] and helped classmates find answers without waiting.'] },
        { label: 'Seasonal e-commerce support', paragraphs: ['Seasonal e-commerce support associate who handled [45+] daily order, delivery, and return questions during the holiday rush. Learned the ticket queue quickly and maintained a [95%] quality score through the busiest six weeks of the year.'] },
        { label: 'Technical support trainee', paragraphs: ['Entry-level technical support candidate with [120] hours of hands-on training in troubleshooting, ticket documentation, and remote support. Known for asking clear questions, testing one fix at a time, and explaining the next step without jargon.'] },
      ],
      mid: [
        { label: 'Multi-channel support specialist', paragraphs: ['Customer support specialist with [4] years across phone, email, and live chat, handling [65] conversations per day in Zendesk. Maintained [94%] customer satisfaction while keeping response times within the team target.'] },
        { label: 'SaaS customer support', paragraphs: ['SaaS support specialist with [5] years helping small-business customers solve billing, setup, and workflow issues. Cut repeat tickets by [23%] after rewriting help-center articles around the questions customers actually asked.'] },
        { label: 'Insurance call center', paragraphs: ['Insurance service representative with [3] years explaining coverage, claims status, and payment options across [55+] calls per day. Held a [91%] first-contact resolution rate without rushing customers through difficult conversations.'] },
        { label: 'E-commerce customer care', paragraphs: ['E-commerce customer care specialist with [4] years managing orders, returns, and delivery escalations for a store processing [2,000+] weekly orders. Reduced refund turnaround from [5] days to [2] by clarifying the handoff between support and fulfillment.'] },
        { label: 'Banking support', paragraphs: ['Banking contact-center representative with [5] years handling account access, card disputes, and transaction questions under strict verification procedures. Averaged [96%] on monthly quality reviews across the past year.'] },
        { label: 'Healthcare scheduling support', paragraphs: ['Patient access representative with [3] years scheduling for [8] providers and resolving insurance or referral questions before appointments. Reduced avoidable reschedules by [18%] through more complete confirmation calls.'] },
        { label: 'Retention specialist', paragraphs: ['Retention specialist with [5] years in telecommunications, handling [35] cancellation requests per day and retaining [42%] of eligible accounts. Focuses on the reason behind the request before recommending a plan or service change.'] },
      ],
      senior: [
        { label: 'Customer service team lead', paragraphs: ['Customer service team lead with [8] years in support and [3] years coaching a [12]-person team. Introduced weekly case reviews that raised quality scores from [86%] to [94%] without increasing average handle time.'] },
        { label: 'Support operations manager', paragraphs: ['Support manager with [10] years across e-commerce and SaaS, responsible for [28] agents and three service channels. Reworked staffing and escalation rules to cut first response time by [37%] during peak periods.'] },
        { label: 'Quality and training lead', paragraphs: ['Customer service quality lead with [9] years turning difficult cases into practical coaching. Built onboarding and calibration sessions for [60+] hires, reducing time to independent work from [8] weeks to [6].'] },
        { label: 'Escalations manager', paragraphs: ['Escalations manager with [11] years handling high-risk billing, regulatory, and executive complaints. Resolved [93%] of assigned cases without further escalation while documenting root causes for product and operations teams.'] },
        { label: 'Customer success leader', paragraphs: ['Customer success leader with [9] years supporting a [$12M] portfolio of mid-market accounts. Improved renewal rate from [88%] to [94%] by introducing risk reviews before the final renewal quarter.'] },
        { label: 'Workforce and service delivery', paragraphs: ['Service delivery manager with [12] years in high-volume contact centers, forecasting demand and scheduling [75] agents across phone and chat. Reduced overtime spend by [16%] while keeping service levels above target.'] },
        { label: 'Director of customer experience', paragraphs: ['Customer experience director with [14] years connecting support data with product decisions. Led a cross-functional program that removed the top three contact drivers and reduced annual ticket volume by [21%].'] },
      ],
    },
    faq: [
      { q: 'What should a customer service resume summary include?', a: 'Name the channels you have worked in, the tools you know, and one result. Ticket volume, satisfaction, first-contact resolution, retention, or response time all show more than saying you have good communication skills.' },
      { q: 'How long should the summary be?', a: 'Keep it to two or three sentences, usually 40 to 60 words. A recruiter should be able to see your setting, strongest skills, and one result without reading a full paragraph.' },
      { q: 'Can retail or hospitality experience count?', a: 'Yes. Both involve questions, complaints, payments, and competing priorities. Translate the work into customer volume, issues resolved, ratings, upselling, or repeat business.' },
      { q: 'Should I name the CRM?', a: 'Name Zendesk, Salesforce, Intercom, or another platform when you have used it and it appears in the posting. Specific tools are easier for recruiters and ATS software to match.' },
      { q: 'Do I need a different summary for every application?', a: 'A small edit is worth it. Match the job title, channels, and tools, then choose the result most relevant to the employer. You do not need to rewrite every sentence.' },
    ],
    relatedKeywords: ['customer service resume summary', 'customer service summary examples', 'professional summary for customer service', 'customer support resume summary', 'call center resume summary', 'entry-level customer service summary', 'customer service manager resume summary', 'customer service skills for resume', 'support specialist resume summary', 'customer service resume with no experience'],
  },
  'project-manager': {
    ...normalizeValue(existing['project-manager']),
    h1: 'Project Manager Resume Summary Examples',
    metaDescription: 'Browse 20 project manager resume summary examples for coordinators, experienced PMs, PMP holders, program managers, and delivery leaders.',
    shortAnswer: 'A project manager summary should name the type and scale of work you lead, how you deliver it, and one outcome. Use budget, team size, schedule, portfolio size, savings, or delivery rate so the employer can compare your experience with the role.',
    skills: ['Project planning', 'Agile and Scrum', 'Waterfall delivery', 'Stakeholder management', 'Budget control', 'Risk management', 'Vendor management', 'Jira', 'Microsoft Project', 'Change management', 'Executive reporting', 'Team leadership'],
    defaultSkills: ['Project planning', 'Stakeholder management', 'Risk management'],
    examples: {
      entry: [
        { label: 'CAPM project coordinator', paragraphs: ['CAPM-certified project coordinator with internship experience tracking tasks, risks, and decisions for a [7]-person software team. Kept Jira and meeting notes current through a [4]-month release cycle with no missed status reports.'] },
        { label: 'Product launch coordinator', paragraphs: ['Early-career coordinator who supported [3] product launches by maintaining timelines, owner lists, and weekly updates across marketing, sales, and operations. Flagged dependencies early enough to keep all three launches on schedule.'] },
        { label: 'Construction project assistant', paragraphs: ['Construction project assistant with [18] months supporting submittals, RFIs, vendor documents, and schedule updates on projects up to [$2M]. Comfortable following details from site meetings through final closeout.'] },
        { label: 'Event project coordinator', paragraphs: ['Event coordinator moving into project management after delivering [12] conferences for up to [500] attendees. Managed run sheets, vendors, budgets, and last-minute changes without losing sight of the attendee experience.'] },
        { label: 'Nonprofit program coordinator', paragraphs: ['Nonprofit program coordinator with [2] years organizing grant deliverables, partner meetings, and reporting across [6] community programs. Improved on-time reporting from [78%] to [96%] with a shared tracker and clearer ownership.'] },
        { label: 'Business analyst to PM', paragraphs: ['Business analyst preparing for project ownership after [2] years gathering requirements and coordinating UAT for [4] system releases. Brings clear documentation, practical stakeholder communication, and a habit of surfacing decisions before they block delivery.'] },
      ],
      mid: [
        { label: 'Software project manager', paragraphs: ['Project manager with [5] years delivering software initiatives up to [$2M] across distributed Agile teams. Delivered [91%] of projects on schedule by tightening scope decisions and making risks visible earlier.'] },
        { label: 'Construction project manager', paragraphs: ['Construction project manager with [6] years leading commercial projects from preconstruction through closeout. Managed budgets up to [$8M] while holding average schedule variance below [4%].'] },
        { label: 'Marketing project manager', paragraphs: ['Marketing project manager with [4] years coordinating creative, media, web, and legal teams across [25+] campaigns per year. Reduced average approval time by [30%] with clearer briefs and a single review path.'] },
        { label: 'Healthcare implementation PM', paragraphs: ['Healthcare implementation manager with [5] years rolling out clinical and billing systems across [9] sites. Coordinated training, data migration, and go-live support while keeping disruption below agreed service levels.'] },
        { label: 'Operations project manager', paragraphs: ['Operations project manager with [6] years improving warehouse and fulfillment workflows. Led a [$1.4M] automation project that increased daily capacity by [26%] without adding floor space.'] },
        { label: 'ERP project manager', paragraphs: ['ERP project manager with [5] years coordinating finance, operations, vendors, and technical teams through system migrations. Completed a [14]-month NetSuite rollout within [3%] of budget.'] },
        { label: 'Agency project manager', paragraphs: ['Agency project manager with [4] years running websites and campaigns for a portfolio of [10] clients. Improved gross margin by [8] points after introducing better estimation and change-order tracking.'] },
      ],
      senior: [
        { label: 'Senior program manager', paragraphs: ['Senior program manager with [11] years leading product and engineering initiatives across portfolios up to [$12M]. Cut average delivery slippage from [6] weeks to [1] by rebuilding intake and estimation.'] },
        { label: 'PMO leader', paragraphs: ['PMO leader with [13] years establishing governance for [35+] concurrent initiatives. Built a team of [8] project managers and introduced portfolio reviews that redirected funding before troubled projects missed major milestones.'] },
        { label: 'Director of delivery', paragraphs: ['Director of delivery with [12] years in digital services, responsible for [6] client teams and [$18M] in annual work. Raised on-time delivery from [74%] to [92%] while improving project margin.'] },
        { label: 'Construction program director', paragraphs: ['Construction program director with [15] years overseeing capital programs up to [$120M]. Coordinated owners, designers, contractors, and public agencies across [7] active sites with no lost-time safety incidents.'] },
        { label: 'Transformation program lead', paragraphs: ['Transformation lead with [10] years managing operating-model and technology change across finance and customer operations. Delivered [$6M] in verified annual savings across a [2]-year program.'] },
        { label: 'Product operations leader', paragraphs: ['Product operations leader with [9] years connecting roadmaps, capacity, and executive decisions across [5] product groups. Reduced planning cycle time by [40%] and gave teams a stable quarterly commitment process.'] },
        { label: 'Portfolio delivery executive', paragraphs: ['Portfolio delivery executive with [16] years across healthcare and financial services, accountable for [45] initiatives and a [$75M] annual change budget. Improved benefits tracking so leaders could stop low-value work earlier.'] },
      ],
    },
    faq: [
      { q: 'What belongs in a project manager resume summary?', a: 'Include the type of projects, delivery method, scale, and one result. Budget, team size, project count, schedule variance, savings, or on-time delivery are useful measures.' },
      { q: 'Should I include PMP or another certification?', a: 'Yes, when the posting asks for it or the credential is a meaningful filter. Put it in the first sentence, but still include a delivery result.' },
      { q: 'How do I quantify project management work?', a: 'Use budget, duration, team size, vendors, sites, concurrent projects, or delivery rate. Choose numbers that match the scale of the role you want.' },
      { q: 'Can a coordinator use a summary without owning a full project?', a: 'Yes. Show the deliverables you tracked, teams you supported, meetings or reports you owned, and a result such as fewer missed deadlines or better reporting.' },
      { q: 'Should Agile and waterfall summaries sound different?', a: 'They should use the language of the job. Agile roles may value ceremonies, releases, and cross-functional delivery. Traditional roles often care more about budget, schedule, vendors, and change control.' },
    ],
    relatedKeywords: ['project manager resume summary', 'project management professional summary', 'project coordinator resume summary', 'PMP resume summary', 'senior project manager summary', 'program manager resume summary', 'Agile project manager resume', 'construction project manager summary', 'IT project manager resume summary', 'project manager resume examples'],
  },
};

const managed = {
  'customer-service': supplemental['customer-service'],
  nursing: imported.nursing,
  'project-manager': supplemental['project-manager'],
  sales: imported.sales,
  'administrative-assistant': imported['administrative-assistant'],
  teacher: imported.teacher,
  accountant: imported.accountant,
  retail: imported.retail,
  receptionist: imported.receptionist,
  server: imported.server,
  warehouse: imported.warehouse,
  driver: imported.driver,
};

const output = {
  ...managed,
  ...Object.fromEntries(Object.entries(existing).filter(([slug]) => !(slug in managed))),
};

await writeFile(dataPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Imported ${Object.keys(imported).length} packs into ${dataPath}`);
