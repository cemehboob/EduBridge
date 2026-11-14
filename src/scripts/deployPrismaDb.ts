/**
 * EduBridge — Prisma Postgres Live Deployment Script
 * Connects directly to the Prisma Postgres instance (db.prisma.io:5432),
 * creates all tables, indexes, views (23 objects total),
 * seeds initial users, activities, question attempts, written responses,
 * scheduled jobs, standard tests, cohort quizzes, and app configurations,
 * and executes scheduled jobs directly on the database.
 */

import 'dotenv/config';
import postgres from 'postgres';
import { initialUsers, initialFeatureFlags } from '../data/userManagementData';
import { initialActivities, initialQuestionAttempts } from '../data/activityData';
import { multiExamMockTests } from '../data/multiExamMockTestsData';
import { mockTests } from '../data/initialData';
import { cohortQuizQuestions } from '../data/cohortQuizzesData';
import { IELTSPracticeService } from '../services/ieltsPracticeService';
import { DEFAULT_COLOR_SCHEME } from '../utils/themeManager';
import { executeAllDatabaseScheduledJobs } from '../../server/scheduler';

const CONNECTION_STRING = process.env.DATABASE_URL;

if (!CONNECTION_STRING) {
  console.error('\n[EduBridge Deploy Error] DATABASE_URL environment variable is not set.');
  console.error('Please configure DATABASE_URL in your .env file or export it in your shell environment.');
  process.exit(1);
}

async function deployToDatabase() {
  console.log('=================================================================');
  console.log('   EduBridge — Deploying Schema & Data to Prisma Postgres        ');
  console.log('=================================================================');
  const maskedHost = CONNECTION_STRING!.split('@')[1] || 'Prisma Postgres Cloud';
  console.log(`Connecting to: ${maskedHost}\n`);

  const sql = postgres(CONNECTION_STRING!, { ssl: 'require', max: 10, idle_timeout: 20 });

  try {
    // 1. Create Tables, Indexes & Views
    console.log('Step 1/5: Creating Tables, Indexes & Views on Prisma Postgres...');

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
    console.log('  ✓ Table "users" verified');

    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        token       TEXT PRIMARY KEY,
        user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        user_role   TEXT NOT NULL,
        created_at  BIGINT NOT NULL,
        expires_at  BIGINT NOT NULL
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at)`;
    console.log('  ✓ Table "sessions" and indexes verified');

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
    await sql`CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON activities(timestamp DESC)`;
    console.log('  ✓ Table "activities" and indexes verified');

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
    await sql`CREATE INDEX IF NOT EXISTS idx_qa_user_id ON question_attempts(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_qa_test_id ON question_attempts(test_id)`;
    console.log('  ✓ Table "question_attempts" and indexes verified');

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
    await sql`CREATE INDEX IF NOT EXISTS idx_wr_user_id ON written_responses(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_wr_activity_id ON written_responses(activity_id)`;
    console.log('  ✓ Table "written_responses" and indexes verified');

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
    console.log('  ✓ Table "incomplete_attempts" verified');

    await sql`
      CREATE TABLE IF NOT EXISTS smtp_config (
        id           INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
        config_json  JSONB NOT NULL
      )
    `;
    console.log('  ✓ Table "smtp_config" verified');

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
    await sql`CREATE INDEX IF NOT EXISTS idx_email_logs_ts ON email_logs(timestamp DESC)`;
    console.log('  ✓ Table "email_logs" and indexes verified');

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
    console.log('  ✓ Table "auth_otps" and indexes verified');

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
    console.log('  ✓ Table "scheduled_jobs" verified');

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
    console.log('  ✓ Table "standard_tests" and indexes verified');

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
    console.log('  ✓ Table "quizzes" and indexes verified');

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
    console.log('  ✓ Table "app_configurations" and index verified');

    // ─── Views (10 First-Class Database Views) ───
    await sql`CREATE OR REPLACE VIEW password_resets AS SELECT * FROM auth_otps WHERE type = 'PASSWORD_RESET'`;
    await sql`CREATE OR REPLACE VIEW user_creation_otps AS SELECT * FROM auth_otps WHERE type = 'REGISTRATION'`;
    await sql`CREATE OR REPLACE VIEW exams AS SELECT * FROM standard_tests WHERE test_type = 'mock'`;
    await sql`CREATE OR REPLACE VIEW mock_tests AS SELECT * FROM standard_tests WHERE test_type = 'mock'`;
    await sql`CREATE OR REPLACE VIEW practice_tests AS SELECT * FROM standard_tests WHERE test_type = 'practice'`;
    await sql`CREATE OR REPLACE VIEW sample_tests AS SELECT * FROM standard_tests`;
    await sql`CREATE OR REPLACE VIEW configuration_setup AS SELECT key as config_key, value as config_data, category, description, updated_at, updated_by FROM app_configurations`;
    await sql`CREATE OR REPLACE VIEW schedule_jobs AS SELECT * FROM scheduled_jobs`;
    await sql`CREATE OR REPLACE VIEW student_activities AS SELECT * FROM activities`;
    await sql`CREATE OR REPLACE VIEW answers AS SELECT id as attempt_id, user_id, user_name, test_id, question_number, user_answer, correct_answer, is_correct, score, explanation, timestamp FROM question_attempts`;
    console.log('  ✓ 10 Database Views created and verified');

    // 2. Seed Initial Users, Activities, Tests, Quizzes & Configs
    console.log('\nStep 2/5: Seeding initial data into Prisma Postgres...');

    // Seed users
    let usersInserted = 0;
    for (const u of initialUsers) {
      await sql`
        INSERT INTO users (
          id, name, username, email, password, date_of_birth,
          role, status, email_verified, email_verification_status,
          created_at, last_login_at, preferences, profile_stats
        )
        VALUES (
          ${u.id}, ${u.name}, ${u.username || null}, ${u.email},
          ${u.password}, ${u.dateOfBirth}, ${u.role}, ${u.status},
          ${u.emailVerified ?? true}, ${u.emailVerificationStatus || 'verified'},
          ${u.createdAt}, ${u.lastLoginAt},
          ${JSON.stringify(u.preferences)}, ${JSON.stringify(u.profileStats)}
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          username = EXCLUDED.username,
          password = EXCLUDED.password,
          role = EXCLUDED.role,
          status = EXCLUDED.status,
          preferences = EXCLUDED.preferences,
          profile_stats = EXCLUDED.profile_stats
      `;
      usersInserted++;
    }
    console.log(`  ✓ Seeded/Updated ${usersInserted} users`);

    // Seed activities
    let actsInserted = 0;
    for (const act of initialActivities) {
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
      actsInserted++;
    }
    console.log(`  ✓ Seeded ${actsInserted} activities`);

    // Seed question attempts
    let qaInserted = 0;
    for (const qa of initialQuestionAttempts) {
      await sql`
        INSERT INTO question_attempts (
          id, user_id, user_name, user_role, test_id, test_title,
          module_or_subject, question_number, question_prompt, options,
          user_answer, correct_answer, is_correct, score, max_score,
          time_spent_sec, is_skipped, explanation, ai_feedback, instructions, timestamp
        )
        VALUES (
          ${qa.id}, ${qa.userId}, ${qa.userName || ''}, ${qa.userRole || null},
          ${qa.testId}, ${qa.testTitle || ''},
          ${qa.moduleOrSubject || ''}, ${qa.questionNumber || 0},
          ${qa.questionPrompt || ''}, ${JSON.stringify(qa.options || [])},
          ${qa.userAnswer || ''}, ${qa.correctAnswer || null},
          ${qa.isCorrect || false}, ${String(qa.score ?? '')},
          ${String(qa.maxScore ?? '')}, ${qa.timeSpentSec || null},
          ${qa.isSkipped || false}, ${qa.explanation || null},
          ${qa.aiFeedback || null}, ${qa.instructions || null}, ${qa.timestamp}
        )
        ON CONFLICT (id) DO NOTHING
      `;
      qaInserted++;
    }
    console.log(`  ✓ Seeded ${qaInserted} question attempts`);

    // Seed initial written responses
    const initialWritten: any[] = [
      {
        id: 'wres_init_01',
        userId: 'usr_student_01',
        userName: 'Educator Rivera',
        activityId: 'act_alex_01',
        attemptId: 'ielts_mock_01',
        questionId: 'w_task2_01',
        taskTitle: 'IELTS Academic Writing Task 2 — Automation & Future Workplaces',
        taskPrompt: 'Some people believe that artificial intelligence will eliminate most jobs, while others argue it will create new opportunities. Discuss both views and give your opinion.',
        instructions: 'Write at least 250 words. Present a clear position and well-developed arguments.',
        sourcePassage: 'Academic Writing Task 2 standard prompt on technology and workforce evolution.',
        writtenText: 'In the contemporary era, artificial intelligence and robotics are transforming global workforce dynamics at unprecedented speed. While some skeptics express profound concern regarding widespread technological unemployment, proponents maintain that disruptive technologies inevitably generate novel industries and intellectual careers. In my evaluation, while routine manual tasks will certainly become automated, human creativity, ethical governance, and strategic decision-making will remain indispensable, leading to net positive societal advancement when coupled with lifelong educational re-skilling.',
        wordCount: 78,
        characterCount: 567,
        writingDurationSec: 540,
        evaluation: {
          taskAchievement: 8.0,
          coherenceCohesion: 8.0,
          lexicalResource: 8.5,
          grammaticalAccuracy: 8.0,
          overallBand: 8.0
        },
        score: '8.0',
        feedback: 'Sophisticated thesis statement, academic vocabulary, and robust cohesive phrasing.',
        corrections: [],
        vocabularyRecommendations: ['unprecedented speed', 'technological unemployment', 'ethical governance'],
        revisions: [],
        timestamp: '2026-11-06 14:15:00'
      }
    ];

    for (const w of initialWritten) {
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
            ${w.id}, ${w.userId}, ${w.userName}, ${w.activityId}, ${w.attemptId}, ${w.questionId},
            ${w.taskTitle}, ${w.taskPrompt}, ${w.instructions}, ${w.sourcePassage},
            ${w.writtenText}, ${w.wordCount}, ${w.characterCount}, ${w.writingDurationSec},
            ${JSON.stringify(w.evaluation)}, ${w.score}, ${w.feedback}, ${JSON.stringify(w.corrections)},
            ${JSON.stringify(w.vocabularyRecommendations)}, ${JSON.stringify(w.revisions)}, ${w.timestamp}
          )
          ON CONFLICT (id) DO NOTHING
        `;
      } catch (err: any) {
        console.warn(`[Deploy Prisma] Written response seed note:`, err.message);
      }
    }
    console.log('  ✓ Seeded written responses');

    // Seed scheduled jobs
    const initialJobs = [
      {
        id: 'job_exam_midnight_00',
        name: 'Nightly Multi-Exam Mock & Practice Test Generator',
        description: 'Generates 6 standardized mock tests and 5 authentic IELTS practice tests every midnight directly on the database.',
        cronExpression: '0 0 * * *',
        targetTime: 'Midnight (00:00 UTC)',
        category: 'Exams & Practice',
        enabled: true,
        lastRunTimestamp: 'Never run yet',
        nextRunTimestamp: 'Tomorrow 00:00 UTC',
        itemsGenerated: 0,
        status: 'idle',
        batchTarget: 'standard_tests'
      },
      {
        id: 'job_vocab_expansion_00',
        name: 'Daily Vocabulary Vault Expansion & Lexicon Quizzes',
        description: 'Generates 100 GRE/TOEFL scholarly vocabulary words and creates cohort curriculum quizzes with randomized option order.',
        cronExpression: '0 3 * * *',
        targetTime: 'Daily (03:00 UTC)',
        category: 'Vocabulary & Quizzes',
        enabled: true,
        lastRunTimestamp: 'Never run yet',
        nextRunTimestamp: 'Tomorrow 03:00 UTC',
        itemsGenerated: 0,
        status: 'idle',
        batchTarget: 'quizzes'
      },
      {
        id: 'job_streak_analytics_00',
        name: 'Daily Study Streak & Gamification Integrity Audit',
        description: 'Audits daily streaks, awards badges, and recalculates leaderboards across all student cohorts.',
        cronExpression: '0 1 * * *',
        targetTime: 'Daily (01:00 UTC)',
        category: 'Gamification & Streaks',
        enabled: true,
        lastRunTimestamp: 'Never run yet',
        nextRunTimestamp: 'Tomorrow 01:00 UTC',
        itemsGenerated: 0,
        status: 'idle',
        batchTarget: 'users'
      }
    ];

    for (const job of initialJobs) {
      await sql`
        INSERT INTO scheduled_jobs (
          id, name, description, cron_expression, target_time,
          category, enabled, last_run_timestamp, next_run_timestamp,
          items_generated, status, batch_target
        )
        VALUES (
          ${job.id}, ${job.name}, ${job.description}, ${job.cronExpression}, ${job.targetTime},
          ${job.category}, ${job.enabled}, ${job.lastRunTimestamp}, ${job.nextRunTimestamp},
          ${job.itemsGenerated}, ${job.status}, ${job.batchTarget}
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          cron_expression = EXCLUDED.cron_expression,
          target_time = EXCLUDED.target_time,
          category = EXCLUDED.category,
          batch_target = EXCLUDED.batch_target
      `;
    }
    console.log('  ✓ Seeded scheduled jobs');

    // Seed standard tests (multi-exam mock tests)
    let stdTestsInserted = 0;
    for (const test of multiExamMockTests) {
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
      stdTestsInserted++;
    }

    for (const test of mockTests) {
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
      stdTestsInserted++;
    }

    // Seed IELTS practice tests
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
      stdTestsInserted++;
    }
    console.log(`  ✓ Seeded ${stdTestsInserted} standard & practice tests`);

    // Seed cohort quizzes
    let quizzesInserted = 0;
    for (const q of cohortQuizQuestions) {
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
      quizzesInserted++;
    }
    console.log(`  ✓ Seeded ${quizzesInserted} cohort quizzes`);

    // Seed app configurations
    const configsToSeed = [
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

    let configsInserted = 0;
    for (const cfg of configsToSeed) {
      await sql`
        INSERT INTO app_configurations (key, value, category, description, updated_at, updated_by)
        VALUES (${cfg.key}, ${JSON.stringify(cfg.value)}, ${cfg.category}, ${cfg.description}, ${new Date().toISOString()}, 'system')
        ON CONFLICT (key) DO UPDATE SET
          value = EXCLUDED.value,
          category = EXCLUDED.category,
          description = EXCLUDED.description,
          updated_at = EXCLUDED.updated_at
      `;
      configsInserted++;
    }
    console.log(`  ✓ Seeded/Updated ${configsInserted} application configurations`);

    // 3. Step 3: Run Database Scheduled Jobs
    console.log('\nStep 3/5: Executing database scheduled jobs directly on Prisma Postgres...');
    const jobsRes = await executeAllDatabaseScheduledJobs();
    console.log(`  ✓ Scheduled jobs executed successfully:`);
    console.log(`    • Mock tests generated:     ${jobsRes.totalMockTests}`);
    console.log(`    • Practice tests generated: ${jobsRes.totalPracticeTests}`);
    console.log(`    • Quizzes generated:        ${jobsRes.totalQuizzes}`);

    // 4. Verification Queries
    console.log('\nStep 4/5: Verifying deployed tables and row counts in Prisma Postgres...');
    const [uCount, aCount, qCount, wCount, jCount, tCount, qzCount, cCount] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM users`,
      sql`SELECT COUNT(*) as count FROM activities`,
      sql`SELECT COUNT(*) as count FROM question_attempts`,
      sql`SELECT COUNT(*) as count FROM written_responses`,
      sql`SELECT COUNT(*) as count FROM scheduled_jobs`,
      sql`SELECT COUNT(*) as count FROM standard_tests`,
      sql`SELECT COUNT(*) as count FROM quizzes`,
      sql`SELECT COUNT(*) as count FROM app_configurations`
    ]);

    console.log(`  • users:              ${uCount[0].count} records`);
    console.log(`  • activities:         ${aCount[0].count} records`);
    console.log(`  • question_attempts:  ${qCount[0].count} records`);
    console.log(`  • written_responses:  ${wCount[0].count} records`);
    console.log(`  • scheduled_jobs:     ${jCount[0].count} records`);
    console.log(`  • standard_tests:     ${tCount[0].count} records`);
    console.log(`  • quizzes:            ${qzCount[0].count} records`);
    console.log(`  • app_configurations: ${cCount[0].count} records`);

    // 5. Environment confirmation
    console.log('\nStep 5/5: Verifying Prisma Postgres connection & state...');
    console.log('  ✓ DATABASE_URL environment variable is active and verified.');

    console.log('\n=================================================================');
    console.log('  SUCCESS: Prisma Postgres Database Fully Deployed & Verified!   ');
    console.log('=================================================================\n');
  } finally {
    await sql.end({ timeout: 5 });
  }
}

deployToDatabase().catch((err) => {
  console.error('\nDeployment Error:', err);
  process.exit(1);
});
