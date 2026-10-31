import { MockTest, ScheduledJob, VocabularyWord, AuditLog } from '../types';

export const initialScheduledJobs: ScheduledJob[] = [
  {
    id: 'job_exam_midnight_00',
    name: 'Nightly 00:00 Multi-Exam Test Generator',
    description: 'Scheduled cron at 00:00 night hours to automatically generate at least 5 authentic practice tests across PTE, TOEFL, OET, DET, and Cambridge English patterns daily.',
    cronExpression: '0 0 * * *',
    targetTime: '00:00 UTC (Nightly)',
    category: 'EXAM_PREP',
    enabled: true,
    lastRunTimestamp: 'Last run: 2026-10-30 00:00:02',
    nextRunTimestamp: 'Tonight at 00:00 UTC',
    itemsGeneratedCount: 30,
    status: 'idle',
    batchTarget: 'At least 5 Mock Tests (PTE, TOEFL, OET, DET & Cambridge English daily)'
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

// Generates at least 5 complete daily sample tests covering PTE, TOEFL, OET, DET, Cambridge English & IELTS patterns
export function generateFivePracticeTestsBatch(batchIndex: number): MockTest[] {
  const tests: MockTest[] = [
    // 1. PTE Academic Daily Practice Test
    {
      id: `mock_pte_batch_${batchIndex}_01`,
      exam: 'PTE',
      title: `PTE Academic Daily Simulation #${25 + batchIndex * 5 + 1}`,
      difficulty: 'Advanced',
      totalDurationMin: 50,
      targetBandRequirement: '79+ (IELTS 8.0 Equivalent)',
      sections: [
        {
          id: `sec_pte_spk_${batchIndex}`,
          name: 'Speaking',
          durationMinutes: 15,
          questionsCount: 2,
          samplePrompt: 'Read Aloud & Re-tell Academic Lecture',
          rubric: [
            { criteria: 'Oral Fluency', weight: '40%', description: 'Smooth rhythm, natural phrasing, no false restarts' },
            { criteria: 'Pronunciation', weight: '40%', description: 'Intelligibility, vowel purity, syllable stress' },
            { criteria: 'Content', weight: '20%', description: 'All key terms accurately captured' }
          ]
        },
        {
          id: `sec_pte_lis_${batchIndex}`,
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
          id: `q_pte_${batchIndex}_spk1`,
          section: 'Speaking',
          instruction: 'Read Aloud: Speak clearly into your microphone within 35 seconds.',
          questionText: 'Distributed cryptographic ledgers facilitate verifiable consensus across trustless nodes without necessitating centralized intermediary verification.',
          correctAnswer: 'Distributed cryptographic ledgers facilitate verifiable consensus across trustless nodes without necessitating centralized intermediary verification.'
        },
        {
          id: `q_pte_${batchIndex}_lis1`,
          section: 'Listening',
          instruction: 'Write from Dictation: Type the exact lecture sentence as dictated.',
          audioTranscript: 'Multivariate statistical regressions demonstrated a significant correlation between sleep hygiene and cognitive throughput.',
          questionText: 'Listen to the audio clip and type the exact sentence:',
          correctAnswer: 'Multivariate statistical regressions demonstrated a significant correlation between sleep hygiene and cognitive throughput.'
        }
      ]
    },

    // 2. TOEFL iBT Daily Practice Test
    {
      id: `mock_toefl_batch_${batchIndex}_02`,
      exam: 'TOEFL',
      title: `TOEFL iBT Academic Simulation #${90 + batchIndex * 5 + 1}`,
      difficulty: 'Standard',
      totalDurationMin: 116,
      targetBandRequirement: '105+ / 120 (Top University Standard)',
      sections: [
        {
          id: `sec_toefl_r_${batchIndex}`,
          name: 'Reading',
          durationMinutes: 35,
          questionsCount: 2,
          samplePrompt: 'Paleoclimatology & Oceanic Carbon Sequestration',
          rubric: [
            { criteria: 'Factual Accuracy', weight: '50%', description: 'Direct text identification' },
            { criteria: 'Inference', weight: '50%', description: 'Deducing implied consequences' }
          ]
        },
        {
          id: `sec_toefl_w_${batchIndex}`,
          name: 'Writing',
          durationMinutes: 30,
          questionsCount: 1,
          samplePrompt: 'Academic Discussion: Autonomous Infrastructure Deployment',
          rubric: [
            { criteria: 'Argumentation', weight: '50%', description: 'Clarity of thesis and evidence' },
            { criteria: 'Lexical Range', weight: '50%', description: 'Advanced academic vocabulary' }
          ]
        }
      ],
      questions: [
        {
          id: `q_toefl_${batchIndex}_r1`,
          section: 'Reading',
          instruction: 'Read the scientific excerpt and answer the inference question.',
          passage: 'Coccolithophore blooms in the sub-polar North Atlantic fix gigatons of inorganic carbon into calcium carbonate shells. Upon organismal senescence, these calcite plates descend into the benthic abyss, effectively sequestering carbon from atmospheric exchange for geological epochs.',
          questionText: 'What primary role do coccolithophore blooms play in global carbon cycles?',
          options: [
            'They transport and sequester inorganic carbon into the deep ocean sediment',
            'They release enormous amounts of carbon dioxide into the upper atmosphere',
            'They prevent sunlight from penetrating any part of the upper ocean',
            'They completely deoxygenate polar marine ecosystems'
          ],
          correctAnswer: 'They transport and sequester inorganic carbon into the deep ocean sediment'
        },
        {
          id: `q_toefl_${batchIndex}_w1`,
          section: 'Writing',
          instruction: 'Respond to the professor’s question in the academic forum (minimum 100 words).',
          questionText: 'Professor Vance: Should municipal authorities mandate that all public transport fleets transition to hydrogen fuel cells rather than battery electric vehicles? Defend your position with technical or economic reasoning.',
          modelAnswer: 'While hydrogen fuel cells provide rapid refueling and high energy density suitable for heavy transit, I maintain that battery electric buses currently represent the vastly superior municipal investment. Battery electric systems boast round-trip energetic efficiencies surpassing seventy-five percent, whereas the electricity-to-hydrogen-to-electricity pathway suffers thermodynamic line losses exceeding fifty percent. Furthermore, municipal electric grids already possess distributed charging capability, whereas specialized cryogenic hydrogen distribution infrastructure demands exorbitant capital expenditures that drain limited civic budgets.'
        }
      ]
    },

    // 3. OET Healthcare Clinical Practice Test
    {
      id: `mock_oet_batch_${batchIndex}_03`,
      exam: 'OET',
      title: `OET Healthcare Clinical Practice Test #${42 + batchIndex * 5 + 1}`,
      difficulty: 'Advanced',
      totalDurationMin: 120,
      targetBandRequirement: 'Grade B+ (380+ / 500 for Medical/Nursing Licensure)',
      sections: [
        {
          id: `sec_oet_r_${batchIndex}`,
          name: 'Reading',
          durationMinutes: 45,
          questionsCount: 2,
          samplePrompt: 'Sepsis Six Pathway & Antibiotic Stewardship',
          rubric: [
            { criteria: 'Rapid Fact Finding', weight: '50%', description: 'Timely extraction of diagnostic and intervention criteria' },
            { criteria: 'Clinical Guidelines', weight: '50%', description: 'Protocol adherence under emergent scenarios' }
          ]
        },
        {
          id: `sec_oet_w_${batchIndex}`,
          name: 'Writing',
          durationMinutes: 45,
          questionsCount: 1,
          samplePrompt: 'Formal Clinical Referral Letter for Geriatric Patient',
          rubric: [
            { criteria: 'Organization & Tone', weight: '30%', description: 'Standard medical referral conventions' },
            { criteria: 'Clinical Data Selection', weight: '40%', description: 'Concise relevant handover facts' },
            { criteria: 'Language Accuracy', weight: '30%', description: 'Precise clinical terms and dosages' }
          ]
        }
      ],
      questions: [
        {
          id: `q_oet_${batchIndex}_r1`,
          section: 'Reading',
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
          id: `q_oet_${batchIndex}_w1`,
          section: 'Writing',
          instruction: 'Write a clinical referral letter (180-200 words) to the Community Physiotherapy Team.',
          questionText: 'Draft a referral letter for Mrs. Eleanor Wright (Age 78), recovering from a right total knee arthroplasty, requiring home mobilization assessment, range-of-motion exercises, and fall risk prevention.',
          modelAnswer: 'Community Physiotherapy Team\nEduBridge Integrated Care\n\nRE: Referral for Mrs. Eleanor Wright (DOB: 12/05/1948)\n\nDear Physiotherapy Colleagues,\n\nI am writing to refer Mrs. Wright, a 78-year-old lady who underwent an elective right total knee arthroplasty on 27 October 2026, for home-based physiotherapy and mobility rehabilitation.\n\nMrs. Wright’s post-operative recovery has been satisfactory. She is currently mobilizing short distances with a gutter frame under supervision. Right knee flexion has reached 75 degrees, with full extension achieved. Pain is well controlled with regular paracetamol and PRN dihydrocodeine.\n\nShe lives in a two-story home with her husband. Given her mild cognitive impairment and historical fear of falling, please evaluate her home environment, advance her mobility aids from frame to walking sticks, and establish an active quad-strengthening routine.\n\nThank you for assisting in Mrs. Wright’s community rehabilitation.\n\nYours sincerely,\nOrthopedic Clinical Specialist\nEduBridge Hospital'
        }
      ]
    },

    // 4. DET Adaptive English Daily Simulation
    {
      id: `mock_det_batch_${batchIndex}_04`,
      exam: 'DET',
      title: `Duolingo English Test Adaptive Simulation #${14 + batchIndex * 5 + 1}`,
      difficulty: 'Standard',
      totalDurationMin: 60,
      targetBandRequirement: '130 – 150 / 160 (High Academic Level)',
      sections: [
        {
          id: `sec_det_r_${batchIndex}`,
          name: 'Reading',
          durationMinutes: 15,
          questionsCount: 2,
          samplePrompt: 'Read and Complete (C-Test) & Lexical Discernment',
          rubric: [
            { criteria: 'Spelling Accuracy', weight: '50%', description: 'Accurate missing letters' },
            { criteria: 'Vocabulary Verification', weight: '50%', description: 'Distinguishing real academic words' }
          ]
        },
        {
          id: `sec_det_w_${batchIndex}`,
          name: 'Writing',
          durationMinutes: 15,
          questionsCount: 1,
          samplePrompt: '5-Minute Interactive Writing: Artificial Intelligence in Creative Arts',
          rubric: [
            { criteria: 'Syntax Variety', weight: '40%', description: 'Complex sentence structures' },
            { criteria: 'Academic Lexis', weight: '30%', description: 'Rich CEFR C1 vocabulary' },
            { criteria: 'Coherence', weight: '30%', description: 'Logical paragraph structure' }
          ]
        }
      ],
      questions: [
        {
          id: `q_det_${batchIndex}_r1`,
          section: 'Reading',
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
          id: `q_det_${batchIndex}_w1`,
          section: 'Writing',
          instruction: 'Write a 5-minute timed response (minimum 80 words) to the prompt.',
          questionText: 'Some artists fear generative image models will devalue human creativity, while others believe AI serves as a powerful collaborative instrument. What is your perspective?',
          modelAnswer: 'Throughout human history, every transformative technological disruption—from the invention of daguerreotype photography to synthesizer sequencers—sparked existential anxiety among traditional artists. However, mechanical tools do not extinguish artistic expression; rather, they expand the boundaries of the creative imagination. Generative models allow solo creators to rapidly storyboard cinematic visions and explore aesthetic permutations that once required multi-million-dollar production studios, thereby democratizing artistic creation.'
        }
      ]
    },

    // 5. Cambridge English (C1/C2) Daily Simulation
    {
      id: `mock_cam_${batchIndex}_05`,
      exam: 'Cambridge English',
      title: `Cambridge C1 Advanced (CAE) Simulation #${302 + batchIndex * 5 + 1}`,
      difficulty: 'Advanced',
      totalDurationMin: 120,
      targetBandRequirement: 'C1 Grade A / 200+ (Cambridge English Scale)',
      sections: [
        {
          id: `sec_cam_r_${batchIndex}`,
          name: 'Reading',
          durationMinutes: 45,
          questionsCount: 2,
          samplePrompt: 'Reading & Use of English: Key Word Transformations & Cloze',
          rubric: [
            { criteria: 'Grammar Transformation', weight: '50%', description: 'Strict 3-6 word rephrasing with given word' },
            { criteria: 'Lexical Register', weight: '50%', description: 'Advanced collocations and phrasal verbs' }
          ]
        },
        {
          id: `sec_cam_w_${batchIndex}`,
          name: 'Writing',
          durationMinutes: 45,
          questionsCount: 1,
          samplePrompt: 'Formal Report for Municipal Environmental Directorate',
          rubric: [
            { criteria: 'Task Achievement', weight: '25%', description: 'Addresses all executive terms of reference' },
            { criteria: 'Register & Tone', weight: '25%', description: 'Authoritative, analytical civil service report style' },
            { criteria: 'Organization', weight: '25%', description: 'Logical sub-headings and cohesive progression' },
            { criteria: 'Lexical Range', weight: '25%', description: 'Rich C1 academic and technical vocabulary' }
          ]
        }
      ],
      questions: [
        {
          id: `q_cam_${batchIndex}_r1`,
          section: 'Reading',
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
          id: `q_cam_${batchIndex}_w1`,
          section: 'Writing',
          instruction: 'Write a formal report of 220–260 words for the city council.',
          questionText: 'Write a report analyzing the feasibility of creating pedestrian-only green corridors in the central business district. Detail economic impacts on local commerce, public transit integration, and projected air quality improvements.',
          modelAnswer: 'REPORT: FEASIBILITY ASSESSMENT FOR DOWNTOWN PEDESTRIANIZATION\n\nIntroduction\nThis report investigates the socio-economic and environmental feasibility of converting three major arterial thoroughfares in the Central Business District (CBD) into pedestrian-only green transit corridors.\n\nImpact on Local Commerce\nMerchant surveys from comparable European urban transformations demonstrate that while street pedestrianization initially provokes resistance from motor trade retailers, footfall across retail and culinary establishments increases by an average of thirty-two percent within twelve months. Calmer streetscapes encourage leisure dwell time, significantly augmenting consumer transactions.\n\nTransit Integration & Air Quality\nBanning private combustion vehicular traffic will necessitate rerouting five municipal bus lines to adjacent ring avenues and expanding automated micro-mobility rental docks at pedestrian perimeter hubs. Telemetric air monitoring models project a forty-five percent diminution in localized particulate matter (PM2.5) and nitrogen dioxide levels within the core.\n\nRecommendations\nIt is strongly advised that the Directorate authorize a phased pilot program along Market Street over a four-month period, accompanied by real-time merchant revenue tracking.\n\nConclusion\nPedestrianization represents a viable, high-yield municipal modernization strategy that enhances both economic dynamism and public respiratory health.'
        }
      ]
    },

    // 6. IELTS Academic Daily Practice Test
    {
      id: `mock_ielts_batch_${batchIndex}_06`,
      exam: 'IELTS',
      title: `IELTS Academic Full Simulation #${108 + batchIndex * 5 + 1}`,
      difficulty: 'Advanced',
      totalDurationMin: 60,
      targetBandRequirement: '8.0 – 8.5 Band',
      sections: [
        {
          id: `sec_ielts_r_${batchIndex}`,
          name: 'Reading',
          durationMinutes: 20,
          questionsCount: 2,
          samplePrompt: 'Academic Passage on Quantum Metrology & Atomic Clocks',
          rubric: [
            { criteria: 'Factual Accuracy', weight: '50%', description: 'Strict textual attribution' },
            { criteria: 'Inference', weight: '50%', description: 'Deductive reasoning from physics text' }
          ]
        },
        {
          id: `sec_ielts_w_${batchIndex}`,
          name: 'Writing',
          durationMinutes: 25,
          questionsCount: 1,
          samplePrompt: 'Task 2: Academic Essay on Global Space Exploration Funding',
          rubric: [
            { criteria: 'Task Achievement', weight: '25%', description: 'Well-supported response to prompt' },
            { criteria: 'Coherence', weight: '25%', description: 'Logical paragraph progression' },
            { criteria: 'Lexical Resource', weight: '25%', description: 'Sophisticated scientific lexis' },
            { criteria: 'Grammar Accuracy', weight: '25%', description: 'Complex sentence structures' }
          ]
        }
      ],
      questions: [
        {
          id: `q_ielts_${batchIndex}_r6`,
          section: 'Reading',
          instruction: 'Read the excerpt and select the correct scientific statement.',
          passage: 'Optical lattice atomic clocks utilize strontium atoms trapped in standing laser waves, measuring the oscillation of light at quadrillion cycles per second. Their unprecedented precision allows geophysicists to detect millimeter changes in Earth’s gravitational geoid via relativistic time dilation.',
          questionText: 'How do optical lattice atomic clocks assist geophysicists?',
          options: [
            'They measure millimeter changes in Earth’s gravitational geoid via relativistic time dilation',
            'They predict earthquakes by measuring underground magnetic storms',
            'They replace GPS satellites completely with laser optics',
            'They record seismic waves using sound echoes'
          ],
          correctAnswer: 'They measure millimeter changes in Earth’s gravitational geoid via relativistic time dilation'
        },
        {
          id: `q_ielts_${batchIndex}_w6`,
          section: 'Writing',
          instruction: 'Write an essay of at least 250 words responding to the prompt.',
          questionText: 'Some individuals argue that international expenditure on deep space exploration is unjustified while pressing environmental and poverty crises persist on Earth. Discuss both views and give your opinion.',
          modelAnswer: 'The allocation of public billions toward deep space exploration often ignites controversy in an era marked by terrestrial ecological fragility and socioeconomic disparity. While skeptics contend that domestic poverty alleviation demands singular fiscal priority, I maintain that space science generates critical technological dividends and environmental telemetry indispensable for Earth’s long-term survival.\n\nCritics legitimately observe that funding spent on extraterrestrial probes could immediately fund clean municipal water, renewable grids, and healthcare in marginalized populations. However, this view overlooks the origin of our environmental monitoring tools: satellite meteorology, climate modeling, and solar panel efficiency all originated directly from aerospace research programs.\n\nIn conclusion, space exploration and earthly sustainability are not mutually exclusive; orbital research equips humanity with the scientific precision necessary to protect our own planet.'
        }
      ]
    }
  ];

  return tests;
}
