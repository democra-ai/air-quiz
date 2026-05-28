/**
 * Hand-authored REALISTIC 16-answer vectors for every BLS occupation in
 * PROFILE_CAREERS, keyed by the EXACT English title. These are what a real
 * worker in each job would plausibly answer — authored from the job's nature,
 * NOT from its archetype template. gen-occupations.mjs anchors each occupation
 * here and COMPUTES its archetype from the vector (self-consistent), so the
 * nearest-neighbour guesser lands realistic answers on the right occupation.
 *
 * Question semantics (1..5), with [rev] = reverse-scored:
 *   Q1  digital        1 all-physical        → 5 all-digital
 *   Q2  book-learnable 1 <20%                → 5 >90%
 *   Q3  tacit   [rev]  1 none/manual         → 5 all "feel"
 *   Q4  novelty [rev]  1 same daily          → 5 every project uncharted
 *   Q5  measurable     1 purely subjective   → 5 clear KPIs
 *   Q6  convergent     1 everyone differs    → 5 identical results
 *   Q7  goalclar[rev]  1 always clear specs  → 5 "you figure it out"
 *   Q8  taste   [rev]  1 none                → 5 taste IS the edge
 *   Q9  errstakes[rev] 1 just redo           → 5 endanger lives
 *   Q10 reversible     1 one-shot            → 5 constant experiment
 *   Q11 reg-free       1 legally prohibited  → 5 policy encourages AI
 *   Q12 distrust [rev] 1 nobody cares who    → 5 public strongly opposes
 *   Q13 relation[rev]  1 cheapest wins       → 5 clients want only ME
 *   Q14 replaceable    1 6+ months/never     → 5 replace immediately
 *   Q15 physical [rev] 1 fully remote        → 5 must be bodily present
 *   Q16 humanprem[rev] 1 don't care if AI    → 5 feel deceived
 */

export const REALISTIC_ANSWERS = {
  // ── EOFP cluster (office & admin) ──
  'Customer Service Representatives':                 [5,4,2,2, 4,3,3,2, 2,4,4,2, 3,4,1,2],
  'Office Clerks, General':                           [5,4,2,1, 5,5,2,1, 2,4,5,2, 2,5,1,2],
  'Secretaries and Administrative Assistants':        [5,4,2,2, 4,4,2,2, 2,4,4,2, 2,5,2,2],
  'Receptionists and Information Clerks':             [4,4,2,1, 4,4,2,1, 2,4,4,2, 3,5,3,2],
  'Medical Secretaries and Administrative Assistants':[5,4,2,2, 5,4,2,1, 3,4,3,2, 2,4,2,2],
  'Bookkeeping, Accounting, and Auditing Clerks':     [5,5,2,1, 5,5,1,1, 3,3,4,2, 2,5,1,2],

  // ── EOFH cluster (sales / relationship) ──
  'Sales Representatives of Services':                [4,3,3,3, 3,3,3,3, 2,4,4,3, 4,3,3,4],
  'First-Line Supervisors of Retail Sales Workers':  [4,3,4,3, 4,3,4,3, 2,4,4,3, 4,3,4,3],
  'Counter and Rental Clerks':                        [4,4,2,2, 4,4,2,2, 2,4,4,2, 3,4,4,3],
  'Retail Salespersons':                              [3,4,2,2, 3,4,2,2, 2,4,4,2, 4,4,4,3],
  'Insurance Sales Agents':                           [4,3,3,3, 4,3,3,2, 3,4,4,3, 4,3,3,4],
  'Cashiers':                                         [3,4,2,1, 4,5,2,1, 2,4,4,2, 3,5,4,2],

  // ── EORH cluster (business & financial — explicit/objective, regulated, trust) ──
  'Market Research Analysts and Marketing Specialists':[5,3,3,3, 3,2,4,4, 3,4,4,3, 3,3,2,3],
  'Human Resources Specialists':                      [5,3,3,3, 3,3,3,3, 3,3,3,3, 4,3,2,3],
  'Business Operations Specialists':                  [5,4,3,3, 4,4,3,2, 3,3,3,3, 3,3,1,3],
  'Management Analysts':                              [5,4,3,3, 5,3,3,2, 3,4,4,3, 3,3,1,2],
  'Project Management Specialists':                   [5,3,4,3, 4,3,4,3, 3,4,4,3, 4,3,2,3],
  'Accountants and Auditors':                         [5,5,3,2, 5,4,2,2, 4,3,2,4, 3,3,1,3],

  // ── EORP cluster (production — explicit/objective, rigid, product, on-site) ──
  'First-Line Supervisors of Production Workers':     [3,4,3,2, 5,4,3,2, 4,2,3,3, 3,3,5,2],
  'Inspectors, Testers, Sorters, Samplers, and Weighers':[3,4,3,2, 5,5,2,2, 4,2,3,3, 2,4,5,2],
  'Packaging and Filling Machine Operators':          [3,4,2,1, 5,5,2,1, 3,2,4,2, 2,5,5,2],
  'Welders, Cutters, Solderers, and Brazers':         [2,4,3,2, 5,4,2,2, 4,2,3,3, 2,4,5,2],
  'Machinists':                                       [3,4,3,2, 5,4,2,2, 4,2,3,3, 2,4,5,2],
  'Bakers':                                           [2,4,3,2, 4,4,2,3, 3,3,4,2, 2,4,5,3],

  // ── ESFH cluster (education) ──
  'Health Specialties Teachers, Postsecondary':       [4,3,4,4, 2,2,4,4, 3,3,3,4, 4,2,3,4],
  'Middle School Teachers':                           [4,4,3,3, 2,2,4,3, 3,3,3,4, 4,3,4,4],
  'Secondary School Teachers':                        [4,4,3,3, 2,2,4,3, 3,3,3,4, 4,3,4,4],
  'Elementary School Teachers':                       [3,4,4,3, 2,2,4,3, 3,3,3,4, 4,3,4,4],
  'Self-Enrichment Teachers':                         [4,3,4,3, 2,2,4,4, 2,4,4,4, 4,3,4,4],
  'Preschool Teachers':                               [2,3,4,3, 1,2,4,3, 3,3,3,4, 4,3,5,4],

  // ── ESFP cluster (computer / software) ──
  'Software Developers':                              [5,4,4,4, 3,2,4,3, 3,4,4,2, 2,4,1,2],
  'Software Quality Assurance Analysts and Testers':  [5,4,3,3, 4,3,4,2, 3,4,4,2, 2,4,1,2],
  'Computer User Support Specialists':                [5,4,2,2, 4,4,3,2, 2,4,4,2, 3,4,2,2],
  'Data Scientists':                                  [5,4,3,3, 4,3,4,2, 3,4,4,2, 2,4,1,2],
  'Computer Systems Analysts':                        [5,4,3,3, 4,3,4,3, 3,4,4,2, 3,4,1,2],
  'Network and Computer Systems Administrators':      [5,4,3,3, 4,4,3,2, 3,4,4,2, 2,4,2,2],

  // ── ESRH cluster (legal) ──
  'Administrative Law Judges':                        [5,4,4,3, 3,3,3,3, 4,2,2,4, 3,3,3,4],
  'Arbitrators, Mediators, and Conciliators':         [4,3,4,3, 2,2,4,4, 3,3,3,4, 5,2,3,5],
  'Judicial Law Clerks':                              [5,4,3,3, 3,3,3,3, 3,3,3,4, 3,3,2,3],
  'Judges, Magistrate Judges, and Magistrates':       [5,4,4,3, 3,3,3,3, 4,2,2,5, 4,2,3,5],
  'Paralegals and Legal Assistants':                  [5,4,3,2, 4,4,3,2, 3,3,3,3, 2,4,2,3],
  'Lawyers':                                          [5,4,4,4, 3,2,4,3, 4,2,2,4, 4,2,3,4],

  // ── ESRP cluster (engineering / science) ──
  'Electrical Engineers':                             [5,4,4,3, 4,3,3,3, 4,3,3,3, 2,3,3,3],
  'Architects, Except Landscape and Naval':           [5,3,4,4, 3,2,4,5, 4,3,3,3, 3,3,3,3],
  'Mechanical Engineers':                             [5,4,4,3, 4,3,3,3, 4,3,3,3, 2,3,3,3],
  'Civil Engineers':                                  [5,4,4,3, 4,3,3,3, 4,2,3,4, 3,3,3,3],
  'Industrial Engineers':                             [5,4,4,3, 4,3,3,3, 3,3,4,3, 3,3,3,3],
  'Medical Scientists, Except Epidemiologists':       [5,3,4,5, 4,2,4,3, 4,4,3,3, 3,2,2,3],

  // ── TOFH cluster (personal care) ──
  'Amusement and Recreation Attendants':              [2,4,3,2, 3,3,3,3, 2,4,4,3, 3,4,5,3],
  'Hairdressers, Hairstylists, and Cosmetologists':   [1,3,4,2, 3,3,3,4, 2,4,4,2, 5,3,5,4],
  'Manicurists and Pedicurists':                      [1,3,4,2, 3,3,3,3, 2,4,4,2, 5,3,5,4],
  'Exercise Trainers and Group Fitness Instructors':  [2,3,4,3, 3,2,3,3, 2,4,4,3, 4,3,5,4],
  'Childcare Workers':                                [2,3,4,3, 2,3,3,3, 4,3,3,4, 4,3,5,4],
  'Animal Caretakers':                                [2,3,4,3, 3,3,3,3, 3,4,4,3, 3,4,5,3],

  // ── TOFP cluster (transport / labor — tacit/physical, objective, flexible, product) ──
  'Laborers and Freight, Stock, and Material Movers': [1,3,3,2, 4,4,2,1, 3,4,4,2, 2,5,5,2],
  'Heavy and Tractor-Trailer Truck Drivers':          [2,3,4,2, 4,4,2,1, 3,3,4,3, 2,4,5,2],
  'Stockers and Order Fillers':                       [1,3,3,2, 4,5,2,1, 2,4,4,2, 2,5,5,2],
  'Janitors and Cleaners':                            [1,3,3,2, 4,4,2,2, 2,4,4,2, 2,5,5,2],
  'Maintenance and Repair Workers, General':          [2,3,4,2, 4,4,2,2, 3,4,4,2, 3,4,5,2],
  'Landscaping and Groundskeeping Workers':           [1,3,3,2, 4,4,2,2, 2,4,4,2, 2,5,5,2],

  // ── TORH cluster (healthcare — tacit/hands-on, objective, rigid life-stakes, human) ──
  'Nurse Practitioners':                              [3,4,4,3, 4,3,3,2, 5,1,2,5, 3,2,5,4],
  'Medical Assistants':                               [2,3,4,2, 4,4,3,2, 4,3,3,4, 2,3,5,3],
  'Registered Nurses':                                [2,4,4,3, 4,3,3,2, 5,2,2,5, 3,3,5,4],
  'Pharmacy Technicians':                             [3,4,4,2, 5,5,2,1, 5,2,2,5, 2,3,4,3],
  'Licensed Practical and Licensed Vocational Nurses':[2,3,4,2, 4,4,2,2, 5,2,2,4, 2,3,5,3],
  'Nursing Assistants':                               [2,3,4,2, 3,4,3,2, 4,3,3,4, 2,3,5,3],

  // ── TORP cluster (construction — tacit/physical, objective, rigid safety, product) ──
  'Construction Laborers':                            [1,3,4,2, 4,4,2,2, 4,3,3,3, 2,4,5,2],
  'First-Line Supervisors of Construction Trades':    [2,3,4,3, 4,3,3,2, 4,3,3,3, 2,4,5,2],
  'Plumbers, Pipefitters, and Steamfitters':          [1,3,4,3, 4,4,2,2, 4,3,3,3, 2,4,5,2],
  'Electricians':                                     [1,3,4,3, 4,4,2,2, 4,3,2,4, 2,4,5,2],
  'Carpenters':                                       [1,3,4,3, 4,4,2,3, 4,3,3,3, 2,4,5,2],
  'Operating Engineers and Other Construction Equipment Operators':[2,3,4,2, 4,4,2,2, 4,3,3,3, 2,4,5,2],

  // ── TSFH cluster (arts / media) ──
  'Public Relations Specialists':                     [5,3,4,4, 3,2,4,4, 3,3,3,4, 4,3,2,4],
  'Editors':                                          [5,3,5,4, 2,2,4,5, 2,4,4,3, 3,3,1,4],
  'Interpreters and Translators':                     [5,3,4,3, 3,3,3,4, 3,3,3,3, 3,3,2,4],
  'Graphic Designers':                                [5,2,4,4, 2,2,4,5, 2,5,4,3, 3,3,1,3],
  'Producers and Directors':                          [4,2,5,4, 2,2,4,5, 3,3,3,4, 5,2,3,5],
  'Interior Designers':                               [4,2,4,4, 2,2,4,5, 3,4,4,3, 4,3,3,4],

  // ── TSFP cluster (food) ──
  'First-Line Supervisors of Food Preparation and Serving Workers':[2,3,4,3, 3,3,3,3, 2,4,4,3, 3,3,5,3],
  'Cooks, Restaurant':                                [1,3,5,3, 2,2,3,5, 2,4,4,3, 2,4,5,3],
  'Fast Food and Counter Workers':                    [2,4,2,2, 3,4,2,2, 2,4,4,2, 2,5,5,2],
  'Waiters and Waitresses':                           [2,4,3,2, 3,3,3,2, 2,4,4,2, 3,4,5,3],
  'Bartenders':                                       [2,3,4,3, 2,2,3,4, 2,4,4,3, 4,3,5,4],
  'Food Preparation Workers':                         [1,4,3,2, 3,4,2,2, 2,4,4,2, 2,5,5,2],

  // ── TSRH cluster (management / social service) ──
  'Computer and Information Systems Managers':        [5,3,5,4, 3,3,4,3, 4,3,3,4, 4,2,3,4],
  'General and Operations Managers':                  [4,2,5,4, 3,3,4,3, 4,3,3,4, 5,2,3,5],
  'Sales Managers':                                   [4,2,5,4, 3,2,4,4, 3,3,3,4, 5,2,3,5],
  'Medical and Health Services Managers':             [5,3,4,4, 3,3,4,3, 4,2,3,4, 4,2,3,4],
  'Financial Managers':                               [5,4,4,3, 4,3,4,3, 4,2,2,4, 4,2,2,4],
  'Child, Family, and School Social Workers':         [3,3,5,4, 2,2,4,4, 4,2,2,5, 4,2,4,5],

  // ── TSRP cluster (protective service) ──
  'Police and Sheriff\'s Patrol Officers':            [2,3,4,4, 2,2,4,3, 5,2,2,5, 3,3,5,4],
  'Detectives and Criminal Investigators':            [3,3,4,4, 2,2,4,3, 5,2,2,5, 3,3,4,4],
  'Security Guards':                                  [2,4,3,3, 3,3,3,2, 4,3,3,4, 2,4,5,3],
  'First-Line Supervisors of Police and Detectives':  [3,3,4,4, 2,2,4,3, 5,2,2,5, 3,3,5,4],
  'Correctional Officers and Jailers':                [2,3,4,3, 3,3,3,2, 4,2,3,4, 2,4,5,3],
  'Firefighters':                                     [2,3,4,4, 2,2,4,3, 5,2,2,5, 3,3,5,4],
};
