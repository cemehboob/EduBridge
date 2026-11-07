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
    return age >= 0 ? age : 0;
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
  // Date of Birth (DOB) is the authoritative single source of truth for age cohort and education level
  const cohort: AgeCohortId = user.dateOfBirth
    ? calculateCohortFromDob(user.dateOfBirth)
    : (user.preferences.ageCohort || 'academy');

  const educationLevel: string = user.dateOfBirth
    ? calculateEducationLevel(user.dateOfBirth)
    : (user.preferences.educationLevel || calculateEducationLevel(undefined));

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
    targetListeningBand: user.preferences.targetListeningBand,
    targetReadingBand: user.preferences.targetReadingBand,
    targetWritingBand: user.preferences.targetWritingBand,
    targetSpeakingBand: user.preferences.targetSpeakingBand,
    targetCareer: user.preferences.targetCareer,
    joinedDate: user.createdAt,
    preferredLanguage: user.preferences.preferredLanguage,
    dateOfBirth: user.dateOfBirth,
    ageCohort: cohort,
    educationLevel: educationLevel,
    simplifiedInterface: user.preferences.simplifiedInterface !== undefined
      ? user.preferences.simplifiedInterface
      : (cohort === 'early' || cohort === 'junior'),
    visibleModules: user.preferences.visibleModules,
    personaVoice: user.preferences.personaVoice,
    colorScheme: user.preferences.colorScheme,
    enableQuickUserSwitch: Boolean(user.preferences.enableQuickUserSwitch)
  };
}

