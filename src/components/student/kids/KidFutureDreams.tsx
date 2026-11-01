import React, { useState } from 'react';
import {
  Briefcase,
  Sparkles,
  Volume2,
  Award,
  CheckCircle2,
  Download,
  Star,
  Heart,
  FileCheck,
  Code2,
  Cpu,
  Shield,
  Layers,
  ArrowRight
} from 'lucide-react';
import { UserProfile } from '../../../types';
import { sound } from '../../../utils/audio';
import { SpeechService } from '../../../services/speechService';
import { calculateAge } from '../../../utils/userProfile';

export type KidAgeStage = 'early' | 'junior' | 'teen';

interface KidFutureDreamsProps {
  profile: UserProfile;
}

interface CareerDreamItem {
  id: string;
  stage: KidAgeStage;
  title: string;
  emoji: string;
  tagline: string;
  description: string;
  gearOrStack: string[];
  missions: string[];
  bgColor: string;
}

export const KidFutureDreams: React.FC<KidFutureDreamsProps> = ({ profile }) => {
  const userAge = calculateAge(profile?.dateOfBirth);
  const defaultStage: KidAgeStage = userAge <= 7 ? 'early' : userAge <= 10 ? 'junior' : 'teen';
  const [currentStage, setCurrentStage] = useState<KidAgeStage>(defaultStage);

  const careers: CareerDreamItem[] = [
    // ----------------------------------------------------
    // STAGE 1: AGES 3–7 (Early Explorers)
    // ----------------------------------------------------
    {
      id: 'e_astro',
      stage: 'early',
      title: 'Astronaut Space Explorer',
      emoji: '🚀',
      tagline: 'Fly rockets to Mars and bounce on the Moon!',
      description: 'Fly silver rockets past the clouds into outer space, float in zero gravity, and discover sparkling new planets!',
      gearOrStack: ['Space Helmet 👩‍🚀', 'Jetpack 🎒', 'Moon Flag 🚩', 'Telescope 🔭'],
      missions: ['Count 5 twinkling stars tonight', 'Build a toy spaceship', 'Learn the word "Orbit"'],
      bgColor: 'from-indigo-500 to-purple-600'
    },
    {
      id: 'e_vet',
      stage: 'early',
      title: 'Animal Doctor & Vet',
      emoji: '🩺',
      tagline: 'Care for puppies, cuddle kittens, and heal horses!',
      description: 'Listen to puppy heartbeats, bandage broken bird wings, and give kittens healthy medicine so they purr with happiness!',
      gearOrStack: ['Stethoscope 🩺', 'Puppy Treats 🦴', 'Soft Bandage 🩹', 'Pet Brush 🪮'],
      missions: ['Give fresh water to an animal', 'Learn healthy foods for puppies', 'Practice gentle listening'],
      bgColor: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'e_artist',
      stage: 'early',
      title: 'Master Cartoon Artist',
      emoji: '🎨',
      tagline: 'Draw magical cartoons and paint colorful storybooks!',
      description: 'Paint giant rainbow murals, design friendly superhero cartoons, and bring storybooks to life with bright watercolors!',
      gearOrStack: ['Paint Palette 🎨', 'Magic Brushes 🖌️', 'Sketchbook 📒', 'Glitter Pens ✨'],
      missions: ['Draw a picture of your family', 'Mix red & yellow for orange', 'Invent a friendly character'],
      bgColor: 'from-pink-500 to-rose-600'
    },
    {
      id: 'e_fire',
      stage: 'early',
      title: 'Brave Hero Firefighter',
      emoji: '🚒',
      tagline: 'Drive the big red fire engine and rescue fluffy pets!',
      description: 'Rush to the rescue in huge red fire engines with loud sirens, extinguish fires with water hoses, and rescue cats from trees!',
      gearOrStack: ['Red Helmet 🪖', 'Fire Engine 🚒', 'Water Hose 💦', 'Rescue Ladder 🪜'],
      missions: ['Learn your home phone number', 'Find two emergency exits', 'Practice Stop, Drop, & Roll'],
      bgColor: 'from-rose-500 to-amber-600'
    },

    // ----------------------------------------------------
    // STAGE 2: AGES 8–10 (Junior Inventors)
    // ----------------------------------------------------
    {
      id: 'j_game',
      stage: 'junior',
      title: 'Video Game Designer & Roblox Coder',
      emoji: '🎮',
      tagline: 'Build 3D adventure worlds, script multiplayer quests, and design heroes!',
      description: 'Program interactive game mechanics, craft vibrant 3D environments, design boss battles, and build experiences played by millions of friends around the globe!',
      gearOrStack: ['Lua / Python', 'Block Coding', 'Level Design Canvas', 'Game Physics Engine'],
      missions: ['Storyboard a 3-level platformer game', 'Program a character jumping mechanic', 'Design a friendly non-player guide NPC'],
      bgColor: 'from-violet-600 to-indigo-600'
    },
    {
      id: 'j_robot',
      stage: 'junior',
      title: 'Robotics & Autonomous Rover Builder',
      emoji: '🤖',
      tagline: 'Wire motorized gears, program sensor brains, and build space rovers!',
      description: 'Assemble mechanical arms, calibrate ultrasonic obstacle sensors, and code autonomous rover navigation to explore uncharted territory!',
      gearOrStack: ['Micro:bit / Arduino', 'Ultrasonic Sensors', 'Servo Motors', 'Cardboard Prototyping'],
      missions: ['Wire a circuit with a light-emitting diode', 'Code an obstacle-avoiding loop', 'Build a mechanical grabber arm'],
      bgColor: 'from-blue-600 to-cyan-600'
    },
    {
      id: 'j_wild',
      stage: 'junior',
      title: 'Wildlife Biologist & Rainforest Ranger',
      emoji: '🌿',
      tagline: 'Track endangered snow leopards, study coral reefs, and protect habitats!',
      description: 'Set up motion-activated trail cameras, analyze animal genetics in mobile research labs, and defend biodiversity against environmental threats!',
      gearOrStack: ['GPS Field Tracker', 'Water Quality Tester', 'Wildlife Binoculars', 'DNA Specimen Vials'],
      missions: ['Map 5 bird species in your neighborhood', 'Test local tap water vs rainwater pH', 'Create a wildlife conservation poster'],
      bgColor: 'from-emerald-600 to-green-700'
    },
    {
      id: 'j_architect',
      stage: 'junior',
      title: 'Green Architect & Eco-City Planner',
      emoji: '🏗️',
      tagline: 'Design solar skyscrapers, rooftop gardens, and futuristic bridges!',
      description: 'Model zero-emission smart towers using sustainable bamboo and recycled glass, powered by wind turbines and integrated with electric transit!',
      gearOrStack: ['3D CAD Modeling', 'Isometric Grid Sketching', 'Solar Cell Modules', 'Scale Ruler (1:100)'],
      missions: ['Sketch a solar-powered treehouse school', 'Build a load-bearing bridge from 20 straws', 'Calculate daily rainwater harvesting volume'],
      bgColor: 'from-teal-600 to-cyan-700'
    },

    // ----------------------------------------------------
    // STAGE 3: AGES 11–17 (Teen Titans & STEM)
    // ----------------------------------------------------
    {
      id: 't_ai',
      stage: 'teen',
      title: 'AI & Machine Learning Research Scientist',
      emoji: '🧠',
      tagline: 'Architect neural networks, train large language models, and solve frontier science!',
      description: 'Design deep neural networks, optimize transformer attention mechanisms, fine-tune open-weight models, and build autonomous agents that accelerate medical discovery!',
      gearOrStack: ['Python 3.12', 'PyTorch / JAX', 'Transformers & HuggingFace', 'CUDA GPU Clusters'],
      missions: ['Implement linear regression from scratch in Python', 'Train an image classifier on CIFAR-10', 'Build a local retrieval-augmented chatbot'],
      bgColor: 'from-indigo-700 to-purple-800'
    },
    {
      id: 't_cyber',
      stage: 'teen',
      title: 'Cybersecurity & Ethical Penetration Tester',
      emoji: '🛡️',
      tagline: 'Defend critical infrastructure, decrypt cryptographic ciphers, and patch vulnerabilities!',
      description: 'Audit network security postures, analyze binary vulnerabilities, engineer cryptographic defense layers, and protect global financial networks against threat actors!',
      gearOrStack: ['Linux Terminal', 'Wireshark Network Capture', 'RSA & AES Cryptography', 'Python Security Scripts'],
      missions: ['Configure an encrypted SSH key tunnel', 'Analyze HTTP network traffic packets in Wireshark', 'Decrypt a Caesar and Vigenère cipher'],
      bgColor: 'from-slate-800 to-cyan-900'
    },
    {
      id: 't_bio',
      stage: 'teen',
      title: 'Biomedical Engineer & CRISPR Geneticist',
      emoji: '🧬',
      tagline: 'Engineer gene therapies, design prosthetic robotics, and eradicate illnesses!',
      description: 'Harness CRISPR-Cas9 genome editing, simulate protein folding conformations, and create neuro-prosthetic limb interfaces connected directly to the nervous system!',
      gearOrStack: ['CRISPR-Cas9 Protocols', 'PyMOL Molecular Visualizer', 'Bioinformatics BLAST', 'Biomechatronic Sensors'],
      missions: ['Model a DNA transcription codon table', 'Simulate a protein alpha-helix in PyMOL', 'Design a 3D-printable finger prosthetic joint'],
      bgColor: 'from-rose-700 to-purple-900'
    },
    {
      id: 't_aero',
      stage: 'teen',
      title: 'Aerospace & Orbital Propulsion Engineer',
      emoji: '🚀',
      tagline: 'Compute orbital transfer trajectories, design rocket thrusters, and reach deep space!',
      description: 'Calculate Hohmann transfer orbits, run computational fluid dynamics on supersonic nozzles, and build ion propulsion engines for missions to Europa and Titan!',
      gearOrStack: ['Orbital Kinematics ($v^2 = \mu(2/r - 1/a)$)', 'Computational Fluid Dynamics', 'Kerbal Rocket Physics', 'MATLAB / Python'],
      missions: ['Calculate the delta-v needed for low Earth orbit', 'Simulate a rocket stage staging separation', 'Graph Mach number shockwaves across a nosecone'],
      bgColor: 'from-blue-700 to-slate-900'
    }
  ];

  const activeCareers = careers.filter((c) => c.stage === currentStage);
  const [selectedCareer, setSelectedCareer] = useState<CareerDreamItem>(activeCareers[0] || careers[0]);
  const [favoriteId, setFavoriteId] = useState<string>(activeCareers[0]?.id || 'e_astro');
  const [showCertificate, setShowCertificate] = useState(false);
  const [completedMissions, setCompletedMissions] = useState<{ [key: string]: boolean }>({});

  const speak = (text: string) => {
    sound.playClick();
    if (SpeechService.isSynthesisSupported()) {
      SpeechService.speak(text, 'en-US');
    }
  };

  const handleSelect = (career: CareerDreamItem) => {
    sound.playClick();
    setSelectedCareer(career);
    speak(`${career.title}! ${career.tagline}`);
  };

  const handleSetFavorite = (career: CareerDreamItem) => {
    sound.playLevelUp();
    setFavoriteId(career.id);
    speak(`Awesome! ${career.title} is now your primary target career exploration path!`);
  };

  const handleToggleMission = (mText: string) => {
    sound.playSuccess();
    setCompletedMissions((prev) => ({ ...prev, [mText]: !prev[mText] }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header with Age Stage Switcher */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-3 top-3 opacity-15 text-8xl select-none pointer-events-none">
          💼
        </div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-blue-100 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
              Future Dreams &amp; Career Pathways
            </span>
            <span className="text-xs font-bold text-blue-100">
              {currentStage === 'early' && '• Level 1: When I Grow Up Explorer'}
              {currentStage === 'junior' && '• Level 2: Game Dev, Robotics & Green Architecture'}
              {currentStage === 'teen' && '• Level 3: AI Research, Cybersecurity & Aerospace'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Future Dreams &amp; Ambitions</span>
            <span className="text-3xl">🚀💼✨</span>
          </h2>
          <p className="text-sm font-medium text-blue-100 leading-relaxed">
            Discover real-world careers, inspect required tools &amp; stacks, complete milestone projects, and earn honors certificates!
          </p>

          {/* Age Tier Selector Tabs */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            {[
              { id: 'early', label: '🧸 Ages 3–7 (Early Explorers)' },
              { id: 'junior', label: '🚀 Ages 8–10 (Junior Inventors)' },
              { id: 'teen', label: '⚡ Ages 11–17 (Teen Titans & STEM)' }
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => {
                  sound.playClick();
                  setCurrentStage(st.id as KidAgeStage);
                  const firstInStage = careers.find((c) => c.stage === st.id);
                  if (firstInStage) setSelectedCareer(firstInStage);
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-xs ${
                  currentStage === st.id
                    ? 'bg-amber-400 text-slate-950 ring-2 ring-white scale-102 font-extrabold'
                    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-md border border-white/25'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Career Grid for Current Stage */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Select a Dream Pathway to Explore:</span>
          </h4>
          <button
            onClick={() => {
              sound.playSuccess();
              setShowCertificate(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-xs transition-all cursor-pointer"
          >
            <Award className="w-3.5 h-3.5" />
            <span>View Honors Certificate 📜</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {activeCareers.map((c) => {
            const isSelected = selectedCareer.id === c.id;
            const isFav = favoriteId === c.id;

            return (
              <div
                key={c.id}
                onClick={() => handleSelect(c)}
                className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between text-center space-y-2 hover:scale-102 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-md ring-2 ring-indigo-200'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="relative">
                  <div className="text-4xl my-1">{c.emoji}</div>
                  {isFav && <span className="absolute -top-1 -right-1 text-base">⭐</span>}
                </div>
                <div>
                  <div className="font-black text-xs sm:text-sm text-slate-900 leading-tight">{c.title}</div>
                  <div className="text-[10px] text-slate-500 mt-1 line-clamp-2">{c.tagline}</div>
                </div>

                <div className="pt-1">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {isSelected ? 'Viewing' : 'Inspect'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Career Detailed Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${selectedCareer.bgColor} text-white font-black text-3xl flex items-center justify-center shadow-md`}>
              {selectedCareer.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900">{selectedCareer.title}</h3>
                {favoriteId === selectedCareer.id && (
                  <span className="text-xs font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                    <span>⭐</span>
                    <span>Target Dream</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">{selectedCareer.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => speak(`${selectedCareer.title}! ${selectedCareer.description}`)}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              title="Hear description aloud"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleSetFavorite(selectedCareer)}
              className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-950 font-black text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>⭐</span>
              <span>Set as My #1 Target</span>
            </button>
          </div>
        </div>

        {/* Narrative Description */}
        <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-xs text-indigo-950 leading-relaxed font-medium">
          {selectedCareer.description}
        </div>

        {/* Required Tools / Tech Stack */}
        <div className="space-y-2">
          <div className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <span>🛠️ Tools, Gear &amp; Technologies:</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {selectedCareer.gearOrStack.map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center font-bold text-xs text-slate-800"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Milestone Missions */}
        <div className="space-y-3">
          <div className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <span>🎯 3 Foundation Projects &amp; Milestone Challenges:</span>
          </div>
          <div className="space-y-2">
            {selectedCareer.missions.map((m, idx) => {
              const isDone = completedMissions[m] === true;

              return (
                <div
                  key={idx}
                  onClick={() => handleToggleMission(m)}
                  className={`p-3.5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    isDone ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-black text-xs flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </div>
                    <span className={`text-xs font-bold ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {m}
                    </span>
                  </div>

                  <div>
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Official Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border-4 border-amber-400 space-y-6 text-center relative overflow-hidden">
            <div className="space-y-2">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-400 text-slate-950 font-black text-3xl flex items-center justify-center shadow-md">
                📜
              </div>
              <div className="text-[11px] font-black uppercase tracking-widest text-amber-700">
                Official EduBridge Honors
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Certificate of Career Exploration
              </h3>
            </div>

            <div className="p-6 bg-amber-50/80 rounded-2xl border-2 border-dashed border-amber-300 space-y-3">
              <div className="text-xs text-slate-600 font-medium">This certificate is proudly awarded to:</div>
              <div className="text-2xl font-black text-indigo-900 underline decoration-amber-400 decoration-wavy">
                {profile.name}
              </div>
              <div className="text-xs text-slate-600 font-medium">For demonstrating intellectual curiosity and commitment toward:</div>
              <div className="text-lg font-black text-amber-900 bg-white py-2 px-4 rounded-xl border border-amber-200 inline-block">
                {selectedCareer.emoji} {selectedCareer.title}
              </div>
              <div className="text-[10px] text-slate-500 pt-1">
                Issued with academic distinction on {new Date().toLocaleDateString()}
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  window.print();
                }}
                className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Print Certificate</span>
              </button>
              <button
                type="button"
                onClick={() => setShowCertificate(false)}
                className="px-5 py-2.5 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
