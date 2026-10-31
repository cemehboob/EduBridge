import { AgeCohortId } from '../types';

export interface CohortQuizQuestion {
  id: string;
  cohort: AgeCohortId;
  educationLevel: string;
  word: string;
  phonetic?: string;
  category: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  audioPrompt: string;
  praise: string;
}

export const cohortQuizCategories: {
  id: AgeCohortId;
  name: string;
  ageRange: string;
  badge: string;
  icon: string;
  description: string;
  defaultModeName: string;
}[] = [
  {
    id: 'early',
    name: 'Little Explorers',
    ageRange: 'Ages 5–8',
    badge: 'Early Primary & Phonics',
    icon: '🧸',
    description: 'Sight words, phonics letter sounds, and cheerful animal meanings with zero stress and stars.',
    defaultModeName: 'Sight Word & Phonics Play'
  },
  {
    id: 'junior',
    name: 'Junior Scholars',
    ageRange: 'Ages 9–14',
    badge: 'Middle School STEM',
    icon: '🎒',
    description: 'Earth science, physics, biology concepts, and space vocabulary with inquiry explanations.',
    defaultModeName: 'Science & Inquiry Terms'
  },
  {
    id: 'academy',
    name: 'Academy & Exams',
    ageRange: 'Ages 15–24',
    badge: 'High School & College Prep',
    icon: '🎓',
    description: 'High-density academic lexicon, IELTS/SAT collocations, and formal argument vocabulary.',
    defaultModeName: 'IELTS & Academic Lexicon'
  },
  {
    id: 'pro',
    name: 'Professional Fluency',
    ageRange: 'Ages 25–54',
    badge: 'Career & Executive',
    icon: '💼',
    description: 'Executive diplomacy, boardroom idioms, negotiation phrasing, and workplace clarity.',
    defaultModeName: 'Corporate Diplomacy'
  },
  {
    id: 'senior',
    name: 'Golden Age',
    ageRange: 'Ages 55+',
    badge: 'Lifelong Learning & Vitality',
    icon: '🌿',
    description: 'Gentle semantic associations, sensory memory recall, and everyday digital safety defense.',
    defaultModeName: 'Cognitive Vitality & Scam Defense'
  }
];

export const cohortQuizQuestions: CohortQuizQuestion[] = [
  // ==========================================
  // 1. AGES 5-8: EARLY PRIMARY & PHONICS
  // ==========================================
  {
    id: 'eq1',
    cohort: 'early',
    educationLevel: 'Early Primary & Phonics (Ages 5–8)',
    word: 'CAT',
    phonetic: '/kæt/',
    category: 'Sight Words & Animals',
    prompt: 'What is a CAT?',
    options: [
      'A furry pet that purrs and catches mice 🐱',
      'A huge ocean animal with fins 🐋',
      'A shiny metal car with four wheels 🚗',
      'A tall wooden tree with green leaves 🌳'
    ],
    correctAnswer: 'A furry pet that purrs and catches mice 🐱',
    explanation: 'Cats are friendly pets with whiskers, soft fur, and gentle purrs!',
    audioPrompt: 'What is a cat? A furry pet that purrs!',
    praise: '⭐ Superstar! You recognized the word CAT!'
  },
  {
    id: 'eq2',
    cohort: 'early',
    educationLevel: 'Early Primary & Phonics (Ages 5–8)',
    word: 'SUN',
    phonetic: '/sʌn/',
    category: 'Nature & Sight Words',
    prompt: 'Which emoji shows the SUN in the bright blue daytime sky?',
    options: ['☀️ Bright Sun', '🌙 Silver Moon', '🌧️ Rainy Cloud', '❄️ Cold Snowflake'],
    correctAnswer: '☀️ Bright Sun',
    explanation: 'The sun warms the Earth and gives daylight to flowers and trees.',
    audioPrompt: 'The sun shines brightly in the daytime sky!',
    praise: '🌟 Wonderful! You know the warm daytime sun!'
  },
  {
    id: 'eq3',
    cohort: 'early',
    educationLevel: 'Early Primary & Phonics (Ages 5–8)',
    word: 'SHIP',
    phonetic: '/ʃɪp/',
    category: 'Phonics Blends (SH)',
    prompt: 'The word "SHIP" starts with S and H. What sound do they make together?',
    options: [
      '/ʃ/ - Quiet like a whisper: "Shhh!"',
      '/tʃ/ - Like a train chime: "Choo-choo!"',
      '/k/ - Hard sound like clicking sticks',
      '/z/ - Buzzing sound like a bumblebee'
    ],
    correctAnswer: '/ʃ/ - Quiet like a whisper: "Shhh!"',
    explanation: 'S and H combine to make the quiet gentle /ʃ/ sound as in Ship, Shoe, and Shell.',
    audioPrompt: 'S and H say shhh! Ship!',
    praise: '🎉 Excellent phonics! You mastered the SH blend!'
  },
  {
    id: 'eq4',
    cohort: 'early',
    educationLevel: 'Early Primary & Phonics (Ages 5–8)',
    word: 'BIRD',
    phonetic: '/bɜːrd/',
    category: 'Sentence Fill',
    prompt: 'Complete the sentence: "The colorful ______ built a cozy nest in the tree."',
    options: ['bird 🐦', 'car 🚙', 'table 🪑', 'book 📖'],
    correctAnswer: 'bird 🐦',
    explanation: 'Birds build nests with twigs and feathers to keep their eggs warm.',
    audioPrompt: 'The colorful bird built a cozy nest!',
    praise: '⭐ Great reading! Birds live safely in nests!'
  },
  {
    id: 'eq5',
    cohort: 'early',
    educationLevel: 'Early Primary & Phonics (Ages 5–8)',
    word: 'STAR',
    phonetic: '/stɑːr/',
    category: 'Sight Words & Space',
    prompt: 'When do we usually see bright twinkling STARS?',
    options: [
      'At night in the dark sky ⭐',
      'Under the soil inside a garden 🥕',
      'Swimming deep underwater 🐟',
      'Only during a snowstorm ⛄'
    ],
    correctAnswer: 'At night in the dark sky ⭐',
    explanation: 'Stars twinkle high above us in the dark night sky!',
    audioPrompt: 'Stars twinkle in the nighttime sky!',
    praise: '✨ Brilliant job! Twinkle, twinkle, little star!'
  },
  {
    id: 'eq6',
    cohort: 'early',
    educationLevel: 'Early Primary & Phonics (Ages 5–8)',
    word: 'FISH',
    phonetic: '/fɪʃ/',
    category: 'Phonics & Sea Animals',
    prompt: 'Which animal uses fins and gills to swim fast through water? 🌊',
    options: ['fish 🐠', 'dog 🐕', 'horse 🐎', 'rabbit 🐇'],
    correctAnswer: 'fish 🐠',
    explanation: 'Fish live in water and use their fins to swim gracefully!',
    audioPrompt: 'A fish swims in water with its shiny fins!',
    praise: '🐟 Splash-tastic! You got the right sea creature!'
  },

  // ==========================================
  // 2. AGES 9-14: JUNIOR SCHOLARS (MIDDLE SCHOOL STEM)
  // ==========================================
  {
    id: 'jq1',
    cohort: 'junior',
    educationLevel: 'Elementary & Middle School (Ages 9–14)',
    word: 'PHOTOSYNTHESIS',
    phonetic: '/ˌfoʊ.toʊˈsɪn.θə.sɪs/',
    category: 'Life Sciences',
    prompt: 'What is the primary biological function of PHOTOSYNTHESIS in green plants?',
    options: [
      'Converting sunlight, carbon dioxide, and water into glucose energy and oxygen',
      'Filtering toxic mineral salts out of ocean water',
      'Freezing water droplets during winter dormancy',
      'Attracting predatory insects to consume pollen'
    ],
    correctAnswer: 'Converting sunlight, carbon dioxide, and water into glucose energy and oxygen',
    explanation: 'Chlorophyll in plant chloroplasts captures solar photons to synthesize chemical sugars while releasing breathable oxygen.',
    audioPrompt: 'Photosynthesis converts sunlight into glucose and oxygen.',
    praise: '🌱 Outstanding scientific knowledge! Photosynthesis sustains Earth’s biosphere.'
  },
  {
    id: 'jq2',
    cohort: 'junior',
    educationLevel: 'Elementary & Middle School (Ages 9–14)',
    word: 'BIOLUMINESCENCE',
    phonetic: '/ˌbaɪ.oʊˌluː.mɪˈnes.əns/',
    category: 'Marine Biology',
    prompt: 'How is cold biological light produced during BIOLUMINESCENCE in deep-sea creatures?',
    options: [
      'Through a biochemical reaction where luciferase oxidizes luciferin with near-zero heat loss',
      'By absorbing electricity from lightning strikes on the water surface',
      'By rubbing fish scales together to create friction sparks',
      'By trapping radioactive nuclear minerals from ocean vents'
    ],
    correctAnswer: 'Through a biochemical reaction where luciferase oxidizes luciferin with near-zero heat loss',
    explanation: 'Luciferase catalyzes the oxidation of luciferin, creating efficient light with virtually no thermal waste.',
    audioPrompt: 'Bioluminescence is cold living light generated by luciferase and luciferin.',
    praise: '💡 Fantastic inquiry! Deep-sea bioluminescence is nearly 100% thermally efficient.'
  },
  {
    id: 'jq3',
    cohort: 'junior',
    educationLevel: 'Elementary & Middle School (Ages 9–14)',
    word: 'VELOCITY',
    phonetic: '/vəˈlɒs.ə.ti/',
    category: 'Physical Science',
    prompt: 'In physics, what crucial element distinguishes VELOCITY from simple speed?',
    options: [
      'Velocity specifies both speed AND the direction of motion (vector quantity)',
      'Velocity only applies to aircraft in outer space',
      'Velocity is always measured in miles per gallon',
      'Speed can never change, whereas velocity is always zero'
    ],
    correctAnswer: 'Velocity specifies both speed AND the direction of motion (vector quantity)',
    explanation: 'Speed is a scalar quantity (e.g. 50 km/h), while velocity is a vector that includes direction (e.g. 50 km/h due North).',
    audioPrompt: 'Velocity is speed with a specified direction.',
    praise: '🚀 Sharp physics reasoning! You know vector from scalar!'
  },
  {
    id: 'jq4',
    cohort: 'junior',
    educationLevel: 'Elementary & Middle School (Ages 9–14)',
    word: 'ANTICYCLONIC',
    phonetic: '/ˌæn.ti.saɪˈklɒn.ɪk/',
    category: 'Atmospheric Science',
    prompt: 'Why is Jupiter’s Great Red Spot classified as an ANTICYCLONIC storm system?',
    options: [
      'It has high atmospheric pressure at its center and rotates opposite to cyclone systems',
      'It is completely frozen into solid carbon dioxide ice',
      'It was caused by a meteor collision that permanently cracked the crust',
      'It only occurs during solar eclipses'
    ],
    correctAnswer: 'It has high atmospheric pressure at its center and rotates opposite to cyclone systems',
    explanation: 'Anticyclones feature high pressure centers that spin counter-clockwise in the southern hemisphere.',
    audioPrompt: 'An anticyclonic storm features high atmospheric pressure at its core.',
    praise: '🪐 Superb astronomy mastery! Jupiter’s vortex is an anticyclonic giant.'
  },
  {
    id: 'jq5',
    cohort: 'junior',
    educationLevel: 'Elementary & Middle School (Ages 9–14)',
    word: 'REFRACTION',
    phonetic: '/rɪˈfræk.ʃən/',
    category: 'Optics & Physics',
    prompt: 'Why does a straight pencil appear bent when partially placed in a glass cup of water?',
    options: [
      'Light waves bend as they pass from less dense air into denser water (Refraction)',
      'The water permanently twists the physical wood of the pencil',
      'The pencil absorbs all electromagnetic spectrum waves',
      'Glass prevents light from traveling in straight lines'
    ],
    correctAnswer: 'Light waves bend as they pass from less dense air into denser water (Refraction)',
    explanation: 'Refraction is the change in direction and speed of a wave passing from one medium to another of different optical density.',
    audioPrompt: 'Light waves bend through water due to refraction.',
    praise: '🔬 Brilliant optics understanding! Refraction creates rainbows and lenses.'
  },

  // ==========================================
  // 3. AGES 15-24: ACADEMY & HIGH-STAKES EXAMS
  // ==========================================
  {
    id: 'aq1',
    cohort: 'academy',
    educationLevel: 'High School & College Prep (Ages 15–24)',
    word: 'UBIQUITOUS',
    phonetic: '/juːˈbɪk.wɪ.təs/',
    category: 'IELTS Academic Lexicon',
    prompt: 'In academic writing, what is the precise meaning of UBIQUITOUS?',
    options: [
      'Present, appearing, or found everywhere simultaneously; omnipresent',
      'Extremely fragile and easily shattered under physical impact',
      'Relating to ancient philosophical theories before the Renaissance',
      'Uncertain or dubious in empirical scientific validity'
    ],
    correctAnswer: 'Present, appearing, or found everywhere simultaneously; omnipresent',
    explanation: 'Ubiquitous describes phenomena that permeate modern life: "Smartphones have become ubiquitous across global demographics."',
    audioPrompt: 'Ubiquitous means present or found everywhere.',
    praise: '🎯 Band 9 Lexical Precision! Excellent academic vocabulary.'
  },
  {
    id: 'aq2',
    cohort: 'academy',
    educationLevel: 'High School & College Prep (Ages 15–24)',
    word: 'MITIGATE',
    phonetic: '/ˈmɪt.ɪ.ɡeɪt/',
    category: 'High-Stakes Argumentation',
    prompt: 'Which sentence utilizes "MITIGATE" in an authentic formal academic register?',
    options: [
      'Renewable subsidies mitigate the socioeconomic fallout of carbon emissions.',
      'The engine mitigated to 120 miles per hour on the highway.',
      'The researcher mitigated a brand new chemical element in the lab.',
      'The book was so exciting that it mitigated throughout the entire class.'
    ],
    correctAnswer: 'Renewable subsidies mitigate the socioeconomic fallout of carbon emissions.',
    explanation: 'Mitigate means to make less severe, serious, or painful: to alleviate or attenuate adverse consequences.',
    audioPrompt: 'To mitigate means to make less severe or serious.',
    praise: '📝 Flawless academic register! A staple verb for Task 2 essays.'
  },
  {
    id: 'aq3',
    cohort: 'academy',
    educationLevel: 'High School & College Prep (Ages 15–24)',
    word: 'JUXTAPOSITION',
    phonetic: '/ˌdʒʌk.stə.pəˈzɪʃ.ən/',
    category: 'Literary & Critical Analysis',
    prompt: 'What rhetorical effect is achieved through JUXTAPOSITION in academic discourse?',
    options: [
      'Placing two contrasting concepts side-by-side to highlight their differences',
      'Repeating the same consonant sound at the start of adjacent words',
      'Deleting transitional words to speed up reading speed',
      'Quoting a dictionary definition at the start of every paragraph'
    ],
    correctAnswer: 'Placing two contrasting concepts side-by-side to highlight their differences',
    explanation: 'Juxtaposition illuminates comparative nuances: "The juxtaposition of extreme technological wealth with rural poverty underscores systemic inequality."',
    audioPrompt: 'Juxtaposition is placing two contrasting concepts side by side.',
    praise: '🏆 Analytical excellence! High-scoring discourse terminology.'
  },
  {
    id: 'aq4',
    cohort: 'academy',
    educationLevel: 'High School & College Prep (Ages 15–24)',
    word: 'SUBSTANTIATE',
    phonetic: '/səbˈstæn.ʃi.eɪt/',
    category: 'ETS & Cambridge Rubric',
    prompt: 'Why do IELTS/TOEFL examiners look for candidates who SUBSTANTIATE their arguments?',
    options: [
      'Because high bands require providing concrete evidence and rationale rather than unsubstantiated claims',
      'Because essays must be translated into three languages to pass',
      'Because candidates should apologize whenever discussing controversial topics',
      'Because all sentences must be passive voice in academic writing'
    ],
    correctAnswer: 'Because high bands require providing concrete evidence and rationale rather than unsubstantiated claims',
    explanation: 'To substantiate means to establish validity through empirical evidence or logical reasoning.',
    audioPrompt: 'To substantiate means to validate with concrete evidence and rationale.',
    praise: '🎓 Official Rubric Master! Substantiated arguments guarantee high Task Achievement.'
  },
  {
    id: 'aq5',
    cohort: 'academy',
    educationLevel: 'High School & College Prep (Ages 15–24)',
    word: 'PARADIGM SHIFT',
    phonetic: '/ˈpær.ə.daɪm ʃɪft/',
    category: 'Epistemology & Science',
    prompt: 'In scientific history and academic synthesis, what denotes a PARADIGM SHIFT?',
    options: [
      'A fundamental transition in the basic concepts and experimental practices of a discipline',
      'A temporary drop in computer server internet speeds',
      'Switching between black and blue ink while writing an essay',
      'Translating a textbook from French into Spanish'
    ],
    correctAnswer: 'A fundamental transition in the basic concepts and experimental practices of a discipline',
    explanation: 'Popularized by Thomas Kuhn, a paradigm shift replaces existing foundational assumptions with a revolutionized worldview (e.g. Newtonian physics to Relativity).',
    audioPrompt: 'A paradigm shift is a fundamental transformation in scientific concepts.',
    praise: '🧠 Profound philosophical rigor! Top-tier conceptual vocabulary.'
  },

  // ==========================================
  // 4. AGES 25-54: PROFESSIONAL & CAREER FLUENCY
  // ==========================================
  {
    id: 'pq1',
    cohort: 'pro',
    educationLevel: 'Professional & Career Fluency (Ages 25–54)',
    word: 'DE-ESCALATE',
    phonetic: '/diːˈes.kə.leɪt/',
    category: 'Corporate Diplomacy',
    prompt: 'When managing a furious high-value enterprise stakeholder, what is the core tactic of DE-ESCALATION?',
    options: [
      'Validating their operational frustration transparently while offering structured remediation without defensive counter-attacks',
      'Forwarding their complaint to the spam folder and ignoring future emails',
      'Immediately threatening to terminate their contract and sue for defamation',
      'Blaming upstream cloud vendors repeatedly to prove the fault was not internal'
    ],
    correctAnswer: 'Validating their operational frustration transparently while offering structured remediation without defensive counter-attacks',
    explanation: 'Executive de-escalation disarms hostility by validating business impact and pivoting swiftly to constructive corrective action.',
    audioPrompt: 'De-escalation neutralizes conflict through validation and structured solutions.',
    praise: '💼 Poised leadership diplomacy! Essential stakeholder management.'
  },
  {
    id: 'pq2',
    cohort: 'pro',
    educationLevel: 'Professional & Career Fluency (Ages 25–54)',
    word: 'SCOPE CREEP',
    phonetic: '/skoʊp kriːp/',
    category: 'Project Governance',
    prompt: 'How should an executive diplomatically push back against SCOPE CREEP from a client?',
    options: [
      'Offer an addendum outlining the associated timeline adjustment and cost options instead of an abrupt refusal',
      'Work 90 hours over the weekend in secret without informing management',
      'Tell the client their requests are completely unreasonable and unrealistic',
      'Delete the extra features without notifying anyone'
    ],
    correctAnswer: 'Offer an addendum outlining the associated timeline adjustment and cost options instead of an abrupt refusal',
    explanation: 'Diplomatic project managers frame scope expansions as welcomed opportunities requiring commensurate timeline or budget recalibration.',
    audioPrompt: 'Managing scope creep requires introducing addendums with timeline trade-offs.',
    praise: '📈 Astute corporate governance! Protects team bandwidth and project margins.'
  },
  {
    id: 'pq3',
    cohort: 'pro',
    educationLevel: 'Professional & Career Fluency (Ages 25–54)',
    word: 'ELEVATOR PITCH CADENCE',
    phonetic: '/ˈel.ə.veɪ.tər pɪtʃ/',
    category: 'Executive Presence',
    prompt: 'What is the scientifically recognized optimal speaking cadence for an executive elevator pitch?',
    options: [
      '130 to 155 Words Per Minute (balanced, poised, authoritative)',
      '220+ Words Per Minute (rapid-fire to squeeze as many words as possible)',
      'Under 80 Words Per Minute with long hesitant pauses',
      'Speaking in monotone without any variation in pitch or inflection'
    ],
    correctAnswer: '130 to 155 Words Per Minute (balanced, poised, authoritative)',
    explanation: '130–155 WPM gives listeners optimal cognitive bandwidth to absorb quantified business metrics without feeling rushed.',
    audioPrompt: 'The optimal executive speaking cadence is 130 to 155 words per minute.',
    praise: '🎙️ Boardroom commanding cadence! 130–155 WPM maximizes listener retention.'
  },
  {
    id: 'pq4',
    cohort: 'pro',
    educationLevel: 'Professional & Career Fluency (Ages 25–54)',
    word: 'BATNA',
    phonetic: '/ˈbæt.nə/',
    category: 'Strategic Negotiation',
    prompt: 'In corporate negotiations, what does the vital strategic acronym BATNA stand for?',
    options: [
      'Best Alternative To a Negotiated Agreement (your walk-away power)',
      'Budget Allocation To New Assets',
      'Business Automation Through Network Algorithms',
      'Benchmark Assessment Target Not Achieved'
    ],
    correctAnswer: 'Best Alternative To a Negotiated Agreement (your walk-away power)',
    explanation: 'Developed at Harvard Negotiation Project, knowing your BATNA protects you from accepting disadvantageous terms and empowers your bargaining position.',
    audioPrompt: 'BATNA is the Best Alternative To a Negotiated Agreement.',
    praise: '🤝 Master negotiator acumen! Your BATNA is your ultimate leverage.'
  },

  // ==========================================
  // 5. AGES 55+: GOLDEN AGE & LIFELONG LEARNING
  // ==========================================
  {
    id: 'sq1',
    cohort: 'senior',
    educationLevel: 'Golden Age & Lifelong Learning (Ages 55+)',
    word: 'PHISHING DEFENSE',
    phonetic: '/ˈfɪʃ.ɪŋ dɪˈfens/',
    category: 'Everyday Digital Safety',
    prompt: 'You receive an urgent text: "Your bank card is blocked! Click bit.ly/bank-fix-99 immediately." What is the safe, confident action?',
    options: [
      'Do not click the link. Delete the message or call your bank directly using the phone number on your card 🛡️',
      'Immediately click the link and type your card number and PIN',
      'Text your password back to the number so they can verify you',
      'Call the random number from the text message right away'
    ],
    correctAnswer: 'Do not click the link. Delete the message or call your bank directly using the phone number on your card 🛡️',
    explanation: 'Banks never send urgent text alerts with shortened links demanding PIN numbers. Always call the official number on your card.',
    audioPrompt: 'Never click unexpected links. Call the phone number printed on the back of your card.',
    praise: '🛡️ Brilliant scam defense! You protected your security with wisdom and confidence.'
  },
  {
    id: 'sq2',
    cohort: 'senior',
    educationLevel: 'Golden Age & Lifelong Learning (Ages 55+)',
    word: 'NEUROPLASTICITY',
    phonetic: '/ˌnjʊə.roʊ.plæsˈtɪs.ə.ti/',
    category: 'Cognitive Health',
    prompt: 'What does scientific research on NEUROPLASTICITY demonstrate about learning in older age?',
    options: [
      'The human brain retains the remarkable ability to form new neural connections at any age through regular mental exercise',
      'The brain completely stops learning anything new after age 30',
      'Crosswords and word puzzles have zero benefit for memory recall',
      'Reading books decreases cognitive reserve in seniors'
    ],
    correctAnswer: 'The human brain retains the remarkable ability to form new neural connections at any age through regular mental exercise',
    explanation: 'Neuroplasticity proves that engaging in reflective writing, language puzzles, and active curiosity preserves cognitive vitality throughout life.',
    audioPrompt: 'Neuroplasticity shows that your brain forms new pathways at any stage of life.',
    praise: '🌸 Inspiring truth! Your mind continues to grow and adapt throughout your entire life.'
  },
  {
    id: 'sq3',
    cohort: 'senior',
    educationLevel: 'Golden Age & Lifelong Learning (Ages 55+)',
    word: 'PASSPHRASE',
    phonetic: '/ˈpæs.freɪz/',
    category: 'Digital Confidence',
    prompt: 'Which of the following is the most secure, memorable PASSPHRASE according to modern cybersecurity standards?',
    options: [
      '"BlueCastleDancesSunny" (4 friendly unrelated words) 🏰',
      '"123456"',
      '"Password2024"',
      '"MyName"'
    ],
    correctAnswer: '"BlueCastleDancesSunny" (4 friendly unrelated words) 🏰',
    explanation: 'Four random friendly words are easy for human memory to recall, but virtually impossible for computer scripts to crack.',
    audioPrompt: 'Four random friendly words create an unbreakable, memorable passphrase.',
    praise: '🗝️ Excellent digital wisdom! Unbreakable passphrases keep your accounts secure.'
  },
  {
    id: 'sq4',
    cohort: 'senior',
    educationLevel: 'Golden Age & Lifelong Learning (Ages 55+)',
    word: 'TWO-FACTOR VERIFICATION',
    phonetic: '/tuː ˈfæk.tər/',
    category: 'Digital Peace of Mind',
    prompt: 'Why does receiving a 6-digit text code on your phone when signing into your email keep your account safe?',
    options: [
      'Even if a bad actor steals your password, they cannot enter without your personal physical phone 📱',
      'It sends money directly to your retirement fund',
      'It speeds up your home broadband connection',
      'It turns off all spam phone calls forever'
    ],
    correctAnswer: 'Even if a bad actor steals your password, they cannot enter without your personal physical phone 📱',
    explanation: 'Two-factor authentication adds a physical security barrier. A stolen password alone is useless without your physical device.',
    audioPrompt: 'Two-factor authentication protects your account even if your password is stolen.',
    praise: '🛡️ Impenetrable digital defense! You navigate technology safely and wisely.'
  },
  {
    id: 'sq5',
    cohort: 'senior',
    educationLevel: 'Golden Age & Lifelong Learning (Ages 55+)',
    word: 'REMINISCENCE',
    phonetic: '/ˌrem.ɪˈnɪs.əns/',
    category: 'Memory & Life Wisdom',
    prompt: 'In cognitive wellness, what is the uplifting purpose of REMINISCENCE and life-story sharing?',
    options: [
      'Recalling meaningful life experiences stimulates neural memory banks and transmits cherished heritage to younger generations 📖',
      'It replaces the need to drink water or eat food',
      'It makes people forget how to speak their native language',
      'It is only allowed during judicial court hearings'
    ],
    correctAnswer: 'Recalling meaningful life experiences stimulates neural memory banks and transmits cherished heritage to younger generations 📖',
    explanation: 'Reminiscence therapy strengthens episodic memory, reduces cognitive fatigue, and bridges generational wisdom with family.',
    audioPrompt: 'Reminiscence strengthens memory recall and shares your timeless wisdom.',
    praise: '🌟 Heartwarming vitality! Your life experiences are an invaluable treasure.'
  }
];
