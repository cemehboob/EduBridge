import { UserAccount, UserProfile, AgeCohortId } from '../types';

export function calculateAge(dobString?: string): number {
  if (!dobString) return 20;
  try {
    const birth = new Date(dobString);
    if (isNaN(birth.getTime())) return 20;
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return age >= 1 ? age : 20;
  } catch {
    return 20;
  }
}

export function calculateCohortFromDob(dobString?: string): AgeCohortId {
  const age = calculateAge(dobString);
  if (age <= 8) return 'early';
  if (age <= 14) return 'junior';
  if (age <= 24) return 'academy';
  if (age <= 54) return 'pro';
  return 'senior';
}

export function calculateEducationLevel(dobString?: string): string {
  const age = calculateAge(dobString);
  if (age <= 8) return 'Early Primary & Phonics (Ages 5–8)';
  if (age <= 14) return 'Elementary & Middle School (Ages 9–14)';
  if (age <= 24) return 'High School & College Prep (Ages 15–24)';
  if (age <= 54) return 'Professional & Career Fluency (Ages 25–54)';
  return 'Golden Age & Lifelong Learning (Ages 55+)';
}

export function userAccountToProfile(user: UserAccount): UserProfile {
  const cohort = user.preferences.ageCohort || calculateCohortFromDob(user.dateOfBirth);
  const educationLevel = user.preferences.educationLevel || calculateEducationLevel(user.dateOfBirth);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    currentStreak: user.profileStats.currentStreak,
    highestStreak: user.profileStats.highestStreak,
    xp: user.profileStats.xp,
    level: user.profileStats.level,
    league: user.profileStats.league,
    hearts: user.profileStats.hearts,
    maxHearts: user.profileStats.maxHearts,
    dailyGoalXp: user.preferences.dailyGoalXp,
    todayXp: user.profileStats.todayXp,
    targetExam: user.preferences.targetExam,
    targetExamDate: user.preferences.targetExamDate,
    targetBand: user.preferences.targetBand,
    targetCareer: user.preferences.targetCareer,
    joinedDate: user.createdAt,
    preferredLanguage: user.preferences.preferredLanguage,
    dateOfBirth: user.dateOfBirth,
    ageCohort: cohort,
    educationLevel: educationLevel
  };
}
