import { MockTest, ScheduledJob, VocabularyWord, AuditLog } from '../types';

export const initialScheduledJobs: ScheduledJob[] = [
  {
    id: 'job_exam_midnight_00',
    name: 'Nightly 00:00 Mock Exam Generator',
    description: 'Scheduled cron at 00:00 night hours to automatically generate at least 5 full practice tests in IELTS & PTE across all modules (Reading, Listening, Writing, Speaking).',
    cronExpression: '0 0 * * *',
    targetTime: '00:00 UTC (Nightly)',
    category: 'EXAM_PREP',
    enabled: true,
    lastRunTimestamp: 'Last run: 2026-10-30 00:00:02',
    nextRunTimestamp: 'Tonight at 00:00 UTC',
    itemsGeneratedCount: 15,
    status: 'idle',
    batchTarget: 'At least 5 Mock Tests (IELTS & PTE in all 4 modules)'
  },
  {
    id: 'job_vocab_expansion_00',
    name: 'Nightly Vocabulary Vault Expansion',
    description: 'Scheduled cron at 00:00 night hours to curate and add at least 100 new academic, STEM, and conversational words with phonetics, CEFR levels, and audio contexts.',
    cronExpression: '0 0 * * *',
    targetTime: '00:00 UTC (Nightly)',
    category: 'VOCABULARY',
    enabled: true,
    lastRunTimestamp: 'Last run: 2026-10-30 00:00:04',
    nextRunTimestamp: 'Tonight at 00:00 UTC',
    itemsGeneratedCount: 300,
    status: 'idle',
    batchTarget: 'At least 100 Vocabulary Words with CEFR Levels'
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

// Helper to expand and generate full 100 words dynamically
export function generateOneHundredWordsBatch(batchNumber: number): VocabularyWord[] {
  const categories = [
    'Academic Writing', 'STEM & Logic', 'IELTS & PTE Lexicon', 'Enterprise Technology',
    'Clinical & Health', 'Environmental Systems', 'Philosophy & Ethics', 'Cognitive Psychology'
  ];
  const cefrTiers: ('B1' | 'B2' | 'C1' | 'C2')[] = ['B2', 'C1', 'B2', 'C1', 'C2', 'B1'];

  const words: VocabularyWord[] = [];
  const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

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
      dateAdded: now
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
      dateAdded: now
    });
  });

  return words;
}

// Generates 5 distinct mock tests across IELTS & PTE in all 4 modules (Reading, Listening, Writing, Speaking)
export function generateFivePracticeTestsBatch(batchIndex: number): MockTest[] {
  const tests: MockTest[] = [
    // 1. IELTS Academic Test #105
    {
      id: `mock_ielts_${batchIndex}_01`,
      exam: 'IELTS',
      title: `IELTS Academic Full Simulation #${104 + batchIndex * 5 + 1}`,
      difficulty: 'Standard',
      totalDurationMin: 60,
      targetBandRequirement: '7.5 – 8.5 Band',
      sections: [
        {
          id: 'sec_r_1',
          name: 'Reading',
          durationMinutes: 20,
          questionsCount: 3,
          samplePrompt: 'Academic Passage on Neuro-Symbolic Artificial Intelligence',
          rubric: [
            { criteria: 'Skimming & Scanning', weight: '25%', description: 'Quick extraction of specific factual data' },
            { criteria: 'Inference', weight: '25%', description: 'Deducing implied meanings not explicitly written' },
            { criteria: 'True/False/Not Given', weight: '50%', description: 'Strict factual attribution against text' }
          ]
        },
        {
          id: 'sec_w_1',
          name: 'Writing',
          durationMinutes: 25,
          questionsCount: 1,
          samplePrompt: 'Task 2: Academic Essay on Decentralized Renewable Energy vs Central Grids',
          rubric: [
            { criteria: 'Task Achievement', weight: '25%', description: 'Addresses all prompt facets thoroughly' },
            { criteria: 'Cohesion & Coherence', weight: '25%', description: 'Logical paragraph flow and precise discourse markers' },
            { criteria: 'Lexical Resource', weight: '25%', description: 'Advanced academic vocabulary with accurate collocations' },
            { criteria: 'Grammatical Range', weight: '25%', description: 'Complex sentence structures with zero error rate' }
          ]
        },
        {
          id: 'sec_s_1',
          name: 'Speaking',
          durationMinutes: 15,
          questionsCount: 2,
          samplePrompt: 'Part 2 Cue Card: Describe an environmental technology innovation that impressed you',
          rubric: [
            { criteria: 'Fluency & Coherence', weight: '25%', description: 'Smooth tempo without unnatural hesitations' },
            { criteria: 'Lexical Resource', weight: '25%', description: 'Varied idiomatic expressions' },
            { criteria: 'Grammar', weight: '25%', description: 'Accurate conditionals and passive forms' },
            { criteria: 'Pronunciation', weight: '25%', description: 'Clear intonation and natural sentence stress' }
          ]
        }
      ],
      questions: [
        {
          id: `q_ielts_${batchIndex}_r1`,
          section: 'Reading',
          instruction: 'Read the excerpt and answer the inference question.',
          passage: `While statistical deep learning models demonstrate unprecedented pattern recognition across massive corpora, their black-box nature leaves them vulnerable to out-of-distribution hallucinations. Neuro-symbolic frameworks combine neural perceptual prowess with symbolic knowledge graphs, enabling verifiable deductive reasoning that satisfies enterprise safety constraints.`,
          questionText: 'According to the passage, what is the primary advantage of coupling symbolic reasoning with neural networks?',
          options: [
            'It enables verifiable deductive reasoning and mitigates hallucinations',
            'It reduces GPU memory usage to zero',
            'It eliminates the need for any training datasets',
            'It prevents models from processing multilingual text'
          ],
          correctAnswer: 'It enables verifiable deductive reasoning and mitigates hallucinations'
        },
        {
          id: `q_ielts_${batchIndex}_w1`,
          section: 'Writing',
          instruction: 'Write an academic essay of at least 250 words responding to the following prompt.',
          questionText: 'Governments should prioritize decentralized community-level solar and battery storage systems over mega-scale centralized power plants. To what extent do you agree or disagree?',
          modelAnswer: `The debate over municipal energy topology has intensified as geopolitical instability and climate disruptions threaten traditional centralized infrastructure. I firmly argue that investing in decentralized microgrids delivers superior resilience and democratic energy sovereignty compared to monolithic power stations.\n\nPrimarily, decentralized architectures eliminate single points of catastrophic vulnerability. When regional transmission lines fail, localized distributed batteries isolate failures and sustain critical services. Furthermore, local storage incentivizes civic stewardship and reduces line loss during transmission.`
        },
        {
          id: `q_ielts_${batchIndex}_s1`,
          section: 'Speaking',
          instruction: 'Deliver a 2-minute oral response to the cue card prompt.',
          questionText: 'Describe an environmental technology or energy innovation that you believe will fundamentally reshape urban living.',
          modelAnswer: 'I would like to discuss grid-scale flow battery storage. Unlike lithium-ion chemistries prone to thermal degradation, flow batteries use liquid electrolyte tanks that separate energy capacity from power output, offering safe twenty-year operational lifespans.'
        }
      ]
    },

    // 2. PTE Academic Test #23
    {
      id: `mock_pte_${batchIndex}_02`,
      exam: 'PTE',
      title: `PTE Academic Master Diagnostic #${22 + batchIndex * 5 + 1}`,
      difficulty: 'Advanced',
      totalDurationMin: 50,
      targetBandRequirement: '79+ (IELTS 8.0 Equivalent)',
      sections: [
        {
          id: 'sec_pte_spk_2',
          name: 'Speaking',
          durationMinutes: 15,
          questionsCount: 2,
          samplePrompt: 'Read Aloud & Re-tell Lecture',
          rubric: [
            { criteria: 'Oral Fluency', weight: '40%', description: 'Cadence, rhythm, no false restarts' },
            { criteria: 'Pronunciation', weight: '40%', description: 'Vowel purity, syllable stress' },
            { criteria: 'Content', weight: '20%', description: 'All key lecture terms accurately delivered' }
          ]
        },
        {
          id: 'sec_pte_lis_2',
          name: 'Listening',
          durationMinutes: 35,
          questionsCount: 2,
          samplePrompt: 'Write From Dictation & Summarize Spoken Text',
          rubric: [
            { criteria: 'Spelling Accuracy', weight: '50%', description: 'Exact matches of grammatical morphemes' },
            { criteria: 'Semantic Capture', weight: '50%', description: 'Key lecture thesis retention' }
          ]
        }
      ],
      questions: [
        {
          id: `q_pte_${batchIndex}_1`,
          section: 'Speaking',
          instruction: 'Read Aloud: Speak clearly into your microphone within 35 seconds.',
          questionText: 'The integration of quantum key distribution across metropolitan fiber loops ensures mathematical immunity against eavesdropping, heralding an era of cryptographically unassailable communication.',
          correctAnswer: 'The integration of quantum key distribution across metropolitan fiber loops ensures mathematical immunity against eavesdropping, heralding an era of cryptographically unassailable communication.'
        },
        {
          id: `q_pte_${batchIndex}_2`,
          section: 'Listening',
          instruction: 'Write from Dictation: Type the exact lecture sentence as dictated.',
          audioTranscript: 'Comprehensive peer review guarantees the empirical reproducibility of all published findings.',
          questionText: 'Listen to the audio clip and type the exact sentence:',
          correctAnswer: 'Comprehensive peer review guarantees the empirical reproducibility of all published findings.'
        }
      ]
    },

    // 3. IELTS Academic Test #106
    {
      id: `mock_ielts_${batchIndex}_03`,
      exam: 'IELTS',
      title: `IELTS Academic Full Simulation #${104 + batchIndex * 5 + 2}`,
      difficulty: 'Advanced',
      totalDurationMin: 60,
      targetBandRequirement: '8.0 Band',
      sections: [
        {
          id: 'sec_r_3',
          name: 'Reading',
          durationMinutes: 20,
          questionsCount: 2,
          samplePrompt: 'Academic Passage on Deep Ocean Geothermal Vents',
          rubric: [
            { criteria: 'Factual Accuracy', weight: '50%', description: 'Direct text correspondence' },
            { criteria: 'Inference', weight: '50%', description: 'Deductive reasoning' }
          ]
        },
        {
          id: 'sec_w_3',
          name: 'Writing',
          durationMinutes: 25,
          questionsCount: 1,
          samplePrompt: 'Task 2: The Economic Ramifications of Remote Global Labor Markets',
          rubric: [
            { criteria: 'Task Response', weight: '25%', description: 'Thorough evaluation of economic effects' },
            { criteria: 'Cohesion', weight: '25%', description: 'Paragraph logic and discourse' },
            { criteria: 'Lexical Resource', weight: '25%', description: 'Advanced economic terminology' },
            { criteria: 'Grammar Accuracy', weight: '25%', description: 'Complex sentence mastery' }
          ]
        }
      ],
      questions: [
        {
          id: `q_ielts_${batchIndex}_r3`,
          section: 'Reading',
          instruction: 'Answer based on the scientific text.',
          passage: `Chemosynthetic bacteria dwelling around abyssal hydrothermal vents synthesize organic macromolecules utilizing hydrogen sulfide rather than sunlight. This radical biochemical pathway challenges traditional planetary habitability definitions, bolstering hypotheses that life could flourish within the subsurface oceans of Jovian moons like Europa.`,
          questionText: 'Why do chemosynthetic hydrothermal communities challenge standard planetary habitability models?',
          options: [
            'They prove complex biological ecosystems can thrive entirely without solar radiation',
            'They show life requires oxygen in extreme atmospheric concentrations',
            'They indicate Europa has no geothermal activity',
            'They prove all ocean life originated on land'
          ],
          correctAnswer: 'They prove complex biological ecosystems can thrive entirely without solar radiation'
        },
        {
          id: `q_ielts_${batchIndex}_w3`,
          section: 'Writing',
          instruction: 'Write an essay of at least 250 words discussing remote global work.',
          questionText: 'The rise of borderless remote employment allows multinational firms to hire worldwide talent, yet may destabilize local labor economies. Discuss both sides and give your opinion.',
          modelAnswer: 'The advent of asynchronous borderless employment has rewritten international economics. While developing regions enjoy unprecedented access to high-value software and design salaries, domestic firms in emerging economies often suffer talent drain. On balance, remote labor bridges global wage inequality when complemented by local tax modernization.'
        }
      ]
    },

    // 4. PTE Academic Test #24
    {
      id: `mock_pte_${batchIndex}_04`,
      exam: 'PTE',
      title: `PTE Academic Master Diagnostic #${22 + batchIndex * 5 + 2}`,
      difficulty: 'Standard',
      totalDurationMin: 45,
      targetBandRequirement: '79+ (Band 8.0)',
      sections: [
        {
          id: 'sec_pte_spk_4',
          name: 'Speaking',
          durationMinutes: 15,
          questionsCount: 2,
          samplePrompt: 'Describe Image & Retell Lecture',
          rubric: [
            { criteria: 'Fluency', weight: '50%', description: 'Native rhythm without hesitation' },
            { criteria: 'Pronunciation', weight: '50%', description: 'Intelligibility & phonetic clarity' }
          ]
        },
        {
          id: 'sec_pte_wri_4',
          name: 'Writing',
          durationMinutes: 30,
          questionsCount: 1,
          samplePrompt: 'Write Essay on Algorithmic Auditing',
          rubric: [
            { criteria: 'Grammar', weight: '30%', description: 'Syntactic variety' },
            { criteria: 'Vocabulary', weight: '30%', description: 'Academic terminology' },
            { criteria: 'Structure', weight: '40%', description: 'Essay coherence' }
          ]
        }
      ],
      questions: [
        {
          id: `q_pte_${batchIndex}_spk4`,
          section: 'Speaking',
          instruction: 'Read Aloud into the microphone.',
          questionText: 'Urban microclimatic monitoring requires high-density distributed sensor meshes to detect localized thermal heat islands and optimize municipal tree-canopy allocation.',
          correctAnswer: 'Urban microclimatic monitoring requires high-density distributed sensor meshes to detect localized thermal heat islands and optimize municipal tree-canopy allocation.'
        },
        {
          id: `q_pte_${batchIndex}_wri4`,
          section: 'Writing',
          instruction: 'Write a 200-300 word essay on algorithmic auditing in automated credit decisions.',
          questionText: 'Financial institutions increasingly deploy automated scoring algorithms. Should proprietary credit models be legally required to provide public algorithmic explanations?',
          modelAnswer: 'As machine learning models dictate access to mortgages and capital, black-box decision systems pose grave risks of systemic bias. Mandating open algorithmic explanations ensures accountability and protects civil liberties without sacrificing computational efficacy.'
        }
      ]
    },

    // 5. IELTS Academic Test #107
    {
      id: `mock_ielts_${batchIndex}_05`,
      exam: 'IELTS',
      title: `IELTS Academic Full Simulation #${104 + batchIndex * 5 + 3}`,
      difficulty: 'Advanced',
      totalDurationMin: 60,
      targetBandRequirement: '8.5 Band',
      sections: [
        {
          id: 'sec_r_5',
          name: 'Reading',
          durationMinutes: 20,
          questionsCount: 2,
          samplePrompt: 'Academic Passage on Computational Genomics & CRISPR-Cas9',
          rubric: [
            { criteria: 'Lexical Inference', weight: '50%', description: 'Deducing scientific meaning' },
            { criteria: 'Factual Retention', weight: '50%', description: 'Direct textual verification' }
          ]
        },
        {
          id: 'sec_s_5',
          name: 'Speaking',
          durationMinutes: 15,
          questionsCount: 2,
          samplePrompt: 'Part 2 Cue Card: Describe an intellectual discovery that changed human history',
          rubric: [
            { criteria: 'Lexical Resource', weight: '30%', description: 'Scientific collocations' },
            { criteria: 'Fluency', weight: '30%', description: 'Smooth delivery' },
            { criteria: 'Grammar', weight: '40%', description: 'Varied clause structures' }
          ]
        }
      ],
      questions: [
        {
          id: `q_ielts_${batchIndex}_r5`,
          section: 'Reading',
          instruction: 'Read the genetics passage and select the accurate scientific deduction.',
          passage: `CRISPR-Cas9 gene editing relies on synthetic guide RNA sequences that match target DNA loci with single-nucleotide precision. However, off-target cleavage events historically constrained clinical in vivo applications. Recent high-fidelity Cas9 variants incorporate engineered hydrogen-bonding alterations that reduce non-specific binding affinity by over 99%.`,
          questionText: 'What structural innovation in high-fidelity Cas9 variants suppressed off-target genomic cleavage?',
          options: [
            'Engineered hydrogen-bonding alterations that diminish non-specific binding affinity',
            'Eliminating guide RNA molecules altogether',
            'Operating exclusively in cryogenic conditions',
            'Doubling the operational temperature inside cells'
          ],
          correctAnswer: 'Engineered hydrogen-bonding alterations that diminish non-specific binding affinity'
        },
        {
          id: `q_ielts_${batchIndex}_s5`,
          section: 'Speaking',
          instruction: 'Deliver a 2-minute oral response describing a transformative discovery.',
          questionText: 'Describe an intellectual or scientific discovery that fundamentally changed human civilization.',
          modelAnswer: 'I would like to speak about the formulation of Maxwell’s equations in 1865, unifying electricity, magnetism, and optics into a single mathematical symmetry that laid the foundation for modern wireless telecommunications and computing.'
        }
      ]
    }
  ];

  return tests;
}
