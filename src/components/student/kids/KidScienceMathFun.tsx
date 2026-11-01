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
  ArrowRight,
  Lock,
  ShieldAlert,
  Calendar
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
  // 1. Calculate user age strictly from registered date of birth
  const userAge = calculateAge(profile?.dateOfBirth);
  const registeredDob = profile?.dateOfBirth || '2019-03-12';

  // Determine user's developmental cohort
  const userCalculatedStage: KidAgeStage = userAge <= 7 ? 'early' : userAge <= 10 ? 'junior' : 'teen';

  const [currentStage, setCurrentStage] = useState<KidAgeStage>(userCalculatedStage);
  const [filterToMyAgeOnly, setFilterToMyAgeOnly] = useState<boolean>(userAge <= 7);
  const [starsWon, setStarsWon] = useState(12);

  // Check if current stage is locked for this user
  const isStageLocked = (stage: KidAgeStage) => {
    if (stage === 'early') return false; // Early content accessible to all
    if (stage === 'junior') return userAge < 8; // Locked for kids under 8
    if (stage === 'teen') return userAge < 11; // Locked for kids under 11
    return false;
  };

  const currentIsLocked = isStageLocked(currentStage);

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
  const [testedItems, setTestedItems] = useState<{ [key: string]: boolean }>({ paperclip: true, wood: false });
  const [plantStage, setPlantStage] = useState<number>(2);

  // ----------------------------------------------------
  // STAGE 2: AGES 8–10 (Junior Inventors)
  // ----------------------------------------------------
  const [juniorExp, setJuniorExp] = useState<'volcano' | 'circuit' | 'planets' | 'multiplication' | 'foodweb'>('volcano');
  const [volcanoReactant, setVolcanoReactant] = useState<number>(50);
  const [volcanoErupted, setVolcanoErupted] = useState(false);
  const [circuitSwitch, setCircuitSwitch] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState<'Moon' | 'Mars' | 'Earth' | 'Jupiter'>('Moon');
  const [mathA, setMathA] = useState(7);
  const [mathB, setMathB] = useState(8);
  const [userMathGuess, setUserMathGuess] = useState('');
  const [mathFeedback, setMathFeedback] = useState<string | null>(null);

  // ----------------------------------------------------
  // STAGE 3: AGES 11–17 (Teen Titans & STEM)
  // ----------------------------------------------------
  const [teenExp, setTeenExp] = useState<'projectile' | 'punnett' | 'code' | 'elements'>('projectile');
  const [projectileAngle, setProjectileAngle] = useState(45);
  const [projectileVelocity, setProjectileVelocity] = useState(25);
  const [projectileFired, setProjectileFired] = useState(false);
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
    if (currentIsLocked) {
      sound.playError();
      speak(`This experiment requires Age 8 or older. Based on your registered date of birth, you are age ${userAge}.`);
      return;
    }
    sound.playLevelUp();
    setVolcanoErupted(true);
    speak('FZZZZ! Acetic acid reacts with sodium bicarbonate to release carbon dioxide gas!');
    setStarsWon((s) => s + 2);
    if (onEarnXp) onEarnXp(30);
    setTimeout(() => setVolcanoErupted(false), 3000);
  };

  const handleMathCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentIsLocked) return;
    const correct = mathA * mathB;
    if (parseInt(userMathGuess, 10) === correct) {
      sound.playLevelUp();
      setMathFeedback(`🎯 Correct! ${mathA} × ${mathB} = ${correct}!`);
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
      setMathFeedback(`Almost! Let's check: ${mathA} × ${mathB} = ${correct}. Try next one!`);
    }
  };

  // Stage 3 Handlers
  const g = 9.81;
  const thetaRad = (projectileAngle * Math.PI) / 180;
  const maxHeight = (Math.pow(projectileVelocity * Math.sin(thetaRad), 2) / (2 * g)).toFixed(1);
  const totalRange = ((Math.pow(projectileVelocity, 2) * Math.sin(2 * thetaRad)) / g).toFixed(1);
  const flightTime = ((2 * projectileVelocity * Math.sin(thetaRad)) / g).toFixed(2);

  const handleFireProjectile = () => {
    if (currentIsLocked) {
      sound.playError();
      speak(`Kinematics simulator requires Age 11 or older. Based on your registered birthdate, you are age ${userAge}.`);
      return;
    }
    sound.playLevelUp();
    setProjectileFired(true);
    speak(`Projectile launched at ${projectileAngle} degrees! Height: ${maxHeight}m, Range: ${totalRange}m!`);
    setStarsWon((s) => s + 3);
    if (onEarnXp) onEarnXp(35);
    setTimeout(() => setProjectileFired(false), 2500);
  };

  const handleRunCodeSnippet = () => {
    if (currentIsLocked) {
      sound.playError();
      speak(`Python sandbox requires Age 11 or older.`);
      return;
    }
    sound.playSuccess();
    setCodeSnippetOutput(
      `>>> def compute_primes(limit):\n...     return [n for n in range(2, limit) if all(n % d != 0 for d in range(2, int(n**0.5) + 1))]\n>>> compute_primes(30)\n[2, 3, 5, 7, 11, 13, 17, 19, 23, 29]\n[Program Exited 0 · Time: 0.0014s]`
    );
    speak('Python script executed cleanly.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header with Date of Birth & Age Verification Indicator */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-3 top-3 opacity-15 text-8xl select-none pointer-events-none">
          🔬
        </div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-300 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Registered DOB: {registeredDob} (Age {userAge})</span>
            </span>
            <span className="text-xs font-bold text-purple-200">
              • Verified Cohort: {userCalculatedStage === 'early' ? 'Ages 3–7' : userCalculatedStage === 'junior' ? 'Ages 8–10' : 'Ages 11–17 Teen'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Science &amp; Math Fun</span>
            <span className="text-3xl">🧪⚡</span>
          </h2>
          <p className="text-sm font-medium text-purple-100 leading-relaxed">
            Experiments and interactive games automatically calibrated to your registered developmental age group!
          </p>

          {/* Age Tier Tabs with Live Locks and Visibility Toggles */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            {[
              { id: 'early', label: '🧸 Ages 3–7 (Early Explorers)', minAge: 3, maxAge: 7 },
              { id: 'junior', label: '🚀 Ages 8–10 (Junior Inventors)', minAge: 8, maxAge: 10 },
              { id: 'teen', label: '⚡ Ages 11–17 (Teen Titans & STEM)', minAge: 11, maxAge: 17 }
            ].map((st) => {
              const locked = isStageLocked(st.id as KidAgeStage);
              const isMatch = userCalculatedStage === st.id;

              if (filterToMyAgeOnly && !isMatch) {
                return null; // Hidden strictly when filter is on!
              }

              return (
                <button
                  key={st.id}
                  onClick={() => {
                    sound.playClick();
                    setCurrentStage(st.id as KidAgeStage);
                    if (locked) {
                      speak(`This module is locked for Age ${st.minAge} to ${st.maxAge}. Based on your registered birthdate, you are age ${userAge}.`);
                    }
                  }}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-xs flex items-center gap-1.5 ${
                    currentStage === st.id
                      ? 'bg-amber-400 text-slate-950 ring-2 ring-white scale-102 font-extrabold'
                      : locked
                      ? 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
                      : 'bg-white/20 text-white hover:bg-white/30 border border-white/25'
                  }`}
                >
                  <span>{st.label}</span>
                  {locked && <span className="text-amber-300 font-extrabold text-[10px]">🔒 Locked</span>}
                  {isMatch && <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.2 rounded font-extrabold">Active</span>}
                </button>
              );
            })}
          </div>

          {/* Auto Age Filter Toggle */}
          <div className="pt-1 flex items-center gap-2 text-xs text-purple-100">
            <label className="flex items-center gap-2 cursor-pointer font-bold select-none">
              <input
                type="checkbox"
                checked={filterToMyAgeOnly}
                onChange={(e) => {
                  sound.playClick();
                  setFilterToMyAgeOnly(e.target.checked);
                  if (e.target.checked) setCurrentStage(userCalculatedStage);
                }}
                className="rounded accent-amber-400 w-4 h-4 cursor-pointer"
              />
              <span>Show strictly objects for my registered age group (Age {userAge})</span>
            </label>
          </div>
        </div>
      </div>

      {/* Lock Notice Banner if viewing content beyond user's age */}
      {currentIsLocked && (
        <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-3xl text-xs text-amber-950 flex items-start gap-3 shadow-xs">
          <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-black text-sm text-amber-900">
              🔒 Age-Gated Module (Calibrated for {currentStage === 'junior' ? 'Ages 8–10' : 'Ages 11–17'})
            </div>
            <p className="text-slate-600 leading-relaxed">
              Based on your verified Date of Birth (<strong>{registeredDob}</strong>), you are currently <strong>{userAge} years old</strong>.
              Interactive controls in this section are locked/disabled to ensure safe, age-appropriate learning.
            </p>
            <button
              onClick={() => {
                sound.playClick();
                setCurrentStage(userCalculatedStage);
              }}
              className="mt-1 px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs cursor-pointer shadow-xs"
            >
              Return to My Age-Appropriate Lab ({userCalculatedStage === 'early' ? 'Ages 3–7' : userCalculatedStage === 'junior' ? 'Ages 8–10' : 'Teen'}) &rarr;
            </button>
          </div>
        </div>
      )}

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
                  <span className="text-[10px] font-extrabold bg-pink-100 text-pink-800 px-2 py-0.5 rounded-full">Ages 3–7</span>
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
                <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Ages 3–7</span>
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
                <button
                  onClick={() => {
                    setIsLaunching(true);
                    speak('Blast off! Rocket launches past the clouds!');
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
                      speak(item.sticks ? `${item.label} sticks to magnet!` : `${item.label} does not stick!`);
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
              { id: 'multiplication', label: '✖️ Speed Math Arena' }
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

          {juniorExp === 'volcano' && (
            <div className={`bg-white rounded-3xl p-6 sm:p-8 border-2 border-orange-200 shadow-sm space-y-6 ${currentIsLocked ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between border-b border-orange-100 pb-3">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <span>🌋 Acid-Base Volcano Reaction Lab</span>
                    <span className="text-[10px] font-extrabold bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">Ages 8–10</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂ ↑</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="p-8 bg-gradient-to-b from-orange-100 via-amber-50 to-slate-100 rounded-3xl border-2 border-orange-200 text-center">
                  <div className={`text-8xl ${volcanoErupted ? 'scale-125 animate-bounce' : ''}`}>
                    {volcanoErupted ? '🌋' : '⛰️'}
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleEruptVolcano}
                    disabled={currentIsLocked}
                    className={`w-full py-3 rounded-2xl font-black text-xs shadow-md transition-all ${
                      currentIsLocked
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white cursor-pointer active:scale-95'
                    }`}
                  >
                    {currentIsLocked ? '🔒 LOCKED (Requires Age 8+)' : 'POUR VINEGAR & TRIGGER ERUPTION! 💥 (+30 XP)'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {juniorExp === 'circuit' && (
            <div className={`bg-white rounded-3xl p-6 sm:p-8 border-2 border-yellow-200 shadow-sm space-y-6 ${currentIsLocked ? 'opacity-60' : ''}`}>
              <h3 className="text-base font-black text-slate-900">💡 Electric Circuit Builder</h3>
              <div className="p-8 bg-slate-900 rounded-3xl text-white text-center space-y-4">
                <div className="text-4xl">{circuitSwitch ? '💡' : '🌑'}</div>
                <button
                  onClick={() => {
                    if (currentIsLocked) return;
                    sound.playSuccess();
                    setCircuitSwitch(!circuitSwitch);
                  }}
                  disabled={currentIsLocked}
                  className={`px-6 py-2.5 rounded-2xl font-black text-xs ${
                    currentIsLocked ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-amber-400 text-slate-950 cursor-pointer'
                  }`}
                >
                  {currentIsLocked ? '🔒 Locked for Age 8+' : circuitSwitch ? 'OPEN SWITCH (Turn Off)' : 'CLOSE SWITCH (Complete Circuit)'}
                </button>
              </div>
            </div>
          )}

          {juniorExp === 'planets' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900">🪐 Planetary Gravity &amp; Weight ($F = m \cdot g$)</h3>
              <div className="flex flex-wrap gap-2">
                {['Moon', 'Mars', 'Earth', 'Jupiter'].map((p) => (
                  <button
                    key={p}
                    onClick={() => { sound.playClick(); setSelectedPlanet(p as any); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${selectedPlanet === p ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="p-4 bg-slate-950 text-amber-300 rounded-2xl font-black text-center text-sm">
                Weight on {selectedPlanet}: {(30 * (selectedPlanet === 'Moon' ? 0.16 : selectedPlanet === 'Mars' ? 0.38 : selectedPlanet === 'Jupiter' ? 2.5 : 1.0)).toFixed(1)} kg force
              </div>
            </div>
          )}

          {juniorExp === 'multiplication' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900">✖️ Fast Mental Multiplication Arena</h3>
              <form onSubmit={handleMathCheck} className="p-6 bg-emerald-50 rounded-2xl text-center space-y-3">
                <div className="text-3xl font-black text-emerald-950">{mathA} × {mathB} = ?</div>
                <div className="flex justify-center gap-2">
                  <input
                    type="number"
                    disabled={currentIsLocked}
                    value={userMathGuess}
                    onChange={(e) => setUserMathGuess(e.target.value)}
                    placeholder="Answer"
                    className="w-28 p-2 rounded-xl border bg-white font-bold text-center"
                  />
                  <button
                    type="submit"
                    disabled={currentIsLocked}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer"
                  >
                    Check
                  </button>
                </div>
              </form>
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
              { id: 'code', label: '💻 Python Algorithm Sandbox' }
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

          {teenExp === 'projectile' && (
            <div className={`bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-200 shadow-sm space-y-6 ${currentIsLocked ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                <h3 className="text-base font-black text-slate-900">🎯 Projectile Kinematics Simulation</h3>
                <span className="text-[10px] font-extrabold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">Ages 11–17</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Angle: {projectileAngle}&deg;</span>
                    <span>Velocity: {projectileVelocity} m/s</span>
                  </div>
                  <button
                    onClick={handleFireProjectile}
                    disabled={currentIsLocked}
                    className={`w-full py-3 rounded-2xl font-black text-xs shadow-md transition-all ${
                      currentIsLocked
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                    }`}
                  >
                    {currentIsLocked ? '🔒 LOCKED (Requires Age 11+)' : 'CALCULATE & FIRE TRAJECTORY 🎯 (+35 XP)'}
                  </button>
                </div>

                <div className="p-4 bg-slate-950 text-white rounded-2xl font-mono text-xs space-y-1">
                  <div>Max Height: {maxHeight} m</div>
                  <div>Range: {totalRange} m</div>
                  <div>Air Time: {flightTime} s</div>
                </div>
              </div>
            </div>
          )}

          {teenExp === 'punnett' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-purple-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900">🧬 Mendelian Genetics: Punnett Square Cross</h3>
              <div className="grid grid-cols-2 gap-2 text-center font-mono text-xs">
                <div className="p-3 bg-purple-50 rounded-xl font-bold">BB (25%)</div>
                <div className="p-3 bg-purple-50 rounded-xl font-bold">Bb (25%)</div>
                <div className="p-3 bg-purple-50 rounded-xl font-bold">Bb (25%)</div>
                <div className="p-3 bg-cyan-50 rounded-xl font-bold">bb (25% Blue Eyes)</div>
              </div>
            </div>
          )}

          {teenExp === 'code' && (
            <div className={`bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-300 shadow-sm space-y-4 ${currentIsLocked ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900">💻 Python 3.12 Algorithm Sandbox</h3>
                <button
                  onClick={handleRunCodeSnippet}
                  disabled={currentIsLocked}
                  className={`px-4 py-1.5 rounded-xl font-bold text-xs ${
                    currentIsLocked ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-emerald-600 text-white cursor-pointer'
                  }`}
                >
                  {currentIsLocked ? '🔒 Locked for Age 11+' : 'Run Script'}
                </button>
              </div>
              {codeSnippetOutput && (
                <div className="p-3 bg-slate-900 text-cyan-300 rounded-xl font-mono text-xs whitespace-pre-line">
                  {codeSnippetOutput}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
