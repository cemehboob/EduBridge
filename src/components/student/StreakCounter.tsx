import React, { useState, useMemo } from 'react';
import {
  Flame,
  Trophy,
  Calendar as CalendarIcon,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
  Zap,
  Target,
  PartyPopper
} from 'lucide-react';
import { UserProfile } from '../../types';
import { sound } from '../../utils/audio';
import { triggerCelebration } from '../../utils/celebration';

interface StreakCounterProps {
  profile: UserProfile;
  onCelebrate?: (type: 'streak') => void;
}

interface DayActivity {
  dayNumber: number;
  dateStr: string;
  dayOfWeek: string;
  isToday: boolean;
  isFuture: boolean;
  isStreakDay: boolean;
  xpEarned: number;
  lessonsCompleted: number;
  goalAchieved: boolean;
  status: 'active' | 'rest' | 'freeze' | 'future';
}

export const StreakCounter: React.FC<StreakCounterProps> = ({
  profile,
  onCelebrate
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedDay, setSelectedDay] = useState<DayActivity | null>(null);

  // Month & Heatmap Calculations
  const {
    monthName,
    year,
    daysInMonth,
    firstDayOfWeek,
    daysActivity,
    totalMonthXp,
    activeDaysThisMonth
  } = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed
    const todayDate = now.getDate();

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthName = monthNames[month];

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sunday

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const streakLength = profile.currentStreak;
    const streakStartDay = Math.max(1, todayDate - streakLength + 1);

    let totalMonthXp = 0;
    let activeDaysCount = 0;

    const daysActivity: DayActivity[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const isToday = day === todayDate;
      const isFuture = day > todayDate;
      const isStreakDay = !isFuture && day >= streakStartDay && day <= todayDate;

      let xp = 0;
      let lessons = 0;
      let goalAchieved = false;
      let status: 'active' | 'rest' | 'freeze' | 'future' = 'rest';

      if (isFuture) {
        status = 'future';
      } else if (isToday) {
        xp = profile.todayXp;
        lessons = Math.max(1, Math.floor(profile.todayXp / 20));
        goalAchieved = profile.todayXp >= profile.dailyGoalXp;
        status = xp > 0 ? 'active' : 'freeze';
        if (xp > 0) activeDaysCount++;
        totalMonthXp += xp;
      } else if (isStreakDay) {
        // Deterministic realistic XP for past streak days
        xp = ((day * 19 + 7) % 55) + 40; // 40 to 95 XP
        lessons = Math.floor(xp / 25) + 1;
        goalAchieved = xp >= profile.dailyGoalXp;
        status = 'active';
        activeDaysCount++;
        totalMonthXp += xp;
      } else {
        // Days earlier in the month before current streak run
        // Seeded realistic activity (some study days, a rest day, a streak freeze)
        const seed = (day * 13) % 10;
        if (day === streakStartDay - 1 && streakStartDay > 1) {
          status = 'freeze'; // freeze used right before current streak
          xp = 15;
          lessons = 1;
          activeDaysCount++;
          totalMonthXp += xp;
        } else if (seed > 3) {
          xp = ((day * 11) % 40) + 30;
          lessons = 2;
          goalAchieved = xp >= profile.dailyGoalXp;
          status = 'active';
          activeDaysCount++;
          totalMonthXp += xp;
        } else {
          status = 'rest';
          xp = 0;
          lessons = 0;
        }
      }

      daysActivity.push({
        dayNumber: day,
        dateStr: `${monthName} ${day}, ${year}`,
        dayOfWeek: weekdays[dateObj.getDay()],
        isToday,
        isFuture,
        isStreakDay,
        xpEarned: xp,
        lessonsCompleted: lessons,
        goalAchieved,
        status
      });
    }

    return {
      monthName,
      year,
      daysInMonth,
      firstDayOfWeek,
      daysActivity,
      totalMonthXp,
      activeDaysThisMonth: activeDaysCount
    };
  }, [profile.currentStreak, profile.todayXp, profile.dailyGoalXp]);

  const handleCelebrate = () => {
    sound.playLevelUp();
    triggerCelebration('streak');
    if (onCelebrate) onCelebrate('streak');
  };

  // Intensity color styling for heatmap
  const getIntensityClasses = (day: DayActivity) => {
    if (day.isFuture) {
      return 'bg-slate-50 text-slate-300 border-dashed border-slate-200 cursor-not-allowed';
    }
    if (day.status === 'freeze') {
      return 'bg-cyan-100 text-cyan-800 border-cyan-300 font-bold';
    }
    if (day.xpEarned === 0) {
      return 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200';
    }
    if (day.xpEarned < 35) {
      return 'bg-amber-100 text-amber-900 border-amber-200 hover:bg-amber-200';
    }
    if (day.xpEarned < 65) {
      return 'bg-amber-300 text-amber-950 border-amber-400 font-bold hover:bg-amber-400 shadow-2xs';
    }
    if (day.xpEarned < 90) {
      return 'bg-orange-500 text-white border-orange-600 font-black hover:bg-orange-600 shadow-xs';
    }
    return 'bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 text-white border-red-600 font-black shadow-sm hover:brightness-110';
  };

  const currentTodayDay = daysActivity.find((d) => d.isToday);
  const activeDetail = selectedDay || currentTodayDay;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-300">
      
      {/* Top Banner & Header */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-indigo-500/10 border-b border-slate-200/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Main Streak Counter Block */}
          <div className="flex items-center gap-4">
            {/* Animated Flame Icon Container */}
            <div className="relative group shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/25 ring-4 ring-orange-100 transform group-hover:scale-105 transition-transform duration-300">
                <Flame className="w-9 h-9 sm:w-11 sm:h-11 fill-white text-white animate-pulse" />
              </div>
              <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 text-white text-[11px] font-black flex items-center justify-center ring-2 ring-white">
                ✓
              </span>
            </div>

            {/* Streak Digits & Title */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {profile.currentStreak}
                </span>
                <span className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-orange-600 bg-orange-100/80 px-2.5 py-0.5 rounded-lg border border-orange-200">
                  Day Streak
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-600 mt-0.5">
                {profile.todayXp >= profile.dailyGoalXp ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Today's streak locked in! Daily goal crushed.
                  </span>
                ) : (
                  <span className="text-amber-700 font-semibold flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    Complete 1 lesson today to keep your {profile.currentStreak}-day momentum blazing!
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Quick Stats Badges & Celebrate Action */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Longest Streak */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <Trophy className="w-4 h-4 text-amber-500" />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Best Streak</div>
                <div className="text-xs font-black text-slate-900">{profile.highestStreak} Days</div>
              </div>
            </div>

            {/* Monthly Habit Consistency */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <Target className="w-4 h-4 text-indigo-500" />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">{monthName} Activity</div>
                <div className="text-xs font-black text-slate-900">
                  {activeDaysThisMonth} / {new Date().getDate()} Days
                </div>
              </div>
            </div>

            {/* Habit Freeze Protection */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-cyan-600" />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Habit Shield</div>
                <div className="text-xs font-black text-slate-900">1 Freeze Ready</div>
              </div>
            </div>

            {/* Celebrate Button */}
            <button
              onClick={handleCelebrate}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Trigger streak celebration animation"
            >
              <Sparkles className="w-4 h-4" />
              <span>Celebrate 🔥</span>
            </button>

            {/* Collapse / Expand Toggle */}
            <button
              onClick={() => {
                sound.playClick();
                setIsExpanded(!isExpanded);
              }}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-200/60 transition-colors"
              title={isExpanded ? 'Collapse Calendar Heatmap' : 'Expand Calendar Heatmap'}
            >
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Expandable Calendar Heatmap Body */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-5">
          
          {/* Heatmap Bar Controls & Month Label */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-indigo-600" />
              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                {monthName} {year} Study Habit Heatmap
              </h4>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                {totalMonthXp.toLocaleString()} Total XP
              </span>
            </div>

            {/* Heatmap Intensity Legend */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="text-slate-400 font-semibold mr-1">Less</span>
              <span className="w-3.5 h-3.5 rounded-sm bg-slate-100 border border-slate-200" title="0 XP / Inactive"></span>
              <span className="w-3.5 h-3.5 rounded-sm bg-amber-100 border border-amber-200" title="1 - 34 XP"></span>
              <span className="w-3.5 h-3.5 rounded-sm bg-amber-300 border border-amber-400" title="35 - 64 XP"></span>
              <span className="w-3.5 h-3.5 rounded-sm bg-orange-500 border border-orange-600" title="65 - 89 XP"></span>
              <span className="w-3.5 h-3.5 rounded-sm bg-gradient-to-br from-amber-500 to-red-600 border border-red-600" title="90+ XP"></span>
              <span className="text-slate-400 font-semibold ml-1">More</span>
            </div>
          </div>

          {/* Calendar Heatmap Grid */}
          <div className="overflow-x-auto pb-1">
            <div className="min-w-[340px]">
              
              {/* Day-of-week header row */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-1.5 text-center">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <div key={d} className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                    {d}
                  </div>
                ))}
              </div>

              {/* Day cells grid */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {/* Empty offset spaces before the 1st day of month */}
                {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="h-10 sm:h-12 rounded-xl bg-transparent" />
                ))}

                {/* Days of the month */}
                {daysActivity.map((day) => {
                  const isSelected = activeDetail?.dayNumber === day.dayNumber;
                  const intensityClass = getIntensityClasses(day);

                  return (
                    <button
                      key={day.dayNumber}
                      disabled={day.isFuture}
                      onClick={() => {
                        sound.playClick();
                        setSelectedDay(day);
                      }}
                      className={`relative h-10 sm:h-12 rounded-xl border flex flex-col items-center justify-center transition-all p-1 group cursor-pointer ${intensityClass} ${
                        day.isToday ? 'ring-2 ring-indigo-600 ring-offset-2' : ''
                      } ${isSelected ? 'ring-2 ring-amber-500 scale-105 z-10' : ''}`}
                      title={`${day.dateStr}: ${day.xpEarned} XP earned`}
                    >
                      {/* Day Number */}
                      <span className="text-xs sm:text-sm leading-none">
                        {day.dayNumber}
                      </span>

                      {/* Small XP indicator or Streak flame */}
                      {!day.isFuture && day.xpEarned > 0 && (
                        <span className="text-[9px] sm:text-[10px] opacity-90 leading-tight font-bold mt-0.5 flex items-center gap-0.5">
                          {day.isStreakDay && <Flame className="w-2.5 h-2.5 fill-current" />}
                          <span>{day.xpEarned}</span>
                        </span>
                      )}

                      {/* Today badge pill */}
                      {day.isToday && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-indigo-600 rounded-full border-2 border-white"></span>
                      )}

                      {/* Goal Reached Star */}
                      {day.goalAchieved && !day.isFuture && (
                        <span className="absolute -bottom-1 -right-1 text-[10px]">
                          ⭐
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Interactive Day Details Banner */}
          {activeDetail && (
            <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${getIntensityClasses(activeDetail)}`}>
                  {activeDetail.dayNumber}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">
                      {activeDetail.dateStr} ({activeDetail.dayOfWeek})
                    </span>
                    {activeDetail.isToday && (
                      <span className="text-[10px] font-bold uppercase bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md">
                        Today
                      </span>
                    )}
                    {activeDetail.isStreakDay && (
                      <span className="text-[10px] font-bold uppercase bg-orange-100 text-orange-700 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-orange-500" />
                        Streak Active
                      </span>
                    )}
                  </div>
                  <div className="text-slate-600 text-xs mt-0.5">
                    {activeDetail.isFuture ? (
                      <span>Upcoming study day — stay ready!</span>
                    ) : activeDetail.xpEarned > 0 ? (
                      <span>
                        Earned <strong className="text-indigo-600">{activeDetail.xpEarned} XP</strong> across {activeDetail.lessonsCompleted} learning session{activeDetail.lessonsCompleted > 1 ? 's' : ''}.
                        {activeDetail.goalAchieved ? ' Daily goal accomplished!' : ''}
                      </span>
                    ) : activeDetail.status === 'freeze' ? (
                      <span className="text-cyan-700 font-semibold">Streak freeze active — streak was safely protected! 🛡️</span>
                    ) : (
                      <span className="text-slate-500">Rest &amp; recovery day. No lessons completed.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Motivational Advice for Selected Day */}
              <div className="text-right shrink-0">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  <Info className="w-3.5 h-3.5 text-indigo-500" />
                  {activeDetail.isToday ? 'Maintain daily habit' : 'Consistent daily practice'}
                </span>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
