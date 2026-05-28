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

/**
 * SUPPLEMENTARY occupations — common jobs people self-identify as that are NOT
 * in the 96-job PROFILE_CAREERS set. These enrich the GUESS library only (they
 * have no archetype "typical careers" list on the result page). Each carries its
 * own realistic anchor; `near` is the acceptance regex used by the validator
 * (which occupation titles count as a correct guess for this job).
 *                  Q1 Q2 Q3 Q4 Q5 Q6 Q7 Q8 Q9 Q10 Q11 Q12 Q13 Q14 Q15 Q16
 */
export const SUPPLEMENTARY_OCCUPATIONS = [
  // ── Management (11) ──
  { en: 'Chief Executives', zh: '首席执行官', answers: [4,2,5,4, 3,2,5,4, 4,3,3,4, 5,2,3,5], near: /chief|executive|general and operations|operations manager|manager/i },
  { en: 'Marketing Managers', zh: '市场营销经理', answers: [5,3,4,4, 3,2,5,4, 3,3,4,3, 4,2,2,4], near: /marketing|manager|public relations|sales manager/i },
  { en: 'Human Resources Managers', zh: '人力资源经理', answers: [5,3,4,3, 3,3,4,3, 3,3,3,4, 4,2,3,4], near: /human resources|manager/i },
  { en: 'Construction Managers', zh: '建筑项目经理', answers: [3,3,4,3, 4,3,4,3, 4,3,3,4, 4,2,4,3], near: /construction|manager|operations|supervisor/i },
  { en: 'Architectural and Engineering Managers', zh: '建筑与工程经理', answers: [5,3,4,4, 4,3,4,3, 4,3,3,4, 4,2,3,3], near: /engineer|manager|architect/i },

  // ── Business & Financial (13) ──
  { en: 'Financial Analysts', zh: '金融分析师', answers: [5,4,3,3, 5,3,3,2, 3,4,4,2, 3,3,1,2], near: /financial|market research|management analyst|accountant|securities/i },
  { en: 'Personal Financial Advisors', zh: '理财顾问', answers: [5,4,3,3, 4,3,3,3, 3,4,3,3, 5,2,2,4], near: /financial|advisor|insurance|securities|sales/i },
  { en: 'Loan Officers', zh: '信贷专员', answers: [5,4,2,2, 5,4,2,2, 3,3,3,3, 4,3,2,3], near: /loan|financial|insurance|credit|sales agent/i },
  { en: 'Compliance Officers', zh: '合规官', answers: [5,4,3,2, 5,4,2,2, 4,2,2,4, 3,3,2,3], near: /compliance|auditor|accountant|inspector|officer/i },
  { en: 'Logisticians', zh: '物流分析师', answers: [5,4,2,2, 5,4,3,2, 3,4,4,2, 3,3,2,2], near: /logistic|operations|management analyst|business operation/i },

  // ── Computer & Mathematical (15) ──
  { en: 'Web Developers', zh: '网页开发工程师', answers: [5,4,3,3, 4,2,4,4, 2,5,4,2, 2,4,1,2], near: /web|software|developer|programmer|interface designer/i },
  { en: 'Computer Programmers', zh: '计算机程序员', answers: [5,4,3,3, 4,3,4,3, 3,4,4,2, 2,4,1,2], near: /programmer|software|developer|systems|web/i },
  { en: 'Information Security Analysts', zh: '信息安全分析师', answers: [5,4,3,3, 4,3,4,2, 4,3,3,3, 2,3,2,2], near: /security analyst|software|systems|network|information/i },
  { en: 'Database Administrators', zh: '数据库管理员', answers: [5,4,3,2, 5,4,3,2, 3,4,4,2, 2,4,1,2], near: /database|systems admin|network|software|programmer/i },
  { en: 'Web and Digital Interface Designers', zh: '网页与界面设计师', answers: [5,2,4,4, 2,2,4,5, 2,5,4,2, 3,3,1,3], near: /web|interface|designer|graphic|software/i },

  // ── Architecture, Engineering & Science (17/19) ──
  { en: 'Aerospace Engineers', zh: '航空航天工程师', answers: [5,4,4,4, 4,3,4,3, 5,2,2,3, 2,3,3,3], near: /aerospace|engineer|mechanical/i },
  { en: 'Chemical Engineers', zh: '化学工程师', answers: [5,4,4,3, 4,3,4,3, 5,2,2,3, 2,3,3,3], near: /chemical|engineer|scientist/i },
  { en: 'Surveyors', zh: '测量员', answers: [3,4,3,2, 5,4,3,2, 4,3,3,3, 3,3,4,2], near: /survey|engineer|technician|civil/i },
  { en: 'Chemists', zh: '化学家', answers: [5,3,4,4, 4,2,4,3, 4,4,3,3, 3,2,3,3], near: /chemist|scientist|engineer/i },
  { en: 'Biological Scientists', zh: '生物科学家', answers: [5,3,4,5, 4,2,4,3, 4,4,3,3, 3,2,3,3], near: /biolog|scientist|medical scientist|research/i },
  { en: 'Economists', zh: '经济学家', answers: [5,4,3,4, 4,2,4,3, 3,4,4,3, 3,2,1,3], near: /economist|scientist|analyst|statistician|research/i },
  { en: 'Statisticians', zh: '统计学家', answers: [5,4,3,3, 5,3,4,2, 3,4,4,2, 2,3,1,2], near: /statistic|data scien|economist|analyst/i },
  { en: 'Urban and Regional Planners', zh: '城市规划师', answers: [5,3,4,4, 3,2,4,4, 4,3,3,4, 3,2,3,3], near: /planner|urban|architect|engineer|scientist/i },
  { en: 'Psychologists', zh: '心理学家', answers: [4,3,5,4, 2,1,5,4, 4,3,2,5, 5,2,4,5], near: /psycholog|counsel|social worker|therap|scientist/i },

  // ── Community & Social Service (21) ──
  { en: 'Substance Abuse and Mental Health Counselors', zh: '心理健康咨询师', answers: [3,3,5,4, 1,1,5,4, 4,3,2,5, 5,2,4,5], near: /counsel|social worker|psycholog|therap|mental health/i },
  { en: 'Clergy', zh: '神职人员', answers: [2,2,5,4, 1,1,5,5, 3,3,2,5, 5,1,4,5], near: /clergy|social worker|counsel|director|teacher/i },

  // ── Education (25) ──
  { en: 'Librarians and Media Collections Specialists', zh: '图书馆员', answers: [5,4,3,2, 3,3,4,3, 2,4,4,3, 3,3,3,3], near: /librar|teacher|clerk|technician/i },
  { en: 'Teaching Assistants', zh: '助教', answers: [3,4,3,2, 3,3,4,3, 2,4,4,3, 3,4,5,3], near: /teaching assistant|teacher|childcare|preschool/i },

  // ── Arts, Design, Media (27) ──
  { en: 'Writers and Authors', zh: '作家', answers: [5,2,5,5, 1,1,5,5, 2,5,4,3, 4,2,1,4], near: /writer|author|editor|journalist|interpret/i },
  { en: 'News Reporters and Journalists', zh: '记者', answers: [5,3,4,4, 2,2,4,4, 3,3,3,4, 3,3,3,4], near: /report|journalist|news|editor|public relations|writer/i },
  { en: 'Photographers', zh: '摄影师', answers: [3,2,5,4, 2,1,5,5, 2,4,4,3, 4,3,4,4], near: /photograph|designer|producer|artist|video|interior/i },
  { en: 'Musicians and Singers', zh: '音乐家与歌手', answers: [2,2,5,4, 1,1,5,5, 2,4,4,4, 5,2,5,5], near: /musician|singer|artist|producer|director/i },
  { en: 'Actors', zh: '演员', answers: [2,2,5,4, 1,1,5,5, 2,4,4,4, 4,3,5,5], near: /actor|producer|director|musician/i },
  { en: 'Fashion Designers', zh: '时装设计师', answers: [5,2,5,4, 2,1,5,5, 2,5,4,3, 4,3,2,3], near: /fashion|designer|graphic|interior|producer/i },
  { en: 'Film and Video Editors', zh: '影视剪辑师', answers: [5,2,4,4, 2,2,4,5, 2,5,4,2, 3,3,1,3], near: /film|video|editor|producer|designer/i },

  // ── Healthcare Practitioners (29) ──
  { en: 'Physicians and Surgeons', zh: '医生与外科医生', answers: [3,4,5,4, 3,2,4,3, 5,1,1,5, 4,2,5,5], near: /physician|surgeon|nurse practitioner|medical scientist|dentist/i },
  { en: 'Dentists', zh: '牙医', answers: [3,4,5,3, 4,3,3,3, 5,1,2,5, 4,2,5,5], near: /dentist|physician|surgeon|nurse|hygienist/i },
  { en: 'Pharmacists', zh: '药剂师', answers: [4,5,3,2, 5,5,2,1, 5,2,1,5, 3,3,4,4], near: /pharmacist|pharmacy|nurse|physician|medical/i },
  { en: 'Physician Assistants', zh: '医师助理', answers: [3,4,4,3, 4,3,3,2, 5,2,2,5, 3,3,5,4], near: /physician assistant|nurse|medical|practitioner/i },
  { en: 'Physical Therapists', zh: '物理治疗师', answers: [3,4,5,3, 3,2,4,3, 4,3,2,5, 4,2,5,5], near: /physical therap|therap|nurse|trainer/i },
  { en: 'Occupational Therapists', zh: '职业治疗师', answers: [3,4,5,3, 3,2,4,3, 4,3,2,5, 4,2,5,5], near: /occupational therap|physical therap|therap|nurse/i },
  { en: 'Speech-Language Pathologists', zh: '言语病理师', answers: [4,4,4,3, 3,2,4,3, 4,3,2,4, 4,2,4,5], near: /speech|patholog|therap|nurse/i },
  { en: 'Veterinarians', zh: '兽医', answers: [3,4,5,3, 4,3,3,3, 5,2,2,4, 4,2,5,4], near: /veterinar|physician|surgeon|animal|nurse/i },
  { en: 'Dental Hygienists', zh: '口腔卫生师', answers: [3,4,4,2, 4,4,3,2, 4,2,3,4, 3,3,5,4], near: /dental|hygienist|dentist|nurse|assistant/i },
  { en: 'Dietitians and Nutritionists', zh: '营养师', answers: [4,4,4,3, 3,2,4,3, 3,3,3,4, 4,3,4,4], near: /dietit|nutrition|therap|nurse|counsel/i },
  { en: 'Radiologic Technologists', zh: '放射技师', answers: [4,4,3,2, 5,4,3,2, 4,2,3,4, 2,4,5,3], near: /radiolog|technologist|technician|nurse|medical/i },
  { en: 'Emergency Medical Technicians and Paramedics', zh: '急救医护员', answers: [2,4,4,3, 3,3,3,2, 5,2,2,4, 3,3,5,4], near: /emergency medical|paramedic|nurse|firefighter|medical assistant/i },

  // ── Healthcare Support (31) ──
  { en: 'Dental Assistants', zh: '牙科助理', answers: [3,4,3,2, 4,4,3,2, 4,3,3,4, 2,4,5,3], near: /dental assistant|dental|hygienist|medical assistant|nurse/i },
  { en: 'Home Health and Personal Care Aides', zh: '居家护理员', answers: [1,3,4,3, 2,3,3,3, 4,3,3,4, 3,4,5,4], near: /home health|personal care|aide|nursing assistant|childcare/i },
  { en: 'Massage Therapists', zh: '按摩治疗师', answers: [1,3,5,2, 2,2,3,4, 3,4,4,3, 5,3,5,4], near: /massage|therap|personal|hairdress|fitness/i },

  // ── Sales (41) ──
  { en: 'Real Estate Sales Agents', zh: '房地产经纪人', answers: [4,3,4,3, 3,2,4,3, 3,4,3,3, 5,2,3,4], near: /real estate|sales|insurance|agent/i },
  { en: 'Sales Engineers', zh: '销售工程师', answers: [5,4,4,3, 4,3,3,3, 3,4,3,3, 4,3,2,3], near: /sales engineer|engineer|sales/i },
  { en: 'Securities and Financial Services Sales Agents', zh: '证券经纪人', answers: [5,4,3,3, 4,3,3,2, 3,4,3,3, 4,3,1,3], near: /securities|financial|sales|advisor/i },
  { en: 'Travel Agents', zh: '旅行顾问', answers: [5,4,2,2, 4,4,2,2, 2,4,4,2, 4,4,2,3], near: /travel|agent|sales|reservation|clerk/i },

  // ── Installation, Maintenance & Repair (49) ──
  { en: 'Automotive Service Technicians and Mechanics', zh: '汽车维修技师', answers: [2,3,4,3, 4,4,2,2, 4,4,3,3, 3,4,5,2], near: /automotive|mechanic|repair|technician|maintenance/i },
  { en: 'Heating, Air Conditioning, and Refrigeration Mechanics', zh: '暖通空调技工', answers: [2,3,4,3, 4,4,2,2, 4,3,3,3, 3,4,5,2], near: /heating|air conditioning|mechanic|maintenance|repair|hvac/i },
  { en: 'Aircraft Mechanics and Service Technicians', zh: '飞机维修技师', answers: [3,4,4,3, 5,4,2,2, 5,2,2,4, 2,4,5,2], near: /aircraft|mechanic|technician|maintenance|repair/i },
  { en: 'Industrial Machinery Mechanics', zh: '工业机械维修工', answers: [2,4,4,2, 5,4,2,2, 4,3,3,3, 2,4,5,2], near: /industrial|machinery|mechanic|maintenance|repair|machinist/i },

  // ── Transportation (53) ──
  { en: 'Airline Pilots, Copilots, and Flight Engineers', zh: '飞行员', answers: [4,4,4,3, 5,4,2,2, 5,1,2,4, 2,3,5,3], near: /pilot|flight|aircraft/i },
  { en: 'Flight Attendants', zh: '空乘人员', answers: [2,4,2,2, 3,4,3,2, 4,3,3,3, 3,4,5,3], near: /flight attendant|attendant|waiter|recreation/i },
  { en: 'Bus Drivers, Transit and Intercity', zh: '公交车司机', answers: [2,4,2,2, 4,4,2,1, 4,3,3,3, 2,4,5,2], near: /bus driver|driver|truck|transit|tractor/i },
  { en: 'Couriers and Delivery Drivers', zh: '快递配送员', answers: [3,4,2,1, 4,4,2,1, 3,4,4,2, 2,5,5,2], near: /courier|delivery|driver|truck|laborer|material mover/i },

  // ── Farming (45) ──
  { en: 'Farmers, Ranchers, and Agricultural Managers', zh: '农场主与农业经理', answers: [2,3,4,3, 4,3,3,3, 4,3,4,2, 3,3,5,2], near: /farmer|rancher|agricultural|landscap|operating engineer/i },

  // ── Food (35) ──
  { en: 'Chefs and Head Cooks', zh: '主厨', answers: [1,3,5,3, 2,2,4,5, 3,4,4,3, 4,3,5,4], near: /chef|head cook|cook|food|supervisor/i },
];

