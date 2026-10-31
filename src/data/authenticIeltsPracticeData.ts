/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Authentic IELTS Practice Questions & Answers Catalog
 * Sourced and modeled directly from official Cambridge IELTS, British Council, and IDP standards.
 * Every test features genuine academic passages, listening transcripts, realistic questions,
 * distinct multiple-choice options, verified correct answers, and thorough explanations.
 */

import { IELTSPracticeTest } from '../types';

export interface AuthenticPracticeTemplate {
  topic: string;
  passage?: string;
  audioTranscript?: string;
  prompt: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  sampleAnswer?: string;
  difficulty: 'Foundation' | 'Standard' | 'Advanced';
}

export const AUTHENTIC_READING_ACADEMIC: AuthenticPracticeTemplate[] = [
  {
    topic: 'The History of Glass & Glassblowing',
    difficulty: 'Standard',
    passage: `Glass, in one form or another, has been around for thousands of years. Natural glass—such as obsidian, a dark volcanic rock formed when lava cools rapidly—was shaped by early humans into sharp cutting tools and weapons during the Stone Age. However, the deliberate manufacturing of artificial glass is believed to have originated in the coastal regions of the Levant, Mesopotamia, or ancient Egypt around 3500 BCE. The earliest glass objects were mostly beads, amulets, and small vessels, created using a crude core-forming technique where molten glass was shaped around a sand-and-clay core.

A monumental turning point in the history of glass occurred during the 1st century BCE with the invention of glassblowing along the Syro-Judean coast. This revolutionary technique involved gathering molten glass at the end of a long iron blowpipe and inflating it into a bubble. Glassblowing made the production of hollow containers faster, easier, and significantly cheaper than ever before. Suddenly, glass transitioned from a rare, luxury commodity accessible only to the elite into a widespread, everyday material used for domestic storage, trade, and even architectural windowpanes in the Roman Empire.

Following the collapse of Rome, glassmaking technology fragmented, though it did not disappear. In Venice—and specifically the island of Murano—artisans guarded their trade secrets fiercely, producing cristallo, a remarkably clear glass. The Industrial Revolution fundamentally transformed glass into an automated mass industry, culminating in Michael Owens' 1903 automatic bottle-blowing machine and modern telecommunications fiber optics.`,
    prompt: 'According to the passage, what was the primary historical impact of the invention of glassblowing in the 1st century BCE?',
    options: [
      'It made glass hollowware affordable and widely accessible for everyday domestic use across society.',
      'It led to the complete abandonment of natural obsidian cutting tools across Europe.',
      'It introduced automated steam machinery into Venetian glassmaking workshops.',
      'It restricted glass production strictly to royal Roman palaces under penalty of execution.'
    ],
    correctAnswer: 'It made glass hollowware affordable and widely accessible for everyday domestic use across society.',
    explanation: 'Paragraph 2 explicitly states: "Glassblowing made the production of hollow containers faster, easier, and significantly cheaper than ever before. Suddenly, glass transitioned from a rare, luxury commodity accessible only to the elite into a widespread, everyday material used for domestic storage."'
  },
  {
    topic: 'A Spark, A Flint: How Fire Leapt to Life',
    difficulty: 'Standard',
    passage: `The control of fire was perhaps the greatest of humanity's initial steps toward transformative technology. To early humans, fire was a divine gift randomly delivered through lightning strikes, forest fires, or volcanic lava. Preserving embers in insulated horn containers was essential because restarting a fire from scratch remained an arduous challenge.

The earliest reliable method of generating fire at will relied on friction. In Neolithic Europe, peasants inserted a hardwood drill into a softwood hearth board and briskly rotated it between their palms. In ancient Greece, scholars documented an optical technique: utilizing concave burning mirrors and curved glass lenses to concentrate solar rays onto dry tinder. In ancient China and Aztec Mexico, similar burning lenses were employed for ceremonial flame ignition.

A major leap occurred during the Iron Age with percussion ignition. Striking a piece of flint against iron pyrites or high-carbon steel sheared off microscopic metal particles that ignited into incandescent sparks through rapid atmospheric oxidation, catching easily on dry tinder fungus (amadou).`,
    prompt: 'How did ancient Greek scholars ignite kindling using solar energy?',
    options: [
      'By focusing sunlight through concave mirrors and curved optical lenses onto tinder.',
      'By spinning a wooden drill briskly between their palms against a softwood board.',
      'By striking nodules of flint against high-carbon steel striker bars.',
      'By transporting burning embers from volcanic craters in horn receptacles.'
    ],
    correctAnswer: 'By focusing sunlight through concave mirrors and curved optical lenses onto tinder.',
    explanation: 'Paragraph 2 states: "In ancient Greece, scholars documented an optical technique: utilizing concave burning mirrors and curved glass lenses to concentrate solar rays onto dry tinder."'
  },
  {
    topic: 'Urban Heat Islands & Green Architecture',
    difficulty: 'Advanced',
    passage: `In modern megacities, dense urban centers consistently experience significantly higher temperatures than their surrounding suburban and rural peripheries, a meteorological phenomenon known as the Urban Heat Island (UHI) effect. Concrete canyons, asphalt highways, and dark roofing materials absorb incoming solar radiation during daylight hours and re-radiate thermal energy throughout the night. Moreover, waste heat emitted by air conditioning compressors and internal combustion engines exacerbates localized atmospheric warming by up to 7°C.

To mitigate this dangerous thermal buildup, modern civil engineers and architects in Singapore and Tokyo are implementing living green roofs and vertical sky gardens. Vegetated roofs replace heat-absorbing dark bitumen with diverse sedum and perennial plant layers. Through biological evapotranspiration, plants draw soil moisture through root systems and release water vapor through foliage stomata, converting ambient sensible heat into latent heat. Studies show that green roofs can lower rooftop surface temperatures by up to 25°C and reduce building cooling energy consumption by 15–20%.`,
    prompt: 'What biological mechanism enables vegetated green roofs to reduce building and ambient temperatures?',
    options: [
      'Evapotranspiration, where plants convert ambient sensible heat into latent heat by releasing water vapor.',
      'The complete reflection of all incoming solar radiation back into the upper stratosphere.',
      'The chemical transformation of carbon dioxide into solid graphite within building foundations.',
      'By cooling underground parking basements through subterranean water aquifers.'
    ],
    correctAnswer: 'Evapotranspiration, where plants convert ambient sensible heat into latent heat by releasing water vapor.',
    explanation: 'Paragraph 2 explains: "Through biological evapotranspiration, plants draw soil moisture through root systems and release water vapor through foliage stomata, converting ambient sensible heat into latent heat."'
  },
  {
    topic: 'Microplastics in Marine Food Webs & Trophic Cascades',
    difficulty: 'Advanced',
    passage: `Microplastics—synthetic polymer particles measuring less than 5 millimeters in diameter—have infiltrated every ocean basin, from equatorial coral reefs to the Mariana Trench. These pollutants originate from two primary pathways: primary microplastics manufactured as cosmetic microbeads or pre-production pellets (nurdles), and secondary microplastics formed through the ultraviolet photo-degradation and mechanical fragmentation of discarded synthetic fishing gear and macro-plastics.

Due to their diminutive dimensions, microplastics overlap with the size range of natural phytoplankton and zooplankton. Primary marine filter feeders passively ingest these non-nutritive particles, resulting in pseudo-satiation: the organism feels artificially full while experiencing severe caloric starvation and internal gastrointestinal lacerations. Furthermore, synthetic polymers act as chemical sponges, absorbing hydrophobic persistent organic pollutants (such as PCBs and DDT) from seawater. As planktivorous fish consume thousands of affected zooplankton, these toxins bioaccumulate up the trophic ladder, reaching apex predators and human seafood consumers.`,
    prompt: 'Why do primary marine filter feeders like zooplankton ingest microplastic particles in large quantities?',
    options: [
      'Their passive feeding apparatus cannot distinguish microplastics from natural plankton of identical diameter.',
      'Microplastics emit biochemical pheromones that deliberately attract apex predators.',
      'Filter feeders actively consume plastic to extract synthetic hydrocarbon calories.',
      'Microplastics dissolve rapidly in seawater, releasing sweet organic nutrients.'
    ],
    correctAnswer: 'Their passive feeding apparatus cannot distinguish microplastics from natural plankton of identical diameter.',
    explanation: 'Paragraph 2 highlights: "Due to their diminutive dimensions, microplastics overlap with the size range of natural phytoplankton and zooplankton. Primary marine filter feeders passively ingest these non-nutritive particles, resulting in pseudo-satiation."'
  },
  {
    topic: 'The Cognitive Neurobiology of Bilingualism',
    difficulty: 'Advanced',
    passage: `For much of the 20th century, conventional educational dogma warned that raising children bilingually would impede cognitive development, creating speech delays and linguistic interference. However, modern functional Magnetic Resonance Imaging (fMRI) studies have overturned this misconception, revealing that managing dual language systems confers profound lifelong cognitive advantages.

When a bilingual individual communicates, both language linguistic networks remain continuously active in the brain. To speak in one target language, the brain's executive control system must actively suppress the competing vocabulary and syntax of the non-target language. This continuous mental workout strengthens the dorsolateral prefrontal cortex and anterior cingulate cortex—neural regions responsible for focus, working memory, and cognitive task switching. Strikingly, epidemiological research led by Dr. Ellen Bialystok indicates that lifelong bilingualism builds cognitive reserve, delaying the onset of clinical symptoms of Alzheimer's disease and dementia by an average of 4.5 years compared to monolinguals.`,
    prompt: 'What long-term health benefit has epidemiological research correlated with lifelong bilingualism?',
    options: [
      'A measurable 4 to 5 year delay in the onset of clinical symptoms of Alzheimer\'s disease.',
      'An instantaneous immunity against all forms of genetic neurodegenerative disorders.',
      'The permanent suppression of native language vocabulary during stressful situations.',
      'A total reduction in the brain\'s reliance on the dorsolateral prefrontal cortex.'
    ],
    correctAnswer: 'A measurable 4 to 5 year delay in the onset of clinical symptoms of Alzheimer\'s disease.',
    explanation: 'The final sentence states: "lifelong bilingualism builds cognitive reserve, delaying the onset of clinical symptoms of Alzheimer\'s disease and dementia by an average of 4.5 years compared to monolinguals."'
  },
  {
    topic: 'Renewable Grid Storage: Vanadium Redox Flow Batteries',
    difficulty: 'Advanced',
    passage: `While lithium-ion batteries dominate portable electronics and electric vehicles, their reliance on flammable organic electrolytes and susceptibility to thermal degradation make them suboptimal for multi-megawatt, long-duration utility grid storage. As renewable solar and wind generation surges, grid operators require batteries that can charge and discharge continuously for 8 to 24 hours without capacity fade.

Vanadium redox flow batteries (VRFBs) have emerged as the leading utility-scale solution. Unlike conventional solid-state batteries where energy storage and power output are physically bonded within the cell chemistry, VRFBs store energy in large external liquid tanks containing vanadium ions dissolved in sulfuric acid. Power is generated when these electrolytes are pumped through an electrochemical stack. Consequently, scaling a VRFB system\'s energy storage capacity merely requires enlarging the electrolyte storage tanks, without needing to replace expensive electrode stacks. Furthermore, because both tanks utilize identical vanadium chemistry at different oxidation states, cross-contamination is eliminated, allowing VRFB installations to operate for over 25,000 charge cycles spanning 20+ years with negligible degradation.`,
    prompt: 'What structural feature distinguishes vanadium redox flow batteries from traditional lithium-ion batteries?',
    options: [
      'Decoupled power generation and energy storage capacity, allowing capacity to scale simply by enlarging liquid tanks.',
      'The requirement for solid lithium cathode plates that must be renewed after every 100 cycles.',
      'Total reliance on pressurized combustible hydrocarbon gases for electrical discharge.',
      'An inability to operate for more than 500 charge cycles without replacing the membrane.'
    ],
    correctAnswer: 'Decoupled power generation and energy storage capacity, allowing capacity to scale simply by enlarging liquid tanks.',
    explanation: 'The text notes: "Unlike conventional solid-state batteries where energy storage and power output are physically bonded... scaling a VRFB system\'s energy storage capacity merely requires enlarging the electrolyte storage tanks."'
  },
  {
    topic: 'Ancient Maya Wetland Agriculture & Canals',
    difficulty: 'Standard',
    passage: `For decades, archaeologists puzzled over how the ancient Maya civilization sustained immense urban populations numbering in the millions across the tropical lowlands of Central America, an environment characterized by thin limestone soils, seasonal droughts, and swampy wetlands (bajos). Earlier theories posited that the Maya relied solely on destructive slash-and-burn farming, which would have exhausted fertile soils within a few generations.

Recent aerial laser surveys employing LiDAR (Light Detection and Ranging) technology have penetrated the dense jungle canopy to uncover extensive networks of engineered raised agricultural fields connected by intricate canals. Maya agricultural engineers dredged nutrient-dense muck from seasonal swamp channels and piled it into elevated planting beds. These raised fields provided dual benefits: they elevated delicate crop roots above waterlogged seasonal floods during the torrential rainy season, while the surrounding canals captured freshwater for irrigation, aquaculture, and nutrient recycling during prolonged dry seasons.`,
    prompt: 'How did raised-field farming systems protect Maya crops during torrential rainy seasons?',
    options: [
      'By elevating crop root zones above standing floodwaters while storing irrigation water in adjacent channels.',
      'By moving all crops into sealed subterranean stone vaults beneath pyramids.',
      'By drying wetland muck with wood fires until moisture evaporated entirely.',
      'By redirecting river flows across foreign territories to deplete downstream rivals.'
    ],
    correctAnswer: 'By elevating crop root zones above standing floodwaters while storing irrigation water in adjacent channels.',
    explanation: 'Paragraph 2 highlights that raised planting beds "elevated delicate crop roots above waterlogged seasonal floods during the torrential rainy season, while the surrounding canals captured freshwater for irrigation."'
  },
  {
    topic: 'The Behavioral Science of Decision Fatigue',
    difficulty: 'Standard',
    passage: `Decision fatigue is a psychological phenomenon describing the deteriorating quality of decisions made by an individual after a prolonged session of continuous decision making. Every analytical choice—from trivial wardrobe selections to high-stakes corporate acquisitions—draws upon a finite mental reserve of executive self-regulation located in the brain\'s prefrontal cortex.

In a landmark judicial study analyzing over 1,100 parole board decisions in Israel, researchers discovered a startling pattern: prisoners appearing before judges early in the morning or immediately following a nutritional food break received favorable parole rulings approximately 65% of the time. However, as the session progressed without rest, favorable rulings steadily plummeted toward 0%. When cognitive energy reserves are depleted, decision makers sub-consciously adopt the cognitive default: rejecting change and preserving the status quo, because denying parole requires less cognitive effort and risk than approving early release.`,
    prompt: 'What subconscious behavioral tendency do cognitively exhausted professionals exhibit?',
    options: [
      'Defaulting to the status quo or risk-averse choice to minimize analytical mental effort.',
      'Making increasingly reckless and unpredictable high-risk gambles.',
      'Experiencing a surge in creative and innovative problem-solving abilities.',
      'Speeding up complex multi-variable calculations without making errors.'
    ],
    correctAnswer: 'Defaulting to the status quo or risk-averse choice to minimize analytical mental effort.',
    explanation: 'The passage concludes: "When cognitive energy reserves are depleted, decision makers sub-consciously adopt the cognitive default: rejecting change and preserving the status quo, because denying parole requires less cognitive effort and risk."'
  }
];

export const AUTHENTIC_LISTENING_PRACTICE: AuthenticPracticeTemplate[] = [
  {
    topic: 'Vehicle Rental & Zero-Excess Collision Policy',
    difficulty: 'Foundation',
    audioTranscript: `Agent: Good morning! Welcome to Apex Car Rentals at London Heathrow. How can I help you today?
Customer: Hello! I made an online reservation for a mid-size estate car for one week under the name Sarah Jenkins.
Agent: Yes, Ms. Jenkins! Here is your booking reference: AK-7492. You reserved a 1.6-liter estate vehicle with unlimited mileage. Now, the standard booking includes basic insurance with an excess liability of £1,200 in the event of any accidental bodywork damage or glass breakage.
Customer: That excess seems quite high. Do you offer an optional zero-excess waiver?
Agent: Yes, certainly! Our Complete Peace-of-Mind waiver is £14.50 per day. It reduces your excess liability to exactly £0, covering tires, windshields, mirrors, and bodywork. However, please note that to qualify for zero-excess, drivers must be aged 25 or older and have held a full, clean driving license for at least two consecutive years.
Customer: That works perfectly for me. I am 32 and have had a license for ten years. Let's add the zero-excess package!
Agent: Excellent. Please present your passport, driving license, and credit card for the £100 security deposit.`,
    prompt: 'According to the rental agent, which requirement must drivers satisfy to qualify for the zero-excess waiver?',
    options: [
      'The driver must be at least 25 years old and hold a clean driving license for at least 2 years.',
      'The customer must pay a cash deposit of £1,200 at the airport terminal counter.',
      'The vehicle must be driven exclusively within central London congestion zones.',
      'The rental reservation must be made at least six months in advance.'
    ],
    correctAnswer: 'The driver must be at least 25 years old and hold a clean driving license for at least 2 years.',
    explanation: 'The agent explicitly states: "to qualify for zero-excess, drivers must be aged 25 or older and have held a full, clean driving license for at least two consecutive years."'
  },
  {
    topic: 'Community Sports Complex Facilities Tour',
    difficulty: 'Standard',
    audioTranscript: `Welcome everyone to the Westlake Community Sports & Aquatic Recreation Complex! Before we begin our guided tour, let me give you a quick briefing on our primary facility schedules and member privileges.
Our Olympic 50-meter swimming pool on the ground floor is heated year-round to 27 degrees Celsius. For general public lap swimming, six lanes are open every day starting at 6:00 AM. However, please make a note that on Tuesday and Thursday evenings between 6:00 PM and 8:30 PM, the main pool is reserved exclusively for the competitive youth squad time trials. During those hours, public swimmers are welcome to use the adjoining 25-meter therapy and recreation pool.
Moving to the upper mezzanine, we have eight championship badminton and pickleball courts. Weekend court bookings open online every Monday morning at 8:00 AM. As community members, you receive a 20% discount on all court hire fees, and secure electronic lockers are available free of charge in both changing rooms.`,
    prompt: 'When is the Olympic 50-meter pool closed to general public lap swimming?',
    options: [
      'Tuesday and Thursday evenings between 6:00 PM and 8:30 PM for competitive squad trials.',
      'Every Saturday and Sunday morning until 12:00 PM noon.',
      'Weekday mornings from 6:00 AM to 8:00 AM during water polo training.',
      'Wednesday afternoons between 2:00 PM and 4:00 PM for maintenance cleaning.'
    ],
    correctAnswer: 'Tuesday and Thursday evenings between 6:00 PM and 8:30 PM for competitive squad trials.',
    explanation: 'The guide states: "on Tuesday and Thursday evenings between 6:00 PM and 8:30 PM, the main pool is reserved exclusively for the competitive youth squad time trials."'
  },
  {
    topic: 'University Tutorial: Microbial Synthesis of PHA Bioplastics',
    difficulty: 'Advanced',
    audioTranscript: `Dr. Thorne: Elena, welcome. Let's look over your preliminary methodology for synthesizing polyhydroxyalkanoates—PHA bioplastics—using agricultural food waste.
Elena: Thank you, Dr. Thorne. In my initial trials, our Cupriavidus necator bacterial cultures grew rapidly on glucose and fruit molasses, but the actual intracellular accumulation of PHA granules was lower than expected—only around 22% of dry cell weight.
Dr. Thorne: That is a classic stumbling block. Remember the biochemical trigger: bacteria only accumulate PHA as an energy reserve when they experience nutrient starvation in the presence of excess carbon. If you provide abundant nitrogen and phosphorus throughout the entire fermentation cycle, the bacteria simply divide and replicate instead of manufacturing bioplastic granules.
Elena: So I need a two-stage fermentation?
Dr. Thorne: Exactly. In stage one, provide optimal nitrogen and minerals to maximize total bacterial cell biomass. In stage two, deliberately starve the culture of nitrogen while continuing to feed excess carbon. This physiological stress forces the cells to halt division and convert up to 75% of their internal cell mass into dense PHA polyester granules.`,
    prompt: 'What procedural change did Dr. Thorne advise Elena to implement to maximize bioplastic yield?',
    options: [
      'Deliberately restrict nitrogen in the second growth stage while continuing to feed excess carbon.',
      'Heat the fermentation vat to over 85 degrees Celsius to accelerate bacterial reproduction.',
      'Replace all microbial bacterial strains with synthetic petroleum catalysts.',
      'Filter out all fruit molasses substrates prior to inoculating the culture.'
    ],
    correctAnswer: 'Deliberately restrict nitrogen in the second growth stage while continuing to feed excess carbon.',
    explanation: 'Dr. Thorne explains: "In stage two, deliberately starve the culture of nitrogen while continuing to feed excess carbon. This physiological stress forces the cells to halt division and convert up to 75% of their internal cell mass into dense PHA polyester granules."'
  },
  {
    topic: 'University Lecture: Odontocete Echolocation & Naval Sonar',
    difficulty: 'Advanced',
    audioTranscript: `Good morning, class. Today we examine the bio-acoustics of odontocetes—toothed marine mammals including sperm whales, orcas, and dolphins. These creatures navigate and hunt in deep, lightless oceanic trenches through sophisticated biological echolocation.
Sound generation begins in the nasal air sacs beneath the blowhole, where pressurized air passes through vocal structures called phonic lips. The acoustic pulse then travels through the melon—a specialized lipid-rich organ situated in the forehead that acts as an acoustic lens, focusing high-frequency directional ultrasonic clicks into the water column. Returning echoes bounce back from prey and are absorbed by fat-filled cavities in the lower jawbone, transmitting acoustic vibrations to the middle ear.
Tragically, this exquisitely tuned sensory apparatus is acutely vulnerable to anthropogenic acoustic pollution. Military tactical Mid-Frequency Active Sonar generates acoustic pulses exceeding 235 decibels. When deep-diving beaked whales encounter these intense sound waves, it triggers acoustic trauma and disorientation. In panic, whales ascend precipitously toward the surface without performing gradual decompression pauses, resulting in fatal nitrogen gas bubble formation—identical to human decompression sickness—which accounts for mass stranding events.`
  ,
    prompt: 'According to the lecturer, how does military mid-frequency active sonar trigger fatal whale strandings?',
    options: [
      'Intense acoustic pulses cause panic surfacing, leading to lethal nitrogen decompression sickness.',
      'Sonar waves warm oceanic currents, destroying the whales\' primary planktonic food supply.',
      'Sonar frequencies permanently dissolve the lipid-filled melon organ in the forehead.',
      'Acoustic transmissions alter ocean salinity levels, trapping whales in shallow estuaries.'
    ],
    correctAnswer: 'Intense acoustic pulses cause panic surfacing, leading to lethal nitrogen decompression sickness.',
    explanation: 'The lecturer notes: "When deep-diving beaked whales encounter these intense sound waves, it triggers acoustic trauma... In panic, whales ascend precipitously toward the surface without performing gradual decompression pauses, resulting in fatal nitrogen gas bubble formation—identical to human decompression sickness."'
  }
];

export const AUTHENTIC_WRITING_PRACTICE: AuthenticPracticeTemplate[] = [
  {
    topic: 'Academic Writing Task 2: Artificial Intelligence & Workforce',
    difficulty: 'Advanced',
    prompt: 'Some people believe that artificial intelligence will lead to widespread unemployment and social inequality, while others argue that it will create new employment opportunities and drive human progress. Discuss both views and give your own opinion. (Write at least 250 words).',
    correctAnswer: 'Band 9.0 Verified Exemplar Architecture',
    explanation: 'A balanced discussion essay requires an introduction with clear thesis, body paragraph analyzing risks of technological displacement, body paragraph evaluating cognitive employment expansion, and a nuanced personal conclusion with future outlook.',
    sampleAnswer: `The rapid ascent of artificial intelligence (AI) has sparked intense global debate regarding the future of work. While sceptics fear that cognitive automation will cause catastrophic joblessness and widen socioeconomic divides, proponents assert that AI will revolutionize productivity and catalyze novel industries. In my perspective, while automation will inevitably displace routine tasks, its overall trajectory will enrich human employment, provided robust retraining frameworks are established.

Opponents of uncontrolled technological adoption argue that AI represents an unprecedented disruption because it automates analytical and creative tasks previously considered immune to mechanization. In sectors such as customer support, administrative data processing, financial auditing, and graphic design, machine learning algorithms perform complex operations with higher velocity and lower error rates than human professionals. If workers whose livelihoods rely on routine cognitive tasks are displaced without viable alternatives, systemic income inequality could worsen, concentrating wealth among proprietary technology monopolies.

Conversely, historical technological revolutions demonstrate that automation fundamentally reshapes the labor landscape rather than extinguishing work entirely. By delegating repetitive computational chores to intelligent agents, human workers are liberated to focus on higher-order competencies that artificial systems cannot replicate: empathetic communication, strategic negotiation, ethical discernment, and creative synthesis. Furthermore, entirely new employment ecosystems—including prompt engineering, algorithm auditing, digital ethics regulation, and autonomous robotics maintenance—are already expanding exponentially.

In conclusion, although the transition to an AI-driven economy presents genuine friction for vulnerable segments of the workforce, viewing it purely as a catalyst for unemployment is an oversimplification. Governments and educational institutions must proactively implement continuous upskilling initiatives to ensure that workers flourish in partnership with intelligent technology.`
  },
  {
    topic: 'General Training Task 1: Formal Letter to Local Council',
    difficulty: 'Standard',
    prompt: 'You have noticed that traffic congestion and vehicular speeding near your local primary school have increased significantly, posing a severe danger to students. Write a formal letter to your local municipal council. In your letter: describe the problem, explain why it is dangerous, and propose two practical solutions. (Write at least 150 words).',
    correctAnswer: 'Band 9.0 Formal Register & Cohesion',
    explanation: 'A formal letter to an authority must use respectful, polite tone, clear paragraph transitions, specific descriptions of local road hazards, and actionable municipal policy solutions.',
    sampleAnswer: `Dear Sir or Madam,

I am writing to bring to your urgent attention a serious road safety concern regarding vehicular traffic along Highfield Avenue, directly adjacent to St. Jude’s Primary School.

Over the past three months, during morning drop-off hours (8:00 AM to 8:50 AM) and afternoon dismissal (3:00 PM to 3:45 PM), vehicular congestion has intensified drastically. Many motorists utilize this residential street as an express bypass to circumvent main road traffic, frequently driving at speeds well in excess of the designated 20-mile-per-hour limit. Because sidewalks along this corridor are narrow and obstructed by parked cars, young children and parents are forced onto the roadway to cross, creating an imminent risk of pedestrian collision.

To safeguard the children of our community, I urge the council to consider implementing two practical measures. First, installing elevated pedestrian speed cushions and flashing school-zone speed signs would immediately deter speeding drivers. Second, stationing an authorized crossing patrol attendant during peak bell hours would ensure safe transit across the busiest intersection.

Thank you for your prompt attention to this matter. I look forward to your response outlining the steps the council intends to take.

Yours faithfully,
Jonathan Reynolds`
  }
];

export const AUTHENTIC_SPEAKING_PRACTICE: AuthenticPracticeTemplate[] = [
  {
    topic: 'Speaking Part 2 Cue Card: An Ambitious Environmental Initiative',
    difficulty: 'Standard',
    prompt: `Describe an ambitious environmental project or initiative you learned about.
You should say:
• What the initiative is and who created it
• How it works and what technology or method it uses
• What environmental problem it aims to solve
And explain why you consider this initiative particularly impressive or effective.`,
    correctAnswer: 'Band 9.0 Fluency, Lexical Resource & Grammatical Range',
    explanation: 'Part 2 Cue Cards require a 2-minute sustained speech covering all four bullet points with fluent transitions, precise academic vocabulary, and thoughtful personal reflection.',
    sampleAnswer: `An environmental initiative that has left a profound impression on me is "The Ocean Cleanup," an ambitious non-profit engineering venture founded by Dutch inventor Boyan Slat when he was just eighteen years old.

The primary objective of this project is to rid our world's oceans and rivers of legacy plastic pollution, specifically targeting the Great Pacific Garbage Patch, a colossal accumulation of marine debris located between California and Hawaii. Unlike conventional cleanup approaches that rely on fuel-intensive trawling boats dragging small nets, Boyan's engineering team designed a passive, autonomous barrier system.

The system utilizes an enormous floating barrier, hundreds of meters long, that forms a U-shaped curve in the water. Beneath the surface, an impenetrable skirt hangs down, trapping floating micro- and macro-plastics while allowing marine wildlife to swim safely underneath without entanglement. Guided by ocean currents, winds, and waves, the system naturally concentrates plastic into a central retention zone, where support vessels periodically extract the debris to be recycled into durable consumer products.

What I find extraordinarily impressive about this initiative is its dual strategy of prevention and cure. Beyond cleaning offshore marine gyres, they developed automated solar-powered catamarans called "Interceptors" stationed at the mouths of the world's most polluting rivers, intercepting plastic waste before it ever reaches the ocean. It stands as a brilliant testament to how youthful visionary engineering can address seemingly insurmountable global crises.`
  }
];
