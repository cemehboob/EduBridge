/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Authentic Multi-Question Practice Sets (At Least 10 Questions Per Test)
 * Modeled directly on Cambridge IELTS, British Council, and IDP official standards.
 * Every test features at least 10 subject-coherent, inter-related, or mix-and-match questions
 * with multiple-choice options, verified correct answers, and thorough explanations.
 */

import { PracticeTestQuestion } from '../types';

export interface ThemedPracticeQuestionSet {
  topic: string;
  subject: string;
  module: 'Listening' | 'Reading' | 'Writing' | 'Speaking';
  difficulty: 'Foundation' | 'Standard' | 'Advanced';
  passage?: string;
  audioTranscript?: string;
  questions: PracticeTestQuestion[];
}

export const THEMED_PRACTICE_SETS: ThemedPracticeQuestionSet[] = [
  // 1. Reading: The History of Glass & Glassblowing (Materials Science & Archaeology)
  {
    topic: 'The History of Glass & Glassblowing',
    subject: 'Materials Science & Archaeology',
    module: 'Reading',
    difficulty: 'Standard',
    passage: `Glass, in one form or another, has been around for thousands of years. Natural glass—such as obsidian, a dark volcanic rock formed when lava cools rapidly—was shaped by early humans into sharp cutting tools and weapons during the Stone Age. However, the deliberate manufacturing of artificial glass is believed to have originated in the coastal regions of the Levant, Mesopotamia, or ancient Egypt around 3500 BCE. The earliest glass objects were mostly beads, amulets, and small vessels, created using a crude core-forming technique where molten glass was shaped around a sand-and-clay core.

A monumental turning point in the history of glass occurred during the 1st century BCE with the invention of glassblowing along the Syro-Judean coast. This revolutionary technique involved gathering molten glass at the end of a long iron blowpipe and inflating it into a bubble. Glassblowing made the production of hollow containers faster, easier, and significantly cheaper than ever before. Suddenly, glass transitioned from a rare, luxury commodity accessible only to the elite into a widespread, everyday material used for domestic storage, trade, and even architectural windowpanes in the Roman Empire.

Following the collapse of Rome, glassmaking technology fragmented, though it did not disappear. In Venice—and specifically the island of Murano—artisans guarded their trade secrets fiercely, producing cristallo, a remarkably clear glass. The Industrial Revolution fundamentally transformed glass into an automated mass industry, culminating in Michael Owens' 1903 automatic bottle-blowing machine and modern telecommunications fiber optics.`,
    questions: [
      {
        id: 'glass_q1',
        questionNumber: 1,
        subject: 'Materials Science & Archaeology',
        prompt: 'According to paragraph 2, what was the primary historical impact of the invention of glassblowing in the 1st century BCE?',
        options: [
          'It made glass hollowware affordable and widely accessible for everyday domestic use across society.',
          'It led to the complete abandonment of natural obsidian cutting tools across Europe.',
          'It introduced automated steam machinery into Venetian glassmaking workshops.',
          'It restricted glass production strictly to royal Roman palaces under penalty of execution.'
        ],
        correctAnswer: 'It made glass hollowware affordable and widely accessible for everyday domestic use across society.',
        explanation: 'Paragraph 2 states: "Glassblowing made the production of hollow containers faster, easier, and significantly cheaper than ever before. Suddenly, glass transitioned from a rare, luxury commodity accessible only to the elite into a widespread, everyday material."'
      },
      {
        id: 'glass_q2',
        questionNumber: 2,
        subject: 'Materials Science & Archaeology',
        prompt: 'What natural form of glass did Stone Age humans shape into blades and weapons?',
        options: [
          'Obsidian, formed from rapidly cooled volcanic lava.',
          'Cristallo, developed by Venetian guild masters.',
          'Synthetic silica sand heated by geothermal geysers.',
          'Calcified limestone mixed with sea salt.'
        ],
        correctAnswer: 'Obsidian, formed from rapidly cooled volcanic lava.',
        explanation: 'Paragraph 1 mentions that "Natural glass—such as obsidian, a dark volcanic rock formed when lava cools rapidly—was shaped by early humans into sharp cutting tools."'
      },
      {
        id: 'glass_q3',
        questionNumber: 3,
        subject: 'Materials Science & Archaeology',
        prompt: 'Where and when does archaeological evidence indicate deliberate artificial glass manufacturing began?',
        options: [
          'In the Levant, Mesopotamia, or ancient Egypt around 3500 BCE.',
          'In central Rome during the reign of Augustus around 27 BCE.',
          'On the island of Murano in Venice around 1204 CE.',
          'In Owens Glassworks in Ohio in 1903 CE.'
        ],
        correctAnswer: 'In the Levant, Mesopotamia, or ancient Egypt around 3500 BCE.',
        explanation: 'Paragraph 1 indicates artificial glass originated "in the coastal regions of the Levant, Mesopotamia, or ancient Egypt around 3500 BCE."'
      },
      {
        id: 'glass_q4',
        questionNumber: 4,
        subject: 'Materials Science & Archaeology',
        prompt: 'How were the earliest artificial glass vessels constructed before the blowpipe was invented?',
        options: [
          'By winding molten glass around a temporary core of sand and clay.',
          'By carving solidified blocks of glass using obsidian chisels.',
          'By casting glass liquid into pressurized bronze molds.',
          'By spinning hot quartz on high-speed pottery wheels.'
        ],
        correctAnswer: 'By winding molten glass around a temporary core of sand and clay.',
        explanation: 'Paragraph 1 states vessels were "created using a crude core-forming technique where molten glass was shaped around a sand-and-clay core."'
      },
      {
        id: 'glass_q5',
        questionNumber: 5,
        subject: 'Materials Science & Archaeology',
        prompt: 'Which tool was central to the 1st-century BCE glassblowing revolution along the Syro-Judean coast?',
        options: [
          'A long iron blowpipe used to inflate molten glass into a bubble.',
          'A centrifugal hydraulic press driven by river water wheels.',
          'A diamond-tipped cutting wheel for precision beveling.',
          'A charcoal blast furnace equipped with bellows.'
        ],
        correctAnswer: 'A long iron blowpipe used to inflate molten glass into a bubble.',
        explanation: 'Paragraph 2 notes the technique involved "gathering molten glass at the end of a long iron blowpipe and inflating it into a bubble."'
      },
      {
        id: 'glass_q6',
        questionNumber: 6,
        subject: 'Materials Science & Archaeology',
        prompt: 'How did the Roman Empire incorporate glass into architecture?',
        options: [
          'By producing the earliest architectural windowpanes.',
          'By reinforcing concrete aqueducts with molten glass layers.',
          'By carving load-bearing temple pillars from clear glass blocks.',
          'By paving chariot roads with reflective silica tiles.'
        ],
        correctAnswer: 'By producing the earliest architectural windowpanes.',
        explanation: 'Paragraph 2 states glass became used for "domestic storage, trade, and even architectural windowpanes in the Roman Empire."'
      },
      {
        id: 'glass_q7',
        questionNumber: 7,
        subject: 'Materials Science & Archaeology',
        prompt: 'Why did the Republic of Venice relocate its glassmakers specifically to the island of Murano?',
        options: [
          'To fiercely guard secret trade formulas like cristallo and protect the city from furnace fire hazards.',
          'Because silica sand could only be dredged from Murano sea shoals.',
          'To isolate glassmakers infected by the bubonic plague.',
          'To establish an international open trade free-market harbor.'
        ],
        correctAnswer: 'To fiercely guard secret trade formulas like cristallo and protect the city from furnace fire hazards.',
        explanation: 'Paragraph 3 notes: "In Venice—and specifically the island of Murano—artisans guarded their trade secrets fiercely, producing cristallo, a remarkably clear glass."'
      },
      {
        id: 'glass_q8',
        questionNumber: 8,
        subject: 'Materials Science & Archaeology',
        prompt: 'What did Michael Owens invent in 1903 that mechanized bottle production?',
        options: [
          'An automatic bottle-blowing machine that automated glass mass production.',
          'A silica laser cutter for microchip manufacturing.',
          'A float-glass molten tin bath method for giant mirror sheets.',
          'The first insulated double-glazed windowpane system.'
        ],
        correctAnswer: 'An automatic bottle-blowing machine that automated glass mass production.',
        explanation: 'Paragraph 3 explicitly mentions "culminating in Michael Owens\' 1903 automatic bottle-blowing machine."'
      },
      {
        id: 'glass_q9',
        questionNumber: 9,
        subject: 'Materials Science & Archaeology',
        prompt: 'Which high-tech contemporary application demonstrates the ongoing evolution of silica glass?',
        options: [
          'Modern telecommunications fiber optics for ultra-fast digital data transmission.',
          'Biodegradable food packaging replacing all ocean plastics.',
          'Synthetic petroleum fuels distilled from silica sands.',
          'Liquid coolant replacing lithium in battery cells.'
        ],
        correctAnswer: 'Modern telecommunications fiber optics for ultra-fast digital data transmission.',
        explanation: 'The passage concludes by highlighting "modern telecommunications fiber optics" as the modern culmination of glass evolution.'
      },
      {
        id: 'glass_q10',
        questionNumber: 10,
        subject: 'Materials Science & Archaeology',
        prompt: 'What is the overall developmental trajectory of glass described in the passage?',
        options: [
          'From natural volcanic tools and luxury elite ornaments to an automated, ubiquitous technological material.',
          'From an ancient military weapon to a forgotten artisanal craft that vanished after Rome.',
          'From an exclusively decorative art into a toxic industrial pollutant currently banned.',
          'From an organic plant resin into a synthetic carbon polymer.'
        ],
        correctAnswer: 'From natural volcanic tools and luxury elite ornaments to an automated, ubiquitous technological material.',
        explanation: 'The passage synthesizes the arc: starting with obsidian tools and elite beads, advancing via Roman glassblowing, Venetian secrecy, 1903 automation, and modern fiber optics.'
      }
    ]
  },

  // 2. Reading: Urban Heat Islands & Green Architecture (Environmental Engineering & Urban Planning)
  {
    topic: 'Urban Heat Islands & Green Architecture',
    subject: 'Environmental Engineering & Urban Planning',
    module: 'Reading',
    difficulty: 'Advanced',
    passage: `In modern megacities, dense urban centers consistently experience significantly higher temperatures than their surrounding suburban and rural peripheries, a meteorological phenomenon known as the Urban Heat Island (UHI) effect. Concrete canyons, asphalt highways, and dark roofing materials absorb incoming solar radiation during daylight hours and re-radiate thermal energy throughout the night. Moreover, waste heat emitted by air conditioning compressors and internal combustion engines exacerbates localized atmospheric warming by up to 7°C.

To mitigate this dangerous thermal buildup, modern civil engineers and architects in Singapore and Tokyo are implementing living green roofs and vertical sky gardens. Vegetated roofs replace heat-absorbing dark bitumen with diverse sedum and perennial plant layers. Through biological evapotranspiration, plants draw soil moisture through root systems and release water vapor through foliage stomata, converting ambient sensible heat into latent heat. Studies show that green roofs can lower rooftop surface temperatures by up to 25°C and reduce building cooling energy consumption by 15–20%.`,
    questions: [
      {
        id: 'uhi_q1',
        questionNumber: 1,
        subject: 'Environmental Engineering & Urban Planning',
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
        id: 'uhi_q2',
        questionNumber: 2,
        subject: 'Environmental Engineering & Urban Planning',
        prompt: 'What meteorological phenomenon causes downtown cities to become hotter than surrounding peripheries?',
        options: [
          'The Urban Heat Island (UHI) effect.',
          'The Coriolis effect over coastal bays.',
          'Tropospheric thermal inversion fog.',
          'Geothermal mantle convection.'
        ],
        correctAnswer: 'The Urban Heat Island (UHI) effect.',
        explanation: 'Paragraph 1 explicitly identifies this as the "Urban Heat Island (UHI) effect."'
      },
      {
        id: 'uhi_q3',
        questionNumber: 3,
        subject: 'Environmental Engineering & Urban Planning',
        prompt: 'Which urban surfaces are singled out as primary absorbers of daytime solar radiation?',
        options: [
          'Concrete canyons, asphalt highways, and dark roofing materials.',
          'Glass windows and polished aluminum siding.',
          'Underground subway tunnels and sewer pipes.',
          'Municipal parks and decorative water fountains.'
        ],
        correctAnswer: 'Concrete canyons, asphalt highways, and dark roofing materials.',
        explanation: 'Paragraph 1 notes: "Concrete canyons, asphalt highways, and dark roofing materials absorb incoming solar radiation during daylight hours."'
      },
      {
        id: 'uhi_q4',
        questionNumber: 4,
        subject: 'Environmental Engineering & Urban Planning',
        prompt: 'By up to how much can waste heat from vehicle engines and air conditioners raise localized city air temperatures?',
        options: [
          'By up to 7°C.',
          'By exactly 1.5°C.',
          'By 15°C to 20°C.',
          'By less than 0.5°C.'
        ],
        correctAnswer: 'By up to 7°C.',
        explanation: 'Paragraph 1 states: "waste heat emitted by air conditioning compressors and internal combustion engines exacerbates localized atmospheric warming by up to 7°C."'
      },
      {
        id: 'uhi_q5',
        questionNumber: 5,
        subject: 'Environmental Engineering & Urban Planning',
        prompt: 'Which two forward-looking megacities are cited as leading adopters of living green roofs?',
        options: [
          'Singapore and Tokyo.',
          'London and Paris.',
          'New York and Los Angeles.',
          'Sydney and Melbourne.'
        ],
        correctAnswer: 'Singapore and Tokyo.',
        explanation: 'Paragraph 2 highlights "modern civil engineers and architects in Singapore and Tokyo."'
      },
      {
        id: 'uhi_q6',
        questionNumber: 6,
        subject: 'Environmental Engineering & Urban Planning',
        prompt: 'What conventional roofing material do living green roofs replace?',
        options: [
          'Heat-absorbing dark bitumen.',
          'Corrugated galvanized steel.',
          'Terracotta clay tiles.',
          'Polished architectural marble.'
        ],
        correctAnswer: 'Heat-absorbing dark bitumen.',
        explanation: 'Paragraph 2 states: "Vegetated roofs replace heat-absorbing dark bitumen with diverse sedum and perennial plant layers."'
      },
      {
        id: 'uhi_q7',
        questionNumber: 7,
        subject: 'Environmental Engineering & Urban Planning',
        prompt: 'By up to how many degrees Celsius can green roofs lower rooftop surface temperatures?',
        options: [
          'By up to 25°C.',
          'By only 2°C.',
          'By 50°C.',
          'By 10°C.'
        ],
        correctAnswer: 'By up to 25°C.',
        explanation: 'Paragraph 2 concludes: "Studies show that green roofs can lower rooftop surface temperatures by up to 25°C."'
      },
      {
        id: 'uhi_q8',
        questionNumber: 8,
        subject: 'Environmental Engineering & Urban Planning',
        prompt: 'What percentage reduction in building cooling energy consumption do studies attribute to green roofs?',
        options: [
          '15–20%.',
          '5–8%.',
          '45–50%.',
          'Over 80%.'
        ],
        correctAnswer: '15–20%.',
        explanation: 'Paragraph 2 notes green roofs "reduce building cooling energy consumption by 15–20%."'
      },
      {
        id: 'uhi_q9',
        questionNumber: 9,
        subject: 'Environmental Engineering & Urban Planning',
        prompt: 'What microscopic plant structures release water vapor to create the cooling latent heat effect?',
        options: [
          'Foliage stomata.',
          'Chloroplast membranes.',
          'Pollen grains.',
          'Root mycorrhizae.'
        ],
        correctAnswer: 'Foliage stomata.',
        explanation: 'Paragraph 2 specifies that plants "release water vapor through foliage stomata."'
      },
      {
        id: 'uhi_q10',
        questionNumber: 10,
        subject: 'Environmental Engineering & Urban Planning',
        prompt: 'Why do dark urban materials continue warming the air even after the sun sets?',
        options: [
          'They store absorbed solar heat and re-radiate thermal energy continuously throughout the night.',
          'They react chemically with nitrogen oxides in vehicle emissions.',
          'They prevent winds from entering subterranean subway networks.',
          'They block cloud condensation from precipitating.'
        ],
        correctAnswer: 'They store absorbed solar heat and re-radiate thermal energy continuously throughout the night.',
        explanation: 'Paragraph 1 explains that dark materials "absorb incoming solar radiation during daylight hours and re-radiate thermal energy throughout the night."'
      }
    ]
  },

  // 3. Reading: Microplastics in Marine Food Webs (Marine Ecology & Ecotoxicology)
  {
    topic: 'Microplastics in Marine Food Webs & Trophic Cascades',
    subject: 'Marine Ecology & Ecotoxicology',
    module: 'Reading',
    difficulty: 'Advanced',
    passage: `Microplastics—synthetic polymer particles measuring less than 5 millimeters in diameter—have infiltrated every ocean basin, from equatorial coral reefs to the Mariana Trench. These pollutants originate from two primary pathways: primary microplastics manufactured as cosmetic microbeads or pre-production pellets (nurdles), and secondary microplastics formed through the ultraviolet photo-degradation and mechanical fragmentation of discarded synthetic fishing gear and macro-plastics.

Due to their diminutive dimensions, microplastics overlap with the size range of natural phytoplankton and zooplankton. Primary marine filter feeders passively ingest these non-nutritive particles, resulting in pseudo-satiation: the organism feels artificially full while experiencing severe caloric starvation and internal gastrointestinal lacerations. Furthermore, synthetic polymers act as chemical sponges, absorbing hydrophobic persistent organic pollutants (such as PCBs and DDT) from seawater. As planktivorous fish consume thousands of affected zooplankton, these toxins bioaccumulate up the trophic ladder, reaching apex predators and human seafood consumers.`,
    questions: [
      {
        id: 'mp_q1',
        questionNumber: 1,
        subject: 'Marine Ecology & Ecotoxicology',
        prompt: 'Why do primary marine filter feeders like zooplankton ingest microplastic particles in large quantities?',
        options: [
          'Their passive feeding apparatus cannot distinguish microplastics from natural plankton of identical diameter.',
          'Microplastics emit biochemical pheromones that deliberately attract apex predators.',
          'Filter feeders actively consume plastic to extract synthetic hydrocarbon calories.',
          'Microplastics dissolve rapidly in seawater, releasing sweet organic nutrients.'
        ],
        correctAnswer: 'Their passive feeding apparatus cannot distinguish microplastics from natural plankton of identical diameter.',
        explanation: 'Paragraph 2 explains: "Due to their diminutive dimensions, microplastics overlap with the size range of natural phytoplankton and zooplankton. Primary marine filter feeders passively ingest these non-nutritive particles."'
      },
      {
        id: 'mp_q2',
        questionNumber: 2,
        subject: 'Marine Ecology & Ecotoxicology',
        prompt: 'What size threshold formally defines a synthetic plastic particle as a microplastic?',
        options: [
          'Measuring less than 5 millimeters in diameter.',
          'Measuring exactly 10 centimeters across.',
          'Measuring less than 1 nanometer.',
          'Measuring between 20 and 50 millimeters.'
        ],
        correctAnswer: 'Measuring less than 5 millimeters in diameter.',
        explanation: 'Paragraph 1 defines microplastics as "measuring less than 5 millimeters in diameter."'
      },
      {
        id: 'mp_q3',
        questionNumber: 3,
        subject: 'Marine Ecology & Ecotoxicology',
        prompt: 'What are primary microplastics as defined in the passage?',
        options: [
          'Particles intentionally manufactured at small scale, such as cosmetic microbeads and industrial nurdles.',
          'Shards broken off old fishing nets by ocean wave action.',
          'Decomposed plastic bottles bleached by solar UV radiation.',
          'Plastics produced exclusively by microbial marine bacteria.'
        ],
        correctAnswer: 'Particles intentionally manufactured at small scale, such as cosmetic microbeads and industrial nurdles.',
        explanation: 'Paragraph 1 distinguishes "primary microplastics manufactured as cosmetic microbeads or pre-production pellets (nurdles)."'
      },
      {
        id: 'mp_q4',
        questionNumber: 4,
        subject: 'Marine Ecology & Ecotoxicology',
        prompt: 'How are secondary microplastics formed in oceanic environments?',
        options: [
          'Through ultraviolet photo-degradation and mechanical fragmentation of larger plastic debris.',
          'Through high-pressure volcanic vents on the abyssal seafloor.',
          'By biological digestion inside the stomach of cetaceans.',
          'By precipitation of synthetic polymers from acid rain.'
        ],
        correctAnswer: 'Through ultraviolet photo-degradation and mechanical fragmentation of larger plastic debris.',
        explanation: 'Paragraph 1 states they are "formed through the ultraviolet photo-degradation and mechanical fragmentation of discarded synthetic fishing gear and macro-plastics."'
      },
      {
        id: 'mp_q5',
        questionNumber: 5,
        subject: 'Marine Ecology & Ecotoxicology',
        prompt: 'What physiological crisis is termed "pseudo-satiation" in affected marine organisms?',
        options: [
          'Feeling artificially full from indigestible plastic while undergoing severe caloric starvation.',
          'An addiction to synthetic petroleum flavor molecules.',
          'The inability to regulate internal blood pressure.',
          'A rapid increase in reproductive fertility.'
        ],
        correctAnswer: 'Feeling artificially full from indigestible plastic while undergoing severe caloric starvation.',
        explanation: 'Paragraph 2 defines it: "the organism feels artificially full while experiencing severe caloric starvation and internal gastrointestinal lacerations."'
      },
      {
        id: 'mp_q6',
        questionNumber: 6,
        subject: 'Marine Ecology & Ecotoxicology',
        prompt: 'Why are microplastics described as behaving like "chemical sponges" in seawater?',
        options: [
          'They absorb hydrophobic persistent organic pollutants such as PCBs and DDT from seawater.',
          'They absorb pure freshwater and turn it into toxic brine.',
          'They expand to twenty times their original size upon contact with plankton.',
          'They neutralize heavy metals and purify the oceanic water column.'
        ],
        correctAnswer: 'They absorb hydrophobic persistent organic pollutants such as PCBs and DDT from seawater.',
        explanation: 'Paragraph 2 highlights that "synthetic polymers act as chemical sponges, absorbing hydrophobic persistent organic pollutants (such as PCBs and DDT) from seawater."'
      },
      {
        id: 'mp_q7',
        questionNumber: 7,
        subject: 'Marine Ecology & Ecotoxicology',
        prompt: 'What ecological process causes toxins absorbed by microplastics to amplify toward apex predators?',
        options: [
          'Biomagnification and bioaccumulation through the trophic food web.',
          'Photosynthetic assimilation.',
          'Atmospheric nitrogen fixation.',
          'Thermal desalination.'
        ],
        correctAnswer: 'Biomagnification and bioaccumulation through the trophic food web.',
        explanation: 'Paragraph 2 notes that "these toxins bioaccumulate up the trophic ladder, reaching apex predators and human seafood consumers."'
      },
      {
        id: 'mp_q8',
        questionNumber: 8,
        subject: 'Marine Ecology & Ecotoxicology',
        prompt: 'What geographic depth cited in the passage proves the ubiquitous spread of microplastics?',
        options: [
          'The Mariana Trench, the deepest trench on Earth.',
          'The Great Barrier Reef reef-crest only.',
          'Lake Baikal in Siberia.',
          'Surface waters of the North Sea.'
        ],
        correctAnswer: 'The Mariana Trench, the deepest trench on Earth.',
        explanation: 'Paragraph 1 states microplastics have infiltrated "from equatorial coral reefs to the Mariana Trench."'
      },
      {
        id: 'mp_q9',
        questionNumber: 9,
        subject: 'Marine Ecology & Ecotoxicology',
        prompt: 'Besides starvation, what internal physical harm do ingested microplastics inflict on marine life?',
        options: [
          'Internal gastrointestinal lacerations and physical tissue damage.',
          'Hardening of the external exoskeleton.',
          'Loss of swimming fins due to plastic toxicity.',
          'Total destruction of acoustic hearing chambers.'
        ],
        correctAnswer: 'Internal gastrointestinal lacerations and physical tissue damage.',
        explanation: 'Paragraph 2 explicitly mentions organisms experience "internal gastrointestinal lacerations."'
      },
      {
        id: 'mp_q10',
        questionNumber: 10,
        subject: 'Marine Ecology & Ecotoxicology',
        prompt: 'Why does the contamination of zooplankton ultimately pose a risk to human health?',
        options: [
          'Planktivorous fish eat thousands of contaminated zooplankton, and humans consume these bioaccumulated fish.',
          'Plankton produce toxic gases that alter coastal breathable air.',
          'Microplastics in plankton eradicate all global commercial shipping routes.',
          'Plankton migrate onto agricultural soils during high tide.'
        ],
        correctAnswer: 'Planktivorous fish eat thousands of contaminated zooplankton, and humans consume these bioaccumulated fish.',
        explanation: 'The passage concludes: "As planktivorous fish consume thousands of affected zooplankton, these toxins bioaccumulate up the trophic ladder, reaching apex predators and human seafood consumers."'
      }
    ]
  },

  // 4. Listening: University Tutorial on Microbial PHA Bioplastics (Industrial Biotechnology)
  {
    topic: 'University Tutorial: Microbial Synthesis of PHA Bioplastics',
    subject: 'Industrial Biotechnology & Sustainable Materials',
    module: 'Listening',
    difficulty: 'Advanced',
    audioTranscript: `Dr. Thorne: Elena, welcome. Let's look over your preliminary methodology for synthesizing polyhydroxyalkanoates—PHA bioplastics—using agricultural food waste.
Elena: Thank you, Dr. Thorne. In my initial trials, our Cupriavidus necator bacterial cultures grew rapidly on glucose and fruit molasses, but the actual intracellular accumulation of PHA granules was lower than expected—only around 22% of dry cell weight.
Dr. Thorne: That is a classic stumbling block. Remember the biochemical trigger: bacteria only accumulate PHA as an energy reserve when they experience nutrient starvation in the presence of excess carbon. If you provide abundant nitrogen and phosphorus throughout the entire fermentation cycle, the bacteria simply divide and replicate instead of manufacturing bioplastic granules.
Elena: So I need a two-stage fermentation?
Dr. Thorne: Exactly. In stage one, provide optimal nitrogen and minerals to maximize total bacterial cell biomass. In stage two, deliberately starve the culture of nitrogen while continuing to feed excess carbon. This physiological stress forces the cells to halt division and convert up to 75% of their internal cell mass into dense PHA polyester granules.`,
    questions: [
      {
        id: 'pha_q1',
        questionNumber: 1,
        subject: 'Industrial Biotechnology & Sustainable Materials',
        prompt: 'What procedural change did Dr. Thorne advise Elena to implement to maximize bioplastic yield?',
        options: [
          'Deliberately restrict nitrogen in the second growth stage while continuing to feed excess carbon.',
          'Heat the fermentation vat to over 85 degrees Celsius to accelerate bacterial reproduction.',
          'Replace all microbial bacterial strains with synthetic petroleum catalysts.',
          'Filter out all fruit molasses substrates prior to inoculating the culture.'
        ],
        correctAnswer: 'Deliberately restrict nitrogen in the second growth stage while continuing to feed excess carbon.',
        explanation: 'Dr. Thorne states: "In stage two, deliberately starve the culture of nitrogen while continuing to feed excess carbon. This physiological stress forces the cells to halt division and convert up to 75% of their internal cell mass into dense PHA polyester granules."'
      },
      {
        id: 'pha_q2',
        questionNumber: 2,
        subject: 'Industrial Biotechnology & Sustainable Materials',
        prompt: 'What raw agricultural feedstock is Elena utilizing as carbon substrates in her trials?',
        options: [
          'Glucose and fruit molasses derived from food waste.',
          'Crude unrefined petroleum distillate.',
          'Recycled polyethylene terephthalate pellets.',
          'Hardwood timber sawdust soaked in bleach.'
        ],
        correctAnswer: 'Glucose and fruit molasses derived from food waste.',
        explanation: 'Elena explains her cultures "grew rapidly on glucose and fruit molasses."'
      },
      {
        id: 'pha_q3',
        questionNumber: 3,
        subject: 'Industrial Biotechnology & Sustainable Materials',
        prompt: 'What bacterial species is Elena cultivating in her fermentation experiments?',
        options: [
          'Cupriavidus necator.',
          'Escherichia coli K-12.',
          'Bacillus subtilis.',
          'Saccharomyces cerevisiae.'
        ],
        correctAnswer: 'Cupriavidus necator.',
        explanation: 'Elena explicitly names "our Cupriavidus necator bacterial cultures."'
      },
      {
        id: 'pha_q4',
        questionNumber: 4,
        subject: 'Industrial Biotechnology & Sustainable Materials',
        prompt: 'What was the initial intracellular PHA accumulation rate Elena obtained before consulting Dr. Thorne?',
        options: [
          'Approximately 22% of dry cell weight.',
          'Over 90% of total wet weight.',
          'Less than 1% trace amounts.',
          'Exactly 50% dry cell weight.'
        ],
        correctAnswer: 'Approximately 22% of dry cell weight.',
        explanation: 'Elena mentions it was "lower than expected—only around 22% of dry cell weight."'
      },
      {
        id: 'pha_q5',
        questionNumber: 5,
        subject: 'Industrial Biotechnology & Sustainable Materials',
        prompt: 'Why do bacteria synthesize and store PHA granules in natural environments?',
        options: [
          'As an intracellular energy and carbon reserve during times of nutrient stress.',
          'To construct an impermeable outer capsule against viral bacteriophages.',
          'To generate heat through spontaneous biochemical combustion.',
          'To anchor bacterial flagella to host plant leaves.'
        ],
        correctAnswer: 'As an intracellular energy and carbon reserve during times of nutrient stress.',
        explanation: 'Dr. Thorne explains: "bacteria only accumulate PHA as an energy reserve when they experience nutrient starvation in the presence of excess carbon."'
      },
      {
        id: 'pha_q6',
        questionNumber: 6,
        subject: 'Industrial Biotechnology & Sustainable Materials',
        prompt: 'What happens to the bacteria if nitrogen and phosphorus remain abundant throughout the entire fermentation?',
        options: [
          'The cells prioritize rapid division and replication instead of accumulating bioplastic granules.',
          'The bacteria suffer catastrophic osmotic lysis and rupture.',
          'The cultures immediately produce toxic greenhouse methane gases.',
          'The medium solidifies into an irreversible crystalline gel.'
        ],
        correctAnswer: 'The cells prioritize rapid division and replication instead of accumulating bioplastic granules.',
        explanation: 'Dr. Thorne warns: "the bacteria simply divide and replicate instead of manufacturing bioplastic granules."'
      },
      {
        id: 'pha_q7',
        questionNumber: 7,
        subject: 'Industrial Biotechnology & Sustainable Materials',
        prompt: 'What is the primary operational objective of Stage One in the two-stage fermentation method?',
        options: [
          'To maximize total bacterial cell biomass with balanced nutrients and minerals.',
          'To completely sterilize all bacterial colonies with ultraviolet radiation.',
          'To extract and crystallize bioplastic polymers from dead cells.',
          'To starve the cells of oxygen to promote anaerobic fermentation.'
        ],
        correctAnswer: 'To maximize total bacterial cell biomass with balanced nutrients and minerals.',
        explanation: 'Dr. Thorne notes: "In stage one, provide optimal nitrogen and minerals to maximize total bacterial cell biomass."'
      },
      {
        id: 'pha_q8',
        questionNumber: 8,
        subject: 'Industrial Biotechnology & Sustainable Materials',
        prompt: 'To what maximum percentage of internal dry cell mass can PHA accumulation reach in Stage Two?',
        options: [
          'Up to 75% of internal dry cell weight.',
          'Exactly 33%.',
          'A maximum of 50%.',
          'Nearly 100% with no cellular remnants.'
        ],
        correctAnswer: 'Up to 75% of internal dry cell weight.',
        explanation: 'Dr. Thorne specifies: "convert up to 75% of their internal cell mass into dense PHA polyester granules."'
      },
      {
        id: 'pha_q9',
        questionNumber: 9,
        subject: 'Industrial Biotechnology & Sustainable Materials',
        prompt: 'What biochemical class of materials do polyhydroxyalkanoates (PHAs) belong to?',
        options: [
          'Bio-polyesters.',
          'Polypeptide proteins.',
          'Synthetic polyvinyl chlorides.',
          'Cellulosic starches.'
        ],
        correctAnswer: 'Bio-polyesters.',
        explanation: 'Dr. Thorne describes the synthesized product as "dense PHA polyester granules."'
      },
      {
        id: 'pha_q10',
        questionNumber: 10,
        subject: 'Industrial Biotechnology & Sustainable Materials',
        prompt: 'What environmental advantage does PHA bioplastic possess over traditional petroleum plastics?',
        options: [
          'It is biologically synthesized from renewable organic waste and biodegradable in natural soil and marine environments.',
          'It is completely indestructible and will persist in landfills for 10,000 years.',
          'It costs zero energy to manufacture and requires no chemical purification.',
          'It can be converted directly into nuclear fuel rods.'
        ],
        correctAnswer: 'It is biologically synthesized from renewable organic waste and biodegradable in natural soil and marine environments.',
        explanation: 'The context of the tutorial centers on synthesizing sustainable bioplastics from agricultural food waste using bacterial fermentation.'
      }
    ]
  },

  // 5. Cross-Disciplinary Mix & Match Exam Prep Set (Comprehensive Academic Challenge)
  {
    topic: 'Comprehensive Academic Mix & Match Practice Test (10 Questions)',
    subject: 'Cross-Disciplinary Academic Reasoning',
    module: 'Reading',
    difficulty: 'Advanced',
    passage: `This comprehensive multi-disciplinary practice test evaluates inter-domain academic reasoning across physical sciences, ecological systems, cognitive linguistics, and sustainable technology. Candidates must synthesize data from materials science, neurobiology, urban climate mitigation, and biochemical synthesis to evaluate evidence, deduce causal mechanisms, and analyze authorial conclusions.`,
    questions: [
      {
        id: 'mix_q1',
        questionNumber: 1,
        subject: 'Cross-Disciplinary Academic Reasoning',
        prompt: 'In materials science, why was the 1st-century BCE invention of glassblowing considered transformative?',
        options: [
          'It transitioned hollow glass from a rare elite luxury into an affordable, ubiquitous domestic commodity.',
          'It replaced all bronze and iron tools with natural obsidian blades.',
          'It allowed glass to be manufactured without high-temperature furnaces.',
          'It restricted domestic storage vessels strictly to military armories.'
        ],
        correctAnswer: 'It transitioned hollow glass from a rare elite luxury into an affordable, ubiquitous domestic commodity.',
        explanation: 'Glassblowing drastically lowered the time and cost required to produce hollow containers.'
      },
      {
        id: 'mix_q2',
        questionNumber: 2,
        subject: 'Cross-Disciplinary Academic Reasoning',
        prompt: 'In environmental engineering, how do vegetated green roofs counter the Urban Heat Island effect?',
        options: [
          'By utilizing plant evapotranspiration to convert ambient sensible heat into latent heat.',
          'By reflecting 100% of cosmic solar rays into outer space.',
          'By drawing subterranean glacial water into air conditioning ducts.',
          'By converting atmospheric carbon dioxide into liquid oxygen.'
        ],
        correctAnswer: 'By utilizing plant evapotranspiration to convert ambient sensible heat into latent heat.',
        explanation: 'Evapotranspiration cools roofs by up to 25°C through biological moisture release from foliage stomata.'
      },
      {
        id: 'mix_q3',
        questionNumber: 3,
        subject: 'Cross-Disciplinary Academic Reasoning',
        prompt: 'In marine ecotoxicology, what hazard arises when zooplankton passively ingest microplastics?',
        options: [
          'Organisms suffer pseudo-satiation and caloric starvation while absorbing bioaccumulating persistent organic pollutants.',
          'Zooplankton grow twenty times their natural size, disrupting fish predation.',
          'Microplastics dissolve into harmless sugars that accelerate jellyfish reproduction.',
          'Filter feeders acquire genetic resistance against deep-sea pressure.'
        ],
        correctAnswer: 'Organisms suffer pseudo-satiation and caloric starvation while absorbing bioaccumulating persistent organic pollutants.',
        explanation: 'Microplastics trick marine filter feeders into feeling full while starving them and transferring toxic PCBs and DDT up the food chain.'
      },
      {
        id: 'mix_q4',
        questionNumber: 4,
        subject: 'Cross-Disciplinary Academic Reasoning',
        prompt: 'In industrial biotechnology, what metabolic condition triggers Cupriavidus necator bacteria to synthesize PHA bioplastics?',
        options: [
          'Nutrient nitrogen limitation in the presence of an abundant carbon source.',
          'Total absence of all carbon and water molecules.',
          'Excess nitrogen and phosphorus supplied during all growth phases.',
          'Exposure to intense gamma radiation at boiling temperatures.'
        ],
        correctAnswer: 'Nutrient nitrogen limitation in the presence of an abundant carbon source.',
        explanation: 'Bacterial PHA granules accumulate as energy reserves when nitrogen is deliberately restricted in Stage 2 while feeding excess carbon.'
      },
      {
        id: 'mix_q5',
        questionNumber: 5,
        subject: 'Cross-Disciplinary Academic Reasoning',
        prompt: 'In neurobiology, what cognitive reserve benefit has epidemiological research associated with lifelong bilingualism?',
        options: [
          'A measurable delay of 4 to 5 years in the onset of clinical symptoms of dementia and Alzheimer\'s.',
          'An absolute prevention of all genetic neurological conditions.',
          'The complete elimination of working memory fatigue in high-stress tasks.',
          'A permanent reduction in prefrontal cortex neural activation.'
        ],
        correctAnswer: 'A measurable delay of 4 to 5 years in the onset of clinical symptoms of dementia and Alzheimer\'s.',
        explanation: 'Managing dual language networks exercises executive prefrontal control, creating cognitive reserve that buffers neurodegeneration.'
      },
      {
        id: 'mix_q6',
        questionNumber: 6,
        subject: 'Cross-Disciplinary Academic Reasoning',
        prompt: 'In grid energy storage, what fundamental architecture differentiates vanadium redox flow batteries from lithium-ion cells?',
        options: [
          'Decoupled power and energy storage, allowing capacity expansion simply by sizing electrolyte tanks.',
          'A requirement for consumable lithium metal foil cathodes.',
          'Inability to operate for more than 200 total cycles without replacing membranes.',
          'Reliance on highly pressurized methane gas combustion chambers.'
        ],
        correctAnswer: 'Decoupled power and energy storage, allowing capacity expansion simply by sizing electrolyte tanks.',
        explanation: 'Flow batteries store energy in external liquid vanadium electrolyte tanks, decoupling power output (stack) from total energy capacity (tanks).'
      },
      {
        id: 'mix_q7',
        questionNumber: 7,
        subject: 'Cross-Disciplinary Academic Reasoning',
        prompt: 'In Mesoamerican archaeology, how did LiDAR technology reshape understandings of ancient Maya agriculture?',
        options: [
          'It revealed extensive raised agricultural fields and engineered drainage canals in tropical wetlands.',
          'It proved the Maya lived exclusively in high desert caves without farming.',
          'It demonstrated that all Maya cities were connected by underwater steam tunnels.',
          'It established that slash-and-burn farming was the only agricultural method ever deployed.'
        ],
        correctAnswer: 'It revealed extensive raised agricultural fields and engineered drainage canals in tropical wetlands.',
        explanation: 'LiDAR penetrated jungle foliage to uncover engineered wetland raised fields and canal grids supporting millions.'
      },
      {
        id: 'mix_q8',
        questionNumber: 8,
        subject: 'Cross-Disciplinary Academic Reasoning',
        prompt: 'In behavioral economics, what judicial finding illustrated the impact of decision fatigue?',
        options: [
          'Parole approval rates peaked after morning and meal breaks but approached zero as mental fatigue accumulated.',
          'Judges made completely random rulings regardless of time or nourishment.',
          'Judges became significantly more lenient and reckless when exhausted.',
          'Fatigue accelerated complex analytical calculations without introducing errors.'
        ],
        correctAnswer: 'Parole approval rates peaked after morning and meal breaks but approached zero as mental fatigue accumulated.',
        explanation: 'Depleted executive cognitive reserves cause decision-makers to subconsciously favor the risk-averse status quo (denying parole).'
      },
      {
        id: 'mix_q9',
        questionNumber: 9,
        subject: 'Cross-Disciplinary Academic Reasoning',
        prompt: 'In academic writing, what criterion is most crucial for achieving an IELTS Band 8.5+ in Task Achievement?',
        options: [
          'Fully addressing all parts of the prompt with a well-developed, clear thesis and supported ideas.',
          'Using extremely long, convoluted sentences that exceed 60 words each.',
          'Copying paragraphs directly from the exam prompt without changes.',
          'Avoiding all paragraphs and submitting a single continuous wall of text.'
        ],
        correctAnswer: 'Fully addressing all parts of the prompt with a well-developed, clear thesis and supported ideas.',
        explanation: 'Band 8+ Task Achievement requires a clear position throughout, comprehensive coverage of prompt facets, and thoroughly developed main points.'
      },
      {
        id: 'mix_q10',
        questionNumber: 10,
        subject: 'Cross-Disciplinary Academic Reasoning',
        prompt: 'Across all these scientific domains, what common principle unites effective technological problem-solving?',
        options: [
          'Understanding underlying natural mechanisms and optimizing sustainable, evidence-based systems.',
          'Relying solely on intuition and avoiding empirical experimentation.',
          'Maximizing short-term consumption without regard for ecological or cognitive limits.',
          'Abandoning historical discoveries in favor of unverified speculative theories.'
        ],
        correctAnswer: 'Understanding underlying natural mechanisms and optimizing sustainable, evidence-based systems.',
        explanation: 'Whether in materials engineering, ecology, clean energy, or cognitive science, progress depends on mechanistic understanding and sustainable design.'
      }
    ]
  }
];
