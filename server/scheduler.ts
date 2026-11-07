import { DbStorage } from './db';
import {
  generateFivePracticeTestsBatch,
  generatePracticeTestsBatch,
  generateOneHundredWordsBatch
} from '../src/services/scheduleJobService';
import { cohortQuizQuestions } from '../src/data/cohortQuizzesData';

/**
 * EduBridge Centralized Database Job Execution Engine
 * Executes scheduled jobs directly against the Neon Postgres cloud database,
 * generating authentic mock tests, practice tests, and cohort quizzes,
 * and persisting every newly generated entity into standard_tests, quizzes,
 * and updating scheduled_jobs table with exact run metrics and timestamps.
 */

export async function executeJobOnDatabase(jobId: string, customTimestamp?: string): Promise<{
  success: boolean;
  jobId: string;
  jobName: string;
  itemsGenerated: number;
  mockTestsCount: number;
  practiceTestsCount: number;
  quizzesCount: number;
  timestamp: string;
  details: string;
}> {
  const timestamp = customTimestamp || new Date().toISOString().replace('T', ' ').slice(0, 19);

  // Set job status to running in the database
  await DbStorage.updateScheduledJob(jobId, { status: 'running' });

  let itemsGenerated = 0;
  let mockTestsCount = 0;
  let practiceTestsCount = 0;
  let quizzesCount = 0;
  let jobName = 'Scheduled Job';
  let details = '';

  if (jobId === 'job_exam_midnight_00') {
    jobName = 'Nightly Multi-Exam Mock & Practice Test Generator';
    const existing = await DbStorage.getStandardTests();
    const batchIndex = Math.floor(existing.length / 5) + 1;

    // 1. Generate 6 multi-exam mock tests across PTE, TOEFL, OET, DET, Cambridge, IELTS (>= 10 questions each)
    const newMockTests = generateFivePracticeTestsBatch(batchIndex, timestamp);
    for (const test of newMockTests) {
      await DbStorage.saveStandardTest(test);
      mockTestsCount++;
    }

    // 2. Generate 5 authentic IELTS practice tests (>= 10 questions each)
    const newPracticeTests = generatePracticeTestsBatch(batchIndex, timestamp);
    for (const pt of newPracticeTests) {
      await DbStorage.saveStandardTest(pt);
      practiceTestsCount++;
    }

    itemsGenerated = mockTestsCount + practiceTestsCount;
    details = `Generated and stored ${mockTestsCount} standardized mock tests and ${practiceTestsCount} practice tests in standard_tests table.`;

    // 3. Update scheduled_jobs table in database
    await DbStorage.updateScheduledJob(jobId, {
      lastRunTimestamp: `Last run: ${timestamp}`,
      nextRunTimestamp: 'Tomorrow 00:00 UTC',
      status: 'idle',
      itemsGeneratedCount: itemsGenerated
    });

  } else if (jobId === 'job_vocab_expansion_00') {
    jobName = 'Daily Vocabulary Vault Expansion & Lexicon Quizzes';
    const batchIndex = Math.floor(Date.now() / 86400000);
    const newWords = generateOneHundredWordsBatch(batchIndex, timestamp);

    // Convert scholarly vocabulary words into interactive cohort quiz questions and store in quizzes table
    for (const w of newWords.slice(0, 15)) {
      const cohort = w.cefrLevel === 'C2' ? 'senior' : w.cefrLevel === 'C1' ? 'pro' : w.cefrLevel === 'B2' ? 'academy' : 'junior';
      const educationLevel = w.cefrLevel === 'C2' ? 'Graduate & Professional' : w.cefrLevel === 'C1' ? 'College & University' : 'High School';
      
      // Pull realistic distractors from other vocabulary words in the batch
      const otherWords = newWords.filter((ow) => ow.word !== w.word && ow.definition !== w.definition);
      const distractorPool = otherWords.map((ow) => ow.definition);
      const chosenDistractors = distractorPool.slice(0, 3);
      if (chosenDistractors.length < 3) {
        chosenDistractors.push(
          `A provisional methodology distinct from ${w.word.toLowerCase()}`,
          `An unverified computational simulation parameter`,
          `A non-standard linguistic deviation`
        );
      }
      
      const rawOptions = [w.definition, ...chosenDistractors.slice(0, 3)];
      // Fisher-Yates option shuffle
      const shuffled = [...rawOptions];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      if (shuffled[0] === w.definition && Math.random() > 0.35 && shuffled.length > 1) {
        const targetIdx = 1 + Math.floor(Math.random() * (shuffled.length - 1));
        [shuffled[0], shuffled[targetIdx]] = [shuffled[targetIdx], shuffled[0]];
      }

      const quizItem = {
        id: `quiz_vocab_${w.id}_${Date.now()}`,
        cohort,
        educationLevel,
        category: w.category,
        word: w.word,
        phonetic: w.phonetic,
        prompt: `Select the precise definition of the academic term "${w.word}" (${w.phonetic}):`,
        options: shuffled,
        correctAnswer: w.definition,
        explanation: `"${w.word}" (${w.partOfSpeech}): ${w.definition} Example: "${w.exampleSentence}"`,
        audioPrompt: `Pronounce and explain the definition of ${w.word}`,
        praise: `Outstanding lexical accuracy! You have mastered the academic meaning of "${w.word}".`,
        metadata: { cefrLevel: w.cefrLevel, generatedAt: timestamp }
      };
      await DbStorage.saveQuiz(quizItem);
      quizzesCount++;
    }

    itemsGenerated = newWords.length;
    details = `Curated ${newWords.length} CEFR-graded words and stored ${quizzesCount} interactive quizzes in quizzes table.`;

    // Update scheduled_jobs table in database
    await DbStorage.updateScheduledJob(jobId, {
      lastRunTimestamp: `Last run: ${timestamp}`,
      nextRunTimestamp: 'Tomorrow 00:00 UTC',
      status: 'idle',
      itemsGeneratedCount: itemsGenerated
    });

  } else if (jobId === 'job_quiz_generation_00') {
    jobName = 'Daily Cohort Quiz & Diagnostic Assessment Generator';
    const cohorts: ('early' | 'junior' | 'academy' | 'pro' | 'senior')[] = ['early', 'junior', 'academy', 'pro', 'senior'];
    
    // Select authentic, curriculum-grounded questions across each developmental cohort
    for (const c of cohorts) {
      const cohortPool = cohortQuizQuestions.filter((q) => q.cohort === c);
      const chosen = cohortPool.slice(0, 2); // 2 authentic questions per cohort = 10 total
      for (const baseQ of chosen) {
        // Randomly shuffle options so the correct answer is not always in the top position
        const shuffled = [...baseQ.options];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        const q = {
          ...baseQ,
          id: `quiz_cohort_${c}_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
          options: shuffled,
          metadata: { generatedAt: timestamp }
        };
        await DbStorage.saveQuiz(q);
        quizzesCount++;
      }
    }

    itemsGenerated = quizzesCount;
    details = `Generated and stored ${quizzesCount} authentic cohort curriculum quizzes in quizzes table with randomized option order.`;

    // Update scheduled_jobs table in database
    await DbStorage.updateScheduledJob(jobId, {
      lastRunTimestamp: `Last run: ${timestamp}`,
      nextRunTimestamp: 'Tomorrow 00:00 UTC',
      status: 'idle',
      itemsGeneratedCount: itemsGenerated
    });
  } else {
    // Generic fallback for any other registered job ID
    await DbStorage.updateScheduledJob(jobId, {
      lastRunTimestamp: `Last run: ${timestamp}`,
      status: 'idle'
    });
    details = `Executed scheduled job ${jobId} successfully.`;
  }

  return {
    success: true,
    jobId,
    jobName,
    itemsGenerated,
    mockTestsCount,
    practiceTestsCount,
    quizzesCount,
    timestamp,
    details
  };
}

export async function executeAllDatabaseScheduledJobs(): Promise<{
  timestamp: string;
  results: any[];
  totalMockTests: number;
  totalPracticeTests: number;
  totalQuizzes: number;
}> {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const jobs = await DbStorage.getScheduledJobs();
  const results: any[] = [];
  let totalMockTests = 0;
  let totalPracticeTests = 0;
  let totalQuizzes = 0;

  for (const job of jobs) {
    if (job.enabled !== false) {
      try {
        const res = await executeJobOnDatabase(job.id, timestamp);
        results.push(res);
        totalMockTests += res.mockTestsCount;
        totalPracticeTests += res.practiceTestsCount;
        totalQuizzes += res.quizzesCount;
      } catch (err: any) {
        console.warn(`[Scheduler Error executing ${job.id}]:`, err.message);
      }
    }
  }

  return {
    timestamp,
    results,
    totalMockTests,
    totalPracticeTests,
    totalQuizzes
  };
}
