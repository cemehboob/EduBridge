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
  FileCheck
} from 'lucide-react';
import { UserProfile } from '../../../types';
import { sound } from '../../../utils/audio';
import { SpeechService } from '../../../services/speechService';

interface KidFutureDreamsProps {
  profile: UserProfile;
}

interface KidDreamCareer {
  id: string;
  title: string;
  emoji: string;
  tagline: string;
  uniform: string;
  description: string;
  funMissions: string[];
  gear: string[];
  bgColor: string;
}

export const KidFutureDreams: React.FC<KidFutureDreamsProps> = ({ profile }) => {
  const dreams: KidDreamCareer[] = [
    {
      id: 'astronaut',
      title: 'Astronaut Space Explorer',
      emoji: '🚀',
      tagline: 'Fly rockets to Mars and bounce on the Moon!',
      uniform: 'White Pressurized Space Helmet & Rocket Boots',
      description: 'Astronauts fly big silver rockets past the clouds into outer space, float in zero gravity, and discover new planets and sparkling stars!',
      funMissions: [
        'Count 5 twinkling stars in the night sky',
        'Build a LEGO or cardboard spaceship',
        'Learn the magic word: "Orbit" (flying in a circle)'
      ],
      gear: ['Space Helmet 👩‍🚀', 'Jetpack 🎒', 'Moon Flag 🚩', 'Telescope 🔭'],
      bgColor: 'from-indigo-500 to-purple-600'
    },
    {
      id: 'vet',
      title: 'Animal Doctor & Vet',
      emoji: '🩺',
      tagline: 'Care for puppies, cuddle kittens, and heal horses!',
      uniform: 'Doctor Coat with Heart Stethoscope',
      description: 'Veterinarians are animal doctors who listen to puppy heartbeats, bandage broken bird wings, and give kittens healthy medicine so they purr with joy!',
      funMissions: [
        'Give fresh water and a gentle pet to an animal',
        'Learn what healthy foods puppies and kittens eat',
        'Practice gentle listening to animal sounds'
      ],
      gear: ['Stethoscope 🩺', 'Animal Treats 🦴', 'Soft Bandage 🩹', 'Pet Brush 🪮'],
      bgColor: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'artist',
      title: 'Master Cartoon Artist',
      emoji: '🎨',
      tagline: 'Draw magical cartoons and invent colorful worlds!',
      uniform: 'Rainbow Beret & Paintbrush Apron',
      description: 'Artists paint giant rainbow murals, design friendly superhero cartoons, and bring storybooks to life with bright watercolors and imagination!',
      funMissions: [
        'Draw a colorful picture of your family',
        'Mix red and yellow to make bright orange',
        'Invent a friendly monster or fairy character'
      ],
      gear: ['Paint Palette 🎨', 'Magic Brushes 🖌️', 'Sketchbook 📒', 'Glitter Pens ✨'],
      bgColor: 'from-pink-500 to-rose-600'
    },
    {
      id: 'firefighter',
      title: 'Brave Hero Firefighter',
      emoji: '🚒',
      tagline: 'Drive the red fire engine and rescue fluffy pets!',
      uniform: 'Bright Red Helmet & High-Pressure Water Hose',
      description: 'Firefighters rush to the rescue in huge red fire engines with loud sirens, extinguish scary fires with powerful water hoses, and rescue friendly cats stuck high up in trees!',
      funMissions: [
        'Learn your home phone number and address',
        'Find two emergency exits in your home',
        'Practice "Stop, Drop, and Roll"'
      ],
      gear: ['Red Helmet 🪖', 'Fire Engine 🚒', 'Water Hose 💦', 'Rescue Ladder 🪜'],
      bgColor: 'from-rose-500 to-amber-600'
    },
    {
      id: 'paleontologist',
      title: 'Dino Hunter (Paleontologist)',
      emoji: '🦕',
      tagline: 'Dig in the sand to find giant dinosaur skeletons!',
      uniform: 'Safari Hat, Magnifying Glass & Dusting Brush',
      description: 'Dinosaur scientists travel to deserts and rocky mountains, carefully brushing away ancient sand to discover giant T-Rex bones and dinosaur eggs!',
      funMissions: [
        'Name 3 different dinosaurs (T-Rex, Triceratops, Stegosaurus)',
        'Hide a toy bone in the sand and dig it up',
        'Roar like a friendly dinosaur!'
      ],
      gear: ['Magnifying Glass 🔍', 'Dusting Brush 🧹', 'Excavation Hammer 🔨', 'Dino Egg 🥚'],
      bgColor: 'from-amber-500 to-orange-600'
    },
    {
      id: 'pilot',
      title: 'Cloud Airplane Pilot',
      emoji: '✈️',
      tagline: 'Steer giant airplanes through fluffy rainbow clouds!',
      uniform: 'Pilot Captain Hat & Gold Aviator Wings',
      description: 'Airplane pilots sit in the flight cockpit, steer giant jetliners above the storm clouds, and fly families to magical vacation beaches and snowy mountains!',
      funMissions: [
        'Fold a paper airplane and fly it across the room',
        'Point to the fluffy white clouds in the sky',
        'Learn the words "Takeoff" and "Landing"'
      ],
      gear: ['Captain Hat 🧑‍✈️', 'Aviator Sunglasses 🕶️', 'Flight Map 🗺️', 'Compass 🧭'],
      bgColor: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'chef',
      title: 'Master Cupcake Baker & Chef',
      emoji: '👨‍🍳',
      tagline: 'Bake chocolate cupcakes with rainbow sprinkles!',
      uniform: 'Tall White Chef Hat & Colorful Apron',
      description: 'Chefs and bakers whip up delicious blueberry pancakes, decorate chocolate cakes with rainbow sprinkles, and prepare healthy yummy feasts for loved ones!',
      funMissions: [
        'Help stir pancake batter or wash fruit',
        'Name 4 healthy fruits and vegetables',
        'Decorate a biscuit with rainbow sprinkles'
      ],
      gear: ['Chef Hat 👨‍🍳', 'Rolling Pin 🥖', 'Whisk 🥣', 'Rainbow Sprinkles 🧁'],
      bgColor: 'from-orange-500 to-amber-600'
    },
    {
      id: 'marine',
      title: 'Ocean Dolphin Explorer',
      emoji: '🐬',
      tagline: 'Swim with friendly dolphins and explore coral reefs!',
      uniform: 'Underwater Diving Goggles & Swimming Fins',
      description: 'Marine explorers dive into turquoise ocean lagoons to swim beside gentle dolphins, feed colorful clownfish, and protect magical coral reefs!',
      funMissions: [
        'Learn the sounds that ocean dolphins make',
        'Name 3 sea creatures (Dolphin, Sea Turtle, Octopus)',
        'Promise to keep beaches and waters clean from trash'
      ],
      gear: ['Diving Goggles 🤿', 'Swimming Fins 🏊', 'Underwater Camera 📷', 'Seashell 🐚'],
      bgColor: 'from-cyan-500 to-blue-600'
    }
  ];

  const [selectedDream, setSelectedDream] = useState<KidDreamCareer>(dreams[0]);
  const [favoriteDreamId, setFavoriteDreamId] = useState<string>('astronaut');
  const [completedMissions, setCompletedMissions] = useState<{ [key: string]: boolean }>({});
  const [showCertificate, setShowCertificate] = useState(false);

  const speak = (text: string) => {
    sound.playClick();
    if (SpeechService.isSynthesisSupported()) {
      SpeechService.speak(text, 'en-US');
    }
  };

  const handleSelectDream = (dream: KidDreamCareer) => {
    sound.playClick();
    setSelectedDream(dream);
    speak(`You selected ${dream.title}! ${dream.tagline}`);
  };

  const handleSetAsFavorite = (dream: KidDreamCareer) => {
    sound.playLevelUp();
    setFavoriteDreamId(dream.id);
    speak(`Hooray! ${dream.title} is now your number one future dream goal!`);
  };

  const handleToggleMission = (missionText: string) => {
    sound.playSuccess();
    setCompletedMissions((prev) => ({
      ...prev,
      [missionText]: !prev[missionText]
    }));
  };

  const handlePrintCertificate = () => {
    sound.playSuccess();
    setShowCertificate(true);
    speak(`Congratulations ${profile.name}! Here is your official Junior Certificate!`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-3 top-3 opacity-20 text-8xl select-none pointer-events-none">
          💼
        </div>
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider text-blue-100 border border-white/30">
            <span>⭐ When I Grow Up Explorer</span>
            <span>•</span>
            <span>Future Dreams</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Future Dreams &amp; Super Adventures!</span>
            <span className="text-3xl">🚀🩺🎨</span>
          </h2>
          <p className="text-sm font-medium text-blue-100 leading-relaxed">
            What exciting dream do you want to explore? Pick your dream career, wear your super gear, and earn an official Junior Certificate!
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handlePrintCertificate}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>View My Junior Certificate 📜</span>
            </button>
            <button
              onClick={() => speak('What do you want to be when you grow up? You can be an astronaut, an animal doctor, a painter, a firefighter, and anything you dream!')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/25 hover:bg-white/35 text-white font-bold text-xs backdrop-blur-md transition-all cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Read Aloud</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dream Careers Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Choose Your Favorite Dream:</span>
          </h4>
          <span className="text-xs font-bold text-slate-400">Tap to inspect gear &amp; missions</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {dreams.map((dream) => {
            const isSelected = selectedDream.id === dream.id;
            const isFavorite = favoriteDreamId === dream.id;

            return (
              <div
                key={dream.id}
                onClick={() => handleSelectDream(dream)}
                className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between text-center space-y-2 hover:scale-103 ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50/60 shadow-md ring-2 ring-indigo-200'
                    : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="relative">
                  <div className="text-4xl sm:text-5xl my-1">{dream.emoji}</div>
                  {isFavorite && (
                    <span className="absolute -top-1 -right-1 text-base" title="Your #1 Dream">
                      ⭐
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-black text-xs sm:text-sm text-slate-900 leading-tight">
                    {dream.title}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                    {dream.tagline}
                  </div>
                </div>

                <div className="pt-2">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {isSelected ? 'Viewing' : 'Explore'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Dream Details Showcase */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${selectedDream.bgColor} text-white font-black text-3xl flex items-center justify-center shadow-md`}>
              {selectedDream.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900">{selectedDream.title}</h3>
                {favoriteDreamId === selectedDream.id && (
                  <span className="text-xs font-black bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                    <span>⭐</span>
                    <span>My #1 Dream!</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">{selectedDream.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => speak(`${selectedDream.title}! ${selectedDream.description}`)}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              title="Hear description aloud"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleSetAsFavorite(selectedDream)}
              className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-950 font-black text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>⭐</span>
              <span>Set as My #1 Dream</span>
            </button>
          </div>
        </div>

        {/* Story Description */}
        <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-xs text-indigo-950 leading-relaxed font-medium">
          {selectedDream.description}
        </div>

        {/* Super Gear Section */}
        <div className="space-y-2">
          <div className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <span>🎒 My Super Dream Gear</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {selectedDream.gear.map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center font-bold text-xs text-slate-800 hover:bg-slate-100 transition-colors"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Fun Mini Missions */}
        <div className="space-y-3">
          <div className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <span>🎯 3 Fun Starter Missions for Today:</span>
          </div>
          <div className="space-y-2">
            {selectedDream.funMissions.map((mission, idx) => {
              const isDone = completedMissions[mission] === true;

              return (
                <div
                  key={idx}
                  onClick={() => handleToggleMission(mission)}
                  className={`p-3.5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    isDone ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-black text-xs flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </div>
                    <span className={`text-xs font-bold ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {mission}
                    </span>
                  </div>
                  <div className="shrink-0">
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
            <div className="absolute top-2 left-2 text-2xl opacity-40">⭐</div>
            <div className="absolute top-2 right-2 text-2xl opacity-40">⭐</div>
            <div className="absolute bottom-2 left-2 text-2xl opacity-40">⭐</div>
            <div className="absolute bottom-2 right-2 text-2xl opacity-40">⭐</div>

            <div className="space-y-2">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-400 text-slate-950 font-black text-3xl flex items-center justify-center shadow-md">
                📜
              </div>
              <div className="text-[11px] font-black uppercase tracking-widest text-amber-700">
                Official EduBridge Junior Honors
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Certificate of Future Dreams
              </h3>
            </div>

            <div className="p-6 bg-amber-50/80 rounded-2xl border-2 border-dashed border-amber-300 space-y-3">
              <div className="text-xs text-slate-600 font-medium">This is officially presented to:</div>
              <div className="text-2xl font-black text-indigo-900 underline decoration-amber-400 decoration-wavy">
                {profile.name}
              </div>
              <div className="text-xs text-slate-600 font-medium">For daring to dream and train to become a future:</div>
              <div className="text-lg font-black text-amber-900 bg-white py-2 px-4 rounded-xl border border-amber-200 inline-block">
                {selectedDream.emoji} {selectedDream.title}
              </div>
              <div className="text-[10px] text-slate-500 pt-1">
                Issued with highest honors on {new Date().toLocaleDateString()}
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
                <span>Print / Save Certificate</span>
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
