import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataPath = path.join(projectRoot, 'src', 'data', 'professions.json');
const data = JSON.parse(await readFile(dataPath, 'utf8'));
const jobDataPath = path.join(projectRoot, 'src', 'data', 'jobDescriptions.json');
const jobData = JSON.parse(await readFile(jobDataPath, 'utf8'));

const labels = {
  accountant: {
    senior: ['CPA and accounting close owner', null, 'Corporate controller'],
  },
  retail: {
    entry: [null, null, null, null, null, 'Student seeking part-time retail work'],
    mid: [null, 'High-volume retail cashier'],
  },
  receptionist: {
    mid: ['Corporate office receptionist'],
  },
  server: {
    entry: [null, null, 'Busser moving into table service', null, 'Student with café experience'],
    mid: ['Casual dining server', null, 'Bartender-server', 'High-volume breakfast server'],
  },
  warehouse: {
    mid: [null, null, null, null, 'Cold storage packer'],
  },
  driver: {
    senior: [null, 'Owner-operator'],
  },
  bartender: {
    entry: [
      'Experienced barback',
      'Bartending school graduate',
      'Server moving behind the bar',
      'Barback ready for a bartender role',
      'Retail cash handler moving into bartending',
      'Culinary student and bar assistant',
    ],
    mid: [
      'High-volume well bartender',
      'Craft cocktail bartender',
      'Service bar bartender',
      'Hotel lobby bartender',
      'Nightclub bartender',
      'Brewpub bartender',
      'Resort pool bartender',
    ],
    senior: [
      'Lead bartender',
      'Bar manager',
      'Head cocktail bartender',
      'Multi-venue opening bartender',
      'Beverage director and working bartender',
      'Banquet bar captain',
      'Bartender and closing shift lead',
    ],
  },
  waitress: {
    entry: [
      'Host moving into table service',
      'Newly trained waitress',
      'Busser moving into serving',
      'Retail cashier moving into food service',
      'Breakfast waitress',
      'Bilingual banquet server',
    ],
    mid: [
      'High-volume casual dining waitress',
      'Breakfast diner waitress',
      'Fine dining server',
      'Overnight truck stop waitress',
      'Brunch and patio waitress',
      'Steakhouse waitress',
      'Sports bar waitress',
    ],
    senior: [
      'Lead waitress',
      'Fine dining server captain',
      'Waitstaff trainer',
      'Banquet service supervisor',
      'Long-term neighborhood waitress',
      'Sommelier assistant and server',
      'Hotel dining floor lead',
    ],
  },
  'security-guard': {
    entry: [
      'Licensed corporate lobby guard',
      'Army veteran entering private security',
      'Residential security officer',
      'Retail associate moving into loss prevention',
      'Construction site gate guard',
      'Hospital lobby security officer',
    ],
    mid: [
      'Distribution center security officer',
      'Armed overnight patrol guard',
      'Corporate access control officer',
      'Retail loss prevention officer',
      'Hospital security officer',
      'Arena event security specialist',
      'CCTV console operator',
    ],
    senior: [
      'Security shift supervisor',
      'Campus site security manager',
      'Contract security account manager',
      'Armed lead officer and trainer',
      'Hospital security shift supervisor',
      'Corporate access control lead',
      'Security operations supervisor',
    ],
  },
  'correctional-officer': {
    entry: [
      'Correctional academy graduate',
      'New county jail officer',
      'Military police veteran moving into corrections',
      'Juvenile detention officer',
      'Private facility detention officer',
      'Correctional control room officer',
    ],
    mid: [
      'State prison housing unit officer',
      'County jail officer',
      'Inmate transport officer',
      'Housing unit search officer',
      'Segregation unit officer',
      'Correctional control room operator',
      'Intake and booking officer',
    ],
    senior: [
      'Correctional sergeant',
      'Correctional shift lieutenant',
      'Corrections training officer',
      'General population unit manager',
      'Juvenile facility senior officer',
      'Emergency response team leader',
      'Accreditation-ready correctional corporal',
    ],
  },
  'store-manager': {
    entry: [
      'Keyholder promoted to assistant manager',
      'Assistant store manager',
      'Footwear department supervisor',
      'Retail scheduling supervisor',
      'Shift lead with P&L training',
      'Sales associate promoted to keyholder',
    ],
    mid: [
      'Specialty store manager',
      'Big-box store manager',
      'Outlet store manager',
      'Seasonal retail hiring manager',
      'Grocery store manager',
      'Apparel store remodel manager',
      'Convenience store manager',
    ],
    senior: [
      'Retail district manager',
      'Flagship store manager',
      'Multi-unit retail leader',
      'New store opening manager',
      'Senior store manager and talent developer',
      'Retail turnaround manager',
      'Multi-location retail operations leader',
    ],
  },
  'hr-assistant': {
    entry: [
      'Entry-level HR assistant',
      'Business graduate in HR operations',
      'Administrative assistant moving into HR',
      'HR intern promoted to coordinator',
      'Manufacturing HR support assistant',
      'Multi-site HR graduate assistant',
    ],
    mid: [
      'Workday HR assistant',
      'Full-cycle HR operations assistant',
      'UKG HR coordinator',
      'Recruiting and payroll support specialist',
      'Healthcare HR assistant',
      'Benefits enrollment coordinator',
      'Onboarding process specialist',
    ],
    senior: [
      'Senior HR operations assistant',
      'Multi-state compliance specialist',
      'Benefits administration specialist',
      'Workday onboarding lead',
      'HR generalist with leave administration',
      'HRIS migration specialist',
      'Confidential records and HR service lead',
    ],
  },
};

const pageEnhancements = {
  bartender: {
    shortAnswer: 'A bartender resume summary should name the bar setting, years of experience, and the pace you can handle. Add drinks per shift, nightly bar sales, average check, pour cost, or inventory variance. Include responsible-service certification and the POS you know when they match the job.',
    howToAdapt: [
      { step: 'Match the bar setting', text: 'Lead with craft cocktails, high-volume service, hotels, banquets, nightclubs, or another setting that resembles the new venue.' },
      { step: 'Show volume and money', text: 'Use drinks per shift, nightly bar sales, average check, pour cost, or inventory variance to explain the scale of the work.' },
      { step: 'Name certification and systems', text: 'Include TIPS, ServSafe Alcohol, Toast, Square, Aloha, or another credential or POS only when you have used it.' },
      { step: 'Replace every bracket', text: 'Use figures you can support with register reports, inventory counts, schedules, or a reasonable average from a typical shift.' },
    ],
  },
  waitress: {
    shortAnswer: 'A waitress resume summary should identify the service style and the pace of the section. Use tables, covers per shift, average check, ticket time, or an upselling result. Add the POS, food-safety credential, and allergen knowledge when they are relevant to the restaurant.',
    howToAdapt: [
      { step: 'Match the service style', text: 'Use diner, casual dining, fine dining, banquets, hotels, or high-volume bar service based on the restaurant.' },
      { step: 'Make the section visible', text: 'Add tables, covers, nightly sales, average check, or ticket time so the reader can understand your normal pace.' },
      { step: 'Include the useful details', text: 'Mention the POS, food-handler card, alcohol certification, wine service, or allergen knowledge requested in the posting.' },
      { step: 'Choose one service result', text: 'Use upselling, guest ratings, repeat customers, accurate orders, or faster ticket times instead of broad claims about people skills.' },
    ],
  },
  'security-guard': {
    shortAnswer: 'A security guard resume summary should state the license, post type, and site you cover. Add patrol tours, cameras monitored, visitors screened, alarm calls, or reports completed. Keep the wording factual and make clear whether the role was armed, unarmed, access control, loss prevention, hospital, or event security.',
    howToAdapt: [
      { step: 'Match the post type', text: 'Name the relevant setting, such as corporate, residential, retail, hospital, construction, event, or distribution security.' },
      { step: 'Bring the license forward', text: 'State the current guard card, firearms permit, CPR training, or other required credential without publishing the license number.' },
      { step: 'Show the size of the post', text: 'Use patrol tours, doors, cameras, visitors, reports, or officers dispatched to describe the actual workload.' },
      { step: 'Use precise authority language', text: 'Describe observation, access control, reporting, and de-escalation accurately. Do not imply law-enforcement powers the position did not have.' },
    ],
  },
  'correctional-officer': {
    shortAnswer: 'A correctional officer resume summary should identify the facility, security level, and housing-unit size. Add counts, searches, escorts, reports, or inmate movements that show the scope of the assignment. Include academy training, PREA, CPR, and other current certifications without sharing confidential incident details.',
    howToAdapt: [
      { step: 'Name the facility and unit', text: 'Use county jail, state prison, juvenile detention, intake, segregation, transport, or another assignment that matches the opening.' },
      { step: 'Add training and certification', text: 'Include academy hours, PREA, CPR, defensive tactics, or recent in-service training when the employer requires it.' },
      { step: 'Quantify routine responsibility', text: 'Use housing-unit size, counts per shift, searches, escorts, reports, or staff supervised rather than dramatic incident language.' },
      { step: 'Protect confidential details', text: 'Keep examples procedural. Leave out names, graphic information, open cases, and anything restricted by facility policy.' },
    ],
  },
  'store-manager': {
    shortAnswer: 'A store manager resume summary should show the size of the business and the team you lead. Use annual sales, comp growth, shrink, payroll, conversion, or headcount, then name the retail setting and systems that match the role. Choose two strong figures rather than packing every store metric into the opening.',
    howToAdapt: [
      { step: 'Match the store format', text: 'Name a comparable setting such as specialty, grocery, big-box, outlet, convenience, flagship, or multi-unit retail.' },
      { step: 'Show financial scale', text: 'Use annual volume, P&L ownership, comp sales, shrink, payroll, conversion, or units per transaction based on the posting.' },
      { step: 'Connect people and results', text: 'Pair team size with hiring, scheduling, retention, coaching, or internal promotions so leadership is more than a headcount.' },
      { step: 'Name relevant systems', text: 'Include Workday, Kronos, POS, inventory, or workforce tools only when the employer asks for them and you know them.' },
    ],
  },
  'hr-assistant': {
    shortAnswer: 'An HR assistant resume summary should name the employee population, HRIS, and the support work you handle. Use onboarding volume, interview schedules, file audits, ticket response time, I-9 accuracy, or enrollment participation. Keep the scope accurate and distinguish administrative support from generalist or employee-relations ownership.',
    howToAdapt: [
      { step: 'Set the headcount and HRIS', text: 'Name the approximate employee population and the system you use, such as Workday, BambooHR, ADP, UKG, or Paycom.' },
      { step: 'Match the HR workload', text: 'Emphasize onboarding, recruiting coordination, records, benefits, payroll changes, leave paperwork, or another area named in the posting.' },
      { step: 'Show volume and accuracy', text: 'Use hires per month, interviews per week, files audited, response time, or compliance completion when the number is accurate.' },
      { step: 'Keep the level honest', text: 'Do not claim investigations, policy decisions, or employee-relations authority when your role supported those processes rather than owning them.' },
    ],
  },
};

const exampleRewrites = {
  'waitress.entry.0': 'Host with [1] year seating [200] covers a night at a [180]-seat diner, ready to manage a section independently.',
  'store-manager.mid.5': 'Apparel store manager who guided a [$2.8M] location through a full remodel, held sales steady during construction, and reopened to [15%] comp growth.',
  'store-manager.senior.6': 'Multi-location retail leader managing [$22M] across [5] high-volume stores and rolling out Workday scheduling that trimmed payroll [1.8] points without cutting selling hours.',
  'hr-assistant.mid.2': 'HR coordinator supporting [3] business units and [380] employees in UKG, raising open-enrollment participation to [92%] and processing FMLA paperwork accurately.',
  'hr-assistant.mid.5': 'Benefits coordinator managing enrollment for [300] employees and [65] annual qualifying life events while keeping HRIS data accuracy above [99%].',
  'hr-assistant.mid.6': 'Onboarding process specialist who rebuilt BambooHR checklists and cut new-hire paperwork time from [90] to [35] minutes across [25] monthly starts.',
  'hr-assistant.senior.5': 'HRIS migration specialist with [12] years of HR support who moved [2,000] employee records from ADP to UKG with [100%] data integrity and no payroll disruption.',
  'hr-assistant.senior.6': 'Senior HR service specialist trusted with confidential records for [1,000] employees, cutting ticket response time from [3] days to [4] hours across two inboxes.',
};

const jobPageEnhancements = {
  bartender: {
    shortAnswer: 'Lead with the pace and money you handled: drinks per shift, nightly bar sales, or average check. Name the POS and responsible-service certification you actually use, then include inventory, pour cost, opening, or closing work when it was part of the job.',
    howToUse: [
      { step: 'Start with bar volume', text: 'Choose two or three lines that show drinks per shift, nightly sales, average check, or the size of the venue.' },
      { step: 'Use figures you can explain', text: 'Replace each placeholder with a register total, inventory figure, or conservative average from a typical shift.' },
      { step: 'Match the venue', text: 'Move the duties named in the posting to the top and remove work the venue does not perform, such as craft batching for a beer-only bar.' },
    ],
  },
  waitress: {
    shortAnswer: 'Put the pace of the section first: tables, covers per shift, and average check. Add the POS, allergen knowledge, cash handling, or upselling result that best matches the restaurant. Training and banquet work deserve separate lines when they were a meaningful part of the role.',
    howToUse: [
      { step: 'Set the pace', text: 'Open with section size, covers per shift, nightly sales, or another number that explains a normal service.' },
      { step: 'Name real systems', text: 'Replace the POS placeholder with Toast, Aloha, Micros, or the product you used, and add a menu size only when you know it.' },
      { step: 'Remove repetition', text: 'Keep four to six useful lines for the current job and fewer for older roles. Favor details that distinguish your section, service style, or results.' },
    ],
  },
  'security-guard': {
    shortAnswer: 'Start with the site and its scale: property type, patrol rounds, cameras, visitors, or access points. Add reporting volume, alarm response, tour systems, and current credentials where relevant. Keep the language factual, distinguish armed from unarmed work, and describe observe-and-report duties without overstating your authority.',
    howToUse: [
      { step: 'Identify the post', text: 'Say whether you protected a retail store, hospital, corporate lobby, construction site, residential property, or event venue.' },
      { step: 'Show the workload', text: 'Use cameras monitored, rounds per shift, badges issued, or reports written, based on records or a defensible normal shift.' },
      { step: 'Add current credentials', text: 'List the required guard card, CPR, first aid, firearms permit, or other active certification clearly and accurately.' },
    ],
  },
  'correctional-officer': {
    shortAnswer: 'Lead with facility type, security level, assignment, and the population or housing unit you supervised. Use counts, searches, escorts, reports, and inmate movements to explain the workload. Add academy hours, control-room or transport experience, and current certifications while keeping incident details confidential.',
    howToUse: [
      { step: 'Give the setting', text: 'Open with facility type, security level, assignment, and average population so the rest of the duties have context.' },
      { step: 'Match the posting', text: 'Choose the core duties named by the employer, then add leadership lines only if you trained officers or led a shift.' },
      { step: 'Protect accuracy and privacy', text: 'Replace placeholders with figures you can support, and leave out names, open cases, and restricted incident details.' },
    ],
  },
  driver: {
    shortAnswer: 'Put the license class, endorsements, vehicle type, and route type near the top, then add miles, stops, on-time delivery, or years of safe driving. Include ELD, inspections, hours-of-service records, load securement, dock work, and proof-of-delivery duties that match the opening.',
    howToUse: [
      { step: 'Name the license and vehicle', text: 'Use the exact CDL class, endorsements, and equipment from your record so the qualifications are easy to verify.' },
      { step: 'Cover safety and compliance', text: 'Choose lines about hours-of-service logs, pre-trip inspections, load securement, or another routine that fits the job.' },
      { step: 'Use dispatch records', text: 'Replace placeholders with honest route figures such as weekly miles, stops per day, on-time deliveries, or safe-driving years.' },
    ],
  },
  receptionist: {
    shortAnswer: 'Quantify the front desk with calls, visitors, appointments, meeting rooms, or mail handled. Name the phone, calendar, booking, CRM, and badge systems you used. For medical offices, include HIPAA, insurance verification, patient scheduling, and copay work instead of broad administrative language.',
    howToUse: [
      { step: 'Show front-desk volume', text: 'Use calls per day, visitors checked in, appointments booked, or another figure that reflects the pace of the office.' },
      { step: 'Name the software', text: 'Replace placeholders with the products you actually used, such as Cisco, RingCentral, Outlook, Epic, or Salesforce.' },
      { step: 'Match the workplace', text: 'Keep medical duties for clinics and hospitals. For corporate offices, emphasize visitor badging, meeting rooms, mail, and executive support.' },
    ],
  },
};

for (const [slug, levels] of Object.entries(labels)) {
  const profession = data[slug];
  if (!profession) throw new Error(`Missing profession: ${slug}`);
  for (const [level, levelLabels] of Object.entries(levels)) {
    levelLabels.forEach((label, index) => {
      if (label) profession.examples[level][index].label = label;
    });
  }
}

for (const [slug, enhancements] of Object.entries(pageEnhancements)) {
  if (!data[slug]) throw new Error(`Missing profession: ${slug}`);
  Object.assign(data[slug], enhancements);
}

for (const [location, text] of Object.entries(exampleRewrites)) {
  const [slug, level, rawIndex] = location.split('.');
  data[slug].examples[level][Number(rawIndex)].paragraphs = [text];
}

for (const [slug, enhancements] of Object.entries(jobPageEnhancements)) {
  if (!jobData[slug]) throw new Error(`Missing job description: ${slug}`);
  Object.assign(jobData[slug], enhancements);
}

data['store-manager'].metaDescription = 'Store manager resume summary examples for entry, mid, and senior levels, with retail metrics, power words, and practical writing tips.';

await writeFile(dataPath, `${JSON.stringify(data, null, 2)}\n`);
await writeFile(jobDataPath, `${JSON.stringify(jobData, null, 2)}\n`);
console.log(`Enriched ${Object.keys(labels).length} profession entries and ${Object.keys(jobPageEnhancements).length} job-description entries.`);
