/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Multi-Exam Mock Test Repository for EduBridge
 * Includes authentic, standardized practice tests in:
 * - PTE Academic (Pearson Test of English)
 * - TOEFL iBT (Test of English as a Foreign Language)
 * - OET (Occupational English Test - Healthcare / Medicine & Nursing)
 * - DET (Duolingo English Test)
 * - Cambridge English (C1 Advanced / C2 Proficiency)
 */

import { MockTest } from '../types';

export const multiExamMockTests: MockTest[] = [
  // ==========================================
  // 1. PTE ACADEMIC TESTS
  // ==========================================
  {
    id: 'mock_pte_02',
    exam: 'PTE',
    title: 'PTE Academic Comprehensive Simulation #23',
    difficulty: 'Advanced',
    totalDurationMin: 50,
    targetBandRequirement: '79+ (Equivalent to IELTS 8.0)',
    sections: [
      {
        id: 'sec_pte_spk_23',
        name: 'Speaking',
        durationMinutes: 15,
        questionsCount: 2,
        samplePrompt: 'Read Aloud & Re-tell Academic Lecture',
        rubric: [
          { criteria: 'Oral Fluency', weight: '40%', description: 'Smooth rhythm, natural phrasing, zero false starts' },
          { criteria: 'Pronunciation', weight: '40%', description: 'Vowel clarity, proper word stress, and intelligibility' },
          { criteria: 'Content', weight: '20%', description: 'Accurate delivery of all key scientific keywords' }
        ]
      },
      {
        id: 'sec_pte_wri_23',
        name: 'Writing',
        durationMinutes: 20,
        questionsCount: 1,
        samplePrompt: 'Summarize Written Text (Single Sentence Formulation)',
        rubric: [
          { criteria: 'Form', weight: '25%', description: 'Strictly one complete grammatical sentence between 5 and 75 words' },
          { criteria: 'Grammar', weight: '25%', description: 'Correct subordinate clause coordination' },
          { criteria: 'Vocabulary', weight: '25%', description: 'Accurate academic lexical choice' },
          { criteria: 'Content', weight: '25%', description: 'Synthesis of main thesis and supporting condition' }
        ]
      },
      {
        id: 'sec_pte_read_23',
        name: 'Reading',
        durationMinutes: 15,
        questionsCount: 2,
        samplePrompt: 'Reading & Writing Fill in the Blanks',
        rubric: [
          { criteria: 'Collocation Accuracy', weight: '50%', description: 'Native academic pairing of adjectives and prepositions' },
          { criteria: 'Syntactic Context', weight: '50%', description: 'Morphological agreement with tense and subject' }
        ]
      },
      {
        id: 'sec_pte_lis_23',
        name: 'Listening',
        durationMinutes: 15,
        questionsCount: 2,
        samplePrompt: 'Write From Dictation & Highlight Incorrect Words',
        rubric: [
          { criteria: 'Spelling Precision', weight: '50%', description: 'Correct English spelling with exact inflectional suffixes' },
          { criteria: 'Acoustic Retention', weight: '50%', description: 'Verbatim reproduction of spoken phrase' }
        ]
      }
    ],
    questions: [
      {
        id: 'q_pte_spk_23_1',
        section: 'Speaking',
        instruction: 'Read Aloud: You have 35 seconds to read the text aloud clearly into your microphone.',
        questionText: 'Metabolic adaptation in high-altitude organisms requires both enhanced pulmonary vascular elasticity and genetic up-regulation of hemoglobin oxygen affinity, counteracting severe ambient hypoxia.',
        correctAnswer: 'Metabolic adaptation in high-altitude organisms requires both enhanced pulmonary vascular elasticity and genetic up-regulation of hemoglobin oxygen affinity, counteracting severe ambient hypoxia.'
      },
      {
        id: 'q_pte_wri_23_1',
        section: 'Writing',
        instruction: 'Summarize Written Text: Read the passage below and summarize it in ONE single sentence of 5-75 words.',
        passage: 'Recent neuroimaging trials have established that adult neuroplasticity is stimulated most effectively not through passive consumption of educational materials, but through deliberate retrieval practice coupled with spaced repetition. While traditional pedagogy has prioritized lecture attendance and textbook highlighting, empirical cognitive experiments show that testing oneself forces the synaptic remodeling necessary to consolidate short-term working memory into long-term declarative knowledge.',
        questionText: 'Summarize the passage in a single complete sentence:',
        modelAnswer: 'Although traditional education often emphasizes passive review, empirical research proves that deliberate retrieval and spaced testing stimulate adult neuroplasticity more effectively by promoting the synaptic remodeling required for long-term knowledge retention.'
      },
      {
        id: 'q_pte_read_23_1',
        section: 'Reading',
        instruction: 'Fill in the blanks: Choose the word that best completes the academic sentence.',
        questionText: 'The transition toward clean energy requires researchers to _____ deep-seated technical bottlenecks in battery chemistry.',
        options: ['ameliorate', 'overcome', 'dissipate', 'postpone'],
        correctAnswer: 'overcome'
      },
      {
        id: 'q_pte_lis_23_1',
        section: 'Listening',
        instruction: 'Write from Dictation: Type the exact lecture sentence as dictated.',
        audioTranscript: 'Empirical methodologies substantiate the reproducibility of all modern cognitive interventions.',
        questionText: 'Listen to the audio clip and type the exact sentence:',
        correctAnswer: 'Empirical methodologies substantiate the reproducibility of all modern cognitive interventions.'
      }
    ]
  },

  // ==========================================
  // 2. TOEFL iBT TESTS
  // ==========================================
  {
    id: 'mock_toefl_01',
    exam: 'TOEFL',
    title: 'TOEFL iBT Academic Full Simulation #88',
    difficulty: 'Standard',
    totalDurationMin: 116,
    targetBandRequirement: '100+ / 120 (Top University Benchmark)',
    sections: [
      {
        id: 'sec_toefl_read_88',
        name: 'Reading',
        durationMinutes: 35,
        questionsCount: 2,
        samplePrompt: 'Academic Passage on Hydrothermal Astrobiology on Enceladus',
        rubric: [
          { criteria: 'Factual Understanding', weight: '30%', description: 'Direct text identification without speculation' },
          { criteria: 'Inference & Purpose', weight: '40%', description: 'Deducing author intent and underlying logical implications' },
          { criteria: 'Vocabulary in Context', weight: '30%', description: 'Precise lexical meaning in specialized scientific discourse' }
        ]
      },
      {
        id: 'sec_toefl_lis_88',
        name: 'Listening',
        durationMinutes: 36,
        questionsCount: 2,
        samplePrompt: 'Campus Academic Lecture on Behavioral Economics & Nudge Theory',
        rubric: [
          { criteria: 'Main Idea Synthesis', weight: '40%', description: 'Identifying core lecture thesis and professorial stance' },
          { criteria: 'Detail Tracking', weight: '30%', description: 'Connecting experimental data to behavioral models' },
          { criteria: 'Pragmatic Understanding', weight: '30%', description: 'Recognizing speaker tone, skepticism, and humor' }
        ]
      },
      {
        id: 'sec_toefl_spk_88',
        name: 'Speaking',
        durationMinutes: 16,
        questionsCount: 2,
        samplePrompt: 'Integrated Campus Policy & Academic Synthesis',
        rubric: [
          { criteria: 'Delivery', weight: '35%', description: 'Pacing, clarity, natural intonation without long hesitations' },
          { criteria: 'Language Use', weight: '35%', description: 'Accurate complex grammar and diverse lexical collocations' },
          { criteria: 'Topic Development', weight: '30%', description: 'Coherent synthesis connecting reading announcement to student dialogue' }
        ]
      },
      {
        id: 'sec_toefl_wri_88',
        name: 'Writing',
        durationMinutes: 29,
        questionsCount: 1,
        samplePrompt: 'Writing for an Academic Discussion (Classroom Online Forum)',
        rubric: [
          { criteria: 'Relevance & Contribution', weight: '40%', description: 'Directly extends professor prompt and student debate' },
          { criteria: 'Syntactic Variety', weight: '30%', description: 'Range of complex structures with accurate mechanics' },
          { criteria: 'Lexical Precision', weight: '30%', description: 'High-level academic terminology and clear argumentation' }
        ]
      }
    ],
    questions: [
      {
        id: 'q_toefl_r1',
        section: 'Reading',
        instruction: 'Read the academic passage and answer the inference question.',
        passage: 'Data transmitted by the Cassini spacecraft revealed plumes of water vapor and organic macromolecules erupting from cryovolcanic fissures near the south pole of Saturn’s moon Enceladus. Chemical spectroscopy detected molecular hydrogen (H2), a byproduct typically generated when hydrothermal fluids interact with iron-rich silicate rocks at temperatures exceeding 90°C. In terrestrial ocean trenches, analogous alkaline hydrothermal systems support thriving communities of methanogenic and chemosynthetic microorganisms completely insulated from solar irradiance.',
        questionText: 'What can be inferred from the author’s discussion of molecular hydrogen (H2) on Enceladus?',
        options: [
          'Active hydrothermal geochemical reactions capable of supplying chemical energy for life exist beneath its icy crust',
          'Enceladus has an atmosphere thick enough to sustain terrestrial mammalian respiration',
          'The moon has experienced a complete breakdown of its planetary magnetic field',
          'Cassini was able to drill directly into the seafloor of the sub-surface ocean'
        ],
        correctAnswer: 'Active hydrothermal geochemical reactions capable of supplying chemical energy for life exist beneath its icy crust'
      },
      {
        id: 'q_toefl_l1',
        section: 'Listening',
        instruction: 'Listen to the excerpt from an economics lecture on Nudge Theory.',
        audioTranscript: 'Professor: When public policy relies solely on financial fines or legal mandates, compliance often triggers psychological reactance. Richard Thaler and Cass Sunstein introduced "nudge theory," arguing that subtle alterations in choice architecture—like setting default enrollment in retirement plans or placing nutritious produce at eye level—dramatically elevate positive outcomes without restricting individual autonomy.',
        questionText: 'According to the professor, what distinguishes a "nudge" from a traditional policy mandate?',
        options: [
          'It preserves individual freedom of choice while restructuring the decision environment',
          'It imposes heavy monetary penalties on uncooperative citizens',
          'It eliminates all alternative choices except the government-approved option',
          'It applies exclusively to private corporate investment banks'
        ],
        correctAnswer: 'It preserves individual freedom of choice while restructuring the decision environment'
      },
      {
        id: 'q_toefl_s1',
        section: 'Speaking',
        instruction: 'Read the campus announcement and summarize the student’s viewpoint.',
        passage: 'University Announcement: Starting next semester, the campus shuttle system will transition exclusively to demand-responsive on-demand vans booked via mobile app, replacing fixed 15-minute scheduled bus loops after 8:00 PM.',
        questionText: 'State the student’s opinion regarding the night shuttle change and explain the reasons she gives for her perspective.',
        modelAnswer: 'The student enthusiastically endorses the transition to on-demand evening shuttles. She explains that after 8:00 PM, fixed-route buses frequently run virtually empty, consuming excessive fuel while students studying late in science laboratories often wait over 25 minutes in cold weather. By summoning point-to-point transport directly to lab entrances, safety and energy efficiency are simultaneously optimized.'
      },
      {
        id: 'q_toefl_w1',
        section: 'Writing',
        instruction: 'Respond to the professor’s question in the academic discussion forum. Write at least 100 words.',
        questionText: 'Professor Miller: This week we are discussing environmental economics. Some economists argue that governments should mandate strict legal limits and bans on single-use plastics, while others advocate for economic incentives such as deposit-refund schemes and consumer subsidies for reusable alternatives. Which approach do you think is more effective, and why?',
        modelAnswer: 'In my view, economic incentive frameworks such as deposit-refund schemes and subsidies are vastly superior to outright regulatory prohibitions. While prohibitive bans frequently provoke public evasion and spur unregulated black-market alternatives, financial incentives directly align consumer self-interest with municipal ecological goals. When consumers receive tangible monetary rebates for returning recyclable containers, voluntary participation rates routinely exceed ninety percent, as demonstrated across Nordic circular economies. Furthermore, subsidies for sustainable packaging cultivate grassroots entrepreneurial innovation, whereas rigid bans often stifle emergent material sciences.'
      }
    ]
  },
  {
    id: 'mock_toefl_02',
    exam: 'TOEFL',
    title: 'TOEFL iBT Academic Simulation #89: Cognitive Sciences',
    difficulty: 'Advanced',
    totalDurationMin: 116,
    targetBandRequirement: '110+ / 120',
    sections: [
      {
        id: 'sec_toefl_r2',
        name: 'Reading',
        durationMinutes: 35,
        questionsCount: 2,
        samplePrompt: 'Linguistic Relativity & Spatial Cognition Across Cultures',
        rubric: [
          { criteria: 'Inference', weight: '50%', description: 'Connecting cultural syntax to spatial perception' },
          { criteria: 'Factual Extraction', weight: '50%', description: 'Accurate identification of experimental control data' }
        ]
      },
      {
        id: 'sec_toefl_w2',
        name: 'Writing',
        durationMinutes: 30,
        questionsCount: 1,
        samplePrompt: 'Academic Discussion: AI in Automated Judicial Sentencing',
        rubric: [
          { criteria: 'Argumentation', weight: '50%', description: 'Nuanced consideration of legal ethics and statistical parity' },
          { criteria: 'Lexical Sophistication', weight: '50%', description: 'High-level discourse connectors and academic precision' }
        ]
      }
    ],
    questions: [
      {
        id: 'q_toefl_r2_1',
        section: 'Reading',
        instruction: 'Read the excerpt on the Sapir-Whorf hypothesis and answer the question.',
        passage: 'Speakers of Guugu Yimithirr, an Australian Aboriginal language, do not use egocentric spatial coordinates such as "left," "right," "in front," or "behind." Instead, every spatial orientation is encoded with absolute cardinal directions: north, south, east, and west. Experiments confirm that even in pitch darkness or windowless chambers, Guugu Yimithirr speakers possess an acute, subconscious mental compass, demonstrating that linguistic structure shapes perceptual habituation.',
        questionText: 'According to the passage, why do Guugu Yimithirr speakers maintain spatial orientation even in windowless environments?',
        options: [
          'Their language mandates continuous cognitive tracking of absolute cardinal directions',
          'They possess genetically superior auditory receptors in the inner ear',
          'They avoid entering enclosed architectural structures',
          'They rely on handheld magnetic instruments'
        ],
        correctAnswer: 'Their language mandates continuous cognitive tracking of absolute cardinal directions'
      },
      {
        id: 'q_toefl_w2_1',
        section: 'Writing',
        instruction: 'Write an academic forum response (minimum 100 words).',
        questionText: 'Professor Diaz: Should judicial courts employ predictive artificial intelligence algorithms to calculate bail amounts and recidivism risks? Defend your position with specific reasoning.',
        modelAnswer: 'While proponents argue that predictive algorithms eliminate human judicial fatigue and emotional bias, I believe delegating sentencing recommendations to closed-source machine learning models undermines fundamental constitutional due process. Proprietary recidivism scoring models often ingest historical arrest data that reflects structural socio-economic disparities, thereby institutionalizing historical prejudice under the veneer of algorithmic objectivity. Without verifiable transparency into model weights and decision boundaries, defendants are deprived of their right to meaningfully challenge the evidence presented against them.'
      }
    ]
  },

  // ==========================================
  // 3. OET (OCCUPATIONAL ENGLISH TEST - HEALTHCARE)
  // ==========================================
  {
    id: 'mock_oet_01',
    exam: 'OET',
    title: 'OET Clinical Medicine & Nursing Practice Test #40',
    difficulty: 'Standard',
    totalDurationMin: 120,
    targetBandRequirement: 'Grade B+ (380+ / 500 for GMC / Nursing Registration)',
    sections: [
      {
        id: 'sec_oet_read_40',
        name: 'Reading',
        durationMinutes: 45,
        questionsCount: 2,
        samplePrompt: 'Clinical Protocol on Venous Thromboembolism (VTE) Prophylaxis',
        rubric: [
          { criteria: 'Rapid Fact Retrieval (Part A)', weight: '50%', description: 'Locating exact drug dosages and contraindications within 15 minutes' },
          { criteria: 'Clinical Interpretation (Part B & C)', weight: '50%', description: 'Understanding hospital infection control policies and clinical trial outcomes' }
        ]
      },
      {
        id: 'sec_oet_lis_40',
        name: 'Listening',
        durationMinutes: 40,
        questionsCount: 2,
        samplePrompt: 'Patient Consultation: Exertional Dyspnea & Diabetic Angina Triage',
        rubric: [
          { criteria: 'Symptom Identification', weight: '40%', description: 'Accurate logging of onset, duration, and precipitating factors' },
          { criteria: 'Pharmacological History', weight: '30%', description: 'Recording patient medication adherence and allergies' },
          { criteria: 'Differential Formulation', weight: '30%', description: 'Distinguishing cardiac ischemia from gastroesophageal reflux' }
        ]
      },
      {
        id: 'sec_oet_wri_40',
        name: 'Writing',
        durationMinutes: 45,
        questionsCount: 1,
        samplePrompt: 'Official Clinical Discharge & Referral Letter to Community Health Team',
        rubric: [
          { criteria: 'Purpose & Organization', weight: '25%', description: 'Immediately states patient handover purpose and required interventions' },
          { criteria: 'Content Selection', weight: '25%', description: 'Omits irrelevant past history and prioritizes post-operative needs' },
          { criteria: 'Clinical Register & Tone', weight: '25%', description: 'Professional medical communication adhering to NHS/OET conventions' },
          { criteria: 'Language & Grammar', weight: '25%', description: 'Error-free clinical syntax and accurate pharmacological nomenclature' }
        ]
      },
      {
        id: 'sec_oet_spk_40',
        name: 'Speaking',
        durationMinutes: 20,
        questionsCount: 1,
        samplePrompt: 'Clinical Consultation Roleplay: Patient Counseling on Type 2 Diabetes',
        rubric: [
          { criteria: 'Clinical Empathy', weight: '30%', description: 'Validating patient anxiety and active listening cues' },
          { criteria: 'Information Structuring', weight: '30%', description: 'Chunking complex pathophysiological details and checking understanding' },
          { criteria: 'Professional Fluency', weight: '40%', description: 'Clear patient-centered guidance without alienating medical jargon' }
        ]
      }
    ],
    questions: [
      {
        id: 'q_oet_r1',
        section: 'Reading',
        instruction: 'Review the hospital protocol excerpt on Low Molecular Weight Heparin (LMWH) administration.',
        passage: 'PROTOCOL EXTRACT: Venous Thromboembolism Prophylaxis in Post-Operative Orthopedic Patients.\n- Standard Prophylaxis: Enoxaparin 40 mg subcutaneous injection once daily starting 12 hours post-surgery.\n- Renal Impairment Adjustment: If estimated Glomerular Filtration Rate (eGFR) < 30 mL/min/1.73m², reduce dose to Enoxaparin 20 mg subcutaneous once daily or consider unfractionated heparin with anti-Xa monitoring.\n- Absolute Contraindications: Active major hemorrhage, severe uncontrolled malignant hypertension (>200/120 mmHg), or documented history of Heparin-Induced Thrombocytopenia (HIT).',
        questionText: 'For a post-operative hip replacement patient with an eGFR of 24 mL/min/1.73m², what is the prescribed prophylactic regimen?',
        options: [
          'Enoxaparin 20 mg subcutaneously once daily',
          'Enoxaparin 40 mg subcutaneously twice daily',
          'Immediate oral Rivaroxaban 20 mg with food',
          'No anticoagulation is permissible due to severe renal compromise'
        ],
        correctAnswer: 'Enoxaparin 20 mg subcutaneously once daily'
      },
      {
        id: 'q_oet_l1',
        section: 'Listening',
        instruction: 'Listen to the consultation dialogue between Dr. Miller and patient Arthur Vance (Age 64).',
        audioTranscript: 'Dr. Miller: Good morning, Mr. Vance. What brings you into the cardiology clinic today?\nMr. Vance: Well, doctor, over the past three weeks I have noticed a tight, squeezing sensation across my upper chest whenever I climb the station stairs. It usually subsides after resting for four or five minutes. But yesterday evening, while mowing the lawn, the tightness radiated into my lower jaw and left shoulder, accompanied by mild cold sweating.',
        questionText: 'What key clinical characteristic indicates the patient’s angina is progressing toward an unstable pattern?',
        options: [
          'Pain radiating to the left jaw and shoulder with associated diaphoresis during exertion',
          'Pain that occurs only after eating heavy spicy meals',
          'Chest discomfort completely relieved by deep breathing',
          'An isolated tickling sensation in the throat'
        ],
        correctAnswer: 'Pain radiating to the left jaw and shoulder with associated diaphoresis during exertion'
      },
      {
        id: 'q_oet_w1',
        section: 'Writing',
        instruction: 'Write a formal clinical referral letter (180–200 words) using standard OET medical formatting.',
        questionText: 'Case Notes: Mr. Harold Evans (DOB: 14/03/1958) underwent elective triple coronary artery bypass graft (CABG) on 24 October 2026. He is medically stable for discharge today. Write a referral letter to the Community Liaison Nurse requesting home wound inspection of the median sternotomy and saphenous vein donor site, blood pressure monitoring, and titration of his new cardiac medications (Bisoprolol 2.5mg OD, Atorvastatin 80mg ON, Aspirin 75mg OD).',
        modelAnswer: 'Community Liaison Nursing Team\nSt. Jude Community Health Centre\n31 October 2026\n\nRE: Discharge Referral for Mr. Harold Evans (DOB: 14/03/1958)\n\nDear Colleague,\n\nI am writing to refer Mr. Evans, a 68-year-old gentleman who underwent an uncomplicated triple coronary artery bypass graft on 24 October 2026 and is being discharged into community care today.\n\nPost-operatively, Mr. Evans has made a steady recovery. His vital signs are stable, with blood pressure averaging 124/76 mmHg and sinus rhythm maintained. The median sternotomy incision and left saphenous harvest site are clean and healing well by primary intention, with sutures scheduled for removal on post-op day 12.\n\nHis discharge medications include Bisoprolol 2.5 mg once daily, Atorvastatin 80 mg at night, Aspirin 75 mg once daily, and Lansoprazole 30 mg once daily for gastroprotection. He has received full cardiac rehabilitation education.\n\nI would appreciate it if your team could conduct twice-weekly home visits to inspect the surgical wounds for any signs of infection, monitor his blood pressure and pulse, and support medication concordance. Should you observe sternal instability or signs of surgical site infection, please contact our surgical registrar immediately.\n\nYours sincerely,\nCardiothoracic Registrar\nEduBridge Metropolitan Hospital'
      },
      {
        id: 'q_oet_s1',
        section: 'Speaking',
        instruction: 'Read the patient consultation card and deliver a 4-minute empathetic clinical counseling response.',
        questionText: 'Patient Consultation Card: You are speaking with Mrs. Claire Jenkins, a 52-year-old schoolteacher newly diagnosed with Type 2 Diabetes (HbA1c: 8.4%). She is visibly tearful, stating: "My mother lost her eyesight from diabetes. Am I going to end up blind and on dialysis?" Address her fears, explain that early glycemic control protects organ function, and outline initial management (Metformin 500mg, dietary modifications, and glucose log).',
        modelAnswer: 'Mrs. Jenkins, I completely understand why you feel frightened right now, especially seeing what your mother experienced years ago. It is entirely normal to feel overwhelmed, but I want to reassure you that diabetes management has advanced dramatically. Having an HbA1c of 8.4% means your blood sugars have been running elevated, but by diagnosing this now, we can actively protect your eyesight, heart, and kidney function. We will start with a gentle, proven medication called Metformin at 500 milligrams daily, alongside realistic adjustments to diet and daily walking. Most importantly, we will partner with you every step of the way with regular retinal screenings and kidney health checks. You are not facing this alone.'
      }
    ]
  },
  {
    id: 'mock_oet_02',
    exam: 'OET',
    title: 'OET Nursing Practice Simulation #41: Oncology Care',
    difficulty: 'Advanced',
    totalDurationMin: 120,
    targetBandRequirement: 'Grade A (420+ / 500)',
    sections: [
      {
        id: 'sec_oet_r41',
        name: 'Reading',
        durationMinutes: 45,
        questionsCount: 2,
        samplePrompt: 'Febrile Neutropenia Triage Guidelines in Chemotherapy Patients',
        rubric: [
          { criteria: 'Rapid Retrieval', weight: '50%', description: 'Identifying temperature thresholds and empirical IV antibiotic timing' },
          { criteria: 'Clinical Comprehension', weight: '50%', description: 'Assessing septic shock warning criteria' }
        ]
      },
      {
        id: 'sec_oet_w41',
        name: 'Writing',
        durationMinutes: 45,
        questionsCount: 1,
        samplePrompt: 'Urgent Transfer Letter to Acute Oncology Assessment Unit',
        rubric: [
          { criteria: 'Urgency & Priority', weight: '40%', description: 'Immediate communication of neutropenic sepsis suspicion' },
          { criteria: 'Clinical Register', weight: '30%', description: 'Concise, authoritative nursing handover' },
          { criteria: 'Grammar Accuracy', weight: '30%', description: 'Flawless medical abbreviations and documentation' }
        ]
      }
    ],
    questions: [
      {
        id: 'q_oet_r41_1',
        section: 'Reading',
        instruction: 'Read the oncological emergency guideline excerpt.',
        passage: 'Febrile neutropenia is defined as an oral temperature > 38.3°C (or sustained > 38.0°C for one hour) in a patient with an Absolute Neutrophil Count (ANC) < 0.5 x 10^9/L. Treatment represents an absolute medical emergency: broad-spectrum intravenous monotherapy (e.g., Piperacillin-tazobactam 4.5g IV) must be administered within 60 minutes of presentation ("Door-to-Needle Time"), prior to awaiting blood culture confirmation.',
        questionText: 'What is the required time window for initiating broad-spectrum intravenous antibiotics in suspected febrile neutropenia?',
        options: [
          'Within 60 minutes of patient presentation',
          'Only after 48-hour blood culture results are finalized',
          'Within 12 hours of the second fever spike',
          'Only if the patient displays overt signs of septic shock'
        ],
        correctAnswer: 'Within 60 minutes of patient presentation'
      },
      {
        id: 'q_oet_w41_1',
        section: 'Writing',
        instruction: 'Write an urgent transfer letter (180–200 words) for a patient with suspected neutropenic sepsis.',
        questionText: 'Draft an urgent admission letter for Mrs. Margaret Foster (DOB: 22/08/1965), currently Day 9 post-Cycle 2 R-CHOP chemotherapy for Diffuse Large B-Cell Lymphoma, presenting with rigors, temperature of 38.9°C, and BP 92/58 mmHg.',
        modelAnswer: 'Acute Oncology Assessment Unit\nEduBridge Cancer Centre\n31 October 2026\n\nRE: Urgent Transfer – Suspected Neutropenic Sepsis\nPatient: Mrs. Margaret Foster (DOB: 22/08/1965)\n\nDear Triage Team,\n\nI am writing to urgently refer Mrs. Foster, a 61-year-old lymphoma patient on Cycle 2 R-CHOP chemotherapy (Day 9 nadir), who presents to our community clinic with high-risk neutropenic sepsis requiring immediate admission.\n\nOn arrival at 14:15, Mrs. Foster was visibly shivering with severe rigors. Her tympanic temperature recorded 38.9°C. Her vital signs demonstrate hemodynamic instability: blood pressure 92/58 mmHg, heart rate 118 beats per minute (sinus tachycardia), respiratory rate 22 breaths per minute, and oxygen saturation 96% on room air.\n\nIntravenous access has been established, and peripheral and central venous catheter blood cultures have been drawn. In accordance with emergency protocols, her initial dose of Piperacillin-tazobactam 4.5g IV and a 500 mL bolus of normal saline were commenced at 14:40.\n\nMrs. Foster is being transferred via emergency blue-light ambulance. Thank you for your urgent attention to this critical patient.\n\nYours sincerely,\nSpecialist Oncology Nurse\nEduBridge Community Service'
      }
    ]
  },

  // ==========================================
  // 4. DET (DUOLINGO ENGLISH TEST)
  // ==========================================
  {
    id: 'mock_det_01',
    exam: 'DET',
    title: 'Duolingo English Test Adaptive Simulation #12',
    difficulty: 'Standard',
    totalDurationMin: 60,
    targetBandRequirement: '125 – 145 / 160 (Advanced Academic Competence)',
    sections: [
      {
        id: 'sec_det_lit_12',
        name: 'Reading',
        durationMinutes: 15,
        questionsCount: 2,
        samplePrompt: 'Read and Complete (C-Test) & Read and Select (Lexical Discernment)',
        rubric: [
          { criteria: 'Orthographic Accuracy', weight: '50%', description: 'Exact letter completion for gapped academic words' },
          { criteria: 'Lexical Verification', weight: '50%', description: 'Distinguishing authentic English words from morphological pseudo-words' }
        ]
      },
      {
        id: 'sec_det_lis_12',
        name: 'Listening',
        durationMinutes: 15,
        questionsCount: 2,
        samplePrompt: 'Listen and Type (High-Speed Syntactic Dictation)',
        rubric: [
          { criteria: 'Phonological Decoding', weight: '50%', description: 'Accurate auditory word segmentation at normal speech tempo' },
          { criteria: 'Punctuation & Grammar', weight: '50%', description: 'Capitalization, correct tense inflections, and punctuation' }
        ]
      },
      {
        id: 'sec_det_wri_12',
        name: 'Writing',
        durationMinutes: 15,
        questionsCount: 1,
        samplePrompt: 'Interactive 5-Minute Writing Sample',
        rubric: [
          { criteria: 'Grammatical Complexity', weight: '35%', description: 'Subordinate structures, passive voice, and zero run-on errors' },
          { criteria: 'Lexical Sophistication', weight: '35%', description: 'CEFR C1/C2 academic vocabulary choices' },
          { criteria: 'Task Relevance', weight: '30%', description: 'Thoroughly supported argumentative response within 5 minutes' }
        ]
      },
      {
        id: 'sec_det_spk_12',
        name: 'Speaking',
        durationMinutes: 15,
        questionsCount: 1,
        samplePrompt: 'Speak About the Photo (90 Seconds Continuous Description)',
        rubric: [
          { criteria: 'Acoustic Fluency', weight: '35%', description: 'Consistent speech stream without pauses longer than 2 seconds' },
          { criteria: 'Descriptive Range', weight: '35%', description: 'Spatial layout, inferential context, and nuanced adjectives' },
          { criteria: 'Pronunciation Intelligibility', weight: '30%', description: 'Clear syllable stress and sentence intonation' }
        ]
      }
    ],
    questions: [
      {
        id: 'q_det_r1',
        section: 'Reading',
        instruction: 'Read and Complete: Fill in the missing letters to complete the words in the academic passage.',
        passage: 'The ra___ transition tow___ renewable po___ systems requi___ not only effi___ battery sto___, but also adva___ algorithms cap___ of predi___ micro-climatic fluc___ations.',
        questionText: 'Complete the sentence with correct missing letters: "The rapid transition toward renewable power systems requires not only efficient battery storage, but also advanced algorithms capable of predicting micro-climatic fluctuations."',
        correctAnswer: 'The rapid transition toward renewable power systems requires not only efficient battery storage, but also advanced algorithms capable of predicting micro-climatic fluctuations.'
      },
      {
        id: 'q_det_l1',
        section: 'Listening',
        instruction: 'Listen and Type: Type the exact sentence you hear in the recording.',
        audioTranscript: 'Technological innovations continue to dismantle geographic barriers in global higher education.',
        questionText: 'Listen to the audio clip and type the exact sentence:',
        correctAnswer: 'Technological innovations continue to dismantle geographic barriers in global higher education.'
      },
      {
        id: 'q_det_w1',
        section: 'Writing',
        instruction: 'Write a response of at least 80–120 words to the following question in 5 minutes.',
        questionText: 'Many universities are substituting traditional physical lecture halls with asynchronous online virtual lectures. Do you believe this transition enhances or diminishes student educational outcomes? Support your answer with specific examples.',
        modelAnswer: 'While critics lament the loss of spontaneous in-person interactions, I firmly believe that asynchronous digital lectures profoundly elevate educational outcomes by democratizing personalized learning pacing. Traditional fifty-minute auditorium lectures force every student into a monolithic cognitive tempo; learners who struggle with complex mathematical or algorithmic derivations cannot pause the professor to reflect, while advanced students experience disengagement. Conversely, asynchronous platforms allow students to rewind intricate explanations, adjust playback speed, and access multilingual transcripts. When combined with interactive discussion forums and collaborative virtual office hours, digital delivery fosters superior mastery without sacrificing intellectual community.'
      },
      {
        id: 'q_det_s1',
        section: 'Speaking',
        instruction: 'Speak for 90 seconds describing the scene and drawing inferences.',
        questionText: 'Photo Prompt: A modern robotics laboratory where young engineers in protective gear are fine-tuning a carbon-fiber robotic arm hovering over an intricate circuit board.',
        modelAnswer: 'This compelling photograph captures a high-tech robotic engineering laboratory illuminated by cool, clean overhead fluorescent lights. In the foreground, a multi-axis robotic manipulator constructed from matte carbon fiber hovers with surgical precision over an illuminated microchip test bench. Two engineers dressed in anti-static laboratory coats and safety eyewear are carefully monitoring real-time telemetry on dual widescreen displays. The atmosphere conveys intense intellectual focus and cutting-edge innovation, illustrating how automation and precision mechatronics are revolutionizing contemporary microelectronics manufacturing.'
      }
    ]
  },
  {
    id: 'mock_det_02',
    exam: 'DET',
    title: 'Duolingo English Test Adaptive Simulation #13: Global Economics',
    difficulty: 'Advanced',
    totalDurationMin: 60,
    targetBandRequirement: '135 – 155 / 160',
    sections: [
      {
        id: 'sec_det_r13',
        name: 'Reading',
        durationMinutes: 15,
        questionsCount: 2,
        samplePrompt: 'Interactive Reading & Syntactic Cohesion',
        rubric: [
          { criteria: 'Sentence Sequencing', weight: '50%', description: 'Reconstructing logical paragraph progression' },
          { criteria: 'Vocabulary Verification', weight: '50%', description: 'High-level academic word selection' }
        ]
      },
      {
        id: 'sec_det_w13',
        name: 'Writing',
        durationMinutes: 15,
        questionsCount: 1,
        samplePrompt: 'Interactive Writing: The Role of Remote Labor in Urban Economies',
        rubric: [
          { criteria: 'Argumentative Depth', weight: '50%', description: 'Balancing economic dynamism with municipal tax revenue impacts' },
          { criteria: 'Lexical Sophistication', weight: '50%', description: 'Advanced economic collocations' }
        ]
      }
    ],
    questions: [
      {
        id: 'q_det_r13_1',
        section: 'Reading',
        instruction: 'Select the real English words from the list below.',
        questionText: 'Which of the following is a genuine English word meaning "to make something bad better"?',
        options: ['Ameliorate', 'Comprectify', 'Deludicate', 'Prevalicate'],
        correctAnswer: 'Ameliorate'
      },
      {
        id: 'q_det_w13_1',
        section: 'Writing',
        instruction: 'Write an argumentative response of at least 100 words in 5 minutes.',
        questionText: 'As global remote work proliferates, some economists propose taxing companies that employ workers outside their local jurisdiction. Do you agree or disagree with this proposal?',
        modelAnswer: 'I strongly disagree with the proposal to levy punitive taxes on cross-border telecommuting. Enacting geographical tax penalties on remote labor fundamentally contravenes the principles of a dynamic global digital economy and stifles talent mobility. Organizations must be free to recruit specialized talent irrespective of postal codes, particularly in high-skill disciplines such as machine learning and biomedical engineering. Imposing arbitrary cross-border employment penalties would merely drive innovative enterprises to incorporate in tax-friendly jurisdictions, ultimately impoverishing the very municipal treasuries these measures seek to protect.'
      }
    ]
  },

  // ==========================================
  // 5. CAMBRIDGE ENGLISH (C1 ADVANCED / C2 PROFICIENCY)
  // ==========================================
  {
    id: 'mock_cambridge_01',
    exam: 'Cambridge English',
    title: 'Cambridge C1 Advanced (CAE) Official Simulation #301',
    difficulty: 'Standard',
    totalDurationMin: 120,
    targetBandRequirement: 'C1 Grade A / 200+ (Cambridge English Scale)',
    sections: [
      {
        id: 'sec_cam_rue_301',
        name: 'Reading',
        durationMinutes: 45,
        questionsCount: 2,
        samplePrompt: 'Reading & Use of English: Key Word Transformation & Gapped Text',
        rubric: [
          { criteria: 'Grammar Manipulation (Part 4)', weight: '50%', description: 'Accurate transformation using between 3 and 6 words including the given word' },
          { criteria: 'Cohesion & Structure (Part 7)', weight: '50%', description: 'Reinserting gapped paragraphs based on discourse markers and pronoun tracking' }
        ]
      },
      {
        id: 'sec_cam_wri_301',
        name: 'Writing',
        durationMinutes: 45,
        questionsCount: 1,
        samplePrompt: 'Formal Proposal for University Academic Senate on AI Research Ethics',
        rubric: [
          { criteria: 'Content & Task Fulfillment', weight: '25%', description: 'Directly addresses all bullet points with concrete recommendations' },
          { criteria: 'Communicative Achievement', weight: '25%', description: 'Maintains formal proposal conventions (headings, bulleted rationale, executive tone)' },
          { criteria: 'Organisation & Flow', weight: '25%', description: 'Exemplary paragraph hierarchy and cohesive devices' },
          { criteria: 'Language & Lexis', weight: '25%', description: 'Rich sophisticated C1 vocabulary with zero basic syntax slips' }
        ]
      },
      {
        id: 'sec_cam_lis_301',
        name: 'Listening',
        durationMinutes: 40,
        questionsCount: 2,
        samplePrompt: 'Academic Panel on Circular Economy & Materials Science',
        rubric: [
          { criteria: 'Nuance & Attitude', weight: '50%', description: 'Detecting speaker reservations, irony, and consensus' },
          { criteria: 'Information Synthesis', weight: '50%', description: 'Tracking long monologues and complex economic arguments' }
        ]
      },
      {
        id: 'sec_cam_spk_301',
        name: 'Speaking',
        durationMinutes: 15,
        questionsCount: 1,
        samplePrompt: 'Collaborative Task (Negotiating Municipal Priorities)',
        rubric: [
          { criteria: 'Interactive Communication', weight: '35%', description: 'Initiating, turn-taking, and negotiating diplomatic compromise' },
          { criteria: 'Grammar & Vocabulary', weight: '35%', description: 'Using nuanced hypothetical modals (e.g., "were we to consider...")' },
          { criteria: 'Discourse Management', weight: '30%', description: 'Extended contributions with seamless topical transitions' }
        ]
      }
    ],
    questions: [
      {
        id: 'q_cam_rue1',
        section: 'Reading',
        instruction: 'Key Word Transformation: Complete the second sentence so that it has a similar meaning to the first, using the word given in CAPITAL letters. Do NOT change the word given. Use between 3 and 6 words.',
        questionText: 'Prompt Sentence: "It is unlikely that the board will approve the expenditure unless we provide additional telemetry data."\nGiven Word: BOUND\nCompletion Sentence: "The board ____________________________________ the expenditure without additional telemetry data."',
        options: [
          'is bound to reject',
          'is bound not to approve',
          'is not bound to accept',
          'is hardly bound to approve'
        ],
        correctAnswer: 'is bound to reject'
      },
      {
        id: 'q_cam_wri1',
        section: 'Writing',
        instruction: 'Write a formal proposal (220–260 words) with clear headings, analysis, and recommendations.',
        questionText: 'Proposal Task: You represent the Postgraduate Student Council. Write a proposal to the Academic Senate evaluating the implementation of generative AI research tools across graduate faculties. You should outline current opportunities, assess risks of academic misconduct, and propose concrete institutional safeguards.',
        modelAnswer: 'PROPOSAL: FRAMEWORK FOR GENERATIVE AI INTEGRATION IN POSTGRADUATE RESEARCH\n\nIntroduction\nThe aim of this proposal is to evaluate the implications of integrating advanced generative artificial intelligence platforms into graduate research and to recommend governance measures that uphold academic integrity while fostering technological fluency.\n\nCurrent Opportunities\nPreliminary trials indicate that AI-assisted research synthesis significantly accelerates literature discovery, enabling candidates to navigate interdisciplinary repositories with unprecedented speed. Furthermore, automated code debugging tools have drastically reduced engineering cycle times across computational departments.\n\nKey Concerns\nNotwithstanding these advantages, two principal risks demand urgent remediation:\n1. Unverified Hallucinations: Novice researchers risk citing phantom publications produced by probabilistic language engines.\n2. Intellectual Property Complications: Feeding proprietary laboratory datasets into external commercial models jeopardizes institutional patent rights.\n\nRecommendations\nTo mitigate these concerns without forfeiting technological momentum, the Academic Senate should implement the following:\n- Mandate Self-Hosted Models: Deploy localized, secure open-source models within the university firewall to protect sensitive data.\n- Compulsory Provenance Auditing: Institute a requirement that all dissertations include an AI disclosure appendix detailing algorithmic prompts and validation methodologies.\n\nConclusion\nImplemented with prudent oversight, these recommendations will position our institution at the vanguard of responsible academic innovation.'
      },
      {
        id: 'q_cam_lis1',
        section: 'Listening',
        instruction: 'Listen to the interview with economist Dr. Sarah Thornton discussing closed-loop supply chains.',
        audioTranscript: 'Interviewer: Dr. Thornton, corporate sustainability reports frequently champion "closed-loop manufacturing," yet global virgin raw material extraction continues to climb. Where lies the bottleneck?\nDr. Thornton: The fundamental obstacle is not material thermodynamics, but reverse logistics economics. Collecting, sorting, and purifying post-consumer polymers or composites currently commands a significant price premium over extracting cheap fossil precursors. Until regulatory mechanisms penalize virgin material externalities, circularity remains a marketing gesture rather than an industrial reality.',
        questionText: 'According to Dr. Thornton, what is the primary barrier preventing widespread circular manufacturing?',
        options: [
          'The high cost of reverse logistics compared to cheaper virgin raw materials',
          'A complete lack of recycling technology for modern plastics',
          'Consumer unwillingness to purchase recycled products',
          'International treaties banning trade in recycled metals'
        ],
        correctAnswer: 'The high cost of reverse logistics compared to cheaper virgin raw materials'
      },
      {
        id: 'q_cam_spk1',
        section: 'Speaking',
        instruction: 'Collaborative Speaking Task: Formulate your oral analysis and negotiate priorities (approx. 2 minutes).',
        questionText: 'Collaborative Task Prompt: A municipal city council has received an endowment to improve urban public health. You and your partner must discuss the benefits of these five initiatives: 1) Expanding protected bicycle superhighways, 2) Creating urban micro-parks, 3) Subsidizing organic community agriculture, 4) Upgrading public water filtration systems, 5) Establishing free mental health drop-in clinics. Decide which two initiatives should receive top priority funding.',
        modelAnswer: 'Were we to allocate these municipal resources for maximum public benefit, I would strongly advocate prioritizing protected bicycle superhighways alongside free community mental health clinics. Expanding dedicated cycling corridors addresses preventative cardiovascular health while concurrently mitigating urban nitrogen dioxide emissions. Simultaneously, localized mental health clinics provide vital early psychological intervention, reducing pressure on emergency medical infrastructure. While green spaces and community farms offer undeniable aesthetic and nutritional value, active transit and accessible mental healthcare deliver the most immediate and profound societal returns.'
      }
    ]
  },
  {
    id: 'mock_cambridge_02',
    exam: 'Cambridge English',
    title: 'Cambridge C2 Proficiency (CPE) Official Simulation #401',
    difficulty: 'Advanced',
    totalDurationMin: 120,
    targetBandRequirement: 'C2 Proficiency / 220+ / 230 (Mastery)',
    sections: [
      {
        id: 'sec_cam_cpe_rue',
        name: 'Reading',
        durationMinutes: 45,
        questionsCount: 2,
        samplePrompt: 'Reading & Use of English: Multiple Choice Lexical Precision & Cloze',
        rubric: [
          { criteria: 'Idiomatic Mastery', weight: '50%', description: 'Distinguishing subtle nuances among academic synonyms' },
          { criteria: 'Discourse Cohesion', weight: '50%', description: 'Analyzing rhetorical devices and irony in literary prose' }
        ]
      },
      {
        id: 'sec_cam_cpe_wri',
        name: 'Writing',
        durationMinutes: 45,
        questionsCount: 1,
        samplePrompt: 'Discursive Essay on Epistemology & Scientific Paradigm Shifts',
        rubric: [
          { criteria: 'Rhetorical Sophistication', weight: '50%', description: 'Flawless academic thesis and dialectical synthesis' },
          { criteria: 'Lexical Range', weight: '50%', description: 'Mastery of C2 philosophical and academic vocabulary' }
        ]
      }
    ],
    questions: [
      {
        id: 'q_cam_cpe_r1',
        section: 'Reading',
        instruction: 'Read the literary excerpt and answer the question on authorial perspective.',
        passage: 'Thomas Kuhn observed that scientific advancement does not proceed via orderly accretion of empirical facts, but through seismic upheavals. Normal science operates comfortably within reigning paradigms, ignoring anomalies until mounting discrepancies precipitate an epistemic crisis. Only then does the scientific consensus grudgingly capitulate to a revolutionary framework.',
        questionText: 'According to the passage, how do scientific paradigms typically evolve?',
        options: [
          'Through sudden revolutionary disruptions triggered by unresolved anomalies',
          'Through a smooth and predictable daily accumulation of laboratory data',
          'Through arbitrary legislative mandates imposed by government agencies',
          'Through total rejection of empirical experimentation'
        ],
        correctAnswer: 'Through sudden revolutionary disruptions triggered by unresolved anomalies'
      },
      {
        id: 'q_cam_cpe_w1',
        section: 'Writing',
        instruction: 'Write an essay of 280–320 words evaluating the role of peer review in modern science.',
        questionText: 'Write a discursive essay analyzing whether the contemporary pre-publication peer review process accelerates scientific discovery or entrenches dogmatic orthodoxy. Conclude with your reasoned perspective.',
        modelAnswer: 'The institution of pre-publication peer review has long been venerated as the gold standard of scientific veracity. However, as contemporary research becomes increasingly hyper-specialized and competitive, serious scrutiny must be directed toward whether this mechanism accelerates genuine discovery or merely fortifies entrenched dogmatism.\n\nOn one hand, the indispensability of rigorous vetting cannot be overstated. By subjecting experimental methodologies, statistical models, and causal inferences to the forensic examination of independent specialists, peer review acts as an indispensable bulwark against mendacious claims, flawed protocols, and sensationalized pseudoscience. The integrity of biomedical literature, where erroneous assertions directly endanger human lives, hinges entirely upon this systematic filter.\n\nConversely, an insidious drawback lies in the innate conservative bias of incumbent editorial panels. When iconoclastic researchers submit manuscripts that fundamentally challenge prevailing paradigms, peer reviewers—often senior figures whose reputations rest upon established orthodoxy—frequently exhibit unconscious antipathy toward radical hypotheses. History abounds with seminal discoveries, from the bacterial etiology of ulcers to endosymbiotic theory, which were initially rejected by prestigious journals. Furthermore, the advent of open preprint servers has demonstrated that post-publication community scrutiny often uncovers flaws with greater agility than small anonymous committees.\n\nIn conclusion, while peer review remains a vital safeguard against empirical negligence, its pre-publication monopoly must be augmented by transparent, open-access post-publication dialogue to prevent methodological vigilance from degenerating into intellectual gatekeeping.'
      }
    ]
  }
];
