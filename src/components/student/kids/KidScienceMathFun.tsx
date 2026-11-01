import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  RefreshCw,
  Award,
  CheckCircle2,
  HelpCircle,
  Play,
  RotateCcw,
  Zap,
  Flame,
  Code2,
  Globe2,
  Dna,
  Calculator,
  Compass,
  ArrowRight
} from 'lucide-react';
import { UserProfile } from '../../../types';
import { sound } from '../../../utils/audio';
import { SpeechService } from '../../../services/speechService';
import { calculateAge } from '../../../utils/userProfile';

export type KidAgeStage = 'early' | 'junior' | 'teen';

interface KidScienceMathFunProps {
  profile?: UserProfile;
  onEarnXp?: (amount: number) => void;
}

export const KidScienceMathFun: React.FC<KidScienceMathFunProps> = ({ profile, onEarnXp }) => {
  // Determine default stage from profile age
  const userAge = calculateAge(profile?.dateOfBirth);
  const defaultStage: KidAgeStage = userAge <= 7 ? 'early' : userAge <= 10 ? 'junior' : 'teen';

  const [currentStage, setCurrentStage] = useState<KidAgeStage>(defaultStage);
  const [starsWon, setStarsWon] = useState(12);

  // ----------------------------------------------------
  // STAGE 1: AGES 3–7 (Early Explorers)
  // ----------------------------------------------------
  const [earlyExp, setEarlyExp] = useState<'rainbow' | 'dino' | 'rocket' | 'magnet' | 'plant'>('rainbow');
  const [color1, setColor1] = useState<'red' | 'yellow' | 'blue' | null>('red');
  const [color2, setColor2] = useState<'red' | 'yellow' | 'blue' | null>('blue');
  const [mixedColor, setMixedColor] = useState<string | null>('Purple 🍇');
  const [mixAnimation, setMixAnimation] = useState(false);
  const [dinoCount, setDinoCount] = useState<number>(4);
  const [dinoAnswerFeedback, setDinoAnswerFeedback] = useState<string | null>(null);
  const [fuelLevel, setFuelLevel] = useState<number>(3);
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchMessage, setLaunchMessage] = useState<string | null>(null);
  const [testedItems, setTestedItems] = useState<{ [key: string]: boolean }>({ paperclip: true, wood: false });
  const [plantStage, setPlantStage] = useState<number>(2);

  // ----------------------------------------------------
  // STAGE 2: AGES 8–10 (Junior Inventors)
  // ----------------------------------------------------
  const [juniorExp, setJuniorExp] = useState<'volcano' | 'circuit' | 'planets' | 'multiplication' | 'foodweb'>('volcano');
  const [volcanoReactant, setVolcanoReactant] = useState<number>(50); // baking soda grams
  const [volcanoErupted, setVolcanoErupted] = useState(false);
  const [circuitSwitch, setCircuitSwitch] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState<'Moon' | 'Mars' | 'Earth' | 'Jupiter'>('Moon');
  const [mathA, setMathA] = useState(7);
  const [mathB, setMathB] = useState(8);
  const [userMathGuess, setUserMathGuess] = useState('');
  const [mathFeedback, setMathFeedback] = useState<string | null>(null);
  const [foodWebStage, setFoodWebStage] = useState<number>(1);

  // ----------------------------------------------------
  // STAGE 3: AGES 11–17 (Teen Titans & STEM)
  // ----------------------------------------------------
  const [teenExp, setTeenExp] = useState<'projectile' | 'punnett' | 'code' | 'elements'>('projectile');
  const [projectileAngle, setProjectileAngle] = useState(45);
  const [projectileVelocity, setProjectileVelocity] = useState(25);
  const [projectileFired, setProjectileFired] = useState(false);
  const [punnettParent1, setPunnettParent1] = useState<'BB' | 'Bb' | 'bb'>('Bb');
  const [punnettParent2, setPunnettParent2] = useState<'BB' | 'Bb' | 'bb'>('Bb');
  const [selectedElement, setSelectedElement] = useState<'H' | 'O' | 'Na' | 'Cl'>('H');
  const [codeSnippetOutput, setCodeSnippetOutput] = useState<string | null>(null);

  const speak = (text: string) => {
    sound.playClick();
    if (SpeechService.isSynthesisSupported()) {
      SpeechService.speak(text, 'en-US');
    }
  };

  // Stage 1 Handlers
  const handleMixColors = () => {
    sound.playSuccess();
    setMixAnimation(true);
    setTimeout(() => {
      setMixAnimation(false);
      if (!color1 || !color2) return;
      if (color1 === color2) {
        setMixedColor(`Same Color: ${color1.toUpperCase()}!`);
      } else if ((color1 === 'red' && color2 === 'yellow') || (color1 === 'yellow' && color2 === 'red')) {
        setMixedColor('Bright Orange! 🍊 (Red + Yellow)');
        speak('Red and Yellow mix together to create vibrant Orange!');
      } else if ((color1 === 'red' && color2 === 'blue') || (color1 === 'blue' && color2 === 'red')) {
        setMixedColor('Royal Purple! 🍇 (Red + Blue)');
        speak('Red and Blue mix together to make magical Purple!');
      } else if ((color1 === 'yellow' && color2 === 'blue') || (color1 === 'blue' && color2 === 'yellow')) {
        setMixedColor('Emerald Green! 🍏 (Yellow + Blue)');
        speak('Yellow and Blue mix together to create lovely Green!');
      }
      setStarsWon((s) => s + 1);
      if (onEarnXp) onEarnXp(20);
    }, 600);
  };

  const handleDinoGuess = (guess: number) => {
    if (guess === dinoCount) {
      sound.playLevelUp();
      setDinoAnswerFeedback(`🎉 YAY! Super Job! You counted ${dinoCount} friendly dinos!`);
      speak(`Super job! There are exactly ${dinoCount} dinosaurs!`);
      setStarsWon((s) => s + 1);
      if (onEarnXp) onEarnXp(20);
    } else {
      sound.playError();
      setDinoAnswerFeedback(`Oops! Try counting one by one! There are more than ${guess}.`);
    }
  };

  // Stage 2 Handlers
  const handleEruptVolcano = () => {
    sound.playLevelUp();
    setVolcanoErupted(true);
    speak('FZZZZ! Acetic acid reacts with sodium bicarbonate to release bubbling carbon dioxide gas!');
    setStarsWon((s) => s + 2);
    if (onEarnXp) onEarnXp(30);
    setTimeout(() => setVolcanoErupted(false), 3000);
  };

  const handleMathCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const correct = mathA * mathB;
    if (parseInt(userMathGuess, 10) === correct) {
      sound.playLevelUp();
      setMathFeedback(`🎯 Correct! ${mathA} × ${mathB} = ${correct}! Speed bonus unlocked!`);
      speak(`Awesome! ${mathA} times ${mathB} is ${correct}!`);
      setStarsWon((s) => s + 2);
      if (onEarnXp) onEarnXp(25);
      setTimeout(() => {
        setMathA(Math.floor(Math.random() * 8) + 4);
        setMathB(Math.floor(Math.random() * 8) + 3);
        setUserMathGuess('');
        setMathFeedback(null);
      }, 1500);
    } else {
      sound.playError();
      setMathFeedback(`Almost! Let's check: ${mathA} × ${mathB} = ${correct}. Try the next one!`);
    }
  };

  // Stage 3 Handlers (Physics projectile calculations)
  const g = 9.81;
  const thetaRad = (projectileAngle * Math.PI) / 180;
  const maxHeight = (Math.pow(projectileVelocity * Math.sin(thetaRad), 2) / (2 * g)).toFixed(1);
  const totalRange = ((Math.pow(projectileVelocity, 2) * Math.sin(2 * thetaRad)) / g).toFixed(1);
  const flightTime = ((2 * projectileVelocity * Math.sin(thetaRad)) / g).toFixed(2);

  const handleFireProjectile = () => {
    sound.playLevelUp();
    setProjectileFired(true);
    speak(`Projectile launched at ${projectileAngle} degrees! Maximum height reached: ${maxHeight} meters! Total distance: ${totalRange} meters!`);
    setStarsWon((s) => s + 3);
    if (onEarnXp) onEarnXp(35);
    setTimeout(() => setProjectileFired(false), 2500);
  };

  const handleRunCodeSnippet = () => {
    sound.playSuccess();
    setCodeSnippetOutput(
      `>>> def compute_primes(limit):\n...     return [n for n in range(2, limit) if all(n % d != 0 for d in range(2, int(n**0.5) + 1))]\n>>> compute_primes(30)\n[2, 3, 5, 7, 11, 13, 17, 19, 23, 29]\n[Program Exited 0 · Time: 0.0014s]`
    );
    speak('Python script executed cleanly in the sandbox runtime. Primes calculated in 1.4 milliseconds.');
    setStarsWon((s) => s + 2);
    if (onEarnXp) onEarnXp(30);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Age Stage Switcher Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-3 top-3 opacity-15 text-8xl select-none pointer-events-none">
          🔬
        </div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-300 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
              Interactive STEM Discovery Lab
            </span>
            <span className="text-xs font-bold text-purple-200">
              {currentStage === 'early' && '• Level 1: Sensory & Play'}
              {currentStage === 'junior' && '• Level 2: Inquiry & Chemistry'}
              {currentStage === 'teen' && '• Level 3: Physics, Code & Genetics'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Science &amp; Math Fun</span>
            <span className="text-3xl">🧪⚡</span>
          </h2>
          <p className="text-sm font-medium text-purple-100 leading-relaxed">
            Hands-on experiments, dynamic visual simulations, and puzzles adapted for every developmental age!
          </p>

          {/* Age Tier Selector Tabs */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            {[
              { id: 'early', label: '🧸 Ages 3–7 (Early Explorers)', subtitle: 'Colors, Dinos, Sprouting' },
              { id: 'junior', label: '🚀 Ages 8–10 (Junior Inventors)', subtitle: 'Volcano, Circuits, Planets' },
              { id: 'teen', label: '⚡ Ages 11–17 (Teen Titans & STEM)', subtitle: 'Physics, Coding, Genetics' }
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => {
                  sound.playClick();
                  setCurrentStage(st.id as KidAgeStage);
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

      {/* ==================================================== */}
      {/* STAGE 1: AGES 3–7 CONTENT                           */}
      {/* ==================================================== */}
      {currentStage === 'early' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'rainbow', label: '🌈 Color Mixer' },
              { id: 'dino', label: '🦕 Dino Counting' },
              { id: 'rocket', label: '🚀 Rocket Launch' },
              { id: 'magnet', label: '🧲 Magnet Magic' },
              { id: 'plant', label: '🌻 Sunflower Grow' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { sound.playClick(); setEarlyExp(tab.id as any); }}
                className={`px-4 py-2 rounded-2xl font-black text-xs transition-all cursor-pointer shadow-xs ${
                  earlyExp === tab.id
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white ring-2 ring-pink-300'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {earlyExp === 'rainbow' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-pink-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-pink-100 pb-3">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <span>🌈 Magic Rainbow Color Mixer</span>
                </h3>
                <button
                  onClick={() => speak('Pick two colors: Red, yellow, or blue. Tap Mix to see what new color you make!')}
                  className="p-1.5 rounded-xl bg-pink-50 text-pink-700 hover:bg-pink-100"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="bg-pink-50/60 rounded-2xl p-4 border border-pink-100 text-center space-y-2">
                  <span className="text-xs font-black uppercase text-pink-700">Color #1</span>
                  <div className="flex justify-center gap-2">
                    {[
                      { name: 'red', emoji: '🔴', label: 'Red' },
                      { name: 'yellow', emoji: '🟡', label: 'Yellow' },
                      { name: 'blue', emoji: '🔵', label: 'Blue' }
                    ].map((c) => (
                      <button
                        key={c.name}
                        onClick={() => { sound.playClick(); setColor1(c.name as any); }}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border-2 ${
                          color1 === c.name ? 'border-pink-500 bg-white shadow-sm' : 'border-transparent bg-white/70'
                        }`}
                      >
                        <span className="text-lg block">{c.emoji}</span>
                        <span>{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-center space-y-3">
                  <div className={`w-24 h-24 mx-auto rounded-3xl border-4 border-dashed border-pink-300 flex flex-col items-center justify-center ${
                    mixAnimation ? 'animate-bounce bg-purple-200' : 'bg-slate-50'
                  }`}>
                    <span className="text-3xl">{mixAnimation ? '🫧' : '⚗️'}</span>
                  </div>
                  <button
                    onClick={handleMixColors}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    POUR &amp; MIX! ✨ (+20 XP)
                  </button>
                </div>

                <div className="bg-purple-50/60 rounded-2xl p-4 border border-purple-100 text-center space-y-2">
                  <span className="text-xs font-black uppercase text-purple-700">Color #2</span>
                  <div className="flex justify-center gap-2">
                    {[
                      { name: 'red', emoji: '🔴', label: 'Red' },
                      { name: 'yellow', emoji: '🟡', label: 'Yellow' },
                      { name: 'blue', emoji: '🔵', label: 'Blue' }
                    ].map((c) => (
                      <button
                        key={c.name}
                        onClick={() => { sound.playClick(); setColor2(c.name as any); }}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border-2 ${
                          color2 === c.name ? 'border-purple-500 bg-white shadow-sm' : 'border-transparent bg-white/70'
                        }`}
                      >
                        <span className="text-lg block">{c.emoji}</span>
                        <span>{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {mixedColor && (
                <div className="p-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl border-2 border-purple-300 text-center font-black text-purple-900 text-sm">
                  🎉 Wow! Color Result: {mixedColor}
                </div>
              )}
            </div>
          )}

          {earlyExp === 'dino' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                <h3 className="text-base font-black text-slate-900">🦕 Dino Count &amp; Number Adventure</h3>
                <button
                  onClick={() => speak(`How many friendly dinosaurs do you see? Tap the number below!`)}
                  className="p-1.5 rounded-xl bg-emerald-50 text-emerald-700"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 bg-emerald-50/70 rounded-3xl border-2 border-emerald-200 flex flex-wrap items-center justify-center gap-3">
                {Array.from({ length: dinoCount }).map((_, i) => (
                  <div key={i} className="w-16 h-16 rounded-2xl bg-white shadow-xs flex flex-col items-center justify-center border border-emerald-200 text-3xl">
                    {i % 2 === 0 ? '🦕' : '🦖'}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <button
                    key={n}
                    onClick={() => handleDinoGuess(n)}
                    className="w-11 h-11 rounded-2xl bg-white border-2 border-emerald-300 hover:bg-emerald-50 text-slate-900 font-black text-lg shadow-xs"
                  >
                    {n}
                  </button>
                ))}
              </div>

              {dinoAnswerFeedback && (
                <div className="p-3 bg-emerald-100 rounded-2xl text-center font-black text-emerald-900 text-xs">
                  {dinoAnswerFeedback}
                </div>
              )}
            </div>
          )}

          {earlyExp === 'rocket' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900">🚀 Rocket Space &amp; Gravity Blast</h3>
              <div className="p-8 bg-slate-950 rounded-3xl text-white text-center space-y-4">
                <div className={`text-6xl transition-transform duration-1000 ${isLaunching ? '-translate-y-20 scale-125' : ''}`}>
                  🚀
                </div>
                <div className="text-xs text-amber-300 font-bold">
                  {isLaunching ? '🔥 BLAST OFF! Flying past clouds!' : 'Ready on launchpad!'}
                </div>
                <button
                  onClick={() => {
                    setIsLaunching(true);
                    speak('Blast off! The rocket breaks free from gravity!');
                    setTimeout(() => setIsLaunching(false), 2000);
                  }}
                  disabled={isLaunching}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 font-black text-xs"
                >
                  COUNTDOWN &amp; LAUNCH! 🚀
                </button>
              </div>
            </div>
          )}

          {earlyExp === 'magnet' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-blue-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900">🧲 Magnet Magic: Attract or Repel?</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'paperclip', label: 'Iron Clip', emoji: '📎', sticks: true },
                  { id: 'wood', label: 'Wood Block', emoji: '🪵', sticks: false },
                  { id: 'key', label: 'Metal Key', emoji: '🔑', sticks: true },
                  { id: 'duck', label: 'Rubber Duck', emoji: '🦆', sticks: false }
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      sound.playSuccess();
                      speak(item.sticks ? `${item.label} sticks to the magnet!` : `${item.label} does not stick!`);
                    }}
                    className="p-4 rounded-2xl border-2 text-center space-y-1 hover:border-blue-400 cursor-pointer bg-blue-50/40"
                  >
                    <div className="text-3xl">{item.emoji}</div>
                    <div className="font-bold text-xs">{item.label}</div>
                    <div className="text-[10px] text-blue-600 font-black">
                      {item.sticks ? 'MAGNETIC 🧲' : 'NON-MAGNETIC 💨'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {earlyExp === 'plant' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-sm space-y-4 text-center">
              <h3 className="text-base font-black text-slate-900">🌻 Sunflower Sunshine &amp; Water Lab</h3>
              <div className="text-7xl">
                {plantStage === 0 && '🌰'}
                {plantStage === 1 && '🌱'}
                {plantStage === 2 && '🌿'}
                {plantStage === 3 && '🌻'}
              </div>
              <div className="text-xs font-bold text-slate-700">
                {plantStage === 0 && 'Stage 1: Sleeping seed in soil'}
                {plantStage === 1 && 'Stage 2: Little green sprout popping up!'}
                {plantStage === 2 && 'Stage 3: Healthy green stem drinking sun'}
                {plantStage === 3 && 'Stage 4: Giant bright blooming sunflower!'}
              </div>
              <button
                onClick={() => {
                  sound.playSuccess();
                  setPlantStage((s) => (s < 3 ? s + 1 : 0));
                }}
                className="px-5 py-2.5 rounded-2xl bg-emerald-600 text-white font-black text-xs"
              >
                💧 GIVE WATER &amp; SUNSHINE
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* STAGE 2: AGES 8–10 (Junior Inventors)                */}
      {/* ==================================================== */}
      {currentStage === 'junior' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'volcano', label: '🌋 Chemical Volcano Lab' },
              { id: 'circuit', label: '💡 Electric Circuit Builder' },
              { id: 'planets', label: '🪐 Solar System Gravity' },
              { id: 'multiplication', label: '✖️ Speed Math Arena' },
              { id: 'foodweb', label: '🌲 Ecosystem Food Chain' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { sound.playClick(); setJuniorExp(tab.id as any); }}
                className={`px-4 py-2 rounded-2xl font-black text-xs transition-all cursor-pointer shadow-xs ${
                  juniorExp === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white ring-2 ring-blue-300'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Volcano Experiment */}
          {juniorExp === 'volcano' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-orange-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-orange-100 pb-3">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <span>🌋 Acid-Base Volcano Reaction Lab</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Baking Soda (Sodium Bicarbonate, $NaHCO_3$) + Vinegar (Acetic Acid, $CH_3COOH$) &rarr; $CO_2$ gas!
                  </p>
                </div>
                <button
                  onClick={() => speak('When acetic acid in vinegar mixes with sodium bicarbonate, they react instantly to form carbon dioxide gas that bubbles up like volcanic lava!')}
                  className="p-1.5 rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-100"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="p-8 bg-gradient-to-b from-orange-100 via-amber-50 to-slate-100 rounded-3xl border-2 border-orange-200 text-center relative overflow-hidden">
                  <div className={`text-8xl transition-all duration-700 ${volcanoErupted ? 'scale-125 animate-bounce' : ''}`}>
                    {volcanoErupted ? '🌋' : '⛰️'}
                  </div>
                  {volcanoErupted && (
                    <div className="text-xs font-black text-rose-600 mt-2 animate-pulse">
                      💥 FZZZZ! Carbon dioxide foam bubbling over the rim!
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                    <div className="font-bold text-slate-800">Chemical Equation:</div>
                    <div className="font-mono text-indigo-700 bg-white p-2 rounded-xl border border-slate-200 font-bold">
                      NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂ (gas) ↑
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Reactant Dose (Baking Soda): {volcanoReactant}g
                    </label>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={volcanoReactant}
                      onChange={(e) => setVolcanoReactant(parseInt(e.target.value, 10))}
                      className="w-full accent-orange-600"
                    />
                  </div>

                  <button
                    onClick={handleEruptVolcano}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    POUR VINEGAR &amp; TRIGGER ERUPTION! 💥 (+30 XP)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Electric Circuit Builder */}
          {juniorExp === 'circuit' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-yellow-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-yellow-100 pb-3">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <span>💡 Electric Circuit Builder &amp; Current Flow</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    A complete loop (closed circuit) allows electrons to flow from the battery to light the bulb!
                  </p>
                </div>
                <button
                  onClick={() => speak('Electrons need an uninterrupted closed loop to flow. When you close the switch, the circuit completes and electricity powers the light bulb!')}
                  className="p-1.5 rounded-xl bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-8 bg-slate-900 rounded-3xl border-2 border-yellow-300 text-white text-center space-y-6">
                <div className="flex items-center justify-center gap-6 sm:gap-12">
                  <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700">
                    <span className="text-3xl">🔋</span>
                    <div className="text-[10px] font-black uppercase text-slate-300 mt-1">9V Battery</div>
                  </div>

                  <div className={`h-1 flex-1 border-t-2 border-dashed ${circuitSwitch ? 'border-amber-400 animate-pulse' : 'border-slate-600'}`} />

                  <div className={`p-4 rounded-2xl border transition-all ${
                    circuitSwitch ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/50 scale-110' : 'bg-slate-800 text-slate-500 border-slate-700'
                  }`}>
                    <span className="text-4xl">{circuitSwitch ? '💡' : '🌑'}</span>
                    <div className="text-[10px] font-black uppercase mt-1">
                      {circuitSwitch ? 'Lit (250 Lumens)' : 'Unpowered'}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      sound.playSuccess();
                      setCircuitSwitch(!circuitSwitch);
                      if (!circuitSwitch) speak('Switch closed! Electrons flow in a complete loop, lighting the bulb!');
                      else speak('Switch open! The circuit is broken, stopping the electric current.');
                    }}
                    className={`px-6 py-2.5 rounded-2xl font-black text-xs transition-all shadow-md cursor-pointer ${
                      circuitSwitch ? 'bg-amber-400 text-slate-950 hover:bg-amber-300' : 'bg-slate-700 text-white hover:bg-slate-600'
                    }`}
                  >
                    {circuitSwitch ? 'OPEN SWITCH (Turn Off 🔘)' : 'CLOSE SWITCH (Complete Circuit ⚡)'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Solar System Gravity Simulator */}
          {juniorExp === 'planets' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                <h3 className="text-base font-black text-slate-900">🪐 Planetary Gravity &amp; Weight Simulator</h3>
                <span className="text-xs text-indigo-700 font-bold">$F = m \cdot g$</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Moon', g: 0.16, emoji: '🌕', jump: '6 meters high!' },
                  { name: 'Mars', g: 0.38, emoji: '🔴', jump: '2.6 meters high' },
                  { name: 'Earth', g: 1.0, emoji: '🌍', jump: '1.0 meter (baseline)' },
                  { name: 'Jupiter', g: 2.5, emoji: '🪐', jump: '0.4 meters (heavy!)' }
                ].map((p) => (
                  <button
                    key={p.name}
                    onClick={() => {
                      sound.playClick();
                      setSelectedPlanet(p.name as any);
                      speak(`On ${p.name}, gravity is ${p.g} g. You can jump ${p.jump}!`);
                    }}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold border-2 transition-all cursor-pointer ${
                      selectedPlanet === p.name ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-black shadow-xs' : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <span className="mr-1">{p.emoji}</span>
                    <span>{p.name} ({p.g}g)</span>
                  </button>
                ))}
              </div>

              <div className="p-6 bg-slate-950 rounded-3xl text-white text-center space-y-2">
                <div className="text-xs text-indigo-300 uppercase font-black tracking-wider">
                  Physics on {selectedPlanet}:
                </div>
                <div className="text-2xl font-black text-amber-300">
                  A 30 kg student weighs{' '}
                  {(
                    30 * (selectedPlanet === 'Moon' ? 0.16 : selectedPlanet === 'Mars' ? 0.38 : selectedPlanet === 'Jupiter' ? 2.5 : 1.0)
                  ).toFixed(1)}{' '}
                  kg equivalent force!
                </div>
              </div>
            </div>
          )}

          {/* Speed Math Arena */}
          {juniorExp === 'multiplication' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                <h3 className="text-base font-black text-slate-900">✖️ Fast Mental Multiplication Arena</h3>
                <span className="text-xs font-bold text-emerald-700">Times Tables Mastery</span>
              </div>

              <form onSubmit={handleMathCheck} className="p-8 bg-emerald-50/70 rounded-3xl border-2 border-emerald-200 text-center space-y-4">
                <div className="text-3xl sm:text-4xl font-black text-emerald-950">
                  {mathA} × {mathB} = ?
                </div>

                <div className="flex justify-center gap-2">
                  <input
                    type="number"
                    required
                    value={userMathGuess}
                    onChange={(e) => setUserMathGuess(e.target.value)}
                    placeholder="Enter answer"
                    className="w-36 p-3 rounded-2xl border-2 border-emerald-300 text-center font-black text-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs cursor-pointer shadow-xs"
                  >
                    Check &amp; Score!
                  </button>
                </div>

                {mathFeedback && (
                  <div className="text-xs font-black text-emerald-900 bg-emerald-100 p-2.5 rounded-xl border border-emerald-300">
                    {mathFeedback}
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Ecosystem Food Web */}
          {juniorExp === 'foodweb' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-teal-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900">🌲 Forest Ecosystem Energy Flow</h3>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                  <span className="text-3xl block">☀️</span>
                  <span className="font-black text-amber-900">Sun &amp; Light</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <span className="text-3xl block">🌾</span>
                  <span className="font-black text-emerald-900">Producer (Grass)</span>
                </div>
                <div className="p-3 bg-cyan-50 rounded-2xl border border-cyan-200">
                  <span className="text-3xl block">🐇</span>
                  <span className="font-black text-cyan-900">Herbivore (Rabbit)</span>
                </div>
                <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200">
                  <span className="text-3xl block">🦅</span>
                  <span className="font-black text-rose-900">Apex (Eagle)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* STAGE 3: AGES 11–17 (Teen Titans & STEM)             */}
      {/* ==================================================== */}
      {currentStage === 'teen' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'projectile', label: '🎯 Projectile Kinematics' },
              { id: 'punnett', label: '🧬 Genetics & Punnett Square' },
              { id: 'code', label: '💻 Python Algorithm Sandbox' },
              { id: 'elements', label: '⚛️ Chemical Reaction Stoichiometry' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { sound.playClick(); setTeenExp(tab.id as any); }}
                className={`px-4 py-2 rounded-2xl font-black text-xs transition-all cursor-pointer shadow-xs ${
                  teenExp === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white ring-2 ring-indigo-300'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Projectile Motion Simulator */}
          {teenExp === 'projectile' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                <div>
                  <h3 className="text-base font-black text-slate-900">🎯 Projectile Kinematics Simulation</h3>
                  <p className="text-xs text-slate-500 font-mono">
                    $x(t) = v_0 \cos(\theta) t, \quad y(t) = v_0 \sin(\theta) t - \frac{1}{2}gt^2$
                  </p>
                </div>
                <button
                  onClick={() => speak(`In 2D kinematics, horizontal velocity remains constant in the absence of air drag, while vertical velocity accelerates under Earth gravity at 9.81 meters per second squared.`)}
                  className="p-1.5 rounded-xl bg-indigo-50 text-indigo-700"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Launch Angle (&theta;):</span>
                      <span className="font-mono text-indigo-700 font-black">{projectileAngle}&deg;</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={85}
                      value={projectileAngle}
                      onChange={(e) => setProjectileAngle(parseInt(e.target.value, 10))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Initial Velocity (v₀):</span>
                      <span className="font-mono text-indigo-700 font-black">{projectileVelocity} m/s</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={50}
                      value={projectileVelocity}
                      onChange={(e) => setProjectileVelocity(parseInt(e.target.value, 10))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  <button
                    onClick={handleFireProjectile}
                    className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition-all cursor-pointer"
                  >
                    CALCULATE &amp; FIRE TRAJECTORY 🎯 (+35 XP)
                  </button>
                </div>

                <div className="p-6 bg-slate-950 rounded-3xl text-white space-y-3 font-mono text-xs">
                  <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    Telemetry Computed (g = 9.81 m/s²):
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800">
                      <div className="text-[10px] text-slate-400">Max Height (H)</div>
                      <div className="text-base font-black text-emerald-400">{maxHeight} m</div>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800">
                      <div className="text-[10px] text-slate-400">Range (R)</div>
                      <div className="text-base font-black text-cyan-400">{totalRange} m</div>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800">
                      <div className="text-[10px] text-slate-400">Air Time (T)</div>
                      <div className="text-base font-black text-amber-400">{flightTime} s</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Punnett Square Genetics */}
          {teenExp === 'punnett' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-purple-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                <h3 className="text-base font-black text-slate-900">🧬 Mendelian Genetics: Punnett Square Cross</h3>
                <span className="text-xs font-mono text-purple-700 font-bold">B = Brown (Dominant), b = Blue (Recessive)</span>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto text-center font-mono text-sm">
                <div className="p-4 bg-purple-50 rounded-2xl border-2 border-purple-300 font-black text-purple-900">
                  BB (25% Homozygous Dominant)
                </div>
                <div className="p-4 bg-purple-50 rounded-2xl border-2 border-purple-300 font-black text-purple-900">
                  Bb (25% Heterozygous)
                </div>
                <div className="p-4 bg-purple-50 rounded-2xl border-2 border-purple-300 font-black text-purple-900">
                  Bb (25% Heterozygous)
                </div>
                <div className="p-4 bg-cyan-50 rounded-2xl border-2 border-cyan-300 font-black text-cyan-900">
                  bb (25% Recessive Phenotype)
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 text-center font-medium">
                Phenotype Outcome: <strong>75% Brown Eyes</strong> (BB, Bb, Bb) vs <strong>25% Blue Eyes</strong> (bb).
              </div>
            </div>
          )}

          {/* Python Sandbox */}
          {teenExp === 'code' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-300 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900">💻 Python 3.12 Algorithm Sandbox</h3>
                <button
                  onClick={handleRunCodeSnippet}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Python Script</span>
                </button>
              </div>

              <div className="bg-slate-950 rounded-2xl p-4 font-mono text-xs text-emerald-400 space-y-2">
                <div className="text-slate-500"># Sieve of Eratosthenes / Prime Numbers Engine</div>
                <div>def compute_primes(limit: int):</div>
                <div className="pl-4">return [n for n in range(2, limit) if all(n % d != 0 for d in range(2, int(n**0.5) + 1))]</div>
                <div className="text-slate-400 pt-2">print(compute_primes(30))</div>
              </div>

              {codeSnippetOutput && (
                <div className="p-4 bg-slate-900 text-cyan-300 rounded-2xl font-mono text-xs whitespace-pre-line border border-slate-800">
                  {codeSnippetOutput}
                </div>
              )}
            </div>
          )}

          {/* Elements */}
          {teenExp === 'elements' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-teal-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900">⚛️ Valence Shells &amp; Stoichiometry</h3>
              <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 text-xs text-teal-900 font-medium">
                Ionic bonding: Sodium ($Na$, 1 valence electron) transfers an electron to Chlorine ($Cl$, 7 valence electrons), creating stable sodium chloride ($NaCl$) table salt!
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
