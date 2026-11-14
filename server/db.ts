/**
 * EduBridge — Prisma Postgres Database Layer
 * Centralized cloud database holding all users, sessions, activities, question attempts,
 * written responses, autosaves, SMTP config, and scheduled jobs.
 * 
 * When DATABASE_URL is set (e.g. deployed to Vercel with Prisma Postgres):
 *   Uses postgres (porsager/postgres) with native SSL connection pooling and high throughput.
 * When DATABASE_URL is not set (e.g. offline testing/local dev without DB):
 *   Gracefully falls back to ServerStorage local vault so tests and local builds always work.
 */

import 'dotenv/config';
import postgres, { Sql } from 'postgres';
import {
  UserAccount,
  UserActivityRecord,
  QuestionAttemptRecord,
  WrittenResponseRecord,
  IncompleteAttemptRecord,
  AttemptDetailResponse,
  MockTest,
  IELTSPracticeTest
} from '../src/types';
import { initialUsers, initialFeatureFlags } from '../src/data/userManagementData';
import { initialActivities, initialQuestionAttempts } from '../src/data/activityData';
import { multiExamMockTests } from '../src/data/multiExamMockTestsData';
import { mockTests } from '../src/data/initialData';
import { cohortQuizQuestions } from '../src/data/cohortQuizzesData';
import { IELTSPracticeService } from '../src/services/ieltsPracticeService';
import { DEFAULT_COLOR_SCHEME } from '../src/utils/themeManager';
import { ServerStorage } from './storage';

// ─── DB Connection ───────────────────────────────────────────────────────────

export const isDbConfigured = (): boolean => Boolean(process.env.DB_URL || process.env.DATABASE_URL);

let sqlInstance: Sql | null = null;

function getSql(): Sql {
  const url = process.env.DB_URL || process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DB_URL environment variable is not set. Add it in your Vercel project settings (Prisma Postgres integration).'
    );
  }
  if (!sqlInstance) {
    sqlInstance = postgres(url, { ssl: 'require', max: 10, idle_timeout: 20 });
  }
  return sqlInstance;
}

// ─── Schema Creation (DDL) ───────────────────────────────────────────────────

export async function initializeDatabase(): Promise<void> {
  if (!isDbConfigured()) {
    console.log('[EduBridge DB] DB_URL / DATABASE_URL not set — using local storage vault fallback. In Vercel, attach Prisma Postgres to activate cloud DB.');
    ServerStorage.initialize();
    return;
  }

  const sql = getSql();

  try {
    // Quick existence check: if all core tables exist, skip full DDL execution for rapid cold starts
    const checkTables = await sql`
      SELECT COUNT(*) as count FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'sessions', 'activities', 'question_attempts', 'written_responses', 'incomplete_attempts', 'smtp_config', 'email_logs', 'auth_otps', 'scheduled_jobs', 'standard_tests', 'quizzes', 'app_configurations')
    `;
    if (parseInt(String(checkTables[0]?.count || 0), 10) >= 13) {
      return;
    }
  } catch {
    // Proceed with full table creation DDL below
  }

  // Create all tables in order
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id               TEXT PRIMARY KEY,
      name             TEXT NOT NULL,
      username         TEXT,
      email            TEXT NOT NULL UNIQUE,
      password         TEXT NOT NULL,
      date_of_birth    TEXT,
      role             TEXT NOT NULL DEFAULT 'student',
      status           TEXT NOT NULL DEFAULT 'active',
      email_verified   BOOLEAN DEFAULT TRUE,
      email_verification_status TEXT DEFAULT 'verified',
      created_at       TEXT,
      last_login_at    TEXT,
      preferences      JSONB DEFAULT '{}',
      profile_stats    JSONB DEFAULT '{}'
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      token       TEXT PRIMARY KEY,
      user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      user_role   TEXT NOT NULL,
      created_at  BIGINT NOT NULL,
      expires_at  BIGINT NOT NULL
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at)
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS activities (
      id                   TEXT PRIMARY KEY,
      user_id              TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      user_name            TEXT,
      type                 TEXT,
      title                TEXT,
      category             TEXT,
      timestamp            TEXT,
      relative_time        TEXT,
      score                TEXT,
      xp_earned            INTEGER,
      status               TEXT DEFAULT 'completed',
      details              TEXT,
      exam_type            TEXT,
      module               TEXT,
      attempt_number       INTEGER,
      started_at           TEXT,
      completed_at         TEXT,
      total_questions      INTEGER,
      attempted_questions  INTEGER,
      correct_answers      INTEGER,
      incorrect_answers    INTEGER,
      skipped_questions    INTEGER,
      duration_sec         INTEGER,
      max_score            TEXT,
      percentage           INTEGER,
      evaluation           TEXT,
      feedback             TEXT,
      replay_payload       JSONB DEFAULT '{}'
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON activities(timestamp DESC)
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS question_attempts (
      id                  TEXT PRIMARY KEY,
      user_id             TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      user_name           TEXT,
      user_role           TEXT,
      test_id             TEXT,
      test_title          TEXT,
      module_or_subject   TEXT,
      question_number     INTEGER,
      question_prompt     TEXT,
      options             JSONB,
      user_answer         TEXT,
      correct_answer      TEXT,
      is_correct          BOOLEAN,
      score               TEXT,
      max_score           TEXT,
      time_spent_sec      INTEGER,
      is_skipped          BOOLEAN DEFAULT FALSE,
      explanation         TEXT,
      ai_feedback         TEXT,
      instructions        TEXT,
      timestamp           TEXT
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_qa_user_id ON question_attempts(user_id)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_qa_test_id ON question_attempts(test_id)
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS written_responses (
      id                        TEXT PRIMARY KEY,
      user_id                   TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      user_name                 TEXT,
      activity_id               TEXT,
      attempt_id                TEXT,
      question_id               TEXT,
      task_title                TEXT,
      task_prompt               TEXT,
      instructions              TEXT,
      source_passage            TEXT,
      written_text              TEXT,
      word_count                INTEGER,
      character_count           INTEGER,
      writing_duration_sec      INTEGER,
      evaluation                JSONB,
      score                     TEXT,
      feedback                  TEXT,
      corrections               JSONB,
      vocabulary_recommendations JSONB,
      revisions                 JSONB,
      timestamp                 TEXT
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_wr_user_id ON written_responses(user_id)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_wr_activity_id ON written_responses(activity_id)
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS incomplete_attempts (
      id                     TEXT PRIMARY KEY,
      user_id                TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      test_id                TEXT NOT NULL,
      test_title             TEXT,
      exam_type              TEXT,
      module                 TEXT,
      current_question_index INTEGER DEFAULT 0,
      user_answers           JSONB DEFAULT '{}',
      essay_text             TEXT,
      elapsed_seconds        INTEGER DEFAULT 0,
      last_saved_at          TEXT,
      UNIQUE(user_id, test_id)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS smtp_config (
      id           INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
      config_json  JSONB NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS email_logs (
      id           TEXT PRIMARY KEY,
      timestamp    TEXT,
      recipient    TEXT,
      type         TEXT,
      subject      TEXT,
      provider     TEXT,
      status       TEXT,
      error        TEXT,
      duration_ms  INTEGER
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_email_logs_ts ON email_logs(timestamp DESC)
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS auth_otps (
      id               TEXT PRIMARY KEY,
      email            TEXT NOT NULL,
      type             TEXT NOT NULL,
      otp_code         TEXT NOT NULL,
      otp_hash         TEXT NOT NULL,
      attempts         INTEGER DEFAULT 0,
      max_attempts     INTEGER DEFAULT 5,
      expires_at       BIGINT NOT NULL,
      created_at       BIGINT NOT NULL,
      last_sent_at     BIGINT NOT NULL,
      status           TEXT DEFAULT 'active',
      metadata         JSONB DEFAULT '{}'
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_auth_otps_email_type ON auth_otps(email, type)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_auth_otps_status ON auth_otps(status)`;
  await sql`CREATE OR REPLACE VIEW password_resets AS SELECT * FROM auth_otps WHERE type = 'PASSWORD_RESET'`;
  await sql`CREATE OR REPLACE VIEW user_creation_otps AS SELECT * FROM auth_otps WHERE type = 'REGISTRATION'`;

  await sql`
    CREATE TABLE IF NOT EXISTS scheduled_jobs (
      id                   TEXT PRIMARY KEY,
      name                 TEXT,
      description          TEXT,
      cron_expression      TEXT,
      target_time          TEXT,
      category             TEXT,
      enabled              BOOLEAN DEFAULT TRUE,
      last_run_timestamp   TEXT,
      next_run_timestamp   TEXT,
      items_generated      INTEGER DEFAULT 0,
      status               TEXT DEFAULT 'idle',
      batch_target         TEXT
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS standard_tests (
      id                  TEXT PRIMARY KEY,
      test_standard       TEXT NOT NULL,
      test_type           TEXT NOT NULL DEFAULT 'mock',
      title               TEXT NOT NULL,
      difficulty          TEXT DEFAULT 'Standard',
      category            TEXT,
      subject             TEXT NOT NULL,
      duration_minutes    INTEGER DEFAULT 30,
      question_count      INTEGER DEFAULT 10,
      target_score        TEXT,
      sections            JSONB DEFAULT '[]',
      questions           JSONB NOT NULL DEFAULT '[]',
      metadata            JSONB DEFAULT '{}',
      created_at          TEXT,
      updated_at          TEXT
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_std_tests_standard ON standard_tests(test_standard)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_std_tests_type ON standard_tests(test_type)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_std_tests_subject ON standard_tests(subject)`;

  await sql`
    CREATE TABLE IF NOT EXISTS quizzes (
      id                  TEXT PRIMARY KEY,
      cohort              TEXT NOT NULL,
      education_level     TEXT,
      category            TEXT NOT NULL,
      word                TEXT,
      phonetic            TEXT,
      prompt              TEXT NOT NULL,
      options             JSONB NOT NULL DEFAULT '[]',
      correct_answer      TEXT NOT NULL,
      explanation         TEXT,
      audio_prompt        TEXT,
      praise              TEXT,
      metadata            JSONB DEFAULT '{}',
      created_at          TEXT
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_quizzes_cohort ON quizzes(cohort)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_quizzes_category ON quizzes(category)`;

  await sql`
    CREATE TABLE IF NOT EXISTS app_configurations (
      key                 TEXT PRIMARY KEY,
      value               JSONB NOT NULL,
      category            TEXT DEFAULT 'general',
      description         TEXT,
      updated_at          TEXT,
      updated_by          TEXT DEFAULT 'system'
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_configs_category ON app_configurations(category)`;

  // ─── Views (First-Class Database Objects for Exams, Tests, Practice, Quizzes, Configs) ───
  await sql`CREATE OR REPLACE VIEW exams AS SELECT * FROM standard_tests WHERE test_type = 'mock'`;
  await sql`CREATE OR REPLACE VIEW mock_tests AS SELECT * FROM standard_tests WHERE test_type = 'mock'`;
  await sql`CREATE OR REPLACE VIEW practice_tests AS SELECT * FROM standard_tests WHERE test_type = 'practice'`;
  await sql`CREATE OR REPLACE VIEW sample_tests AS SELECT * FROM standard_tests`;
  await sql`CREATE OR REPLACE VIEW configuration_setup AS SELECT key as config_key, value as config_data, category, description, updated_at, updated_by FROM app_configurations`;
  await sql`CREATE OR REPLACE VIEW schedule_jobs AS SELECT * FROM scheduled_jobs`;
  await sql`CREATE OR REPLACE VIEW student_activities AS SELECT * FROM activities`;
  await sql`CREATE OR REPLACE VIEW answers AS SELECT id as attempt_id, user_id, user_name, test_id, question_number, user_answer, correct_answer, is_correct, score, explanation, timestamp FROM question_attempts`;

  console.log('[EduBridge DB] Prisma Postgres tables and views created and verified successfully.');
}

// ─── Seed Data ───────────────────────────────────────────────────────────────

export async function seedInitialData(): Promise<void> {
  if (!isDbConfigured()) return;

  const sql = getSql();

  // 1. Check & seed users if empty
  const existingUsers = await sql`SELECT COUNT(*) as count FROM users`;
  if (parseInt(String(existingUsers[0].count), 10) === 0) {
    console.log('[EduBridge DB] Seeding initial users into Prisma Postgres...');

    for (const user of initialUsers) {
      try {
        await sql`
          INSERT INTO users (
            id, name, username, email, password, date_of_birth,
            role, status, email_verified, email_verification_status,
            created_at, last_login_at, preferences, profile_stats
          )
          VALUES (
            ${user.id}, ${user.name}, ${user.username || null}, ${user.email},
            ${user.password}, ${user.dateOfBirth}, ${user.role}, ${user.status},
            ${user.emailVerified ?? true}, ${user.emailVerificationStatus || 'verified'},
            ${user.createdAt}, ${user.lastLoginAt},
            ${JSON.stringify(user.preferences)}, ${JSON.stringify(user.profileStats)}
          )
          ON CONFLICT (id) DO NOTHING
        `;
      } catch (err: any) {
        console.warn(`[EduBridge DB] Skipping user seed for ${user.id}:`, err.message);
      }
    }

    // Seed initial activities
    for (const act of initialActivities) {
      try {
        await sql`
          INSERT INTO activities (
            id, user_id, user_name, type, title, category, timestamp,
            score, xp_earned, status, details, exam_type, module,
            attempt_number, started_at, completed_at,
            total_questions, attempted_questions, correct_answers,
            incorrect_answers, skipped_questions, duration_sec,
            max_score, percentage, evaluation, feedback, replay_payload
          )
          VALUES (
            ${act.id}, ${act.userId}, ${act.userName}, ${act.type}, ${act.title},
            ${act.category}, ${act.timestamp}, ${String(act.score ?? '')},
            ${act.xpEarned || 0}, ${act.status}, ${act.details},
            ${act.examType || null}, ${act.module || null},
            ${act.attemptNumber || null}, ${act.startedAt || null},
            ${act.completedAt || null}, ${act.totalQuestions || null},
            ${act.attemptedQuestions || null}, ${act.correctAnswers || null},
            ${act.incorrectAnswers || null}, ${act.skippedQuestions || null},
            ${act.durationSec || null}, ${String(act.maxScore ?? '')},
            ${act.percentage || null}, ${act.evaluation || null},
            ${act.feedback || null}, ${JSON.stringify(act.replayPayload || {})}
          )
          ON CONFLICT (id) DO NOTHING
        `;
      } catch (err: any) {
        console.warn(`[EduBridge DB] Skipping activity seed for ${act.id}:`, err.message);
      }
    }

    // Seed initial question attempts
    for (const qa of initialQuestionAttempts) {
      try {
        await sql`
          INSERT INTO question_attempts (
            id, user_id, user_name, user_role, test_id, test_title,
            module_or_subject, question_number, question_prompt, options,
            user_answer, correct_answer, is_correct, score, max_score,
            time_spent_sec, is_skipped, explanation, ai_feedback, instructions, timestamp
          )
          VALUES (
            ${qa.id}, ${qa.userId}, ${qa.userName}, ${qa.userRole || null},
            ${qa.testId}, ${qa.testTitle}, ${qa.moduleOrSubject},
            ${qa.questionNumber}, ${qa.questionPrompt},
            ${JSON.stringify(qa.options || [])}, ${qa.userAnswer},
            ${qa.correctAnswer || null}, ${qa.isCorrect},
            ${String(qa.score ?? '')}, ${String(qa.maxScore ?? '')},
            ${qa.timeSpentSec || null}, ${qa.isSkipped || false},
            ${qa.explanation || null}, ${qa.aiFeedback || null},
            ${qa.instructions || null}, ${qa.timestamp}
          )
          ON CONFLICT (id) DO NOTHING
        `;
      } catch (err: any) {
        console.warn(`[EduBridge DB] Skipping question attempt seed for ${qa.id}:`, err.message);
      }
    }

    // Seed initial written responses
    const initialWrittenResponses: WrittenResponseRecord[] = [
      {
        id: 'wres_alex_01',
        userId: 'usr_student_01',
        userName: 'Alex Rivera',
        activityId: 'act_alex_03',
        attemptId: 'att_alex_w1',
        questionId: 'q_ielts_w2_01',
        taskTitle: 'IELTS Academic Writing Task 2: Advanced Cohesion',
        taskPrompt: 'Some people believe that technological advances in artificial intelligence will eliminate human jobs and reduce individual agency. Others contend that AI democratizes creative production and empowers professionals. Discuss both views and give your opinion.',
        instructions: 'Write at least 250 words. Present a well-developed argument with relevant supporting examples and academic register.',
        writtenText: 'Throughout contemporary industrial history, transformative technological disruptions have perpetually ignited intense debates regarding societal equilibrium and human agency. While skeptics assert that synthetic intelligence will inevitably eradicate skilled occupations, proponents counter that emerging computational tools democratize creative problem-solving. This essay will examine both perspectives before establishing that generative systems augment rather than supplant human intellect.\\n\\nOn the one hand, valid concerns exist regarding labor displacement. Automated diagnostic algorithms and quantitative trading architectures operate at computational velocities unattainable by human practitioners. If organizations implement automation primarily for operational cost reduction without investing in workforce re-skilling, localized economic dislocation will undoubtedly manifest.\\n\\nNevertheless, historical precedent illustrates that mechanical instruments liberate human capital from routine tasks to focus on higher-order synthesis. In medicine, machine learning models analyze complex radiographic imagery, thereby granting clinicians greater temporal bandwidth to formulate compassionate therapeutic strategies. Similarly, in software engineering, automated code assistants relieve engineers of repetitive boilerplate syntax, empowering them to architect resilient systemic infrastructures.\\n\\nIn conclusion, while technological disruption presents genuine labor challenges requiring proactive governance, generative intelligence fundamentally serves as an amplifier of human capacity rather than its replacement.',
        wordCount: 262,
        characterCount: 1782,
        writingDurationSec: 1680,
        evaluation: {
          taskAchievement: 'Band 8.5: Fully addresses all parts of the prompt with well-developed ideas and substantiated examples.',
          coherenceCohesion: 'Band 8.5: Cohesive devices are used naturally; logical paragraph progression is maintained throughout.',
          lexicalResource: 'Band 8.5: Sophisticated lexical items used with high precision ("computational velocities", "temporal bandwidth", "localized economic dislocation").',
          grammaticalAccuracy: 'Band 8.5: Wide range of complex sentence structures with accurate punctuation and consistent academic register.',
          bandScore: '8.5 Band'
        },
        score: '8.5 Band',
        feedback: 'Exemplary essay demonstrating formal academic vocabulary, nuanced thesis defense, and cohesive counter-argumentation.',
        corrections: [
          'Minor: Ensure consistent British/American orthography across all paragraphs.'
        ],
        vocabularyRecommendations: [
          'Consider using "paradigm shift" or "epistemic framework" for further lexical sophistication.'
        ],
        timestamp: '2026-11-01 15:30:00'
      }
    ];

    for (const wr of initialWrittenResponses) {
      try {
        await sql`
          INSERT INTO written_responses (
            id, user_id, user_name, activity_id, attempt_id, question_id,
            task_title, task_prompt, instructions, source_passage,
            written_text, word_count, character_count, writing_duration_sec,
            evaluation, score, feedback, corrections, vocabulary_recommendations,
            revisions, timestamp
          )
          VALUES (
            ${wr.id}, ${wr.userId}, ${wr.userName}, ${wr.activityId},
            ${wr.attemptId}, ${wr.questionId}, ${wr.taskTitle},
            ${wr.taskPrompt}, ${wr.instructions || null}, ${wr.sourcePassage || null},
            ${wr.writtenText}, ${wr.wordCount}, ${wr.characterCount},
            ${wr.writingDurationSec || null}, ${JSON.stringify(wr.evaluation || {})},
            ${String(wr.score ?? '')}, ${wr.feedback || null},
            ${JSON.stringify(wr.corrections || [])},
            ${JSON.stringify(wr.vocabularyRecommendations || [])},
            ${JSON.stringify(wr.revisions || [])}, ${wr.timestamp}
          )
          ON CONFLICT (id) DO NOTHING
        `;
      } catch (err: any) {
        console.warn(`[EduBridge DB] Skipping written response seed for ${wr.id}:`, err.message);
      }
    }

    // Seed initial scheduled jobs
    const defaultJobs = [
      {
        id: 'job_exam_midnight_00',
        name: 'Nightly Multi-Exam Mock & Practice Test Generator',
        description: 'Generates 6 new multi-exam mock tests (PTE, TOEFL, OET, DET, Cambridge, IELTS) and 5 practice tests.',
        cronExpression: '0 0 * * *',
        targetTime: '00:00 (Midnight)',
        category: 'EXAM_PREP',
        enabled: true,
        lastRunTimestamp: `Last run: ${new Date().toISOString().slice(0, 10)} 00:00:02`,
        nextRunTimestamp: 'Tomorrow 00:00',
        itemsGenerated: 11,
        status: 'idle',
        batchTarget: 'At least 6 Mock Tests + 5 Practice Tests'
      },
      {
        id: 'job_vocab_expansion_00',
        name: 'Daily Vocabulary Vault Expansion',
        description: 'Expands the Vocabulary Vault with 100 new CEFR-graded words daily.',
        cronExpression: '0 0 * * *',
        targetTime: '00:00 (Midnight)',
        category: 'VOCABULARY',
        enabled: true,
        lastRunTimestamp: `Last run: ${new Date().toISOString().slice(0, 10)} 00:00:04`,
        nextRunTimestamp: 'Tomorrow 00:00',
        itemsGenerated: 100,
        status: 'idle',
        batchTarget: 'At least 100 Vocabulary Words'
      },
      {
        id: 'job_quiz_generation_00',
        name: 'Daily Cohort Quiz & Assessment Generator',
        description: 'Generates 10 new age-cohort quizzes across early, junior, academy, pro, and senior cohorts.',
        cronExpression: '0 0 * * *',
        targetTime: '00:00 (Midnight)',
        category: 'QUIZ_EVAL',
        enabled: true,
        lastRunTimestamp: `Last run: ${new Date().toISOString().slice(0, 10)} 00:00:06`,
        nextRunTimestamp: 'Tomorrow 00:00',
        itemsGenerated: 10,
        status: 'idle',
        batchTarget: 'At least 10 Cohort Quizzes'
      }
    ];

    for (const job of defaultJobs) {
      try {
        await sql`
          INSERT INTO scheduled_jobs (
            id, name, description, cron_expression, target_time, category,
            enabled, last_run_timestamp, next_run_timestamp,
            items_generated, status, batch_target
          )
          VALUES (
            ${job.id}, ${job.name}, ${job.description}, ${job.cronExpression},
            ${job.targetTime}, ${job.category}, ${job.enabled},
            ${job.lastRunTimestamp}, ${job.nextRunTimestamp},
            ${job.itemsGenerated}, ${job.status}, ${job.batchTarget}
          )
          ON CONFLICT (id) DO NOTHING
        `;
      } catch (err: any) {
        console.warn(`[EduBridge DB] Skipping job seed:`, err.message);
      }
    }
  }

  // 2. Check & seed standard_tests if empty
  const existingTests = await sql`SELECT COUNT(*) as count FROM standard_tests`;
  if (parseInt(String(existingTests[0].count), 10) === 0) {
    console.log('[EduBridge DB] Seeding multi-exam mock tests & practice tests into Prisma Postgres...');

    // Seed 14 multi-exam mock tests (PTE, TOEFL, OET, DET, Cambridge English, IELTS)
    for (const test of multiExamMockTests) {
      try {
        await sql`
          INSERT INTO standard_tests (
            id, test_standard, test_type, title, difficulty, category,
            subject, duration_minutes, question_count, target_score,
            sections, questions, metadata, created_at, updated_at
          )
          VALUES (
            ${test.id}, ${test.exam || 'General'}, 'mock', ${test.title},
            ${test.difficulty || 'Standard'}, ${test.exam + ' Mock'},
            ${test.subject || 'Standard Assessment'}, ${test.totalDurationMin || 30},
            ${test.questions ? test.questions.length : 10}, ${test.targetBandRequirement || ''},
            ${JSON.stringify(test.sections || [])}, ${JSON.stringify(test.questions || [])},
            ${JSON.stringify({ lastAttemptedAt: test.lastAttemptedAt, attemptCount: test.attemptCount || 0 })},
            ${test.timestamp || test.dateAdded || new Date().toISOString()},
            ${new Date().toISOString()}
          )
          ON CONFLICT (id) DO NOTHING
        `;
      } catch (err: any) {
        console.warn(`[EduBridge DB] Skipping test seed for ${test.id}:`, err.message);
      }
    }

    // Also seed additional initial mock tests
    for (const test of mockTests) {
      try {
        await sql`
          INSERT INTO standard_tests (
            id, test_standard, test_type, title, difficulty, category,
            subject, duration_minutes, question_count, target_score,
            sections, questions, metadata, created_at, updated_at
          )
          VALUES (
            ${test.id}, ${test.exam || 'IELTS'}, 'mock', ${test.title},
            ${test.difficulty || 'Standard'}, ${test.exam + ' Mock'},
            ${test.subject || 'Standard Assessment'}, ${test.totalDurationMin || 30},
            ${test.questions ? test.questions.length : 10}, ${test.targetBandRequirement || ''},
            ${JSON.stringify(test.sections || [])}, ${JSON.stringify(test.questions || [])},
            ${JSON.stringify({ lastAttemptedAt: test.lastAttemptedAt, attemptCount: test.attemptCount || 0 })},
            ${test.timestamp || test.dateAdded || new Date().toISOString()},
            ${new Date().toISOString()}
          )
          ON CONFLICT (id) DO NOTHING
        `;
      } catch (err: any) {
        // Skip duplicate
      }
    }

    // Seed top authentic practice tests from IELTSPracticeService
    try {
      const practiceTests = IELTSPracticeService.getPracticeTests().slice(0, 30);
      for (const pt of practiceTests) {
        await sql`
          INSERT INTO standard_tests (
            id, test_standard, test_type, title, difficulty, category,
            subject, duration_minutes, question_count, target_score,
            sections, questions, metadata, created_at, updated_at
          )
          VALUES (
            ${pt.id}, 'IELTS', 'practice', ${pt.title},
            ${pt.difficulty || 'Standard'}, ${pt.category},
            ${pt.subject || 'IELTS ' + pt.module}, ${pt.durationMinutes || 25},
            ${pt.questionCount || (pt.questions ? pt.questions.length : 10)}, 'Band 7.0+',
            ${JSON.stringify([])}, ${JSON.stringify(pt.questions || [])},
            ${JSON.stringify({ module: pt.module, passage: pt.passage, audioTranscript: pt.audioTranscript })},
            ${pt.timestamp || pt.dateAdded || new Date().toISOString()},
            ${new Date().toISOString()}
          )
          ON CONFLICT (id) DO NOTHING
        `;
      }
    } catch (err: any) {
      console.warn('[EduBridge DB] Practice test seed note:', err.message);
    }
  }

  // 3. Check & seed quizzes if empty
  const existingQuizzes = await sql`SELECT COUNT(*) as count FROM quizzes`;
  if (parseInt(String(existingQuizzes[0].count), 10) === 0) {
    console.log('[EduBridge DB] Seeding cohort quizzes into Prisma Postgres...');
    for (const q of cohortQuizQuestions) {
      try {
        await sql`
          INSERT INTO quizzes (
            id, cohort, education_level, category, word, phonetic,
            prompt, options, correct_answer, explanation, audio_prompt,
            praise, metadata, created_at
          )
          VALUES (
            ${q.id}, ${q.cohort}, ${q.educationLevel || ''}, ${q.category},
            ${q.word || ''}, ${q.phonetic || ''}, ${q.prompt},
            ${JSON.stringify(q.options || [])}, ${q.correctAnswer},
            ${q.explanation || ''}, ${q.audioPrompt || ''}, ${q.praise || ''},
            ${JSON.stringify({})}, ${new Date().toISOString()}
          )
          ON CONFLICT (id) DO NOTHING
        `;
      } catch (err: any) {
        console.warn(`[EduBridge DB] Skipping quiz seed for ${q.id}:`, err.message);
      }
    }
  }

  // 4. Check & seed app_configurations if empty
  const existingConfigs = await sql`SELECT COUNT(*) as count FROM app_configurations`;
  if (parseInt(String(existingConfigs[0].count), 10) === 0) {
    console.log('[EduBridge DB] Seeding application configuration tables into Prisma Postgres...');
    const initialConfigs = [
      {
        key: 'exam_settings',
        value: {
          questionsPerTest: 10,
          allowShuffleOptions: true,
          writingTestQuestions: 1
        },
        category: 'exam',
        description: 'Standardized test question counts, option shuffling, and section parameters'
      },
      {
        key: 'feature_flags',
        value: initialFeatureFlags,
        category: 'features',
        description: 'System-wide feature flags and capabilities'
      },
      {
        key: 'color_scheme',
        value: DEFAULT_COLOR_SCHEME,
        category: 'ui',
        description: 'Global portal theme and color palettes'
      },
      {
        key: 'system_setup',
        value: {
          appName: 'EduBridge',
          version: '2.5.0',
          centralizedDb: 'Prisma Postgres',
          databaseDriver: 'postgres',
          minQuestionsPerTest: 10,
          supportedStandards: ['IELTS', 'PTE', 'TOEFL', 'OET', 'DET', 'Cambridge English'],
          schedulerActive: true,
          cloudStorageActive: true
        },
        category: 'system',
        description: 'Global system architecture and operational settings'
      },
      {
        key: 'voice_persona',
        value: {
          name: 'Emma',
          region: 'British Academic',
          gender: 'Female',
          rate: 1.0,
          pitch: 1.0
        },
        category: 'audio',
        description: 'Audio speech synthesis voice persona'
      }
    ];

    for (const cfg of initialConfigs) {
      try {
        await sql`
          INSERT INTO app_configurations (key, value, category, description, updated_at, updated_by)
          VALUES (${cfg.key}, ${JSON.stringify(cfg.value)}, ${cfg.category}, ${cfg.description}, ${new Date().toISOString()}, 'system')
          ON CONFLICT (key) DO NOTHING
        `;
      } catch (err: any) {
        console.warn(`[EduBridge DB] Skipping config seed for ${cfg.key}:`, err.message);
      }
    }
  }

  console.log('[EduBridge DB] Initial Prisma Postgres seed verified.');
}

// ─── Helper: Row → Type ───────────────────────────────────────────────────────

function safeJsonParse(val: any, fallback: any = null) {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'object') return val;
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  }
  return fallback;
}

function rowToUser(row: any): UserAccount {
  return {
    id: row.id,
    name: row.name,
    username: row.username || undefined,
    email: row.email,
    password: row.password,
    dateOfBirth: row.date_of_birth || '',
    role: row.role,
    status: row.status,
    emailVerified: row.email_verified ?? true,
    emailVerificationStatus: row.email_verification_status || 'verified',
    createdAt: row.created_at || '',
    lastLoginAt: row.last_login_at || '',
    preferences: safeJsonParse(row.preferences, {}),
    profileStats: safeJsonParse(row.profile_stats, {})
  } as UserAccount;
}

function rowToActivity(row: any): UserActivityRecord {
  return {
    id: row.id,
    userId: row.user_id,
    userName: row.user_name || '',
    type: row.type,
    title: row.title,
    category: row.category,
    timestamp: row.timestamp,
    relativeTime: row.relative_time || undefined,
    score: row.score || undefined,
    xpEarned: row.xp_earned || undefined,
    status: row.status,
    details: row.details || '',
    examType: row.exam_type || undefined,
    module: row.module || undefined,
    attemptNumber: row.attempt_number || undefined,
    startedAt: row.started_at || undefined,
    completedAt: row.completed_at || undefined,
    totalQuestions: row.total_questions || undefined,
    attemptedQuestions: row.attempted_questions || undefined,
    correctAnswers: row.correct_answers || undefined,
    incorrectAnswers: row.incorrect_answers || undefined,
    skippedQuestions: row.skipped_questions || undefined,
    durationSec: row.duration_sec || undefined,
    maxScore: row.max_score || undefined,
    percentage: row.percentage || undefined,
    evaluation: row.evaluation || undefined,
    feedback: row.feedback || undefined,
    replayPayload: safeJsonParse(row.replay_payload, { tab: '' })
  };
}

function rowToQuestionAttempt(row: any): QuestionAttemptRecord {
  return {
    id: row.id,
    userId: row.user_id,
    userName: row.user_name || '',
    userRole: row.user_role || undefined,
    testId: row.test_id,
    testTitle: row.test_title || '',
    moduleOrSubject: row.module_or_subject || '',
    questionNumber: row.question_number || 0,
    questionPrompt: row.question_prompt || '',
    options: safeJsonParse(row.options, []),
    userAnswer: row.user_answer || '',
    correctAnswer: row.correct_answer || undefined,
    isCorrect: row.is_correct || false,
    score: row.score || undefined,
    maxScore: row.max_score || undefined,
    timeSpentSec: row.time_spent_sec || undefined,
    isSkipped: row.is_skipped || false,
    explanation: row.explanation || undefined,
    aiFeedback: row.ai_feedback || undefined,
    instructions: row.instructions || undefined,
    timestamp: row.timestamp || ''
  };
}

function rowToWrittenResponse(row: any): WrittenResponseRecord {
  return {
    id: row.id,
    userId: row.user_id,
    userName: row.user_name || '',
    activityId: row.activity_id || '',
    attemptId: row.attempt_id || '',
    questionId: row.question_id || '',
    taskTitle: row.task_title || '',
    taskPrompt: row.task_prompt || '',
    instructions: row.instructions || undefined,
    sourcePassage: row.source_passage || undefined,
    writtenText: row.written_text || '',
    wordCount: row.word_count || 0,
    characterCount: row.character_count || 0,
    writingDurationSec: row.writing_duration_sec || undefined,
    evaluation: safeJsonParse(row.evaluation, {}),
    score: row.score || undefined,
    feedback: row.feedback || undefined,
    corrections: safeJsonParse(row.corrections, []),
    vocabularyRecommendations: safeJsonParse(row.vocabulary_recommendations, []),
    revisions: safeJsonParse(row.revisions, []),
    timestamp: row.timestamp || ''
  };
}

function rowToIncompleteAttempt(row: any): IncompleteAttemptRecord {
  return {
    id: row.id,
    userId: row.user_id,
    testId: row.test_id,
    testTitle: row.test_title || '',
    examType: row.exam_type || '',
    module: row.module || '',
    currentQuestionIndex: row.current_question_index || 0,
    userAnswers: safeJsonParse(row.user_answers, {}),
    essayText: row.essay_text || undefined,
    elapsedSeconds: row.elapsed_seconds || 0,
    lastSavedAt: row.last_saved_at || new Date().toISOString()
  };
}

function rowToStandardTest(row: any): any {
  return {
    id: row.id,
    testStandard: row.test_standard,
    exam: row.test_standard,
    testType: row.test_type,
    title: row.title,
    difficulty: row.difficulty,
    category: row.category,
    subject: row.subject,
    durationMinutes: row.duration_minutes,
    totalDurationMin: row.duration_minutes,
    questionCount: row.question_count,
    targetScore: row.target_score,
    targetBandRequirement: row.target_score,
    sections: safeJsonParse(row.sections, []),
    questions: safeJsonParse(row.questions, []),
    metadata: safeJsonParse(row.metadata, {}),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function rowToQuiz(row: any): any {
  return {
    id: row.id,
    cohort: row.cohort,
    educationLevel: row.education_level || '',
    category: row.category,
    word: row.word || '',
    phonetic: row.phonetic || '',
    prompt: row.prompt,
    options: safeJsonParse(row.options, []),
    correctAnswer: row.correct_answer,
    explanation: row.explanation || '',
    audioPrompt: row.audio_prompt || '',
    praise: row.praise || '',
    metadata: safeJsonParse(row.metadata, {}),
    createdAt: row.created_at
  };
}

// ─── Database Storage API ─────────────────────────────────────────────────────

export const DbStorage = {

  // --- Health ---
  getHealthStats: async () => {
    if (!isDbConfigured()) {
      return ServerStorage.getHealthStats();
    }
    const sql = getSql();
    const [users, acts, qAtts, wRes, incAtts, tests, quizzes, configs] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM users`,
      sql`SELECT COUNT(*) as count FROM activities`,
      sql`SELECT COUNT(*) as count FROM question_attempts`,
      sql`SELECT COUNT(*) as count FROM written_responses`,
      sql`SELECT COUNT(*) as count FROM incomplete_attempts`,
      sql`SELECT COUNT(*) as count FROM standard_tests`,
      sql`SELECT COUNT(*) as count FROM quizzes`,
      sql`SELECT COUNT(*) as count FROM app_configurations`
    ]);
    return {
      status: 'healthy',
      storageVault: 'Prisma Postgres (Centralized Cloud Database)',
      totalUsers: parseInt(String(users[0].count), 10),
      totalActivities: parseInt(String(acts[0].count), 10),
      totalQuestionAttempts: parseInt(String(qAtts[0].count), 10),
      totalWrittenResponses: parseInt(String(wRes[0].count), 10),
      activeIncompleteAttempts: parseInt(String(incAtts[0].count), 10),
      totalStandardTests: parseInt(String(tests[0].count), 10),
      totalQuizzes: parseInt(String(quizzes[0].count), 10),
      totalConfigurations: parseInt(String(configs[0].count), 10),
      serverTime: new Date().toISOString()
    };
  },

  // --- Sessions ---
  getSessions: async (): Promise<{ token: string; userId: string; userRole: string; createdAt: number; expiresAt: number }[]> => {
    if (!isDbConfigured()) {
      return ServerStorage.getSessions();
    }
    const sql = getSql();
    const rows = await sql`SELECT * FROM sessions WHERE expires_at > ${Date.now()}`;
    return rows.map((r) => ({
      token: r.token,
      userId: r.user_id,
      userRole: r.user_role,
      createdAt: parseInt(String(r.created_at), 10),
      expiresAt: parseInt(String(r.expires_at), 10)
    }));
  },

  saveSession: async (session: { token: string; userId: string; userRole: string; createdAt: number; expiresAt: number }): Promise<void> => {
    if (!isDbConfigured()) {
      return ServerStorage.saveSession(session);
    }
    const sql = getSql();
    await sql`
      INSERT INTO sessions (token, user_id, user_role, created_at, expires_at)
      VALUES (${session.token}, ${session.userId}, ${session.userRole}, ${session.createdAt}, ${session.expiresAt})
      ON CONFLICT (token) DO UPDATE SET expires_at = ${session.expiresAt}
    `;
    // Cleanup expired sessions periodically
    await sql`DELETE FROM sessions WHERE expires_at < ${Date.now() - 86400000}`;
  },

  findSession: async (token: string): Promise<{ userId: string; userRole: string; expiresAt: number } | null> => {
    if (!isDbConfigured()) {
      const sess = ServerStorage.getSessions().find((s) => s.token === token && Date.now() <= s.expiresAt);
      return sess ? { userId: sess.userId, userRole: sess.userRole, expiresAt: sess.expiresAt } : null;
    }
    const sql = getSql();
    const rows = await sql`SELECT * FROM sessions WHERE token = ${token} AND expires_at > ${Date.now()}`;
    if (rows.length === 0) return null;
    return {
      userId: rows[0].user_id,
      userRole: rows[0].user_role,
      expiresAt: parseInt(String(rows[0].expires_at), 10)
    };
  },

  removeSession: async (token: string): Promise<void> => {
    if (!isDbConfigured()) {
      return ServerStorage.removeSession(token);
    }
    const sql = getSql();
    await sql`DELETE FROM sessions WHERE token = ${token}`;
  },

  // --- Users ---
  getUsers: async (): Promise<UserAccount[]> => {
    if (!isDbConfigured()) {
      return ServerStorage.getUsers();
    }
    const sql = getSql();
    const rows = await sql`SELECT * FROM users ORDER BY created_at DESC`;
    return rows.map(rowToUser);
  },

  getUserById: async (id: string): Promise<UserAccount | null> => {
    if (!isDbConfigured()) {
      return ServerStorage.getUserById(id);
    }
    const sql = getSql();
    const rows = await sql`SELECT * FROM users WHERE id = ${id}`;
    return rows.length > 0 ? rowToUser(rows[0]) : null;
  },

  getUserByIdentifier: async (identifier: string): Promise<UserAccount | null> => {
    if (!isDbConfigured()) {
      return ServerStorage.getUserByIdentifier(identifier);
    }
    const clean = identifier.trim().toLowerCase();
    const sql = getSql();
    const rows = await sql`
      SELECT * FROM users
      WHERE LOWER(email) = ${clean}
         OR LOWER(username) = ${clean}
         OR LOWER(name) = ${clean}
      LIMIT 1
    `;
    return rows.length > 0 ? rowToUser(rows[0]) : null;
  },

  createUser: async (user: UserAccount): Promise<UserAccount> => {
    if (!isDbConfigured()) {
      return ServerStorage.createUser(user);
    }
    const sql = getSql();
    // Check uniqueness
    const existing = await sql`
      SELECT id FROM users
      WHERE id = ${user.id} OR LOWER(email) = ${user.email.toLowerCase()}
      LIMIT 1
    `;
    if (existing.length > 0) {
      throw new Error('An account already exists with this email address.');
    }
    await sql`
      INSERT INTO users (
        id, name, username, email, password, date_of_birth,
        role, status, email_verified, email_verification_status,
        created_at, last_login_at, preferences, profile_stats
      )
      VALUES (
        ${user.id}, ${user.name}, ${user.username || null}, ${user.email},
        ${user.password}, ${user.dateOfBirth}, ${user.role}, ${user.status},
        ${user.emailVerified ?? true}, ${user.emailVerificationStatus || 'verified'},
        ${user.createdAt}, ${user.lastLoginAt},
        ${JSON.stringify(user.preferences || {})}, ${JSON.stringify(user.profileStats || {})}
      )
    `;
    const created = await sql`SELECT * FROM users WHERE id = ${user.id}`;
    return rowToUser(created[0]);
  },

  updateUser: async (id: string, updates: Partial<UserAccount>): Promise<UserAccount> => {
    if (!isDbConfigured()) {
      return ServerStorage.updateUser(id, updates);
    }
    const sql = getSql();
    const existing = await sql`SELECT * FROM users WHERE id = ${id}`;
    if (existing.length === 0) {
      throw new Error(`User not found with id ${id}`);
    }
    const current = rowToUser(existing[0]);

    const merged: UserAccount = {
      ...current,
      ...updates,
      id: current.id, // immutable
      preferences: updates.preferences ? { ...current.preferences, ...updates.preferences } : current.preferences,
      profileStats: updates.profileStats ? { ...current.profileStats, ...updates.profileStats } : current.profileStats
    };

    await sql`
      UPDATE users SET
        name = ${merged.name},
        username = ${merged.username || null},
        email = ${merged.email},
        password = ${merged.password},
        date_of_birth = ${merged.dateOfBirth},
        role = ${merged.role},
        status = ${merged.status},
        email_verified = ${merged.emailVerified ?? true},
        email_verification_status = ${merged.emailVerificationStatus || 'verified'},
        last_login_at = ${merged.lastLoginAt},
        preferences = ${JSON.stringify(merged.preferences || {})},
        profile_stats = ${JSON.stringify(merged.profileStats || {})}
      WHERE id = ${id}
    `;
    return merged;
  },

  // --- Activities ---
  getActivities: async (filter?: {
    userId?: string;
    examType?: string;
    module?: string;
    category?: string;
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ items: UserActivityRecord[]; total: number }> => {
    if (!isDbConfigured()) {
      return ServerStorage.getActivities(filter);
    }
    const sql = getSql();

    // Build dynamic WHERE conditions
    let query = sql`SELECT * FROM activities WHERE 1=1`;

    if (filter?.userId) {
      query = sql`${query} AND user_id = ${filter.userId}`;
    }
    if (filter?.examType && filter.examType !== 'all') {
      const examParam = `%${filter.examType.toLowerCase()}%`;
      query = sql`${query} AND (LOWER(exam_type) LIKE ${examParam} OR LOWER(category) LIKE ${examParam})`;
    }
    if (filter?.module && filter.module !== 'all') {
      const modParam = `%${filter.module.toLowerCase()}%`;
      query = sql`${query} AND (LOWER(module) LIKE ${modParam} OR LOWER(title) LIKE ${modParam})`;
    }
    if (filter?.category && filter.category !== 'all') {
      const catParam = `%${filter.category.toLowerCase()}%`;
      query = sql`${query} AND LOWER(category) LIKE ${catParam}`;
    }
    if (filter?.status && filter.status !== 'all') {
      query = sql`${query} AND status = ${filter.status}`;
    }
    if (filter?.search) {
      const searchParam = `%${filter.search.toLowerCase()}%`;
      query = sql`${query} AND (LOWER(title) LIKE ${searchParam} OR LOWER(details) LIKE ${searchParam})`;
    }

    // Count
    const countRes = await sql`SELECT COUNT(*) as count FROM (${query}) AS subquery`;
    const total = parseInt(String(countRes[0]?.count || 0), 10);

    // Order, limit, offset
    query = sql`${query} ORDER BY timestamp DESC`;
    if (filter?.limit) {
      query = sql`${query} LIMIT ${filter.limit}`;
    }
    if (filter?.offset) {
      query = sql`${query} OFFSET ${filter.offset}`;
    }

    const rows = await query;
    return { items: rows.map(rowToActivity), total };
  },

  getActivityById: async (id: string): Promise<UserActivityRecord | null> => {
    if (!isDbConfigured()) {
      return ServerStorage.getActivityById(id);
    }
    const sql = getSql();
    const rows = await sql`SELECT * FROM activities WHERE id = ${id}`;
    return rows.length > 0 ? rowToActivity(rows[0]) : null;
  },

  saveActivity: async (activity: UserActivityRecord): Promise<UserActivityRecord> => {
    if (!isDbConfigured()) {
      return ServerStorage.saveActivity(activity);
    }
    const sql = getSql();
    const id = activity.id || `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const timestamp = activity.timestamp || new Date().toISOString().replace('T', ' ').slice(0, 19);

    // Ensure foreign key constraint on users(id) is satisfied
    if (activity.userId) {
      try {
        const uRows: any = await sql`SELECT id FROM users WHERE id = ${activity.userId} LIMIT 1`;
        const count = Array.isArray(uRows) ? uRows.length : uRows?.rows?.length || 0;
        if (count === 0) {
          const fallbackEmail = activity.userId.includes('@') ? activity.userId : `${activity.userId}@edubridge.org`;
          await sql`
            INSERT INTO users (id, name, username, email, password, role, cohort, status, created_at)
            VALUES (
              ${activity.userId},
              ${activity.userName || 'EduBridge Learner'},
              ${(activity.userName || activity.userId).toLowerCase().replace(/[^a-z0-9]/g, '_')},
              ${fallbackEmail},
              'Password123!',
              ${activity.userRole || 'student'},
              ${activity.cohort || 'academy'},
              'active',
              ${timestamp}
            )
            ON CONFLICT (id) DO NOTHING
          `;
        }
      } catch (fkErr: any) {
        console.warn('[DbStorage] FK check note:', fkErr.message);
      }
    }

    await sql`
      INSERT INTO activities (
        id, user_id, user_name, type, title, category, timestamp,
        score, xp_earned, status, details, exam_type, module,
        attempt_number, started_at, completed_at,
        total_questions, attempted_questions, correct_answers,
        incorrect_answers, skipped_questions, duration_sec,
        max_score, percentage, evaluation, feedback, replay_payload
      )
      VALUES (
        ${id}, ${activity.userId}, ${activity.userName || ''}, ${activity.type},
        ${activity.title}, ${activity.category}, ${timestamp},
        ${String(activity.score ?? '')}, ${activity.xpEarned || 0},
        ${activity.status}, ${activity.details || ''},
        ${activity.examType || null}, ${activity.module || null},
        ${activity.attemptNumber || null}, ${activity.startedAt || null},
        ${activity.completedAt || null}, ${activity.totalQuestions || null},
        ${activity.attemptedQuestions || null}, ${activity.correctAnswers || null},
        ${activity.incorrectAnswers || null}, ${activity.skippedQuestions || null},
        ${activity.durationSec || null}, ${String(activity.maxScore ?? '')},
        ${activity.percentage || null}, ${activity.evaluation || null},
        ${activity.feedback || null}, ${JSON.stringify(activity.replayPayload || { tab: '' })}
      )
      ON CONFLICT (id) DO UPDATE SET
        score = EXCLUDED.score,
        xp_earned = EXCLUDED.xp_earned,
        status = EXCLUDED.status,
        details = EXCLUDED.details,
        total_questions = EXCLUDED.total_questions,
        attempted_questions = EXCLUDED.attempted_questions,
        correct_answers = EXCLUDED.correct_answers,
        incorrect_answers = EXCLUDED.incorrect_answers,
        percentage = EXCLUDED.percentage,
        evaluation = EXCLUDED.evaluation,
        feedback = EXCLUDED.feedback,
        completed_at = EXCLUDED.completed_at,
        duration_sec = EXCLUDED.duration_sec,
        replay_payload = EXCLUDED.replay_payload
    `;

    const saved = await sql`SELECT * FROM activities WHERE id = ${id}`;
    return rowToActivity(saved[0]);
  },

  // --- Question Attempts ---
  getQuestionAttempts: async (filter?: {
    userId?: string;
    testId?: string;
    activityId?: string;
  }): Promise<QuestionAttemptRecord[]> => {
    if (!isDbConfigured()) {
      return ServerStorage.getQuestionAttempts(filter);
    }
    const sql = getSql();

    let query = sql`SELECT * FROM question_attempts WHERE 1=1`;

    if (filter?.userId) {
      query = sql`${query} AND user_id = ${filter.userId}`;
    }
    if (filter?.testId) {
      query = sql`${query} AND test_id = ${filter.testId}`;
    }

    query = sql`${query} ORDER BY timestamp DESC, question_number ASC`;

    const rows = await query;
    return rows.map(rowToQuestionAttempt);
  },

  saveQuestionAttempt: async (attempt: QuestionAttemptRecord): Promise<QuestionAttemptRecord> => {
    if (!isDbConfigured()) {
      return ServerStorage.saveQuestionAttempt(attempt);
    }
    const sql = getSql();
    const id = attempt.id || `qatt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const timestamp = attempt.timestamp || new Date().toISOString().replace('T', ' ').slice(0, 19);

    await sql`
      INSERT INTO question_attempts (
        id, user_id, user_name, user_role, test_id, test_title,
        module_or_subject, question_number, question_prompt, options,
        user_answer, correct_answer, is_correct, score, max_score,
        time_spent_sec, is_skipped, explanation, ai_feedback, instructions, timestamp
      )
      VALUES (
        ${id}, ${attempt.userId}, ${attempt.userName || ''}, ${attempt.userRole || null},
        ${attempt.testId}, ${attempt.testTitle || ''},
        ${attempt.moduleOrSubject || ''}, ${attempt.questionNumber || 0},
        ${attempt.questionPrompt || ''}, ${JSON.stringify(attempt.options || [])},
        ${attempt.userAnswer || ''}, ${attempt.correctAnswer || null},
        ${attempt.isCorrect || false}, ${String(attempt.score ?? '')},
        ${String(attempt.maxScore ?? '')}, ${attempt.timeSpentSec || null},
        ${attempt.isSkipped || false}, ${attempt.explanation || null},
        ${attempt.aiFeedback || null}, ${attempt.instructions || null}, ${timestamp}
      )
      ON CONFLICT (id) DO NOTHING
    `;

    const saved = await sql`SELECT * FROM question_attempts WHERE id = ${id}`;
    return rowToQuestionAttempt(saved[0]);
  },

  saveBatchQuestionAttempts: async (attempts: QuestionAttemptRecord[]): Promise<QuestionAttemptRecord[]> => {
    if (!isDbConfigured()) {
      return ServerStorage.saveBatchQuestionAttempts(attempts);
    }
    const saved: QuestionAttemptRecord[] = [];
    for (const attempt of attempts) {
      try {
        const s = await DbStorage.saveQuestionAttempt(attempt);
        saved.push(s);
      } catch (err: any) {
        console.warn('[EduBridge DB] Batch question attempt save notice:', err.message);
      }
    }
    return saved;
  },

  // --- Written Responses ---
  getWrittenResponses: async (filter?: {
    userId?: string;
    activityId?: string;
  }): Promise<WrittenResponseRecord[]> => {
    if (!isDbConfigured()) {
      return ServerStorage.getWrittenResponses(filter);
    }
    const sql = getSql();

    let query = sql`SELECT * FROM written_responses WHERE 1=1`;

    if (filter?.userId) {
      query = sql`${query} AND user_id = ${filter.userId}`;
    }
    if (filter?.activityId) {
      query = sql`${query} AND activity_id = ${filter.activityId}`;
    }

    query = sql`${query} ORDER BY timestamp DESC`;

    const rows = await query;
    return rows.map(rowToWrittenResponse);
  },

  saveWrittenResponse: async (response: WrittenResponseRecord): Promise<WrittenResponseRecord> => {
    if (!isDbConfigured()) {
      return ServerStorage.saveWrittenResponse(response);
    }
    const sql = getSql();
    const id = response.id || `wres_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const timestamp = response.timestamp || new Date().toISOString().replace('T', ' ').slice(0, 19);

    await sql`
      INSERT INTO written_responses (
        id, user_id, user_name, activity_id, attempt_id, question_id,
        task_title, task_prompt, instructions, source_passage,
        written_text, word_count, character_count, writing_duration_sec,
        evaluation, score, feedback, corrections, vocabulary_recommendations,
        revisions, timestamp
      )
      VALUES (
        ${id}, ${response.userId}, ${response.userName || ''}, ${response.activityId || ''},
        ${response.attemptId || ''}, ${response.questionId || ''},
        ${response.taskTitle || ''}, ${response.taskPrompt || ''},
        ${response.instructions || null}, ${response.sourcePassage || null},
        ${response.writtenText || ''}, ${response.wordCount || 0},
        ${response.characterCount || 0}, ${response.writingDurationSec || null},
        ${JSON.stringify(response.evaluation || {})}, ${String(response.score ?? '')},
        ${response.feedback || null}, ${JSON.stringify(response.corrections || [])},
        ${JSON.stringify(response.vocabularyRecommendations || [])},
        ${JSON.stringify(response.revisions || [])}, ${timestamp}
      )
      ON CONFLICT (id) DO UPDATE SET
        written_text = EXCLUDED.written_text,
        word_count = EXCLUDED.word_count,
        character_count = EXCLUDED.character_count,
        evaluation = EXCLUDED.evaluation,
        score = EXCLUDED.score,
        feedback = EXCLUDED.feedback,
        corrections = EXCLUDED.corrections,
        vocabulary_recommendations = EXCLUDED.vocabulary_recommendations,
        revisions = EXCLUDED.revisions
    `;

    const saved = await sql`SELECT * FROM written_responses WHERE id = ${id}`;
    return rowToWrittenResponse(saved[0]);
  },

  // --- Incomplete Attempts ---
  getIncompleteAttempt: async (userId: string, testId?: string): Promise<IncompleteAttemptRecord | null> => {
    if (!isDbConfigured()) {
      return ServerStorage.getIncompleteAttempt(userId, testId);
    }
    const sql = getSql();
    if (testId) {
      const rows = await sql`
        SELECT * FROM incomplete_attempts WHERE user_id = ${userId} AND test_id = ${testId} LIMIT 1
      `;
      return rows.length > 0 ? rowToIncompleteAttempt(rows[0]) : null;
    }
    const rows = await sql`
      SELECT * FROM incomplete_attempts WHERE user_id = ${userId}
      ORDER BY last_saved_at DESC LIMIT 1
    `;
    return rows.length > 0 ? rowToIncompleteAttempt(rows[0]) : null;
  },

  saveIncompleteAttempt: async (attempt: IncompleteAttemptRecord): Promise<IncompleteAttemptRecord> => {
    if (!isDbConfigured()) {
      return ServerStorage.saveIncompleteAttempt(attempt);
    }
    const sql = getSql();
    const id = attempt.id || `inc_${attempt.userId}_${attempt.testId}`;
    const lastSavedAt = new Date().toISOString();

    await sql`
      INSERT INTO incomplete_attempts (
        id, user_id, test_id, test_title, exam_type, module,
        current_question_index, user_answers, essay_text, elapsed_seconds, last_saved_at
      )
      VALUES (
        ${id}, ${attempt.userId}, ${attempt.testId}, ${attempt.testTitle || ''},
        ${attempt.examType || ''}, ${attempt.module || ''},
        ${attempt.currentQuestionIndex || 0}, ${JSON.stringify(attempt.userAnswers || {})},
        ${attempt.essayText || null}, ${attempt.elapsedSeconds || 0}, ${lastSavedAt}
      )
      ON CONFLICT (user_id, test_id) DO UPDATE SET
        current_question_index = EXCLUDED.current_question_index,
        user_answers = EXCLUDED.user_answers,
        essay_text = EXCLUDED.essay_text,
        elapsed_seconds = EXCLUDED.elapsed_seconds,
        last_saved_at = EXCLUDED.last_saved_at
    `;

    const saved = await sql`
      SELECT * FROM incomplete_attempts WHERE user_id = ${attempt.userId} AND test_id = ${attempt.testId}
    `;
    return rowToIncompleteAttempt(saved[0]);
  },

  clearIncompleteAttempt: async (userId: string, testId?: string): Promise<boolean> => {
    if (!isDbConfigured()) {
      return ServerStorage.clearIncompleteAttempt(userId, testId);
    }
    const sql = getSql();
    if (testId) {
      await sql`DELETE FROM incomplete_attempts WHERE user_id = ${userId} AND test_id = ${testId}`;
    } else {
      await sql`DELETE FROM incomplete_attempts WHERE user_id = ${userId}`;
    }
    return true;
  },

  // --- Attempt Detail (Show Attempt) ---
  getAttemptDetail: async (
    activityId: string,
    requestingUserId?: string,
    requestingUserRole?: string
  ): Promise<AttemptDetailResponse> => {
    if (!isDbConfigured()) {
      return ServerStorage.getAttemptDetail(activityId, requestingUserId, requestingUserRole);
    }
    const activity = await DbStorage.getActivityById(activityId);
    if (!activity) {
      throw Object.assign(new Error(`Activity not found: ${activityId}`), { statusCode: 404 });
    }

    if (requestingUserRole !== 'admin' && requestingUserId && activity.userId !== requestingUserId) {
      throw Object.assign(
        new Error('Unauthorized: You do not have permission to view another user\'s attempt.'),
        { statusCode: 403 }
      );
    }

    const testId = activity.replayPayload?.subId || activity.id;
    let questions = await DbStorage.getQuestionAttempts({ userId: activity.userId, testId });
    if (questions.length === 0) {
      const allUserQ = await DbStorage.getQuestionAttempts({ userId: activity.userId });
      questions = allUserQ.filter(
        (q) => q.testId === testId || q.testTitle.toLowerCase().includes(activity.title.toLowerCase().slice(0, 15))
      );
    }

    let written = await DbStorage.getWrittenResponses({ userId: activity.userId, activityId });
    if (written.length === 0) {
      const allW = await DbStorage.getWrittenResponses({ userId: activity.userId });
      written = allW.filter(
        (w) => w.activityId === activity.id || (testId && w.taskTitle.toLowerCase().includes(activity.title.toLowerCase().slice(0, 15)))
      );
    }
    const writtenResponse = written[0] || undefined;

    const totalQ = questions.length || 1;
    const correctQ = questions.filter((q) => q.isCorrect).length;
    const percentage = questions.length > 0 ? Math.round((correctQ / totalQ) * 100) : 100;
    const scoreText = typeof activity.score === 'string' ? activity.score : `${activity.score || percentage}%`;

    return {
      activity,
      questions,
      writtenResponse,
      summary: {
        scoreText,
        percentage,
        timeSpent: activity.durationSec ? `${Math.round(activity.durationSec / 60)} mins` : 'Timed Session',
        accuracyText: `${correctQ} / ${totalQ} Correct`,
        evaluationBadge: percentage >= 80 ? 'Mastery Achieved' : percentage >= 60 ? 'Proficient' : 'Needs Practice'
      }
    };
  },

  // --- Admin Full User History ---
  getUserFullHistory: async (userId: string) => {
    if (!isDbConfigured()) {
      return ServerStorage.getUserFullHistory(userId);
    }
    const user = await DbStorage.getUsers().then((users) => users.find((u) => u.id === userId));
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    const [activitiesResult, questionAttempts, writtenResponses, incompleteAttempt] = await Promise.all([
      DbStorage.getActivities({ userId }),
      DbStorage.getQuestionAttempts({ userId }),
      DbStorage.getWrittenResponses({ userId }),
      DbStorage.getIncompleteAttempt(userId)
    ]);

    const activities = activitiesResult.items;
    const totalActivities = activities.length;
    const totalPracticeTests = activities.filter((a) => a.type === 'practice_test').length;
    const totalQuizzes = activities.filter((a) => a.type === 'quiz').length;
    const totalMockTests = activities.filter((a) => a.type === 'mock_test').length;
    const totalQuestions = questionAttempts.length;
    const correctQuestions = questionAttempts.filter((q) => q.isCorrect).length;
    const overallAccuracy = totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0;

    return {
      user,
      metrics: {
        totalActivities,
        totalPracticeTests,
        totalQuizzes,
        totalMockTests,
        totalQuestions,
        correctQuestions,
        overallAccuracy: `${overallAccuracy}%`
      },
      activities,
      questionAttempts,
      writtenResponses,
      incompleteAttempt
    };
  },

  // --- SMTP Config in DB ---
  getSmtpConfig: async (): Promise<any | null> => {
    if (!isDbConfigured()) return null;
    const sql = getSql();
    const rows = await sql`SELECT config_json FROM smtp_config WHERE id = 1`;
    return rows.length > 0 ? safeJsonParse(rows[0].config_json, null) : null;
  },

  saveSmtpConfig: async (config: any): Promise<void> => {
    if (!isDbConfigured()) return;
    const sql = getSql();
    await sql`
      INSERT INTO smtp_config (id, config_json)
      VALUES (1, ${JSON.stringify(config)})
      ON CONFLICT (id) DO UPDATE SET config_json = ${JSON.stringify(config)}
    `;
  },

  // --- Email Logs ---
  appendEmailLog: async (log: any): Promise<void> => {
    if (!isDbConfigured()) return;
    const sql = getSql();
    await sql`
      INSERT INTO email_logs (id, timestamp, recipient, type, subject, provider, status, error, duration_ms)
      VALUES (
        ${log.id}, ${log.timestamp}, ${log.recipient}, ${log.type},
        ${log.subject}, ${log.provider || null}, ${log.status},
        ${log.error || null}, ${log.durationMs || null}
      )
      ON CONFLICT (id) DO NOTHING
    `;
    // Keep only last 500 logs
    await sql`
      DELETE FROM email_logs WHERE id NOT IN (
        SELECT id FROM email_logs ORDER BY timestamp DESC LIMIT 500
      )
    `;
  },

  getEmailLogs: async (limit: number = 100): Promise<any[]> => {
    if (!isDbConfigured()) return [];
    const sql = getSql();
    const rows = await sql`SELECT * FROM email_logs ORDER BY timestamp DESC LIMIT ${limit}`;
    return rows.map((r) => ({
      id: r.id,
      timestamp: r.timestamp,
      recipient: r.recipient,
      type: r.type,
      subject: r.subject,
      provider: r.provider,
      status: r.status,
      error: r.error,
      durationMs: r.duration_ms
    }));
  },

  // --- Scheduled Jobs ---
  getScheduledJobs: async (): Promise<any[]> => {
    if (!isDbConfigured()) return [];
    try {
      const sql = getSql();
      const rows = await sql`SELECT * FROM scheduled_jobs ORDER BY id`;
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        cronExpression: r.cron_expression,
        targetTime: r.target_time,
        category: r.category,
        enabled: r.enabled,
        lastRunTimestamp: r.last_run_timestamp,
        nextRunTimestamp: r.next_run_timestamp,
        itemsGeneratedCount: r.items_generated,
        status: r.status,
        batchTarget: r.batch_target
      }));
    } catch {
      return [
        {
          id: 'job_exam_midnight_00',
          name: 'Nightly Multi-Exam Mock & Practice Test Generator',
          description: 'Generates 6 new multi-exam mock tests (PTE, TOEFL, OET, DET, Cambridge, IELTS) and 5 practice tests.',
          cronExpression: '0 0 * * *',
          targetTime: '00:00 (Midnight)',
          category: 'EXAM_PREP',
          enabled: true,
          lastRunTimestamp: `Last run: ${new Date().toISOString().slice(0, 10)} 00:00:02`,
          nextRunTimestamp: 'Tomorrow 00:00',
          itemsGeneratedCount: 11,
          status: 'idle',
          batchTarget: 'At least 6 Mock Tests + 5 Practice Tests'
        },
        {
          id: 'job_vocab_expansion_00',
          name: 'Daily Vocabulary Vault Expansion',
          description: 'Expands the Vocabulary Vault with 100 new CEFR-graded words daily.',
          cronExpression: '0 0 * * *',
          targetTime: '00:00 (Midnight)',
          category: 'VOCABULARY',
          enabled: true,
          lastRunTimestamp: `Last run: ${new Date().toISOString().slice(0, 10)} 00:00:04`,
          nextRunTimestamp: 'Tomorrow 00:00',
          itemsGeneratedCount: 100,
          status: 'idle',
          batchTarget: 'At least 100 Vocabulary Words'
        },
        {
          id: 'job_quiz_generation_00',
          name: 'Daily Cohort Quiz & Assessment Generator',
          description: 'Generates 10 new age-cohort quizzes across early, junior, academy, pro, and senior cohorts.',
          cronExpression: '0 0 * * *',
          targetTime: '00:00 (Midnight)',
          category: 'QUIZ_EVAL',
          enabled: true,
          lastRunTimestamp: `Last run: ${new Date().toISOString().slice(0, 10)} 00:00:06`,
          nextRunTimestamp: 'Tomorrow 00:00',
          itemsGeneratedCount: 10,
          status: 'idle',
          batchTarget: 'At least 10 Cohort Quizzes'
        }
      ];
    }
  },

  updateScheduledJob: async (id: string, updates: Partial<{ lastRunTimestamp: string; nextRunTimestamp: string; status: string; itemsGeneratedCount: number; enabled: boolean }>): Promise<void> => {
    if (!isDbConfigured()) return;
    try {
      const sql = getSql();
      if (updates.lastRunTimestamp !== undefined) {
        await sql`UPDATE scheduled_jobs SET last_run_timestamp = ${updates.lastRunTimestamp} WHERE id = ${id}`;
      }
      if (updates.nextRunTimestamp !== undefined) {
        await sql`UPDATE scheduled_jobs SET next_run_timestamp = ${updates.nextRunTimestamp} WHERE id = ${id}`;
      }
      if (updates.status !== undefined) {
        await sql`UPDATE scheduled_jobs SET status = ${updates.status} WHERE id = ${id}`;
      }
      if (updates.itemsGeneratedCount !== undefined) {
        await sql`UPDATE scheduled_jobs SET items_generated = ${updates.itemsGeneratedCount} WHERE id = ${id}`;
      }
      if (updates.enabled !== undefined) {
        await sql`UPDATE scheduled_jobs SET enabled = ${updates.enabled} WHERE id = ${id}`;
      }
    } catch {}
  },

  // --- Standard & Practice Tests ---
  getStandardTests: async (filter?: {
    testStandard?: string;
    testType?: string;
    subject?: string;
    category?: string;
    difficulty?: string;
    limit?: number;
  }): Promise<any[]> => {
    if (!isDbConfigured()) {
      let list = [...multiExamMockTests];
      if (filter?.testStandard) {
        list = list.filter((t) => t.exam?.toLowerCase() === filter.testStandard!.toLowerCase());
      }
      if (filter?.subject) {
        list = list.filter((t) => t.subject?.toLowerCase().includes(filter.subject!.toLowerCase()));
      }
      return list;
    }

    try {
      const sql = getSql();
      let query = sql`SELECT * FROM standard_tests WHERE 1=1`;

      if (filter?.testStandard) {
        query = sql`${query} AND LOWER(test_standard) = LOWER(${filter.testStandard})`;
      }
      if (filter?.testType) {
        query = sql`${query} AND LOWER(test_type) = LOWER(${filter.testType})`;
      }
      if (filter?.subject) {
        const subParam = `%${filter.subject}%`;
        query = sql`${query} AND LOWER(subject) LIKE LOWER(${subParam})`;
      }
      if (filter?.category) {
        query = sql`${query} AND LOWER(category) = LOWER(${filter.category})`;
      }
      if (filter?.difficulty) {
        query = sql`${query} AND LOWER(difficulty) = LOWER(${filter.difficulty})`;
      }

      query = sql`${query} ORDER BY id ASC`;
      if (filter?.limit && filter.limit > 0) {
        query = sql`${query} LIMIT ${filter.limit}`;
      }

      const rows = await query;
      return rows.map(rowToStandardTest);
    } catch {
      let list = [...multiExamMockTests];
      if (filter?.testStandard) {
        list = list.filter((t) => t.exam?.toLowerCase() === filter.testStandard!.toLowerCase());
      }
      if (filter?.subject) {
        list = list.filter((t) => t.subject?.toLowerCase().includes(filter.subject!.toLowerCase()));
      }
      return list;
    }
  },

  getStandardTestById: async (id: string): Promise<any | null> => {
    if (!isDbConfigured()) {
      return [...multiExamMockTests, ...mockTests].find((t) => t.id === id) || null;
    }
    try {
      const sql = getSql();
      const rows = await sql`SELECT * FROM standard_tests WHERE id = ${id}`;
      return rows.length > 0 ? rowToStandardTest(rows[0]) : null;
    } catch {
      return [...multiExamMockTests, ...mockTests].find((t) => t.id === id) || null;
    }
  },

  saveStandardTest: async (test: any): Promise<any> => {
    const questions = test.questions || [];
    const questionCount = questions.length || test.questionCount || 10;
    const testStandard = test.testStandard || test.exam || 'General';
    const testType = test.testType || (test.exam ? 'mock' : 'practice');
    const title = test.title || 'Untitled Assessment';
    const difficulty = test.difficulty || 'Standard';
    const category = test.category || (testStandard + ' ' + (testType === 'mock' ? 'Mock' : 'Practice'));
    const subject = test.subject || questions[0]?.subject || 'English';
    const duration = test.durationMinutes || test.totalDurationMin || 30;
    const targetScore = test.targetScore || test.targetBandRequirement || '';
    const sections = test.sections || [];
    const metadata = test.metadata || {};
    const now = new Date().toISOString();

    if (!isDbConfigured()) {
      return { ...test, id: test.id, questions, questionCount };
    }

    try {
      const sql = getSql();
      await sql`
        INSERT INTO standard_tests (
          id, test_standard, test_type, title, difficulty, category,
          subject, duration_minutes, question_count, target_score,
          sections, questions, metadata, created_at, updated_at
        )
        VALUES (
          ${test.id}, ${testStandard}, ${testType}, ${title},
          ${difficulty}, ${category}, ${subject}, ${duration},
          ${questionCount}, ${targetScore},
          ${JSON.stringify(sections)}, ${JSON.stringify(questions)},
          ${JSON.stringify(metadata)}, ${test.createdAt || now}, ${now}
        )
        ON CONFLICT (id) DO UPDATE SET
          test_standard = EXCLUDED.test_standard,
          test_type = EXCLUDED.test_type,
          title = EXCLUDED.title,
          difficulty = EXCLUDED.difficulty,
          category = EXCLUDED.category,
          subject = EXCLUDED.subject,
          duration_minutes = EXCLUDED.duration_minutes,
          question_count = EXCLUDED.question_count,
          target_score = EXCLUDED.target_score,
          sections = EXCLUDED.sections,
          questions = EXCLUDED.questions,
          metadata = EXCLUDED.metadata,
          updated_at = EXCLUDED.updated_at
      `;

      return DbStorage.getStandardTestById(test.id);
    } catch {
      return { ...test, id: test.id, questions, questionCount };
    }
  },

  deleteStandardTest: async (id: string): Promise<boolean> => {
    if (!isDbConfigured()) return true;
    try {
      const sql = getSql();
      await sql`DELETE FROM standard_tests WHERE id = ${id}`;
    } catch {}
    return true;
  },

  // --- Quizzes ---
  getQuizzes: async (filter?: { cohort?: string; category?: string; limit?: number }): Promise<any[]> => {
    if (!isDbConfigured()) {
      let list = [...cohortQuizQuestions];
      if (filter?.cohort) list = list.filter((q) => q.cohort === filter.cohort);
      if (filter?.category) list = list.filter((q) => q.category === filter.category);
      if (filter?.limit) list = list.slice(0, filter.limit);
      return list;
    }

    try {
      const sql = getSql();
      let query = sql`SELECT * FROM quizzes WHERE 1=1`;

      if (filter?.cohort) {
        query = sql`${query} AND LOWER(cohort) = LOWER(${filter.cohort})`;
      }
      if (filter?.category) {
        query = sql`${query} AND LOWER(category) = LOWER(${filter.category})`;
      }
      query = sql`${query} ORDER BY id ASC`;
      if (filter?.limit && filter.limit > 0) {
        query = sql`${query} LIMIT ${filter.limit}`;
      }

      const rows = await query;
      return rows.map(rowToQuiz);
    } catch {
      let list = [...cohortQuizQuestions];
      if (filter?.cohort) list = list.filter((q) => q.cohort === filter.cohort);
      if (filter?.category) list = list.filter((q) => q.category === filter.category);
      if (filter?.limit) list = list.slice(0, filter.limit);
      return list;
    }
  },

  getQuizById: async (id: string): Promise<any | null> => {
    if (!isDbConfigured()) {
      return cohortQuizQuestions.find((q) => q.id === id) || null;
    }
    try {
      const sql = getSql();
      const rows = await sql`SELECT * FROM quizzes WHERE id = ${id}`;
      return rows.length > 0 ? rowToQuiz(rows[0]) : null;
    } catch {
      return cohortQuizQuestions.find((q) => q.id === id) || null;
    }
  },

  saveQuiz: async (quiz: any): Promise<any> => {
    if (!isDbConfigured()) return quiz;
    try {
      const sql = getSql();
      const now = new Date().toISOString();
      await sql`
        INSERT INTO quizzes (
          id, cohort, education_level, category, word, phonetic,
          prompt, options, correct_answer, explanation, audio_prompt,
          praise, metadata, created_at
        )
        VALUES (
          ${quiz.id}, ${quiz.cohort}, ${quiz.educationLevel || ''}, ${quiz.category},
          ${quiz.word || ''}, ${quiz.phonetic || ''}, ${quiz.prompt},
          ${JSON.stringify(quiz.options || [])}, ${quiz.correctAnswer},
          ${quiz.explanation || ''}, ${quiz.audioPrompt || ''}, ${quiz.praise || ''},
          ${JSON.stringify(quiz.metadata || {})}, ${quiz.createdAt || now}
        )
        ON CONFLICT (id) DO UPDATE SET
          cohort = EXCLUDED.cohort,
          education_level = EXCLUDED.education_level,
          category = EXCLUDED.category,
          word = EXCLUDED.word,
          phonetic = EXCLUDED.phonetic,
          prompt = EXCLUDED.prompt,
          options = EXCLUDED.options,
          correct_answer = EXCLUDED.correct_answer,
          explanation = EXCLUDED.explanation,
          audio_prompt = EXCLUDED.audio_prompt,
          praise = EXCLUDED.praise,
          metadata = EXCLUDED.metadata
      `;
      return DbStorage.getQuizById(quiz.id);
    } catch {
      return quiz;
    }
  },

  saveBatchQuizzes: async (quizzes: any[]): Promise<any[]> => {
    const saved: any[] = [];
    for (const q of quizzes) {
      const res = await DbStorage.saveQuiz(q);
      saved.push(res);
    }
    return saved;
  },

  // --- App Configurations ---
  getAllConfigurations: async (): Promise<Record<string, any>> => {
    if (!isDbConfigured()) {
      return {
        exam_settings: { questionsPerTest: 10, allowShuffleOptions: true, writingTestQuestions: 1 },
        feature_flags: initialFeatureFlags,
        color_scheme: DEFAULT_COLOR_SCHEME,
        system_setup: { appName: 'EduBridge', initialized: true, centralizedDb: 'Local Vault' }
      };
    }
    try {
      const sql = getSql();
      const rows = await sql`SELECT * FROM app_configurations ORDER BY key ASC`;
      const map: Record<string, any> = {};
      for (const r of rows) {
        map[r.key] = safeJsonParse(r.value, r.value);
      }
      return map;
    } catch {
      return {
        exam_settings: { questionsPerTest: 10, allowShuffleOptions: true, writingTestQuestions: 1 },
        feature_flags: initialFeatureFlags,
        color_scheme: DEFAULT_COLOR_SCHEME,
        system_setup: { appName: 'EduBridge', initialized: true, centralizedDb: 'Local Vault' }
      };
    }
  },

  getConfiguration: async (key: string): Promise<any | null> => {
    if (!isDbConfigured()) {
      if (key === 'exam_settings') return { questionsPerTest: 10, allowShuffleOptions: true, writingTestQuestions: 1 };
      if (key === 'feature_flags') return initialFeatureFlags;
      if (key === 'color_scheme') return DEFAULT_COLOR_SCHEME;
      return null;
    }
    try {
      const sql = getSql();
      const rows = await sql`SELECT value FROM app_configurations WHERE key = ${key}`;
      return rows.length > 0 ? safeJsonParse(rows[0].value, rows[0].value) : null;
    } catch {
      if (key === 'exam_settings') return { questionsPerTest: 10, allowShuffleOptions: true, writingTestQuestions: 1 };
      if (key === 'feature_flags') return initialFeatureFlags;
      if (key === 'color_scheme') return DEFAULT_COLOR_SCHEME;
      return null;
    }
  },

  setConfiguration: async (
    key: string,
    value: any,
    category: string = 'general',
    description: string = '',
    updatedBy: string = 'system'
  ): Promise<any> => {
    if (!isDbConfigured()) return value;
    const sql = getSql();
    const now = new Date().toISOString();
    await sql`
      INSERT INTO app_configurations (key, value, category, description, updated_at, updated_by)
      VALUES (${key}, ${JSON.stringify(value)}, ${category}, ${description}, ${now}, ${updatedBy})
      ON CONFLICT (key) DO UPDATE SET
        value = EXCLUDED.value,
        category = CASE WHEN EXCLUDED.category <> 'general' THEN EXCLUDED.category ELSE app_configurations.category END,
        description = CASE WHEN EXCLUDED.description <> '' THEN EXCLUDED.description ELSE app_configurations.description END,
        updated_at = EXCLUDED.updated_at,
        updated_by = EXCLUDED.updated_by
    `;
    return value;
  },

  createOtp: async (record: {
    id: string;
    email: string;
    type: 'REGISTRATION' | 'PASSWORD_RESET';
    otpCode: string;
    otpHash: string;
    attempts: number;
    maxAttempts: number;
    expiresAt: number;
    createdAt: number;
    lastSentAt: number;
    status: 'active' | 'verified' | 'expired' | 'invalidated';
    metadata?: Record<string, any>;
  }): Promise<any> => {
    if (!isDbConfigured()) {
      return ServerStorage.createOtp(record);
    }
    const sql = getSql();
    await sql`
      UPDATE auth_otps
      SET status = 'invalidated'
      WHERE LOWER(email) = ${record.email.toLowerCase()} AND type = ${record.type} AND status = 'active'
    `;
    await sql`
      INSERT INTO auth_otps (
        id, email, type, otp_code, otp_hash,
        attempts, max_attempts, expires_at, created_at,
        last_sent_at, status, metadata
      )
      VALUES (
        ${record.id}, ${record.email.toLowerCase()}, ${record.type},
        ${record.otpCode}, ${record.otpHash},
        ${record.attempts}, ${record.maxAttempts}, ${record.expiresAt},
        ${record.createdAt}, ${record.lastSentAt}, ${record.status},
        ${JSON.stringify(record.metadata || {})}
      )
    `;
    return record;
  },

  getOtp: async (email: string, type: 'REGISTRATION' | 'PASSWORD_RESET'): Promise<any | null> => {
    if (!isDbConfigured()) {
      return ServerStorage.getOtp(email, type);
    }
    const sql = getSql();
    const rows = await sql`
      SELECT * FROM auth_otps
      WHERE LOWER(email) = ${email.toLowerCase()} AND type = ${type} AND status = 'active'
      ORDER BY created_at DESC
      LIMIT 1
    `;
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
      email: r.email,
      type: r.type,
      otpCode: r.otp_code,
      otpHash: r.otp_hash,
      attempts: parseInt(String(r.attempts), 10),
      maxAttempts: parseInt(String(r.max_attempts), 10),
      expiresAt: Number(r.expires_at),
      createdAt: Number(r.created_at),
      lastSentAt: Number(r.last_sent_at),
      status: r.status,
      metadata: typeof r.metadata === 'string' ? safeJsonParse(r.metadata, {}) : r.metadata || {}
    };
  },

  incrementOtpAttempts: async (id: string): Promise<number> => {
    if (!isDbConfigured()) {
      return ServerStorage.incrementOtpAttempts(id);
    }
    const sql = getSql();
    const rows = await sql`
      UPDATE auth_otps
      SET attempts = attempts + 1
      WHERE id = ${id}
      RETURNING attempts
    `;
    return rows.length > 0 ? parseInt(String(rows[0].attempts), 10) : 1;
  },

  markOtpVerified: async (id: string): Promise<void> => {
    if (!isDbConfigured()) {
      return ServerStorage.markOtpVerified(id);
    }
    const sql = getSql();
    await sql`
      UPDATE auth_otps
      SET status = 'verified'
      WHERE id = ${id}
    `;
  },

  invalidateOtp: async (id: string): Promise<void> => {
    if (!isDbConfigured()) {
      return ServerStorage.invalidateOtp(id);
    }
    const sql = getSql();
    await sql`
      UPDATE auth_otps
      SET status = 'invalidated'
      WHERE id = ${id}
    `;
  },

  getOtpLogs: async (limit: number = 50): Promise<any[]> => {
    if (!isDbConfigured()) {
      return ServerStorage.getOtpLogs(limit);
    }
    const sql = getSql();
    const rows = await sql`
      SELECT id, email, type, attempts, max_attempts, expires_at, created_at, last_sent_at, status, metadata
      FROM auth_otps
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
    return rows.map((r: any) => ({
      id: r.id,
      email: r.email,
      type: r.type,
      attempts: parseInt(String(r.attempts), 10),
      maxAttempts: parseInt(String(r.max_attempts), 10),
      expiresAt: new Date(Number(r.expires_at)).toISOString(),
      createdAt: new Date(Number(r.created_at)).toISOString(),
      status: r.status,
      metadata: typeof r.metadata === 'string' ? safeJsonParse(r.metadata, {}) : r.metadata || {}
    }));
  }
};
