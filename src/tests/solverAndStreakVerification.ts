/**
 * Automated Verification Script for Streak Service & AI Question Solver
 */

import { StreakService } from '../services/streakService';
import { QuestionSolverService } from '../services/questionSolverService';
import { OCRService } from '../services/ocrService';
import { SUPPORTED_LANGUAGES } from '../services/speechService';

async function runTests() {
  console.log('=== STARTING EDU BRIDGE VERIFICATION SUITE ===\n');
  let failures = 0;

  // Test 1: Streak Service Day 1 Status
  console.log('Test 1: Verifying Streak Day 1 status is "Closed"...');
  const streakMonth = StreakService.calculateStreakMonth(7, 50, 50);
  const day1Record = streakMonth.daysActivity.find(d => d.isFirstDayOfStreak);
  
  if (streakMonth.firstDayStatus !== 'Closed') {
    console.error(`FAIL: firstDayStatus is ${streakMonth.firstDayStatus}, expected "Closed"`);
    failures++;
  } else {
    console.log(`PASS: firstDayStatus is "${streakMonth.firstDayStatus}"`);
  }

  if (day1Record && day1Record.status !== 'Closed') {
    console.error(`FAIL: day1Record.status is ${day1Record.status}, expected "Closed"`);
    failures++;
  } else {
    console.log(`PASS: day1Record.status is "${day1Record?.status}"`);
  }

  // Test 2: Streak creation with 1 day streak
  console.log('\nTest 2: Verifying new streak (1 day)...');
  const streak1 = StreakService.calculateStreakMonth(1, 40, 50);
  if (streak1.firstDayStatus !== 'Closed') {
    console.error(`FAIL: 1-day streak firstDayStatus is ${streak1.firstDayStatus}, expected "Closed"`);
    failures++;
  } else {
    console.log(`PASS: 1-day streak firstDayStatus is "${streak1.firstDayStatus}"`);
  }

  // Test 3: Math Question Solving
  console.log('\nTest 3: Testing Math Solver (Linear Equation)...');
  const mathRes = await QuestionSolverService.solveQuestion('Solve for x: 2x + 5 = 15', 'keyboard');
  if (mathRes.subject !== 'Mathematics' || !mathRes.finalAnswer.includes('5')) {
    console.error(`FAIL: Math solver returned subject ${mathRes.subject}, answer: ${mathRes.finalAnswer}`);
    failures++;
  } else {
    console.log(`PASS: Math solver identified ${mathRes.subject}, answer: ${mathRes.finalAnswer}`);
  }

  // Test 4: Physics Question Solving
  console.log('\nTest 4: Testing Physics Solver (Newton Second Law)...');
  const physRes = await QuestionSolverService.solveQuestion('Calculate the net force required to accelerate a 5 kg mass at 3 m/s².', 'keyboard');
  if (physRes.subject !== 'Physics' || !physRes.finalAnswer.includes('F = m')) {
    console.error(`FAIL: Physics solver returned subject ${physRes.subject}, answer: ${physRes.finalAnswer}`);
    failures++;
  } else {
    console.log(`PASS: Physics solver identified ${physRes.subject}, answer: ${physRes.finalAnswer}`);
  }

  // Test 5: Chemistry Question Solving
  console.log('\nTest 5: Testing Chemistry Solver (Reaction Balancing)...');
  const chemRes = await QuestionSolverService.solveQuestion('Balance the chemical reaction: H2 + O2 -> H2O', 'keyboard');
  if (chemRes.subject !== 'Chemistry' || !chemRes.finalAnswer.includes('2H₂ + O₂ → 2H₂O')) {
    console.error(`FAIL: Chemistry solver returned subject ${chemRes.subject}, answer: ${chemRes.finalAnswer}`);
    failures++;
  } else {
    console.log(`PASS: Chemistry solver identified ${chemRes.subject}, answer: ${chemRes.finalAnswer}`);
  }

  // Test 6: Ambiguity Detection
  console.log('\nTest 6: Testing Ambiguity Detection & Clarification...');
  const ambRes = await QuestionSolverService.solveQuestion('Find the roots', 'keyboard');
  if (!ambRes.isAmbiguous || !ambRes.clarificationPrompt) {
    console.error('FAIL: Expected ambiguous response with clarification prompt');
    failures++;
  } else {
    console.log(`PASS: Ambiguity caught. Clarification: "${ambRes.clarificationPrompt}"`);
  }

  // Test 7: Multilingual Speech Support
  console.log('\nTest 7: Verifying Supported Languages for Speech...');
  if (SUPPORTED_LANGUAGES.length < 10) {
    console.error('FAIL: Expected at least 10 supported speech languages');
    failures++;
  } else {
    console.log(`PASS: ${SUPPORTED_LANGUAGES.length} speech languages supported.`);
  }

  // Test 8: Essay Writing with Typo ("write an eassy on my friend") & Full Text Output
  console.log('\nTest 8: Testing Essay Request ("write an eassy on my friend")...');
  const essayRes = await QuestionSolverService.solveQuestion('write an eassy on my friend', 'keyboard');
  if (essayRes.subject !== 'Essay Writing') {
    console.error(`FAIL: Expected subject "Essay Writing", received "${essayRes.subject}"`);
    failures++;
  } else {
    console.log(`PASS: Identified as subject "${essayRes.subject}", topic "${essayRes.topic}"`);
  }

  if (!essayRes.finalAnswer.includes('Friendship') || !essayRes.finalAnswer.includes('best friend') || essayRes.finalAnswer.length < 300) {
    console.error(`FAIL: Expected complete essay text (>300 chars), received length ${essayRes.finalAnswer.length}`);
    failures++;
  } else {
    console.log(`PASS: Complete full-text essay generated (${essayRes.finalAnswer.length} characters with full paragraphs).`);
  }

  console.log(`\n=== VERIFICATION COMPLETE: ${failures === 0 ? 'ALL TESTS PASSED' : failures + ' TESTS FAILED'} ===`);
  if (failures > 0) process.exit(1);
}

runTests();

