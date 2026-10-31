import { Unit } from '../types';

export const ieltsAcademicUnits: Unit[] = [
  {
    id: 'ielts_unit_1',
    unitNumber: 1,
    title: 'IELTS Band 8.5+ Academic Lexicon & Formal Collocations',
    description: 'Master high-density academic signposts, precision collocations, and formal transitionals for Writing and Speaking.',
    color: 'from-indigo-600 via-blue-600 to-teal-700',
    icon: 'Sparkles',
    locked: false,
    lessons: [
      {
        id: 'ielts_lesson_1_1',
        title: 'High-Stakes Academic Adjectives & Precision',
        description: 'Replace basic words with Band 8.5+ descriptors: ubiquitous, salient, viable, and detrimental.',
        xpReward: 30,
        completed: true,
        score: 100,
        exercises: [
          {
            id: 'ielts_ex_1',
            type: 'flashcard',
            prompt: 'What is the precise formal academic meaning of "UBIQUITOUS"?',
            targetWord: 'Ubiquitous',
            phonetic: '/juːˈbɪk.wɪ.təs/',
            translation: 'Present, appearing, or found everywhere simultaneously; omnipresent',
            options: [
              'Present or found everywhere simultaneously',
              'Extremely dangerous or hazardous',
              'Rare and hard to locate',
              'Temporary and unstable'
            ],
            correctAnswer: 'Present or found everywhere simultaneously',
            explanation: 'Ubiquitous is a top-band collocation: "Smartphones have become ubiquitous across contemporary urban environments."',
            audioText: 'Ubiquitous means present or found everywhere simultaneously.'
          },
          {
            id: 'ielts_ex_2',
            type: 'multiple-choice',
            prompt: 'Select the optimal Band 9 collocation to complete this Task 2 thesis sentence:',
            contextSentence: 'Unchecked greenhouse gas emissions pose a ________ threat to global ecological equilibrium.',
            options: ['detrimental', 'bad', 'not very good', 'annoying'],
            correctAnswer: 'detrimental',
            explanation: '"Detrimental threat" is an authentic formal academic collocation expressing severe negative impact.',
            audioText: 'Unchecked greenhouse emissions pose a detrimental threat to ecological equilibrium.'
          },
          {
            id: 'ielts_ex_3',
            type: 'grammar-fill',
            prompt: 'Complete the formal concession sentence with the most cohesive transitional phrase:',
            contextSentence: '________ technological innovations have streamlined logistics, they have simultaneously exacerbated digital alienation.',
            options: ['Notwithstanding that', 'Because', 'Also', 'So'],
            correctAnswer: 'Notwithstanding that',
            explanation: '"Notwithstanding that" signals a sophisticated concession structure required for Band 8+ Grammatical Range.'
          }
        ]
      },
      {
        id: 'ielts_lesson_1_2',
        title: 'Formal Verb Collocations & Argument Validation',
        description: 'Utilize authoritative verbs: substantiate, exacerbate, mitigate, and corroborate.',
        xpReward: 35,
        completed: true,
        score: 95,
        exercises: [
          {
            id: 'ielts_ex_4',
            type: 'multiple-choice',
            prompt: 'Which verb correctly signifies "to establish the validity of a claim through empirical evidence"?',
            options: ['Substantiate', 'Undermine', 'Fabricate', 'Diminish'],
            correctAnswer: 'Substantiate',
            explanation: 'In academic discourse, candidates must substantiate their arguments with concrete rationale rather than broad assertions.',
            audioText: 'To substantiate means to establish validity through empirical data.'
          },
          {
            id: 'ielts_ex_5',
            type: 'speaking',
            prompt: 'Articulate this Band 8.5 formal academic sentence clearly into the microphone:',
            targetWord: 'Targeted subsidies can mitigate the socioeconomic disparities arising from automation.',
            phonetic: '[ˈtɑː.ɡɪ.tɪd ˈsʌb.sɪ.diz kæn ˈmɪt.ɪ.ɡeɪt ðə ˌsoʊ.si.oʊˌek.əˈnɒm.ɪk dɪˈspær.ə.tiz]',
            translation: 'Targeted subsidies can mitigate the socioeconomic disparities arising from automation.',
            correctAnswer: 'Targeted subsidies can mitigate the socioeconomic disparities arising from automation.',
            explanation: 'Mitigate is an indispensable verb in problem-solution essays.',
            audioText: 'Targeted subsidies can mitigate the socioeconomic disparities arising from automation.'
          }
        ]
      }
    ]
  },
  {
    id: 'ielts_unit_2',
    unitNumber: 2,
    title: 'Academic Writing Task 1: Data Synthesis & Visual Trends',
    description: 'Deconstruct line graphs, bar charts, pie proportions, and process diagrams with mathematical precision.',
    color: 'from-teal-600 via-cyan-600 to-blue-700',
    icon: 'BookOpen',
    locked: false,
    lessons: [
      {
        id: 'ielts_lesson_2_1',
        title: 'Describing Surges, Declines & Fluctuations',
        description: 'Master verbs of movement: plummet, plateau, surge, oscillate, and stabilize.',
        xpReward: 30,
        completed: true,
        score: 96,
        exercises: [
          {
            id: 'ielts_ex_6',
            type: 'flashcard',
            prompt: 'What trend occurs when a figure "PLATEAUS" on a line graph?',
            targetWord: 'Plateau',
            phonetic: '/ˈplæt.oʊ/',
            translation: 'Reaches a period of leveling off after a period of rapid growth',
            options: [
              'Levels off and remains steady after a sharp increase',
              'Drops immediately to zero',
              'Constantly rises without stopping',
              'Disappears from the graph'
            ],
            correctAnswer: 'Levels off and remains steady after a sharp increase',
            explanation: 'Use: "Renewable energy adoption plateaued at 42% between 2018 and 2022."',
            audioText: 'A figure plateaus when it levels off and remains steady.'
          },
          {
            id: 'ielts_ex_7',
            type: 'multiple-choice',
            prompt: 'Which phrase is strictly forbidden in an authentic IELTS Academic Task 1 report?',
            options: [
              '"In my personal opinion, this trend is unacceptable."',
              '"Overall, it is salient that renewable energy surged twofold."',
              '"Between 2010 and 2020, production witnessed a marked decline."',
              '"The vast majority of respondents indicated a preference for public transit."'
            ],
            correctAnswer: '"In my personal opinion, this trend is unacceptable."',
            explanation: 'IELTS Task 1 is purely an objective factual summary. Personal opinions or emotional adjectives penalize Task Achievement.'
          }
        ]
      }
    ]
  },
  {
    id: 'ielts_unit_3',
    unitNumber: 3,
    title: 'Academic Writing Task 2: Band 9 Argumentation & Cohesion',
    description: 'Construct cohesive essay frameworks, nuanced counter-arguments, and balanced concessions.',
    color: 'from-purple-600 via-indigo-600 to-slate-800',
    icon: 'Award',
    locked: false,
    lessons: [
      {
        id: 'ielts_lesson_3_1',
        title: 'Formulating Nuanced Thesis Statements',
        description: 'Draft introductions that state your thesis and map paragraph progression without boilerplate clichés.',
        xpReward: 35,
        completed: true,
        score: 94,
        exercises: [
          {
            id: 'ielts_ex_8',
            type: 'multiple-choice',
            prompt: 'Which introduction sentence scores highest under the Coherence & Cohesion criterion?',
            options: [
              'While critics caution against algorithmic displacement, empirical evidence demonstrates that technological revolutions historically yield a net surplus of specialized careers.',
              'Nowadays technology is good and bad. In this essay I will discuss both sides.',
              'Since the dawn of time, human beings have always loved computers.',
              'There are many advantages and disadvantages of this interesting topic.'
            ],
            correctAnswer: 'While critics caution against algorithmic displacement, empirical evidence demonstrates that technological revolutions historically yield a net surplus of specialized careers.',
            explanation: 'This sentence directly establishes context, concedes the counter-stance, and asserts a substantiated thesis.'
          }
        ]
      }
    ]
  },
  {
    id: 'ielts_unit_4',
    unitNumber: 4,
    title: 'IELTS Speaking Part 2 & Part 3: Fluency & Lexical Precision',
    description: 'Structure 2-minute cue card talks and tackle complex abstract societal inquiries in Part 3.',
    color: 'from-amber-600 via-orange-600 to-rose-700',
    icon: 'Flame',
    locked: false,
    lessons: [
      {
        id: 'ielts_lesson_4_1',
        title: 'Speaking Part 3: Abstract Speculation & Weighing Impacts',
        description: 'Formulate speculative answers using modal verbs and hypothetical conditionals.',
        xpReward: 40,
        completed: false,
        exercises: [
          {
            id: 'ielts_ex_9',
            type: 'multiple-choice',
            prompt: 'When asked in Speaking Part 3 "How might artificial intelligence impact secondary education in the next decade?", which opener exhibits Band 8+ Lexical Resource?',
            options: [
              '"From an institutional perspective, the proliferation of generative tools will likely catalyze a transition toward customized Socratic tutoring."',
              '"I think computers are very nice for schools because students like them."',
              '"To be honest, I do not know because 10 years is very far away."',
              '"Yes, artificial intelligence is 100% good for teachers."'
            ],
            correctAnswer: '"From an institutional perspective, the proliferation of generative tools will likely catalyze a transition toward customized Socratic tutoring."',
            explanation: 'High-scoring candidates use framing adverbs ("From an institutional perspective") and precise verbs ("catalyze a transition").'
          }
        ]
      }
    ]
  }
];

