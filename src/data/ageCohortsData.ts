import {
  AgeCohortInfo,
  PhonicsCard,
  WordBuilderItem,
  PictureStory,
  ScienceQuest,
  CreativeStoryStarter,
  MentalMathChallenge,
  SpacedRepetitionCard,
  TFNGExercise,
  Band9EssayTemplate,
  CueCardItem,
  EmailDiplomacyScenario,
  ElevatorPitchPrompt,
  MemoryGymPair,
  ReminiscencePrompt,
  DigitalSafetyGuide,
  ResourceVaultItem
} from '../types';

export const ageCohorts: AgeCohortInfo[] = [
  {
    id: 'early',
    name: 'Little Explorers',
    ageRange: 'Ages 5–8',
    icon: 'Baby',
    badge: 'Early Childhood',
    bestPractice: 'Montessori Multisensory Phonics & Play-Based Microlearning',
    cognitiveFocus: 'Phonemic awareness, letter-sound association, sight words, counting, observational curiosity',
    description: 'Joyful phonics, tactile word building, and illustrated micro-stories with immediate cheering audio and zero-stress feedback.',
    accentColor: 'text-amber-600',
    bgGradient: 'from-amber-500 to-orange-500'
  },
  {
    id: 'junior',
    name: 'Junior Scholars',
    ageRange: 'Ages 9–14',
    icon: 'Backpack',
    badge: 'Elementary & Middle School',
    bestPractice: 'Inquiry-Based Learning & Dual-Coding Theory',
    cognitiveFocus: 'Reading comprehension, scientific inquiry, mental math shortcuts, creative narrative structure',
    description: 'Space & science exploration quests, interactive vocabulary dictionary, mental math logic drills, and creative story lab.',
    accentColor: 'text-blue-600',
    bgGradient: 'from-blue-600 to-cyan-500'
  },
  {
    id: 'academy',
    name: 'Academy & High-Stakes Exams',
    ageRange: 'Ages 15–24',
    icon: 'GraduationCap',
    badge: 'High School & College',
    bestPractice: 'Deliberate Practice & Official Rubric Automated Scoring',
    cognitiveFocus: 'IELTS/PTE/TOEFL mastery, academic argumentation, timed stress reduction, True/False/Not Given logic',
    description: 'Rigorous True/False/Not Given simulator, Cambridge Task 2 essay rubric evaluator with Band 9 template injector, and Cue Card timer.',
    accentColor: 'text-indigo-600',
    bgGradient: 'from-indigo-600 to-purple-600'
  },
  {
    id: 'pro',
    name: 'Professional & Career Fluency',
    ageRange: 'Ages 25–54',
    icon: 'Briefcase',
    badge: 'Workplace & Executive',
    bestPractice: "Knowles' Adult Andragogy & Practical Microlearning",
    cognitiveFocus: 'Workplace communication, assertive diplomacy, executive summaries, interview pacing, negotiations',
    description: 'Executive email diplomacy analyzer with corporate templates, 60-second elevator pitch pacing monitor, and commute-friendly drills.',
    accentColor: 'text-emerald-600',
    bgGradient: 'from-emerald-600 to-teal-600'
  },
  {
    id: 'senior',
    name: 'Golden Age & Lifelong Learning',
    ageRange: 'Ages 55+',
    icon: 'HeartHandshake',
    badge: 'Seniors & Active Minds',
    bestPractice: 'Cognitive Reserve Preservation & Errorless Learning',
    cognitiveFocus: 'Neuroplasticity stimulation, word recall, reflective journaling, everyday digital safety, calm listening',
    description: 'Gentle word association memory gym with zero penalties, reflective reminiscence journaling, digital scam defense, and calm 0.82x clear speech.',
    accentColor: 'text-rose-600',
    bgGradient: 'from-rose-500 to-pink-600'
  }
];

// 1. Ages 5-8: Phonics Soundboard & Blends
export const phonicsCards: PhonicsCard[] = [
  { id: 'p1', letter: 'A', phoneme: '/æ/', word: 'Apple', icon: '🍎', soundType: 'vowel', promptText: 'A is for Apple! /æ/ /æ/ Apple!', exampleSentence: 'The apple is sweet and red.' },
  { id: 'p2', letter: 'B', phoneme: '/b/', word: 'Bear', icon: '🐻', soundType: 'consonant', promptText: 'B is for Bear! /b/ /b/ Bear!', exampleSentence: 'The brown bear loves honey.' },
  { id: 'p3', letter: 'C', phoneme: '/k/', word: 'Cat', icon: '🐱', soundType: 'consonant', promptText: 'C is for Cat! /k/ /k/ Cat!', exampleSentence: 'The playful cat purrs softly.' },
  { id: 'p4', letter: 'D', phoneme: '/d/', word: 'Duck', icon: '🦆', soundType: 'consonant', promptText: 'D is for Duck! /d/ /d/ Duck!', exampleSentence: 'The duck swims across the pond.' },
  { id: 'p5', letter: 'E', phoneme: '/ɛ/', word: 'Elephant', icon: '🐘', soundType: 'vowel', promptText: 'E is for Elephant! /ɛ/ /ɛ/ Elephant!', exampleSentence: 'The gentle elephant waves its trunk.' },
  { id: 'p6', letter: 'F', phoneme: '/f/', word: 'Fish', icon: '🐟', soundType: 'consonant', promptText: 'F is for Fish! /f/ /f/ Fish!', exampleSentence: 'The little fish swims fast.' },
  { id: 'p7', letter: 'G', phoneme: '/ɡ/', word: 'Giraffe', icon: '🦒', soundType: 'consonant', promptText: 'G is for Giraffe! /ɡ/ /ɡ/ Giraffe!', exampleSentence: 'The tall giraffe eats green leaves.' },
  { id: 'p8', letter: 'H', phoneme: '/h/', word: 'Horse', icon: '🐴', soundType: 'consonant', promptText: 'H is for Horse! /h/ /h/ Horse!', exampleSentence: 'The strong horse gallops in the field.' },
  { id: 'p9', letter: 'I', phoneme: '/ɪ/', word: 'Igloo', icon: '❄️', soundType: 'vowel', promptText: 'I is for Igloo! /ɪ/ /ɪ/ Igloo!', exampleSentence: 'The igloo is cozy in the snow.' },
  { id: 'p10', letter: 'J', phoneme: '/dʒ/', word: 'Jellyfish', icon: '🪼', soundType: 'consonant', promptText: 'J is for Jellyfish! /dʒ/ /dʒ/ Jellyfish!', exampleSentence: 'The jellyfish glows under the sea.' },
  { id: 'p11', letter: 'K', phoneme: '/k/', word: 'Kite', icon: '🪁', soundType: 'consonant', promptText: 'K is for Kite! /k/ /k/ Kite!', exampleSentence: 'The colorful kite flies high.' },
  { id: 'p12', letter: 'L', phoneme: '/l/', word: 'Lion', icon: '🦁', soundType: 'consonant', promptText: 'L is for Lion! /l/ /l/ Lion!', exampleSentence: 'The brave lion protects the pride.' },
  { id: 'p13', letter: 'M', phoneme: '/m/', word: 'Monkey', icon: '🐒', soundType: 'consonant', promptText: 'M is for Monkey! /m/ /m/ Monkey!', exampleSentence: 'The monkey swings from branch to branch.' },
  { id: 'p14', letter: 'N', phoneme: '/n/', word: 'Nest', icon: '🪺', soundType: 'consonant', promptText: 'N is for Nest! /n/ /n/ Nest!', exampleSentence: 'Little birds sleep safely in their nest.' },
  { id: 'p15', letter: 'O', phoneme: '/ɒ/', word: 'Owl', icon: '🦉', soundType: 'vowel', promptText: 'O is for Owl! /ɒ/ /ɒ/ Owl!', exampleSentence: 'The wise owl watches at night.' },
  { id: 'p16', letter: 'P', phoneme: '/p/', word: 'Panda', icon: '🐼', soundType: 'consonant', promptText: 'P is for Panda! /p/ /p/ Panda!', exampleSentence: 'The fluffy panda crunches green bamboo.' },
  { id: 'p17', letter: 'Q', phoneme: '/kw/', word: 'Queen', icon: '👑', soundType: 'consonant', promptText: 'Q is for Queen! /kw/ /kw/ Queen!', exampleSentence: 'The queen wears a sparkling golden crown.' },
  { id: 'p18', letter: 'R', phoneme: '/r/', word: 'Rainbow', icon: '🌈', soundType: 'consonant', promptText: 'R is for Rainbow! /r/ /r/ Rainbow!', exampleSentence: 'A bright rainbow shines after the rain.' },
  { id: 'p19', letter: 'S', phoneme: '/s/', word: 'Sun', icon: '☀️', soundType: 'consonant', promptText: 'S is for Sun! /s/ /s/ Sun!', exampleSentence: 'The warm sun shines all day long.' },
  { id: 'p20', letter: 'T', phoneme: '/t/', word: 'Tiger', icon: '🐯', soundType: 'consonant', promptText: 'T is for Tiger! /t/ /t/ Tiger!', exampleSentence: 'The tiger has bold orange and black stripes.' },
  { id: 'p21', letter: 'U', phoneme: '/ʌ/', word: 'Umbrella', icon: '☂️', soundType: 'vowel', promptText: 'U is for Umbrella! /ʌ/ /ʌ/ Umbrella!', exampleSentence: 'The umbrella keeps us dry in the rain.' },
  { id: 'p22', letter: 'V', phoneme: '/v/', word: 'Violin', icon: '🎻', soundType: 'consonant', promptText: 'V is for Violin! /v/ /v/ Violin!', exampleSentence: 'The violin makes lovely melody.' },
  { id: 'p23', letter: 'W', phoneme: '/w/', word: 'Whale', icon: '🐋', soundType: 'consonant', promptText: 'W is for Whale! /w/ /w/ Whale!', exampleSentence: 'The big whale swims across the ocean.' },
  { id: 'p24', letter: 'X', phoneme: '/ks/', word: 'Xylophone', icon: '🎵', soundType: 'consonant', promptText: 'X is for Xylophone! /ks/ /ks/ Xylophone!', exampleSentence: 'Tap the xylophone for sweet chime sounds.' },
  { id: 'p25', letter: 'Y', phoneme: '/j/', word: 'Yacht', icon: '⛵', soundType: 'consonant', promptText: 'Y is for Yacht! /j/ /j/ Yacht!', exampleSentence: 'The white yacht sails smoothly on the water.' },
  { id: 'p26', letter: 'Z', phoneme: '/z/', word: 'Zebra', icon: '🦓', soundType: 'consonant', promptText: 'Z is for Zebra! /z/ /z/ Zebra!', exampleSentence: 'The zebra runs across the sunny savannah.' },
  // Phonics blends
  { id: 'b1', letter: 'SH', phoneme: '/ʃ/', word: 'Ship', icon: '🚢', soundType: 'blend', promptText: 'S and H say /ʃ/! Quiet like a whisper: Ship!', exampleSentence: 'The big blue ship sails across the bay.' },
  { id: 'b2', letter: 'CH', phoneme: '/tʃ/', word: 'Cheese', icon: '🧀', soundType: 'blend', promptText: 'C and H say /tʃ/! Like a cheerful train: Cheese!', exampleSentence: 'The little mouse found delicious cheese.' },
  { id: 'b3', letter: 'TH', phoneme: '/θ/', word: 'Thumb', icon: '👍', soundType: 'blend', promptText: 'T and H say /θ/! Stick your tongue out gently: Thumb!', exampleSentence: 'Thumbs up for a fantastic job!' },
  { id: 'b4', letter: 'OO', phoneme: '/uː/', word: 'Moon', icon: '🌙', soundType: 'blend', promptText: 'O and O say /uː/! Like an owl: Moon!', exampleSentence: 'The silver moon glows in the dark sky.' }
];

// Word Builder Spelling Challenges
export const wordBuilderChallenges: WordBuilderItem[] = [
  { id: 'wb1', targetWord: 'CAT', category: 'Animals', icon: '🐱', hint: 'A furry pet that purrs and catches mice.', scrambledLetters: ['T', 'C', 'A'] },
  { id: 'wb2', targetWord: 'SUN', category: 'Nature', icon: '☀️', hint: 'The bright star that lights our daytime sky.', scrambledLetters: ['U', 'S', 'N'] },
  { id: 'wb3', targetWord: 'FISH', category: 'Sea Life', icon: '🐟', hint: 'Swims with fins and breathes with gills.', scrambledLetters: ['S', 'F', 'H', 'I'] },
  { id: 'wb4', targetWord: 'STAR', category: 'Space', icon: '⭐', hint: 'Twinkles brightly high above in the night.', scrambledLetters: ['R', 'A', 'S', 'T'] },
  { id: 'wb5', targetWord: 'BIRD', category: 'Animals', icon: '🐦', hint: 'Has wings, colorful feathers, and sings songs.', scrambledLetters: ['I', 'B', 'D', 'R'] },
  { id: 'wb6', targetWord: 'TREE', category: 'Nature', icon: '🌳', hint: 'Has roots in the ground, a wooden trunk, and green leaves.', scrambledLetters: ['E', 'T', 'R', 'E'] }
];

// Picture Story Time
export const pictureStories: PictureStory[] = [
  {
    id: 'story1',
    title: "Oliver the Little Owl's First Flight",
    coverEmoji: '🦉',
    theme: 'Bravery & Curiosity',
    pages: [
      {
        pageNumber: 1,
        text: 'Oliver was a fluffy little owl who lived in a tall oak tree. Every evening, he watched the golden moon rise above the forest canopy.',
        emojiScene: '🌳 🦉 🌙 ✨'
      },
      {
        pageNumber: 2,
        text: '"Do not be afraid," said his mother with a gentle smile. "Spread your wings, feel the gentle summer breeze, and believe in yourself!"',
        emojiScene: '🦉 💨 🍃 🌟'
      },
      {
        pageNumber: 3,
        text: 'Oliver flapped his wings once, twice, and zoomed smoothly over the silver lake! All his animal friends cheered with joy below.',
        emojiScene: '✨ 🦉 🌊 🦊 🐰 🎈'
      }
    ],
    comprehensionQuiz: {
      question: 'Where did Oliver live before taking his first flight?',
      options: ['In a deep dark cave', 'In a tall oak tree', 'Inside a barn', 'On a floating cloud'],
      correctIndex: 1,
      praise: 'Superstar job! You remembered that Oliver lived in a tall oak tree!'
    }
  },
  {
    id: 'story2',
    title: "The Friendly Robot Who Watered Flowers",
    coverEmoji: '🤖',
    theme: 'Kindness & Nature',
    pages: [
      {
        pageNumber: 1,
        text: 'Beep-boop! Pip was a small silver robot with cheerful green antenna lights. He lived near a sunny rooftop garden.',
        emojiScene: '🏙️ 🤖 🌷 🌻'
      },
      {
        pageNumber: 2,
        text: 'On a very hot summer afternoon, Pip noticed the sunflowers drooping. He quickly filled his shiny watering can with cool drops of water.',
        emojiScene: '☀️ 🌻 💧 🤖'
      },
      {
        pageNumber: 3,
        text: 'Within an hour, the bright flowers stood tall again, welcoming colorful honeybees and dancing butterflies.',
        emojiScene: '🌻 🐝 🦋 🌈 🤖'
      }
    ],
    comprehensionQuiz: {
      question: 'Why did Pip the robot water the flowers?',
      options: ['Because it was raining', 'Because the sunflowers were drooping in the hot sun', 'Because the flowers asked for oil', 'To wash his wheels'],
      correctIndex: 1,
      praise: 'Splendid reading! Pip cared for the sunflowers when they were drooping!'
    }
  }
];

// 2. Ages 9-14: Junior Scholars Quests & Logic
export const scienceQuests: ScienceQuest[] = [
  {
    id: 'sq1',
    title: "The Mystery of Jupiter's Great Red Spot",
    topic: 'Astronomy & Atmospheric Science',
    readingPassage: `For more than three centuries, astronomers observing Jupiter through telescopes have marveled at a colossal crimson oval known as the Great Red Spot. This feature is not a solid landmass, but an enormous anticyclonic storm system—a swirling vortex so immense that Earth itself could fit snugly inside its boundaries. Unlike hurricanes on Earth that dissipate rapidly when passing over land, Jupiter has no solid rocky surface to drain the storm's kinetic energy. Powered by internal heat rising from Jupiter's dense core and flanked by fierce opposing jet streams traveling in opposite directions, the Great Red Spot continues to spin at speeds exceeding 430 kilometers per hour. Scientists utilize spectral imaging to analyze how solar ultraviolet radiation interacts with atmospheric ammonia and phosphorus, giving the storm its trademark rusty hue.`,
    dictionary: {
      'anticyclonic': 'A weather system featuring high pressure at its center, rotating opposite to cyclones.',
      'dissipate': 'To gradually scatter, diminish, or fade away until energy is exhausted.',
      'kinetic energy': 'The energy possessed by an object or fluid owing to its motion.',
      'spectral imaging': 'An optical technique capturing light across specific wavelengths to reveal chemical composition.'
    },
    comprehensionQuestions: [
      {
        question: 'Why does the Great Red Spot persist for centuries while Earth storms dissipate quickly?',
        options: [
          'Because Jupiter is much closer to the Sun',
          'Because Jupiter lacks a solid landmass to cause surface friction and sap the storm’s energy',
          'Because cold temperatures permanently freeze the gas layers in place',
          'Because asteroids shield the storm from space winds'
        ],
        answerIndex: 1,
        explanation: 'Earth hurricanes lose energy quickly due to friction with land. Since Jupiter is a gas giant with no solid surface, the storm maintains kinetic momentum.'
      },
      {
        question: 'What gives the Great Red Spot its characteristic rusty reddish color?',
        options: [
          'Iron rust falling from Jupiter’s rings',
          'Reflection from Mars',
          'Solar ultraviolet radiation chemically reacting with atmospheric ammonia and phosphorus compounds',
          'Lava erupting from underground volcanic vents'
        ],
        answerIndex: 2,
        explanation: 'Spectral analysis confirms that solar ultraviolet rays break down atmospheric gases like ammonia and phosphorus compounds, producing photochemically reddish molecules.'
      }
    ]
  },
  {
    id: 'sq2',
    title: "Bioluminescence: The Living Lanterns of the Deep Abyss",
    topic: 'Marine Biology & Chemical Ecology',
    readingPassage: `Descending beyond 1,000 meters into the ocean’s bathypelagic zone, sunlight vanishes completely into permanent inky darkness. Here, more than 75% of marine creatures produce their own cold living light through an organic phenomenon known as bioluminescence. This biochemical reaction occurs when an enzyme named luciferase catalyzes the oxidation of a light-emitting pigment called luciferin. Unlike an incandescent light bulb that loses over 90% of its electricity as waste heat, biological cold light is nearly 100% efficient, wasting virtually zero thermal energy. Deep-sea anglerfish use a glowing photophore dangling above their jaws as a luminous lure, while hatchetfish project downward-facing light to match the dim rays trickling from the surface—a clever camouflage strategy known as counterillumination that makes them invisible to predators lurking beneath.`,
    dictionary: {
      'bathypelagic zone': 'The deep ocean layer between 1,000 and 4,000 meters deep, characterized by total darkness and high pressure.',
      'luciferase': 'A specialized enzyme that catalyzes the oxidation of luciferin to release photons of light.',
      'cold light': 'Illumination produced with near-zero thermal loss, making it safe for delicate biological tissue.',
      'counterillumination': 'Camouflage where an animal emits light to match the intensity of background light, hiding its silhouette.'
    },
    comprehensionQuestions: [
      {
        question: 'What biochemical components are required to generate biological cold light?',
        options: [
          'Chlorophyll and sunlight photons',
          'The enzyme luciferase and the light-emitting pigment luciferin',
          'Sodium chloride and electric currents',
          'Liquid nitrogen and phosphorus gas'
        ],
        answerIndex: 1,
        explanation: 'Luciferin is the substrate that emits light when oxidized, a reaction accelerated by the specialized enzyme luciferase.'
      },
      {
        question: 'How does counterillumination protect hatchetfish from predators?',
        options: [
          'It blinds predators with a flash of bright light',
          'It heats the water to push predators away',
          'It emits light from the belly that matches downwelling surface light, erasing the fish’s silhouette',
          'It changes the fish’s color to bright red'
        ],
        answerIndex: 2,
        explanation: 'Predators below look up toward the dim surface. By matching the overhead light with belly photophores, the fish eliminates its dark silhouette.'
      }
    ]
  }
];

export const creativeStoryStarters: CreativeStoryStarter[] = [
  {
    id: 'css1',
    genre: 'Sci-Fi Adventure',
    prompt: 'You discover an antique wristwatch in your grandfather’s attic, but whenever you wind it backwards three clicks, the room around you pauses in time for exactly 60 seconds.',
    starterSentence: 'The silver dial hummed with an iridescent violet glow as the second hand froze dead on the twelve...',
    helperWords: ['chronometer', 'suspended', 'silhouette', 'imperceptible', 'fracture']
  },
  {
    id: 'css2',
    genre: 'Wildlife Mystery',
    prompt: 'A stray raven drops a small brass key wrapped in an ancient parchment map onto your windowsill during a thunderstorm.',
    starterSentence: 'Rain lashed against the bedroom window pane, yet the black-feathered messenger stood motionless, tapping the glass with a glint in its obsidian eye...',
    helperWords: ['obsidian', 'cartography', 'cryptic', 'plumage', 'threshold']
  },
  {
    id: 'css3',
    genre: 'Deep Space Odyssey',
    prompt: 'As the youngest cadet aboard the exploratory vessel Kepler-9, you detect a rhythmic acoustic signal echoing through the asteroid belt.',
    starterSentence: 'The biosensors registered an unmistakable cadence—not the random static of cosmic dust, but an intentional pattern repeating every four seconds...',
    helperWords: ['cadence', 'frequency', 'navigation', 'transceiver', 'celestial']
  }
];

export const mentalMathChallenges: MentalMathChallenge[] = [
  {
    id: 'mm1',
    problem: 'What is 35 × 35?',
    options: [1125, 1225, 1325, 1255],
    correctAnswer: 1225,
    mentalTrick: 'For numbers ending in 5: Multiply tens digit by next integer (3 × 4 = 12) and append 25 → 1225!'
  },
  {
    id: 'mm2',
    problem: 'Calculate 15% tip on a $64 bill mentally.',
    options: [8.6, 9.6, 9.2, 10.4],
    correctAnswer: 9.6,
    mentalTrick: '10% of 64 is 6.4. Half of that (5%) is 3.2. Add them: 6.4 + 3.2 = 9.60!'
  },
  {
    id: 'mm3',
    problem: 'What is the sum: 1 + 2 + 3 + ... + 20?',
    options: [190, 200, 210, 220],
    correctAnswer: 210,
    mentalTrick: 'Gauss pairing formula: n × (n + 1) / 2 → 20 × 21 / 2 = 10 × 21 = 210!'
  },
  {
    id: 'mm4',
    problem: 'What is 48 × 25?',
    options: [1100, 1200, 1250, 1300],
    correctAnswer: 1200,
    mentalTrick: 'Multiplying by 25 is dividing by 4 then multiplying by 100: 48 ÷ 4 = 12 → 12 × 100 = 1200!'
  },
  {
    id: 'mm5',
    problem: 'Next number in sequence: 2, 6, 12, 20, 30, ?',
    options: [40, 42, 44, 46],
    correctAnswer: 42,
    mentalTrick: 'Differences are +4, +6, +8, +10, so next difference is +12. 30 + 12 = 42 (also n × (n + 1): 6 × 7)!'
  }
];

export const spacedRepetitionCards: SpacedRepetitionCard[] = [
  {
    id: 'src1',
    subject: 'Earth Science',
    question: 'What boundary type causes tectonic plates to slide horizontally past each other?',
    answer: 'Transform Fault Boundary (e.g., San Andreas Fault)',
    explanation: 'Divergent plates pull apart, convergent collide, and transform faults slide horizontally causing strike-slip earthquakes.',
    mastered: false
  },
  {
    id: 'src2',
    subject: 'Physics',
    question: 'State Newton’s Third Law of Motion in one concise sentence.',
    answer: 'For every action, there is an equal and opposite reaction.',
    explanation: 'Forces always occur in matched pairs acting on two different interacting bodies.',
    mastered: true
  },
  {
    id: 'src3',
    subject: 'Biology',
    question: 'Which organelle is responsible for generating cellular ATP via oxidative phosphorylation?',
    answer: 'Mitochondrion (The powerhouse of eukaryotic cells)',
    explanation: 'Mitochondria convert glucose metabolites and oxygen into chemical ATP energy.',
    mastered: false
  }
];

// 3. Ages 15-24: True/False/Not Given Simulator, Band 9 Essay Injector & Cue Card Simulator
export const tfngExercises: TFNGExercise[] = [
  {
    id: 'tfng1',
    passageTitle: 'The Transition to Hydrogen Aviation',
    passageSnippet: `Decarbonizing commercial aerospace poses engineering hurdles far beyond those encountered in automotive electrification. Lithium-ion batteries, while suitable for commuter aircraft with ranges under 400 nautical miles, suffer from inadequate gravimetric energy density to propel wide-body transatlantic passenger jets. Liquid hydrogen presents an alluring alternative, offering nearly three times the energy per kilogram compared to conventional kerosene Jet-A. However, cryogenic hydrogen requires pressurized storage at minus 253 degrees Celsius, necessitating insulated cylindrical or spherical fuel tanks that consume substantial fuselage volume. While several European airframe consortiums have flown sub-scale testbed prototypes with converted turboprop engines, no civil aviation regulator has ratified definitive airworthiness certifications for commercial cryogenic passenger transport.`,
    statement: 'Aviation authorities have formally sanctioned the commercial passenger use of cryogenic hydrogen fuel tanks.',
    answer: 'FALSE',
    rubricRationale: 'The passage explicitly states: "no civil aviation regulator has ratified definitive airworthiness certifications for commercial cryogenic passenger transport." Because the statement asserts authorities HAVE sanctioned it, this directly contradicts the verified text, making it definitively FALSE.',
    strategyTip: 'Remember: FALSE means the text explicitly asserts the opposite. If the text says "no authority has ratified" and the statement says "authorities have sanctioned", that is an outright contradiction.'
  },
  {
    id: 'tfng2',
    passageTitle: 'The Transition to Hydrogen Aviation',
    passageSnippet: `Liquid hydrogen presents an alluring alternative, offering nearly three times the energy per kilogram compared to conventional kerosene Jet-A. However, cryogenic hydrogen requires pressurized storage at minus 253 degrees Celsius, necessitating insulated cylindrical or spherical fuel tanks that consume substantial fuselage volume.`,
    statement: 'Hydrogen aircraft will reduce transatlantic flight ticket prices by at least 20 percent by 2040.',
    answer: 'NOT GIVEN',
    rubricRationale: 'While the passage discusses fuel energy density and engineering trade-offs of liquid hydrogen versus kerosene, it makes zero mention of ticket pricing, economic passenger costs, or projections for the year 2040. Because the information is absent and cannot be confirmed or denied, it is NOT GIVEN.',
    strategyTip: 'Do not extrapolate or assume based on outside business intuition! If the specific fact (ticket prices / 2040) is not stated in the passage, choose NOT GIVEN.'
  },
  {
    id: 'tfng3',
    passageTitle: 'The Transition to Hydrogen Aviation',
    passageSnippet: `Lithium-ion batteries, while suitable for commuter aircraft with ranges under 400 nautical miles, suffer from inadequate gravimetric energy density to propel wide-body transatlantic passenger jets.`,
    statement: 'Battery propulsion is deemed viable for short-distance regional flights below 400 nautical miles.',
    answer: 'TRUE',
    rubricRationale: 'The passage expressly affirms: "Lithium-ion batteries, while suitable for commuter aircraft with ranges under 400 nautical miles..." Commuter flights match "short-distance regional flights". Hence, the statement accurately paraphrases the passage fact.',
    strategyTip: 'TRUE statements rely on precise paraphrasing: "suitable for commuter aircraft" = "viable for short-distance regional flights".'
  }
];

export const band9EssayTemplates: Band9EssayTemplate[] = [
  {
    id: 'b9t1',
    title: 'Balanced Thesis Hook with Nuanced Counterweight',
    category: 'Introduction Hook',
    templateSnippet: `While it is frequently contended by proponents that [insert conventional viewpoint], a rigorous examination reveals that [insert opposing critical reality]. This essay will substantiate that [insert personal clear thesis position] through an analysis of [Key Argument A] and [Key Argument B].`,
    instructions: 'Inject this formula in paragraph 1 to immediately satisfy Task Achievement (clear position throughout) and Cohesion criteria.',
    rubricAlignment: 'Band 9 Task Response & Coherence: Immediately establishes a nuanced stance without simplistic polarized claims.'
  },
  {
    id: 'b9t2',
    title: 'Concessive Body Paragraph with Empirical Rebuttal',
    category: 'Body Paragraph Counter-Argument',
    templateSnippet: `Admittedly, advocates of the former perspective raise a valid concern regarding [insert reasonable counter-argument]. It is undeniable that [insert concrete concession]. Nevertheless, this observation fails to account for [insert pivotal rebuttal factor]. Empirical investigations conducted by [insert scholarly body/domain] demonstrate that [insert decisive counter-evidence]. Consequently, the initial assertion proves untenable under deeper scrutiny.`,
    instructions: 'Use in your second body paragraph to transition seamlessly from admitting a reasonable counterpoint to dismantling it with academic rigor.',
    rubricAlignment: 'Band 9 Coherence & Lexical Resource: Employs sophisticated discourse markers ("Admittedly", "untenable under deeper scrutiny").'
  },
  {
    id: 'b9t3',
    title: 'Definitive Synthesis Conclusion with Forward-Looking Foresight',
    category: 'Conclusion Synthesis',
    templateSnippet: `In conclusion, although [insert acknowledged nuance] warrants pragmatic consideration, the overwhelming balance of evidence affirms that [restate core thesis in fresh academic phrasing]. Looking ahead, unless policymakers and stakeholders implement [insert actionable forward recommendation], society risks exacerbating [insert long-term consequence].`,
    instructions: 'Never introduce new evidence in conclusion; synthesize previously stated arguments and culminate in forward-looking foresight.',
    rubricAlignment: 'Band 9 Task Achievement: Complete summary that wraps up all essay threads with high lexical sophistication.'
  },
  {
    id: 'b9t4',
    title: 'High-Density Academic Lexical Connectors',
    category: 'Lexical Discourse Formula',
    templateSnippet: `• Causality: "precipitated by", "engenders profound repercussions for", "is inextricably linked with"\n• Contrast: "in stark juxtaposition to", "notwithstanding these empirical indications", "whereby"\n• Exemplification: "this is lucidly exemplified by", "serves as an illustrative archetype of"`,
    instructions: 'Sprinkle these connectors across body paragraphs to avoid repetitive basic linking words like "moreover" or "for example".',
    rubricAlignment: 'Band 9 Lexical Resource & Grammatical Accuracy: Deploys rare and idiomatic collocations naturally.'
  }
];

export const cueCardItems: CueCardItem[] = [
  {
    id: 'cc1',
    topicTitle: 'Describe a significant technological innovation that transformed your community',
    cuePoints: [
      'What the innovation is and when it was introduced',
      'How community members access or interact with it',
      'What challenges or resistance occurred during initial adoption',
      'Explain why you believe it had a profound long-term impact'
    ],
    prepTimeSec: 60,
    speakTimeSec: 120,
    sampleBand9Response: `I would like to speak about the widespread deployment of decentralized solar microgrids across our regional municipality, which took place roughly three years ago. Prior to this implementation, our suburban periphery frequently endured rolling brownouts during sweltering summer afternoons due to grid over-saturation. The local municipal council partnered with a renewable energy cooperative to outfit civic rooftops with photovoltaic arrays paired with lithium-iron-phosphate battery banks. Initially, there was tangible skepticism regarding the capital expenditure and aesthetics of rooftop arrays. However, once citizens observed uninterrupted power alongside a 35% reduction in municipal utility tariffs, community perception shifted markedly from hesitation to pride. Today, it stands as a textbook archetype of localized sustainable infrastructure.`,
    pronunciationNotes: 'Maintain steady prosody during the introduction. Stress multisyllabic terms cleanly: pho-to-vol-TA-ic, ca-pi-tal ex-PEN-di-ture, ar-che-type (/ˈɑː.kɪ.taɪp/).'
  },
  {
    id: 'cc2',
    topicTitle: 'Describe an ambitious personal goal you are currently striving to accomplish',
    cuePoints: [
      'What the ambitious goal entails',
      'When and why you decided to pursue it',
      'What concrete milestones you have established to track progress',
      'Explain what sacrifices or adaptations you must make to achieve it'
    ],
    prepTimeSec: 60,
    speakTimeSec: 120,
    sampleBand9Response: `An ambitious undertaking that currently commands a substantial portion of my intellectual bandwidth is achieving professional fluency in computational linguistics while publishing an open-source speech synthesizer for under-resourced languages. I initiated this quest approximately eighteen months ago after recognizing that modern large language models neglect dialects spoken by millions of disenfranchised individuals. To track my trajectory systematically, I established quarterly benchmarks: mastering transformer attention architectures, curating a phonetic corpus, and conducting rigorous human perceptual evaluations. Naturally, this demands disciplined time management, often requiring me to substitute leisure weekends with coding sprints and acoustic analysis. Nonetheless, the prospect of democratizing conversational voice technology renders every sacrifice thoroughly worthwhile.`,
    pronunciationNotes: 'Keep your intonation lively and enthusiastic when outlining your personal motivation. Emphasize "bandwidth", "democratizing", and "under-resourced".'
  }
];

// 4. Ages 25-54: Professional Fluency & Executive Diplomacy
export const emailDiplomacyScenarios: EmailDiplomacyScenario[] = [
  {
    id: 'ed1',
    title: 'Diplomatically Pushing Back on Unrealistic Project Deadlines',
    corporateContext: 'Your Vice President requested a complex multi-region compliance audit completed in 48 hours, which would compromise audit rigor and cause team burnout.',
    rawDraft: 'Hi, we cannot do this audit by Friday. That deadline is completely impossible because we only have two analysts and the database is huge. If you force us, there will be major errors.',
    diplomaticRewrite: 'Dear Sarah,\n\nThank you for outlining the strategic urgency of the regional compliance audit. Our team is fully committed to delivering the rigor and regulatory compliance our leadership expects.\n\nUpon auditing the current scope across all regional databases, delivering a full-fidelity report within 48 hours would introduce unacceptable exposure to compliance oversights. To best protect our governance standards while meeting your executive briefing needs, I propose two actionable paths:\n\n1. Option A (Expedited Core Brief): Deliver an executive summary of the top three highest-risk jurisdictions by Friday 5 PM, followed by the comprehensive audit next Wednesday.\n2. Option B (Full-Scope with Temporary Surge Resources): Onboard two senior technical auditors from the enterprise pool to complete the full scope by Monday noon.\n\nPlease let me know your preferred trajectory so we can mobilize immediately.',
    politenessScore: 96,
    assertivenessScore: 92,
    clarityScore: 95,
    tacticalNotes: 'Replaces defensive rejection with positive commitment to quality, highlights corporate risk mitigation, and offers two concrete executive solutions instead of a dead end.'
  },
  {
    id: 'ed2',
    title: 'Initiating a Performance-Based Salary & Promotion Review',
    corporateContext: 'You have consistently exceeded quarterly deliverables, onboarded junior teammates, and expanded department revenue by 24% over the past year.',
    rawDraft: 'Hey, I think I deserve a raise and title bump to Senior Lead. I have worked way more hours than anyone else and brought in lots of new revenue, and other companies are paying higher.',
    diplomaticRewrite: 'Hi Marcus,\n\nI hope your week is off to a productive start. Over the past twelve months, I have thoroughly enjoyed spearheading our market expansion initiatives and collaborating with our exceptionally talented team.\n\nReflecting on our annual trajectory, our initiatives expanded regional recurring revenue by 24% and reduced onboarding cycle times for new engineers from six weeks to eighteen days. Given the evolution of my responsibilities into strategic architecture and team mentorship, I would welcome the opportunity to schedule a 30-minute discussion next week to review my recent performance impact and discuss aligning my title and compensation with the Senior Technical Lead scope.\n\nI have compiled a brief dossier of project milestones and revenue metrics for your review ahead of our sync. Please let me know what day best suits your calendar.',
    politenessScore: 98,
    assertivenessScore: 94,
    clarityScore: 96,
    tacticalNotes: 'Anchors the conversation in indisputable quantified business value (24% revenue lift, onboarding reduction) and proactive professionalism rather than grievance or outside market threats.'
  },
  {
    id: 'ed3',
    title: 'De-escalating an Angry High-Value Enterprise Client Dispute',
    corporateContext: 'A major client experienced an unexpected 45-minute service latency degradation during peak trading hours and threatened contract cancellation.',
    rawDraft: 'We saw your complaint. The outage was not our fault; Amazon AWS had a cloud network glitch that affected everyone. We fixed it as fast as we could so please stop sending angry emails.',
    diplomaticRewrite: 'Dear Mr. Henderson,\n\nI want to personally acknowledge the gravity of this morning’s 45-minute latency spike during your critical trading window and express our sincere regret for the disruption this caused to your operations.\n\nWe recognize that uninterrupted availability is the bedrock of our partnership. Our root-cause investigation is already underway under the personal direction of our Head of Infrastructure. While the initial trigger stemmed from upstream cloud routing instability, our engineering team has implemented redundant fallback failover protocols to prevent any recurrence.\n\nI would like to extend an invitation for an executive technical debrief with our leadership team tomorrow at 10:00 AM EST, where we will present our full Incident Post-Mortem alongside proactive service credits in accordance with our Enterprise SLA commitments.\n\nYour trust is our paramount priority, and we remain dedicated to demonstrating that standard.',
    politenessScore: 99,
    assertivenessScore: 90,
    clarityScore: 97,
    tacticalNotes: 'Validates client distress without admitting reckless liability, transparently shares corrective architectural remedies, and pairs an executive post-mortem with contractual SLA credits.'
  }
];

export const elevatorPitchPrompts: ElevatorPitchPrompt[] = [
  {
    id: 'ep1',
    title: 'The 60-Second Tech Startup Pitch (135–150 WPM Target)',
    scenario: 'You are pitching an AI-driven adaptive learning infrastructure to an angel investor in an elevator.',
    targetSeconds: 60,
    bulletPoints: [
      'Problem: Rigid curricula fail 60% of students due to one-size-fits-all pacing',
      'Solution: Real-time neural knowledge mapping that adapts in micro-steps',
      'Market & Traction: 40k active students, 88% course completion vs 12% industry baseline',
      'The Ask: $1.2M seed round to scale school district pilots'
    ],
    modelScript: 'Traditional digital education suffers from a fatal flaw: it treats a five-year-old child and a senior learner with the exact same rigid conveyor belt. That is why industry course completion hovers at an abysmal twelve percent. At EduBridge, we engineered an adaptive neural learning bridge that customizes pedagogical delivery across five distinct human developmental stages—from phonics microlearning to executive diplomacy. In just eight months of pilot testing, over forty thousand active learners logged two million practice modules, achieving an unprecedented eighty-eight percent mastery rate. We are currently raising a one-point-two million dollar seed tranche to expand into thirty-five regional school districts. If you believe education should adapt to human beings rather than forcing humans to adapt to software, I would welcome fifteen minutes next Tuesday to share our investor deck.',
    wpmTarget: '140 WPM (144 words in 60 seconds)'
  },
  {
    id: 'ep2',
    title: 'Executive Promotion Candidate Pitch (130–145 WPM Target)',
    scenario: 'Presenting your readiness for Director of Engineering to your Chief Technology Officer.',
    targetSeconds: 60,
    bulletPoints: [
      'Delivered 99.99% system availability through platform modernization',
      'Reduced cloud compute expenditure by $420,000 annually',
      'Promoted 4 internal engineers and halved employee churn',
      'Vision: Unify platform infrastructure and AI tooling under a single velocity engine'
    ],
    modelScript: 'Over the last two years leading our core platform engineering pod, our primary charter was transforming our legacy architecture into a rock-solid, cloud-native foundation. Today, our services boast ninety-nine point nine nine percent availability, while our autonomous container optimization reduced annual cloud expenditure by four hundred and twenty thousand dollars. More importantly, we built a culture where high-performing talent thrives: four engineers on our team earned internal promotions this cycle, and our departmental retention reached ninety-five percent. As we scale into next year’s multi-region expansion, our organization requires engineering leadership that pairs technical rigor with human mentorship. I am eager to step into the Director role to scale our engineering velocity and build the most resilient platform in our sector.',
    wpmTarget: '135 WPM (138 words in 60 seconds)'
  }
];

// 5. Ages 55+: Golden Age Word Association Memory Gym, Reminiscence & Digital Safety
export const memoryGymPairs: MemoryGymPair[] = [
  { id: 'mg1', wordA: 'Meadow', wordB: 'Wildflowers', semanticConnection: 'Both evoke blooming countryside landscapes and gentle summer warmth.', icon: '🌸' },
  { id: 'mg2', wordA: 'Compass', wordB: 'Direction', semanticConnection: 'A compass guides navigation across uncharted paths and journeys.', icon: '🧭' },
  { id: 'mg3', wordA: 'Telescope', wordB: 'Starlight', semanticConnection: 'Telescopes gather ancient starlight traveling across galaxies.', icon: '🔭' },
  { id: 'mg4', wordA: 'Orchestra', wordB: 'Symphony', semanticConnection: 'Musicians unite with violins and cellos to weave a rich harmonious symphony.', icon: '🎻' },
  { id: 'mg5', wordA: 'Lighthouse', wordB: 'Harbor', semanticConnection: 'The lighthouse beams a safe warning to guide sailors into peaceful harbor.', icon: '🏮' },
  { id: 'mg6', wordA: 'Bookshelf', wordB: 'Wisdom', semanticConnection: 'Volumes collected over decades preserve enduring human wisdom and memories.', icon: '📚' },
  { id: 'mg7', wordA: 'Harvest', wordB: 'Autumn', semanticConnection: 'Golden crops and falling amber leaves signify the rich autumn bounty.', icon: '🍁' },
  { id: 'mg8', wordA: 'Anchor', wordB: 'Steadfast', semanticConnection: 'An anchor provides steadfast grounding against shifting ocean tides.', icon: '⚓' }
];

export const reminiscencePrompts: ReminiscencePrompt[] = [
  {
    id: 'rp1',
    title: 'The Kitchen Scents of Childhood',
    category: 'Sensory Memory',
    promptText: 'Close your eyes and think back to the kitchen where you grew up or visited as a child. What aromas greeted you on weekend mornings? Freshly baked bread, simmered apples, or spiced tea?',
    reflectiveQuestion: 'Who was preparing that meal, and what feeling of warmth or comfort did it bring to your day?'
  },
  {
    id: 'rp2',
    title: 'A Song That Transports You Through Time',
    category: 'Music & Nostalgia',
    promptText: 'Music possesses an extraordinary power to trigger vivid memories. Think of a song or melody that instantly returns you to your teenage years or early adulthood.',
    reflectiveQuestion: 'Where were you when you first fell in love with this song, and who were you with?'
  },
  {
    id: 'rp3',
    title: 'The Best Piece of Advice You Ever Received',
    category: 'Wisdom & Life Lessons',
    promptText: 'Throughout life, certain words spoken by a parent, mentor, friend, or grandparent remain anchored in our hearts during difficult crossings.',
    reflectiveQuestion: 'What were those words, who gifted them to you, and how did they guide your decisions?'
  },
  {
    id: 'rp4',
    title: 'A Landscape That Left You in Awe',
    category: 'Places & Journeys',
    promptText: 'Recall a breathtaking place in nature—a quiet mountain summit, a stormy coastline, or a peaceful sunlit garden—that made the world feel expansive and still.',
    reflectiveQuestion: 'What specific colors, sounds, and sensations made that moment unforgettable?'
  }
];

export const digitalSafetyGuides: DigitalSafetyGuide[] = [
  {
    id: 'dsg1',
    title: 'How to Spot and Defend Against Phishing Emails',
    threatType: 'Phishing Email',
    description: 'Scammers forge deceptive emails impersonating trusted institutions (such as banks, Medicare, or tax authorities) urging urgent account verification.',
    redFlags: [
      'Urgent threats such as "Your account will be suspended within 24 hours!"',
      'The sender email address looks odd (e.g. support@secure-bank-verify99.net instead of @chase.com)',
      'Generic greetings such as "Dear Customer" or "Valued Client" instead of your name',
      'Embedded links that point to strange web addresses when hovered over'
    ],
    safeActionProtocol: 'Never click links inside unexpected warning emails. Open a fresh web browser tab, type your bank’s official web address manually, or call the phone number printed on the back of your physical card.',
    interactiveScenario: {
      previewText: 'Subject: URGENT: Your Debit Card has been restricted! Click http://verify-secure-card-update.info/login to unblock immediately or face a $150 penalty.',
      isScam: true,
      explanation: 'This is a dangerous phishing attempt! Banks never use artificial domain names like verify-secure-card-update.info or demand urgent password verification with fee threats.'
    }
  },
  {
    id: 'dsg2',
    title: 'Fake Package Delivery & Courier SMS Text Alerts',
    threatType: 'Fake SMS Alert',
    description: 'Fraudulent text messages claim an undelivered parcel is stuck at customs or the postal depot and demands a $1.85 processing fee.',
    redFlags: [
      'Texts arriving from random 10-digit mobile numbers with shortened bit.ly or strange URL links',
      'Asking you to pay an immediate small fee ($1 to $3) with your credit card to release a package',
      'Vague package references without sender details or standard tracking numbers'
    ],
    safeActionProtocol: 'Delete the message immediately. If you are expecting a genuine delivery, open the official USPS, UPS, or FedEx app directly and check the tracking number you received when purchasing.',
    interactiveScenario: {
      previewText: 'US-Postal Notice: Your parcel 9400-1118 cannot be routed due to an incomplete home address. Please update your details and pay the $1.20 redelivery fee here: bit.ly/usps-reship-99.',
      isScam: true,
      explanation: 'Official postal services do not text from random numbers with bit.ly links demanding credit card payments for address corrections.'
    }
  },
  {
    id: 'dsg3',
    title: 'Creating Memorable, Unbreakable Passphrases and Two-Factor Authentication',
    threatType: 'Password & 2FA',
    description: 'Short single passwords like "Summer2023!" can be cracked by automated computer scripts in minutes. Strong passphrases protect your accounts effortlessly.',
    redFlags: [
      'Using birthdays, pet names, or consecutive numbers (123456)',
      'Reusing the exact same password across email, banking, and shopping sites',
      'Sharing two-factor authentication 6-digit codes over the phone with anyone claiming to be "support"'
    ],
    safeActionProtocol: 'Use a Passphrase of four random friendly words: e.g. "PurpleTurtleJumpsHigh!". Enable Two-Factor Authentication (2FA) so logins require a verification code sent to your personal phone.',
    interactiveScenario: {
      previewText: 'A friendly caller says: "Hello, this is Microsoft Security. We detect a virus on your computer. Please read aloud the 6-digit code we just sent to your phone so we can disinfect your machine."',
      isScam: true,
      explanation: 'This is a telephone scam! Legitimate technology companies never cold-call households. That 6-digit code was their attempt to break into your email or bank account!'
    }
  }
];

// Curated Resource Vault (Printable & Downloadable Resource Hub)
export const resourceVaultItems: ResourceVaultItem[] = [
  {
    id: 'rv1',
    cohort: 'early',
    cohortLabel: 'Ages 5–8: Little Explorers',
    title: 'Complete Phonics A–Z Chart & Sound Blends Reference',
    category: 'Early Phonics & Reading',
    description: 'Printable alphabet sound sheet with phonetic vowel markers, consonants, and key blends (SH, CH, TH, OO) for early readers.',
    badge: 'Montessori Phonics',
    downloadFilename: 'EduBridge-Early-Phonics-Reference-Ages5-8.txt',
    printableContent: `=====================================================
EDUBRIDGE UNIVERSAL OPEN LEARNING PLATFORM
RESOURCE VAULT: EARLY CHILDHOOD PHONICS & BLENDS (AGES 5-8)
=====================================================

A is for Apple  • /æ/   • "The sweet red apple."
B is for Bear   • /b/   • "The brown bear loves honey."
C is for Cat    • /k/   • "The playful cat purrs."
D is for Duck   • /d/   • "The yellow duck swims."
E is for Elephant • /ɛ/ • "The gentle elephant waves."
F is for Fish   • /f/   • "The silver fish darts fast."
G is for Giraffe • /ɡ/  • "The tall giraffe nibbles leaves."
H is for Horse  • /h/   • "The strong horse trots."
I is for Igloo  • /ɪ/   • "The cozy ice igloo."
J is for Jellyfish • /dʒ/ • "The glowing sea jellyfish."
K is for Kite   • /k/   • "The high flying kite."
L is for Lion   • /l/   • "The proud golden lion."
M is for Monkey • /m/   • "The playful swinging monkey."
N is for Nest   • /n/   • "Warm twigs in the bird nest."
O is for Owl    • /ɒ/   • "The wise night owl."
P is for Panda  • /p/   • "The happy bamboo panda."
Q is for Queen  • /kw/  • "The queen in her royal crown."
R is for Rainbow • /r/  • "Seven bright sky colors."
S is for Sun    • /s/   • "Warm morning sunshine."
T is for Tiger  • /t/   • "Bold orange and black stripes."
U is for Umbrella • /ʌ/ • "Dry under rainy skies."
V is for Violin • /v/   • "Sweet musical strings."
W is for Whale  • /w/   • "Mighty ocean swimmer."
X is for Xylophone • /ks/ • "Tapping pleasant chimes."
Y is for Yacht  • /j/   • "White sailing boat."
Z is for Zebra  • /z/   • "Running on the savannah."

SPECIAL PHONIC BLENDS:
• SH /ʃ/  - Quiet sound: Ship, Shell, Shoe
• CH /tʃ/ - Train chime: Cheese, Chair, Cherry
• TH /θ/  - Gentle tongue: Thumb, Think, Three
• OO /uː/ - Owl hoot: Moon, Book, Spoon

PRACTICE RULE: 10 minutes daily with cheer and high-fives!`
  },
  {
    id: 'rv2',
    cohort: 'junior',
    cohortLabel: 'Ages 9–14: Junior Scholars',
    title: 'Mental Math Superpower Shortcuts & Inquiry Guide',
    category: 'STEM & Math Fluency',
    description: 'Instant mental calculation algorithms: multiplying by 25, squaring numbers ending in 5, Gauss summation, and percentage breakdowns.',
    badge: 'Mental Math Logic',
    downloadFilename: 'EduBridge-Junior-Mental-Math-Shortcuts.txt',
    printableContent: `=====================================================
EDUBRIDGE UNIVERSAL OPEN LEARNING PLATFORM
RESOURCE VAULT: MENTAL MATH SUPERPOWER SHORTCUTS (AGES 9-14)
=====================================================

1. SQUARING NUMBERS ENDING IN 5:
   Rule: Multiply the tens digit by the next integer; append 25.
   • Example: 35² → Tens digit is 3.
     Next integer is 4.
     3 × 4 = 12.
     Append 25 → 1,225!
   • Example: 65² → 6 × 7 = 42 → 4,225!

2. MULTIPLYING ANY NUMBER BY 25 IN YOUR HEAD:
   Rule: Divide the number by 4, then multiply by 100.
   • Example: 48 × 25 → 48 ÷ 4 = 12 → 12 × 100 = 1,200!
   • Example: 84 × 25 → 84 ÷ 4 = 21 → 2,100!

3. FAST 15% AND 20% TIPS / PERCENTAGES:
   • Step 1: Find 10% by shifting the decimal point one place left ($64.00 → $6.40).
   • Step 2: Half of 10% gives 5% ($3.20).
   • Step 3: Add them together for 15%: $6.40 + $3.20 = $9.60!

4. GAUSS SUMMATION (1 + 2 + 3 + ... + N):
   Formula: [N × (N + 1)] ÷ 2
   • Sum of 1 to 20: 20 × 21 ÷ 2 = 10 × 21 = 210!
   • Sum of 1 to 100: 100 × 101 ÷ 2 = 50 × 101 = 5,050!`
  },
  {
    id: 'rv3',
    cohort: 'academy',
    cohortLabel: 'Ages 15–24: Academy & Exams',
    title: 'IELTS/PTE Band 9 Essay Architecture & T/F/NG Matrix',
    category: 'High-Stakes Exam Suite',
    description: 'Complete 4-paragraph academic essay blueprint, Band 9 discourse connectors, and the definitive True vs False vs Not Given decision tree.',
    badge: 'Official Rubric Master',
    downloadFilename: 'EduBridge-Band9-Essay-TFNG-Rubric-Vault.txt',
    printableContent: `=====================================================
EDUBRIDGE UNIVERSAL OPEN LEARNING PLATFORM
RESOURCE VAULT: BAND 9 ESSAY BLUEPRINT & T/F/NG MATRIX (AGES 15-24)
=====================================================

PART 1: THE BAND 9 4-PARAGRAPH ESSAY STRUCTURE:

PARAGRAPH 1: INTRODUCTION (45-55 words)
• Sentence 1 (Hook / Paraphrase): Rephrase the prompt with academic synonymy.
• Sentence 2 (Concession): "While it is frequently argued that [Opposing View]..."
• Sentence 3 (Thesis Statement): "...this essay will contend that [Clear Direct Position] because of [Reason A] and [Reason B]."

PARAGRAPH 2: PRIMARY ARGUMENT (90-100 words)
• Topic Sentence: "Chief among the justifications for [Position] is [Reason A]."
• Elaboration: Explain the causal mechanism.
• Concrete Example: Real-world citation or empirical observation.
• Concluding Synthesis: Tie back to main thesis.

PARAGRAPH 3: COUNTER-ARGUMENT & REFUTATION (90-100 words)
• Concession: "Admittedly, skeptics contend that [Counterpoint]..."
• Disassembly: "...nevertheless, this assertion overlooks the pivotal reality that [Rebuttal]."
• Evidence: Concrete illustrative consequence.

PARAGRAPH 4: CONCLUSION (40-50 words)
• Summary: "In conclusion, despite [acknowledged nuance], the preponderance of evidence indicates [rephrased thesis]."
• Forward Foresight: "Moving forward, unless [Action is taken], society risks [Consequence]."

-----------------------------------------------------
PART 2: TRUE / FALSE / NOT GIVEN (T/F/NG) DECISION TREE:

• TRUE: The statement expresses the EXACT SAME meaning as the passage via accurate paraphrasing.
• FALSE: The passage explicitly states the DIRECT OPPOSITE or a mutually exclusive fact.
• NOT GIVEN: The passage neither confirms nor denies the claim. Even if the statement is true in real life, if the text does not mention it, the answer is strictly NOT GIVEN!`
  },
  {
    id: 'rv4',
    cohort: 'pro',
    cohortLabel: 'Ages 25–54: Professional Fluency',
    title: 'Executive Email Diplomacy & Salary Negotiation Cheat-Sheet',
    category: 'Workplace Fluency',
    description: 'Tactical phrasing scripts for pushing back on unrealistic deadlines, handling difficult stakeholders, and negotiating promotions with quantified data.',
    badge: 'Executive Fluency',
    downloadFilename: 'EduBridge-Executive-Email-Diplomacy-Scripts.txt',
    printableContent: `=====================================================
EDUBRIDGE UNIVERSAL OPEN LEARNING PLATFORM
RESOURCE VAULT: EXECUTIVE EMAIL DIPLOMACY & SALARY SCRIPTS (AGES 25-54)
=====================================================

1. HOW TO PUSH BACK ON UNREALISTIC DEADLINES WITHOUT SAYING "NO":
   Weak: "We cannot do this by Friday, it's impossible."
   Diplomatic: "To ensure this project receives the analytical rigor leadership expects without introducing compliance risks, delivering by Friday would require pruning [Scope Item B]. Alternatively, we can deliver the full comprehensive scope by next Tuesday. Which option best aligns with your timeline?"

2. PREVENTING SCOPE CREEP DIPLOMATICALLY:
   Weak: "That's not in the contract."
   Diplomatic: "I would be thrilled to incorporate this feature! Because it expands beyond our agreed initial sprint scope, I have drafted an addendum outlining the associated timeline adjustment (+4 business days). Shall we proceed with this revised schedule?"

3. PERFORMANCE-BASED SALARY & TITLE ALIGNMENT SCRIPT:
   "Given the expansion of my scope over the past twelve months—including a 24% increase in client revenue and reducing onboarding cycles by 50%—I would welcome 30 minutes to review my business impact and discuss calibrating my compensation with the Senior Lead benchmark."

4. 60-SECOND ELEVATOR PITCH PACING RULE:
   • Target Cadence: 130 to 150 words per minute.
   • Rule of Three: Problem (15s) → Solution & Metric (30s) → Clear Call to Action (15s).`
  },
  {
    id: 'rv5',
    cohort: 'senior',
    cohortLabel: 'Ages 55+: Golden Age',
    title: 'Everyday Digital Safety & Cognitive Vitality Checklist',
    category: 'Senior Safety & Vitality',
    description: 'Pocket guide to identifying phishing scams, phone spoofing, secure password generation, and daily brain health exercises.',
    badge: 'Lifelong Vitality',
    downloadFilename: 'EduBridge-Senior-Digital-Safety-Checklist.txt',
    printableContent: `=====================================================
EDUBRIDGE UNIVERSAL OPEN LEARNING PLATFORM
RESOURCE VAULT: SENIOR DIGITAL SAFETY & VITALITY CHECKLIST (AGES 55+)
=====================================================

GOLDEN RULES OF DIGITAL SAFETY:

1. THE "STOP & BREATHE" RULE:
   Scammers create artificial urgency ("Your account will close in 1 hour!"). Whenever a message demands immediate panic action, pause and breathe. Legitimate institutions never close accounts without written notices.

2. SUSPICIOUS PHONE CALLS:
   • If someone calls claiming to be from Microsoft, Apple, Medicare, or your bank, HANG UP immediately.
   • Look up the official customer service number printed on your physical billing statement or credit card and call them directly.

3. TEXT MESSAGE SCAMS:
   • Never click links in texts claiming you have a stuck package with a $1.50 fee.
   • Never share 6-digit verification codes over the phone with anyone.

4. THE 4-WORD PASSPHRASE METHOD:
   Instead of hard-to-remember passwords with random symbols, choose four friendly unrelated words:
   "BlueCastleDancesSunny" - Easy for you to remember, practically impossible for computer scripts to crack!

5. DAILY COGNITIVE VITALITY HABITS:
   • 15 minutes of word association or crossword puzzles.
   • Write one memory in your reflective journal each evening.
   • Listen to articulate audiobooks or speech narrations at a gentle 0.82x pace.`
  }
];

