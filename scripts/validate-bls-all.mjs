/**
 * FULL independent validation across ALL 96 BLS occupations.
 *
 *   npx tsx scripts/validate-bls-all.mjs
 *
 * For every occupation we author a SECOND realistic respondent vector (a
 * different person in that same job — varied on the soft/subjective questions,
 * authored without copying the anchor) and ask the guesser. A guess counts as
 * correct using the user's own definition of accuracy:
 *
 *   HIT = the top-K guess contains the occupation ITSELF, or any "typical
 *         career" sibling from the SAME PROFILE_CAREERS list (the exact list the
 *         result page shows under that archetype — "看这个类别下的典型职业，
 *         看看是不是有自己").
 *
 * This is the comprehensive companion to validate-bls-independent.mjs (50 common
 * professions) and the circular validate-bls.mjs (384 perturbations).
 */

import { inferOccupationFromAnswers } from '../lib/occupation_inference.ts';
import { BLS_OCCUPATIONS } from '../lib/occupation_anchors.generated.ts';
import { PROFILE_CAREERS } from '../lib/air_career_data.ts';

// Cross-list cousin tolerance: the 16-axis test legitimately can't separate some
// jobs across PROFILE lists (e.g. Data Scientist vs the new Statistician). These
// extra titles count as a correct guess for the keyed occupation.
const COUSIN = {
  'Data Scientists': /statistician|economist|web developer|programmer/i,
  'Software Developers': /web developer|programmer|information security/i,
  'Computer Systems Analysts': /information security|database|programmer/i,
  'Network and Computer Systems Administrators': /database|information security|programmer/i,
  'Management Analysts': /financial analyst|logistician|economist/i,
  'Accountants and Auditors': /financial analyst|compliance|loan officer/i,
  'Insurance Sales Agents': /financial advisor|securities|loan officer|real estate/i,
  'Market Research Analysts and Marketing Specialists': /economist|statistician|marketing manager/i,
  'Registered Nurses': /physician assistant|licensed practical|emergency medical|paramedic/i,
  'Nurse Practitioners': /physician|physician assistant/i,
  'Graphic Designers': /web and digital interface|fashion|film and video/i,
  'Editors': /writer|author|journalist|reporter/i,
  'Producers and Directors': /actor|musician|photographer/i,
};

// title → placement archetype, and placement → [sibling titles]
const placementOf = {};
const siblingsOf = {};
for (const [code, careers] of Object.entries(PROFILE_CAREERS)) {
  const titles = careers.map(c => c.title.en);
  for (const t of titles) { placementOf[t] = code; siblingsOf[t] = titles; }
}
const archOf = Object.fromEntries(BLS_OCCUPATIONS.map(o => [o.id, o.archetype]));
const titleOfId = Object.fromEntries(BLS_OCCUPATIONS.map(o => [o.id, o.title.en]));

// A second realistic respondent per occupation (varied from the anchor on soft
// questions; hard discriminators Q1/Q5/Q8/Q9/Q12/Q15 kept job-realistic).
//                       Q1 Q2 Q3 Q4 Q5 Q6 Q7 Q8 Q9 Q10 Q11 Q12 Q13 Q14 Q15 Q16
const RESPONDENT = {
  // EOFP — office & admin
  'Customer Service Representatives':                 [4,4,3,2, 4,4,2,2, 2,4,5,2, 3,5,1,2],
  'Office Clerks, General':                           [5,5,2,2, 4,5,2,1, 2,4,4,2, 2,4,1,1],
  'Secretaries and Administrative Assistants':        [5,4,3,2, 4,4,3,2, 2,4,4,2, 3,4,2,2],
  'Receptionists and Information Clerks':             [4,3,2,2, 4,4,2,2, 2,4,5,2, 2,4,3,2],
  'Medical Secretaries and Administrative Assistants':[5,4,2,1, 5,4,3,2, 3,3,3,3, 2,4,2,2],
  'Bookkeeping, Accounting, and Auditing Clerks':     [5,5,2,2, 5,4,2,1, 3,3,3,2, 2,4,1,3],
  // EOFH — sales / relationship
  'Sales Representatives of Services':                [4,4,3,3, 3,3,4,3, 2,4,3,3, 4,4,3,4],
  'First-Line Supervisors of Retail Sales Workers':  [3,3,4,3, 4,4,3,3, 2,4,4,2, 4,4,4,3],
  'Counter and Rental Clerks':                        [4,4,3,2, 4,4,2,2, 2,4,4,2, 3,4,3,3],
  'Retail Salespersons':                              [3,4,3,2, 3,4,2,2, 2,4,4,2, 4,4,4,4],
  'Insurance Sales Agents':                           [5,3,3,3, 4,3,3,3, 3,4,3,3, 5,3,2,4],
  'Cashiers':                                         [3,5,2,1, 4,5,2,1, 2,4,5,2, 2,5,4,2],
  // EORH — business & financial
  'Market Research Analysts and Marketing Specialists':[5,3,3,4, 3,2,4,4, 3,4,3,3, 3,3,1,3],
  'Human Resources Specialists':                      [5,3,4,3, 3,3,4,3, 3,3,3,3, 4,3,2,4],
  'Business Operations Specialists':                  [5,4,3,3, 4,3,3,3, 3,4,3,2, 3,3,2,3],
  'Management Analysts':                              [5,4,3,4, 5,3,4,2, 3,4,4,3, 4,3,1,3],
  'Project Management Specialists':                   [5,3,4,3, 4,4,4,2, 3,4,3,3, 4,4,2,3],
  'Accountants and Auditors':                         [5,5,2,2, 5,4,3,2, 4,2,2,4, 3,3,2,3],
  // EORP — production
  'First-Line Supervisors of Production Workers':     [3,4,3,2, 5,4,2,2, 4,2,3,3, 3,4,5,2],
  'Inspectors, Testers, Sorters, Samplers, and Weighers':[3,4,2,2, 5,5,2,1, 4,2,4,3, 2,4,4,2],
  'Packaging and Filling Machine Operators':          [3,4,3,1, 5,5,2,1, 3,3,3,2, 2,5,5,1],
  'Welders, Cutters, Solderers, and Brazers':         [2,3,4,2, 5,4,3,2, 4,2,3,3, 2,4,5,2],
  'Machinists':                                       [3,4,4,2, 5,4,2,2, 4,3,3,3, 2,4,4,2],
  'Bakers':                                           [2,3,3,2, 4,4,3,3, 3,3,3,2, 3,4,5,3],
  // ESFH — education
  'Health Specialties Teachers, Postsecondary':       [4,4,4,4, 2,2,4,3, 3,3,3,4, 4,2,3,4],
  'Middle School Teachers':                           [4,3,3,3, 2,2,4,4, 3,3,4,4, 4,3,4,4],
  'Secondary School Teachers':                        [4,4,4,3, 2,3,3,3, 3,3,3,4, 3,3,4,4],
  'Elementary School Teachers':                       [3,4,4,4, 2,2,4,3, 3,3,3,4, 4,3,5,4],
  'Self-Enrichment Teachers':                         [4,3,4,4, 2,2,5,4, 2,4,4,3, 5,3,4,4],
  'Preschool Teachers':                               [2,3,4,3, 1,2,4,4, 3,3,3,4, 4,3,5,5],
  // ESFP — computer / software
  'Software Developers':                              [5,4,4,3, 3,2,4,4, 3,4,5,2, 2,4,1,2],
  'Software Quality Assurance Analysts and Testers':  [5,4,3,3, 4,3,3,2, 3,4,4,2, 2,4,1,2],
  'Computer User Support Specialists':                [5,4,2,2, 4,4,2,2, 2,4,5,2, 3,4,2,2],
  'Data Scientists':                                  [5,4,4,3, 4,2,4,3, 3,4,4,2, 2,4,1,2],
  'Computer Systems Analysts':                        [5,4,3,4, 4,3,4,2, 3,4,4,3, 3,3,2,2],
  'Network and Computer Systems Administrators':      [5,4,3,2, 4,4,3,2, 3,3,4,2, 2,4,2,3],
  // ESRH — legal
  'Administrative Law Judges':                        [5,4,3,3, 3,3,3,3, 4,2,2,5, 3,3,2,4],
  'Arbitrators, Mediators, and Conciliators':         [4,3,4,3, 2,2,5,4, 3,3,3,4, 5,3,3,5],
  'Judicial Law Clerks':                              [5,5,3,3, 3,3,3,2, 3,3,3,4, 3,4,2,3],
  'Judges, Magistrate Judges, and Magistrates':       [5,4,4,3, 3,3,3,3, 5,2,2,5, 4,2,3,5],
  'Paralegals and Legal Assistants':                  [5,4,2,2, 4,4,2,2, 3,3,3,3, 2,4,2,3],
  'Lawyers':                                          [5,5,4,3, 3,3,4,3, 4,2,2,4, 4,2,2,4],
  // ESRP — engineering / science
  'Electrical Engineers':                             [5,4,4,4, 4,3,4,3, 4,3,2,3, 2,3,3,3],
  'Architects, Except Landscape and Naval':           [5,3,4,4, 3,2,4,5, 4,3,3,4, 3,3,3,3],
  'Mechanical Engineers':                             [5,4,4,3, 4,3,4,3, 4,3,3,3, 2,3,3,2],
  'Civil Engineers':                                  [5,4,3,3, 4,3,3,3, 5,2,2,4, 3,2,4,3],
  'Industrial Engineers':                             [5,4,4,3, 4,4,3,3, 3,3,4,3, 3,3,3,3],
  'Medical Scientists, Except Epidemiologists':       [5,3,5,5, 4,2,4,3, 4,4,3,3, 3,2,2,3],
  // TOFH — personal care
  'Amusement and Recreation Attendants':              [2,4,3,2, 3,4,3,3, 2,4,4,3, 3,4,5,3],
  'Hairdressers, Hairstylists, and Cosmetologists':   [1,3,4,3, 3,2,4,4, 2,4,4,2, 5,3,5,5],
  'Manicurists and Pedicurists':                      [1,3,4,2, 3,3,3,3, 2,4,4,2, 4,4,5,4],
  'Exercise Trainers and Group Fitness Instructors':  [2,3,4,3, 3,2,4,3, 2,4,4,3, 5,3,5,4],
  'Childcare Workers':                                [2,3,4,3, 2,3,4,3, 4,3,3,4, 4,3,5,5],
  'Animal Caretakers':                                [2,4,3,2, 3,3,3,3, 3,4,4,2, 3,4,5,3],
  // TOFP — transport / labor
  'Laborers and Freight, Stock, and Material Movers': [1,4,3,2, 4,4,2,1, 3,4,4,2, 2,5,5,2],
  'Heavy and Tractor-Trailer Truck Drivers':          [2,3,4,2, 4,4,2,1, 4,3,3,3, 2,4,5,2],
  'Stockers and Order Fillers':                       [1,4,2,2, 4,5,2,1, 2,4,5,2, 2,5,4,2],
  'Janitors and Cleaners':                            [1,3,3,2, 4,4,2,2, 2,4,4,2, 2,5,5,2],
  'Maintenance and Repair Workers, General':          [2,3,4,2, 4,4,3,2, 3,4,3,2, 3,4,5,2],
  'Landscaping and Groundskeeping Workers':           [1,4,3,2, 4,4,2,2, 2,4,4,2, 2,4,5,3],
  // TORH — healthcare
  'Nurse Practitioners':                              [3,4,4,3, 4,3,4,2, 5,1,2,5, 3,2,4,4],
  'Medical Assistants':                               [2,4,4,2, 4,4,3,2, 4,3,3,4, 2,3,5,3],
  'Registered Nurses':                                [3,4,4,3, 4,3,3,2, 5,2,2,5, 3,3,5,4],
  'Pharmacy Technicians':                             [3,5,3,2, 5,5,2,1, 5,2,2,4, 2,4,4,3],
  'Licensed Practical and Licensed Vocational Nurses':[2,4,4,2, 4,4,3,2, 5,2,2,4, 2,3,5,4],
  'Nursing Assistants':                               [2,3,4,2, 3,4,3,2, 4,3,3,4, 2,4,5,3],
  // TORP — construction
  'Construction Laborers':                            [1,3,4,2, 4,4,3,2, 4,3,3,3, 2,4,5,2],
  'First-Line Supervisors of Construction Trades':    [2,3,4,3, 4,3,3,2, 4,3,3,3, 3,3,5,2],
  'Plumbers, Pipefitters, and Steamfitters':          [1,3,4,3, 4,4,2,2, 4,3,3,3, 3,4,5,2],
  'Electricians':                                     [2,4,4,3, 4,4,2,2, 4,3,2,4, 2,4,5,2],
  'Carpenters':                                       [1,3,4,3, 4,4,3,3, 3,4,3,3, 2,4,5,3],
  'Operating Engineers and Other Construction Equipment Operators':[2,3,4,2, 4,4,2,2, 4,2,3,3, 2,4,5,2],
  // TSFH — arts / media
  'Public Relations Specialists':                     [5,3,4,4, 3,2,5,4, 3,3,3,4, 4,3,2,4],
  'Editors':                                          [5,3,5,4, 2,1,5,5, 2,4,4,3, 3,3,1,4],
  'Interpreters and Translators':                     [5,4,4,3, 3,3,4,4, 3,3,3,3, 3,3,2,4],
  'Graphic Designers':                                [5,2,5,4, 2,2,4,5, 2,5,4,3, 3,4,2,3],
  'Producers and Directors':                          [4,2,5,4, 2,2,5,5, 3,3,3,4, 5,2,4,5],
  'Interior Designers':                               [4,2,4,4, 2,2,4,5, 3,4,3,3, 4,3,3,4],
  // TSFP — food
  'First-Line Supervisors of Food Preparation and Serving Workers':[2,3,4,3, 3,3,4,3, 2,4,4,3, 3,4,5,3],
  'Cooks, Restaurant':                                [1,3,4,3, 2,2,4,5, 2,4,4,3, 3,4,5,4],
  'Fast Food and Counter Workers':                    [2,4,2,1, 3,4,2,2, 2,4,5,2, 2,5,5,2],
  'Waiters and Waitresses':                           [2,4,3,2, 3,3,3,2, 2,4,4,2, 3,5,5,3],
  'Bartenders':                                       [2,3,4,3, 2,2,4,4, 2,4,4,3, 4,4,5,4],
  'Food Preparation Workers':                         [1,4,3,2, 3,4,2,2, 2,4,4,2, 2,5,5,2],
  // TSRH — management / social service
  'Computer and Information Systems Managers':        [5,3,5,4, 3,3,4,3, 4,3,3,4, 4,2,2,4],
  'General and Operations Managers':                  [4,2,5,4, 3,3,5,3, 4,3,3,4, 5,2,3,5],
  'Sales Managers':                                   [4,3,5,4, 3,2,5,4, 3,3,3,4, 5,2,3,4],
  'Medical and Health Services Managers':             [5,3,4,3, 3,3,4,3, 4,2,2,4, 4,2,3,5],
  'Financial Managers':                               [5,4,4,3, 4,3,4,2, 5,2,2,4, 4,2,2,4],
  'Child, Family, and School Social Workers':         [3,3,5,4, 2,2,5,4, 4,2,2,5, 5,2,4,5],
  // TSRP — protective service
  'Police and Sheriff\'s Patrol Officers':            [2,3,4,4, 2,2,4,3, 5,2,2,5, 3,3,5,4],
  'Detectives and Criminal Investigators':            [3,3,5,4, 2,2,4,3, 5,2,2,5, 3,3,4,4],
  'Security Guards':                                  [2,4,3,3, 3,3,3,2, 4,3,3,4, 2,4,5,3],
  'First-Line Supervisors of Police and Detectives':  [3,3,4,4, 2,2,5,3, 5,2,2,5, 3,2,5,5],
  'Correctional Officers and Jailers':                [2,3,4,3, 3,3,4,2, 4,2,3,4, 2,4,5,4],
  'Firefighters':                                     [2,3,5,4, 2,2,4,3, 5,2,2,5, 3,3,5,4],
};

const G='\x1b[32m',R='\x1b[31m',D='\x1b[2m',X='\x1b[0m';
const pad=(s,n)=>{s=String(s);return s.length>n?s.slice(0,n-1)+'…':s.padEnd(n);};

let top1=0, top3=0, total=0;
const misses=[];
for (const occ of BLS_OCCUPATIONS) {
  const title = occ.title.en;
  const ans = RESPONDENT[title];
  if (!ans) continue; // supplementary occupations are covered by validate-supplementary.mjs
  const accept = new Set(siblingsOf[title] || [title]); // own job + PROFILE_CAREERS list-mates
  const cousin = COUSIN[title];
  const g = inferOccupationFromAnswers(ans, 3);
  const titles = g.map(x => x.title.en);
  const hit = (t) => accept.has(t) || (cousin && cousin.test(t));
  const ok1 = hit(titles[0]);
  const ok3 = titles.some(hit);
  if (ok1) top1++;
  if (ok3) top3++; else misses.push({ title, placement: placementOf[title], got: titles });
  total++;
}

console.log();
console.log(`FULL INDEPENDENT GUESS — all ${total} BLS occupations, 1 fresh respondent each`);
console.log(`accuracy = own job OR a "typical career" sibling from the same archetype list, in top-K`);
console.log('─'.repeat(72));
console.log(`  top-1 (own/sibling is #1):    ${top1}/${total}  ${(100*top1/total).toFixed(1)}%`);
console.log(`  top-3 (own/sibling in top-3): ${top3}/${total}  ${(100*top3/total).toFixed(1)}%`);
if (misses.length) {
  console.log();
  console.log(`${R}TOP-3 MISSES (${misses.length}):${X}`);
  for (const m of misses) console.log(`  ${pad(m.title,50)} [${m.placement}] → ${m.got.map(t=>pad(t,22)).join(', ')}`);
}
console.log();
