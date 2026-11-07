import { MockTest, ScheduledJob, VocabularyWord, AuditLog, IELTSPracticeTest, IngestedItemRecord } from '../types';
import { shuffleOptions } from '../utils/questionShuffler';

export const initialScheduledJobs: ScheduledJob[] = [
  {
    id: 'job_exam_midnight_00',
    name: 'Nightly 00:00 Multi-Exam Test Generator',
    description: 'Scheduled cron at 00:00 night hours to automatically generate at least 5 mock tests and 5 authentic practice tests across PTE, TOEFL, OET, DET, Cambridge English, and IELTS patterns daily with full timestamp logging.',
    cronExpression: '0 0 * * *',
    targetTime: '00:00 UTC (Nightly)',
    category: 'EXAM_PREP',
    enabled: true,
    lastRunTimestamp: 'Last run: 2026-10-31 00:00:02',
    nextRunTimestamp: 'Tonight at 00:00 UTC',
    itemsGeneratedCount: 35,
    status: 'idle',
    batchTarget: 'At least 5 Mock Tests + 5 Practice Tests (PTE, TOEFL, OET, DET, Cambridge & IELTS daily)'
  },
  {
    id: 'job_vocab_expansion_00',
    name: 'Nightly Vocabulary Vault Expansion',
    description: 'Scheduled cron at 00:00 night hours to curate and add at least 100 new academic, STEM, and conversational words with phonetics, CEFR levels, and audio contexts with exact timestamp tracking.',
    cronExpression: '0 0 * * *',
    targetTime: '00:00 UTC (Nightly)',
    category: 'VOCABULARY',
    enabled: true,
    lastRunTimestamp: 'Last run: 2026-10-31 00:00:04',
    nextRunTimestamp: 'Tonight at 00:00 UTC',
    itemsGeneratedCount: 300,
    status: 'idle',
    batchTarget: 'At least 100 Vocabulary Words with CEFR Levels & Timestamp Tracking'
  },
  {
    id: 'job_quiz_generation_00',
    name: 'Daily Cohort Quiz & Assessment Generator',
    description: 'Scheduled cron to generate interactive cohort quizzes with phonetics, audio prompts, and tiered hints across Early Primary, Junior, Academy, Pro, and Senior cohorts directly into the database.',
    cronExpression: '0 0 * * *',
    targetTime: '00:00 UTC (Nightly)',
    category: 'QUIZ_EVAL',
    enabled: true,
    lastRunTimestamp: `Last run: ${new Date().toISOString().slice(0, 10)} 00:00:06`,
    nextRunTimestamp: 'Tonight at 00:00 UTC',
    itemsGeneratedCount: 25,
    status: 'idle',
    batchTarget: 'At least 10 Interactive Cohort Quiz Questions'
  }
];

// Curated 100 Vocabulary Seed Templates
const VOCABULARY_BASE = [
  { word: 'Aberration', phonetic: '/ˌæb.əˈreɪ.ʃən/', pos: 'noun', trans: 'Aberración / anomalía', def: 'A departure from what is normal, usual, or expected.', cat: 'Scientific Inquiry', cefr: 'C1' as const, ex: 'The sudden surge in voltage was treated as a telemetry aberration.' },
  { word: 'Acumen', phonetic: '/ˈæk.jə.mən/', pos: 'noun', trans: 'Perspicacia / agudeza', def: 'The ability to make good judgments and quick decisions.', cat: 'Enterprise & Career', cefr: 'C1' as const, ex: 'Her financial acumen guided the startup through market volatility.' },
  { word: 'Ameliorate', phonetic: '/əˈmiː.li.ə.reɪt/', pos: 'verb', trans: 'Mejorar / atenuar', def: 'To make something bad or unsatisfactory better.', cat: 'Academic Discourse', cefr: 'C1' as const, ex: 'Targeted fiscal policy helped ameliorate structural unemployment.' },
  { word: 'Anomalous', phonetic: '/əˈnɒm.ə.ləs/', pos: 'adj', trans: 'Anómalo / irregular', def: 'Deviating from what is standard, normal, or expected.', cat: 'Scientific Inquiry', cefr: 'B2' as const, ex: 'The sensor recorded an anomalous spike in ambient infrared levels.' },
  { word: 'Antipathy', phonetic: '/ænˈtɪp.ə.θi/', pos: 'noun', trans: 'Antipatía / aversión', def: 'A deep-seated feeling of dislike or aversion.', cat: 'Psychology', cefr: 'C1' as const, ex: 'There was persistent antipathy toward the proposed architectural revisions.' },
  { word: 'Arduous', phonetic: '/ˈɑː.dju.əs/', pos: 'adj', trans: 'Arduo / fatigoso', def: 'Involving or requiring strenuous effort; difficult and tiring.', cat: 'Academic Discourse', cefr: 'B2' as const, ex: 'Conducting double-blind clinical trials is an arduous undertaking.' },
  { word: 'Articulate', phonetic: '/ɑːˈtɪk.jə.lət/', pos: 'adj', trans: 'Elocuente / articulado', def: 'Having or showing the ability to speak fluently and coherently.', cat: 'IELTS / PTE Speaking', cefr: 'B2' as const, ex: 'She presented an articulate defense of autonomous grid balancing.' },
  { word: 'Ascertain', phonetic: '/ˌæs.əˈteɪn/', pos: 'verb', trans: 'Averiguar / constatar', def: 'Find something out for certain; make sure of.', cat: 'Scientific Inquiry', cefr: 'B2' as const, ex: 'Researchers conducted control runs to ascertain baseline error margins.' },
  { word: 'Assiduous', phonetic: '/əˈsɪdʒ.u.əs/', pos: 'adj', trans: 'Asiduo / diligente', def: 'Showing great care, attention, and effort.', cat: 'Academic Discourse', cefr: 'C1' as const, ex: 'Through assiduous revision, his IELTS band score improved to 8.5.' },
  { word: 'Audacious', phonetic: '/ɔːˈdeɪ.ʃəs/', pos: 'adj', trans: 'Audaz / osado', def: 'Showing a willingness to take surprisingly bold risks.', cat: 'Enterprise & Career', cefr: 'B2' as const, ex: 'The engineering team pursued an audacious plan to decentralize compute.' },
  { word: 'Auspicious', phonetic: '/ɔːˈspɪʃ.əs/', pos: 'adj', trans: 'Auspicioso / prometedor', def: 'Conducive to success; favorable.', cat: 'Academic Discourse', cefr: 'C1' as const, ex: 'Securing seed funding marked an auspicious beginning for the lab.' },
  { word: 'Bolster', phonetic: '/ˈbəʊl.stər/', pos: 'verb', trans: 'Reforzar / apuntalar', def: 'Support or strengthen; prop up.', cat: 'Academic Writing', cefr: 'B2' as const, ex: 'Empirical data was introduced to bolster the paper’s primary hypothesis.' },
  { word: 'Capitulate', phonetic: '/kəˈpɪtʃ.ə.leɪt/', pos: 'verb', trans: 'Capitular / ceder', def: 'Cease to resist an opponent or an unwelcome demand.', cat: 'Humanities', cefr: 'C1' as const, ex: 'The committee refused to capitulate to unverified speculation.' },
  { word: 'Circumspect', phonetic: '/ˈsɜː.kəm.spekt/', pos: 'adj', trans: 'Cauto / prudente', def: 'Wary and unwilling to take risks; prudent.', cat: 'Enterprise & Career', cefr: 'C1' as const, ex: 'Senior architects remained circumspect regarding third-party API dependencies.' },
  { word: 'Coalesce', phonetic: '/kəʊ.əˈles/', pos: 'verb', trans: 'Fusionar / coalescer', def: 'Come together to form one mass or whole.', cat: 'Scientific Inquiry', cefr: 'C1' as const, ex: 'Disparate research threads coalesced into a unified thermodynamic theory.' },
  { word: 'Cognizant', phonetic: '/ˈkɒɡ.nɪ.zənt/', pos: 'adj', trans: 'Consciente / enterado', def: 'Having knowledge or being aware of.', cat: 'Academic Discourse', cefr: 'C1' as const, ex: 'Engineers must remain cognizant of algorithmic latency constraints.' },
  { word: 'Commensurate', phonetic: '/kəˈmen.ʃər.ət/', pos: 'adj', trans: 'Conmensurable / proporcional', def: 'Corresponding in size or degree; in proportion.', cat: 'Career & Salary', cefr: 'C1' as const, ex: 'Compensation will be fully commensurate with verified cloud experience.' },
  { word: 'Concomitant', phonetic: '/kənˈkɒm.ɪ.tənt/', pos: 'adj', trans: 'Concomitante / simultáneo', def: 'Naturally accompanying or associated.', cat: 'Scientific Inquiry', cefr: 'C2' as const, ex: 'Rapid urban development led to a concomitant rise in grid demand.' },
  { word: 'Conjecture', phonetic: '/kənˈdʒek.tʃər/', pos: 'noun', trans: 'Conjetura / suposición', def: 'An opinion or conclusion formed on the basis of incomplete information.', cat: 'Philosophy & Logic', cefr: 'B2' as const, ex: 'Until reproducible tests occur, the claim remains speculative conjecture.' },
  { word: 'Consensus', phonetic: '/kənˈsen.səs/', pos: 'noun', trans: 'Consenso / acuerdo unánime', def: 'A general agreement reached by a group.', cat: 'Academic Discourse', cefr: 'B2' as const, ex: 'Scientific consensus confirms the efficacy of spaced retrieval practice.' }
];

// Helper to expand and generate full 100 words dynamically with timestamp
export function generateOneHundredWordsBatch(batchNumber: number, timestamp?: string): VocabularyWord[] {
  const categories = [
    'Academic Writing', 'STEM & Logic', 'IELTS & PTE Lexicon', 'Enterprise Technology',
    'Clinical & Health', 'Environmental Systems', 'Philosophy & Ethics', 'Cognitive Psychology'
  ];
  const cefrTiers: ('B1' | 'B2' | 'C1' | 'C2')[] = ['B2', 'C1', 'B2', 'C1', 'C2', 'B1'];

  const words: VocabularyWord[] = [];
  const ts = timestamp || new Date().toISOString().replace('T', ' ').slice(0, 19);

  // Use the 20 rich base anchors
  VOCABULARY_BASE.forEach((base, idx) => {
    words.push({
      id: `w_batch_${batchNumber}_${idx + 1}`,
      word: base.word,
      phonetic: base.phonetic,
      partOfSpeech: base.pos,
      translation: base.trans,
      definition: base.def,
      exampleSentence: base.ex,
      category: base.cat,
      cefrLevel: base.cefr,
      dateAdded: ts
    });
  });

  // Additional 80 high-yield scholarly vocabulary items
  const extraWords = [
    ['Corroborate', '/kəˈrɒb.ə.reɪt/', 'verb', 'Corroborar', 'Confirm or give support to a statement, theory, or finding.', 'Subsequent experiments served to corroborate the original thesis.'],
    ['Deference', '/ˈdef.ər.əns/', 'noun', 'Deferencia', 'Polite submission and respect.', 'The researchers treated peer critiques with profound deference.'],
    ['Delineate', '/dɪˈlɪn.i.eɪt/', 'verb', 'Delinear / describir', 'Describe or portray precisely.', 'The curriculum framework clearly delineates foundational milestones.'],
    ['Demur', '/dɪˈmɜːr/', 'verb', 'Objetar / discrepar', 'Raise objections or show reluctance.', 'She demurred at the proposal to reduce training dataset sizes.'],
    ['Derivative', '/dɪˈrɪv.ə.tɪv/', 'adj', 'Derivado / imitativo', 'Imitative of the work of someone else; unoriginal.', 'Critics dismissed the architectural model as derivative of earlier blueprints.'],
    ['Desiccate', '/ˈdes.ɪ.keɪt/', 'verb', 'Desecar', 'Remove the moisture from something typically to preserve it.', 'Arid winds can desiccate agricultural topsoil within hours.'],
    ['Dichotomy', '/daɪˈkɒt.ə.mi/', 'noun', 'Dicotomía', 'A division between two things represented as entirely different.', 'The apparent dichotomy between theory and practice dissolves in lab execution.'],
    ['Didactic', '/daɪˈdæk.tɪk/', 'adj', 'Didáctico', 'Intended to teach, particularly in having moral instruction as an ulterior motive.', 'Bridge AI employs interactive didactic dialogues rather than passive lectures.'],
    ['Discrepancy', '/dɪˈskrep.ən.si/', 'noun', 'Discrepancia', 'A lack of compatibility or similarity between two or more facts.', 'Auditors identified a subtle discrepancy between cache logs and database records.'],
    ['Disseminate', '/dɪˈsem.ɪ.neɪt/', 'verb', 'Difundir / diseminar', 'Scatter or spread widely, especially information.', 'Open-source communities disseminate technical knowledge globally.'],
    ['Divergent', '/daɪˈvɜː.dʒənt/', 'adj', 'Divergente', 'Tending to be different or develop in different directions.', 'Students proposed divergent algorithmic solutions to the graph traversal challenge.'],
    ['Dogmatic', '/dɒɡˈmæt.ɪk/', 'adj', 'Dogmático', 'Inclined to lay down principles as incontrovertibly true.', 'Rigorous engineers avoid dogmatic attachment to specific web frameworks.'],
    ['Ebullient', '/ɪˈbʊl.i.ənt/', 'adj', 'Efervescente / entusiasta', 'Cheerful and full of energy.', 'The student cohort was ebullient after achieving Band 8 on the IELTS trial.'],
    ['Efficacy', '/ˈef.ɪ.kə.si/', 'noun', 'Eficacia', 'The ability to produce a desired or intended result.', 'Statistical inference confirmed the clinical efficacy of the protocol.'],
    ['Eloquent', '/ˈel.ə.kwənt/', 'adj', 'Elocuente', 'Fluent or persuasive in speaking or writing.', 'His essay concluded with an eloquent defense of digital privacy.'],
    ['Emulate', '/ˈem.jə.leɪt/', 'verb', 'Emular / imitar', 'Match or surpass a person or achievement, typically by imitation.', 'The compiler was engineered to emulate legacy microprocessor instructions.'],
    ['Enervate', '/ˈen.ə.veɪt/', 'verb', 'Enervar / debilitar', 'Cause someone to feel drained of energy or vitality.', 'Long periods of uninterrupted screen glare can enervate student focus.'],
    ['Engender', '/ɪnˈdʒen.dər/', 'verb', 'Engendrar / suscitar', 'Cause or give rise to a feeling, situation, or condition.', 'Open Socratic inquiry engenders enduring analytical curiosity.'],
    ['Ephemeral', '/ɪˈfem.ər.əl/', 'adj', 'Efímero / pasajero', 'Lasting for a very short time.', 'Unlike ephemeral trends, mathematical proofs retain timeless validity.'],
    ['Equivocal', '/ɪˈkwɪv.ə.kəl/', 'adj', 'Equívoco / ambiguo', 'Open to more than one interpretation; ambiguous.', 'The pilot study returned equivocal findings requiring larger sample cohorts.'],
    ['Erudite', '/ˈer.ʊ.daɪt/', 'adj', 'Erudito / letrado', 'Having or showing great knowledge or learning.', 'The guest lecture delivered an erudite discourse on special relativity.'],
    ['Esoteric', '/ˌes.əˈter.ɪk/', 'adj', 'Esotérico / especializado', 'Intended for or understood by only a small number of people.', 'Quantum decoherence remains an esoteric field within condensed matter physics.'],
    ['Exacerbate', '/ɪɡˈzæs.ə.beɪt/', 'verb', 'Exacerbar / agravar', 'Make a problem, bad situation, or negative feeling worse.', 'Failure to index database foreign keys will exacerbate response latencies.'],
    ['Exacting', '/ɪɡˈzæk.tɪŋ/', 'adj', 'Exigente / riguroso', 'Making great demands on one’s skill, attention, or other resources.', 'The PTE Academic scoring engine enforces exacting pronunciation standards.'],
    ['Exonerate', '/ɪɡˈzɒn.ə.reɪt/', 'verb', 'Exonerar', 'Absolve someone from blame for a fault or wrongdoing.', 'The immutable audit log served to exonerate the developer from system sabotage.'],
    ['Expedient', '/ɪkˈspiː.di.ənt/', 'adj', 'Conveniente / oportuno', 'Convenient and practical although possibly improper or immoral.', 'Redis caching is a computationally expedient technique to mitigate database load.'],
    ['Extrapolate', '/ɪkˈstræp.ə.leɪt/', 'verb', 'Extrapolar', 'Extend the application of a method or conclusion to an unknown situation.', 'Economists extrapolated forward-looking revenue forecasts from quarterly datasets.'],
    ['Facetious', '/fəˈsiː.ʃəs/', 'adj', 'Chistoso / jocoso', 'Treating serious issues with deliberately inappropriate humor.', 'The reviewer criticized the author’s facetious tone in the literature review.'],
    ['Fastidious', '/fæsˈtɪd.i.əs/', 'adj', 'Meticuloso / exigente', 'Very attentive to and concerned about accuracy and detail.', 'She was fastidious in structuring clear TypeScript interface definitions.'],
    ['Fervent', '/ˈfɜː.vənt/', 'adj', 'Ferviente / entusiasta', 'Having or displaying a passionate intensity.', 'He maintained a fervent dedication to self-hosted open-source software.'],
    ['Fortuitous', '/fɔːˈtʃuː.ɪ.təs/', 'adj', 'Fortuito / casual', 'Happening by accident or chance rather than design.', 'Their fortuitous discovery of the anomalous spectrum opened a new research domain.'],
    ['Garrulous', '/ˈɡær.əl.əs/', 'adj', 'Gárrulo / locuaz', 'Excessively talkative, especially on trivial matters.', 'In formal writing, concise arguments are preferred over garrulous prose.'],
    ['Glib', '/ɡlɪb/', 'adj', 'Superficial / simplista', 'Fluent and voluble but insincere and shallow.', 'The examiner penalized glib answers that lacked supporting academic rationale.'],
    ['Gregarious', '/ɡrɪˈɡeə.ri.əs/', 'adj', 'Gregario / sociable', 'Fond of company; sociable.', 'Human beings are fundamentally gregarious organisms flourishing in collaborative peer environments.'],
    ['Hackneyed', '/ˈhæk.nid/', 'adj', 'Trillado / manido', 'Lacking significance through having been overused; unoriginal.', 'Avoid hackneyed idioms like "at the end of the day" in IELTS Task 2 essays.'],
    ['Hierarchy', '/ˈhaɪə.rɑː.ki/', 'noun', 'Jerarquía', 'A system or organization in which people or groups are ranked.', 'The database enforces a clean foreign key hierarchy connecting courses to lessons.'],
    ['Iconoclast', '/aɪˈkɒn.ə.klæst/', 'noun', 'Iconoclasta', 'A person who attacks cherished beliefs or institutions.', 'Open-source pioneers acted as iconoclasts challenging proprietary software monopolies.'],
    ['Idiosyncratic', '/ˌɪd.i.ə.sɪŋˈkræt.ɪk/', 'adj', 'Idiosincrásico', 'Relating to idiosyncrasy; peculiar or individual.', 'Each language model exhibits idiosyncratic token selection probabilities.'],
    ['Immutable', '/ɪˈmjuː.tə.bəl/', 'adj', 'Inmutable', 'Unchanging over time or unable to be changed.', 'Audit log records are written to an immutable append-only ledger.'],
    ['Impecunious', '/ˌɪm.pɪˈkjuː.ni.əs/', 'adj', 'Indigente / sin dinero', 'Having little or no money.', 'EduBridge guarantees that impecunious students have free access to open AI tutoring.'],
    ['Impetuous', '/ɪmˈpetʃ.u.əs/', 'adj', 'Impetuoso / impulsivo', 'Acting or done quickly and without thought or care.', 'An impetuous commit directly to production disrupted service availability.'],
    ['Inchoate', '/ɪnˈkəʊ.eɪt/', 'adj', 'Incipiente / rudimentario', 'Just begun and so not fully formed or developed.', 'The student formulated an inchoate thesis that Bridge helped refine.'],
    ['Indolent', '/ˈɪn.dəl.ənt/', 'adj', 'Indolente / perezoso', 'Wanting to avoid activity or exertion; lazy.', 'The daily streak mechanic motivates learners to overcome indolent habits.'],
    ['Ineluctable', '/ˌɪn.ɪˈlʌk.tə.bəl/', 'adj', 'Ineluctable / inevitable', 'Unable to be resisted or avoided; inescapable.', 'Technological automation appears an ineluctable reality across enterprise workflows.'],
    ['Ingenuous', '/ɪnˈdʒen.ju.əs/', 'adj', 'Ingenuo / cándido', 'Innocent and unsuspecting.', 'Her ingenuous question about neural backprop inspired a deeper class discussion.'],
    ['Inimical', '/ɪˈnɪm.ɪ.kəl/', 'adj', 'Inimical / perjudicial', 'Tending to obstruct or harm; hostile.', 'Excessive cognitive fatigue is inimical to long-term memory consolidation.'],
    ['Inscrutable', '/ɪnˈskruː.tə.bəl/', 'adj', 'Inescrutable / indescifrable', 'Impossible to understand or interpret.', 'Without chain-of-thought steps, deep neural network weights appear inscrutable.'],
    ['Insipid', '/ɪnˈsɪp.ɪd/', 'adj', 'Insípido / desabrido', 'Lacking flavor or interest; dull.', 'The essay was penalized for repetitive, insipid sentence structures.'],
    ['Intractable', '/ɪnˈtræk.tə.bəl/', 'adj', 'Intratable / rebelde', 'Hard to control or deal with; stubborn.', 'The traveling salesperson problem is computationally intractable for massive datasets.'],
    ['Inundate', '/ˈɪn.ʌn.deɪt/', 'verb', 'Inundar / abrumar', 'Overwhelm someone with things or people to be dealt with.', 'Do not inundate learners with 50 concepts in a single study sitting.'],
    ['Irascible', '/ɪˈræs.ə.bəl/', 'adj', 'Irascible / irritable', 'Having or showing a tendency to be easily angered.', 'The irascible reviewer rejected the paper without constructive remediation.'],
    ['Juxtapose', '/ˌdʒʌk.stəˈpəʊz/', 'verb', 'Yuxtaponer', 'Place or deal with close together for contrasting effect.', 'The curriculum juxtaposes theoretical calculus proofs with applied machine learning.'],
    ['Laconic', '/ləˈkɒn.ɪk/', 'adj', 'Lacónico / escueto', 'Using very few words.', 'Phi-4 Mini delivers laconic, high-density grammar rules without extraneous banter.'],
    ['Laudable', '/ˈlɔː.də.bəl/', 'adj', 'Laudable / encomiable', 'Deserving praise and commendation.', 'Alex’s 14-day study habit is a laudable demonstration of academic commitment.'],
    ['Loquacious', '/ləˈkweɪ.ʃəs/', 'adj', 'Locuaz / hablador', 'Tending to talk a great deal; talkative.', 'The candidate was encouraged to be concise rather than loquacious in the interview.'],
    ['Lucid', '/ˈluː.sɪd/', 'adj', 'Lúcido / claro', 'Expressed clearly; easy to understand.', 'Professor Vance provided a lucid geometric proof of the fundamental theorem.'],
    ['Magnanimous', '/mæɡˈnæn.ɪ.məs/', 'adj', 'Magnánimo / generoso', 'Generous or forgiving, especially toward a rival or less powerful person.', 'The senior architect was magnanimous in mentoring junior contributors.'],
    ['Mendacious', '/menˈdeɪ.ʃəs/', 'adj', 'Mendaz / falaz', 'Not telling the truth; lying.', 'Verification hashes protect digital certificates against mendacious credential claims.'],
    ['Mitigate', '/ˈmɪt.ɪ.ɡeɪt/', 'verb', 'Mitigar / paliar', 'Make less severe, serious, or painful.', 'Decentralized caching helps mitigate sudden regional network disruptions.'],
    ['Modicum', '/ˈmɒd.ɪ.kəm/', 'noun', 'Brizna / ápice', 'A small quantity of a particular thing, especially something considered desirable.', 'Every student deserves at least a modicum of customized 1-on-1 tutoring.'],
    ['Munificent', '/mjuːˈnɪf.ɪ.sənt/', 'adj', 'Munífico / muy generoso', 'Larger or more generous than is usual or necessary.', 'The educational foundation awarded a munificent grant for open AI development.'],
    ['Nebulous', '/ˈneb.jə.ləs/', 'adj', 'Nebuloso / impreciso', 'In the form of a cloud or haze; hazy; vague.', 'Avoid nebulous conclusions that fail to address the core prompt.'],
    ['Nefarious', '/nɪˈfeə.ri.əs/', 'adj', 'Nefario / malvado', 'Wicked or criminal.', 'Zero-trust architecture defends server infrastructure against nefarious intrusions.'],
    ['Nonchalant', '/ˈnɒn.ʃəl.ənt/', 'adj', 'Despreocupado / displicente', 'Feeling or appearing casually calm and relaxed.', 'He approached the standardized mock exam with nonchalant confidence.'],
    ['Obdurate', '/ˈɒb.dʒər.ət/', 'adj', 'Obstinado / recalcitrante', 'Stubbornly refusing to change one’s opinion or course of action.', 'Despite counter-evidence, the legacy director remained obdurate.'],
    ['Obsequious', '/əbˈsiː.kwi.əs/', 'adj', 'Obsequioso / servil', 'Obedient or attentive to an excessive or servile degree.', 'The AI mentor acts as a collegial guide rather than an obsequious tool.'],
    ['Obviate', '/ˈɒb.vi.eɪt/', 'verb', 'Obviar / evitar', 'Remove a need or difficulty; avoid.', 'Offline caching obviates the necessity for continuous broadband connectivity.'],
    ['Onerous', '/ˈəʊ.nər.əs/', 'adj', 'Oneroso / pesado', 'Involving an amount of effort and difficulty that is oppressively burdensome.', 'Study planner intervals break down onerous exam syllabi into manageable daily blocks.'],
    ['Ostracize', '/ˈɒs.trə.saɪz/', 'verb', 'Ostracizar / excluir', 'Exclude someone from a society or group.', 'The learning community enforces policies ensuring no student is ostracized.'],
    ['Paragon', '/ˈpær.ə.ɡən/', 'noun', 'Paragón / modelo dechado', 'A person or thing regarded as a perfect example of a particular quality.', 'The student was heralded as a paragon of self-directed discipline.'],
    ['Parsimonious', '/ˌpɑː.sɪˈməʊ.ni.əs/', 'adj', 'Parsimonioso / austero', 'Unwilling to spend money or use resources; frugal.', 'The memory allocator was parsimonious, keeping model VRAM strictly under 6 GB.'],
    ['Paucity', '/ˈpɔː.sə.ti/', 'noun', 'Paupérrimo / escasez', 'The presence of something only in small or insufficient quantities.', 'A paucity of empirical evidence weakens any academic argument.'],
    ['Pedantic', '/pɪˈdæn.tɪk/', 'adj', 'Pedante / meticuloso', 'Excessively concerned with minor details and rules.', 'Phi-4 Mini focuses on genuine syntactic clarity rather than pedantic trivialities.'],
    ['Perfidious', '/pəˈfɪd.i.əs/', 'adj', 'Pérfido / traicionero', 'Deceitful and untrustworthy.', 'Cryptography ensures communications are safeguarded against perfidious intermediaries.'],
    ['Perfunctory', '/pəˈfʌŋk.tər.i/', 'adj', 'Perentorio / superficial', 'Carried out with a minimum of effort or reflection.', 'Do not settle for perfunctory flashcard flips; practice active deliberate recall.'],
    ['Perspicacious', '/ˌpɜː.spɪˈkeɪ.ʃəs/', 'adj', 'Perspicaz / agudo', 'Having a ready insight into and understanding of things.', 'The tutor praised her perspicacious critique of the transformer paper.'],
    ['Pervasive', '/pəˈveɪ.sɪv/', 'adj', 'Pervasivo / dominante', 'Spreading widely throughout an area or a group of people.', 'Generative AI is becoming a pervasive utility across modern educational institutions.'],
    ['Platitude', '/ˈplæt.ɪ.tjuːd/', 'noun', 'Tópico / perogrullada', 'A remark or statement, especially one with a moral content, that has been used too often.', 'Replace rhetorical platitudes with verifiable empirical statistics in Task 2.'],
    ['Polemic', '/pəˈlem.ɪk/', 'noun', 'Polémica / filípica', 'A strong verbal or written attack on someone or something.', 'The essay struck a measured analytical tone rather than degenerating into a polemic.'],
    ['Pragmatic', '/præɡˈmæt.ɪk/', 'adj', 'Pragmático / práctico', 'Dealing with things sensibly and realistically in a way based on practical rather than theoretical considerations.', 'EduBridge provides pragmatic pathways connecting academic mastery to freelance earnings.']
  ];

  extraWords.forEach((item, index) => {
    words.push({
      id: `w_batch_${batchNumber}_${words.length + 1}`,
      word: item[0],
      phonetic: item[1],
      partOfSpeech: item[2],
      translation: item[3],
      definition: item[4],
      exampleSentence: item[5],
      category: categories[index % categories.length],
      cefrLevel: cefrTiers[index % cefrTiers.length],
      dateAdded: ts
    });
  });

  return words;
}


// Helper to construct 10 subject-coherent questions for practice tests
export function buildTenPracticeTestQuestions(
  testId: string,
  mod: 'Listening' | 'Reading' | 'Writing' | 'Speaking',
  subject: string,
  basePrompt: string,
  baseOptions?: string[],
  baseCorrect?: string,
  baseExplanation?: string
) {
  const qList = [];
  const q1Correct = baseCorrect || `Direct application of principles defined under ${subject}`;
  const q1RawOptions = baseOptions || [
    `Direct application of principles defined under ${subject}`,
    'Uncalibrated trial-and-error without empirical parameters',
    'Total disregard for observable physical constraints',
    'Outdated nineteenth-century anecdotal conjecture'
  ];

  // Q1: The base question
  qList.push({
    id: `${testId}_q1`,
    questionNumber: 1,
    prompt: basePrompt,
    options: shuffleOptions(q1RawOptions, q1Correct),
    correctAnswer: q1Correct,
    explanation: baseExplanation || `The primary finding is corroborated by direct application of principles in ${subject}.`,
    subject
  });

  // Questions 2-10: Cohesive subject-grounded questions
  const subPrompts = [
    {
      p: `In the context of ${subject}, which core empirical metric provides the most reliable indicator of operational efficiency?`,
      ans: `Standardized throughput and degradation benchmarks specific to ${subject}`,
      opts: [
        `Standardized throughput and degradation benchmarks specific to ${subject}`,
        'Random unregulated ambient temperature shifts',
        'Subjective visual appraisals by untrained third parties',
        'Irregular anecdotal estimates without recorded data'
      ],
      exp: `In ${subject}, standardized quantitative benchmarks guarantee empirical reproducibility.`
    },
    {
      p: `What primary theoretical constraint must researchers in ${subject} account for when evaluating modern protocols?`,
      ans: `Thermodynamic, biological, or architectural boundary thresholds in ${subject}`,
      opts: [
        `Thermodynamic, biological, or architectural boundary thresholds in ${subject}`,
        'An infinite supply of unmetered raw energy',
        'Zero requirement for safety review or quality control',
        'Absence of any competing operational trade-offs'
      ],
      exp: `Valid scientific models in ${subject} require strict adherence to boundary thresholds.`
    },
    {
      p: `Based on standard domain methodology, what mechanism best explains the observed phenomenon in ${subject}?`,
      ans: `The causal interaction of governing forces and environmental variables in ${subject}`,
      opts: [
        `The causal interaction of governing forces and environmental variables in ${subject}`,
        'Spontaneous unassisted energy creation',
        'An anomalous recording artifact that disappears on re-test',
        'Unrelated external political announcements'
      ],
      exp: `Physical and systemic outcomes in ${subject} are dictated by causal governing interactions.`
    },
    {
      p: `Which statement is True regarding recent technological advancements documented in ${subject}?`,
      ans: `Engineering milestones have achieved higher precision through systematic, reproducible iterations`,
      opts: [
        `Engineering milestones have achieved higher precision through systematic, reproducible iterations`,
        'Modern capabilities have declined below ancient pre-industrial benchmarks',
        'All research ceased completely after the initial discovery was published',
        'Every modern protocol is identical to nineteenth-century approximations'
      ],
      exp: `Technological progress in ${subject} is achieved through structured iterative optimization.`
    },
    {
      p: `When analyzing failure modes in ${subject}, what initial diagnostic step is universally recommended?`,
      ans: `Isolating subsystem variance against calibrated baseline parameters in ${subject}`,
      opts: [
        `Isolating subsystem variance against calibrated baseline parameters in ${subject}`,
        'Discarding all baseline telemetry records without review',
        'Arbitrarily guessing without inspecting system telemetry',
        'Increasing load beyond maximum rated tolerance'
      ],
      exp: `Calibrated baseline comparison is the foundational diagnostic procedure in ${subject}.`
    },
    {
      p: `How does modern peer-reviewed research in ${subject} substantiate primary hypotheses?`,
      ans: `By documenting reproducible experimental trials and statistical significance metrics`,
      opts: [
        `By documenting reproducible experimental trials and statistical significance metrics`,
        'By citing fictional allegories and commercial advertisements',
        'By relying exclusively on unverified social media opinion polls',
        'By concealing experimental methodologies from peer reviewers'
      ],
      exp: `Rigorous academic discourse in ${subject} demands reproducible statistical validation.`
    },
    {
      p: `What environmental or economic dividend is most directly realized through modern optimization of ${subject}?`,
      ans: `Measurable reduction in resource waste and operational latency across ${subject}`,
      opts: [
        `Measurable reduction in resource waste and operational latency across ${subject}`,
        'Exponential increase in hazardous environmental discharge',
        'Complete cessation of all global economic activity',
        'Universal doubling of consumer product defect rates'
      ],
      exp: `System optimization in ${subject} aims to minimize resource consumption and operational overhead.`
    },
    {
      p: `According to established literature in ${subject}, what distinguishes rigorous verification from speculative conjecture?`,
      ans: `Controlled double-blind methodologies and objective sensory telemetry in ${subject}`,
      opts: [
        `Controlled double-blind methodologies and objective sensory telemetry in ${subject}`,
        'The volume of vocal assertion made during informal debates',
        'The chronological age of the manuscript without regard to data',
        'Speculative claims published without empirical citations'
      ],
      exp: `Empirical validation separates verified science from speculation in ${subject}.`
    },
    {
      p: `What future challenge is anticipated by senior specialists working within ${subject}?`,
      ans: `Scaling operational capacity while safeguarding security, reliability, and precision`,
      opts: [
        `Scaling operational capacity while safeguarding security, reliability, and precision`,
        'A permanent return to analog paper-only processing systems',
        'Total elimination of all scientific inquiry worldwide',
        'The immediate abandonment of all computational technology'
      ],
      exp: `Sustainable scaling and precision integrity represent the frontier of ${subject}.`
    }
  ];

  subPrompts.forEach((item, idx) => {
    qList.push({
      id: `${testId}_q${idx + 2}`,
      questionNumber: idx + 2,
      prompt: item.p,
      options: shuffleOptions(item.opts, item.ans),
      correctAnswer: item.ans,
      explanation: item.exp,
      subject
    });
  });

  return qList;
}

// Generates at least 5 complete daily sample mock tests covering PTE, TOEFL, OET, DET, Cambridge English & IELTS patterns
// EVERY mock test contains AT LEAST 10 authentic questions strictly related to its subject.
export function generateFivePracticeTestsBatch(batchIndex: number, executionTimestamp?: string): MockTest[] {
  const ts = executionTimestamp || new Date().toISOString().replace('T', ' ').slice(0, 19);
  const dt = ts.slice(0, 10);

  const tests: MockTest[] = [
    // 1. PTE Academic Daily Practice Test
    {
      id: `mock_pte_batch_${batchIndex}_01`,
      exam: 'PTE',
      title: `PTE Academic Daily Simulation #${25 + batchIndex * 5 + 1}`,
      difficulty: 'Advanced',
      subject: 'Distributed Cryptography & Cloud Computing',
      totalDurationMin: 50,
      targetBandRequirement: '79+ (IELTS 8.0 Equivalent)',
      sections: [
        { id: `sec_pte_spk_${batchIndex}`, name: 'Speaking', durationMinutes: 15, questionsCount: 2, samplePrompt: 'Read Aloud & Re-tell Academic Lecture', rubric: [{ criteria: 'Fluency', weight: '50%', description: 'Smooth rhythm' }, { criteria: 'Pronunciation', weight: '50%', description: 'Clarity' }] },
        { id: `sec_pte_wri_${batchIndex}`, name: 'Writing', durationMinutes: 15, questionsCount: 2, samplePrompt: 'Summarize Written Text & Academic Essay', rubric: [{ criteria: 'Grammar', weight: '50%', description: 'Structure' }, { criteria: 'Lexicon', weight: '50%', description: 'Academic terms' }] },
        { id: `sec_pte_read_${batchIndex}`, name: 'Reading', durationMinutes: 10, questionsCount: 3, samplePrompt: 'Reading & Fill in Blanks', rubric: [{ criteria: 'Accuracy', weight: '50%', description: 'Context' }, { criteria: 'Collocation', weight: '50%', description: 'Collocation' }] },
        { id: `sec_pte_lis_${batchIndex}`, name: 'Listening', durationMinutes: 10, questionsCount: 3, samplePrompt: 'Write From Dictation & Summarize Spoken Text', rubric: [{ criteria: 'Spelling', weight: '50%', description: 'Spelling' }, { criteria: 'Retention', weight: '50%', description: 'Retention' }] }
      ],
      questions: [
        {
          id: `q_pte_${batchIndex}_spk1`,
          section: 'Speaking',
          subject: 'Distributed Cryptography & Cloud Computing',
          instruction: 'Read Aloud: Speak clearly into your microphone within 35 seconds.',
          questionText: 'Distributed cryptographic ledgers facilitate verifiable consensus across trustless nodes without necessitating centralized intermediary verification.',
          correctAnswer: 'Distributed cryptographic ledgers facilitate verifiable consensus across trustless nodes without necessitating centralized intermediary verification.'
        },
        {
          id: `q_pte_${batchIndex}_spk2`,
          section: 'Speaking',
          subject: 'Distributed Cryptography & Cloud Computing',
          instruction: 'Re-tell Lecture: Summarize zero-knowledge cryptographic proofs in 40 seconds.',
          questionText: 'Re-tell the lecture on zero-knowledge SNARK proofs validating transaction state without revealing private keys.',
          modelAnswer: 'Zero-knowledge proofs allow a prover to mathematically demonstrate possession of secret transaction data to a verifier without disclosing the underlying data.'
        },
        {
          id: `q_pte_${batchIndex}_wri1`,
          section: 'Writing',
          subject: 'Distributed Cryptography & Cloud Computing',
          instruction: 'Summarize Written Text: Summarize in one single complete sentence of 5-75 words.',
          passage: 'Asynchronous message queues decouple microservices by buffering transactions during peak ingress spikes. By preventing cascading buffer saturation and enabling independent worker pod autoscaling, message streaming architectures provide essential resilience for modern financial infrastructures.',
          questionText: 'Summarize the passage in a single complete sentence:',
          modelAnswer: 'Asynchronous message queues provide crucial resilience for distributed infrastructures by decoupling microservices, absorbing transaction spikes, and preventing cascading failures through independent worker autoscaling.'
        },
        {
          id: `q_pte_${batchIndex}_wri2`,
          section: 'Writing',
          subject: 'Distributed Cryptography & Cloud Computing',
          instruction: 'Write Essay: In 200-300 words, discuss cloud data sovereignty laws.',
          questionText: 'Discuss how cross-border data sovereignty mandates impact multinational distributed cloud databases.',
          modelAnswer: 'Data residency regulations compel cloud providers to partition global user tables across regional availability zones, requiring geo-fenced replication protocols that guarantee sovereign data governance without sacrificing read availability.'
        },
        {
          id: `q_pte_${batchIndex}_r1`,
          section: 'Reading',
          subject: 'Distributed Cryptography & Cloud Computing',
          instruction: 'Fill in the blanks: Choose the word that best completes the sentence.',
          questionText: 'To prevent split-brain anomalies, cluster nodes employ quorum consensus to _____ distributed state transitions.',
          options: ['synchronize', 'disintegrate', 'postpone', 'complicate'],
          correctAnswer: 'synchronize'
        },
        {
          id: `q_pte_${batchIndex}_r2`,
          section: 'Reading',
          subject: 'Distributed Cryptography & Cloud Computing',
          instruction: 'Multiple Choice: What threshold of honest nodes is required for Byzantine fault tolerance?',
          passage: 'Byzantine fault tolerance requires that more than two-thirds of participating validator nodes remain honest and uncompromised, guaranteeing safety even in adversarial networks.',
          questionText: 'What is the minimum honest node threshold required for Byzantine fault tolerance?',
          options: ['More than two-thirds of all validator nodes', 'Fifty percent plus one node', 'Ten percent of validator stake', 'Unanimous 100% consensus'],
          correctAnswer: 'More than two-thirds of all validator nodes'
        },
        {
          id: `q_pte_${batchIndex}_r3`,
          section: 'Reading',
          subject: 'Distributed Cryptography & Cloud Computing',
          instruction: 'Multiple Choice: What primary issue do logical vector clocks resolve?',
          passage: 'Physical quartz clocks drift due to temperature fluctuations, causing clock skew across servers. Vector clocks establish causal ordering of events without relying on wall-clock time synchronization.',
          questionText: 'What problem do logical vector clocks solve in distributed systems?',
          options: ['Establishing causal event ordering without relying on physical clock synchronization', 'Preventing hard drive mechanical wear', 'Speeding up internet fiber optic transmission', 'Reducing cooling electricity in server racks'],
          correctAnswer: 'Establishing causal event ordering without relying on physical clock synchronization'
        },
        {
          id: `q_pte_${batchIndex}_lis1`,
          section: 'Listening',
          subject: 'Distributed Cryptography & Cloud Computing',
          instruction: 'Write from Dictation: Type the exact lecture sentence as dictated.',
          audioTranscript: 'Multivariate statistical regressions demonstrated a significant correlation between sleep hygiene and cognitive throughput.',
          questionText: 'Listen to the audio clip and type the exact sentence:',
          correctAnswer: 'Multivariate statistical regressions demonstrated a significant correlation between sleep hygiene and cognitive throughput.'
        },
        {
          id: `q_pte_${batchIndex}_lis2`,
          section: 'Listening',
          subject: 'Distributed Cryptography & Cloud Computing',
          instruction: 'Write from Dictation: Type the exact computing sentence as dictated.',
          audioTranscript: 'Immutable append-only audit ledgers guarantee transaction integrity across distributed database shards.',
          questionText: 'Listen to the audio clip and type the exact sentence:',
          correctAnswer: 'Immutable append-only audit ledgers guarantee transaction integrity across distributed database shards.'
        },
        {
          id: `q_pte_${batchIndex}_lis3`,
          section: 'Listening',
          subject: 'Distributed Cryptography & Cloud Computing',
          instruction: 'Summarize Spoken Text: In 50-70 words, summarize database sharding trade-offs.',
          audioTranscript: 'Horizontal sharding distributes database records across independent server nodes via hash keys. While queries targeting specific keys execute swiftly, cross-shard joins demand heavy scatter-gather network overhead.',
          questionText: 'Summarize the primary trade-off of database sharding:',
          modelAnswer: 'Horizontal database sharding divides data using partition hash keys. While single-shard lookups scale linearly, complex cross-shard joins incur heavy scatter-gather network latency.'
        }
      ]
    },

    // 2. TOEFL iBT Daily Practice Test
    {
      id: `mock_toefl_batch_${batchIndex}_02`,
      exam: 'TOEFL',
      title: `TOEFL iBT Academic Simulation #${90 + batchIndex * 5 + 1}`,
      difficulty: 'Standard',
      subject: 'Paleoclimatology & Oceanic Carbon Sequestration',
      totalDurationMin: 60,
      targetBandRequirement: '105+ / 120 (Top University Standard)',
      sections: [
        { id: `sec_toefl_r_${batchIndex}`, name: 'Reading', durationMinutes: 20, questionsCount: 3, samplePrompt: 'Paleoclimatology & Oceanic Carbon Sequestration', rubric: [{ criteria: 'Factual Accuracy', weight: '50%', description: 'Direct text identification' }, { criteria: 'Inference', weight: '50%', description: 'Deducing consequences' }] },
        { id: `sec_toefl_lis_${batchIndex}`, name: 'Listening', durationMinutes: 20, questionsCount: 3, samplePrompt: 'Ocean Conveyor Belt & Deep Thermohaline Circulation', rubric: [{ criteria: 'Lecture Synthesis', weight: '50%', description: 'Synthesis' }, { criteria: 'Detail Capture', weight: '50%', description: 'Details' }] },
        { id: `sec_toefl_spk_${batchIndex}`, name: 'Speaking', durationMinutes: 10, questionsCount: 2, samplePrompt: 'Sediment Core Drilling Methodologies', rubric: [{ criteria: 'Fluency', weight: '50%', description: 'Fluency' }, { criteria: 'Coherence', weight: '50%', description: 'Coherence' }] },
        { id: `sec_toefl_w_${batchIndex}`, name: 'Writing', durationMinutes: 10, questionsCount: 2, samplePrompt: 'Academic Discussion: Hydrogen Transit vs Battery Electric', rubric: [{ criteria: 'Argumentation', weight: '50%', description: 'Clarity of thesis' }, { criteria: 'Lexical Range', weight: '50%', description: 'Academic vocabulary' }] }
      ],
      questions: [
        {
          id: `q_toefl_${batchIndex}_r1`,
          section: 'Reading',
          subject: 'Paleoclimatology & Oceanic Carbon Sequestration',
          instruction: 'Read the scientific excerpt and answer the inference question.',
          passage: 'Coccolithophore blooms in the sub-polar North Atlantic fix gigatons of inorganic carbon into calcium carbonate shells. Upon organismal senescence, these calcite plates descend into the benthic abyss, effectively sequestering carbon from atmospheric exchange for geological epochs.',
          questionText: 'What primary role do coccolithophore blooms play in global carbon cycles?',
          options: [
            'They transport and sequester inorganic carbon into deep ocean sediment',
            'They release enormous amounts of carbon dioxide into the upper atmosphere',
            'They prevent sunlight from penetrating any part of the upper ocean',
            'They completely deoxygenate polar marine ecosystems'
          ],
          correctAnswer: 'They transport and sequester inorganic carbon into deep ocean sediment'
        },
        {
          id: `q_toefl_${batchIndex}_r2`,
          section: 'Reading',
          subject: 'Paleoclimatology & Oceanic Carbon Sequestration',
          instruction: 'Vocabulary in Context: What does the term calcareous ooze describe?',
          passage: 'Above the carbonate compensation depth, marine snow precipitates continuously to form thick blankets of calcareous ooze composed predominantly of coccolithophores and planktonic shells.',
          questionText: 'The term calcareous ooze in the passage refers to:',
          options: [
            'Calcium carbonate-rich sediment derived from microscopic marine organisms',
            'Synthetic chemical runoff from coastal industrial refineries',
            'Liquid volcanic lava cooling rapidly beneath oceanic trenches',
            'Frozen freshwater glaciers floating along continental shelves'
          ],
          correctAnswer: 'Calcium carbonate-rich sediment derived from microscopic marine organisms'
        },
        {
          id: `q_toefl_${batchIndex}_r3`,
          section: 'Reading',
          subject: 'Paleoclimatology & Oceanic Carbon Sequestration',
          instruction: 'Inference: What happens to calcium carbonate shells beneath the CCD?',
          passage: 'Below the carbonate compensation depth, high hydrostatic pressure and colder, acidic seawater cause calcium carbonate to dissolve faster than it can deposit, leaving benthic abyssal plains barren of carbonate fossils.',
          questionText: 'What happens to calcium carbonate shells beneath the CCD?',
          options: [
            'They dissolve rapidly due to elevated hydrostatic pressure and water acidity',
            'They crystallize into metallic diamond sheets',
            'They float back to the surface within hours',
            'They remain indefinitely preserved without any chemical change'
          ],
          correctAnswer: 'They dissolve rapidly due to elevated hydrostatic pressure and water acidity'
        },
        {
          id: `q_toefl_${batchIndex}_l1`,
          section: 'Listening',
          subject: 'Paleoclimatology & Oceanic Carbon Sequestration',
          instruction: 'Listen to a marine paleoclimatology lecture and answer the question.',
          audioTranscript: 'Professor: Thermohaline circulation operates like a global oceanic conveyor belt. When dense, saline surface water cools in the North Atlantic, it sinks toward the abyss, driving deep circulation currents that modulate planetary heat distribution.',
          questionText: 'What is the primary driving mechanism of the global thermohaline conveyor belt?',
          options: [
            'The sinking of cold, dense, saline water in subpolar oceans',
            'Surface tidal pull caused by planetary orbital shifts',
            'Continuous seismic shaking from mid-Atlantic volcanic ridges',
            'Direct kinetic energy generated by commercial marine traffic'
          ],
          correctAnswer: 'The sinking of cold, dense, saline water in subpolar oceans'
        },
        {
          id: `q_toefl_${batchIndex}_l2`,
          section: 'Listening',
          subject: 'Paleoclimatology & Oceanic Carbon Sequestration',
          instruction: 'Lecture Comprehension: Why would Arctic meltwater runoff endanger oceanic circulation?',
          audioTranscript: 'Professor: If excessive melting of the Greenland ice sheet injects millions of tons of buoyant freshwater into the North Atlantic, it decreases surface density, which could catastrophically stall the Atlantic Meridional Overturning Circulation.',
          questionText: 'Why would massive meltwater runoff endanger oceanic circulation?',
          options: [
            'Buoyant freshwater lowers surface density, preventing dense water from sinking',
            'Freshwater converts immediately into hazardous methane clouds',
            'It increases ocean salinity to toxic levels for plankton',
            'It freezes the entire North Atlantic ocean within days'
          ],
          correctAnswer: 'Buoyant freshwater lowers surface density, preventing dense water from sinking'
        },
        {
          id: `q_toefl_${batchIndex}_l3`,
          section: 'Listening',
          subject: 'Paleoclimatology & Oceanic Carbon Sequestration',
          instruction: 'Detail Question: What defines the oceanic biological carbon pump?',
          audioTranscript: 'Professor: Phytoplankton fix carbon dioxide in surface photic waters. When these organisms die and sink into the twilight and abyssal zones, they sequester carbon away from the atmosphere for centuries—a process known as the biological carbon pump.',
          questionText: 'What defines the oceanic biological carbon pump?',
          options: [
            'Photosynthetic plankton fixing carbon and sinking to deep abyssal reservoirs upon death',
            'Mechanical diesel turbines deployed on offshore oil drilling platforms',
            'Underwater volcanic eruptions expelling dissolved mineral gases',
            'Artificial chemical filters installed across coastal estuaries'
          ],
          correctAnswer: 'Photosynthetic plankton fixing carbon and sinking to deep abyssal reservoirs upon death'
        },
        {
          id: `q_toefl_${batchIndex}_s1`,
          section: 'Speaking',
          subject: 'Paleoclimatology & Oceanic Carbon Sequestration',
          instruction: 'Integrated Speaking: Explain sediment core drilling methodology in 60 seconds.',
          questionText: 'Explain the scientific methodology used by oceanographic drill ships to study historic paleoclimate.',
          modelAnswer: 'Oceanographic research vessels deploy rotary drill strings miles into the seabed to retrieve continuous sediment cores. By studying microfossils, volcanic ash, and isotopic ratios across core layers, scientists construct high-resolution timelines of historic ice ages.'
        },
        {
          id: `q_toefl_${batchIndex}_s2`,
          section: 'Speaking',
          subject: 'Paleoclimatology & Oceanic Carbon Sequestration',
          instruction: 'Speaking Task: Discuss oceanic deoxygenation.',
          questionText: 'State how warming ocean temperatures impact deep-sea oxygen solubility and marine fauna.',
          modelAnswer: 'Warmer seawater exhibits reduced oxygen solubility. Combined with intensified thermal stratification that prevents surface re-aeration, expanding oxygen minimum zones threaten benthic marine populations.'
        },
        {
          id: `q_toefl_${batchIndex}_w1`,
          section: 'Writing',
          subject: 'Paleoclimatology & Oceanic Carbon Sequestration',
          instruction: 'Respond to the professors question in the academic forum (minimum 100 words).',
          questionText: 'Professor Vance: Should municipal authorities mandate that all public transport fleets transition to hydrogen fuel cells rather than battery electric vehicles? Defend your position with technical or economic reasoning.',
          modelAnswer: 'While hydrogen fuel cells provide rapid refueling and high energy density suitable for heavy transit, I maintain that battery electric buses currently represent the vastly superior municipal investment. Battery electric systems boast round-trip energetic efficiencies surpassing seventy-five percent, whereas the electricity-to-hydrogen-to-electricity pathway suffers thermodynamic line losses exceeding fifty percent. Furthermore, municipal electric grids already possess distributed charging capability, whereas specialized cryogenic hydrogen distribution infrastructure demands exorbitant capital expenditures that drain limited civic budgets.'
        },
        {
          id: `q_toefl_${batchIndex}_w2`,
          section: 'Writing',
          subject: 'Paleoclimatology & Oceanic Carbon Sequestration',
          instruction: 'Integrated Writing: Synthesize iron fertilization benefits and risks.',
          questionText: 'Summarize the proposed geoengineering method of ocean iron fertilization and evaluate its ecological risks.',
          modelAnswer: 'Proponents argue that seeding high-nutrient ocean waters with iron stimulates diatom blooms that sequester atmospheric CO2. However, unconstrained blooms can release neurotoxins and deplete deep oxygen reserves upon decay.'
        }
      ]
    },

    // 3. OET Clinical Healthcare Daily Simulation
    {
      id: `mock_oet_batch_${batchIndex}_03`,
      exam: 'OET',
      title: `OET Healthcare Clinical Practice Test #${42 + batchIndex * 5 + 1}`,
      difficulty: 'Advanced',
      subject: 'Emergency Medicine & Sepsis Resuscitation Protocols',
      totalDurationMin: 55,
      targetBandRequirement: 'Grade B (350+ Clinical Score)',
      sections: [
        { id: `sec_oet_r_${batchIndex}`, name: 'Reading', durationMinutes: 15, questionsCount: 3, samplePrompt: 'Sepsis Six Resuscitation Guidelines', rubric: [{ criteria: 'Clinical Data Extraction', weight: '50%', description: 'Data extraction' }, { criteria: 'Guideline Interpretation', weight: '50%', description: 'Guidelines' }] },
        { id: `sec_oet_lis_${batchIndex}`, name: 'Listening', durationMinutes: 15, questionsCount: 3, samplePrompt: 'Emergency Department Septic Shock Handover', rubric: [{ criteria: 'Aural Diagnosis', weight: '50%', description: 'Diagnosis' }, { criteria: 'Care Plan Tracking', weight: '50%', description: 'Care plan' }] },
        { id: `sec_oet_spk_${batchIndex}`, name: 'Speaking', durationMinutes: 10, questionsCount: 2, samplePrompt: 'Family Communication & Critical Prognosis', rubric: [{ criteria: 'Clinical Empathy', weight: '50%', description: 'Empathy' }, { criteria: 'Clarity', weight: '50%', description: 'Clarity' }] },
        { id: `sec_oet_w_${batchIndex}`, name: 'Writing', durationMinutes: 15, questionsCount: 2, samplePrompt: 'Urgent ICU Transfer & Physiotherapy Referral Letter', rubric: [{ criteria: 'Clinical Accuracy', weight: '50%', description: 'Accuracy' }, { criteria: 'Organization', weight: '50%', description: 'Organization' }] }
      ],
      questions: [
        {
          id: `q_oet_${batchIndex}_r1`,
          section: 'Reading',
          subject: 'Emergency Medicine & Sepsis Resuscitation Protocols',
          instruction: 'Read the emergency sepsis protocol extract.',
          passage: 'The Sepsis Six protocol dictates that within one hour of identifying severe sepsis, clinicians must: 1. Administer high-flow oxygen (target SpO2 94-98%), 2. Take blood cultures, 3. Give IV broad-spectrum antibiotics, 4. Start IV fluid resuscitation (30 mL/kg crystalloid), 5. Check serum lactate and hemoglobin, 6. Measure urine output via catheter.',
          questionText: 'What is the recommended intravenous fluid resuscitation volume mandated within the first hour of severe sepsis management?',
          options: [
            '30 mL/kg of crystalloid fluids',
            '100 mL/kg of colloid fluids',
            '5 mL/kg of hypertonic saline',
            'Fluid resuscitation is withheld until lactate returns to normal'
          ],
          correctAnswer: '30 mL/kg of crystalloid fluids'
        },
        {
          id: `q_oet_${batchIndex}_r2`,
          section: 'Reading',
          subject: 'Emergency Medicine & Sepsis Resuscitation Protocols',
          instruction: 'Diagnostic Interpretation: What does serum lactate elevation signify in sepsis?',
          passage: 'Serum lactate levels exceeding 2.0 mmol/L indicate cellular hypoperfusion and anaerobic metabolism. Patients with persistent hypotension requiring vasopressors to maintain a mean arterial pressure of 65 mm Hg despite fluid resuscitation are classified as having septic shock.',
          questionText: 'What clinical state is indicated by persistent hyperlactatemia despite fluid resuscitation?',
          options: [
            'Systemic cellular hypoperfusion and septic shock',
            'Mild dehydration resolved by oral water intake',
            'Normal physiological recovery post-exercise',
            'Benign allergic skin reaction to room dust'
          ],
          correctAnswer: 'Systemic cellular hypoperfusion and septic shock'
        },
        {
          id: `q_oet_${batchIndex}_r3`,
          section: 'Reading',
          subject: 'Emergency Medicine & Sepsis Resuscitation Protocols',
          instruction: 'Antibiotic Stewardship: What should be obtained prior to initiating IV antibiotics in sepsis?',
          passage: 'Blood cultures must be drawn prior to administering antimicrobials to optimize pathogen identification, provided doing so does not delay antibiotic administration beyond the sixty-minute threshold.',
          questionText: 'What diagnostic investigation should ideally precede antimicrobial administration?',
          options: [
            'Two sets of blood cultures drawn from separate venipuncture sites',
            'A mandatory four-hour waiting period in the observation ward',
            'A full-body magnetic resonance imaging scan',
            'A skin patch allergy test lasting 48 hours'
          ],
          correctAnswer: 'Two sets of blood cultures drawn from separate venipuncture sites'
        },
        {
          id: `q_oet_${batchIndex}_l1`,
          section: 'Listening',
          subject: 'Emergency Medicine & Sepsis Resuscitation Protocols',
          instruction: 'Emergency Handover: Listen to the medical report on an admitted patient.',
          audioTranscript: 'Physician: Mr. Davis presented with rigors, blood pressure 82 over 50, heart rate 125, and a respiratory rate of 28. His lactate is 4.1 mmol/L. We have started two liters of Plasmalyte and commenced IV piperacillin-tazobactam.',
          questionText: 'What hemodynamic abnormalities are documented in Mr. Davis clinical handover?',
          options: [
            'Severe hypotension, tachycardia, tachypnea, and lactic acidosis',
            'Hypertension with normal heart rate and low respiratory rate',
            'Normal vital signs with isolated mild fever',
            'Hypothermia with bradycardia and zero lactate'
          ],
          correctAnswer: 'Severe hypotension, tachycardia, tachypnea, and lactic acidosis'
        },
        {
          id: `q_oet_${batchIndex}_l2`,
          section: 'Listening',
          subject: 'Emergency Medicine & Sepsis Resuscitation Protocols',
          instruction: 'Clinical Decision: What first-line vasopressor is ordered if mean arterial pressure remains below 65 mm Hg?',
          audioTranscript: 'Physician: If his MAP remains under 65 after the crystalloid bolus, transfer him immediately to ICU for central line placement and norepinephrine titration.',
          questionText: 'Which first-line vasopressor is indicated in refractory septic shock?',
          options: [
            'Norepinephrine infusion titrated to target MAP 65 mm Hg',
            'High-dose oral acetaminophen tablets',
            'Subcutaneous heparin injections twice weekly',
            'Intravenous dextrose 5% water running at low speed'
          ],
          correctAnswer: 'Norepinephrine infusion titrated to target MAP 65 mm Hg'
        },
        {
          id: `q_oet_${batchIndex}_l3`,
          section: 'Listening',
          subject: 'Emergency Medicine & Sepsis Resuscitation Protocols',
          instruction: 'Urine Output Target: What minimum hourly urine output indicates adequate renal perfusion?',
          audioTranscript: 'Nurse: Urinary catheterization is complete. We are monitoring for a minimum target output of 0.5 mL per kilogram per hour.',
          questionText: 'What is the benchmark urine output indicating adequate end-organ renal perfusion?',
          options: [
            'At least 0.5 mL per kilogram body weight per hour',
            'Strictly 5 liters per minute continuously',
            'Less than 10 mL over a 24-hour period',
            'Zero urine output is considered normal in sepsis'
          ],
          correctAnswer: 'At least 0.5 mL per kilogram body weight per hour'
        },
        {
          id: `q_oet_${batchIndex}_s1`,
          section: 'Speaking',
          subject: 'Emergency Medicine & Sepsis Resuscitation Protocols',
          instruction: 'Clinical Communication: Explain the severity of septic shock to anxious family members.',
          questionText: 'Address family concerns regarding ICU admission and ventilator support with clarity and empathy.',
          modelAnswer: 'Mr. Davis has developed a severe bloodstream infection that has lowered his blood pressure. We are transferring him to the Intensive Care Unit where specialist teams can support his organs with targeted medications and close monitoring.'
        },
        {
          id: `q_oet_${batchIndex}_s2`,
          section: 'Speaking',
          subject: 'Emergency Medicine & Sepsis Resuscitation Protocols',
          instruction: 'SBAR Handover: Deliver a structured clinical handover to the receiving ICU team.',
          questionText: 'Structure an SBAR handover for a patient failing fluid resuscitation.',
          modelAnswer: 'Situation: 68-year-old male with septic shock. Background: History of diverticulitis. Assessment: Refractory hypotension (BP 80/45) despite 30mL/kg crystalloid, lactate 4.1. Recommendation: Urgent central venous access and norepinephrine titration.'
        },
        {
          id: `q_oet_${batchIndex}_w1`,
          section: 'Writing',
          subject: 'Emergency Medicine & Sepsis Resuscitation Protocols',
          instruction: 'Write a clinical referral letter (180-200 words) to the Community Physiotherapy Team.',
          questionText: 'Draft a referral letter for Mrs. Eleanor Wright (Age 78), recovering from total knee arthroplasty.',
          modelAnswer: 'Community Physiotherapy Team\nEduBridge Integrated Care\n\nRE: Referral for Mrs. Eleanor Wright (DOB: 12/05/1948)\n\nDear Physiotherapy Colleagues,\n\nI am writing to refer Mrs. Wright, a 78-year-old lady who underwent an elective right total knee arthroplasty on 27 October 2026, for home-based physiotherapy and mobility rehabilitation.\n\nMrs. Wrights post-operative recovery has been satisfactory. She is currently mobilizing short distances with a gutter frame under supervision. Right knee flexion has reached 75 degrees, with full extension achieved. Pain is well controlled with regular paracetamol and PRN dihydrocodeine.\n\nShe lives in a two-story home with her husband. Given her mild cognitive impairment and historical fear of falling, please evaluate her home environment, advance her mobility aids from frame to walking sticks, and establish an active quad-strengthening routine.\n\nThank you for assisting in Mrs. Wrights community rehabilitation.\n\nYours sincerely,\nOrthopedic Clinical Specialist\nEduBridge Hospital'
        },
        {
          id: `q_oet_${batchIndex}_w2`,
          section: 'Writing',
          subject: 'Emergency Medicine & Sepsis Resuscitation Protocols',
          instruction: 'Clinical Documentation: Document ICU admission note for severe sepsis resuscitation.',
          questionText: 'Document blood gas parameters, central line catheter insertion, and broad-spectrum antimicrobial timing.',
          modelAnswer: 'Patient admitted to ICU with septic shock secondary to pneumonia. Right internal jugular triple-lumen catheter placed under ultrasound guidance. Norepinephrine commenced at 0.1 mcg/kg/min for target MAP > 65. Repeat blood gas demonstrates lactate clearance from 4.1 to 2.8 mmol/L.'
        }
      ]
    },

    // 4. DET Adaptive English Daily Simulation
    {
      id: `mock_det_batch_${batchIndex}_04`,
      exam: 'DET',
      title: `Duolingo English Test Adaptive Simulation #${14 + batchIndex * 5 + 1}`,
      difficulty: 'Standard',
      subject: 'Cognitive Sciences & Artificial Intelligence',
      totalDurationMin: 60,
      targetBandRequirement: '130 – 150 / 160 (High Academic Level)',
      sections: [
        { id: `sec_det_r_${batchIndex}`, name: 'Reading', durationMinutes: 15, questionsCount: 3, samplePrompt: 'Read and Complete: Neural Representations', rubric: [{ criteria: 'Accuracy', weight: '50%', description: 'Accuracy' }, { criteria: 'Vocabulary', weight: '50%', description: 'Vocabulary' }] },
        { id: `sec_det_lis_${batchIndex}`, name: 'Listening', durationMinutes: 15, questionsCount: 3, samplePrompt: 'Listen and Type: Multi-Agent Systems', rubric: [{ criteria: 'Spelling', weight: '50%', description: 'Spelling' }, { criteria: 'Phonetics', weight: '50%', description: 'Phonetics' }] },
        { id: `sec_det_spk_${batchIndex}`, name: 'Speaking', durationMinutes: 15, questionsCount: 2, samplePrompt: 'Describe Architecture Diagram & Speak on AI', rubric: [{ criteria: 'Fluency', weight: '50%', description: 'Fluency' }, { criteria: 'Cohesion', weight: '50%', description: 'Cohesion' }] },
        { id: `sec_det_w_${batchIndex}`, name: 'Writing', durationMinutes: 15, questionsCount: 2, samplePrompt: '5-Minute Interactive Writing: AI in Creative Arts', rubric: [{ criteria: 'Syntax Variety', weight: '50%', description: 'Complex structures' }, { criteria: 'Coherence', weight: '50%', description: 'Logic' }] }
      ],
      questions: [
        {
          id: `q_det_${batchIndex}_r1`,
          section: 'Reading',
          subject: 'Cognitive Sciences & Artificial Intelligence',
          instruction: 'Read and Complete: Identify the missing letters to complete the academic statement.',
          questionText: 'Complete the sentence: "Cog___ive sci___tists inves___gate how biol___ical neu___ns rep___sent abs___ct con___pts."',
          options: [
            'Cognitive scientists investigate how biological neurons represent abstract concepts.',
            'Cognitive sciences investigate how biologically neurons represent abstractive concepts.',
            'Cognitively scientists investigate how biological neurology represent abstracted conceptuals.',
            'Cognition science investigate how biology neuron represent abstract concepts.'
          ],
          correctAnswer: 'Cognitive scientists investigate how biological neurons represent abstract concepts.'
        },
        {
          id: `q_det_${batchIndex}_r2`,
          section: 'Reading',
          subject: 'Cognitive Sciences & Artificial Intelligence',
          instruction: 'Reading Comprehension: What enables transformer models to process language in parallel?',
          passage: 'Unlike sequential recurrent architectures that process words step by step, self-attention mechanisms compute pairwise semantic correlations across all tokens simultaneously, allowing massive parallelization on modern GPU clusters.',
          questionText: 'What fundamental architectural feature allows transformers to process language concurrently?',
          options: [
            'Self-attention mechanisms computing pairwise correlations across all tokens in parallel',
            'Mechanical clockwork gears installed inside computer monitors',
            'Converting all alphabetic letters into audio sound files',
            'Restricting software to process only three words per day'
          ],
          correctAnswer: 'Self-attention mechanisms computing pairwise correlations across all tokens in parallel'
        },
        {
          id: `q_det_${batchIndex}_r3`,
          section: 'Reading',
          subject: 'Cognitive Sciences & Artificial Intelligence',
          instruction: 'Vocabulary in Context: What is meant by neural hallucination?',
          passage: 'In large generative models, hallucination refers to instances where the network produces factually incorrect or ungrounded assertions while maintaining high grammatical fluency and authoritative confidence.',
          questionText: 'The term "hallucination" in natural language processing describes:',
          options: [
            'Generating syntactically fluent assertions that are factually unfounded or fabricated',
            'Physical electrical overheating of graphics processing units',
            'The total erasure of all training weights from computer memory',
            'A biological viral infection affecting human software programmers'
          ],
          correctAnswer: 'Generating syntactically fluent assertions that are factually unfounded or fabricated'
        },
        {
          id: `q_det_${batchIndex}_l1`,
          section: 'Listening',
          subject: 'Cognitive Sciences & Artificial Intelligence',
          instruction: 'Listen and Type: Type the exact sentence as dictated.',
          audioTranscript: 'Autonomous agent frameworks decompose complex multi-step objectives into structured programmatic tool calls.',
          questionText: 'Listen and type the dictated sentence:',
          correctAnswer: 'Autonomous agent frameworks decompose complex multi-step objectives into structured programmatic tool calls.'
        },
        {
          id: `q_det_${batchIndex}_l2`,
          section: 'Listening',
          subject: 'Cognitive Sciences & Artificial Intelligence',
          instruction: 'Listen and Select: What is the benefit of chain-of-thought prompting?',
          audioTranscript: 'Researcher: Requiring language models to generate intermediate reasoning tokens prior to outputting a final answer significantly boosts symbolic and mathematical accuracy.',
          questionText: 'Why does chain-of-thought prompting improve reasoning performance?',
          options: [
            'It allocates additional computational tokens for intermediate reasoning steps',
            'It physically cools down the server microchips during calculation',
            'It replaces all software algorithms with human manual typing',
            'It shuts off the internet to prevent outside noise'
          ],
          correctAnswer: 'It allocates additional computational tokens for intermediate reasoning steps'
        },
        {
          id: `q_det_${batchIndex}_l3`,
          section: 'Listening',
          subject: 'Cognitive Sciences & Artificial Intelligence',
          instruction: 'Dialogue Comprehension: What trade-off is discussed regarding model parameter quantization?',
          audioTranscript: 'Engineer: Quantizing model weights from 16-bit floating point to 4-bit integers reduces memory consumption by seventy percent with only marginal degradation in perplexity.',
          questionText: 'What primary advantage does 4-bit model quantization offer?',
          options: [
            'Drastically reduces memory consumption allowing execution on consumer edge devices',
            'Doubles the physical screen size of handheld mobile phones',
            'Eliminates the need for any computer battery or electricity',
            'Automatically translates all English words into Spanish'
          ],
          correctAnswer: 'Drastically reduces memory consumption allowing execution on consumer edge devices'
        },
        {
          id: `q_det_${batchIndex}_s1`,
          section: 'Speaking',
          subject: 'Cognitive Sciences & Artificial Intelligence',
          instruction: 'Speak on AI: Talk for 90 seconds on human-AI collaborative workflows.',
          questionText: 'Explain how generative tools assist scientific researchers in synthesizing literature and drafting hypotheses.',
          modelAnswer: 'Generative AI accelerates scientific discovery by parsing thousands of peer-reviewed articles, extracting domain-specific correlations, and suggesting experimental parameters, allowing human scientists to focus on empirical validation and creative hypothesis generation.'
        },
        {
          id: `q_det_${batchIndex}_s2`,
          section: 'Speaking',
          subject: 'Cognitive Sciences & Artificial Intelligence',
          instruction: 'Describe an Image: Describe a diagram showing neural network layer weights.',
          questionText: 'Describe an architectural visual showing multi-head attention heads and feedforward layers.',
          modelAnswer: 'The diagram shows an input token sequence entering multi-head attention layers where query, key, and value vectors compute contextual attention weights before passing through residual normalization and feedforward blocks.'
        },
        {
          id: `q_det_${batchIndex}_w1`,
          section: 'Writing',
          subject: 'Cognitive Sciences & Artificial Intelligence',
          instruction: 'Write a 5-minute timed response (minimum 80 words) to the prompt.',
          questionText: 'Some artists fear generative image models will devalue human creativity, while others believe AI serves as a powerful collaborative instrument. What is your perspective?',
          modelAnswer: 'Throughout human history, every transformative technological disruption—from the invention of daguerreotype photography to synthesizer sequencers—sparked existential anxiety among traditional artists. However, mechanical tools do not extinguish artistic expression; rather, they expand the boundaries of the creative imagination. Generative models allow solo creators to rapidly storyboard cinematic visions and explore aesthetic permutations that once required multi-million-dollar production studios, thereby democratizing artistic creation.'
        },
        {
          id: `q_det_${batchIndex}_w2`,
          section: 'Writing',
          subject: 'Cognitive Sciences & Artificial Intelligence',
          instruction: 'Short Analysis: Write 2-3 sentences evaluating algorithmic alignment in agent systems.',
          questionText: 'Why is reinforcement learning from human feedback (RLHF) critical for frontier AI safety?',
          modelAnswer: 'Reinforcement learning from human feedback aligns raw model probabilistic outputs with human ethical norms, reducing harmful generations and ensuring models refuse dangerous or deceptive queries.'
        }
      ]
    },

    // 5. Cambridge English (C1/C2) Daily Simulation
    {
      id: `mock_cam_${batchIndex}_05`,
      exam: 'Cambridge English',
      title: `Cambridge C1 Advanced (CAE) Simulation #${302 + batchIndex * 5 + 1}`,
      difficulty: 'Advanced',
      subject: 'Urban Ecology & Municipal Pedestrianization',
      totalDurationMin: 70,
      targetBandRequirement: 'Grade A / C2 Level (200+ Points)',
      sections: [
        { id: `sec_cam_r_${batchIndex}`, name: 'Reading', durationMinutes: 25, questionsCount: 3, samplePrompt: 'Key Word Transformations & Urban Cloze', rubric: [{ criteria: 'Grammar', weight: '50%', description: 'Structure' }, { criteria: 'Vocabulary', weight: '50%', description: 'Collocation' }] },
        { id: `sec_cam_lis_${batchIndex}`, name: 'Listening', durationMinutes: 15, questionsCount: 3, samplePrompt: 'Radio Broadcast on Urban Green Corridors', rubric: [{ criteria: 'Comprehension', weight: '50%', description: 'Comprehension' }, { criteria: 'Nuance', weight: '50%', description: 'Nuance' }] },
        { id: `sec_cam_spk_${batchIndex}`, name: 'Speaking', durationMinutes: 15, questionsCount: 2, samplePrompt: 'Collaborative Discourse on City Livability', rubric: [{ criteria: 'Fluency', weight: '50%', description: 'Fluency' }, { criteria: 'Register', weight: '50%', description: 'Formal register' }] },
        { id: `sec_cam_w_${batchIndex}`, name: 'Writing', durationMinutes: 15, questionsCount: 2, samplePrompt: 'Formal Report for Municipal Environmental Directorate', rubric: [{ criteria: 'Report Structure', weight: '50%', description: 'Structure' }, { criteria: 'Argumentation', weight: '50%', description: 'Logic' }] }
      ],
      questions: [
        {
          id: `q_cam_${batchIndex}_r1`,
          section: 'Reading',
          subject: 'Urban Ecology & Municipal Pedestrianization',
          instruction: 'Complete the sentence using between 3 and 6 words including the given word in CAPITAL letters.',
          questionText: 'Original: "Sarah only realized how intricate the software was after she inspected the architecture diagram."\nGiven Word: DID\nCompletion: "Not until she inspected the architecture diagram ____________________ how intricate the software was."',
          options: [
            'did Sarah realize',
            'did she had realized',
            'did Sarah really understand',
            'Sarah did realize'
          ],
          correctAnswer: 'did Sarah realize'
        },
        {
          id: `q_cam_${batchIndex}_r2`,
          section: 'Reading',
          subject: 'Urban Ecology & Municipal Pedestrianization',
          instruction: 'Reading & Use of English: Choose the correct academic collocation.',
          questionText: 'Urban planning directors noted that converting arterial roads into pedestrian thoroughfares has consistently _____ retail dwell time and footfall.',
          options: ['augmented', 'evaporated', 'disheartened', 'interrupted'],
          correctAnswer: 'augmented'
        },
        {
          id: `q_cam_${batchIndex}_r3`,
          section: 'Reading',
          subject: 'Urban Ecology & Municipal Pedestrianization',
          instruction: 'Text Analysis: What environmental dividend is achieved by green bioswales?',
          passage: 'Engineered bioswales installed along pedestrian walkways incorporate native wetland vegetation and gravel filtration beds, naturally decontaminating surface runoff and replenishing shallow water tables.',
          questionText: 'What is the primary ecological benefit of roadside bioswales?',
          options: [
            'Filtering stormwater contaminants while recharging localized water tables',
            'Increasing highway vehicle speeds during heavy rainfall',
            'Replacing all municipal drinking water purification plants',
            'Eliminating the need for pedestrian sidewalks'
          ],
          correctAnswer: 'Filtering stormwater contaminants while recharging localized water tables'
        },
        {
          id: `q_cam_${batchIndex}_l1`,
          section: 'Listening',
          subject: 'Urban Ecology & Municipal Pedestrianization',
          instruction: 'Listen to a municipal transport interview and answer the question.',
          audioTranscript: 'Director: Air quality sensors recorded a forty-two percent drop in nitrogen dioxide concentrations within ninety days of inaugurating the car-free central boulevard.',
          questionText: 'What empirical result followed the pedestrianization of the central boulevard?',
          options: [
            'A forty-two percent reduction in ambient nitrogen dioxide levels',
            'A complete shutdown of all municipal bus lines',
            'A sudden doubling of traffic accidents across the city',
            'The closure of all retail storefronts along the avenue'
          ],
          correctAnswer: 'A forty-two percent reduction in ambient nitrogen dioxide levels'
        },
        {
          id: `q_cam_${batchIndex}_l2`,
          section: 'Listening',
          subject: 'Urban Ecology & Municipal Pedestrianization',
          instruction: 'Interview Comprehension: How were delivery logistics accommodated?',
          audioTranscript: 'Director: Commercial freight deliveries are restricted to early morning hours using electric cargo bicycles and zero-emission micro-vans.',
          questionText: 'How are retail store deliveries handled in the pedestrian zone?',
          options: [
            'Restricted to early morning time slots using electric cargo bikes and micro-vans',
            'Stores are permanently forbidden from restocking merchandise',
            'Helicopters air-drop shipping containers into the pedestrian mall',
            'Customers must carry all bulk merchandise from distant ports'
          ],
          correctAnswer: 'Restricted to early morning time slots using electric cargo bikes and micro-vans'
        },
        {
          id: `q_cam_${batchIndex}_l3`,
          section: 'Listening',
          subject: 'Urban Ecology & Municipal Pedestrianization',
          instruction: 'Detail Question: What acoustic impact was measured?',
          audioTranscript: 'Acoustic Engineer: Ambient decibel levels dropped from seventy-eight decibels of constant vehicular roar down to fifty-two decibels of conversation and birdsong.',
          questionText: 'What acoustic transformation occurred in the pedestrianized district?',
          options: [
            'Ambient noise dropped from 78 to 52 decibels, restoring conversational acoustics',
            'Total acoustic silence where human speech was physically inaudible',
            'Acoustic noise tripled due to loud construction jackhammers',
            'Continuous sirens were sounded to warn pedestrians of cyclists'
          ],
          correctAnswer: 'Ambient noise dropped from 78 to 52 decibels, restoring conversational acoustics'
        },
        {
          id: `q_cam_${batchIndex}_s1`,
          section: 'Speaking',
          subject: 'Urban Ecology & Municipal Pedestrianization',
          instruction: 'Speaking Collaborative: Discuss urban livability and pedestrian zones.',
          questionText: 'How does pedestrianization alter social cohesion and public health in metropolitan centers?',
          modelAnswer: 'Removing vehicular traffic fosters spontaneous social encounters, encourages active commuting like walking and cycling, and lowers cardiovascular risks associated with sedentary habits and air pollution.'
        },
        {
          id: `q_cam_${batchIndex}_s2`,
          section: 'Speaking',
          subject: 'Urban Ecology & Municipal Pedestrianization',
          instruction: 'Speaking Long Turn: Evaluate public resistance to municipal car bans.',
          questionText: 'Why do business owners often oppose pedestrianization initially, and what changes their perspective?',
          modelAnswer: 'Retailers initially fear that removing curbside parking will deter customers. However, once implemented, high pedestrian dwell times lead to higher aggregate customer visits and increased retail turnover.'
        },
        {
          id: `q_cam_${batchIndex}_w1`,
          section: 'Writing',
          subject: 'Urban Ecology & Municipal Pedestrianization',
          instruction: 'Write a formal report of 220–260 words for the city council.',
          questionText: 'Write a report analyzing the feasibility of creating pedestrian-only green corridors in the central business district.',
          modelAnswer: 'REPORT: FEASIBILITY ASSESSMENT FOR DOWNTOWN PEDESTRIANIZATION\n\nIntroduction\nThis report investigates the socio-economic and environmental feasibility of converting three major arterial thoroughfares in the Central Business District (CBD) into pedestrian-only green transit corridors.\n\nImpact on Local Commerce\nMerchant surveys from comparable European urban transformations demonstrate that while street pedestrianization initially provokes resistance from motor trade retailers, footfall across retail and culinary establishments increases by an average of thirty-two percent within twelve months. Calmer streetscapes encourage leisure dwell time, significantly augmenting consumer transactions.\n\nTransit Integration & Air Quality\nBanning private combustion vehicular traffic will necessitate rerouting five municipal bus lines to adjacent ring avenues and expanding automated micro-mobility rental docks at pedestrian perimeter hubs. Telemetric air monitoring models project a forty-five percent diminution in localized particulate matter (PM2.5) and nitrogen dioxide levels within the core.\n\nRecommendations\nIt is strongly advised that the Directorate authorize a phased pilot program along Market Street over a four-month period, accompanied by real-time merchant revenue tracking.\n\nConclusion\nPedestrianization represents a viable, high-yield municipal modernization strategy that enhances both economic dynamism and public respiratory health.'
        },
        {
          id: `q_cam_${batchIndex}_w2`,
          section: 'Writing',
          subject: 'Urban Ecology & Municipal Pedestrianization',
          instruction: 'Formal Proposal: Draft a proposal for municipal micro-mobility hubs.',
          questionText: 'Propose a network of dockless electric bicycle and cargo hubs to support car-free zones.',
          modelAnswer: 'I propose establishing twelve micro-mobility hubs encircling the pedestrian boundary. Each hub will feature solar charging docks, secure bike lockers, and repair kiosks, facilitating frictionless multimodal transfers for urban commuters.'
        }
      ]
    },

    // 6. IELTS Academic Daily Practice Test
    {
      id: `mock_ielts_batch_${batchIndex}_06`,
      exam: 'IELTS',
      title: `IELTS Academic Full Simulation #${108 + batchIndex * 5 + 1}`,
      difficulty: 'Advanced',
      subject: 'Quantum Metrology & Laser Optics',
      totalDurationMin: 60,
      targetBandRequirement: 'Band 8.5+ (Superior Native Competence)',
      sections: [
        { id: `sec_ielts_r_${batchIndex}`, name: 'Reading', durationMinutes: 20, questionsCount: 3, samplePrompt: 'Reading: Optical Lattice Clocks and Relativistic Geodesy', rubric: [{ criteria: 'Reading Comprehension', weight: '50%', description: 'Comprehension' }, { criteria: 'Detail Extraction', weight: '50%', description: 'Data extraction' }] },
        { id: `sec_ielts_lis_${batchIndex}`, name: 'Listening', durationMinutes: 20, questionsCount: 3, samplePrompt: 'Lecture: Frequency Comb Laser Interferometry', rubric: [{ criteria: 'Acoustic Detail', weight: '50%', description: 'Details' }, { criteria: 'Synthesis', weight: '50%', description: 'Synthesis' }] },
        { id: `sec_ielts_spk_${batchIndex}`, name: 'Speaking', durationMinutes: 10, questionsCount: 2, samplePrompt: 'Speaking Parts 2 & 3: Precision Instruments', rubric: [{ criteria: 'Fluency', weight: '50%', description: 'Fluency' }, { criteria: 'Vocabulary', weight: '50%', description: 'Vocabulary' }] },
        { id: `sec_ielts_w_${batchIndex}`, name: 'Writing', durationMinutes: 10, questionsCount: 2, samplePrompt: 'Task 1 Graph & Task 2 Space Exploration Essay', rubric: [{ criteria: 'Task Achievement', weight: '50%', description: 'Achievement' }, { criteria: 'Coherence', weight: '50%', description: 'Coherence' }] }
      ],
      questions: [
        {
          id: `q_ielts_${batchIndex}_r1`,
          section: 'Reading',
          subject: 'Quantum Metrology & Laser Optics',
          instruction: 'Read the excerpt and select the correct scientific statement.',
          passage: 'Optical lattice atomic clocks utilize strontium atoms trapped in standing laser waves, measuring the oscillation of light at quadrillion cycles per second. Their unprecedented precision allows geophysicists to detect millimeter changes in Earths gravitational geoid via relativistic time dilation.',
          questionText: 'How do optical lattice atomic clocks assist geophysicists?',
          options: [
            'They measure millimeter changes in Earths gravitational geoid via relativistic time dilation',
            'They predict earthquakes by measuring underground magnetic storms',
            'They replace GPS satellites completely with laser optics',
            'They record seismic waves using sound echoes'
          ],
          correctAnswer: 'They measure millimeter changes in Earths gravitational geoid via relativistic time dilation'
        },
        {
          id: `q_ielts_${batchIndex}_r2`,
          section: 'Reading',
          subject: 'Quantum Metrology & Laser Optics',
          instruction: 'Reading Analysis: What physical effect causes clocks to tick at different rates at varying altitudes?',
          passage: 'Einsteins general theory of relativity dictates that clocks tick slower in stronger gravitational fields. An optical clock elevated by a single centimeter ticks measurably faster than one sitting on the floor.',
          questionText: 'According to general relativity, how does gravitational potential affect timekeeping?',
          options: [
            'Clocks tick faster at higher elevations where gravitational potential is weaker',
            'Clocks tick slower as they are moved further away from Earths center',
            'Time flows at an identical rate everywhere in the universe regardless of mass',
            'Clocks stop functioning completely when elevated above sea level'
          ],
          correctAnswer: 'Clocks tick faster at higher elevations where gravitational potential is weaker'
        },
        {
          id: `q_ielts_${batchIndex}_r3`,
          section: 'Reading',
          subject: 'Quantum Metrology & Laser Optics',
          instruction: 'Vocabulary in Context: What is an optical frequency comb?',
          passage: 'An optical frequency comb acts as a precision "ruler" for light, emitting evenly spaced spectral lines that bridge the gap between gigahertz radio frequencies and hundreds of terahertz optical oscillations.',
          questionText: 'The term "optical frequency comb" describes an optical tool that:',
          options: [
            'Emits discrete, evenly spaced spectral frequencies linking optical and microwave domains',
            'Brushes physical dust particles off laser mirrors in cleanrooms',
            'Combines electrical wires into single fiber optic bundles',
            'Converts sunlight into audible musical melodies'
          ],
          correctAnswer: 'Emits discrete, evenly spaced spectral frequencies linking optical and microwave domains'
        },
        {
          id: `q_ielts_${batchIndex}_l1`,
          section: 'Listening',
          subject: 'Quantum Metrology & Laser Optics',
          instruction: 'Listen to a quantum physics lecture and answer the question.',
          audioTranscript: 'Physicist: By cooling neutral strontium atoms to microkelvin temperatures, Doppler broadening is suppressed, enabling resonance line-widths narrower than one hertz.',
          questionText: 'Why do quantum metrologists cool strontium atoms to microkelvin temperatures?',
          options: [
            'To suppress thermal Doppler broadening and achieve ultra-narrow resonance spectral lines',
            'To freeze the laser beams into solid physical ice crystals',
            'To prevent the laboratory building from catching fire',
            'To allow scientists to touch the atoms with bare hands'
          ],
          correctAnswer: 'To suppress thermal Doppler broadening and achieve ultra-narrow resonance spectral lines'
        },
        {
          id: `q_ielts_${batchIndex}_l2`,
          section: 'Listening',
          subject: 'Quantum Metrology & Laser Optics',
          instruction: 'Lecture Comprehension: How do optical clocks redefine the international SI second?',
          audioTranscript: 'Physicist: The current SI second is defined by microwave cesium fountains. Optical clocks offer a hundred-fold gain in stability, preparing the international metrology community to redefine the second based on optical transitions.',
          questionText: 'Why is the international metrology community preparing to redefine the SI second?',
          options: [
            'Optical clocks provide a hundred-fold increase in precision over microwave cesium standards',
            'Cesium atoms have become completely extinct on planet Earth',
            'Microwave frequencies have been banned by telecommunication regulators',
            'Clocks powered by electricity are being replaced by sundials'
          ],
          correctAnswer: 'Optical clocks provide a hundred-fold increase in precision over microwave cesium standards'
        },
        {
          id: `q_ielts_${batchIndex}_l3`,
          section: 'Listening',
          subject: 'Quantum Metrology & Laser Optics',
          instruction: 'Detail Question: How does laser frequency stabilization improve gravitational wave detectors?',
          audioTranscript: 'Physicist: In interferometers like LIGO, frequency-stabilized lasers minimize phase noise, enabling the detection of strain variations smaller than the diameter of a single proton.',
          questionText: 'What sensitivity threshold is achieved by stabilized lasers in gravitational wave detectors?',
          options: [
            'Detecting spacetime strain displacements smaller than a protons diameter',
            'Hearing acoustic sound waves generated by ocean fish',
            'Measuring the weight of single grains of table salt',
            'Photographing objects hidden behind solid lead walls'
          ],
          correctAnswer: 'Detecting spacetime strain displacements smaller than a protons diameter'
        },
        {
          id: `q_ielts_${batchIndex}_s1`,
          section: 'Speaking',
          subject: 'Quantum Metrology & Laser Optics',
          instruction: 'Speaking Part 2: Describe a scientific precision measurement instrument.',
          questionText: 'Describe an advanced scientific instrument used in modern laboratories.',
          modelAnswer: 'I would like to describe the atomic force microscope. By scanning an ultra-fine cantilever tip across surfaces, it maps topography at sub-nanometer resolution, allowing material scientists to visualize individual atoms.'
        },
        {
          id: `q_ielts_${batchIndex}_s2`,
          section: 'Speaking',
          subject: 'Quantum Metrology & Laser Optics',
          instruction: 'Speaking Part 3: Discuss international measurement standards.',
          questionText: 'Why is global standardization of units and measurements essential for international trade and scientific collaboration?',
          modelAnswer: 'Uniform physical constants ensure that pharmaceuticals, aerospace components, and telecommunication protocols manufactured in different continents interoperate reliably, eliminating catastrophic calibration discrepancies.'
        },
        {
          id: `q_ielts_${batchIndex}_w1`,
          section: 'Writing',
          subject: 'Quantum Metrology & Laser Optics',
          instruction: 'Write an essay of at least 250 words responding to the prompt.',
          questionText: 'Some individuals argue that international expenditure on deep space exploration is unjustified while pressing environmental and poverty crises persist on Earth. Discuss both views and give your opinion.',
          modelAnswer: 'The allocation of public billions toward deep space exploration often ignites controversy in an era marked by terrestrial ecological fragility and socioeconomic disparity. While skeptics contend that domestic poverty alleviation demands singular fiscal priority, I maintain that space science generates critical technological dividends and environmental telemetry indispensable for Earths long-term survival.\n\nCritics legitimately observe that funding spent on extraterrestrial probes could immediately fund clean municipal water, renewable grids, and healthcare in marginalized populations. However, this view overlooks the origin of our environmental monitoring tools: satellite meteorology, climate modeling, and solar panel efficiency all originated directly from aerospace research programs.\n\nIn conclusion, space exploration and earthly sustainability are not mutually exclusive; orbital research equips humanity with the scientific precision necessary to protect our own planet.'
        },
        {
          id: `q_ielts_${batchIndex}_w2`,
          section: 'Writing',
          subject: 'Quantum Metrology & Laser Optics',
          instruction: 'Task 1 Academic: Describe a chart comparing atomic clock accuracy over time.',
          questionText: 'Summarize the chronological precision evolution from pendulum clocks to optical lattice clocks:',
          modelAnswer: 'The chart demonstrates an exponential trajectory of timekeeping precision across four centuries. While mechanical pendulum clocks achieved stability within seconds per day, optical lattice strontium clocks achieve fractional uncertainties below 10^-18, gaining or losing less than one second over the entire age of the universe.'
        }
      ]
    }
  ];

  return tests.map((t) => ({
    ...t,
    timestamp: ts,
    dateAdded: dt
  }));
}

// Generates at least 5 authentic practice tests (Reading, Listening, Writing, Speaking) with timestamp tracking
// EVERY practice test features AT LEAST 10 authentic questions strictly grounded in its declared subject.
export function generatePracticeTestsBatch(batchIndex: number, executionTimestamp?: string): IELTSPracticeTest[] {
  const ts = executionTimestamp || new Date().toISOString().replace('T', ' ').slice(0, 19);
  const dt = ts.slice(0, 10);

  const pt1Subject = 'Silicon Photonics & Optical Neural Computing';
  const pt1 = {
    id: `pt_daily_pte_batch_${batchIndex}_01`,
    category: 'IELTS Academic' as const,
    module: 'Reading' as const,
    title: `PTE & IELTS Daily Reading: Photonic Neural Networks #${batchIndex * 5 + 1}`,
    difficulty: 'Advanced' as const,
    durationMinutes: 15,
    questionCount: 10,
    timestamp: ts,
    dateAdded: dt,
    subject: pt1Subject,
    passage: `Silicon photonics integrates optical waveguides onto microchips, replacing electronic copper interconnects with modulated laser light. By processing matrix tensor operations at light speed with negligible thermal dissipation, optical computing mitigates the thermodynamic bottlenecks constraining modern deep learning data centers.`,
    prompt: 'What primary physical advantage does silicon photonics offer over copper interconnects in high-density AI clusters?',
    options: [
      'It computes tensor operations at light speed with negligible thermal dissipation',
      'It reduces the need for all semiconductor silicon components',
      'It runs software without any operating system kernel',
      'It converts electrical signals into acoustic waves'
    ],
    correctAnswer: 'It computes tensor operations at light speed with negligible thermal dissipation',
    explanation: 'Paragraph 1 explicitly notes that silicon photonics replaces copper interconnects by processing tensor operations at light speed with negligible thermal dissipation, eliminating thermodynamic bottlenecks.',
    questions: buildTenPracticeTestQuestions(
      `pt_daily_pte_batch_${batchIndex}_01`,
      'Reading',
      pt1Subject,
      'What primary physical advantage does silicon photonics offer over copper interconnects in high-density AI clusters?',
      [
        'It computes tensor operations at light speed with negligible thermal dissipation',
        'It reduces the need for all semiconductor silicon components',
        'It runs software without any operating system kernel',
        'It converts electrical signals into acoustic waves'
      ],
      'It computes tensor operations at light speed with negligible thermal dissipation',
      'Paragraph 1 explicitly notes that silicon photonics replaces copper interconnects by processing tensor operations at light speed with negligible thermal dissipation, eliminating thermodynamic bottlenecks.'
    )
  };

  const pt2Subject = 'Benthic Chemosynthesis & Deep Sea Extremophiles';
  const pt2 = {
    id: `pt_daily_toefl_batch_${batchIndex}_02`,
    category: 'IELTS Academic' as const,
    module: 'Listening' as const,
    title: `TOEFL & IELTS Listening: Benthic Chemosynthesis Lecture #${batchIndex * 5 + 2}`,
    difficulty: 'Standard' as const,
    durationMinutes: 12,
    questionCount: 10,
    timestamp: ts,
    dateAdded: dt,
    subject: pt2Subject,
    passage: `Deep hydrothermal vent communities flourish independent of solar photosynthesis, anchored instead by chemolithoautotrophic bacteria that metabolize superheated hydrogen sulfide billowing from hydrothermal chimneys.`,
    prompt: 'According to the lecture, what biochemical pathway sustains the trophic pyramid around hydrothermal vents?',
    options: [
      'Oxidation of hydrogen sulfide by chemosynthetic archaea in absolute darkness',
      'Filtered moonlight penetrating benthic oceanic trenches',
      'Organic detritus descending from coastal agricultural runoff',
      'Geothermal radiation powering photosynthesis in giant kelp forests'
    ],
    correctAnswer: 'Oxidation of hydrogen sulfide by chemosynthetic archaea in absolute darkness',
    explanation: 'The lecturer emphasizes that chemosynthetic archaea oxidize hydrogen sulfide to synthesize carbohydrates without solar light, forming the biological foundation of the ecosystem.',
    questions: buildTenPracticeTestQuestions(
      `pt_daily_toefl_batch_${batchIndex}_02`,
      'Listening',
      pt2Subject,
      'According to the lecture, what biochemical pathway sustains the trophic pyramid around hydrothermal vents?',
      [
        'Oxidation of hydrogen sulfide by chemosynthetic archaea in absolute darkness',
        'Filtered moonlight penetrating benthic oceanic trenches',
        'Organic detritus descending from coastal agricultural runoff',
        'Geothermal radiation powering photosynthesis in giant kelp forests'
      ],
      'Oxidation of hydrogen sulfide by chemosynthetic archaea in absolute darkness',
      'The lecturer emphasizes that chemosynthetic archaea oxidize hydrogen sulfide to synthesize carbohydrates without solar light, forming the biological foundation of the ecosystem.'
    )
  };

  const pt3Subject = 'Clinical Communication & Verbal De-escalation Protocols';
  const pt3 = {
    id: `pt_daily_oet_batch_${batchIndex}_03`,
    category: 'IELTS General Training' as const,
    module: 'Reading' as const,
    title: `OET & GT Workplace Case: Clinical De-escalation Protocol #${batchIndex * 5 + 3}`,
    difficulty: 'Standard' as const,
    durationMinutes: 15,
    questionCount: 10,
    timestamp: ts,
    dateAdded: dt,
    subject: pt3Subject,
    passage: `Hospital staff encountering agitated patients must prioritize verbal de-escalation over chemical restraint. Healthcare workers should maintain an open posture at a 45-degree angle, respect personal space of at least two arms lengths, use a gentle modulated tone of voice, validate emotional distress, and avoid confrontational ultimatums.`,
    prompt: 'What is the mandated physical positioning for healthcare workers initiating verbal de-escalation?',
    options: [
      'An open posture at a 45-degree angle maintaining at least two arms lengths of personal space',
      'Direct frontal alignment at close proximity within arm reach',
      'Seated directly behind a barrier with folded arms',
      'Standing directly beside the patient while raising voice volume'
    ],
    correctAnswer: 'An open posture at a 45-degree angle maintaining at least two arms lengths of personal space',
    explanation: 'The workplace safety protocol stipulates an open posture angled at 45 degrees while respecting a distance of two arms lengths.',
    questions: buildTenPracticeTestQuestions(
      `pt_daily_oet_batch_${batchIndex}_03`,
      'Reading',
      pt3Subject,
      'What is the mandated physical positioning for healthcare workers initiating verbal de-escalation?',
      [
        'An open posture at a 45-degree angle maintaining at least two arms lengths of personal space',
        'Direct frontal alignment at close proximity within arm reach',
        'Seated directly behind a barrier with folded arms',
        'Standing directly beside the patient while raising voice volume'
      ],
      'An open posture at a 45-degree angle maintaining at least two arms lengths of personal space',
      'The workplace safety protocol stipulates an open posture angled at 45 degrees while respecting a distance of two arms lengths.'
    )
  };

  const pt4Subject = 'Decentralized Edge Computing Architectures';
  const pt4 = {
    id: `pt_daily_det_batch_${batchIndex}_04`,
    category: 'IELTS Academic' as const,
    module: 'Writing' as const,
    title: `DET & Cambridge Academic Writing: Distributed Computing #${batchIndex * 5 + 4}`,
    difficulty: 'Advanced' as const,
    durationMinutes: 20,
    questionCount: 10,
    timestamp: ts,
    dateAdded: dt,
    subject: pt4Subject,
    prompt: 'Evaluate whether decentralized edge computing will supersede centralized hyperscale cloud architectures over the coming decade.',
    sampleAnswer: 'While hyperscale clouds provide unmatched centralized storage economies, the explosive growth of latency-critical autonomous systems mandates edge processing. Bandwidth constraints make backhauling petabytes of raw sensor data impractical; hence, decentralized computing at local ingress nodes represents the defining paradigm of next-generation infrastructure.',
    explanation: 'Band 9 Task 2 standard: Addresses the prompt comprehensively with technical precision, logical topic sentences, and cohesive progression.',
    questions: buildTenPracticeTestQuestions(
      `pt_daily_det_batch_${batchIndex}_04`,
      'Writing',
      pt4Subject,
      'Evaluate whether decentralized edge computing will supersede centralized hyperscale cloud architectures over the coming decade.',
      undefined,
      undefined,
      'Addresses prompt with architectural trade-offs between backhaul bandwidth constraints and localized compute economies.'
    )
  };

  const pt5Subject = 'Edge Silicon & Local Language Model Quantization';
  const pt5 = {
    id: `pt_daily_cam_batch_${batchIndex}_05`,
    category: 'IELTS General Training' as const,
    module: 'Speaking' as const,
    title: `Cambridge & IELTS Cue Card: A Technological Innovation #${batchIndex * 5 + 5}`,
    difficulty: 'Advanced' as const,
    durationMinutes: 10,
    questionCount: 10,
    timestamp: ts,
    dateAdded: dt,
    subject: pt5Subject,
    prompt: 'Describe a recent scientific or technological innovation that has positively impacted your daily routine.',
    sampleAnswer: 'I would like to discuss open-source local language models running on edge silicon. Unlike cloud dependencies that introduce latency and data privacy risks, having a 4-bit quantized tutor running locally on my personal machine has transformed my study efficiency, providing instant Socratic feedback on calculus proofs and linguistic nuance without requiring continuous internet connectivity.',
    explanation: 'Model Band 9 speaking performance demonstrating fluency, natural discourse markers, and rich academic vocabulary.',
    questions: buildTenPracticeTestQuestions(
      `pt_daily_cam_batch_${batchIndex}_05`,
      'Speaking',
      pt5Subject,
      'Describe a recent scientific or technological innovation that has positively impacted your daily routine.',
      undefined,
      undefined,
      'Model Band 9 speaking performance demonstrating fluency, discourse markers, and academic vocabulary.'
    )
  };

  return [pt1, pt2, pt3, pt4, pt5].map((test) => ({
    ...test,
    questions: test.questions.map((q) => ({
      ...q,
      options: q.options ? shuffleOptions(q.options, q.correctAnswer) : undefined
    }))
  }));
}

export function getInitialIngestedItemsLedger(): IngestedItemRecord[] {
  return [
    {
      id: 'ing_01',
      timestamp: '2026-10-31 00:00:02',
      jobId: 'job_exam_midnight_00',
      jobName: 'Nightly 00:00 Multi-Exam Test Generator',
      itemType: 'Mock Test',
      itemTitle: 'PTE Academic Daily Simulation #26',
      categoryOrExam: 'PTE',
      details: 'Speaking & Listening sections with Write from Dictation rubric'
    },
    {
      id: 'ing_02',
      timestamp: '2026-10-31 00:00:02',
      jobId: 'job_exam_midnight_00',
      jobName: 'Nightly 00:00 Multi-Exam Test Generator',
      itemType: 'Mock Test',
      itemTitle: 'TOEFL iBT Academic Simulation #91',
      categoryOrExam: 'TOEFL',
      details: 'Paleoclimatology & Carbon Sequestration Reading & Writing'
    },
    {
      id: 'ing_03',
      timestamp: '2026-10-31 00:00:02',
      jobId: 'job_exam_midnight_00',
      jobName: 'Nightly 00:00 Multi-Exam Test Generator',
      itemType: 'Mock Test',
      itemTitle: 'OET Healthcare Clinical Practice Test #43',
      categoryOrExam: 'OET',
      details: 'Sepsis Six Emergency Protocol & Referral Letter'
    },
    {
      id: 'ing_04',
      timestamp: '2026-10-31 00:00:02',
      jobId: 'job_exam_midnight_00',
      jobName: 'Nightly 00:00 Multi-Exam Test Generator',
      itemType: 'Mock Test',
      itemTitle: 'Duolingo English Test Adaptive Simulation #15',
      categoryOrExam: 'DET',
      details: 'C-Test Read and Complete & 5-Min Timed Writing'
    },
    {
      id: 'ing_05',
      timestamp: '2026-10-31 00:00:02',
      jobId: 'job_exam_midnight_00',
      jobName: 'Nightly 00:00 Multi-Exam Test Generator',
      itemType: 'Mock Test',
      itemTitle: 'Cambridge C1 Advanced (CAE) Simulation #303',
      categoryOrExam: 'Cambridge English',
      details: 'Use of English Key Word Transformations & Municipal Report'
    },
    {
      id: 'ing_06',
      timestamp: '2026-10-31 00:00:02',
      jobId: 'job_exam_midnight_00',
      jobName: 'Nightly 00:00 Multi-Exam Test Generator',
      itemType: 'Practice Test',
      itemTitle: 'PTE & IELTS Daily Reading: Photonic Neural Networks #1',
      categoryOrExam: 'IELTS Academic (Reading)',
      details: 'Silicon photonics matrix tensor operations with passage & verified answer'
    },
    {
      id: 'ing_07',
      timestamp: '2026-10-31 00:00:02',
      jobId: 'job_exam_midnight_00',
      jobName: 'Nightly 00:00 Multi-Exam Test Generator',
      itemType: 'Practice Test',
      itemTitle: 'TOEFL & IELTS Listening: Benthic Chemosynthesis Lecture #2',
      categoryOrExam: 'IELTS Academic (Listening)',
      details: 'Hydrothermal vents lecture transcript & chemosynthesis comprehension'
    },
    {
      id: 'ing_08',
      timestamp: '2026-10-31 00:00:02',
      jobId: 'job_exam_midnight_00',
      jobName: 'Nightly 00:00 Multi-Exam Test Generator',
      itemType: 'Practice Test',
      itemTitle: 'OET & GT Workplace Case: Clinical De-escalation Protocol #3',
      categoryOrExam: 'IELTS General Training (Reading)',
      details: 'Hospital verbal de-escalation posture & distance guidelines'
    },
    {
      id: 'ing_09',
      timestamp: '2026-10-31 00:00:02',
      jobId: 'job_exam_midnight_00',
      jobName: 'Nightly 00:00 Multi-Exam Test Generator',
      itemType: 'Practice Test',
      itemTitle: 'DET & Cambridge Academic Writing: Distributed Computing #4',
      categoryOrExam: 'IELTS Academic (Writing)',
      details: 'Decentralized edge computing vs hyperscale clouds Task 2 prompt & exemplar'
    },
    {
      id: 'ing_10',
      timestamp: '2026-10-31 00:00:02',
      jobId: 'job_exam_midnight_00',
      jobName: 'Nightly 00:00 Multi-Exam Test Generator',
      itemType: 'Practice Test',
      itemTitle: 'Cambridge & IELTS Cue Card: A Technological Innovation #5',
      categoryOrExam: 'IELTS General Training (Speaking)',
      details: 'Edge silicon language models 2-minute sustained monologue with Band 9 rubric'
    },
    {
      id: 'ing_11',
      timestamp: '2026-10-31 00:00:04',
      jobId: 'job_vocab_expansion_00',
      jobName: 'Nightly Vocabulary Vault Expansion',
      itemType: 'Vocabulary Word',
      itemTitle: 'Aberration (/ˌæb.əˈreɪ.ʃən/)',
      categoryOrExam: 'Scientific Inquiry (CEFR C1)',
      details: 'A departure from what is normal, usual, or expected.'
    },
    {
      id: 'ing_12',
      timestamp: '2026-10-31 00:00:04',
      jobId: 'job_vocab_expansion_00',
      jobName: 'Nightly Vocabulary Vault Expansion',
      itemType: 'Vocabulary Word',
      itemTitle: 'Acumen (/ˈæk.jə.mən/)',
      categoryOrExam: 'Enterprise & Career (CEFR C1)',
      details: 'The ability to make good judgments and quick decisions.'
    },
    {
      id: 'ing_13',
      timestamp: '2026-10-31 00:00:04',
      jobId: 'job_vocab_expansion_00',
      jobName: 'Nightly Vocabulary Vault Expansion',
      itemType: 'Vocabulary Word',
      itemTitle: 'Ameliorate (/əˈmiː.li.ə.reɪt/)',
      categoryOrExam: 'Academic Discourse (CEFR C1)',
      details: 'To make something bad or unsatisfactory better.'
    },
    {
      id: 'ing_14',
      timestamp: '2026-10-31 00:00:04',
      jobId: 'job_vocab_expansion_00',
      jobName: 'Nightly Vocabulary Vault Expansion',
      itemType: 'Vocabulary Word',
      itemTitle: 'Corroborate (/kəˈrɒb.ə.reɪt/)',
      categoryOrExam: 'Academic Writing (CEFR C1)',
      details: 'Confirm or give support to a statement, theory, or finding.'
    },
    {
      id: 'ing_15',
      timestamp: '2026-10-31 00:00:04',
      jobId: 'job_vocab_expansion_00',
      jobName: 'Nightly Vocabulary Vault Expansion',
      itemType: 'Vocabulary Word',
      itemTitle: 'Juxtapose (/ˌdʒʌk.stəˈpəʊz/)',
      categoryOrExam: 'Philosophy & Logic (CEFR C1)',
      details: 'Place or deal with close together for contrasting effect.'
    }
  ];
}

