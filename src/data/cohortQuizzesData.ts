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
  {
    id: 'eq7',
    cohort: 'early',
    educationLevel: 'Early Primary & Phonics (Ages 5–8)',
    word: 'TREE',
    phonetic: '/triː/',
    category: 'Nature & Plants',
    prompt: 'What grows tall from a little acorn into a sturdy plant with green leaves? 🌳',
    options: ['A leafy green tree 🌳', 'A fluffy white cloud ☁️', 'A cold bowl of ice cream 🍨', 'A wooden guitar 🎸'],
    correctAnswer: 'A leafy green tree 🌳',
    explanation: 'Trees have sturdy wooden trunks and leafy branches that provide cool shade.',
    audioPrompt: 'A tall tree grows leaves and gives cool shade!',
    praise: '🌳 Wonderful nature knowledge! Trees make our air clean!'
  },
  {
    id: 'eq8',
    cohort: 'early',
    educationLevel: 'Early Primary & Phonics (Ages 5–8)',
    word: 'FROG',
    phonetic: '/frɒɡ/',
    category: 'Animals & Phonics (FR)',
    prompt: 'Which green animal starts life as a swimming tadpole and hops on lily pads? 🐸',
    options: ['A green hopping frog 🐸', 'A soaring golden eagle 🦅', 'A swimming blue whale 🐋', 'A running spotted cheetah 🐆'],
    correctAnswer: 'A green hopping frog 🐸',
    explanation: 'Frogs are amphibians that begin life in water as tadpoles before growing legs to hop!',
    audioPrompt: 'A green frog hops happily on lily pads!',
    praise: '🐸 Ribbit! You identified the hopping frog!'
  },
  {
    id: 'eq9',
    cohort: 'early',
    educationLevel: 'Early Primary & Phonics (Ages 5–8)',
    word: 'APPLE',
    phonetic: '/ˈæp.əl/',
    category: 'Healthy Foods & Colors',
    prompt: 'Which sweet, crunchy fruit is often bright red and grows on orchard branches? 🍎',
    options: ['A crisp red apple 🍎', 'A salty potato chip 🥔', 'A glass of cold water 💧', 'A round soccer ball ⚽'],
    correctAnswer: 'A crisp red apple 🍎',
    explanation: 'Apples are nutritious fruits packed with fiber and vitamins.',
    audioPrompt: 'A crunchy red apple is sweet and healthy!',
    praise: '🍎 Delicious job! Apples keep you healthy and strong!'
  },
  {
    id: 'eq10',
    cohort: 'early',
    educationLevel: 'Early Primary & Phonics (Ages 5–8)',
    word: 'RAINBOW',
    phonetic: '/ˈreɪn.boʊ/',
    category: 'Weather & Wonders',
    prompt: 'What beautiful colorful arc appears in the sky when sunshine meets raindrops? 🌈',
    options: ['A colorful rainbow 🌈', 'A dark thunderstorm cloud ⛈️', 'A snowy mountain peak 🏔️', 'A wooden rowboat ⛵'],
    correctAnswer: 'A colorful rainbow 🌈',
    explanation: 'Rainbows form when sunlight refracts through raindrops into red, orange, yellow, green, blue, and purple bands.',
    audioPrompt: 'A colorful rainbow shines after gentle rain!',
    praise: '🌈 Magical work! You know the vibrant rainbow!'
  },
  {
    id: 'eq11',
    cohort: 'early',
    educationLevel: 'Early Primary & Phonics (Ages 5–8)',
    word: 'BOOK',
    phonetic: '/bʊk/',
    category: 'Reading & Sight Words',
    prompt: 'What do you open to read exciting bedtime stories with magical pictures? 📖',
    options: ['A storybook 📚', 'A refrigerator door 🚪', 'A warm winter sock 🧦', 'A pair of roller skates 🛼'],
    correctAnswer: 'A storybook 📚',
    explanation: 'Books are filled with words and drawings that transport your imagination to fun adventures.',
    audioPrompt: 'Open a storybook to read magical adventures!',
    praise: '📚 Super reader! Books unlock your imagination!'
  },
  {
    id: 'eq12',
    cohort: 'early',
    educationLevel: 'Early Primary & Phonics (Ages 5–8)',
    word: 'MOON',
    phonetic: '/muːn/',
    category: 'Space & Nighttime',
    prompt: 'What glows peacefully in the dark night sky while the world sleeps? 🌙',
    options: ['The glowing crescent moon 🌙', 'A bright yellow traffic light 🚦', 'A roaring campfire 🔥', 'A spinning ceiling fan 🌀'],
    correctAnswer: 'The glowing crescent moon 🌙',
    explanation: 'The moon orbits the Earth and reflects the sun’s light in the night sky.',
    audioPrompt: 'The gentle moon glows in the nighttime sky!',
    praise: '🌙 Sweet dreams! You know the lovely nighttime moon!'
  },
  {
    id: 'eq13',
    cohort: 'early',
    educationLevel: 'Early Primary & Phonics (Ages 5–8)',
    word: 'DUCK',
    phonetic: '/dʌk/',
    category: 'Farm Animals & Sounds',
    prompt: 'Which cheerful yellow water bird says "Quack, quack!" and waddles on orange feet? 🦆',
    options: ['A cheerful duck 🦆', 'A roaring brown bear 🐻', 'A buzzing black bee 🐝', 'A slithering green snake 🐍'],
    correctAnswer: 'A cheerful duck 🦆',
    explanation: 'Ducks have waterproof feathers and webbed feet that paddle effortlessly through pond water.',
    audioPrompt: 'The friendly duck paddles and says quack quack!',
    praise: '🦆 Quack-tastic! You got the friendly duck!'
  },
  {
    id: 'eq14',
    cohort: 'early',
    educationLevel: 'Early Primary & Phonics (Ages 5–8)',
    word: 'CLOCK',
    phonetic: '/klɒk/',
    category: 'Everyday Objects',
    prompt: 'What object has numbers and ticking hands that tell us what time it is? ⏰',
    options: ['A wall clock ⏰', 'A soft sleeping pillow 🛌', 'A warm bowl of soup 🥣', 'A red drawing crayon 🖍️'],
    correctAnswer: 'A wall clock ⏰',
    explanation: 'Clocks measure hours, minutes, and seconds so we know when to learn, play, and sleep.',
    audioPrompt: 'A ticking clock shows what time it is!',
    praise: '⏰ Timely brilliance! You know how to tell time!'
  },
  {
    id: 'eq15',
    cohort: 'early',
    educationLevel: 'Early Primary & Phonics (Ages 5–8)',
    word: 'MILK',
    phonetic: '/mɪlk/',
    category: 'Healthy Living',
    prompt: 'What healthy white drink is rich in calcium to build strong teeth and bones? 🥛',
    options: ['Cold fresh milk 🥛', 'Hot tomato soup 🍲', 'Orange carrot juice 🥕', 'Sparkling fizzy soda 🥤'],
    correctAnswer: 'Cold fresh milk 🥛',
    explanation: 'Milk provides calcium and vitamin D to help children grow strong bones.',
    audioPrompt: 'Fresh milk builds strong teeth and healthy bones!',
    praise: '🥛 Super strong! Milk gives you growing power!'
  },
  {
    id: 'eq16',
    cohort: 'early',
    educationLevel: 'Early Primary & Phonics (Ages 5–8)',
    word: 'HEART',
    phonetic: '/hɑːrt/',
    category: 'Feelings & Symbols',
    prompt: 'Which symbol is universally recognized for love, caring, and kindness? ❤️',
    options: ['A red heart ❤️', 'A sharp triangle 🔺', 'A cardboard box 📦', 'A straight ruler 📏'],
    correctAnswer: 'A red heart ❤️',
    explanation: 'The heart shape represents kindness, caring, and love for our family and friends.',
    audioPrompt: 'A warm heart represents love and caring!',
    praise: '❤️ Heartwarming! You are full of kindness and joy!'
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
  {
    id: 'jq6',
    cohort: 'junior',
    educationLevel: 'Elementary & Middle School (Ages 9–14)',
    word: 'GRAVITY',
    phonetic: '/ˈɡræv.ə.ti/',
    category: 'Physical Science',
    prompt: 'What fundamental invisible force pulls all objects with mass toward the center of the Earth?',
    options: [
      'Gravity, the universal attractive force proportional to mass',
      'Magnetic attraction from copper metal in soil',
      'Atmospheric friction blowing straight down',
      'Static electrical charges from clouds'
    ],
    correctAnswer: 'Gravity, the universal attractive force proportional to mass',
    explanation: 'Gravity is the fundamental force that keeps planets in orbit and pulls falling objects toward Earth at 9.8 m/s².',
    audioPrompt: 'Gravity pulls objects toward the center of the Earth.',
    praise: '🌍 Groundbreaking physics! Sir Isaac Newton would be proud.'
  },
  {
    id: 'jq7',
    cohort: 'junior',
    educationLevel: 'Elementary & Middle School (Ages 9–14)',
    word: 'EVAPORATION',
    phonetic: '/ɪˌvæp.əˈreɪ.ʃən/',
    category: 'Earth Science & Water Cycle',
    prompt: 'In the water cycle, what happens when liquid water on Earth’s surface absorbs solar heat?',
    options: [
      'It evaporates into invisible water vapor and ascends into the atmosphere',
      'It solidifies into igneous granite rock',
      'It sinks permanently into the Earth’s molten iron mantle',
      'It ceases to exist at the atomic level'
    ],
    correctAnswer: 'It evaporates into invisible water vapor and ascends into the atmosphere',
    explanation: 'Evaporation is the phase transition from liquid water to gas driven by thermal solar energy.',
    audioPrompt: 'Evaporation turns liquid water into vapor in the air.',
    praise: '💧 Superb hydrology! The water cycle powers global weather.'
  },
  {
    id: 'jq8',
    cohort: 'junior',
    educationLevel: 'Elementary & Middle School (Ages 9–14)',
    word: 'MITOCHONDRIA',
    phonetic: '/ˌmaɪ.toʊˈkɒn.dri.ə/',
    category: 'Cellular Biology',
    prompt: 'Why are MITOCHONDRIA famously called the "power plants" of eukaryotic cells?',
    options: [
      'They produce chemical ATP energy through cellular respiration',
      'They store digital genetic code like a computer flash drive',
      'They pump red blood cells through the circulatory veins',
      'They manufacture calcium purely for skeleton bone growth'
    ],
    correctAnswer: 'They produce chemical ATP energy through cellular respiration',
    explanation: 'Mitochondria break down nutrients through aerobic cellular respiration to generate adenosine triphosphate (ATP), the cell’s primary energy currency.',
    audioPrompt: 'Mitochondria produce ATP energy for cells.',
    praise: '⚡ Outstanding biology mastery! Mitochondria fuel every living movement.'
  },
  {
    id: 'jq9',
    cohort: 'junior',
    educationLevel: 'Elementary & Middle School (Ages 9–14)',
    word: 'ATMOSPHERE',
    phonetic: '/ˈæt.məs.fɪər/',
    category: 'Planetary Science',
    prompt: 'Which gas comprises the largest portion (approximately 78%) of Earth’s clean atmosphere?',
    options: [
      'Nitrogen gas (N₂)',
      'Pure Oxygen gas (O₂)',
      'Carbon dioxide gas (CO₂)',
      'Helium gas (He)'
    ],
    correctAnswer: 'Nitrogen gas (N₂)',
    explanation: 'Earth’s atmosphere is roughly 78% Nitrogen, 21% Oxygen, 0.9% Argon, and trace amounts of other gases.',
    audioPrompt: 'Nitrogen gas makes up about 78 percent of Earth’s atmosphere.',
    praise: '💨 Brilliant planetary knowledge! Most people guess oxygen, but nitrogen dominates!'
  },
  {
    id: 'jq10',
    cohort: 'junior',
    educationLevel: 'Elementary & Middle School (Ages 9–14)',
    word: 'METAPHOR',
    phonetic: '/ˈmet.ə.fər/',
    category: 'Literary Devices',
    prompt: 'In literary analysis, which sentence represents an authentic METAPHOR?',
    options: [
      '"Time is a thief that steals our precious hours."',
      '"She ran as fast as a cheetah across the field."',
      '"The car’s engine hummed like a busy bee."',
      '"He was very hungry before eating dinner."'
    ],
    correctAnswer: '"Time is a thief that steals our precious hours."',
    explanation: 'A metaphor asserts that one thing IS another to illuminate shared traits directly, without using "like" or "as" (which would be a simile).',
    audioPrompt: 'A metaphor states that one thing is another directly.',
    praise: '📖 Stellar literary analysis! You distinguished metaphor from simile.'
  },
  {
    id: 'jq11',
    cohort: 'junior',
    educationLevel: 'Elementary & Middle School (Ages 9–14)',
    word: 'ECOSYSTEM',
    phonetic: '/ˈiː.koʊˌsɪs.təm/',
    category: 'Ecology & Environmental Science',
    prompt: 'What constitutes an ECOSYSTEM in biological sciences?',
    options: [
      'A community of living organisms interacting with their physical, non-living environment',
      'An indoor aquarium containing only artificial plastic fish',
      'A digital spreadsheet tracking weather forecasts',
      'A collection of ancient dinosaur bones in a museum'
    ],
    correctAnswer: 'A community of living organisms interacting with their physical, non-living environment',
    explanation: 'An ecosystem encompasses biotic factors (plants, animals, microbes) interacting continuously with abiotic factors (sunlight, soil, water, climate).',
    audioPrompt: 'An ecosystem includes living organisms interacting with their physical surroundings.',
    praise: '🌿 Excellent ecological awareness! All parts of nature interconnect.'
  },
  {
    id: 'jq12',
    cohort: 'junior',
    educationLevel: 'Elementary & Middle School (Ages 9–14)',
    word: 'TECTONIC PLATES',
    phonetic: '/tekˈtɒn.ɪk pleɪts/',
    category: 'Geology & Earth Dynamics',
    prompt: 'What dramatic geological event frequently occurs along the boundary fault lines where tectonic plates grind against each other?',
    options: [
      'Earthquakes and volcanic eruptions',
      'Immediate collapse of Earth’s gravitational field',
      'Sudden permanent freezing of all world oceans',
      'Total cessation of atmospheric cloud formation'
    ],
    correctAnswer: 'Earthquakes and volcanic eruptions',
    explanation: 'Plate tectonics cause friction along fault lines; when accumulated stress suddenly slips, shockwaves travel through rock as earthquakes.',
    audioPrompt: 'Tectonic plate movement causes earthquakes and volcanoes.',
    praise: '🌋 Powerful geological reasoning! The Ring of Fire demonstrates plate boundaries.'
  },
  {
    id: 'jq13',
    cohort: 'junior',
    educationLevel: 'Elementary & Middle School (Ages 9–14)',
    word: 'HERBIVORE',
    phonetic: '/ˈhɜːr.bɪ.vɔːr/',
    category: 'Animal Ecology',
    prompt: 'An animal whose anatomical digestive system is adapted to consume exclusively plants, leaves, and vegetation is classified as a:',
    options: [
      'Herbivore (e.g. elephant, koala, deer)',
      'Carnivore (e.g. lion, polar bear, hawk)',
      'Parasite (e.g. mosquito, tapeworm)',
      'Decomposer (e.g. fungus, mushroom)'
    ],
    correctAnswer: 'Herbivore (e.g. elephant, koala, deer)',
    explanation: 'Herbivores possess specialized flat teeth and digestive enzymes to break down tough plant cellulose.',
    audioPrompt: 'Herbivores are animals that eat only plants and vegetation.',
    praise: '🐘 Spot-on biology! Herbivores form the foundational consumer tier.'
  },
  {
    id: 'jq14',
    cohort: 'junior',
    educationLevel: 'Elementary & Middle School (Ages 9–14)',
    word: 'CONDENSATION',
    phonetic: '/ˌkɒn.denˈseɪ.ʃən/',
    category: 'Physical Changes & Phase Transitions',
    prompt: 'When water vapor in the upper atmosphere cools and transforms into billions of tiny liquid water droplets that form visible clouds, the process is:',
    options: [
      'Condensation',
      'Sublimation',
      'Combustion',
      'Photosynthesis'
    ],
    correctAnswer: 'Condensation',
    explanation: 'Condensation occurs when gas cools, losing kinetic energy so molecules gather together into liquid droplets.',
    audioPrompt: 'Condensation turns water vapor into liquid cloud droplets.',
    praise: '☁️ High-altitude precision! Condensation builds storm clouds and morning dew.'
  },
  {
    id: 'jq15',
    cohort: 'junior',
    educationLevel: 'Elementary & Middle School (Ages 9–14)',
    word: 'SYMBIOSIS',
    phonetic: '/ˌsɪm.baɪˈoʊ.sɪs/',
    category: 'Ecological Relationships',
    prompt: 'When clownfish live safely inside stinging sea anemone tentacles and in return protect the anemone from butterflyfish, this mutually beneficial relationship is an example of:',
    options: [
      'Mutualistic Symbiosis (both species benefit)',
      'Predatory Hostility (one hunts the other)',
      'Parasitic Depletion (one damages the other)',
      'Accidental Competition (fighting for space)'
    ],
    correctAnswer: 'Mutualistic Symbiosis (both species benefit)',
    explanation: 'Mutualism is an evolutionary symbiosis where both organisms provide reciprocal biological benefits to each other.',
    audioPrompt: 'Mutualistic symbiosis is a relationship where both partners benefit.',
    praise: '🐠 Marine biology champion! Mutualism makes ocean ecosystems thrive.'
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
  {
    id: 'aq6',
    cohort: 'academy',
    educationLevel: 'High School & College Prep (Ages 15–24)',
    word: 'EMPIRICAL',
    phonetic: '/ɪmˈpɪr.ɪ.kəl/',
    category: 'Research Methodology',
    prompt: 'In academic discourse and clinical research, what defines EMPIRICAL evidence?',
    options: [
      'Evidence derived from verifiable observation, experiment, or sensory data rather than pure theory',
      'Personal opinions and unverified gossip circulating on social networks',
      'Ancient cultural traditions passed down without formal documentation',
      'Speculative mathematical guesses written without experimental verification'
    ],
    correctAnswer: 'Evidence derived from verifiable observation, experiment, or sensory data rather than pure theory',
    explanation: 'Empirical research relies on systematic quantitative or qualitative observation that can be independently reproduced and audited.',
    audioPrompt: 'Empirical evidence is based on observation and experiment.',
    praise: '📊 Elite research methodology! Empirical rigor is the hallmark of university scholarship.'
  },
  {
    id: 'aq7',
    cohort: 'academy',
    educationLevel: 'High School & College Prep (Ages 15–24)',
    word: 'DICHOTOMY',
    phonetic: '/daɪˈkɒt.ə.mi/',
    category: 'Critical Philosophy',
    prompt: 'In academic literary critiques and sociological analysis, what is a DICHOTOMY?',
    options: [
      'A sharp division or contrast between two contradictory or mutually exclusive entities',
      'A rhythmic fourteen-line sonnet with an ABAB rhyming scheme',
      'A grammatical flaw where pronouns do not agree with antecedent nouns',
      'A statistical curve that peaks at both ends of a standard deviation'
    ],
    correctAnswer: 'A sharp division or contrast between two contradictory or mutually exclusive entities',
    explanation: 'Dichotomies present binary models (e.g., nature vs. nurture, public vs. private) to analyze conceptual tension in formal essays.',
    audioPrompt: 'A dichotomy is a division between two contrasting things.',
    praise: '⚖️ Sharp philosophical acumen! High-scoring analytical framing.'
  },
  {
    id: 'aq8',
    cohort: 'academy',
    educationLevel: 'High School & College Prep (Ages 15–24)',
    word: 'EPISTEMOLOGY',
    phonetic: '/ɪˌpɪs.təˈmɒl.ə.dʒi/',
    category: 'Philosophy of Knowledge',
    prompt: 'What foundational inquiry forms the central domain of university EPISTEMOLOGY?',
    options: [
      'The nature, scope, justification, and limits of human knowledge',
      'The mineral crystallization temperature of volcanic metamorphic rocks',
      'The anatomical morphology of deep-sea crustacean appendages',
      'The chronological evolution of early medieval brass currencies'
    ],
    correctAnswer: 'The nature, scope, justification, and limits of human knowledge',
    explanation: 'Epistemology asks: "What is truth? How do we know what we know, and how is justified true belief distinguished from opinion?"',
    audioPrompt: 'Epistemology studies the nature and limits of human knowledge.',
    praise: '🏛️ Pure philosophical sophistication! Ivy League level lexical mastery.'
  },
  {
    id: 'aq9',
    cohort: 'academy',
    educationLevel: 'High School & College Prep (Ages 15–24)',
    word: 'CORRELATION VS CAUSATION',
    phonetic: '/ˌkɒr.əˈleɪ.ʃən/',
    category: 'Statistical Logic & Fallacies',
    prompt: 'Why must academic researchers strictly separate correlation from causation when reporting experimental data?',
    options: [
      'Because two variables trending together does not prove that one variable actively causes the other',
      'Because causal claims are prohibited in university peer review journals',
      'Because correlation only applies to physical mechanics and never economics',
      'Because statistics cannot analyze more than one variable at a time'
    ],
    correctAnswer: 'Because two variables trending together does not prove that one variable actively causes the other',
    explanation: 'Confounding variables often drive simultaneous trends (e.g., ice cream sales and sunburns correlate, but both are caused by summer heat).',
    audioPrompt: 'Correlation between two events does not prove causation.',
    praise: '📈 Flawless logical rigor! Avoids the post-hoc rationalization trap.'
  },
  {
    id: 'aq10',
    cohort: 'academy',
    educationLevel: 'High School & College Prep (Ages 15–24)',
    word: 'AD HOMINEM',
    phonetic: '/ˌæd ˈhɒm.ɪ.nem/',
    category: 'Logical Fallacies & Debate',
    prompt: 'In academic debate and argumentative essays, what constitutes an AD HOMINEM fallacy?',
    options: [
      'Attacking the opponent’s personal character or background instead of addressing their substantive evidence',
      'Presenting too many empirical charts in a peer-reviewed presentation',
      'Ending a research paper without posing an explicit rhetorical question',
      'Over-relying on peer-reviewed citations from Cambridge University Press'
    ],
    correctAnswer: 'Attacking the opponent’s personal character or background instead of addressing their substantive evidence',
    explanation: 'Ad hominem ("to the person") evades logical argumentation by attempting to discredit the claimant rather than the proposition itself.',
    audioPrompt: 'An ad hominem attack targets the person rather than the argument.',
    praise: '🛡️ Master rhetorician! Spotting ad hominem attacks protects scholarly integrity.'
  },
  {
    id: 'aq11',
    cohort: 'academy',
    educationLevel: 'High School & College Prep (Ages 15–24)',
    word: 'ANOMALOUS',
    phonetic: '/əˈnɒm.ə.ləs/',
    category: 'Scientific Register',
    prompt: 'When clinical trial telemetry yields ANOMALOUS readings, what does the research team document?',
    options: [
      'Results that deviate unexpectedly from standard baseline models or theoretical expectations',
      'Data points that are mathematically identical to historical control benchmarks',
      'Measurements that were automatically deleted by laboratory safety software',
      'Findings that were universally predicted by early Renaissance astronomers'
    ],
    correctAnswer: 'Results that deviate unexpectedly from standard baseline models or theoretical expectations',
    explanation: 'Anomalous observations often lead to scientific breakthroughs by exposing previously unrecognized phenomena.',
    audioPrompt: 'Anomalous results deviate from the normal or expected pattern.',
    praise: '🔬 Precise scientific register! Band 8.5+ IELTS collocation.'
  },
  {
    id: 'aq12',
    cohort: 'academy',
    educationLevel: 'High School & College Prep (Ages 15–24)',
    word: 'PRAGMATIC',
    phonetic: '/præɡˈmæt.ɪk/',
    category: 'Policy & Synthesis',
    prompt: 'A policy committee evaluating urban transport models from a PRAGMATIC perspective will prioritize:',
    options: [
      'Feasible, cost-effective, real-world utility and measurable implementation outcomes',
      'Uncompromising adherence to unproven ideological theories regardless of cost',
      'Selecting whatever transit plan utilizes the most obscure theoretical terminology',
      'Waiting fifty years for miraculous zero-cost hover technologies'
    ],
    correctAnswer: 'Feasible, cost-effective, real-world utility and measurable implementation outcomes',
    explanation: 'Pragmatism evaluates concepts based on practical consequences, feasibility, and functional success rather than abstract dogma.',
    audioPrompt: 'A pragmatic approach focuses on practical real-world results.',
    praise: '🎯 Pragmatic mastery! Excellent for Task 2 public policy arguments.'
  },
  {
    id: 'aq13',
    cohort: 'academy',
    educationLevel: 'High School & College Prep (Ages 15–24)',
    word: 'COHESION',
    phonetic: '/koʊˈhiː.ʒən/',
    category: 'IELTS Academic Writing',
    prompt: 'In IELTS Task 2 Academic Essay writing, which technique demonstrates high-scoring COHESION?',
    options: [
      'Seamless logical transitions, precise referencing, and balanced thematic paragraph progression',
      'Writing an 800-word block of uninterrupted text with zero paragraph breaks',
      'Replacing every normal verb with bizarre thesaurus synonyms that distort meaning',
      'Copying the exam prompt question repeatedly at the start of every sentence'
    ],
    correctAnswer: 'Seamless logical transitions, precise referencing, and balanced thematic paragraph progression',
    explanation: 'Cohesion and Coherence (CC) measures how ideas flow logically across sentences and paragraphs through cohesive signposting.',
    audioPrompt: 'Cohesion links ideas logically across sentences and paragraphs.',
    praise: '📝 Band 9 Cohesive Fluency! The golden metric for examiners.'
  },
  {
    id: 'aq14',
    cohort: 'academy',
    educationLevel: 'High School & College Prep (Ages 15–24)',
    word: 'SYNTHESIZE',
    phonetic: '/ˈsɪn.θə.saɪz/',
    category: 'Literature Review',
    prompt: 'When graduate literature reviews instruct scholars to SYNTHESIZE divergent research, what is expected?',
    options: [
      'Integrating multifaceted findings into a unified, critical conceptual framework with novel insights',
      'Copying the introductory abstracts of each paper into a simple alphabetical list',
      'Translating every paper into three different European languages without commentary',
      'Only citing researchers who share the same university department affiliation'
    ],
    correctAnswer: 'Integrating multifaceted findings into a unified, critical conceptual framework with novel insights',
    explanation: 'Synthesis moves beyond mere summarization by connecting thematic threads across disparate studies to construct an overarching perspective.',
    audioPrompt: 'To synthesize means to combine diverse ideas into a unified whole.',
    praise: '📚 Scholarly synthesis genius! Essential for dissertation excellence.'
  },
  {
    id: 'aq15',
    cohort: 'academy',
    educationLevel: 'High School & College Prep (Ages 15–24)',
    word: 'SUPERFLUOUS',
    phonetic: '/suːˈpɜː.flu.əs/',
    category: 'Academic Style & Editing',
    prompt: 'Why do academic editors recommend pruning SUPERFLUOUS prose from manuscripts?',
    options: [
      'Because redundant, unnecessary wordiness clutters argumentation and dilutes intellectual clarity',
      'Because all sentences in academic publishing must be fewer than four words long',
      'Because academic journals charge authors a tax for every verb used in a paper',
      'Because removing adjectives turns an essay into a mathematical formula'
    ],
    correctAnswer: 'Because redundant, unnecessary wordiness clutters argumentation and dilutes intellectual clarity',
    explanation: 'Superfluous language adds length without conveying substance. Elegant scholarship prizes economy of expression and high semantic density.',
    audioPrompt: 'Superfluous words are unnecessary and dilute clarity.',
    praise: '✂️ Sharp editorial clarity! Eliminating fluff elevates academic writing.'
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
  {
    id: 'pq5',
    cohort: 'pro',
    educationLevel: 'Professional & Career Fluency (Ages 25–54)',
    word: 'ROOT CAUSE ANALYSIS',
    phonetic: '/ruːt kɔːz/',
    category: 'Operational Excellence',
    prompt: 'When enterprise systems experience service degradation, what is the core objective of a "5 Whys" ROOT CAUSE ANALYSIS?',
    options: [
      'Iteratively interrogating underlying systemic vulnerabilities to prevent recurrence without assigning personal blame',
      'Determining which entry-level employee should be disciplined immediately',
      'Drafting a press release denying that any operational failure ever happened',
      'Cancelling all upcoming engineering sprints and firing external contractors'
    ],
    correctAnswer: 'Iteratively interrogating underlying systemic vulnerabilities to prevent recurrence without assigning personal blame',
    explanation: 'Root Cause Analysis shifts focus from superficial symptoms to deeper organizational or infrastructural bottlenecks, creating lasting system resilience.',
    audioPrompt: 'Root cause analysis investigates systemic failures to prevent recurrence.',
    praise: '🔍 Blameless post-mortem excellence! Cultivates resilient engineering culture.'
  },
  {
    id: 'pq6',
    cohort: 'pro',
    educationLevel: 'Professional & Career Fluency (Ages 25–54)',
    word: 'KEY PERFORMANCE INDICATOR',
    phonetic: '/ˌkeɪ piː ˈaɪ/',
    category: 'Executive Strategy',
    prompt: 'What critical characteristic separates a high-impact KPI from a superficial vanity metric?',
    options: [
      'A true KPI measures quantifiable actions that directly drive revenue, retention, or core organizational strategy',
      'A vanity metric takes more hours to calculate in complex financial spreadsheets',
      'High-impact KPIs are strictly classified and hidden from all company staff',
      'KPIs can only be denominated in cryptocurrency rather than fiat currency'
    ],
    correctAnswer: 'A true KPI measures quantifiable actions that directly drive revenue, retention, or core organizational strategy',
    explanation: 'Vanity metrics look impressive on paper (e.g. raw pageviews) but lack actionable correlation with business health, unlike true KPIs (e.g. net retention rate).',
    audioPrompt: 'A true KPI directly measures core business outcomes.',
    praise: '📊 Executive metrics precision! Focuses capital and talent where it counts.'
  },
  {
    id: 'pq7',
    cohort: 'pro',
    educationLevel: 'Professional & Career Fluency (Ages 25–54)',
    word: 'STAKEHOLDER ALIGNMENT',
    phonetic: '/ˈsteɪkˌhoʊl.dər/',
    category: 'Cross-Functional Leadership',
    prompt: 'How does an enterprise program director achieve genuine cross-functional STAKEHOLDER ALIGNMENT?',
    options: [
      'Facilitating structured discovery to uncover divergent department incentives and establishing shared success metrics',
      'Sending an all-caps email demanding immediate unilateral compliance from other VPs',
      'Cancelling all steering committee meetings and deploying software in secrecy',
      'Promising contradictory deliverables to marketing and engineering simultaneously'
    ],
    correctAnswer: 'Facilitating structured discovery to uncover divergent department incentives and establishing shared success metrics',
    explanation: 'Alignment bridges organizational silos by demonstrating how shared milestones advance each stakeholder’s individual departmental OKRs.',
    audioPrompt: 'Stakeholder alignment unites diverse teams behind shared milestones.',
    praise: '🤝 Diplomatic leadership mastery! Overcomes corporate friction seamlessly.'
  },
  {
    id: 'pq8',
    cohort: 'pro',
    educationLevel: 'Professional & Career Fluency (Ages 25–54)',
    word: 'SPRINT RETROSPECTIVE',
    phonetic: '/ˌret.rəˈspek.tɪv/',
    category: 'Agile Delivery',
    prompt: 'What is the highest-value outcome of a bi-weekly agile SPRINT RETROSPECTIVE?',
    options: [
      'Empowering the team to openly evaluate operational friction and commit to targeted continuous process improvements',
      'Assigning public numerical rankings to developers based on lines of code written',
      'Deciding which squad member will work throughout the upcoming weekend',
      'Eliminating quality assurance testing stages to artificially double velocity'
    ],
    correctAnswer: 'Empowering the team to openly evaluate operational friction and commit to targeted continuous process improvements',
    explanation: 'Retrospectives build continuous delivery rhythm by converting team friction points into tangible, tracked action items for upcoming sprints.',
    audioPrompt: 'Retrospectives empower teams to continuously refine their workflows.',
    praise: '🚀 Agile excellence! Continuous improvement is the engine of high velocity.'
  },
  {
    id: 'pq9',
    cohort: 'pro',
    educationLevel: 'Professional & Career Fluency (Ages 25–54)',
    word: 'CHANGE MANAGEMENT',
    phonetic: '/tʃeɪndʒ ˈmæn.ɪdʒ.mənt/',
    category: 'Enterprise Transformation',
    prompt: 'When introducing a modern cloud platform across thousands of employees, why is CHANGE MANAGEMENT decisive?',
    options: [
      'Proactively guiding user adoption, workflow training, and emotional resistance to ensure high ROI and operational continuity',
      'Because modern enterprise software automatically configures itself without human intervention',
      'To eliminate the legal requirement for employee customer support desks entirely',
      'To lock down computer keyboards so employees cannot modify desktop wallpapers'
    ],
    correctAnswer: 'Proactively guiding user adoption, workflow training, and emotional resistance to ensure high ROI and operational continuity',
    explanation: 'Technological deployments fail when human factors are ignored. Change management (e.g. ADKAR model) secures cultural and behavioral adoption.',
    audioPrompt: 'Change management guides teams through organizational transitions.',
    praise: '🏢 Transformational leadership! Tech is only as successful as its adoption.'
  },
  {
    id: 'pq10',
    cohort: 'pro',
    educationLevel: 'Professional & Career Fluency (Ages 25–54)',
    word: 'OPPORTUNITY COST',
    phonetic: '/ˌɒp.əˈtʃuː.nə.ti kɒst/',
    category: 'Corporate Finance',
    prompt: 'In corporate capital allocation and product roadmap decisions, what does OPPORTUNITY COST quantify?',
    options: [
      'The potential economic value forfeited from the next best alternative when selecting a given investment',
      'The mandatory sales tax paid when purchasing office stationery supplies',
      'The exact hourly overtime wage paid to administrative support staff',
      'The volume discount negotiated on third-party cloud hosting contracts'
    ],
    correctAnswer: 'The potential economic value forfeited from the next best alternative when selecting a given investment',
    explanation: 'Every engineering sprint dedicated to Feature A represents the unbuilt value of Feature B. Savvy executives constantly weigh opportunity cost.',
    audioPrompt: 'Opportunity cost is the value forgone from the next best alternative.',
    praise: '💡 Astute financial acumen! Strategic allocation separates good leaders from great.'
  },
  {
    id: 'pq11',
    cohort: 'pro',
    educationLevel: 'Professional & Career Fluency (Ages 25–54)',
    word: 'PSYCHOLOGICAL SAFETY',
    phonetic: '/ˌsaɪ.kəˈlɒdʒ.ɪ.kəl/',
    category: 'Team Dynamics & Culture',
    prompt: 'What landmark Google enterprise research (Project Aristotle) proved PSYCHOLOGICAL SAFETY as the #1 driver of high performance?',
    options: [
      'Team members knowing they can voice dissent, admit errors, and take calculated risks without fear of mockery or retaliation',
      'Providing complimentary catered organic lunches and foosball tables in the office',
      'Recruiting talent exclusively from a small cluster of private academic institutions',
      'Instituting mandatory 70-hour work weeks monitored with screen-recording software'
    ],
    correctAnswer: 'Team members knowing they can voice dissent, admit errors, and take calculated risks without fear of mockery or retaliation',
    explanation: 'Psychological safety unlocks creativity and early bug detection because engineers speak up candidly before minor glitches escalate into outages.',
    audioPrompt: 'Psychological safety allows teams to take risks without fear of negative consequences.',
    praise: '🌟 World-class culture builder! Innovation requires safe vulnerability.'
  },
  {
    id: 'pq12',
    cohort: 'pro',
    educationLevel: 'Professional & Career Fluency (Ages 25–54)',
    word: 'SERVICE LEVEL AGREEMENT',
    phonetic: '/ˌes el ˈeɪ/',
    category: 'B2B Enterprise Contracts',
    prompt: 'In enterprise SaaS contracts, what is the contractually enforceable role of an SLA?',
    options: [
      'Establishing guaranteed uptime percentages, incident response latency, and financial credits for service breaches',
      'Providing a registry of the personal home addresses of corporate directors',
      'Prohibiting commercial clients from ever logging critical support tickets',
      'Authorizing cloud vendors to double subscription pricing without notice'
    ],
    correctAnswer: 'Establishing guaranteed uptime percentages, incident response latency, and financial credits for service breaches',
    explanation: 'An SLA (e.g. 99.99% "four nines" uptime) legally formalizes quality benchmarks and remedies if performance degrades.',
    audioPrompt: 'An SLA guarantees uptime and response times in commercial contracts.',
    praise: '📑 Commercial contract mastery! SLAs protect vendor trust and liability.'
  },
  {
    id: 'pq13',
    cohort: 'pro',
    educationLevel: 'Professional & Career Fluency (Ages 25–54)',
    word: 'SITUATION BEHAVIOR IMPACT',
    phonetic: '/ˌes biː ˈaɪ/',
    category: 'Managerial Coaching',
    prompt: 'When delivering constructive feedback during quarterly performance reviews, why is the SBI (Situation-Behavior-Impact) framework superior?',
    options: [
      'It anchors feedback in specific objective observations and measurable consequences rather than subjective personal attacks',
      'It delivers vague generalizations that allow managers to avoid difficult conversations',
      'It involves posting critical performance assessments on public company bulletin boards',
      'It eliminates the necessity for employees to speak or respond during evaluations'
    ],
    correctAnswer: 'It anchors feedback in specific objective observations and measurable consequences rather than subjective personal attacks',
    explanation: 'By pinpointing the Situation, describing observable Behavior, and explaining business Impact, defensiveness is dismantled into actionable growth.',
    audioPrompt: 'The SBI framework grounds feedback in objective facts and business impact.',
    praise: '🎯 Elite executive coach! High emotional intelligence and developmental clarity.'
  },
  {
    id: 'pq14',
    cohort: 'pro',
    educationLevel: 'Professional & Career Fluency (Ages 25–54)',
    word: 'RISK MITIGATION MATRIX',
    phonetic: '/rɪsk ˌmɪt.ɪˈɡeɪ.ʃən/',
    category: 'Enterprise Risk Management',
    prompt: 'Why do corporate audit committees maintain a Probability vs Impact RISK MATRIX?',
    options: [
      'To methodically prioritize contingency planning and insurance reserves toward high-likelihood, catastrophic-severity threats',
      'To forecast the exact day the Dow Jones index will fluctuate up or down',
      'To eliminate all operational uncertainties with complete 100% mathematical certainty',
      'To replace the requirement for external compliance audits and corporate cybersecurity'
    ],
    correctAnswer: 'To methodically prioritize contingency planning and insurance reserves toward high-likelihood, catastrophic-severity threats',
    explanation: 'Risk matrices separate manageable operational noise from existential enterprise vulnerabilities, focusing executive vigilance strategically.',
    audioPrompt: 'A risk matrix categorizes threats by likelihood and operational impact.',
    praise: '🛡️ Enterprise guardian acumen! Comprehensive risk governance.'
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
  },
  {
    id: 'sq6',
    cohort: 'senior',
    educationLevel: 'Golden Age & Lifelong Learning (Ages 55+)',
    word: 'SMISHING DEFENSE',
    phonetic: '/ˈsmɪʃ.ɪŋ/',
    category: 'Everyday Digital Safety',
    prompt: 'You receive an unexpected SMS text claiming: "Post Office: Your parcel has a pending customs fee of $1.85. Click bit.ly/post-fee-9 to release." What is the wise, secure action? 📦',
    options: [
      'Recognize this as a widespread postal text scam ("smishing"). Delete the message without clicking any link 🛡️',
      'Immediately click the link and enter your debit card number and home address',
      'Reply to the text with your banking password to prove who you are',
      'Call the unfamiliar number back and recite your Social Security details'
    ],
    correctAnswer: 'Recognize this as a widespread postal text scam ("smishing"). Delete the message without clicking any link 🛡️',
    explanation: 'Scammers send millions of fake delivery alerts hoping people click urgently. Authentic postal carriers leave physical paper notices or track via official portals.',
    audioPrompt: 'Never click parcel delivery links in unexpected text messages. Delete them safely.',
    praise: '🛡️ Brilliant scam defense! You protected your finances with calm wisdom.'
  },
  {
    id: 'sq7',
    cohort: 'senior',
    educationLevel: 'Golden Age & Lifelong Learning (Ages 55+)',
    word: 'MEMORY RETRIEVAL',
    phonetic: '/ˈmem.ər.i rɪˈtriː.vəl/',
    category: 'Cognitive Vitality',
    prompt: 'When experiencing a common "tip-of-the-tongue" moment where a familiar friend’s name is temporarily elusive, what is the most effective mental strategy? 🌸',
    options: [
      'Relaxing calmly and associating semantic clues (e.g. where you last saw them, their hobbies, initial letter) 🌸',
      'Panicking and believing your memory faculties are permanently lost',
      'Vowing to never speak in social gatherings for the remainder of the month',
      'Drinking five cups of dark espresso coffee in rapid succession'
    ],
    correctAnswer: 'Relaxing calmly and associating semantic clues (e.g. where you last saw them, their hobbies, initial letter) 🌸',
    explanation: 'Stress inhibits synaptic retrieval. Gentle contextual association bypasses temporary cognitive blocks and triggers natural neural recall.',
    audioPrompt: 'Relax and visualize context to gently recall elusive memories.',
    praise: '🧠 Peaceful cognitive mastery! Calming the mind unlocks instant recall.'
  },
  {
    id: 'sq8',
    cohort: 'senior',
    educationLevel: 'Golden Age & Lifelong Learning (Ages 55+)',
    word: 'BROWSER ADDRESS WISDOM',
    phonetic: '/ˈbraʊ.zər/',
    category: 'Online Confidence',
    prompt: 'When verifying that you are on your authentic bank’s website rather than a fraudulent lookalike copy, what should you inspect in the address bar? 🔒',
    options: [
      'The exact domain spelling (e.g. chase.com rather than chase-security-login99.xyz) and the secure lock icon 🔒',
      'Whether the website displays beautiful colorful landscape photos',
      'Whether the page headline has three exclamation points',
      'Whether the page background color matches your favorite shirt'
    ],
    correctAnswer: 'The exact domain spelling (e.g. chase.com rather than chase-security-login99.xyz) and the secure lock icon 🔒',
    explanation: 'Scammers can copy website logos, but they cannot legally register the authentic primary domain name. Checking domain spelling guarantees safety.',
    audioPrompt: 'Always inspect the exact spelling in your browser address bar.',
    praise: '🔍 Keen digital eye! You navigate the web with seasoned discernment.'
  },
  {
    id: 'sq9',
    cohort: 'senior',
    educationLevel: 'Golden Age & Lifelong Learning (Ages 55+)',
    word: 'GIFT CARD SCAM PROTOCOL',
    phonetic: '/ɡɪft kɑːrd/',
    category: 'Consumer Protection',
    prompt: 'If a caller claims to represent the IRS, Medicare, or local police and demands that you pay an urgent fee using retail gift cards (like Apple or Target), they are: 🚨',
    options: [
      '100% a criminal scammer. Legitimate government agencies NEVER demand payment via retail gift cards 🚨',
      'A genuine federal officer working under an emergency court order',
      'A standard official procedure for settling seasonal utility bills',
      'A special discount program authorized by the government'
    ],
    correctAnswer: '100% a criminal scammer. Legitimate government agencies NEVER demand payment via retail gift cards 🚨',
    explanation: 'Gift cards are like untraceable cash. No government department, utility, or law enforcement agency will ever ask for retail gift cards.',
    audioPrompt: 'Government agencies never demand payment using store gift cards. Hang up immediately.',
    praise: '🚨 Ironclad consumer defense! You saw right through the imposter.'
  },
  {
    id: 'sq10',
    cohort: 'senior',
    educationLevel: 'Golden Age & Lifelong Learning (Ages 55+)',
    word: 'RESTORATIVE SLEEP',
    phonetic: '/rɪˈstɔːr.ə.tɪv/',
    category: 'Brain Health & Wellness',
    prompt: 'How does consistent, restful nighttime sleep biologically support lifelong cognitive vitality? 🌙',
    options: [
      'The brain’s glymphatic system clears metabolic waste products and consolidates memory pathways 🌙',
      'Sleep causes brain tissue to permanently harden into mineral calcium',
      'Sleep has zero biological impact on human neurological processing',
      'Staying awake for 36 hours improves long-term semantic retention'
    ],
    correctAnswer: 'The brain’s glymphatic system clears metabolic waste products and consolidates memory pathways 🌙',
    explanation: 'During deep sleep, cerebrospinal fluid flows through brain tissue, washing away beta-amyloid proteins and consolidating daily learning into long-term memory.',
    audioPrompt: 'Restful sleep cleanses brain cells and strengthens memory banks.',
    praise: '🌙 Restorative wisdom! Deep sleep is your brain’s daily renewal spa.'
  },
  {
    id: 'sq11',
    cohort: 'senior',
    educationLevel: 'Golden Age & Lifelong Learning (Ages 55+)',
    word: 'SENSORY STIMULATION',
    phonetic: '/ˈsen.sər.i/',
    category: 'Neuroplastic Engagement',
    prompt: 'Engaging in tactile, creative hobbies like gardening, acoustic music, sketching, or pottery promotes cognitive reserve by: 🌿',
    options: [
      'Stimulating multifaceted neural pathways combining fine motor coordination with sensory feedback 🌿',
      'Causing finger muscles to lose flexibility and dexterity',
      'Restricting healthy blood circulation to the brain’s temporal lobes',
      'Eliminating the human psychological need for daily conversations'
    ],
    correctAnswer: 'Stimulating multifaceted neural pathways combining fine motor coordination with sensory feedback 🌿',
    explanation: 'Multisensory hobbies activate cross-regional brain networks, building cognitive reserve that protects against neurological decline.',
    audioPrompt: 'Creative tactile hobbies build rich neural connections throughout life.',
    praise: '🎨 Inspiring creative vitality! Your hands and mind work in joyful harmony.'
  },
  {
    id: 'sq12',
    cohort: 'senior',
    educationLevel: 'Golden Age & Lifelong Learning (Ages 55+)',
    word: 'SPACED RETRIEVAL',
    phonetic: '/speɪst rɪˈtriː.vəl/',
    category: 'Evidence-Based Learning',
    prompt: 'What scientifically proven learning habit involves reviewing cherished facts or vocabulary at gradually increasing time intervals? 🧠',
    options: [
      'Spaced Retrieval Practice (which systematically strengthens synaptic memory retention) 🧠',
      'Frantically cramming hundreds of pages into a single exhausting 8-hour session',
      'Never reviewing an article again after glancing at it once',
      'Copying newspaper articles backwards with a pencil'
    ],
    correctAnswer: 'Spaced Retrieval Practice (which systematically strengthens synaptic memory retention) 🧠',
    explanation: 'Spaced retrieval challenges the brain to recall information just as it begins to fade, cementing long-term synaptic connections with minimal effort.',
    audioPrompt: 'Spaced retrieval practice cements long-term memory effortlessly.',
    praise: '📚 Scientifically proven genius! Spaced recall is effortless mastery.'
  },
  {
    id: 'sq13',
    cohort: 'senior',
    educationLevel: 'Golden Age & Lifelong Learning (Ages 55+)',
    word: 'CREDIT VS DEBIT SAFETY',
    phonetic: '/ˈkred.ɪt/',
    category: 'Financial Peace of Mind',
    prompt: 'When ordering books or gifts on reputable online websites, why is using a major credit card generally safer than a direct debit card? 💳',
    options: [
      'Credit cards offer strict legal consumer fraud protections and do not expose your direct checking account balance 💳',
      'Debit cards automatically charge extra interest fees on every purchase',
      'Credit cards can never be reported lost or stolen to the issuer',
      'Banks do not allow debit cards to be used during daytime hours'
    ],
    correctAnswer: 'Credit cards offer strict legal consumer fraud protections and do not expose your direct checking account balance 💳',
    explanation: 'If a fraudulent charge occurs on a credit card, you dispute the bill without losing cash from your bank account while the bank investigates.',
    audioPrompt: 'Credit cards keep your primary bank account safe from unauthorized charges.',
    praise: '💳 Financially savvy! Separating everyday checking from web purchases brings peace of mind.'
  },
  {
    id: 'sq14',
    cohort: 'senior',
    educationLevel: 'Golden Age & Lifelong Learning (Ages 55+)',
    word: 'SOCIAL CONNECTEDNESS',
    phonetic: '/ˈsoʊ.ʃəl/',
    category: 'Emotional & Mental Vitality',
    prompt: 'Decades of longitudinal medical studies confirm that maintaining warm social ties with family, neighbors, and book clubs: 👥',
    options: [
      'Robustly defends against cognitive decline, enhances emotional wellbeing, and fosters longevity 👥',
      'Accelerates memory fatigue in mature individuals',
      'Impedes cognitive problem-solving capacities in older adults',
      'Has zero verifiable connection to cardiovascular or mental wellness'
    ],
    correctAnswer: 'Robustly defends against cognitive decline, enhances emotional wellbeing, and fosters longevity 👥',
    explanation: 'Social dialogue stimulates executive brain functions (active listening, empathy, humor) and significantly reduces neurological stress hormones.',
    audioPrompt: 'Staying socially connected stimulates the mind and warms the heart.',
    praise: '❤️ The greatest elixir of vitality! Lifelong connections nourish the soul.'
  },
  {
    id: 'sq15',
    cohort: 'senior',
    educationLevel: 'Golden Age & Lifelong Learning (Ages 55+)',
    word: 'DIGITAL MEMORY ARCHIVE',
    phonetic: '/ˈdɪdʒ.ɪ.təl/',
    category: 'Family Heritage',
    prompt: 'Why is copying irreplaceable family photos and voice recordings onto an external flash drive or cloud archive a wonderful family gift? 📸',
    options: [
      'It preserves treasured generational memories against accidental device failure, spills, or lost phones 📸',
      'It immediately erases all photos from your camera memory forever',
      'It stops all your family members from seeing your pictures ever again',
      'It changes the color of all original paper photos in scrapbooks'
    ],
    correctAnswer: 'It preserves treasured generational memories against accidental device failure, spills, or lost phones 📸',
    explanation: 'Digital backups ensure that precious milestones, weddings, and generational voices remain preserved for children and grandchildren forever.',
    audioPrompt: 'Backing up family memories keeps cherished moments safe for future generations.',
    praise: '📸 Timeless family steward! Preserving heritage is a gift of pure love.'
  }
];
