import React, { useState } from 'react';
import {
  Trophy,
  Heart,
  Sparkles,
  Volume2,
  Medal,
  Users,
  Award
} from 'lucide-react';
import { UserProfile } from '../../../types';
import { sound } from '../../../utils/audio';
import { SpeechService } from '../../../services/speechService';

interface KidFriendsRankingProps {
  profile: UserProfile;
}

interface KidFriend {
  id: string;
  name: string;
  animal: string;
  badge: string;
  stars: number;
  highFivesReceived: number;
  favoriteSubject: string;
  motto: string;
}

export const KidFriendsRanking: React.FC<KidFriendsRankingProps> = ({ profile }) => {
  const [friends, setFriends] = useState<KidFriend[]>([
    {
      id: 'f_leo',
      name: 'Leo the Lion Cub',
      animal: '🦁',
      badge: '👑 Star King',
      stars: 48,
      highFivesReceived: 14,
      favoriteSubject: 'Dino Roar Math',
      motto: 'Always share my crayons!'
    },
    {
      id: 'f_bella',
      name: 'Bella Bunny',
      animal: '🐰',
      badge: '⭐ Story Hopper',
      stars: 42,
      highFivesReceived: 18,
      favoriteSubject: 'Fairy Tales',
      motto: 'Kind words make big smiles!'
    },
    {
      id: 'f_pete',
      name: 'Panda Pete',
      animal: '🐼',
      badge: '🎋 Bamboo Reader',
      stars: 39,
      highFivesReceived: 11,
      favoriteSubject: 'Color Mixing',
      motto: 'Practice makes us strong!'
    },
    {
      id: 'f_oliver',
      name: 'Oliver Fox',
      animal: '🦊',
      badge: '🧩 Puzzle Master',
      stars: 35,
      highFivesReceived: 9,
      favoriteSubject: 'Shapes & Patterns',
      motto: 'Curious questions are best!'
    },
    {
      id: 'f_sparkle',
      name: 'Sparkle Unicorn',
      animal: '🦄',
      badge: '🌈 Rainbow Artist',
      stars: 31,
      highFivesReceived: 21,
      favoriteSubject: 'Drawing & Songs',
      motto: 'Magic is helping others!'
    }
  ]);

  const [cheeredFriendId, setCheeredFriendId] = useState<string | null>(null);
  const [totalHighFivesGiven, setTotalHighFivesGiven] = useState(7);

  const speak = (text: string) => {
    sound.playClick();
    if (SpeechService.isSynthesisSupported()) {
      SpeechService.speak(text, 'en-US');
    }
  };

  const handleGiveHighFive = (friend: KidFriend) => {
    sound.playSuccess();
    setCheeredFriendId(friend.id);
    setTotalHighFivesGiven((prev) => prev + 1);

    setFriends((prev) =>
      prev.map((f) => (f.id === friend.id ? { ...f, highFivesReceived: f.highFivesReceived + 1 } : f))
    );

    speak(`High five! You sent a high five and star love to ${friend.name}!`);

    setTimeout(() => {
      setCheeredFriendId(null);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-3 top-3 opacity-20 text-8xl select-none pointer-events-none">
          🏅
        </div>
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider text-amber-950 border border-white/30">
            <span>🤝 Classroom Friendship Circle</span>
            <span>•</span>
            <span>All Smiles &amp; Cheering</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Friends &amp; Star Ranking!</span>
            <span className="text-3xl">🌟🎉</span>
          </h2>
          <p className="text-sm font-medium text-amber-50 leading-relaxed">
            Every kid is a champion! Cheer on your animal classmates, give high-fives, and collect friendship stars!
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white text-slate-900 font-black text-xs shadow-xs">
              <span className="text-amber-500">✋</span>
              <span>{totalHighFivesGiven} High-Fives Shared Today!</span>
            </div>
            <button
              onClick={() => speak('Welcome to Friends and Rankings! Everyone is doing great work! Tap High Five on any friend to cheer them on!')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/25 hover:bg-white/35 text-white font-bold text-xs backdrop-blur-md transition-all cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Read Aloud</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Showcase of the Student */}
      <div className="bg-gradient-to-tr from-amber-100 via-yellow-50 to-orange-100 rounded-3xl p-6 border-3 border-amber-300 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-amber-500 text-white font-black text-3xl flex items-center justify-center shadow-md ring-4 ring-amber-200">
              🧒
            </div>
            <span className="absolute -top-3 -right-2 text-2xl animate-bounce">👑</span>
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] uppercase tracking-wider">
              <span>🌟 You Are Star Champion!</span>
            </div>
            <h3 className="text-xl font-black text-slate-900">{profile.name} (Rank #1)</h3>
            <p className="text-xs text-slate-600 font-medium">
              Level {profile.level} Explorer · {profile.xp} Joyful XP Points
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-3 rounded-2xl border border-amber-200 text-center shadow-xs">
            <div className="text-2xl font-black text-amber-600">52 ⭐</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">My Star Vault</div>
          </div>
          <div className="bg-white px-4 py-3 rounded-2xl border border-amber-200 text-center shadow-xs">
            <div className="text-2xl font-black text-rose-600">12 💖</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">Cheers Received</div>
          </div>
        </div>
      </div>

      {/* Friends List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-600" />
            <span>Classmate Friends &amp; Kindness Buddies</span>
          </h4>
          <span className="text-xs font-bold text-slate-400">Tap High-Five to cheer! ✋</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {friends.map((friend, idx) => (
            <div
              key={friend.id}
              className={`bg-white rounded-3xl p-5 border-2 transition-all shadow-xs flex items-center justify-between gap-4 ${
                cheeredFriendId === friend.id
                  ? 'border-rose-400 bg-rose-50/50 scale-102 ring-2 ring-rose-200'
                  : 'border-slate-200 hover:border-amber-300'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl shadow-xs border border-slate-200 relative shrink-0">
                  {friend.animal}
                  <span className="absolute -bottom-1 -right-1 text-[10px] font-black bg-amber-400 text-slate-950 px-1.5 rounded-full border border-white">
                    #{idx + 2}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-slate-900 text-sm">{friend.name}</span>
                    <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      {friend.badge}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Likes: <span className="font-semibold text-slate-700">{friend.favoriteSubject}</span>
                  </div>
                  <div className="text-[11px] text-amber-700 italic mt-0.5 font-medium">
                    &ldquo;{friend.motto}&rdquo;
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <div className="text-xs font-black text-slate-800 flex items-center gap-1">
                  <span>⭐</span>
                  <span>{friend.stars}</span>
                </div>
                <button
                  onClick={() => handleGiveHighFive(friend)}
                  className="px-3.5 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-90 text-slate-950 font-black text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>✋</span>
                  <span>High Five!</span>
                  <span className="text-[10px] text-amber-900 font-extrabold">({friend.highFivesReceived})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kindness Badge Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <span className="text-4xl">🏅</span>
          <div>
            <h4 className="font-black text-base text-white">Friendship Golden Rule</h4>
            <p className="text-xs text-emerald-100">
              When we cheer on our friends, we all learn faster and have 10 times more fun together!
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            sound.playLevelUp();
            speak('Hurray for good friends! High fives all around the classroom!');
          }}
          className="px-5 py-2.5 rounded-2xl bg-white text-emerald-900 font-black text-xs shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          Cheer Entire Class! 🎉
        </button>
      </div>
    </div>
  );
};
