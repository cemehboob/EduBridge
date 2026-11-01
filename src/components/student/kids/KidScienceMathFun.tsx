import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  RefreshCw,
  Award,
  CheckCircle2,
  HelpCircle,
  Play,
  RotateCcw
} from 'lucide-react';
import { sound } from '../../../utils/audio';
import { SpeechService } from '../../../services/speechService';

interface KidScienceMathFunProps {
  onEarnXp?: (amount: number) => void;
}

export const KidScienceMathFun: React.FC<KidScienceMathFunProps> = ({ onEarnXp }) => {
  const [activeExperiment, setActiveExperiment] = useState<'rainbow' | 'dino' | 'rocket' | 'magnet' | 'plant'>('rainbow');
  const [starsWon, setStarsWon] = useState(6);

  // 1. Rainbow Mixer State
  const [color1, setColor1] = useState<'red' | 'yellow' | 'blue' | null>('red');
  const [color2, setColor2] = useState<'red' | 'yellow' | 'blue' | null>('blue');
  const [mixedColor, setMixedColor] = useState<string | null>('Purple 🍇');
  const [mixAnimation, setMixAnimation] = useState(false);

  // 2. Dino Math State
  const [dinoCount, setDinoCount] = useState<number>(4);
  const [dinoAnswerFeedback, setDinoAnswerFeedback] = useState<string | null>(null);

  // 3. Rocket Space State
  const [fuelLevel, setFuelLevel] = useState<number>(3);
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchMessage, setLaunchMessage] = useState<string | null>(null);

  // 4. Magnet Magic State
  const [testedItems, setTestedItems] = useState<{ [key: string]: boolean }>({
    paperclip: true,
    wood: false
  });

  // 5. Plant Sprout State
  const [plantStage, setPlantStage] = useState<number>(2); // 0=seed, 1=sprout, 2=stem, 3=flower

  const speak = (text: string) => {
    sound.playClick();
    if (SpeechService.isSynthesisSupported()) {
      SpeechService.speak(text, 'en-US');
    }
  };

  const handleMixColors = () => {
    sound.playSuccess();
    setMixAnimation(true);
    setTimeout(() => {
      setMixAnimation(false);
      if (!color1 || !color2) {
        setMixedColor(null);
        return;
      }
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
      speak(`Super job! There are exactly ${dinoCount} friendly dinosaurs!`);
      setStarsWon((s) => s + 1);
      if (onEarnXp) onEarnXp(20);
    } else {
      sound.playError();
      setDinoAnswerFeedback(`Oops! Try counting one by one! There are more than ${guess}.`);
      speak(`Oops! Let's count them together! 1, 2, 3...`);
    }
  };

  const nextDinoRound = () => {
    sound.playClick();
    const next = Math.floor(Math.random() * 6) + 2; // 2 to 7
    setDinoCount(next);
    setDinoAnswerFeedback(null);
  };

  const handleLaunchRocket = () => {
    if (isLaunching) return;
    sound.playLevelUp();
    setIsLaunching(true);
    setLaunchMessage('3... 2... 1... BLAST OFF! 🚀 Flying past the clouds to outer space!');
    speak('Three, two, one, blast off! The rocket zoomed into the starry sky!');
    setTimeout(() => {
      setIsLaunching(false);
      setStarsWon((s) => s + 2);
      if (onEarnXp) onEarnXp(30);
    }, 2500);
  };

  const handleTestMagnet = (item: 'paperclip' | 'wood' | 'key' | 'rubber_duck') => {
    sound.playSuccess();
    const sticks = item === 'paperclip' || item === 'key';
    setTestedItems((prev) => ({ ...prev, [item]: sticks }));
    if (sticks) {
      speak(`SNAP! The metal ${item} sticks to the magnet like magic!`);
    } else {
      speak(`Whoosh! The magnet does not pull the ${item.replace('_', ' ')}!`);
    }
    setStarsWon((s) => s + 1);
  };

  const handleWaterPlant = () => {
    sound.playSuccess();
    if (plantStage < 3) {
      const next = plantStage + 1;
      setPlantStage(next);
      if (next === 1) speak('The seed drank water and popped a tiny green sprout!');
      if (next === 2) speak('The sprout drank sunshine and grew strong green leaves!');
      if (next === 3) speak('Hooray! A giant golden sunflower bloomed!');
      setStarsWon((s) => s + 1);
      if (onEarnXp) onEarnXp(25);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-3 top-3 opacity-20 text-8xl select-none pointer-events-none">
          🔬
        </div>
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider text-amber-200 border border-white/30">
            <span>🧸 Kid Explorer Lab</span>
            <span>•</span>
            <span>Ages 3 to 7</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Science &amp; Math Fun!</span>
            <span className="text-3xl">🧪✨</span>
          </h2>
          <p className="text-sm font-medium text-purple-100 leading-relaxed">
            Touch, mix, count, and discover amazing secrets about animals, colors, rockets, and numbers!
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs shadow-xs">
              <span>⭐</span>
              <span>{starsWon} Gold Stars Earned</span>
            </div>
            <button
              onClick={() => speak('Welcome to Science and Math Fun! Choose an experiment below to start playing!')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/25 hover:bg-white/35 text-white font-bold text-xs backdrop-blur-md transition-all cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Read Aloud</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Pills between the 5 Experiments */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'rainbow', label: '🌈 Rainbow Color Mixer', color: 'from-pink-500 to-rose-500' },
          { id: 'dino', label: '🦕 Dino Counting Math', color: 'from-emerald-500 to-teal-500' },
          { id: 'rocket', label: '🚀 Rocket Space Blast', color: 'from-indigo-500 to-purple-500' },
          { id: 'magnet', label: '🧲 Magnet Magic', color: 'from-blue-500 to-cyan-500' },
          { id: 'plant', label: '🌻 Sunflower Grow Lab', color: 'from-amber-500 to-orange-500' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              sound.playClick();
              setActiveExperiment(tab.id as any);
            }}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer shadow-xs ${
              activeExperiment === tab.id
                ? `bg-gradient-to-r ${tab.color} text-white ring-2 ring-purple-300 scale-102`
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Experiment 1: Rainbow Mixer */}
      {activeExperiment === 'rainbow' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-pink-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-pink-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span>🌈 Magic Rainbow Color Mixer</span>
              </h3>
              <p className="text-xs text-slate-500">Pick two magical colors to pour into the magic jar!</p>
            </div>
            <button
              onClick={() => speak('Pick two primary colors. Red, yellow, or blue! Tap Mix to see the new color!')}
              className="p-2 rounded-xl bg-pink-50 text-pink-700 hover:bg-pink-100 cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Color 1 Picker */}
            <div className="bg-pink-50/60 rounded-2xl p-4 border border-pink-100 text-center space-y-3">
              <span className="text-xs font-black uppercase text-pink-700 tracking-wider">Color #1</span>
              <div className="flex justify-center gap-2">
                {[
                  { name: 'red', emoji: '🔴', label: 'Red' },
                  { name: 'yellow', emoji: '🟡', label: 'Yellow' },
                  { name: 'blue', emoji: '🔵', label: 'Blue' }
                ].map((c) => (
                  <button
                    key={c.name}
                    onClick={() => { sound.playClick(); setColor1(c.name as any); }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                      color1 === c.name ? 'border-pink-500 bg-white shadow-md scale-105' : 'border-transparent bg-white/70 hover:bg-white'
                    }`}
                  >
                    <span className="text-lg block">{c.emoji}</span>
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mixing Center */}
            <div className="text-center space-y-3">
              <div className={`w-28 h-28 mx-auto rounded-3xl border-4 border-dashed border-pink-300 flex flex-col items-center justify-center transition-all ${
                mixAnimation ? 'animate-bounce bg-purple-200 scale-110' : 'bg-slate-50'
              }`}>
                <span className="text-4xl">{mixAnimation ? '🫧' : '⚗️'}</span>
                <span className="text-[10px] font-black text-slate-500 mt-1">MAGIC JAR</span>
              </div>
              <button
                onClick={handleMixColors}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                POUR &amp; MIX! ✨ (+20 XP)
              </button>
            </div>

            {/* Color 2 Picker */}
            <div className="bg-purple-50/60 rounded-2xl p-4 border border-purple-100 text-center space-y-3">
              <span className="text-xs font-black uppercase text-purple-700 tracking-wider">Color #2</span>
              <div className="flex justify-center gap-2">
                {[
                  { name: 'red', emoji: '🔴', label: 'Red' },
                  { name: 'yellow', emoji: '🟡', label: 'Yellow' },
                  { name: 'blue', emoji: '🔵', label: 'Blue' }
                ].map((c) => (
                  <button
                    key={c.name}
                    onClick={() => { sound.playClick(); setColor2(c.name as any); }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                      color2 === c.name ? 'border-purple-500 bg-white shadow-md scale-105' : 'border-transparent bg-white/70 hover:bg-white'
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
            <div className="p-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl border-2 border-purple-300 text-center animate-in zoom-in-95">
              <div className="text-xs font-black uppercase tracking-wider text-purple-700 mb-1">🎉 Wow! Color Created:</div>
              <div className="text-xl font-black text-purple-900">{mixedColor}</div>
            </div>
          )}
        </div>
      )}

      {/* Experiment 2: Dino Counting Math */}
      {activeExperiment === 'dino' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span>🦕 Dino Count &amp; Number Adventure</span>
              </h3>
              <p className="text-xs text-slate-500">Count how many friendly dinosaurs are walking in the prehistoric forest!</p>
            </div>
            <button
              onClick={() => speak(`How many friendly dinosaurs do you see? Tap the number below!`)}
              className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Dinosaurs Display */}
          <div className="p-8 bg-emerald-50/70 rounded-3xl border-2 border-emerald-200/80 flex flex-wrap items-center justify-center gap-4 min-h-[160px]">
            {Array.from({ length: dinoCount }).map((_, i) => (
              <div
                key={i}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white shadow-sm flex flex-col items-center justify-center border border-emerald-200 hover:scale-110 transition-transform cursor-pointer"
                onClick={() => {
                  sound.playClick();
                  speak(`Dinosaur number ${i + 1}`);
                }}
              >
                <span className="text-3xl sm:text-4xl">{i % 2 === 0 ? '🦕' : '🦖'}</span>
                <span className="text-[10px] font-black text-emerald-700 mt-1">#{i + 1}</span>
              </div>
            ))}
          </div>

          {/* Number Guesses */}
          <div className="space-y-3">
            <div className="text-xs font-black text-slate-700 text-center uppercase tracking-wider">
              Tap the correct number:
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <button
                  key={n}
                  onClick={() => handleDinoGuess(n)}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border-2 border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50 text-slate-900 font-black text-lg sm:text-xl shadow-xs transition-all active:scale-90 cursor-pointer"
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {dinoAnswerFeedback && (
            <div className="p-4 bg-emerald-100 rounded-2xl text-center font-black text-emerald-900 text-sm border border-emerald-300 flex items-center justify-between">
              <span>{dinoAnswerFeedback}</span>
              <button
                onClick={nextDinoRound}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Next Dino Round 🔄
              </button>
            </div>
          )}
        </div>
      )}

      {/* Experiment 3: Rocket Gravity Blast */}
      {activeExperiment === 'rocket' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-indigo-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span>🚀 Rocket Space &amp; Gravity Blast</span>
              </h3>
              <p className="text-xs text-slate-500">Give your rocket fuel stars and launch to orbit the Moon!</p>
            </div>
            <button
              onClick={() => speak('Give your rocket fuel power, then tap Launch to fly through the stars!')}
              className="p-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8 bg-slate-950 rounded-3xl text-white text-center space-y-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
            <div className="relative z-10 space-y-4">
              <div className={`text-6xl sm:text-7xl transition-transform duration-1000 ${
                isLaunching ? '-translate-y-24 scale-150 rotate-6' : 'translate-y-0'
              }`}>
                🚀
              </div>

              {isLaunching ? (
                <div className="text-amber-300 font-black text-lg animate-pulse">
                  🔥 WHOOSH! Rocket engines blazing! Flying to the stars!
                </div>
              ) : (
                <div className="text-slate-300 text-xs font-semibold">
                  Rocket is on Launchpad ready for departure!
                </div>
              )}

              {/* Fuel Level */}
              <div className="max-w-xs mx-auto space-y-1.5">
                <div className="flex justify-between text-xs text-slate-300 font-bold">
                  <span>Star Fuel Power</span>
                  <span className="text-amber-400">{'⭐'.repeat(fuelLevel)}</span>
                </div>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => { sound.playClick(); setFuelLevel(lvl); }}
                      className={`w-10 h-10 rounded-xl font-black text-xs border ${
                        fuelLevel >= lvl ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {lvl}★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <button
                  onClick={handleLaunchRocket}
                  disabled={isLaunching}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-rose-500 hover:from-amber-300 hover:to-rose-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  {isLaunching ? 'FLYING THROUGH SPACE...' : 'COUNTDOWN & LAUNCH! 🚀'}
                </button>
              </div>
            </div>
          </div>

          {launchMessage && (
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs font-bold text-indigo-900 flex items-center justify-between">
              <span>{launchMessage}</span>
              <span className="text-emerald-700 font-black">+30 XP Won!</span>
            </div>
          )}
        </div>
      )}

      {/* Experiment 4: Magnet Magic */}
      {activeExperiment === 'magnet' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-blue-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-blue-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span>🧲 Magnet Magic: Attract or Not?</span>
              </h3>
              <p className="text-xs text-slate-500">Tap each object to test if the superpower magnet attracts it!</p>
            </div>
            <button
              onClick={() => speak('Magnets love metals like iron and steel! Tap each toy to test if it sticks!')}
              className="p-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { id: 'paperclip', label: 'Iron Paperclip', emoji: '📎', magnetic: true },
              { id: 'wood', label: 'Wooden Block', emoji: '🪵', magnetic: false },
              { id: 'key', label: 'Silver Metal Key', emoji: '🔑', magnetic: true },
              { id: 'rubber_duck', label: 'Rubber Duckie', emoji: '🦆', magnetic: false }
            ].map((item) => {
              const isTested = testedItems[item.id] !== undefined;
              const sticks = testedItems[item.id] === true;

              return (
                <div
                  key={item.id}
                  onClick={() => handleTestMagnet(item.id as any)}
                  className={`p-5 rounded-2xl border-2 text-center space-y-2 cursor-pointer transition-all hover:scale-105 ${
                    isTested
                      ? sticks
                        ? 'border-emerald-400 bg-emerald-50'
                        : 'border-slate-300 bg-slate-50'
                      : 'border-blue-200 bg-white hover:border-blue-400'
                  }`}
                >
                  <div className="text-4xl">{item.emoji}</div>
                  <div className="font-black text-xs text-slate-900">{item.label}</div>
                  <div className="pt-1">
                    {isTested ? (
                      sticks ? (
                        <span className="text-[11px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          STICK! 🧲✨
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                          No Stick 💨
                        </span>
                      )
                    ) : (
                      <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        Tap to Test
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Experiment 5: Sunflower Grow Lab */}
      {activeExperiment === 'plant' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-amber-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span>🌻 Sunflower Sunshine &amp; Water Lab</span>
              </h3>
              <p className="text-xs text-slate-500">Give water and sunshine to grow a giant happy flower!</p>
            </div>
            <button
              onClick={() => speak('Plants need water, healthy soil, and sunshine to sprout into giant blooming flowers!')}
              className="p-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8 bg-amber-50/70 rounded-3xl border-2 border-amber-200 text-center space-y-4">
            <div className="text-7xl sm:text-8xl transition-all duration-500">
              {plantStage === 0 && '🌰'}
              {plantStage === 1 && '🌱'}
              {plantStage === 2 && '🌿'}
              {plantStage === 3 && '🌻'}
            </div>

            <div className="text-sm font-black text-slate-900">
              {plantStage === 0 && 'Stage 1: Tiny Sleeping Seed in Rich Soil'}
              {plantStage === 1 && 'Stage 2: Little Green Sprout Peeking Up!'}
              {plantStage === 2 && 'Stage 3: Healthy Stem & Leaves Drinking Sun!'}
              {plantStage === 3 && 'Stage 4: Giant Happy Sunflower Fully Bloomed!'}
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleWaterPlant}
                disabled={plantStage >= 3}
                className={`px-6 py-3 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer ${
                  plantStage >= 3
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
                }`}
              >
                💧 WATER &amp; SUNSHINE (+25 XP)
              </button>
              {plantStage >= 3 && (
                <button
                  onClick={() => { sound.playClick(); setPlantStage(0); }}
                  className="px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md"
                >
                  Plant Another Seed 🌰
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
