import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  Zap,
  Flame,
  ShieldCheck,
  Brain,
  Globe,
  Volume2,
  Users,
  Database,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Check,
  Play,
  RotateCcw,
  Sliders,
  LogIn,
  UserPlus,
  HelpCircle,
  Clock,
  FileCheck,
  Heart,
  TrendingUp,
  Cpu,
  Layers,
  Sparkle
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface HomePageProps {
  onOpenSignIn: () => void;
  onOpenRegister: () => void;
  onOpenGuide?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenSignIn,
  onOpenRegister,
  onOpenGuide
}) => {
  const [activeTab, setActiveTab] = useState<
    'all' | 'exams' | 'solver' | 'cohorts' | 'gamification' | 'portals' | 'database'
  >('all');

  // Interactive sample quiz state on the landing page
  const [sampleSelectedOption, setSampleSelectedOption] = useState<number | null>(null);
  const [sampleIsSubmitted, setSampleIsSubmitted] = useState(false);

  // Sample quiz question for interactive preview
  const sampleQuestion = {
    cohort: 'High School & Academy',
    subject: 'English & Lexical Precision',
    prompt: 'Which word best captures a feeling of deep, philosophical longing for a home that never was?',
    options: ['Nostalgia', 'Anemoia', 'Euphoria', 'Melancholy'],
    correctIndex: 1,
    explanation:
      '"Anemoia" specifically refers to nostalgia or longing for a time or place one has never experienced, reflecting deep vocabulary precision.'
  };

  const handleSampleOptionSelect = (index: number) => {
    if (sampleIsSubmitted) return;
    sound.playClick();
    setSampleSelectedOption(index);
  };

  const handleSampleSubmit = () => {
    if (sampleSelectedOption === null) return;
    setSampleIsSubmitted(true);
    if (sampleSelectedOption === sampleQuestion.correctIndex) {
      sound.playSuccess();
    } else {
      sound.playError();
    }
  };

  const handleSampleReset = () => {
    sound.playClick();
    setSampleSelectedOption(null);
    setSampleIsSubmitted(false);
  };

  return (
    <div className="w-full bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      
      {/* ==================== HERO SECTION (Full Page Viewport Coverage) ==================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 text-white min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-teal-500/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center my-auto">
          
          {/* Platform Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-200 text-xs font-semibold mb-6 shadow-lg shadow-black/20">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>EduBridge 2.0 • Autonomous Multi-Exam & Adaptive AI Learning Ecosystem</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.15] mb-6">
            Bridging Every Stage of Learning — From{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-sky-300 to-indigo-300">
              Montessori Phonics
            </span>{' '}
            to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-rose-400">
              High-Stakes Exams
            </span>
          </h1>

          {/* Subtitle / Description */}
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            EduBridge is a unified, multidisciplinary learning platform calibrated across 5 developmental age cohorts.
            Master global standardized exams (IELTS, PTE, TOEFL, OET, DET, Cambridge), resolve complex STEM equations with
            voice tutoring in 12 languages, and maintain cryptographic SHA-256 test conduction ledgers synchronized with Neon Postgres.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
            <button
              onClick={() => {
                sound.playClick();
                onOpenSignIn();
              }}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-600 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Your Dashboard</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenRegister();
              }}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 backdrop-blur-sm transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <span>Create Free Account</span>
            </button>

            {onOpenGuide && (
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenGuide();
                }}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-semibold text-sm border border-slate-700 transition-all cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-indigo-400" />
                <span>Architecture Guide</span>
              </button>
            )}
          </div>

          {/* Live Key Metrics Counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-white/10 text-left">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-white">14+</div>
              <div className="text-xs text-indigo-200 font-semibold mt-1">Multi-Exam Mock Tests</div>
              <div className="text-[11px] text-slate-400 mt-0.5">IELTS, PTE, TOEFL, OET, DET</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-white">340+</div>
              <div className="text-xs text-teal-200 font-semibold mt-1">Authentic Quizzes</div>
              <div className="text-[11px] text-slate-400 mt-0.5">5 Cohorts • Shuffled Options</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-white">12</div>
              <div className="text-xs text-sky-200 font-semibold mt-1">Spoken Languages</div>
              <div className="text-[11px] text-slate-400 mt-0.5">4 Voice Personas (Pitch/Rate)</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-white">100%</div>
              <div className="text-xs text-emerald-200 font-semibold mt-1">Real-Time Cloud Sync</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Neon Postgres • SHA-256 Ledger</div>
            </div>
          </div>

        </div>
      </section>

      {/* ==================== FUNCTIONAL MODULES NAV ==================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-2 sm:p-3 flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto">
          {[
            { id: 'all', label: 'All Capabilities', icon: Layers },
            { id: 'exams', label: 'Multi-Exam Mastery', icon: Award },
            { id: 'solver', label: 'AI STEM & Voice Solver', icon: Brain },
            { id: 'cohorts', label: '5 Age Cohorts', icon: GraduationCap },
            { id: 'gamification', label: 'Streaks & Gamification', icon: Flame },
            { id: 'portals', label: 'Role-Based Portals', icon: Users },
            { id: 'database', label: 'Neon Database & Ledgers', icon: Database }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(item.id as any);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ==================== FUNCTIONAL CAPABILITIES SHOWCASE ==================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Category Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Complete EduBridge Functional Matrix
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Every feature is architected for academic excellence, accessible across devices, and authoritatively logged in Neon Postgres.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Module 1: Multi-Exam Mastery */}
          {(activeTab === 'all' || activeTab === 'exams') && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold mb-4 group-hover:scale-110 transition-transform">
                  <Award className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    Standardized Testing
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">14+ Full Tests</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">
                  Multi-Exam Mastery & Timed Mock Tests
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Full 4-skill preparation across 6 global testing frameworks. Each test includes authentic audio listening, automated writing evaluation, and CEFR/Band scoring.
                </p>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>IELTS Academic & General:</strong> Band 1.0–9.0 full test simulation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>PTE Academic:</strong> Micro-timed speech fluency & reading tasks</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>TOEFL iBT:</strong> Integrated tasks & lecture audio comprehension</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>OET Medicine & Nursing:</strong> Clinical consultation dialogue</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Duolingo (DET) & Cambridge:</strong> C1/C2 advanced use of English</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Timed • Sectional • Audio</span>
                <button
                  onClick={onOpenSignIn}
                  className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Practice Tests</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Module 2: AI Multidisciplinary Problem Solver */}
          {(activeTab === 'all' || activeTab === 'solver') && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 font-bold mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                    Pedagogical AI
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">Step-by-Step Solver</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">
                  AI Multidisciplinary STEM & Essay Tutor
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Step-by-step resolution of complex questions across Mathematics, Physics, Chemistry, Biology, and full-length academic essays with thesis breakdowns.
                </p>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Mathematics:</strong> Quadratic roots, linear systems, derivatives & integrals</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Physics:</strong> Newton’s laws (F = m · a), kinematics, circuit dynamics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Chemistry:</strong> Balanced chemical reactions & stoichiometric moles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Essay Generator:</strong> Structured essays & country topic paragraphs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Ambiguity Resolution:</strong> Interactive narrowing chat guidance</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Symbolab / Wolfram Style</span>
                <button
                  onClick={onOpenSignIn}
                  className="font-bold text-teal-600 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore Solver</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Module 3: 12-Language Speech & Voice Personas */}
          {(activeTab === 'all' || activeTab === 'solver') && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 font-bold mb-4 group-hover:scale-110 transition-transform">
                  <Volume2 className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                    Voice & Speech
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">12 Languages</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">
                  Multilingual Speech & 4 Voice Personas
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Lifelike voice synthesis with pitch and rate controls. Practice listening comprehension and pronunciation across 12 world languages.
                </p>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>4 Voice Personas:</strong> Man, Woman, Boy, and Girl</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>12 Supported Languages:</strong> English, Spanish, French, German, Mandarin, Arabic, Urdu, Japanese, Hindi, Portuguese, Russian, Italian</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Audio Player Controls:</strong> Play, pause, resume, and instant stop</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Native Accents & Pitch</span>
                <button
                  onClick={onOpenSignIn}
                  className="font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Hear Samples</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Module 4: 5 Developmental Age Cohorts */}
          {(activeTab === 'all' || activeTab === 'cohorts') && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 font-bold mb-4 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                    Adaptive Calibrations
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">Ages 4 to 80+</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">
                  5 Age Cohorts & Dynamic Quizzes
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Curriculum-calibrated quizzes dynamically shuffled using the Fisher-Yates algorithm. Customizable batch limits (5, 10, 15, or all) with clean session review.
                </p>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Early Primary (Ages 4–8):</strong> Montessori phonics, sight words, Kid Mode</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Junior Scholars (Ages 9–14):</strong> Middle school STEM & reading comprehension</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Academy (Ages 15–18):</strong> SAT, ACT, high-stakes matric diagnostic quizzes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Professional Fluency (19–59):</strong> Executive diplomacy & workplace writing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Golden Age (60+):</strong> Cognitive vitality & memory retention drills</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Fisher-Yates Shuffling</span>
                <button
                  onClick={onOpenSignIn}
                  className="font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Start Quiz</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Module 5: Gamification, Streaks & Motivation */}
          {(activeTab === 'all' || activeTab === 'gamification') && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 font-bold mb-4 group-hover:scale-110 transition-transform">
                  <Flame className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md">
                    Habit Science
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">Daily Streaks & XP</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">
                  Gamification, Streaks & Leagues
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Proven habit-forming mechanics that keep learners motivated every day. Celebrate milestone streaks with animated confetti fireworks.
                </p>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Daily Learning Streaks:</strong> Track continuous learning days</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>5 Competitive Leagues:</strong> Bronze, Silver, Gold, Platinum, Diamond</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Daily XP Goals:</strong> Customizable XP targets with reward celebrations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Heart & Health Engine:</strong> Deliberate practice without careless guessing</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Confetti Celebrations</span>
                <button
                  onClick={onOpenSignIn}
                  className="font-bold text-orange-600 hover:text-orange-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Build Streak</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Module 6: Role-Based Portals (RBAC) */}
          {(activeTab === 'all' || activeTab === 'portals') && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-bold mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                    Strict RBAC
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">4 Portals</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">
                  Role-Based Portals & Governance
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Dedicated experiences for every stakeholder with strict role-based access control and enterprise security.
                </p>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Student Portal:</strong> Universal Arena, Vocabulary Vault, Mock Tests, Resume</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Teacher Studio:</strong> Class curriculum, question banking, student tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Parent Portal:</strong> Real-time progress monitoring & child activity oversight</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Admin Cluster:</strong> User Live Dashboard Inspector, role filter, SMTP config</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Full Access Inspection</span>
                <button
                  onClick={onOpenSignIn}
                  className="font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Access Portals</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Module 7: Neon Postgres & Cryptographic Ledgers */}
          {(activeTab === 'all' || activeTab === 'database') && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold mb-4 group-hover:scale-110 transition-transform">
                  <Database className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Centralized Cloud
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">Neon Postgres</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">
                  Cloud Synchronization & Conduction Ledgers
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Multi-machine real-time synchronization backed by Neon Postgres serverless database with resilient event queuing and cryptographic audit logs.
                </p>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Neon Postgres:</strong> 23 relational tables & views with pooled connections</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Cryptographic Ledgers:</strong> SHA-256 test conduction signatures</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Database OTP Verification:</strong> 6-digit email OTPs stored in auth_otps</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Autonomous Scheduler:</strong> Daily exam, practice, and quiz generators</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">SHA-256 Authenticated</span>
                <button
                  onClick={onOpenSignIn}
                  className="font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>View Database</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ==================== INTERACTIVE SAMPLE PREVIEW ==================== */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-800">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Live Interactive Preview</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Experience the Adaptive Diagnostic Arena
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Sample how EduBridge tests depth of knowledge with dynamically shuffled options.
            </p>
          </div>

          {/* Interactive Question Card */}
          <div className="bg-slate-800/90 rounded-3xl border border-slate-700/80 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
            
            <div className="flex items-center justify-between text-xs text-slate-400 mb-4 pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                  {sampleQuestion.cohort}
                </span>
                <span className="font-semibold">{sampleQuestion.subject}</span>
              </div>
              <span className="font-mono text-emerald-400">10 XP Reward</span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white mb-6 leading-relaxed">
              {sampleQuestion.prompt}
            </h3>

            {/* Shuffled Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {sampleQuestion.options.map((option, idx) => {
                const letters = ['A', 'B', 'C', 'D'];
                const isSelected = sampleSelectedOption === idx;
                let optionStyle =
                  'bg-slate-700/60 hover:bg-slate-700 border-slate-600/70 text-slate-200';

                if (sampleIsSubmitted) {
                  if (idx === sampleQuestion.correctIndex) {
                    optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30';
                  } else if (isSelected) {
                    optionStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 ring-2 ring-rose-500/30';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-indigo-600/30 border-indigo-500 text-white ring-2 ring-indigo-500/40';
                }

                return (
                  <button
                    key={option}
                    disabled={sampleIsSubmitted}
                    onClick={() => handleSampleOptionSelect(idx)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer ${optionStyle}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-slate-900/60 flex items-center justify-center font-bold text-xs shrink-0">
                      {letters[idx]}
                    </span>
                    <span className="flex-1">{option}</span>
                    {sampleIsSubmitted && idx === sampleQuestion.correctIndex && (
                      <Check className="w-4 h-4 text-emerald-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation when submitted */}
            {sampleIsSubmitted && (
              <div
                className={`p-4 rounded-2xl text-xs mb-6 border animate-in fade-in duration-200 ${
                  sampleSelectedOption === sampleQuestion.correctIndex
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                }`}
              >
                <div className="font-bold mb-1 flex items-center gap-1.5">
                  {sampleSelectedOption === sampleQuestion.correctIndex ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Correct Answer! (+10 XP)</span>
                    </>
                  ) : (
                    <>
                      <HelpCircle className="w-4 h-4 text-rose-400" />
                      <span>Pedagogical Review</span>
                    </>
                  )}
                </div>
                <p className="text-slate-300 leading-relaxed">{sampleQuestion.explanation}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                {sampleIsSubmitted
                  ? 'Answer verified authoritatively.'
                  : sampleSelectedOption !== null
                  ? 'Option selected. Submit to check.'
                  : 'Select an option to evaluate.'}
              </span>
              
              <div className="flex items-center gap-2">
                {sampleIsSubmitted ? (
                  <button
                    onClick={handleSampleReset}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold text-white transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Try Again</span>
                  </button>
                ) : (
                  <button
                    disabled={sampleSelectedOption === null}
                    onClick={handleSampleSubmit}
                    className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                      sampleSelectedOption !== null
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30 cursor-pointer'
                        : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <span>Submit Answer</span>
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ==================== BOTTOM CTA ==================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-teal-600 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4 relative z-10">
            Start Your Adaptive Learning Journey Today
          </h2>
          <p className="text-indigo-100 text-sm sm:text-base max-w-2xl mx-auto mb-8 relative z-10 leading-relaxed font-normal">
            Whether preparing for IELTS, mastering STEM derivations, or engaging junior scholars with Montessori sight words, EduBridge is ready on all your devices.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <button
              onClick={() => {
                sound.playClick();
                onOpenRegister();
              }}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-indigo-900 hover:bg-indigo-50 font-black text-sm shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-indigo-600" />
              <span>Create Free Account</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenSignIn();
              }}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-900/40 hover:bg-indigo-900/60 text-white font-bold text-sm border border-white/20 backdrop-blur-sm transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Existing Account</span>
            </button>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-white border-t border-slate-200 py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-teal-500 flex items-center justify-center text-white font-black text-xs">
              EB
            </div>
            <span className="font-extrabold text-slate-800 text-sm">EduBridge 2.0</span>
            <span className="text-slate-400">|</span>
            <span>Self-Hosted & Serverless Neon Postgres Core</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600 font-semibold">
            <button onClick={onOpenSignIn} className="hover:text-indigo-600 cursor-pointer">
              Sign In
            </button>
            <button onClick={onOpenRegister} className="hover:text-indigo-600 cursor-pointer">
              Register
            </button>
            {onOpenGuide && (
              <button onClick={onOpenGuide} className="hover:text-indigo-600 cursor-pointer">
                User Guide
              </button>
            )}
            <span className="text-slate-400">|</span>
            <span className="text-slate-400 font-normal">© 2026 EduBridge Systems. All rights reserved.</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
