import { MockTest } from '../types';

/**
 * Standardized Multi-Exam Mock Tests Repository
 * Every test features at least 10 authentic questions strictly grounded in its declared subject.
 * Covers PTE, TOEFL, OET, Duolingo English Test (DET), Cambridge English (C1/C2/A2/B1), and IELTS patterns.
 */
export const multiExamMockTests: MockTest[] = [
  {
    "id": "mock_pte_02",
    "exam": "PTE",
    "title": "PTE Academic Comprehensive Simulation #23",
    "difficulty": "Advanced",
    "subject": "Distributed Computing & Cryptographic Systems",
    "totalDurationMin": 50,
    "targetBandRequirement": "79+ (Equivalent to IELTS 8.0)",
    "sections": [
      {
        "id": "sec_pte_spk_23",
        "name": "Speaking",
        "durationMinutes": 15,
        "questionsCount": 2,
        "samplePrompt": "Read Aloud & Re-tell Lecture on Distributed Computing",
        "rubric": [
          {
            "criteria": "Oral Fluency",
            "weight": "50%",
            "description": "Smooth rhythm"
          },
          {
            "criteria": "Pronunciation",
            "weight": "50%",
            "description": "Vowel clarity"
          }
        ]
      },
      {
        "id": "sec_pte_wri_23",
        "name": "Writing",
        "durationMinutes": 20,
        "questionsCount": 2,
        "samplePrompt": "Summarize Text & Essay on Cloud Clusters",
        "rubric": [
          {
            "criteria": "Grammar",
            "weight": "50%",
            "description": "Clause coordination"
          },
          {
            "criteria": "Lexicon",
            "weight": "50%",
            "description": "Academic vocabulary"
          }
        ]
      },
      {
        "id": "sec_pte_read_23",
        "name": "Reading",
        "durationMinutes": 15,
        "questionsCount": 3,
        "samplePrompt": "Fill in Blanks & Multiple Choice",
        "rubric": [
          {
            "criteria": "Collocation",
            "weight": "50%",
            "description": "Native pairings"
          },
          {
            "criteria": "Context",
            "weight": "50%",
            "description": "Syntactic context"
          }
        ]
      },
      {
        "id": "sec_pte_lis_23",
        "name": "Listening",
        "durationMinutes": 15,
        "questionsCount": 3,
        "samplePrompt": "Dictation & Summarize Spoken Text",
        "rubric": [
          {
            "criteria": "Spelling",
            "weight": "50%",
            "description": "Orthography"
          },
          {
            "criteria": "Retention",
            "weight": "50%",
            "description": "Accuracy"
          }
        ]
      }
    ],
    "questions": [
      {
        "id": "q_pte_spk_23_1",
        "section": "Speaking",
        "subject": "Distributed Computing & Cryptographic Systems",
        "instruction": "Read Aloud: Speak clearly into your microphone within 35 seconds.",
        "questionText": "Distributed cryptographic ledgers facilitate verifiable consensus across trustless nodes without necessitating centralized intermediary verification.",
        "correctAnswer": "Distributed cryptographic ledgers facilitate verifiable consensus across trustless nodes without necessitating centralized intermediary verification."
      },
      {
        "id": "q_pte_spk_23_2",
        "section": "Speaking",
        "subject": "Distributed Computing & Cryptographic Systems",
        "instruction": "Re-tell Lecture: Summarize CAP theorem trade-offs in 40 seconds.",
        "questionText": "Re-tell the lecture on consistency, availability, and partition tolerance in distributed clusters.",
        "modelAnswer": "The lecture explored the CAP theorem, demonstrating that distributed datastores must balance strong consistency against high availability under network partitions."
      },
      {
        "id": "q_pte_wri_23_1",
        "section": "Writing",
        "subject": "Distributed Computing & Cryptographic Systems",
        "instruction": "Summarize Written Text: Summarize in one single sentence of 5-75 words.",
        "passage": "Asynchronous message queues decouple microservices by buffering transactions during peak ingress spikes. By preventing cascading buffer saturation and enabling independent horizontal autoscaling of worker pods, message streaming architectures provide essential resilience for modern financial infrastructures.",
        "questionText": "Summarize the passage in a single complete sentence:",
        "modelAnswer": "Asynchronous message queues provide crucial resilience for distributed infrastructures by decoupling microservices, absorbing transaction spikes, and preventing cascading failures through independent worker autoscaling."
      },
      {
        "id": "q_pte_wri_23_2",
        "section": "Writing",
        "subject": "Distributed Computing & Cryptographic Systems",
        "instruction": "Write Essay: In 200-300 words, evaluate zero-trust security in distributed systems.",
        "questionText": "Discuss whether zero-trust cryptographic verification creates excessive operational latency compared to perimeter defenses.",
        "modelAnswer": "Zero-trust architecture mandates continuous cryptographic mutual TLS authentication and ephemeral token verification for every service call, preventing lateral movement of adversaries while hardware-accelerated crypto engines minimize latency."
      },
      {
        "id": "q_pte_read_23_1",
        "section": "Reading",
        "subject": "Distributed Computing & Cryptographic Systems",
        "instruction": "Fill in the blanks: Choose the word that best completes the academic sentence.",
        "questionText": "To achieve fault tolerance, database nodes employ Raft consensus to _____ state machine replicas synchronously.",
        "options": [
          "synchronize",
          "disintegrate",
          "complicate",
          "postpone"
        ],
        "correctAnswer": "synchronize"
      },
      {
        "id": "q_pte_read_23_2",
        "section": "Reading",
        "subject": "Distributed Computing & Cryptographic Systems",
        "instruction": "Multiple Choice: What threshold of honest nodes is required for Byzantine fault tolerance?",
        "passage": "Byzantine fault tolerance requires that more than two-thirds of participating validator nodes remain honest and uncompromised, guaranteeing safety even in adversarial networks.",
        "questionText": "What is the minimum honest node threshold required for Byzantine fault tolerance?",
        "options": [
          "More than two-thirds of all validator nodes",
          "Fifty percent plus one node",
          "Ten percent of validator stake",
          "Unanimous 100% consensus"
        ],
        "correctAnswer": "More than two-thirds of all validator nodes"
      },
      {
        "id": "q_pte_read_23_3",
        "section": "Reading",
        "subject": "Distributed Computing & Cryptographic Systems",
        "instruction": "Multiple Choice: What problem do logical vector clocks solve in distributed systems?",
        "passage": "Physical quartz clocks drift due to temperature fluctuations, causing clock skew across servers. Vector clocks establish causal ordering of events without relying on wall-clock time synchronization.",
        "questionText": "What problem do logical vector clocks solve in distributed systems?",
        "options": [
          "Establishing causal event ordering without relying on physical clock synchronization",
          "Preventing hard drive mechanical wear",
          "Speeding up internet fiber optic transmission",
          "Reducing cooling electricity in server racks"
        ],
        "correctAnswer": "Establishing causal event ordering without relying on physical clock synchronization"
      },
      {
        "id": "q_pte_lis_23_1",
        "section": "Listening",
        "subject": "Distributed Computing & Cryptographic Systems",
        "instruction": "Write from Dictation: Type the exact lecture sentence as dictated.",
        "audioTranscript": "Immutable append-only audit ledgers guarantee transaction integrity across distributed database shards.",
        "questionText": "Listen to the audio clip and type the exact sentence:",
        "correctAnswer": "Immutable append-only audit ledgers guarantee transaction integrity across distributed database shards."
      },
      {
        "id": "q_pte_lis_23_2",
        "section": "Listening",
        "subject": "Distributed Computing & Cryptographic Systems",
        "instruction": "Summarize Spoken Text: In 50-70 words, summarize database sharding trade-offs.",
        "audioTranscript": "Horizontal sharding distributes database records across independent server nodes via hash keys. While queries targeting specific keys execute swiftly, cross-shard joins demand heavy scatter-gather network overhead.",
        "questionText": "Summarize the primary trade-off of database sharding:",
        "modelAnswer": "Horizontal database sharding divides data using partition hash keys. While single-shard lookups scale linearly, complex cross-shard joins incur heavy scatter-gather network latency."
      },
      {
        "id": "q_pte_lis_23_3",
        "section": "Listening",
        "subject": "Distributed Computing & Cryptographic Systems",
        "instruction": "Multiple Choice: What causes the communication latency in microservices?",
        "audioTranscript": "Monolithic functions communicate in-memory via CPU registers, whereas microservices serialize data over TCP networks using REST or gRPC protocols.",
        "questionText": "What causes the communication latency in microservices?",
        "options": [
          "Network serialization and TCP remote procedure call transmission",
          "Lack of CPU transistors in modern servers",
          "Absence of operating system memory managers",
          "Inability to store variables in digital RAM"
        ],
        "correctAnswer": "Network serialization and TCP remote procedure call transmission"
      }
    ]
  },
  {
    "id": "mock_toefl_01",
    "exam": "TOEFL",
    "title": "TOEFL iBT Academic Full Simulation #88",
    "difficulty": "Advanced",
    "subject": "Marine Paleoclimatology & Deep Ocean Systems",
    "totalDurationMin": 60,
    "targetBandRequirement": "100+ (High Proficiency)",
    "sections": [
      {
        "id": "sec_toefl_read_88",
        "name": "Reading",
        "durationMinutes": 20,
        "questionsCount": 3,
        "samplePrompt": "Academic Reading: Oceanic Carbon Sequestration",
        "rubric": [
          {
            "criteria": "Passage Comprehension",
            "weight": "60%",
            "description": "Accurate analysis"
          },
          {
            "criteria": "Vocabulary in Context",
            "weight": "40%",
            "description": "Academic terms"
          }
        ]
      },
      {
        "id": "sec_toefl_lis_88",
        "name": "Listening",
        "durationMinutes": 20,
        "questionsCount": 3,
        "samplePrompt": "Academic Lecture: Benthic Thermohaline Circulation",
        "rubric": [
          {
            "criteria": "Lecture Synthesis",
            "weight": "50%",
            "description": "Synthesis"
          },
          {
            "criteria": "Pragmatic Understanding",
            "weight": "50%",
            "description": "Inference"
          }
        ]
      },
      {
        "id": "sec_toefl_spk_88",
        "name": "Speaking",
        "durationMinutes": 10,
        "questionsCount": 2,
        "samplePrompt": "Integrated Academic Speaking: Deep-Sea Sedimentation",
        "rubric": [
          {
            "criteria": "Delivery",
            "weight": "50%",
            "description": "Pronunciation"
          },
          {
            "criteria": "Topic Development",
            "weight": "50%",
            "description": "Coherence"
          }
        ]
      },
      {
        "id": "sec_toefl_wri_88",
        "name": "Writing",
        "durationMinutes": 10,
        "questionsCount": 2,
        "samplePrompt": "Writing for an Academic Discussion: Marine Geoengineering",
        "rubric": [
          {
            "criteria": "Coherence",
            "weight": "50%",
            "description": "Logical flow"
          },
          {
            "criteria": "Syntactic Variety",
            "weight": "50%",
            "description": "Complex clauses"
          }
        ]
      }
    ],
    "questions": [
      {
        "id": "q_toefl_r1",
        "section": "Reading",
        "subject": "Marine Paleoclimatology & Deep Ocean Systems",
        "instruction": "Reading Comprehension: Answer based on the passage.",
        "passage": "Deep benthic sediments preserve microscopic calcite shells of foraminifera. The ratio of oxygen-18 to oxygen-16 in these fossilized shells provides an immutable geological thermometer, allowing paleoclimatologists to reconstruct polar ice volume spanning fifty million years.",
        "questionText": "According to paragraph 1, how do paleoclimatologists determine historical ocean temperatures?",
        "options": [
          "By analyzing oxygen isotope ratios in fossilized foraminifera shells",
          "By calculating dissolved salt concentration in surface sea foam",
          "By inspecting modern shoreline erosion rates",
          "By measuring present-day surface atmospheric moisture"
        ],
        "correctAnswer": "By analyzing oxygen isotope ratios in fossilized foraminifera shells"
      },
      {
        "id": "q_toefl_r2",
        "section": "Reading",
        "subject": "Marine Paleoclimatology & Deep Ocean Systems",
        "instruction": "Vocabulary in Context: What does \"calcareous ooze\" refer to?",
        "passage": "Above the carbonate compensation depth, marine snow precipitates continuously to form thick blankets of calcareous ooze composed predominantly of coccolithophores and planktonic shells.",
        "questionText": "The term \"calcareous ooze\" in the passage refers to:",
        "options": [
          "Calcium carbonate-rich sediment derived from microscopic marine organisms",
          "Synthetic chemical runoff from coastal industrial refineries",
          "Liquid volcanic lava cooling rapidly beneath oceanic trenches",
          "Frozen freshwater glaciers floating along continental shelves"
        ],
        "correctAnswer": "Calcium carbonate-rich sediment derived from microscopic marine organisms"
      },
      {
        "id": "q_toefl_r3",
        "section": "Reading",
        "subject": "Marine Paleoclimatology & Deep Ocean Systems",
        "instruction": "Inference: What happens to calcium carbonate beneath the CCD?",
        "passage": "Below the carbonate compensation depth, high hydrostatic pressure and colder, acidic seawater cause calcium carbonate to dissolve faster than it can deposit, leaving benthic abyssal plains barren of carbonate fossils.",
        "questionText": "What happens to calcium carbonate shells beneath the CCD?",
        "options": [
          "They dissolve rapidly due to elevated hydrostatic pressure and water acidity",
          "They crystallize into metallic diamond sheets",
          "They float back to the surface within hours",
          "They remain indefinitely preserved without any chemical change"
        ],
        "correctAnswer": "They dissolve rapidly due to elevated hydrostatic pressure and water acidity"
      },
      {
        "id": "q_toefl_l1",
        "section": "Listening",
        "subject": "Marine Paleoclimatology & Deep Ocean Systems",
        "instruction": "Listen to an excerpt from a marine biology lecture and answer the question.",
        "audioTranscript": "Professor: Thermohaline circulation operates like a global oceanic conveyor belt. When dense, saline surface water cools in the North Atlantic, it sinks toward the abyss, driving deep circulation currents that modulate planetary heat distribution.",
        "questionText": "What is the primary driving mechanism of the global thermohaline conveyor belt?",
        "options": [
          "The sinking of cold, dense, saline water in subpolar oceans",
          "Surface tidal pull caused by planetary orbital shifts",
          "Continuous seismic shaking from mid-Atlantic volcanic ridges",
          "Direct kinetic energy generated by commercial marine traffic"
        ],
        "correctAnswer": "The sinking of cold, dense, saline water in subpolar oceans"
      },
      {
        "id": "q_toefl_l2",
        "section": "Listening",
        "subject": "Marine Paleoclimatology & Deep Ocean Systems",
        "instruction": "Lecture Comprehension: Why would meltwater runoff endanger oceanic circulation?",
        "audioTranscript": "Professor: If excessive melting of the Greenland ice sheet injects millions of tons of buoyant freshwater into the North Atlantic, it decreases surface density, which could catastrophically stall the Atlantic Meridional Overturning Circulation.",
        "questionText": "Why would massive meltwater runoff endanger oceanic circulation?",
        "options": [
          "Buoyant freshwater lowers surface density, preventing dense water from sinking",
          "Freshwater converts immediately into hazardous methane clouds",
          "It increases ocean salinity to toxic levels for plankton",
          "It freezes the entire North Atlantic ocean within days"
        ],
        "correctAnswer": "Buoyant freshwater lowers surface density, preventing dense water from sinking"
      },
      {
        "id": "q_toefl_l3",
        "section": "Listening",
        "subject": "Marine Paleoclimatology & Deep Ocean Systems",
        "instruction": "Detail Question: What defines the oceanic biological carbon pump?",
        "audioTranscript": "Professor: Phytoplankton fix carbon dioxide in surface photic waters. When these organisms die and sink into the twilight and abyssal zones, they sequester carbon away from the atmosphere for centuries—a process known as the biological carbon pump.",
        "questionText": "What defines the oceanic biological carbon pump?",
        "options": [
          "Photosynthetic plankton fixing carbon and sinking to deep abyssal reservoirs upon death",
          "Mechanical diesel turbines deployed on offshore oil drilling platforms",
          "Underwater volcanic eruptions expelling dissolved mineral gases",
          "Artificial chemical filters installed across coastal estuaries"
        ],
        "correctAnswer": "Photosynthetic plankton fixing carbon and sinking to deep abyssal reservoirs upon death"
      },
      {
        "id": "q_toefl_s1",
        "section": "Speaking",
        "subject": "Marine Paleoclimatology & Deep Ocean Systems",
        "instruction": "Integrated Speaking: Explain sediment core drilling methodology in 60 seconds.",
        "questionText": "Explain the scientific methodology used by oceanographic drill ships to study paleoclimate.",
        "modelAnswer": "Oceanographic research vessels deploy rotary drill strings miles into the seabed to retrieve continuous sediment cores. By studying microfossils, volcanic ash, and isotopic ratios across core layers, scientists construct high-resolution timelines of historic ice ages."
      },
      {
        "id": "q_toefl_s2",
        "section": "Speaking",
        "subject": "Marine Paleoclimatology & Deep Ocean Systems",
        "instruction": "Speaking Task: Discuss oceanic deoxygenation.",
        "questionText": "State how warming ocean temperatures impact deep-sea oxygen solubility and marine fauna.",
        "modelAnswer": "Warmer seawater exhibits reduced oxygen solubility. Combined with intensified thermal stratification that prevents surface re-aeration, expanding oxygen minimum zones threaten benthic marine populations."
      },
      {
        "id": "q_toefl_w1",
        "section": "Writing",
        "subject": "Marine Paleoclimatology & Deep Ocean Systems",
        "instruction": "Integrated Writing: Synthesize iron fertilization benefits and risks.",
        "questionText": "Summarize the proposed geoengineering method of ocean iron fertilization and evaluate its ecological risks.",
        "modelAnswer": "Proponents argue that seeding high-nutrient ocean waters with iron stimulates diatom blooms that sequester atmospheric CO2. However, unconstrained blooms can release neurotoxins and deplete deep oxygen reserves upon decay."
      },
      {
        "id": "q_toefl_w2",
        "section": "Writing",
        "subject": "Marine Paleoclimatology & Deep Ocean Systems",
        "instruction": "Academic Discussion: Express your perspective on deep seabed polymetallic nodule mining.",
        "questionText": "Do you agree that deep seabed mining should be paused until benthic ecosystems are fully mapped?",
        "modelAnswer": "I strongly support a precautionary moratorium on deep-sea mineral extraction. Abyssal benthic ecosystems develop over millions of years under extreme stability; strip-mining destroys unique coral fauna and produces destructive sediment plumes."
      }
    ]
  },
  {
    "id": "mock_toefl_02",
    "exam": "TOEFL",
    "title": "TOEFL iBT Academic Simulation #89: Cognitive Sciences",
    "difficulty": "Standard",
    "subject": "Cognitive Neuroscience & Memory Consolidation",
    "totalDurationMin": 55,
    "targetBandRequirement": "85+ (Medium-High Proficiency)",
    "sections": [
      {
        "id": "sec_toefl_r2",
        "name": "Reading",
        "durationMinutes": 20,
        "questionsCount": 3,
        "samplePrompt": "Neuroplasticity and Synaptic Pruning",
        "rubric": [
          {
            "criteria": "Reading Comprehension",
            "weight": "60%",
            "description": "Comprehension"
          },
          {
            "criteria": "Inference",
            "weight": "40%",
            "description": "Inference"
          }
        ]
      },
      {
        "id": "sec_toefl_lis_89",
        "name": "Listening",
        "durationMinutes": 15,
        "questionsCount": 3,
        "samplePrompt": "Hippocampal Memory Replay Lecture",
        "rubric": [
          {
            "criteria": "Lecture Synthesis",
            "weight": "50%",
            "description": "Synthesis"
          },
          {
            "criteria": "Detail Capture",
            "weight": "50%",
            "description": "Details"
          }
        ]
      },
      {
        "id": "sec_toefl_spk_89",
        "name": "Speaking",
        "durationMinutes": 10,
        "questionsCount": 2,
        "samplePrompt": "Spaced Retrieval Practice Presentation",
        "rubric": [
          {
            "criteria": "Fluency",
            "weight": "50%",
            "description": "Delivery"
          },
          {
            "criteria": "Coherence",
            "weight": "50%",
            "description": "Structure"
          }
        ]
      },
      {
        "id": "sec_toefl_w2",
        "name": "Writing",
        "durationMinutes": 10,
        "questionsCount": 2,
        "samplePrompt": "Academic Discussion: Cognitive Enhancement",
        "rubric": [
          {
            "criteria": "Clarity",
            "weight": "50%",
            "description": "Expression"
          },
          {
            "criteria": "Grammar",
            "weight": "50%",
            "description": "Accuracy"
          }
        ]
      }
    ],
    "questions": [
      {
        "id": "q_toefl_r2_1",
        "section": "Reading",
        "subject": "Cognitive Neuroscience & Memory Consolidation",
        "instruction": "Reading Comprehension: Select the best answer.",
        "passage": "Long-term potentiation (LTP) is the persistent strengthening of synapses based on recent patterns of activity. When high-frequency stimulation activates postsynaptic NMDA receptors, an influx of calcium ions triggers the insertion of additional AMPA receptors into the dendritic spine membrane, lowering the threshold for subsequent synaptic transmission.",
        "questionText": "What biochemical event directly initiates the insertion of AMPA receptors during LTP?",
        "options": [
          "Calcium ion influx triggered by activated NMDA receptors",
          "Complete depletion of glucose in surrounding glial cells",
          "Deactivation of all presynaptic action potentials",
          "Mechanical compression of the cranial bone structure"
        ],
        "correctAnswer": "Calcium ion influx triggered by activated NMDA receptors"
      },
      {
        "id": "q_toefl_r2_2",
        "section": "Reading",
        "subject": "Cognitive Neuroscience & Memory Consolidation",
        "instruction": "Vocabulary in Context: What is meant by synaptic pruning?",
        "passage": "During adolescence, microglial cells facilitate synaptic pruning by engulfing and eliminating underutilized dendritic connections, streamlining neural circuits for maximum metabolic efficiency.",
        "questionText": "The term \"synaptic pruning\" refers to:",
        "options": [
          "The elimination of inactive neural connections to optimize brain efficiency",
          "The surgical removal of the temporal lobe",
          "The chemical crystallization of neurons into bone tissue",
          "The continuous division of red blood cells in the cortex"
        ],
        "correctAnswer": "The elimination of inactive neural connections to optimize brain efficiency"
      },
      {
        "id": "q_toefl_r2_3",
        "section": "Reading",
        "subject": "Cognitive Neuroscience & Memory Consolidation",
        "instruction": "Inference: Why is spaced retrieval superior to massed cramming?",
        "passage": "Massed practice produces transient working memory activation without inducing the protein synthesis required for structural dendritic remodeling. Conversely, spaced retrieval forces synaptic reconsolidation across multiple sleep cycles, embedding memory traces in neocortical networks.",
        "questionText": "Why does spaced retrieval lead to superior long-term retention?",
        "options": [
          "It stimulates protein synthesis and synaptic reconsolidation across sleep cycles",
          "It completely shuts down all electrical activity in the cerebral cortex",
          "It bypasses the hippocampus and stores data in muscle tissue",
          "It requires zero conscious cognitive effort from the learner"
        ],
        "correctAnswer": "It stimulates protein synthesis and synaptic reconsolidation across sleep cycles"
      },
      {
        "id": "q_toefl_l89_1",
        "section": "Listening",
        "subject": "Cognitive Neuroscience & Memory Consolidation",
        "instruction": "Listen to a psychology lecture and answer the question.",
        "audioTranscript": "Professor: During slow-wave sleep, hippocampal place cells fire in reverse chronological sequence, replaying spatial pathways traversed during the day. This coordinated dialogue transfers episodic memories from the transient hippocampus to the permanent neocortex.",
        "questionText": "What is the role of hippocampal sharp-wave ripples during slow-wave sleep?",
        "options": [
          "Replaying daily neural patterns to transfer memories to the neocortex",
          "Eliminating all long-term memories to prevent mental fatigue",
          "Lowering human body temperature to freezing levels",
          "Producing adrenaline to maintain waking alertness"
        ],
        "correctAnswer": "Replaying daily neural patterns to transfer memories to the neocortex"
      },
      {
        "id": "q_toefl_l89_2",
        "section": "Listening",
        "subject": "Cognitive Neuroscience & Memory Consolidation",
        "instruction": "Detail Question: What occurs when NMDA receptor antagonists are administered?",
        "audioTranscript": "Professor: In experimental animal models, administering APV—an NMDA receptor antagonist—prevents spatial learning in Morris water mazes, demonstrating that blocking glutamate receptor activation directly impedes memory encoding.",
        "questionText": "What did researchers observe when NMDA receptors were pharmacologically blocked?",
        "options": [
          "Animals were unable to form new spatial memory maps",
          "Animals exhibited instantaneous telepathic communication",
          "Animals doubled their physical swimming velocity",
          "Animals permanently stopped requiring sleep"
        ],
        "correctAnswer": "Animals were unable to form new spatial memory maps"
      },
      {
        "id": "q_toefl_l89_3",
        "section": "Listening",
        "subject": "Cognitive Neuroscience & Memory Consolidation",
        "instruction": "Synthesis: What does working memory capacity depend on?",
        "audioTranscript": "Professor: Working memory is heavily mediated by the dorsolateral prefrontal cortex, which maintains goal-relevant sensory representations while resisting distracting stimuli.",
        "questionText": "Which cortical region primarily sustains working memory representations?",
        "options": [
          "The dorsolateral prefrontal cortex",
          "The primary visual occipital pole",
          "The cerebellar peduncle",
          "The brainstem medulla oblongata"
        ],
        "correctAnswer": "The dorsolateral prefrontal cortex"
      },
      {
        "id": "q_toefl_s89_1",
        "section": "Speaking",
        "subject": "Cognitive Neuroscience & Memory Consolidation",
        "instruction": "Speaking Task: In 60 seconds, explain adult neurogenesis in the subgranular zone.",
        "questionText": "Summarize how environmental enrichment promotes neurogenesis in the adult mammalian brain.",
        "modelAnswer": "Neurogenesis persists in the adult dentate gyrus of the hippocampus. Aerobic exercise and cognitively enriched environments stimulate brain-derived neurotrophic factor (BDNF), promoting the survival and functional integration of newborn granule neurons into existing memory circuits."
      },
      {
        "id": "q_toefl_s89_2",
        "section": "Speaking",
        "subject": "Cognitive Neuroscience & Memory Consolidation",
        "instruction": "Speaking Task: Describe the testing effect in educational psychology.",
        "questionText": "Explain why active recall produces greater retention than passive re-reading.",
        "modelAnswer": "The testing effect demonstrates that actively retrieving knowledge from memory alters the neural trace, reinforcing retrieval pathways and making future recall significantly more resistant to decay than passive exposure."
      },
      {
        "id": "q_toefl_w2_1",
        "section": "Writing",
        "subject": "Cognitive Neuroscience & Memory Consolidation",
        "instruction": "Academic Writing: Discuss neuroplasticity across the human lifespan.",
        "questionText": "Write a response analyzing whether cognitive reserve developed early in life protects against neurodegenerative decline.",
        "modelAnswer": "Higher cognitive reserve—built through multilingualism, complex problem-solving, and education—enables individuals to withstand significant neuropathological damage before exhibiting clinical cognitive deficits, as alternative neural networks compensate for degraded pathways."
      },
      {
        "id": "q_toefl_w2_2",
        "section": "Writing",
        "subject": "Cognitive Neuroscience & Memory Consolidation",
        "instruction": "Academic Discussion: Evaluate the cognitive trade-offs of digital multitasking.",
        "questionText": "Does media multitasking impair deep cognitive processing and executive attentional control?",
        "modelAnswer": "Chronic media multitasking trains the attentional system to favor shallow task-switching over sustained focus. Neuroscience indicates that frequent context-switching incurs cognitive switching costs, fragmenting working memory and impairing deep declarative learning."
      }
    ]
  },
  {
    "id": "mock_oet_01",
    "exam": "OET",
    "title": "OET Clinical Medicine & Nursing Practice Test #40",
    "difficulty": "Advanced",
    "subject": "Clinical Endocrinology & Type 2 Diabetes Management",
    "totalDurationMin": 55,
    "targetBandRequirement": "Grade B (350+ Points)",
    "sections": [
      {
        "id": "sec_oet_read_40",
        "name": "Reading",
        "durationMinutes": 15,
        "questionsCount": 3,
        "samplePrompt": "Clinical Guidelines: Glycemic Thresholds & SGLT2 Inhibitors",
        "rubric": [
          {
            "criteria": "Clinical Data Extraction",
            "weight": "50%",
            "description": "Data extraction"
          },
          {
            "criteria": "Guideline Interpretation",
            "weight": "50%",
            "description": "Guidelines"
          }
        ]
      },
      {
        "id": "sec_oet_lis_40",
        "name": "Listening",
        "durationMinutes": 15,
        "questionsCount": 3,
        "samplePrompt": "Consultation: HbA1c 8.4% Patient Consultation",
        "rubric": [
          {
            "criteria": "Aural Diagnosis",
            "weight": "50%",
            "description": "Diagnosis"
          },
          {
            "criteria": "Clinical Plan Tracking",
            "weight": "50%",
            "description": "Care plan"
          }
        ]
      },
      {
        "id": "sec_oet_wri_40",
        "name": "Writing",
        "durationMinutes": 15,
        "questionsCount": 2,
        "samplePrompt": "Discharge Referral Letter to Endocrinologist",
        "rubric": [
          {
            "criteria": "Purpose & Organization",
            "weight": "50%",
            "description": "Purpose"
          },
          {
            "criteria": "Clinical Accuracy",
            "weight": "50%",
            "description": "Accuracy"
          }
        ]
      },
      {
        "id": "sec_oet_spk_40",
        "name": "Speaking",
        "durationMinutes": 10,
        "questionsCount": 2,
        "samplePrompt": "Patient Roleplay: Reassuring Anxious Newly Diagnosed Patient",
        "rubric": [
          {
            "criteria": "Clinical Empathy",
            "weight": "50%",
            "description": "Empathy"
          },
          {
            "criteria": "Information Provision",
            "weight": "50%",
            "description": "Clarity"
          }
        ]
      }
    ],
    "questions": [
      {
        "id": "q_oet_r1",
        "section": "Reading",
        "subject": "Clinical Endocrinology & Type 2 Diabetes Management",
        "instruction": "Clinical Guidelines: Identify the recommended first-line therapy for adult Type 2 Diabetes.",
        "passage": "According to NICE and ADA guidelines, Metformin remains the foundational pharmacological agent for type 2 diabetes in patients without severe renal impairment (eGFR > 30 mL/min/1.73m2). In patients with established atherosclerotic cardiovascular disease or chronic kidney disease, an SGLT2 inhibitor or GLP-1 receptor agonist with proven cardiovascular benefit should be co-prescribed regardless of baseline HbA1c.",
        "questionText": "When should an SGLT2 inhibitor be initiated alongside Metformin?",
        "options": [
          "In patients with established cardiovascular disease or chronic kidney disease",
          "Only when fasting glucose levels drop below 4.0 mmol/L",
          "Exclusively after five consecutive years of insulin dependence",
          "Only during acute episodes of bacterial pharyngitis"
        ],
        "correctAnswer": "In patients with established cardiovascular disease or chronic kidney disease"
      },
      {
        "id": "q_oet_r2",
        "section": "Reading",
        "subject": "Clinical Endocrinology & Type 2 Diabetes Management",
        "instruction": "Clinical Interpretation: What is the primary diagnostic threshold for Type 2 Diabetes via HbA1c?",
        "passage": "A diagnostic HbA1c threshold of 48 mmol/mol (6.5%) or higher on two separate occasions confirms the diagnosis of diabetes mellitus in asymptomatic adult individuals.",
        "questionText": "What is the standard diagnostic HbA1c threshold for diabetes confirmation?",
        "options": [
          "48 mmol/mol (6.5%) or higher on two occasions",
          "20 mmol/mol (4.0%) or higher",
          "Strictly above 100 mmol/mol",
          "Any reading between 30 and 35 mmol/mol"
        ],
        "correctAnswer": "48 mmol/mol (6.5%) or higher on two occasions"
      },
      {
        "id": "q_oet_r3",
        "section": "Reading",
        "subject": "Clinical Endocrinology & Type 2 Diabetes Management",
        "instruction": "Drug Safety: What critical adverse risk is associated with SGLT2 inhibitors?",
        "passage": "Clinicians must counsel patients starting SGLT2 inhibitors regarding the risk of euglycemic diabetic ketoacidosis (euDKA), particularly during acute illness, prolonged fasting, or surgical procedures, advising immediate cessation during acute hospital admissions.",
        "questionText": "Which acute condition requires vigilance when prescribing SGLT2 inhibitors?",
        "options": [
          "Euglycemic diabetic ketoacidosis during acute illness or surgery",
          "Permanent loss of hearing within 24 hours",
          "Acute viral conjunctivitis in both eyes",
          "Sudden hypercalcemia secondary to bone fractures"
        ],
        "correctAnswer": "Euglycemic diabetic ketoacidosis during acute illness or surgery"
      },
      {
        "id": "q_oet_l1",
        "section": "Listening",
        "subject": "Clinical Endocrinology & Type 2 Diabetes Management",
        "instruction": "Doctor-Patient Consultation: What is the patients primary presenting fear?",
        "audioTranscript": "Doctor: Mrs. Jenkins, your HbA1c came back at 8.4%. Patient: Doctor, I watched my mother suffer through insulin injections and kidney failure. Im terrified that this means my life is over and I will lose my eyesight.",
        "questionText": "What is the patients chief psychological concern during the consultation?",
        "options": [
          "Fear of blindness and kidney failure based on her mothers experience",
          "Reluctance to pay for routine blood glucose test strips",
          "Desire to immediately undergo elective bariatric surgery",
          "Concern about traveling abroad on commercial flights"
        ],
        "correctAnswer": "Fear of blindness and kidney failure based on her mothers experience"
      },
      {
        "id": "q_oet_l2",
        "section": "Listening",
        "subject": "Clinical Endocrinology & Type 2 Diabetes Management",
        "instruction": "Treatment Plan: What initial medication dosage does the physician recommend?",
        "audioTranscript": "Doctor: We will start you on Metformin at 500 milligrams once daily with your evening meal to minimize stomach upset, gradually titrating to twice daily over the next month.",
        "questionText": "What is the initial dosing regimen prescribed by the doctor?",
        "options": [
          "Metformin 500mg daily taken with food, titrating gradually",
          "Insulin glargine 100 units injected thrice daily",
          "Prednisone 50mg taken on an empty stomach",
          "Aspirin 300mg dissolved in cold water every four hours"
        ],
        "correctAnswer": "Metformin 500mg daily taken with food, titrating gradually"
      },
      {
        "id": "q_oet_l3",
        "section": "Listening",
        "subject": "Clinical Endocrinology & Type 2 Diabetes Management",
        "instruction": "Preventive Care: What routine annual screening does the doctor emphasize?",
        "audioTranscript": "Doctor: Alongside glycemic control, we need to schedule an annual digital retinal photography exam and a urinary albumin-to-creatinine ratio to protect your eyes and kidneys.",
        "questionText": "What two annual screenings are ordered to detect early microvascular disease?",
        "options": [
          "Retinal screening and urinary albumin-to-creatinine ratio",
          "Brain MRI scan and lumbar puncture",
          "Full body bone density DEXA scan and skin biopsy",
          "Continuous 72-hour Holter monitoring and colonoscopy"
        ],
        "correctAnswer": "Retinal screening and urinary albumin-to-creatinine ratio"
      },
      {
        "id": "q_oet_s1",
        "section": "Speaking",
        "subject": "Clinical Endocrinology & Type 2 Diabetes Management",
        "instruction": "Clinical Consultation: Deliver reassurance to an anxious patient diagnosed with diabetes.",
        "questionText": "Address patient fears regarding progressive microvascular complications with clear pedagogical reassurance.",
        "modelAnswer": "Mrs. Jenkins, I completely understand your apprehension, but diabetes management today is remarkably advanced. By initiating Metformin early and adopting sustainable dietary habits, we actively protect your eyesight, heart, and kidney function."
      },
      {
        "id": "q_oet_s2",
        "section": "Speaking",
        "subject": "Clinical Endocrinology & Type 2 Diabetes Management",
        "instruction": "Speaking Task: Counsel a patient regarding hypoglycemic awareness.",
        "questionText": "Explain the signs of hypoglycemia and the \"Rule of 15\" treatment protocol.",
        "modelAnswer": "If you feel shaky, sweaty, or lightheaded, check your blood glucose. If it is below 4.0 mmol/L, consume 15 grams of fast-acting carbohydrate like fruit juice, rest for 15 minutes, and re-test."
      },
      {
        "id": "q_oet_w1",
        "section": "Writing",
        "subject": "Clinical Endocrinology & Type 2 Diabetes Management",
        "instruction": "Referral Letter: Draft an urgent referral letter to an endocrine nurse specialist.",
        "questionText": "Write a referral letter requesting structured diabetes self-management education and CGM sensor training.",
        "modelAnswer": "Dear Colleague, I am referring Mrs. Jenkins, a 54-year-old newly diagnosed with Type 2 Diabetes (HbA1c 8.4%). She exhibits substantial anxiety regarding injection therapies. I would appreciate your assistance in providing dietary counseling, glucometer training, and lifestyle education."
      },
      {
        "id": "q_oet_w2",
        "section": "Writing",
        "subject": "Clinical Endocrinology & Type 2 Diabetes Management",
        "instruction": "Writing Task: Document a multidisciplinary diabetic foot ulcer prevention protocol.",
        "questionText": "Outline clinical recommendations for peripheral sensory neuropathy screening and podiatry referral.",
        "modelAnswer": "Annual diabetic foot assessment with a 10g monofilament detects early peripheral neuropathy. Patients with absent sensation or foot deformities must be referred promptly to specialized podiatric care and fitted with therapeutic offloading footwear to prevent neuropathic ulceration."
      }
    ]
  },
  {
    "id": "mock_oet_02",
    "exam": "OET",
    "title": "OET Nursing Practice Simulation #41: Oncology Care",
    "difficulty": "Standard",
    "subject": "Clinical Oncology & Palliative Chemotherapy Protocols",
    "totalDurationMin": 50,
    "targetBandRequirement": "Grade B (350+ Points)",
    "sections": [
      {
        "id": "sec_oet_read_41",
        "name": "Reading",
        "durationMinutes": 15,
        "questionsCount": 3,
        "samplePrompt": "Chemotherapy Extravasation & Febrile Neutropenia",
        "rubric": [
          {
            "criteria": "Clinical Data Extraction",
            "weight": "50%",
            "description": "Data extraction"
          },
          {
            "criteria": "Safety Protocols",
            "weight": "50%",
            "description": "Safety"
          }
        ]
      },
      {
        "id": "sec_oet_lis_41",
        "name": "Listening",
        "durationMinutes": 15,
        "questionsCount": 3,
        "samplePrompt": "Handover: Post-Chemotherapy Pancytopenic Patient",
        "rubric": [
          {
            "criteria": "Aural Diagnosis",
            "weight": "50%",
            "description": "Diagnosis"
          },
          {
            "criteria": "Care Plan Tracking",
            "weight": "50%",
            "description": "Care plan"
          }
        ]
      },
      {
        "id": "sec_oet_spk_41",
        "name": "Speaking",
        "durationMinutes": 10,
        "questionsCount": 2,
        "samplePrompt": "Nursing Communication: Patient Experiencing Anticipatory Nausea",
        "rubric": [
          {
            "criteria": "Empathy",
            "weight": "50%",
            "description": "Empathy"
          },
          {
            "criteria": "Clarity",
            "weight": "50%",
            "description": "Clarity"
          }
        ]
      },
      {
        "id": "sec_oet_wri_41",
        "name": "Writing",
        "durationMinutes": 10,
        "questionsCount": 2,
        "samplePrompt": "Oncology Care Plan & Transfer Documentation",
        "rubric": [
          {
            "criteria": "Clinical Structure",
            "weight": "50%",
            "description": "Structure"
          },
          {
            "criteria": "Vocabulary",
            "weight": "50%",
            "description": "Terminology"
          }
        ]
      }
    ],
    "questions": [
      {
        "id": "q_oet_r41_1",
        "section": "Reading",
        "subject": "Clinical Oncology & Palliative Chemotherapy Protocols",
        "instruction": "Oncology Clinical Guidelines: Identify the immediate intervention for vesicant extravasation.",
        "passage": "In the event of suspected vesicant extravasation (e.g., doxorubicin), the infusion must be halted immediately. The nurse should aspirate residual drug through the catheter, leave the needle in place for antidote administration if indicated, apply cold compresses, and avoid applying direct manual pressure to the swollen site.",
        "questionText": "What is the first action a nurse must take upon identifying chemotherapy extravasation?",
        "options": [
          "Immediately stop the infusion and aspirate residual drug from the catheter",
          "Flush the cannula with 50mL of normal saline at high pressure",
          "Massage the arm vigorously to disperse the chemical into muscle",
          "Encourage the patient to flex their fingers and wait two hours"
        ],
        "correctAnswer": "Immediately stop the infusion and aspirate residual drug from the catheter"
      },
      {
        "id": "q_oet_r41_2",
        "section": "Reading",
        "subject": "Clinical Oncology & Palliative Chemotherapy Protocols",
        "instruction": "Clinical Emergency: Define the clinical threshold for febrile neutropenia.",
        "passage": "Febrile neutropenia is defined as an oral temperature of 38.3°C or higher (or 38.0°C sustained for over one hour) in a patient with an absolute neutrophil count (ANC) below 0.5 x 10^9/L. It is an oncological emergency requiring broad-spectrum intravenous antibiotics within sixty minutes of presentation.",
        "questionText": "What is the time window for administering IV antibiotics in febrile neutropenia?",
        "options": [
          "Within 60 minutes of arrival (the Golden Hour)",
          "Within 24 to 48 hours after cultures yield bacterial colonies",
          "Only after fever persists continuously for three consecutive days",
          "Antibiotics are strictly contraindicated in neutropenic patients"
        ],
        "correctAnswer": "Within 60 minutes of arrival (the Golden Hour)"
      },
      {
        "id": "q_oet_r41_3",
        "section": "Reading",
        "subject": "Clinical Oncology & Palliative Chemotherapy Protocols",
        "instruction": "Patient Safety: What precautions apply to severe thrombocytopenia (platelets < 20,000/uL)?",
        "passage": "Patients with profound thrombocytopenia must avoid intramuscular injections, rectal thermometers, and rigorous toothbrushing to minimize the risk of spontaneous mucocutaneous and intracranial hemorrhages.",
        "questionText": "Which clinical practice is strictly prohibited in severe thrombocytopenia?",
        "options": [
          "Administering intramuscular injections and rectal suppositories",
          "Elevating the patients head of bed by thirty degrees",
          "Offering warm oral fluids like clear chicken broth",
          "Placing a pulse oximeter probe on the index finger"
        ],
        "correctAnswer": "Administering intramuscular injections and rectal suppositories"
      },
      {
        "id": "q_oet_l41_1",
        "section": "Listening",
        "subject": "Clinical Oncology & Palliative Chemotherapy Protocols",
        "instruction": "Nursing Handover: Listen to the clinical report on a chemotherapy patient.",
        "audioTranscript": "Charge Nurse: Mr. Thomas received cycle 2 of cisplatin yesterday. Overnight he developed persistent grade 3 nausea and produced 400 mL of dark concentrated urine over twelve hours. His serum creatinine has risen from 80 to 145 umol/L.",
        "questionText": "What acute complication is indicated by Mr. Thomas laboratory values and urine output?",
        "options": [
          "Cisplatin-induced nephrotoxicity with acute kidney injury",
          "Severe bacterial meningitis with cervical rigidity",
          "Benign postural orthostatic tachycardia syndrome",
          "Superficial skin dermatitis from contact allergies"
        ],
        "correctAnswer": "Cisplatin-induced nephrotoxicity with acute kidney injury"
      },
      {
        "id": "q_oet_l41_2",
        "section": "Listening",
        "subject": "Clinical Oncology & Palliative Chemotherapy Protocols",
        "instruction": "Medication Management: What antiemetic combination is ordered for refractory nausea?",
        "audioTranscript": "Doctor: Given his failure to respond to ondansetron alone, lets initiate an NK1 receptor antagonist like aprepitant and add low-dose dexamethasone alongside intravenous hydration.",
        "questionText": "What antiemetic combination is initiated for refractory post-chemotherapy nausea?",
        "options": [
          "An NK1 antagonist (aprepitant) combined with dexamethasone",
          "High-dose oral ibuprofen and carbonated soda",
          "Morphine infusion without any antiemetic agent",
          "Discontinuing all fluids and withholding all medications"
        ],
        "correctAnswer": "An NK1 antagonist (aprepitant) combined with dexamethasone"
      },
      {
        "id": "q_oet_l41_3",
        "section": "Listening",
        "subject": "Clinical Oncology & Palliative Chemotherapy Protocols",
        "instruction": "Line Safety: What maintenance protocol is confirmed for the patients PICC line?",
        "audioTranscript": "Nurse: The peripherally inserted central catheter has brisk blood return. We will flush with 10mL preservative-free normal saline using the push-pause technique followed by heparin lock.",
        "questionText": "Which catheter flushing technique is standard for PICC line patency?",
        "options": [
          "The pulsating push-pause technique using normal saline",
          "Rapid continuous pressurized syringe injection",
          "Aspirating air bubbles into the central venous lumen",
          "Soaking the dressing in cold tap water twice daily"
        ],
        "correctAnswer": "The pulsating push-pause technique using normal saline"
      },
      {
        "id": "q_oet_s41_1",
        "section": "Speaking",
        "subject": "Clinical Oncology & Palliative Chemotherapy Protocols",
        "instruction": "Patient Counseling: Support a patient terrified of chemotherapy side effects.",
        "questionText": "Provide empathetic education regarding proactive symptom management during antineoplastic therapy.",
        "modelAnswer": "Mr. Thomas, it is completely normal to feel apprehensive about chemotherapy. However, we have sophisticated medications to prevent nausea before it starts, and we monitor your blood counts closely to protect you at every stage."
      },
      {
        "id": "q_oet_s41_2",
        "section": "Speaking",
        "subject": "Clinical Oncology & Palliative Chemotherapy Protocols",
        "instruction": "Discharge Instructions: Counsel a neutropenic patient on infection precautions.",
        "questionText": "Explain home precautions for a patient with an absolute neutrophil count of 0.8 x 10^9/L.",
        "modelAnswer": "Because your infection-fighting white blood cells are low, check your temperature twice daily. Avoid crowded indoor spaces, eat well-cooked foods, wash your hands frequently, and come to emergency immediately if your temperature reaches 38°C."
      },
      {
        "id": "q_oet_w41_1",
        "section": "Writing",
        "subject": "Clinical Oncology & Palliative Chemotherapy Protocols",
        "instruction": "Care Plan: Write nursing documentation detailing neutropenic sepsis precautions.",
        "questionText": "Document isolation protocols, dietary restrictions, and vital sign monitoring intervals for neutropenia.",
        "modelAnswer": "Patient admitted under protective isolation for febrile neutropenia (ANC 0.3 x 10^9/L). Four-hourly vital sign tracking initiated. Broad-spectrum piperacillin-tazobactam commenced following blood cultures. Neutropenic diet ordered with avoidance of unpeeled fruits."
      },
      {
        "id": "q_oet_w41_2",
        "section": "Writing",
        "subject": "Clinical Oncology & Palliative Chemotherapy Protocols",
        "instruction": "Transfer Summary: Draft transfer documentation for home hospice palliative care.",
        "questionText": "Summarize pain management regimen, breakthrough analgesia, and family psychosocial support needs.",
        "modelAnswer": "Transferring Mrs. Roberts to community palliative team. Pain controlled on transdermal fentanyl 50 mcg/hr with sublingual morphine 10 mg PRN for breakthrough pain. Family educated on breakthrough dosing intervals; bereavement counseling contact provided."
      }
    ]
  },
  {
    "id": "mock_det_01",
    "exam": "DET",
    "title": "Duolingo English Test Adaptive Simulation #12",
    "difficulty": "Standard",
    "subject": "Urban Architecture & Sustainable Infrastructure",
    "totalDurationMin": 45,
    "targetBandRequirement": "120+ (Proficient)",
    "sections": [
      {
        "id": "sec_det_read_12",
        "name": "Reading",
        "durationMinutes": 15,
        "questionsCount": 3,
        "samplePrompt": "Read & Complete: Green Building Materials",
        "rubric": [
          {
            "criteria": "Lexical Diversity",
            "weight": "50%",
            "description": "Diversity"
          },
          {
            "criteria": "Grammar",
            "weight": "50%",
            "description": "Accuracy"
          }
        ]
      },
      {
        "id": "sec_det_lis_12",
        "name": "Listening",
        "durationMinutes": 10,
        "questionsCount": 3,
        "samplePrompt": "Listen and Type: Urban Heat Island Mitigation",
        "rubric": [
          {
            "criteria": "Phonetic Accuracy",
            "weight": "50%",
            "description": "Phonetics"
          },
          {
            "criteria": "Spelling",
            "weight": "50%",
            "description": "Spelling"
          }
        ]
      },
      {
        "id": "sec_det_spk_12",
        "name": "Speaking",
        "durationMinutes": 10,
        "questionsCount": 2,
        "samplePrompt": "Read then Speak: High-Density Transit Hubs",
        "rubric": [
          {
            "criteria": "Acoustic Clarity",
            "weight": "50%",
            "description": "Clarity"
          },
          {
            "criteria": "Discourse",
            "weight": "50%",
            "description": "Flow"
          }
        ]
      },
      {
        "id": "sec_det_wri_12",
        "name": "Writing",
        "durationMinutes": 10,
        "questionsCount": 2,
        "samplePrompt": "Write About the Photo & 5-Minute Urban Essay",
        "rubric": [
          {
            "criteria": "Task Completion",
            "weight": "50%",
            "description": "Completion"
          },
          {
            "criteria": "Structure",
            "weight": "50%",
            "description": "Structure"
          }
        ]
      }
    ],
    "questions": [
      {
        "id": "q_det_r12_1",
        "section": "Reading",
        "subject": "Urban Architecture & Sustainable Infrastructure",
        "instruction": "Read and Complete: Select the architectural term that best completes the sentence.",
        "questionText": "Incorporating high-performance cross-laminated timber allows high-rise buildings to sequester carbon while reducing dead load _____ on foundations.",
        "options": [
          "stresses",
          "memories",
          "conversations",
          "elections"
        ],
        "correctAnswer": "stresses"
      },
      {
        "id": "q_det_r12_2",
        "section": "Reading",
        "subject": "Urban Architecture & Sustainable Infrastructure",
        "instruction": "Read and Select: What is the primary purpose of permeable pavements in sponge cities?",
        "passage": "Permeable pavements feature porous interlocking matrices that allow stormwater to infiltrate naturally into underlying aquifers, mitigating flash flooding and filtering urban contaminants.",
        "questionText": "Why do urban engineers install permeable pavement systems?",
        "options": [
          "To absorb stormwater runoff and replenish groundwater aquifers",
          "To eliminate the need for traffic signals and road signs",
          "To increase the speed limit of highway vehicles",
          "To generate magnetic electricity for streetlights"
        ],
        "correctAnswer": "To absorb stormwater runoff and replenish groundwater aquifers"
      },
      {
        "id": "q_det_r12_3",
        "section": "Reading",
        "subject": "Urban Architecture & Sustainable Infrastructure",
        "instruction": "Passage Comprehension: How do green roofs combat the urban heat island effect?",
        "passage": "Vegetated green roofs replace dark asphalt surfaces with living sedum plants. Through evapotranspiration, green roofs lower rooftop ambient temperatures by up to 20 degrees Celsius.",
        "questionText": "What thermodynamic process enables green roofs to cool surrounding urban air?",
        "options": [
          "Evapotranspiration from living foliage",
          "Nuclear fusion in soil microbes",
          "Electromagnetic radiation from glass windows",
          "Mechanical air conditioning compressors"
        ],
        "correctAnswer": "Evapotranspiration from living foliage"
      },
      {
        "id": "q_det_l12_1",
        "section": "Listening",
        "subject": "Urban Architecture & Sustainable Infrastructure",
        "instruction": "Listen and Type: Type the exact architectural sentence as spoken.",
        "audioTranscript": "Transit-oriented developments consolidate commercial amenities within walking distance of commuter rail stations.",
        "questionText": "Listen to the audio and type the exact sentence:",
        "correctAnswer": "Transit-oriented developments consolidate commercial amenities within walking distance of commuter rail stations."
      },
      {
        "id": "q_det_l12_2",
        "section": "Listening",
        "subject": "Urban Architecture & Sustainable Infrastructure",
        "instruction": "Listen and Select: What benefit of district cooling is mentioned in the interview?",
        "audioTranscript": "Architect: District cooling networks circulate chilled water from a centralized harbor plant through insulated underground pipes, cutting peak electrical refrigeration demand by forty percent.",
        "questionText": "What primary efficiency is gained through district cooling infrastructure?",
        "options": [
          "Forty percent reduction in peak refrigeration electricity demand",
          "Doubling the height of residential skyscrapers",
          "Eliminating the need for indoor municipal plumbing",
          "Allowing elevators to operate without counterweights"
        ],
        "correctAnswer": "Forty percent reduction in peak refrigeration electricity demand"
      },
      {
        "id": "q_det_l12_3",
        "section": "Listening",
        "subject": "Urban Architecture & Sustainable Infrastructure",
        "instruction": "Listen and Identify: What design strategy minimizes glare in glass towers?",
        "audioTranscript": "Engineer: External louvers and fritted ceramic coatings diffuse harsh solar radiation while preserving panoramic sightlines for office occupants.",
        "questionText": "What facade elements are deployed to diffuse direct solar radiation?",
        "options": [
          "External louvers and fritted ceramic coatings",
          "Mirrored aluminum foil wrapped around doors",
          "Black blackout curtains taped to exterior concrete",
          "Water sprinklers spraying glass walls continuously"
        ],
        "correctAnswer": "External louvers and fritted ceramic coatings"
      },
      {
        "id": "q_det_s12_1",
        "section": "Speaking",
        "subject": "Urban Architecture & Sustainable Infrastructure",
        "instruction": "Read then Speak: In 90 seconds, describe how public transit transforms urban liveability.",
        "questionText": "Explain the environmental and social advantages of pedestrianizing metropolitan city centers.",
        "modelAnswer": "Pedestrianizing central avenues reduces localized nitrogen dioxide emissions, diminishes ambient traffic noise, and revitalizes street-level commerce by prioritizing human scale interaction over vehicular throughput."
      },
      {
        "id": "q_det_s12_2",
        "section": "Speaking",
        "subject": "Urban Architecture & Sustainable Infrastructure",
        "instruction": "Speak About the Photo: Describe an image of a vertical forest skyscraper in 90 seconds.",
        "questionText": "Describe the integration of thousand-tree vertical forests onto residential balconies.",
        "modelAnswer": "The photograph depicts an innovative residential tower with cantilevered concrete terraces supporting mature deciduous trees. This vertical forest provides localized shading, absorbs carbon dioxide, and fosters urban avian biodiversity."
      },
      {
        "id": "q_det_w12_1",
        "section": "Writing",
        "subject": "Urban Architecture & Sustainable Infrastructure",
        "instruction": "Write About the Photo: Write 1-2 detailed sentences describing a solar-paneled transit pavilion.",
        "questionText": "Describe the modern public transit station shown in the image:",
        "modelAnswer": "The newly constructed light rail terminal incorporates an undulating timber canopy embedded with photovoltaic glass, combining renewable energy generation with sheltered pedestrian waiting platforms."
      },
      {
        "id": "q_det_w12_2",
        "section": "Writing",
        "subject": "Urban Architecture & Sustainable Infrastructure",
        "instruction": "5-Minute Essay: In at least 50 words, respond to the urban planning prompt.",
        "questionText": "Should cities invest more in high-speed intercity rail or municipal roadway expansion? Defend your position.",
        "modelAnswer": "Municipalities must prioritize high-speed electric rail over roadway expansion. Adding highway lanes induces additional vehicular demand, worsening gridlock and emissions. In contrast, electrified rail provides high-capacity, zero-emission regional connectivity."
      }
    ]
  },
  {
    "id": "mock_det_02",
    "exam": "DET",
    "title": "Duolingo English Test Adaptive Simulation #13: Global Economics",
    "difficulty": "Advanced",
    "subject": "Macroeconomics & Global Supply Chain Resilience",
    "totalDurationMin": 45,
    "targetBandRequirement": "125+ (Proficient)",
    "sections": [
      {
        "id": "sec_det_r13",
        "name": "Reading",
        "durationMinutes": 15,
        "questionsCount": 3,
        "samplePrompt": "Supply Chain Reshoring & Tariff Structures",
        "rubric": [
          {
            "criteria": "Lexical Precision",
            "weight": "50%",
            "description": "Precision"
          },
          {
            "criteria": "Analytical Depth",
            "weight": "50%",
            "description": "Depth"
          }
        ]
      },
      {
        "id": "sec_det_l13",
        "name": "Listening",
        "durationMinutes": 10,
        "questionsCount": 3,
        "samplePrompt": "Central Bank Interest Rate Adjustments",
        "rubric": [
          {
            "criteria": "Phonetic Accuracy",
            "weight": "50%",
            "description": "Accuracy"
          },
          {
            "criteria": "Comprehension",
            "weight": "50%",
            "description": "Comprehension"
          }
        ]
      },
      {
        "id": "sec_det_s13",
        "name": "Speaking",
        "durationMinutes": 10,
        "questionsCount": 2,
        "samplePrompt": "Monetary Policy vs Inflationary Drift",
        "rubric": [
          {
            "criteria": "Fluency",
            "weight": "50%",
            "description": "Fluency"
          },
          {
            "criteria": "Complexity",
            "weight": "50%",
            "description": "Grammar"
          }
        ]
      },
      {
        "id": "sec_det_w13",
        "name": "Writing",
        "durationMinutes": 10,
        "questionsCount": 2,
        "samplePrompt": "International Trade Agreements Analysis",
        "rubric": [
          {
            "criteria": "Coherence",
            "weight": "50%",
            "description": "Coherence"
          },
          {
            "criteria": "Vocabulary",
            "weight": "50%",
            "description": "Vocabulary"
          }
        ]
      }
    ],
    "questions": [
      {
        "id": "q_det_r13_1",
        "section": "Reading",
        "subject": "Macroeconomics & Global Supply Chain Resilience",
        "instruction": "Read and Complete: Select the macroeconomic term completing the sentence.",
        "questionText": "To mitigate geopolitical choke points, multinational manufacturers are transitioning from lean just-in-time inventories to resilient just-in-case _____ models.",
        "options": [
          "warehousing",
          "gardening",
          "broadcasting",
          "navigating"
        ],
        "correctAnswer": "warehousing"
      },
      {
        "id": "q_det_r13_2",
        "section": "Reading",
        "subject": "Macroeconomics & Global Supply Chain Resilience",
        "instruction": "Reading Analysis: What trade vulnerability is exposed by single-source procurement?",
        "passage": "Sole-source procurement creates catastrophic systemic risk. When regional disruptions occur at key maritime straits, downstream manufacturing halts abruptly across continents due to unbuffered input shortages.",
        "questionText": "What is the primary risk of sole-source procurement in global trade?",
        "options": [
          "Severe downstream manufacturing shutdowns when localized disruptions occur",
          "Immediate worldwide deflation in consumer goods prices",
          "An oversupply of skilled labor in export terminals",
          "Complete elimination of corporate shipping expenses"
        ],
        "correctAnswer": "Severe downstream manufacturing shutdowns when localized disruptions occur"
      },
      {
        "id": "q_det_r13_3",
        "section": "Reading",
        "subject": "Macroeconomics & Global Supply Chain Resilience",
        "instruction": "Passage Comprehension: What does \"nearshoring\" signify in modern manufacturing?",
        "passage": "Nearshoring involves relocating production facilities closer to target consumer markets, reducing maritime transit duration from weeks to days while insulating supply chains from international freight tariff shocks.",
        "questionText": "The term \"nearshoring\" refers to:",
        "options": [
          "Relocating manufacturing to geographically adjacent countries near consumers",
          "Outsourcing all production to distant polar research stations",
          "Shutting down all domestic assembly lines permanently",
          "Using paper barter currencies in place of international banking wires"
        ],
        "correctAnswer": "Relocating manufacturing to geographically adjacent countries near consumers"
      },
      {
        "id": "q_det_l13_1",
        "section": "Listening",
        "subject": "Macroeconomics & Global Supply Chain Resilience",
        "instruction": "Listen and Type: Type the economic sentence verbatim.",
        "audioTranscript": "Central banks utilize quantitative tightening to absorb excess capital liquidity during periods of persistent inflation.",
        "questionText": "Type the dictated macroeconomic sentence:",
        "correctAnswer": "Central banks utilize quantitative tightening to absorb excess capital liquidity during periods of persistent inflation."
      },
      {
        "id": "q_det_l13_2",
        "section": "Listening",
        "subject": "Macroeconomics & Global Supply Chain Resilience",
        "instruction": "Listen and Identify: What trade-off is discussed regarding tariff barriers?",
        "audioTranscript": "Economist: While protective tariffs shelter domestic infant industries from subsidized foreign competition, they simultaneously increase consumer prices and invite retaliatory trade embargoes.",
        "questionText": "What adverse consequence accompanies import tariffs?",
        "options": [
          "Higher consumer retail prices and retaliatory export penalties",
          "Instantaneous doubling of domestic currency purchasing power",
          "Complete abolition of corporate income taxes",
          "Immediate conversion of factory workers into farmers"
        ],
        "correctAnswer": "Higher consumer retail prices and retaliatory export penalties"
      },
      {
        "id": "q_det_l13_3",
        "section": "Listening",
        "subject": "Macroeconomics & Global Supply Chain Resilience",
        "instruction": "Lecture Comprehension: How does port container automation improve throughput?",
        "audioTranscript": "Analyst: Automated guided vehicles and optical crane scanners operate around the clock, cutting vessel turnaround times by thirty percent compared to manual operations.",
        "questionText": "What metric improves most via automated container handling?",
        "options": [
          "Vessel turnaround time at maritime container terminals",
          "The physical weight of imported cargo steel",
          "The atmospheric temperature inside cargo holds",
          "The number of sailors required aboard ocean vessels"
        ],
        "correctAnswer": "Vessel turnaround time at maritime container terminals"
      },
      {
        "id": "q_det_s13_1",
        "section": "Speaking",
        "subject": "Macroeconomics & Global Supply Chain Resilience",
        "instruction": "Read then Speak: In 90 seconds, explain the dynamics of inflationary cost-push cycles.",
        "questionText": "Explain how escalating shipping container rates and energy prices drive cost-push inflation throughout global economies.",
        "modelAnswer": "When maritime freight rates and fossil fuel prices spike, raw material import costs rise for domestic manufacturers. Producers pass these production expenses onto consumers through elevated retail prices, catalyzing broader inflationary spirals."
      },
      {
        "id": "q_det_s13_2",
        "section": "Speaking",
        "subject": "Macroeconomics & Global Supply Chain Resilience",
        "instruction": "Speak About the Topic: Discuss currency valuation and export competitiveness.",
        "questionText": "Describe how a depreciating domestic currency impacts a nations export competitiveness and import costs.",
        "modelAnswer": "A depreciating currency renders domestic goods cheaper and more competitive in overseas markets, boosting export volumes. However, it concurrently increases the cost of imported raw commodities, exacerbating imported inflationary pressures."
      },
      {
        "id": "q_det_w13_1",
        "section": "Writing",
        "subject": "Macroeconomics & Global Supply Chain Resilience",
        "instruction": "Short Analysis: Write 2-3 sentences analyzing semiconductor supply chain concentration.",
        "questionText": "Explain the strategic vulnerability of geographic concentration in advanced semiconductor fabrication:",
        "modelAnswer": "Advanced semiconductor manufacturing is concentrated in a handful of high-density fabrication plants in East Asia. A localized geopolitical or seismic event could paralyze global automotive, medical, and consumer electronics industries within days."
      },
      {
        "id": "q_det_w13_2",
        "section": "Writing",
        "subject": "Macroeconomics & Global Supply Chain Resilience",
        "instruction": "5-Minute Essay: In at least 50 words, evaluate multilateral free trade agreements.",
        "questionText": "Do free trade agreements benefit developing nations or perpetuate economic imbalance? Provide reasons.",
        "modelAnswer": "Multilateral trade agreements stimulate economic growth in developing countries by unlocking foreign direct investment and access to global markets. However, safeguards must protect domestic labor rights and prevent predatory resource extraction by multinational conglomerates."
      }
    ]
  },
  {
    "id": "mock_cambridge_01",
    "exam": "Cambridge English",
    "title": "Cambridge C1 Advanced (CAE) Official Simulation #301",
    "difficulty": "Advanced",
    "subject": "Sociolinguistics & Evolutionary Language Development",
    "totalDurationMin": 65,
    "targetBandRequirement": "Grade A / C2 Level (200+ Points)",
    "sections": [
      {
        "id": "sec_cae_r1",
        "name": "Reading",
        "durationMinutes": 25,
        "questionsCount": 3,
        "samplePrompt": "Use of English & Lexical Morphology",
        "rubric": [
          {
            "criteria": "Lexico-Grammar",
            "weight": "50%",
            "description": "Collocation"
          },
          {
            "criteria": "Cohesion",
            "weight": "50%",
            "description": "Cohesion"
          }
        ]
      },
      {
        "id": "sec_cae_l1",
        "name": "Listening",
        "durationMinutes": 15,
        "questionsCount": 3,
        "samplePrompt": "Radio Interview on Dialectal Convergence",
        "rubric": [
          {
            "criteria": "Nuance Detection",
            "weight": "50%",
            "description": "Nuance"
          },
          {
            "criteria": "Synthesis",
            "weight": "50%",
            "description": "Synthesis"
          }
        ]
      },
      {
        "id": "sec_cae_s1",
        "name": "Speaking",
        "durationMinutes": 10,
        "questionsCount": 2,
        "samplePrompt": "Collaborative Discourse on Endangered Dialects",
        "rubric": [
          {
            "criteria": "Interactive Fluency",
            "weight": "50%",
            "description": "Interaction"
          },
          {
            "criteria": "Lexical Resource",
            "weight": "50%",
            "description": "Vocabulary"
          }
        ]
      },
      {
        "id": "sec_cae_w1",
        "name": "Writing",
        "durationMinutes": 15,
        "questionsCount": 2,
        "samplePrompt": "Formal Academic Proposal on Language Preservation",
        "rubric": [
          {
            "criteria": "Register & Tone",
            "weight": "50%",
            "description": "Formal register"
          },
          {
            "criteria": "Argumentation",
            "weight": "50%",
            "description": "Logic"
          }
        ]
      }
    ],
    "questions": [
      {
        "id": "q_cae_r1",
        "section": "Reading",
        "subject": "Sociolinguistics & Evolutionary Language Development",
        "instruction": "Reading & Use of English: Choose the correct academic collocation.",
        "questionText": "Linguistic fieldworkers observed that generational language shift is frequently _____ by economic migration into urban centers.",
        "options": [
          "precipitated",
          "congratulated",
          "rehearsed",
          "postponed"
        ],
        "correctAnswer": "precipitated"
      },
      {
        "id": "q_cae_r2",
        "section": "Reading",
        "subject": "Sociolinguistics & Evolutionary Language Development",
        "instruction": "Text Analysis: What distinguishes pidgins from creoles in linguistic evolution?",
        "passage": "A pidgin arises as an improvised contact vernacular lacking native speakers and complex syntax. When a new generation of children acquires this contact tongue as their primary mother tongue, they systematically regularize its grammar and expand its vocabulary, crystallizing it into a fully fledged creole.",
        "questionText": "What is the definitive linguistic catalyst that transforms a pidgin into a creole?",
        "options": [
          "First-language acquisition by children who regularize and expand its grammar",
          "The intervention of government linguistic academies printing dictionaries",
          "The adoption of Latin alphabet orthography by foreign missionaries",
          "The complete elimination of all phonetic vowel distinctions"
        ],
        "correctAnswer": "First-language acquisition by children who regularize and expand its grammar"
      },
      {
        "id": "q_cae_r3",
        "section": "Reading",
        "subject": "Sociolinguistics & Evolutionary Language Development",
        "instruction": "Vocabulary in Context: What is meant by diglossia?",
        "passage": "In diglossic societies, two distinct linguistic varieties coexist across a single speech community: a codified High variety used in formal liturgy, legal statutes, and academia, and a Low colloquial dialect reserved for home and informal conversation.",
        "questionText": "The term \"diglossia\" describes a sociolinguistic situation where:",
        "options": [
          "High and Low varieties of a language are partitioned into formal and informal domains",
          "Citizens are legally forced to speak two completely unrelated foreign languages",
          "All spoken languages are replaced by artificial computer programming code",
          "Written grammar differs depending on the time of day it is read"
        ],
        "correctAnswer": "High and Low varieties of a language are partitioned into formal and informal domains"
      },
      {
        "id": "q_cae_l1",
        "section": "Listening",
        "subject": "Sociolinguistics & Evolutionary Language Development",
        "instruction": "Listen to a sociolinguistic broadcast and answer the question.",
        "audioTranscript": "Linguist: In hyper-mobile cosmopolitan hubs, we observe dialect leveling. Highly localized regional phonemes recede in favor of a supralocal colloquial standard, accelerating the homogenization of youth speech patterns.",
        "questionText": "What characterizes the phenomenon of dialect leveling described by the linguist?",
        "options": [
          "The erosion of localized regional accents in favor of a homogenized supralocal norm",
          "The sudden invention of entirely new grammatical declension cases",
          "The total disappearance of all vowel sounds in urban slang",
          "The requirement that all radio broadcasters speak classical Latin"
        ],
        "correctAnswer": "The erosion of localized regional accents in favor of a homogenized supralocal norm"
      },
      {
        "id": "q_cae_l2",
        "section": "Listening",
        "subject": "Sociolinguistics & Evolutionary Language Development",
        "instruction": "Interview Comprehension: What motivated the revival of the Welsh language?",
        "audioTranscript": "Broadcaster: Grassroots bilingual immersion schools—the Pluc Menter—paired with statutory parity in public administration transformed Welsh from a declining tongue into a thriving national language.",
        "questionText": "What policy combination catalyzed the resurgence of the Welsh language?",
        "options": [
          "Early childhood immersive education paired with official administrative status",
          "Banning all English language books from commercial bookshops",
          "Offering cash lottery prizes for citizens who avoid using smartphones",
          "Replacing highway signs with pictographic hieroglyphs"
        ],
        "correctAnswer": "Early childhood immersive education paired with official administrative status"
      },
      {
        "id": "q_cae_l3",
        "section": "Listening",
        "subject": "Sociolinguistics & Evolutionary Language Development",
        "instruction": "Speaker Stance: What does the socio-phonetician conclude regarding prestige dialects?",
        "audioTranscript": "Professor: Received Pronunciation is not inherently more musical or logical; its prestige is an arbitrary sociological construct reflecting historic concentration of institutional wealth and political power.",
        "questionText": "What is the academic consensus regarding standard prestige dialects?",
        "options": [
          "Prestige dialects reflect historic socioeconomic power rather than intrinsic linguistic superiority",
          "Prestige dialects possess mathematically superior acoustic clarity",
          "Dialects without formal prestige lack coherent grammatical rules",
          "Prestige accents are genetically inherited through auditory anatomy"
        ],
        "correctAnswer": "Prestige dialects reflect historic socioeconomic power rather than intrinsic linguistic superiority"
      },
      {
        "id": "q_cae_s1",
        "section": "Speaking",
        "subject": "Sociolinguistics & Evolutionary Language Development",
        "instruction": "Collaborative Task: Discuss language loss in the digital era.",
        "questionText": "Discuss how internet dominance by a handful of global languages impacts smaller indigenous linguistic varieties.",
        "modelAnswer": "Digital interfaces and internet algorithms overwhelmingly prioritize high-resource global languages. When youth find no digital keyboard layouts, educational software, or social media content in their ancestral tongue, linguistic attrition accelerates."
      },
      {
        "id": "q_cae_s2",
        "section": "Speaking",
        "subject": "Sociolinguistics & Evolutionary Language Development",
        "instruction": "Long Turn: In 2 minutes, analyze the Sapir-Whorf linguistic relativity hypothesis.",
        "questionText": "To what extent does the structure of a language influence or constrain its speakers worldview?",
        "modelAnswer": "While linguistic determinism has been discredited, weak linguistic relativity is empirically supported. Languages that encode fine-grained spatial coordinates or grammatical evidentials prime speakers to pay greater habitual attention to environmental orientation and information sources."
      },
      {
        "id": "q_cae_w1",
        "section": "Writing",
        "subject": "Sociolinguistics & Evolutionary Language Development",
        "instruction": "Formal Proposal: Draft an academic proposal requesting funding for indigenous oral history archiving.",
        "questionText": "Write a proposal to an academic foundation justifying high-resolution audio recording of endangered dialects.",
        "modelAnswer": "I propose creating an open-access phonological archive for endangered northwest dialects. Documenting acoustic phonetics and ceremonial oral storytelling before the passing of elderly speakers preserves irrecoverable ecological vocabulary and linguistic typology."
      },
      {
        "id": "q_cae_w2",
        "section": "Writing",
        "subject": "Sociolinguistics & Evolutionary Language Development",
        "instruction": "Formal Essay: Evaluate the impact of digital messaging abbreviations on teenage literacy.",
        "questionText": "Do messaging shorthands and emojis degrade teenage writing skills or foster creative metalinguistic awareness?",
        "modelAnswer": "Empirical sociolinguistic research indicates that texting abbreviations do not impair conventional literacy. Rather, teenagers demonstrate metalinguistic register flexibility, adeptly code-switching between playful digital vernaculars and rigorous formal academic essays."
      }
    ]
  },
  {
    "id": "mock_cambridge_02",
    "exam": "Cambridge English",
    "title": "Cambridge C2 Proficiency (CPE) Official Simulation #401",
    "difficulty": "Advanced",
    "subject": "Philosophy of Science & Epistemological Logic",
    "totalDurationMin": 70,
    "targetBandRequirement": "Grade A / C2 Master (220+ Points)",
    "sections": [
      {
        "id": "sec_cpe_r1",
        "name": "Reading",
        "durationMinutes": 25,
        "questionsCount": 3,
        "samplePrompt": "Kuhnian Paradigms vs Falsificationism",
        "rubric": [
          {
            "criteria": "Textual Synthesis",
            "weight": "50%",
            "description": "Synthesis"
          },
          {
            "criteria": "Conceptual Precision",
            "weight": "50%",
            "description": "Precision"
          }
        ]
      },
      {
        "id": "sec_cpe_l1",
        "name": "Listening",
        "durationMinutes": 15,
        "questionsCount": 3,
        "samplePrompt": "Seminar on the Duhem-Quine Thesis",
        "rubric": [
          {
            "criteria": "Abstract Argumentation",
            "weight": "50%",
            "description": "Argumentation"
          },
          {
            "criteria": "Deduction",
            "weight": "50%",
            "description": "Deduction"
          }
        ]
      },
      {
        "id": "sec_cpe_s1",
        "name": "Speaking",
        "durationMinutes": 15,
        "questionsCount": 2,
        "samplePrompt": "Epistemological Realism vs Instrumentalism",
        "rubric": [
          {
            "criteria": "Sophistication",
            "weight": "50%",
            "description": "Register"
          },
          {
            "criteria": "Cohesion",
            "weight": "50%",
            "description": "Cohesion"
          }
        ]
      },
      {
        "id": "sec_cpe_w1",
        "name": "Writing",
        "durationMinutes": 15,
        "questionsCount": 2,
        "samplePrompt": "Critical Review of Scientific Realism Treatise",
        "rubric": [
          {
            "criteria": "Rhetorical Command",
            "weight": "50%",
            "description": "Command"
          },
          {
            "criteria": "Stylistic Elegance",
            "weight": "50%",
            "description": "Elegance"
          }
        ]
      }
    ],
    "questions": [
      {
        "id": "q_cpe_r1",
        "section": "Reading",
        "subject": "Philosophy of Science & Epistemological Logic",
        "instruction": "Reading Comprehension: Identify the philosophical stance described.",
        "passage": "Karl Popper contended that no amount of positive empirical corroboration can definitively prove a universal scientific hypothesis, since future observations could refute it. Consequently, the demarcation criterion between science and pseudoscience resides strictly in falsifiability.",
        "questionText": "According to Karl Popper, what criterion distinguishes genuine scientific theories from pseudoscience?",
        "options": [
          "The potential for an empirical observation to logically contradict and falsify the theory",
          "The unanimous consensus of state-sponsored academic committees",
          "The emotional comfort a theory provides to the general populace",
          "The mathematical impossibility of ever conducting an experiment"
        ],
        "correctAnswer": "The potential for an empirical observation to logically contradict and falsify the theory"
      },
      {
        "id": "q_cpe_r2",
        "section": "Reading",
        "subject": "Philosophy of Science & Epistemological Logic",
        "instruction": "Conceptual Analysis: What constitutes a paradigm shift according to Thomas Kuhn?",
        "passage": "Thomas Kuhn argued that science does not progress via linear cumulative accrual of truth. Instead, periods of conservative \"normal science\" accumulate persistent anomalies until a crisis precipitates a revolutionary paradigm shift, incommensurable with the superseded conceptual framework.",
        "questionText": "What triggers a scientific revolution in Kuhns model?",
        "options": [
          "An accumulation of persistent experimental anomalies that existing frameworks cannot reconcile",
          "A government decree mandating new university textbooks",
          "The complete cessation of all scientific publication for a decade",
          "A sudden decrease in global research grant funding"
        ],
        "correctAnswer": "An accumulation of persistent experimental anomalies that existing frameworks cannot reconcile"
      },
      {
        "id": "q_cpe_r3",
        "section": "Reading",
        "subject": "Philosophy of Science & Epistemological Logic",
        "instruction": "Vocabulary in Context: What is meant by the underdetermination of theory by evidence?",
        "passage": "The Duhem-Quine thesis asserts that theoretical hypotheses cannot be tested in isolation. An empirical anomaly can always be deflected away from the core thesis by altering auxiliary assumptions, leaving multiple competing theories underdetermined by available empirical data.",
        "questionText": "The term \"underdetermination\" indicates that:",
        "options": [
          "Available empirical evidence is insufficient to uniquely single out one theory over rivals",
          "Scientists lack adequate funding to conduct laboratory assays",
          "All scientific theories are mathematically equivalent to random guesses",
          "Theoretical physics has been declared illegal by international courts"
        ],
        "correctAnswer": "Available empirical evidence is insufficient to uniquely single out one theory over rivals"
      },
      {
        "id": "q_cpe_l1",
        "section": "Listening",
        "subject": "Philosophy of Science & Epistemological Logic",
        "instruction": "Listen to a philosophy of science seminar and answer the question.",
        "audioTranscript": "Professor: Scientific instrumentalists view unobservable theoretical entities like quarks or wavefunctions as useful calculational instruments rather than literal descriptions of ontological reality.",
        "questionText": "How do scientific instrumentalists interpret unobservable entities like subatomic quarks?",
        "options": [
          "As mathematical calculational tools useful for predictions rather than literal reality",
          "As mystical supernatural spirits beyond human comprehension",
          "As optical illusions caused by defective laboratory microscope lenses",
          "As biological parasites infecting scientific research instruments"
        ],
        "correctAnswer": "As mathematical calculational tools useful for predictions rather than literal reality"
      },
      {
        "id": "q_cpe_l2",
        "section": "Listening",
        "subject": "Philosophy of Science & Epistemological Logic",
        "instruction": "Seminar Comprehension: What is the \"No Miracles Argument\" for scientific realism?",
        "audioTranscript": "Philosopher: Scientific realists maintain that the predictive and technological triumph of modern physics would be an incomprehensible miracle unless our best theories were at least approximately true representations of the physical world.",
        "questionText": "What is the central premise of the \"No Miracles Argument\"?",
        "options": [
          "The predictive success of science is inexplicable unless theories are approximately true",
          "Miracles occur daily in physics laboratories through divine intervention",
          "Scientists should rely on faith rather than empirical testing",
          "All technological inventions are the result of accidental software bugs"
        ],
        "correctAnswer": "The predictive success of science is inexplicable unless theories are approximately true"
      },
      {
        "id": "q_cpe_l3",
        "section": "Listening",
        "subject": "Philosophy of Science & Epistemological Logic",
        "instruction": "Detail Question: How does Bayesian confirmation theory update belief?",
        "audioTranscript": "Professor: Bayesian epistemology formalizes belief updating by calculating posterior probabilities proportional to prior probabilities multiplied by experimental likelihood ratios.",
        "questionText": "How does Bayesian confirmation theory quantify scientific conviction?",
        "options": [
          "By updating prior probability distributions in light of new conditional evidence",
          "By holding secret parliamentary ballots among university deans",
          "By measuring the acoustic volume of debate in lecture halls",
          "By choosing the hypothesis published in the oldest leather-bound book"
        ],
        "correctAnswer": "By updating prior probability distributions in light of new conditional evidence"
      },
      {
        "id": "q_cpe_s1",
        "section": "Speaking",
        "subject": "Philosophy of Science & Epistemological Logic",
        "instruction": "Speaking Task: In 2 minutes, evaluate whether science can yield absolute certainty.",
        "questionText": "Debate the limits of inductive inference and explain why scientific conclusions remain provisional.",
        "modelAnswer": "Inductive inference generalizes from observed instances to universal laws. Because future observations cannot be guaranteed to conform to past patterns, Hume showed that induction lacks deductive certainty, rendering all scientific conclusions provisional."
      },
      {
        "id": "q_cpe_s2",
        "section": "Speaking",
        "subject": "Philosophy of Science & Epistemological Logic",
        "instruction": "Speaking Task: Discuss the ethical limits of algorithmic scientific automation.",
        "questionText": "Should AI systems autonomously formulate and execute scientific research programs?",
        "modelAnswer": "While automated laboratories accelerate combinatorial screening, epistemological responsibility and ethical alignment must remain tethered to human judgment to prevent catastrophic unintended consequences in biosecurity and autonomous weapons."
      },
      {
        "id": "q_cpe_w1",
        "section": "Writing",
        "subject": "Philosophy of Science & Epistemological Logic",
        "instruction": "Critical Review: Review a philosophical treatise on social constructivism in laboratory physics.",
        "questionText": "Write a critical essay evaluating whether experimental physical constants are discovered or constructed.",
        "modelAnswer": "While social constructivists rightly observe that laboratory agendas and linguistic categories are culturally mediated, physical constants like Plancks constant reflect invariant constraints of external reality that remain recalcitrant to human social negotiation."
      },
      {
        "id": "q_cpe_w2",
        "section": "Writing",
        "subject": "Philosophy of Science & Epistemological Logic",
        "instruction": "Epistemological Essay: Analyze the replication crisis in contemporary empirical psychology.",
        "questionText": "Evaluate the structural incentives leading to reproducibility failures and propose institutional reforms.",
        "modelAnswer": "Publication bias toward novel, statistically significant findings incentives p-hacking and underpowered sample sizes. Restoring scientific integrity demands pre-registration of experimental protocols, open data repositories, and institutional recognition of replication studies."
      }
    ]
  },
  {
    "id": "mock_det_foundation_01",
    "exam": "DET",
    "title": "Duolingo English Test - Junior Explorer Foundation #01",
    "difficulty": "Foundation",
    "subject": "Marine Zoology & Coral Reef Ecosystems",
    "totalDurationMin": 35,
    "targetBandRequirement": "60-85 (Foundation Explorer)",
    "sections": [
      {
        "id": "sec_det_found_r1",
        "name": "Reading",
        "durationMinutes": 10,
        "questionsCount": 3,
        "samplePrompt": "Life on the Coral Reef",
        "rubric": [
          {
            "criteria": "Basic Vocabulary",
            "weight": "60%",
            "description": "Vocabulary"
          },
          {
            "criteria": "Spelling",
            "weight": "40%",
            "description": "Spelling"
          }
        ]
      },
      {
        "id": "sec_det_found_l1",
        "name": "Listening",
        "durationMinutes": 10,
        "questionsCount": 3,
        "samplePrompt": "Ocean Animal Sounds & Dictation",
        "rubric": [
          {
            "criteria": "Listening Comprehension",
            "weight": "60%",
            "description": "Comprehension"
          },
          {
            "criteria": "Word Recognition",
            "weight": "40%",
            "description": "Recognition"
          }
        ]
      },
      {
        "id": "sec_det_found_s1",
        "name": "Speaking",
        "durationMinutes": 8,
        "questionsCount": 2,
        "samplePrompt": "Describe a Friendly Sea Turtle",
        "rubric": [
          {
            "criteria": "Speaking Clarity",
            "weight": "50%",
            "description": "Clarity"
          },
          {
            "criteria": "Vocabulary",
            "weight": "50%",
            "description": "Words"
          }
        ]
      },
      {
        "id": "sec_det_found_w1",
        "name": "Writing",
        "durationMinutes": 7,
        "questionsCount": 2,
        "samplePrompt": "Write Sentences About Ocean Life",
        "rubric": [
          {
            "criteria": "Punctuation",
            "weight": "50%",
            "description": "Punctuation"
          },
          {
            "criteria": "Grammar",
            "weight": "50%",
            "description": "Sentence structure"
          }
        ]
      }
    ],
    "questions": [
      {
        "id": "q_det_f1_r1",
        "section": "Reading",
        "subject": "Marine Zoology & Coral Reef Ecosystems",
        "instruction": "Read and Complete: Choose the missing word.",
        "questionText": "Clownfish live safely among sea anemones because a layer of mucus protects them from the anemones painful _____ tentacles.",
        "options": [
          "stinging",
          "flying",
          "reading",
          "sleeping"
        ],
        "correctAnswer": "stinging"
      },
      {
        "id": "q_det_f1_r2",
        "section": "Reading",
        "subject": "Marine Zoology & Coral Reef Ecosystems",
        "instruction": "Reading Comprehension: Where do green sea turtles lay their eggs?",
        "passage": "Female sea turtles migrate thousands of miles across open oceans to return to the exact sandy beach where they were born, crawling ashore under the moonlight to lay their eggs.",
        "questionText": "Where do female sea turtles lay their eggs?",
        "options": [
          "On sandy beaches where they were born",
          "At the tops of tall coconut palm trees",
          "Inside underwater deep-sea caves only",
          "On floating icebergs in the Arctic"
        ],
        "correctAnswer": "On sandy beaches where they were born"
      },
      {
        "id": "q_det_f1_r3",
        "section": "Reading",
        "subject": "Marine Zoology & Coral Reef Ecosystems",
        "instruction": "Vocabulary: Why are coral reefs called rainforests of the sea?",
        "passage": "Although coral reefs cover less than one percent of the ocean floor, they provide a home and food for over twenty-five percent of all marine species.",
        "questionText": "Why are coral reefs compared to rainforests?",
        "options": [
          "They shelter a huge variety of colorful marine creatures",
          "They grow tall oak trees underwater",
          "It rains constantly underwater on the reef",
          "They are made completely out of sweet green fruit"
        ],
        "correctAnswer": "They shelter a huge variety of colorful marine creatures"
      },
      {
        "id": "q_det_f1_l1",
        "section": "Listening",
        "subject": "Marine Zoology & Coral Reef Ecosystems",
        "instruction": "Listen and Type: Type the short sentence you hear.",
        "audioTranscript": "Dolphins use echolocation clicks to navigate through deep water.",
        "questionText": "Listen and type the exact sentence:",
        "correctAnswer": "Dolphins use echolocation clicks to navigate through deep water."
      },
      {
        "id": "q_det_f1_l2",
        "section": "Listening",
        "subject": "Marine Zoology & Coral Reef Ecosystems",
        "instruction": "Listen and Select: What do parrotfish eat?",
        "audioTranscript": "Marine Biologist: Parrotfish use their strong beak-like teeth to scrape algae off dead coral, grinding the calcium rock into fine white beach sand.",
        "questionText": "What surprising natural product is created by parrotfish?",
        "options": [
          "Fine white beach sand",
          "Plastic drink bottles",
          "Cold metallic coins",
          "Wooden building blocks"
        ],
        "correctAnswer": "Fine white beach sand"
      },
      {
        "id": "q_det_f1_l3",
        "section": "Listening",
        "subject": "Marine Zoology & Coral Reef Ecosystems",
        "instruction": "Listen and Identify: What color is bioluminescent light in deep-sea jellyfish?",
        "audioTranscript": "Scientist: When deep-sea jellyfish are touched, they flash bright blue and green bioluminescent light to startle predators.",
        "questionText": "What colors do jellyfish glow in the dark ocean?",
        "options": [
          "Bright blue and green light",
          "Pitch black darkness",
          "Brown mud colors",
          "Hot yellow flames"
        ],
        "correctAnswer": "Bright blue and green light"
      },
      {
        "id": "q_det_f1_s1",
        "section": "Speaking",
        "subject": "Marine Zoology & Coral Reef Ecosystems",
        "instruction": "Describe the Animal: Talk about dolphins for 45 seconds.",
        "questionText": "Speak about why dolphins live in social pods and leap above waves.",
        "modelAnswer": "Dolphins are smart mammals that breathe air and live in family groups called pods. They whistle to communicate, hunt fish together, and leap above waves to play."
      },
      {
        "id": "q_det_f1_s2",
        "section": "Speaking",
        "subject": "Marine Zoology & Coral Reef Ecosystems",
        "instruction": "Speak About the Photo: Describe a colorful coral reef teeming with tropical fish.",
        "questionText": "Describe what you see in a vibrant undersea photograph.",
        "modelAnswer": "In this photo I see bright orange clownfish swimming around purple coral branches. Clear blue water lets warm sunshine illuminate the sea floor."
      },
      {
        "id": "q_det_f1_w1",
        "section": "Writing",
        "subject": "Marine Zoology & Coral Reef Ecosystems",
        "instruction": "Write Sentences: Write 2 sentences about protecting the ocean.",
        "questionText": "Write about how kids can help keep the sea clean:",
        "modelAnswer": "Kids can help sea animals by picking up plastic litter at the beach. We should also recycle bottles so trash never washes into the ocean."
      },
      {
        "id": "q_det_f1_w2",
        "section": "Writing",
        "subject": "Marine Zoology & Coral Reef Ecosystems",
        "instruction": "Short Paragraph: Write 3 sentences about your favorite sea animal.",
        "questionText": "Write a short description of an ocean creature you love:",
        "modelAnswer": "My favorite ocean animal is the giant blue whale because it is the largest creature on Earth. It sings beautiful songs across hundreds of miles of ocean."
      }
    ]
  },
  {
    "id": "mock_cambridge_foundation_01",
    "exam": "Cambridge English",
    "title": "Cambridge A2 Key & B1 Preliminary Foundation Simulation #101",
    "difficulty": "Foundation",
    "subject": "Renewable Energy & Solar Power Innovations",
    "totalDurationMin": 40,
    "targetBandRequirement": "Pass with Merit / CEFR A2-B1",
    "sections": [
      {
        "id": "sec_cam_found_r1",
        "name": "Reading",
        "durationMinutes": 15,
        "questionsCount": 3,
        "samplePrompt": "How Solar Panels Work & Clean Energy",
        "rubric": [
          {
            "criteria": "Reading Accuracy",
            "weight": "60%",
            "description": "Accuracy"
          },
          {
            "criteria": "Vocabulary",
            "weight": "40%",
            "description": "Words"
          }
        ]
      },
      {
        "id": "sec_cam_found_l1",
        "name": "Listening",
        "durationMinutes": 10,
        "questionsCount": 3,
        "samplePrompt": "Radio Interview on Wind Farms",
        "rubric": [
          {
            "criteria": "Aural Details",
            "weight": "60%",
            "description": "Details"
          },
          {
            "criteria": "Spelling",
            "weight": "40%",
            "description": "Spelling"
          }
        ]
      },
      {
        "id": "sec_cam_found_s1",
        "name": "Speaking",
        "durationMinutes": 8,
        "questionsCount": 2,
        "samplePrompt": "Talk About Saving Energy at Home",
        "rubric": [
          {
            "criteria": "Pronunciation",
            "weight": "50%",
            "description": "Clarity"
          },
          {
            "criteria": "Grammar",
            "weight": "50%",
            "description": "Simple tenses"
          }
        ]
      },
      {
        "id": "sec_cam_found_w1",
        "name": "Writing",
        "durationMinutes": 7,
        "questionsCount": 2,
        "samplePrompt": "Email About a Science Project on Solar Cars",
        "rubric": [
          {
            "criteria": "Content",
            "weight": "50%",
            "description": "Email format"
          },
          {
            "criteria": "Spelling",
            "weight": "50%",
            "description": "Accuracy"
          }
        ]
      }
    ],
    "questions": [
      {
        "id": "q_cam_f1_r1",
        "section": "Reading",
        "subject": "Renewable Energy & Solar Power Innovations",
        "instruction": "Reading Comprehension: Complete the sentence.",
        "questionText": "Photovoltaic cells on solar panels absorb sunshine and directly convert it into clean _____ without producing smoke.",
        "options": [
          "electricity",
          "gasoline",
          "timber",
          "snow"
        ],
        "correctAnswer": "electricity"
      },
      {
        "id": "q_cam_f1_r2",
        "section": "Reading",
        "subject": "Renewable Energy & Solar Power Innovations",
        "instruction": "Text Comprehension: What turns the blades on wind turbine generators?",
        "passage": "Modern wind turbines stand tall on open grassy hills where strong breezes push giant rotor blades, spinning a copper coil inside an electrical generator.",
        "questionText": "What provides the kinetic energy to turn wind turbine blades?",
        "options": [
          "Natural wind breezes pushing the rotor blades",
          "Gasoline poured into the rotor hub",
          "Water pumped up from underground wells",
          "Horses pulling cables attached to the turbine"
        ],
        "correctAnswer": "Natural wind breezes pushing the rotor blades"
      },
      {
        "id": "q_cam_f1_r3",
        "section": "Reading",
        "subject": "Renewable Energy & Solar Power Innovations",
        "instruction": "Vocabulary: Why are solar and wind called \"renewable\" energy sources?",
        "passage": "Fossil fuels like coal take millions of years to form and will eventually run out. In contrast, sunlight and wind will naturally replenish every day for billions of years.",
        "questionText": "Why are solar and wind called renewable resources?",
        "options": [
          "They are continuously replenished by nature and will not run out",
          "They are expensive chemicals made in factories",
          "They only work on Tuesdays and Thursdays",
          "They cause black smoke to fill neighborhood skies"
        ],
        "correctAnswer": "They are continuously replenished by nature and will not run out"
      },
      {
        "id": "q_cam_f1_l1",
        "section": "Listening",
        "subject": "Renewable Energy & Solar Power Innovations",
        "instruction": "Listen and Answer: What did the school install on its rooftop?",
        "audioTranscript": "Principal: Over the summer vacation, our school installed one hundred solar panels on the library roof to power our computer laboratories.",
        "questionText": "What was installed on the school library roof?",
        "options": [
          "One hundred solar panels to power computers",
          "A giant plastic waterslide",
          "A commercial helicopter landing pad",
          "A coal-burning steam engine furnace"
        ],
        "correctAnswer": "One hundred solar panels to power computers"
      },
      {
        "id": "q_cam_f1_l2",
        "section": "Listening",
        "subject": "Renewable Energy & Solar Power Innovations",
        "instruction": "Listen and Select: Where do batteries store extra solar energy?",
        "audioTranscript": "Engineer: When the sun shines brightly during midday, large lithium battery packs store surplus electricity so families can turn on lights after sunset.",
        "questionText": "When is stored battery electricity utilized in solar homes?",
        "options": [
          "At night after sunset when the sun is no longer shining",
          "During thunderstorms to attract lightning bolts",
          "Only when families are on holiday abroad",
          "Never, because batteries must stay empty"
        ],
        "correctAnswer": "At night after sunset when the sun is no longer shining"
      },
      {
        "id": "q_cam_f1_l3",
        "section": "Listening",
        "subject": "Renewable Energy & Solar Power Innovations",
        "instruction": "Detail Question: How does hydro-electricity generate power?",
        "audioTranscript": "Teacher: Rushing water flowing down through dam pipes turns heavy spinning turbines, creating clean electricity without burning coal.",
        "questionText": "What powers a hydroelectric power station?",
        "options": [
          "Rushing water flowing down through turbine pipes",
          "Burning dry firewood in a fireplace",
          "Heating petroleum in large iron drums",
          "Blowing air with hand-held hair dryers"
        ],
        "correctAnswer": "Rushing water flowing down through turbine pipes"
      },
      {
        "id": "q_cam_f1_s1",
        "section": "Speaking",
        "subject": "Renewable Energy & Solar Power Innovations",
        "instruction": "Speaking Task: Talk for 45 seconds about saving electricity at home.",
        "questionText": "What are three easy ways people can save electricity at home?",
        "modelAnswer": "We can turn off lights when leaving rooms, unplug phone chargers when not in use, and open curtains to let natural sunlight illuminate our desks."
      },
      {
        "id": "q_cam_f1_s2",
        "section": "Speaking",
        "subject": "Renewable Energy & Solar Power Innovations",
        "instruction": "Speaking Task: Explain why clean energy is good for our planet.",
        "questionText": "Why should towns replace old coal power stations with solar energy?",
        "modelAnswer": "Solar energy creates zero greenhouse gases and keeps our air clean and healthy to breathe, helping reduce climate warming and protecting nature."
      },
      {
        "id": "q_cam_f1_w1",
        "section": "Writing",
        "subject": "Renewable Energy & Solar Power Innovations",
        "instruction": "Email Writing: Write an email to your classmate about building a toy solar car.",
        "questionText": "Write a short email telling your friend about your science project:",
        "modelAnswer": "Hi Liam, I finished building my model solar car for science class! When I placed it on the sunny sidewalk outside, the tiny motor spun fast and the car zoomed forward. See you tomorrow at school!"
      },
      {
        "id": "q_cam_f1_w2",
        "section": "Writing",
        "subject": "Renewable Energy & Solar Power Innovations",
        "instruction": "Short Story: Write 3-4 sentences describing a sunny solar-powered town.",
        "questionText": "Describe a town where all homes have blue solar roofs:",
        "modelAnswer": "In our town, almost every house has shiny blue solar panels on its roof. The air smells fresh because electric buses drive quietly through town, powered entirely by sunshine."
      }
    ]
  },
  {
    "id": "mock_ielts_foundation_01",
    "exam": "IELTS",
    "title": "IELTS Academic Foundation Diagnostic #01",
    "difficulty": "Foundation",
    "subject": "Astrophysics & Exoplanetary Spectroscopy",
    "totalDurationMin": 45,
    "targetBandRequirement": "Band 5.5-6.0 (Foundation Academic)",
    "sections": [
      {
        "id": "sec_ielts_f_read",
        "name": "Reading",
        "durationMinutes": 15,
        "questionsCount": 3,
        "samplePrompt": "Discovering Distant Planets via Light Dips",
        "rubric": [
          {
            "criteria": "Reading Comprehension",
            "weight": "60%",
            "description": "Comprehension"
          },
          {
            "criteria": "Vocabulary",
            "weight": "40%",
            "description": "Vocabulary"
          }
        ]
      },
      {
        "id": "sec_ielts_f_lis",
        "name": "Listening",
        "durationMinutes": 15,
        "questionsCount": 3,
        "samplePrompt": "Observatory Field Trip Audio Lecture",
        "rubric": [
          {
            "criteria": "Acoustic Detail",
            "weight": "50%",
            "description": "Details"
          },
          {
            "criteria": "Spelling",
            "weight": "50%",
            "description": "Spelling"
          }
        ]
      },
      {
        "id": "sec_ielts_f_spk",
        "name": "Speaking",
        "durationMinutes": 8,
        "questionsCount": 2,
        "samplePrompt": "Speaking Part 2: Describing a Night Sky Experience",
        "rubric": [
          {
            "criteria": "Fluency",
            "weight": "50%",
            "description": "Fluency"
          },
          {
            "criteria": "Vocabulary",
            "weight": "50%",
            "description": "Lexicon"
          }
        ]
      },
      {
        "id": "sec_ielts_f_wri",
        "name": "Writing",
        "durationMinutes": 7,
        "questionsCount": 2,
        "samplePrompt": "Task 1 Graph Description on Discovered Exoplanets",
        "rubric": [
          {
            "criteria": "Data Reporting",
            "weight": "50%",
            "description": "Reporting"
          },
          {
            "criteria": "Grammar",
            "weight": "50%",
            "description": "Grammar"
          }
        ]
      }
    ],
    "questions": [
      {
        "id": "q_ielts_f_r1",
        "section": "Reading",
        "subject": "Astrophysics & Exoplanetary Spectroscopy",
        "instruction": "Reading Comprehension: Select the correct scientific method.",
        "passage": "When an exoplanet passes directly in front of its parent star, it blocks a tiny fraction of stellar light. By measuring this periodic dimming—known as the transit method—astronomers deduce the planets diameter and orbital velocity.",
        "questionText": "What observable event occurs during an exoplanet transit?",
        "options": [
          "The parent star appears slightly dimmer as the planet passes across its disk",
          "The parent star changes color from yellow to neon green",
          "The planet collides with the telescope mirror",
          "The telescope begins spinning backward on its mount"
        ],
        "correctAnswer": "The parent star appears slightly dimmer as the planet passes across its disk"
      },
      {
        "id": "q_ielts_f_r2",
        "section": "Reading",
        "subject": "Astrophysics & Exoplanetary Spectroscopy",
        "instruction": "Vocabulary in Context: What is the habitable Goldilocks zone?",
        "passage": "The habitable zone is the orbital band around a star where surface temperatures permit liquid water to pool on a rocky planets surface without boiling into vapor or freezing into solid ice.",
        "questionText": "The term \"habitable zone\" refers to:",
        "options": [
          "The orbital distance where liquid water can stably exist on a planets surface",
          "The inside of an astronauts sleeping bag on a space station",
          "The core of a red supergiant star undergoing fusion",
          "A spacecraft hangar located at an international airport"
        ],
        "correctAnswer": "The orbital distance where liquid water can stably exist on a planets surface"
      },
      {
        "id": "q_ielts_f_r3",
        "section": "Reading",
        "subject": "Astrophysics & Exoplanetary Spectroscopy",
        "instruction": "Inference: How do astronomers detect water vapor in alien atmospheres?",
        "passage": "As starlight filters through an exoplanets upper atmosphere during transit, chemical molecules absorb specific wavelengths of light. Transmission spectroscopy reveals dark absorption lines characteristic of water vapor and methane.",
        "questionText": "How does transmission spectroscopy reveal atmospheric gases?",
        "options": [
          "By identifying specific dark wavelength absorption lines in filtered starlight",
          "By catching gas samples in physical glass jars brought back to Earth",
          "By sending radio telegrams to aliens asking for weather reports",
          "By measuring how loud the planet sounds on audio receivers"
        ],
        "correctAnswer": "By identifying specific dark wavelength absorption lines in filtered starlight"
      },
      {
        "id": "q_ielts_f_l1",
        "section": "Listening",
        "subject": "Astrophysics & Exoplanetary Spectroscopy",
        "instruction": "Listen to an observatory tour guide and answer the question.",
        "audioTranscript": "Astronomer: The James Webb Space Telescope orbits nearly one million miles from Earth at the second Lagrange point, shielded from solar heat by a five-layer tennis-court-sized sunshield.",
        "questionText": "Where does the James Webb Space Telescope operate?",
        "options": [
          "At Lagrange Point 2, approximately one million miles from Earth",
          "Directly in low Earth orbit next to weather satellites",
          "Anchored on the top of Mount Everest",
          "Submerged beneath the Pacific Ocean"
        ],
        "correctAnswer": "At Lagrange Point 2, approximately one million miles from Earth"
      },
      {
        "id": "q_ielts_f_l2",
        "section": "Listening",
        "subject": "Astrophysics & Exoplanetary Spectroscopy",
        "instruction": "Detail Question: Why does the space telescope observe in infrared light?",
        "audioTranscript": "Astronomer: Infrared wavelengths penetrate cosmic dust clouds and capture light from the earliest galaxies formed thirteen billion years ago, which has redshifted due to the expansion of the universe.",
        "questionText": "What is the primary advantage of infrared astronomy?",
        "options": [
          "It penetrates cosmic dust and captures redshifted light from ancient galaxies",
          "It allows telescopes to take photos underwater during rainstorms",
          "It consumes zero electricity to operate telescope computers",
          "It prevents optical lenses from needing glass cleaning"
        ],
        "correctAnswer": "It penetrates cosmic dust and captures redshifted light from ancient galaxies"
      },
      {
        "id": "q_ielts_f_l3",
        "section": "Listening",
        "subject": "Astrophysics & Exoplanetary Spectroscopy",
        "instruction": "Speaker Stance: What does the astronomer say about gas giant planets?",
        "audioTranscript": "Astronomer: Hot Jupiters are massive gas giants that orbit astonishingly close to their stars, completing a full year in as little as two Earth days.",
        "questionText": "What distinguishes \"Hot Jupiter\" exoplanets?",
        "options": [
          "They are massive gas giants orbiting extremely close to their parent stars",
          "They are tiny ice cubes floating near distant comets",
          "They have solid steel surfaces covered with diamond cities",
          "They never orbit any stars and drift completely alone"
        ],
        "correctAnswer": "They are massive gas giants orbiting extremely close to their parent stars"
      },
      {
        "id": "q_ielts_f_s1",
        "section": "Speaking",
        "subject": "Astrophysics & Exoplanetary Spectroscopy",
        "instruction": "Speaking Part 2: Describe an astronomical observation experience.",
        "questionText": "Describe a time you looked at the stars through a telescope or viewed the night sky.",
        "modelAnswer": "Last summer I visited an observatory in the mountains away from city light pollution. Looking through a large telescope, I clearly saw the rings of Saturn and the four bright Galilean moons orbiting Jupiter."
      },
      {
        "id": "q_ielts_f_s2",
        "section": "Speaking",
        "subject": "Astrophysics & Exoplanetary Spectroscopy",
        "instruction": "Speaking Part 3: Discuss the value of space exploration.",
        "questionText": "Why is it important for humanity to explore outer space?",
        "modelAnswer": "Space exploration drives cutting-edge engineering innovations—like advanced sensors and solar cells—while helping answer fundamental questions about the origin of our universe and the possibility of extraterrestrial life."
      },
      {
        "id": "q_ielts_f_w1",
        "section": "Writing",
        "subject": "Astrophysics & Exoplanetary Spectroscopy",
        "instruction": "Task 1 Summary: Describe a chart showing exoplanet discovery numbers.",
        "questionText": "Summarize trends in exoplanet discoveries from the Kepler and TESS missions:",
        "modelAnswer": "The bar chart illustrates a dramatic exponential rise in confirmed exoplanet discoveries between 2009 and 2026, accelerating following the deployment of space transit telescopes like Kepler and TESS."
      },
      {
        "id": "q_ielts_f_w2",
        "section": "Writing",
        "subject": "Astrophysics & Exoplanetary Spectroscopy",
        "instruction": "Task 2 Essay: Discuss the debate between robotic probes and crewed space missions.",
        "questionText": "Should governments allocate more funding to robotic space telescopes or human spaceflights?",
        "modelAnswer": "Robotic telescopes provide vastly greater scientific returns per dollar because they operate continuously without life-support overhead. However, human spaceflights inspire international cooperation and technological ambition that robotic probes cannot fully replicate."
      }
    ]
  },
  {
    "id": "mock_toefl_foundation_01",
    "exam": "TOEFL",
    "title": "TOEFL Junior & Academic Foundation #01",
    "difficulty": "Foundation",
    "subject": "Geophysics & Plate Tectonics Dynamics",
    "totalDurationMin": 40,
    "targetBandRequirement": "750+ (TOEFL Junior / CEFR B1)",
    "sections": [
      {
        "id": "sec_toefl_f_r",
        "name": "Reading",
        "durationMinutes": 15,
        "questionsCount": 3,
        "samplePrompt": "Continental Drift & Volcanoes",
        "rubric": [
          {
            "criteria": "Reading Comprehension",
            "weight": "60%",
            "description": "Comprehension"
          },
          {
            "criteria": "Vocabulary",
            "weight": "40%",
            "description": "Vocabulary"
          }
        ]
      },
      {
        "id": "sec_toefl_f_l",
        "name": "Listening",
        "durationMinutes": 10,
        "questionsCount": 3,
        "samplePrompt": "Earth Science Class on Earthquake Waves",
        "rubric": [
          {
            "criteria": "Listening Comprehension",
            "weight": "60%",
            "description": "Comprehension"
          },
          {
            "criteria": "Details",
            "weight": "40%",
            "description": "Details"
          }
        ]
      },
      {
        "id": "sec_toefl_f_s",
        "name": "Speaking",
        "durationMinutes": 8,
        "questionsCount": 2,
        "samplePrompt": "Explain How Mountain Ranges Form",
        "rubric": [
          {
            "criteria": "Fluency",
            "weight": "50%",
            "description": "Fluency"
          },
          {
            "criteria": "Explanation",
            "weight": "50%",
            "description": "Clarity"
          }
        ]
      },
      {
        "id": "sec_toefl_f_w",
        "name": "Writing",
        "durationMinutes": 7,
        "questionsCount": 2,
        "samplePrompt": "Short Synthesis: Oceanic Trenches vs Mid-Ocean Ridges",
        "rubric": [
          {
            "criteria": "Synthesis",
            "weight": "50%",
            "description": "Synthesis"
          },
          {
            "criteria": "Accuracy",
            "weight": "50%",
            "description": "Grammar"
          }
        ]
      }
    ],
    "questions": [
      {
        "id": "q_toefl_f_r1",
        "section": "Reading",
        "subject": "Geophysics & Plate Tectonics Dynamics",
        "instruction": "Reading Comprehension: Select the correct geological statement.",
        "passage": "Earths outer crust is fractured into rigid tectonic plates that float on the hotter, semi-fluid asthenosphere below. Thermal convection currents in the mantle slowly propel these plates across the globe at rates of several centimeters per year.",
        "questionText": "What force drives the movement of Earths tectonic plates?",
        "options": [
          "Thermal convection currents churning in the underlying mantle",
          "Heavy ocean waves splashing against rocky beaches",
          "High winds blowing across desert sand dunes",
          "The gravitational pull of passing artificial satellites"
        ],
        "correctAnswer": "Thermal convection currents churning in the underlying mantle"
      },
      {
        "id": "q_toefl_f_r2",
        "section": "Reading",
        "subject": "Geophysics & Plate Tectonics Dynamics",
        "instruction": "Vocabulary in Context: What is a subduction zone?",
        "passage": "At convergent plate boundaries, a denser oceanic plate slides beneath a lighter continental plate in a subduction zone, sinking into the mantle where melting rock triggers volcanic island arcs and deep ocean trenches.",
        "questionText": "What happens at a tectonic subduction zone?",
        "options": [
          "A denser oceanic plate plunges beneath a lighter continental plate into the mantle",
          "Two plates fly apart into outer space",
          "The ocean completely dries up and turns into glass",
          "Plates freeze permanently into solid iron blocks"
        ],
        "correctAnswer": "A denser oceanic plate plunges beneath a lighter continental plate into the mantle"
      },
      {
        "id": "q_toefl_f_r3",
        "section": "Reading",
        "subject": "Geophysics & Plate Tectonics Dynamics",
        "instruction": "Fact Retrieval: What proof supported Alfred Wegeners continental drift theory?",
        "passage": "Alfred Wegener observed that identical fossil remains of the freshwater reptile Mesosaurus were discovered along matching coastlines of both South America and southern Africa, proving the continents were once joined in the supercontinent Pangea.",
        "questionText": "What evidence helped substantiate the supercontinent Pangea?",
        "options": [
          "Identical fossil remains found on coastlines on opposite sides of the Atlantic",
          "Modern plastic bottles floating across the equator",
          "Photographs taken by 19th century digital drones",
          "Ancient printed newspapers written in English"
        ],
        "correctAnswer": "Identical fossil remains found on coastlines on opposite sides of the Atlantic"
      },
      {
        "id": "q_toefl_f_l1",
        "section": "Listening",
        "subject": "Geophysics & Plate Tectonics Dynamics",
        "instruction": "Listen to a geology teacher and answer the question.",
        "audioTranscript": "Teacher: When tectonic plates grind past each other at strike-slip boundaries like the San Andreas Fault, friction locks the rock until elastic strain suddenly snaps, releasing kinetic energy as seismic earthquake waves.",
        "questionText": "What causes the sudden release of seismic energy during an earthquake?",
        "options": [
          "Friction-locked rock suddenly snapping along a fault line",
          "Ocean tides rising two inches along coastal piers",
          "A heavy thunderstorm dropping hail on rooftops",
          "Traffic congestion on multi-lane interstate highways"
        ],
        "correctAnswer": "Friction-locked rock suddenly snapping along a fault line"
      },
      {
        "id": "q_toefl_f_l2",
        "section": "Listening",
        "subject": "Geophysics & Plate Tectonics Dynamics",
        "instruction": "Detail Question: Which seismic waves arrive first at recording stations?",
        "audioTranscript": "Teacher: Primary or P-waves are compressional waves that travel fastest through rock, arriving first at seismographs, followed by slower transverse secondary S-waves.",
        "questionText": "Which seismic waves register first on a seismograph instrument?",
        "options": [
          "Compressional P-waves that travel fastest through solid rock",
          "Slow surface ocean waves created by boats",
          "High-frequency musical sound waves from radios",
          "Light rays from the sun striking the ground"
        ],
        "correctAnswer": "Compressional P-waves that travel fastest through solid rock"
      },
      {
        "id": "q_toefl_f_l3",
        "section": "Listening",
        "subject": "Geophysics & Plate Tectonics Dynamics",
        "instruction": "Lecture Synthesis: Where do most active volcanoes on Earth occur?",
        "audioTranscript": "Teacher: The Pacific Ring of Fire contains over seventy-five percent of the worlds active volcanoes because it is encircled by subduction zones where oceanic plates plunge into the mantle.",
        "questionText": "Why does the Pacific Ring of Fire experience so many volcanic eruptions?",
        "options": [
          "It is surrounded by subduction zones where plunging plates melt into magma",
          "It receives more direct tropical sunshine than anywhere else",
          "Deep-sea oil drilling has punctured the Earths core",
          "The water in the Pacific ocean is too cold to put out fires"
        ],
        "correctAnswer": "It is surrounded by subduction zones where plunging plates melt into magma"
      },
      {
        "id": "q_toefl_f_s1",
        "section": "Speaking",
        "subject": "Geophysics & Plate Tectonics Dynamics",
        "instruction": "Speaking Task: Explain how the Himalayan mountains formed.",
        "questionText": "Describe what happens when two continental landmasses collide at a convergent boundary.",
        "modelAnswer": "When the Indian continental plate collided with the Eurasian plate fifty million years ago, neither plate could sink because both were buoyant. The intense collision crumpled and uplifted rock layers, creating the soaring peaks of the Himalayas."
      },
      {
        "id": "q_toefl_f_s2",
        "section": "Speaking",
        "subject": "Geophysics & Plate Tectonics Dynamics",
        "instruction": "Speaking Task: Describe earthquake-resistant building design.",
        "questionText": "Explain how modern skyscrapers in earthquake zones are engineered to resist shaking.",
        "modelAnswer": "Engineers install flexible base isolators made of rubber and steel underneath foundations to decouple buildings from ground shaking, alongside heavy tuned mass dampers on high floors that sway opposite to seismic vibrations."
      },
      {
        "id": "q_toefl_f_w1",
        "section": "Writing",
        "subject": "Geophysics & Plate Tectonics Dynamics",
        "instruction": "Short Paragraph: Synthesize reading and lecture on mid-ocean ridges.",
        "questionText": "Explain how seafloor spreading at divergent boundaries creates new oceanic crust:",
        "modelAnswer": "At divergent boundaries like the Mid-Atlantic Ridge, tectonic plates pull apart. Upwelling basaltic magma wells up into the rift valley, cools against frigid ocean water, and solidifies into fresh oceanic crust."
      },
      {
        "id": "q_toefl_f_w2",
        "section": "Writing",
        "subject": "Geophysics & Plate Tectonics Dynamics",
        "instruction": "Short Paragraph: Contrast shield volcanoes and stratovolcanoes.",
        "questionText": "Describe how magma viscosity determines whether a volcano is gently sloping or explosive:",
        "modelAnswer": "Shield volcanoes erupt runny, low-viscosity basaltic lava that flows long distances, building broad gentle domes like Mauna Loa. In contrast, stratovolcanoes trap sticky, gas-rich silica magma, leading to catastrophic explosive eruptions like Mount St. Helens."
      }
    ]
  },
  {
    "id": "mock_pte_foundation_01",
    "exam": "PTE",
    "title": "PTE Academic Foundation Starter #01",
    "difficulty": "Foundation",
    "subject": "Molecular Biotechnology & Genetic Engineering",
    "totalDurationMin": 40,
    "targetBandRequirement": "PTE 50+ (Foundation Academic)",
    "sections": [
      {
        "id": "sec_pte_f_spk",
        "name": "Speaking",
        "durationMinutes": 10,
        "questionsCount": 2,
        "samplePrompt": "Read Aloud: DNA & Molecular Biology",
        "rubric": [
          {
            "criteria": "Fluency",
            "weight": "50%",
            "description": "Fluency"
          },
          {
            "criteria": "Pronunciation",
            "weight": "50%",
            "description": "Pronunciation"
          }
        ]
      },
      {
        "id": "sec_pte_f_wri",
        "name": "Writing",
        "durationMinutes": 10,
        "questionsCount": 2,
        "samplePrompt": "Summarize Text on Gene Editing",
        "rubric": [
          {
            "criteria": "Form",
            "weight": "50%",
            "description": "Sentence form"
          },
          {
            "criteria": "Grammar",
            "weight": "50%",
            "description": "Grammar"
          }
        ]
      },
      {
        "id": "sec_pte_f_read",
        "name": "Reading",
        "durationMinutes": 10,
        "questionsCount": 3,
        "samplePrompt": "Fill in the Blanks: Biotechnology",
        "rubric": [
          {
            "criteria": "Collocation",
            "weight": "50%",
            "description": "Collocation"
          },
          {
            "criteria": "Vocabulary",
            "weight": "50%",
            "description": "Vocabulary"
          }
        ]
      },
      {
        "id": "sec_pte_f_lis",
        "name": "Listening",
        "durationMinutes": 10,
        "questionsCount": 3,
        "samplePrompt": "Write from Dictation on Cell Biology",
        "rubric": [
          {
            "criteria": "Spelling",
            "weight": "50%",
            "description": "Spelling"
          },
          {
            "criteria": "Accuracy",
            "weight": "50%",
            "description": "Accuracy"
          }
        ]
      }
    ],
    "questions": [
      {
        "id": "q_pte_f_spk1",
        "section": "Speaking",
        "subject": "Molecular Biotechnology & Genetic Engineering",
        "instruction": "Read Aloud: Speak clearly into your microphone within 35 seconds.",
        "questionText": "CRISPR-Cas9 operates as molecular scissors, utilizing guide RNA sequences to identify and splice specific target DNA sequences with unprecedented precision.",
        "correctAnswer": "CRISPR-Cas9 operates as molecular scissors, utilizing guide RNA sequences to identify and splice specific target DNA sequences with unprecedented precision."
      },
      {
        "id": "q_pte_f_spk2",
        "section": "Speaking",
        "subject": "Molecular Biotechnology & Genetic Engineering",
        "instruction": "Re-tell Lecture: Summarize recombinant DNA technology in 40 seconds.",
        "questionText": "Re-tell the audio lecture on how bacterial plasmids are used to synthesize human insulin.",
        "modelAnswer": "The speaker explained that scientists insert the human insulin gene into circular bacterial plasmids, transforming E. coli bacteria into microscopic biological factories that produce affordable medical insulin."
      },
      {
        "id": "q_pte_f_wri1",
        "section": "Writing",
        "subject": "Molecular Biotechnology & Genetic Engineering",
        "instruction": "Summarize Written Text: Summarize in one single complete sentence.",
        "passage": "Golden rice was bioengineered to synthesize beta-carotene, a biochemical precursor to vitamin A, in edible rice grains. Designed to combat severe childhood blindness and dietary malnutrition in developing agrarian economies, this transgenic crop demonstrates the humanitarian potential of agricultural biotechnology.",
        "questionText": "Summarize the passage in one single sentence of 5-75 words:",
        "modelAnswer": "Bioengineered to produce beta-carotene in edible grains, Golden Rice provides a vital agricultural solution to childhood vitamin A deficiency and malnutrition in developing nations."
      },
      {
        "id": "q_pte_f_wri2",
        "section": "Writing",
        "subject": "Molecular Biotechnology & Genetic Engineering",
        "instruction": "Write Essay: In 150-200 words, discuss the advantages of biofortified agricultural crops.",
        "questionText": "How can genetic engineering help agricultural crops withstand worsening global droughts?",
        "modelAnswer": "By isolating drought-tolerant genes from desert plants and transferring them into staple grains like wheat and maize, geneticists create crops that require significantly less irrigation, securing global food supplies amid volatile climate shifts."
      },
      {
        "id": "q_pte_f_read1",
        "section": "Reading",
        "subject": "Molecular Biotechnology & Genetic Engineering",
        "instruction": "Fill in the blanks: Choose the word that best completes the sentence.",
        "questionText": "The polymerase chain reaction enables researchers to _____ billions of exact copies of a target DNA sequence within hours.",
        "options": [
          "amplify",
          "destroy",
          "postpone",
          "forget"
        ],
        "correctAnswer": "amplify"
      },
      {
        "id": "q_pte_f_read2",
        "section": "Reading",
        "subject": "Molecular Biotechnology & Genetic Engineering",
        "instruction": "Multiple Choice: What role do restriction enzymes play in molecular cloning?",
        "passage": "Restriction endonucleases recognize specific palindromic nucleotide sequences, cleaving DNA strands to produce sticky ends that allow foreign genetic fragments to be annealed using DNA ligase.",
        "questionText": "What is the biological function of restriction endonucleases?",
        "options": [
          "Cleaving DNA strands at specific palindromic sequences for gene splicing",
          "Freezing blood cells into solid glass cubes",
          "Translating human speech into digital computer audio",
          "Stopping all chemical reactions permanently inside cells"
        ],
        "correctAnswer": "Cleaving DNA strands at specific palindromic sequences for gene splicing"
      },
      {
        "id": "q_pte_f_read3",
        "section": "Reading",
        "subject": "Molecular Biotechnology & Genetic Engineering",
        "instruction": "Vocabulary: What is a transgenic organism?",
        "passage": "A transgenic organism is any biological organism whose genetic genome has been modified by the introduction of foreign DNA sequences derived from another distinct species.",
        "questionText": "A transgenic organism is defined as:",
        "options": [
          "An organism that contains functional genetic material introduced from another species",
          "An organism made entirely out of synthetic plastic fibers",
          "A fossilized stone tool discovered in an ancient cave",
          "A computer algorithm trained to draw pictures"
        ],
        "correctAnswer": "An organism that contains functional genetic material introduced from another species"
      },
      {
        "id": "q_pte_f_lis1",
        "section": "Listening",
        "subject": "Molecular Biotechnology & Genetic Engineering",
        "instruction": "Write from Dictation: Type the exact biology sentence as spoken.",
        "audioTranscript": "Synthetic biology redesigns existing cellular pathways to manufacture sustainable therapeutic proteins.",
        "questionText": "Listen and type the sentence:",
        "correctAnswer": "Synthetic biology redesigns existing cellular pathways to manufacture sustainable therapeutic proteins."
      },
      {
        "id": "q_pte_f_lis2",
        "section": "Listening",
        "subject": "Molecular Biotechnology & Genetic Engineering",
        "instruction": "Summarize Spoken Text: In 50-70 words, summarize mRNA vaccine delivery.",
        "audioTranscript": "Scientist: Messenger RNA vaccines encapsulate synthetic genetic instructions inside lipid nanoparticles. When injected, host cells translate the mRNA into harmless viral spike proteins, training the immune system to produce neutralizing antibodies without introducing live viral agents.",
        "questionText": "Summarize how mRNA vaccines teach the immune system:",
        "modelAnswer": "Encapsulated inside protective lipid nanoparticles, mRNA vaccines instruct host cells to produce harmless viral spike proteins, prompting the immune system to build durable neutralizing antibodies without exposing patients to live viruses."
      },
      {
        "id": "q_pte_f_lis3",
        "section": "Listening",
        "subject": "Molecular Biotechnology & Genetic Engineering",
        "instruction": "Multiple Choice: What protects synthetic mRNA from degrading in the bloodstream?",
        "audioTranscript": "Scientist: Because naked RNA enzymes would be rapidly destroyed by blood ribonucleases, vaccines employ microscopic lipid nanoparticles that shield the delicate mRNA until it enters the cellular cytoplasm.",
        "questionText": "What vehicle shields delicate mRNA molecules from enzymatic destruction in the blood?",
        "options": [
          "Microscopic protective lipid nanoparticles",
          "Solid copper metal tubes",
          "Thick layers of ordinary motor oil",
          "Cold water ice crystals"
        ],
        "correctAnswer": "Microscopic protective lipid nanoparticles"
      }
    ]
  }
];
