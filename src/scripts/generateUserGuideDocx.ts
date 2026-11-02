import fs from 'fs';
import path from 'path';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  ImageRun,
  HeadingLevel,
  WidthType,
  AlignmentType,
  BorderStyle,
  PageBreak
} from 'docx';

function createHeading1(text: string): Paragraph {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 180 }
  });
}

function createHeading2(text: string): Paragraph {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 }
  });
}

function createHeading3(text: string): Paragraph {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 80 }
  });
}

function createParagraph(text: string, bold = false): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold,
        size: 22, // 11pt
        font: 'Calibri'
      })
    ],
    spacing: { after: 120, line: 276 }
  });
}

function createBullet(text: string, boldPrefix?: string): Paragraph {
  const children: TextRun[] = [];
  if (boldPrefix) {
    children.push(new TextRun({ text: boldPrefix + ' ', bold: true, size: 22, font: 'Calibri' }));
  }
  children.push(new TextRun({ text, size: 22, font: 'Calibri' }));

  return new Paragraph({
    children,
    bullet: { level: 0 },
    spacing: { after: 80, line: 260 }
  });
}

function createCallout(title: string, text: string, color = '4F46E5'): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      left: { style: BorderStyle.SINGLE, size: 24, color: color },
      right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            margins: { top: 120, bottom: 120, left: 160, right: 160 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: title,
                    bold: true,
                    size: 22,
                    color: color,
                    font: 'Calibri'
                  })
                ],
                spacing: { after: 60 }
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: text,
                    size: 20,
                    font: 'Calibri',
                    color: '334155'
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
}

function tryLoadImage(imageRelativePath: string): Paragraph | null {
  try {
    const fullPath = path.join(process.cwd(), imageRelativePath);
    if (fs.existsSync(fullPath)) {
      const imgBuffer = fs.readFileSync(fullPath);
      return new Paragraph({
        children: [
          new ImageRun({
            data: imgBuffer,
            transformation: {
              width: 580,
              height: 326
            }
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 140, after: 140 }
      });
    }
  } catch (e) {
    console.warn('Could not load image: ' + imageRelativePath);
  }
  return null;
}

export async function buildUserGuideDocx() {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // TITLE / COVER PAGE
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 720, after: 180 },
            children: [
              new TextRun({
                text: 'EduBridge Global Learning Platform',
                size: 48,
                bold: true,
                color: '1E1B4B',
                font: 'Calibri'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 240 },
            children: [
              new TextRun({
                text: 'Comprehensive Multi-Role & Age-Cohort User Guide',
                size: 28,
                bold: true,
                color: '4F46E5',
                font: 'Calibri'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 480 },
            children: [
              new TextRun({
                text: 'End-to-End Operational Manual for Students (Organized by Age Cohort), Parents, Teachers, and Administrators',
                size: 22,
                italics: true,
                color: '64748B',
                font: 'Calibri'
              })
            ]
          }),

          createCallout(
            'Core Architectural Mandate: Automated Date-of-Birth (DOB) Content Gating',
            'All educational materials, quizzes, question banks, practice tests, and standardized exams are dynamically filtered according to the user role, exact calculated age from Date of Birth (DOB), and developmental cohort. Standardized adult examinations (IELTS, PTE, TOEFL, OET, GRE) are strictly protected and separated from young children (Ages 5–8) to ensure complete developmental appropriateness and child safety.',
            '059669'
          ),

          new Paragraph({ spacing: { before: 360, after: 120 } }),

          // TABLE OF CONTENTS OVERVIEW TABLE
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Section', bold: true, size: 22 })] })]
                  }),
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Target Audience / Role', bold: true, size: 22 })] })]
                  }),
                  new TableCell({
                    width: { size: 40, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Key Modules & Core Capabilities', bold: true, size: 22 })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Part I', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Student Role (Age 5–8)' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Little Explorers: Phonics, Picture Words, Rhymes, Fun Star Quizzes, Adult Exam Shielding' })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Part I (Cont.)', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Student Role (Age 9–14)' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Junior Scholars: STEM Quests, Mental Math Logic, Vocabulary Builder, Daily Study Schedule' })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Part I (Cont.)', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Student Role (Age 15–24)' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Academy Scholars: IELTS/PTE 1,100+ Tests, Universal STEM Problem Solver, AI Tutor, Writing Isolation' })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Part I (Cont.)', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Student Role (Age 25–54)' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Professional Fluency: Email Diplomacy Analyzer, 60s Pitch Monitor, Resume Builder, Career Advisor' })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Part I (Cont.)', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Student Role (Age 55+)' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Golden Age & Lifelong: Memory Retention Gym, Reflective Journaling, Scam Defense, 0.82x Slow Audio' })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Part II', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Parent Role' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Child Oversight Dashboard, Study Hour Analytics, Category Balance, Screen Time Slider, Certificates' })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Part III', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Teacher Role' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Classroom Directorate, Assignment Dispatch, Item Master Question Authoring, Student Diagnostics' })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Part IV', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Administrator Role' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Identity & RBAC, DOB Cohort Recalculation, Age Groups & Content Rules, Test Config, Cron Jobs, Telemetry' })] })] })
                ]
              })
            ]
          }),

          new Paragraph({ children: [new PageBreak()] }),

          // ==========================================
          // PART I: STUDENT USER GUIDE BY AGE COHORT
          // ==========================================
          createHeading1('Part I: Student User Guide (Organized by Age Cohort)'),
          createParagraph(
            'EduBridge delivers a tailored, developmentally appropriate experience for every student. Rather than presenting a generic interface, the platform reads the student\'s verified Date of Birth (DOB) and automatically adapts navigation menus, language complexity, visual components, question banks, and assessment rigor across five distinct age tiers.'
          ),

          // ----------------------------------------------------
          // COHORT 1: LITTLE EXPLORERS (AGES 5–8)
          // ----------------------------------------------------
          createHeading2('1. Little Explorers (Ages 5–8 / Early Childhood & Phonics)'),
          createParagraph(
            'For children aged 5 to 8, EduBridge activates a joyful, touch-friendly Montessori learning mode with big colorful buttons, friendly cartoon animal mascots, voice cheerleading, and zero negative stress.'
          ),
          createCallout(
            'Child Safety Gating Protocol',
            'Little Explorers are strictly shielded from graduate-level exams, university essays, and complex academic articles. Adult test tabs (IELTS, PTE, TOEFL, OET, GRE) are locked with an age safeguard notice. Children are presented exclusively with early phonics, sight word matching, rhyme puzzles, and picture story adventures.',
            'D97706'
          ),
          new Paragraph({ spacing: { after: 120 } }),

          createHeading3('Step-by-Step Instructions for Little Explorers:'),
          createBullet('Log into EduBridge with your student username and password. The interface automatically opens in Kid Mode with large icons and bright colors.', 'Step 1: Welcome Screen ·'),
          createBullet('Look at your first-page Activity Board. Click the big green "🌟 Star" or "Start Adventure" button to begin your first daily game.', 'Step 2: Start Daily Adventure ·'),
          createBullet('In the "Early Primary Assessment Arena", listen to the sound of each letter or look at the picture (e.g. 🐱 Cat, 🌟 Star).', 'Step 3: Phonics & Picture Challenges ·'),
          createBullet('Tap your answer from the 4 big colorful buttons. When you answer correctly, colorful confetti bursts and a happy chime plays!', 'Step 4: Tap Your Answer ·'),
          createBullet('Every correct answer awards +15 XP and adds a shiny Star to your Trophy Box. Open the Trophy Box anytime to see all your collected badges!', 'Step 5: Collect Stars & Badges ·'),

          tryLoadImage('Documentation/screenshots/student_20_trophy_box_badges.png') || new Paragraph({}),

          // ----------------------------------------------------
          // COHORT 2: JUNIOR SCHOLARS (AGES 9–14)
          // ----------------------------------------------------
          createHeading2('2. Junior Scholars (Ages 9–14 / Elementary & Middle School)'),
          createParagraph(
            'Junior scholars engage with an inquiry-based science, math, and reading curriculum designed to stimulate natural curiosity and build rock-solid foundational academic fluency.'
          ),
          createHeading3('Key Capabilities & Step-by-Step Instructions:'),
          createBullet('Navigate to the "🔬 Science & Math Fun" tab to explore biology, solar system astronomy, force and motion physics, and mental arithmetic shortcuts.', 'Interactive STEM Quests ·'),
          createBullet('Access the "⭐ Fun Word Quiz" tab. Learn 10 new English words every day with phonetic pronunciations, CEFR A1–B1 definitions, and example sentences.', 'Vocabulary Mastery Quizzes ·'),
          createBullet('Complete reading foundation challenges with short, engaging passages followed by multiple-choice comprehension questions that test main ideas and inferences.', 'Junior Reading Practice ·'),
          createBullet('Use the "📅 Daily Schedule" tab to check off homework tasks, set a 20-minute study goal, and maintain an active Day Streak counter.', 'Study Planner & Day Streaks ·'),

          tryLoadImage('Documentation/screenshots/student_18_day_streak.png') || new Paragraph({}),

          // ----------------------------------------------------
          // COHORT 3: ACADEMY SCHOLARS (AGES 15–24)
          // ----------------------------------------------------
          createHeading2('3. Academy Scholars (Ages 15–24 / High School & College Prep)'),
          createParagraph(
            'Academy scholars prepare for high-stakes university admissions and international language proficiency certifications. EduBridge provides an enterprise testing engine loaded with 1,100+ standardized practice tests.'
          ),
          createHeading3('Key Capabilities & Step-by-Step Instructions:'),
          createBullet('Navigate to "Exam Prep (IELTS/PTE)". Select your target examination: IELTS Academic, IELTS General Training, PTE, TOEFL, OET, or Cambridge English.', 'Standardized Test Hub ·'),
          createBullet('Select between Listening, Reading, Writing, and Speaking modules. Filter tests by difficulty (Foundation, Standard, Advanced) or use adaptive cohort filtering.', '1,100+ Practice Tests ·'),
          createBullet('Attempt practice questions using the intuitive question stepper. Options are automatically shuffled so the correct answer never stays at index 0. Upon completion, the attempted test automatically moves to the end of the bank so a fresh test appears next time.', 'Dynamic Option Shuffling & Cycling ·'),
          createBullet('Writing practice tests feature strictly 1 targeted essay prompt (zero MCQs). Type your response in the real-time word counter editor and receive instant AI band score evaluation against official criteria (Task Response, Coherence & Cohesion, Lexical Resource, Grammatical Accuracy).', 'Dedicated Writing Isolation ·'),
          createBullet('AspireFree Deliberate Practice Suite: Drill difficult True/False/Not Given logic exercises, inject Band 9 academic essay templates, and practice 60-second Speaking Cue Cards with audio recording.', 'Deliberate Practice Tools ·'),
          createBullet('Universal STEM Problem Solver: Enter any math equation (quadratic roots, derivatives, integrals, factoring), physics formula, or chemistry equation. Receive step-by-step solutions with graph plots, human-like clarification chat, and spoken audio explanations.', 'AI STEM Solver & Classroom ·'),

          tryLoadImage('Documentation/screenshots/student_03_exam_prep_practice_tests.png') || new Paragraph({}),

          // ----------------------------------------------------
          // COHORT 4: PROFESSIONAL FLUENCY (AGES 25–54)
          // ----------------------------------------------------
          createHeading2('4. Professional & Career Fluency (Ages 25–54 / Workplace & Executive)'),
          createParagraph(
            'Working professionals utilize EduBridge to elevate business English, master cross-cultural communication, prepare executive presentations, and build high-impact resumes.'
          ),
          createHeading3('Key Capabilities & Step-by-Step Instructions:'),
          createBullet('Practice real-world workplace communication scenarios: negotiating deadlines, pushing back politely on scope creep, and drafting executive C-suite status briefings.', 'Executive Email Diplomacy Analyzer ·'),
          createBullet('Use the interactive audio microphone to deliver a 60-second elevator pitch. The system evaluates speaking rate (optimal: 130–150 wpm), pauses, and clarity.', '60-Second Elevator Pitch Monitor ·'),
          createBullet('Navigate to "💼 Future Dreams / Career & Portfolio". Craft an ATS-optimized professional resume with verified cryptographic EduBridge credentials and export to Markdown or PDF.', 'Interactive Resume Builder ·'),
          createBullet('Consult the Llama 3.3 AI Career Strategist to analyze industry demand, project roadmaps, and open-source portfolio artifacts that provide a competitive hiring advantage.', 'AI Career Roadmap Strategist ·'),

          tryLoadImage('Documentation/screenshots/student_08_career_roadmap_detail.png') || new Paragraph({}),

          // ----------------------------------------------------
          // COHORT 5: GOLDEN AGE & LIFELONG (AGES 55+)
          // ----------------------------------------------------
          createHeading2('5. Golden Age & Lifelong Learning (Ages 55+ / Seniors & Active Minds)'),
          createParagraph(
            'EduBridge supports active neuroplasticity and cognitive wellness for seniors through calm, errorless learning, life story journaling, and everyday digital safety defense.'
          ),
          createHeading3('Key Capabilities & Step-by-Step Instructions:'),
          createBullet('Engage in gentle word association and memory recall pairs without time limits, penalizing alarms, or stress countdowns.', 'Cognitive Memory Retention Gym ·'),
          createBullet('Answer inspiring reflective prompts (e.g. "Describe your favorite childhood hometown memory") with spoken audio transcription and personal story archiving.', 'Reflective Reminiscence Journaling ·'),
          createBullet('Learn to identify phishing emails, fake bank SMS alerts, and suspicious websites in a safe, interactive simulated sandbox with step-by-step red flag guidance.', 'Everyday Digital Scam Defense ·'),
          createBullet('Activate the 0.82x calm speech listening setting for soothing, crystal-clear audio narration across all learning modules.', 'Calm Adaptive Audio Pacing ·'),

          new Paragraph({ children: [new PageBreak()] }),

          // ==========================================
          // PART II: PARENT USER GUIDE
          // ==========================================
          createHeading1('Part II: Parent User Guide (Oversight & Family Settings)'),
          createParagraph(
            'The Parent Portal gives parents full visibility and constructive control over their children\'s educational journey without invading their sense of autonomy.'
          ),

          createHeading2('1. Child Overview & Real-Time Activity Monitoring'),
          createBullet('Log into EduBridge with your registered Parent credentials. The Parent Portal opens directly to the family dashboard.', 'Accessing Parent Portal ·'),
          createBullet('Toggle between children (if multiple accounts are linked) using the selector tabs at the top of the interface.', 'Multi-Child Switching ·'),
          createBullet('Inspect Weekly Study Hours completed versus the target goal (e.g. 8.5 / 10 hours) and view total XP earned this week.', 'Weekly Study Hours ·'),
          createBullet('Review the chronological activity stream detailing recent tests, quizzes, and lessons completed by your child with real timestamps.', 'Real-Time Activity Feed ·'),

          createHeading2('2. Learning Focus & Category Balance Analytics'),
          createParagraph(
            'The Category Focus bar visually graphs how your child spends their study time across five key areas: Standardized Exams, Language Lessons, STEM Problem Solving, Vocabulary Quizzes, and Future Career Skills.'
          ),
          createCallout(
            'Parental Pedagogical Insight',
            'If you notice your child spending 80% of their time solely on vocabulary quizzes and ignoring STEM lessons, EduBridge automatically generates personalized parent advice recommending balanced engagement activities.',
            '4F46E5'
          ),

          createHeading2('3. Screen Time & Device Governance Controls'),
          createBullet('Use the interactive Daily Screen Time slider to set a healthy daily study ceiling (e.g. 45 minutes for children aged 5–8, 90 minutes for teens).', 'Setting Screen Time Limits ·'),
          createBullet('Configure Bedtime Quiet Hours: EduBridge automatically dims notifications and pauses gaming modules after 8:30 PM on school nights.', 'Bedtime Protection Mode ·'),
          createBullet('Enable or disable email digests: Receive daily or weekly PDF summaries of your child\'s achievements, streak milestones, and areas where they might need encouragement.', 'Notification Preferences ·'),

          createHeading2('4. Milestone Verification & Certificates'),
          createBullet('View verified certificates earned by your child upon completing course units or reaching milestone streaks.', 'Certificate Inspection ·'),
          createBullet('Each certificate includes a unique cryptographic verification hash (e.g. "EB-VERIFIED-7A89F1") that can be independently authenticated.', 'Credential Authenticity ·'),

          tryLoadImage('Documentation/screenshots/parent_01_overview_dashboard.png') || new Paragraph({}),

          new Paragraph({ children: [new PageBreak()] }),

          // ==========================================
          // PART III: TEACHER USER GUIDE
          // ==========================================
          createHeading1('Part III: Teacher User Guide (Curriculum & Assessments)'),
          createParagraph(
            'The Educator Directorate provides classroom teachers and academic instructors with comprehensive tools to author curriculum, dispatch assignments, manage question banks, and analyze student diagnostics.'
          ),

          createHeading2('1. Classroom Directorate & Course Assignments'),
          createBullet('Log in with your Teacher credentials to access the educator dashboard.', 'Educator Access ·'),
          createBullet('Review all active classroom assignments (e.g. "IELTS Academic Writing Task 2", "Organic Chemistry Reaction Balancing", "Advanced Phonics Drill").', 'Assignment Oversight ·'),
          createBullet('Inspect student submission rates (e.g. 24/28 submitted), class average scores, and assignment statuses (Active, Graded, Draft).', 'Submission Analytics ·'),
          createBullet('Click "Create New Assignment" to author a new test, set due dates, assign target student cohorts, and specify passing grade criteria.', 'Assignment Authoring ·'),

          createHeading2('2. Item Master & Question Bank Directorate'),
          createParagraph(
            'Teachers possess full authority to maintain, expand, and calibrate the central Item Master question bank across all academic subjects.'
          ),
          createBullet('Filter question bank items by Subject (English, Mathematics, Physics, Chemistry, Biology) and Difficulty (Easy, Medium, Hard).', 'Question Bank Filtering ·'),
          createBullet('Inspect question types: Multiple Choice (with randomized option shuffling), Long-Form Essay, Scientific Code, and Oral Speaking Cue Cards.', 'Question Type Variety ·'),
          createBullet('Click "Add New Question" to author custom questions with model answers, pedagogical explanation rationales, and grading rubrics.', 'Authoring Questions ·'),

          tryLoadImage('Documentation/screenshots/teacher_01_assignments_and_question_bank.png') || new Paragraph({}),

          new Paragraph({ children: [new PageBreak()] }),

          // ==========================================
          // PART IV: ADMINISTRATOR USER GUIDE
          // ==========================================
          createHeading1('Part IV: Administrator User Guide (Governance & Telemetry)'),
          createParagraph(
            'The EduBridge Enterprise Administrator Cluster provides end-to-end governance over identity management, role-based access control, date-of-birth cohort synchronization, curriculum rules, automated cron jobs, and local AI model inference.'
          ),

          createHeading2('1. Executive Administrator Dashboard & Activity Analytics'),
          createBullet('The first page of the Admin Portal displays real-time platform metrics across all four user roles (Admin, Teacher, Parent, Student).', 'First-Page Cockpit ·'),
          createBullet('Inspect the Proportional Learning Distribution Bar showing real-time engagement across Exams, Lessons, Solver, Quizzes, STEM, and Administrative actions.', 'Category Analytics ·'),
          createBullet('7-Day Trend Chart dynamically graphs platform activity counts across the past week derived from real user activity logs.', '7-Day Activity Trends ·'),

          createHeading2('2. User Identity & RBAC Management'),
          createBullet('Navigate to "User Accounts" to view all registered users stored in local JSON format.', 'User Directory ·'),
          createBullet('Search accounts by Name, Username, Email, or assigned Role.', 'Multi-Field Search ·'),
          createBullet('Click "Create New User" to register new accounts. Provide legal full name, unique username, email, encrypted password, and Date of Birth (DOB).', 'Account Provisioning ·'),
          createBullet('Edit Credentials & DOB: Modify passwords, email addresses, and Date of Birth. When DOB is changed, EduBridge automatically recalculates the user\'s age cohort and education level.', 'DOB Cohort Recalculation ·'),
          createBullet('Toggle Status: Instantly switch any account between "Active" and "Suspended" with a single click.', 'Account Suspension Toggle ·'),

          createHeading2('3. Age Groups & Curriculum Content Governance Rules'),
          createParagraph(
            'Administrators define and maintain the rules governing content availability across all five age cohorts.'
          ),
          createBullet('Navigate to the "Age Groups & Content Rules" tab in the Admin Portal.', 'Accessing Cohort Rules ·'),
          createBullet('Review the 5 developmental cohorts: Little Explorers (Ages 5–8), Junior Scholars (Ages 9–14), Academy (Ages 15–24), Professional Fluency (Ages 25–54), and Golden Age (Ages 55+).', 'Cohort Definitions ·'),
          createBullet('Adult Standardized Exam Gating: Toggle the adult exam restriction switch. For young children (Ages 5–8 and 9–14), adult exams remain "Locked (Safeguarded)" so no child ever encounters university-level IELTS/PTE exams.', 'Adult Exam Gating ·'),
          createBullet('Set Difficulty Ceilings: Assign maximum difficulty thresholds (Foundation, Standard, Advanced) and permitted subject categories per cohort.', 'Difficulty Ceilings ·'),
          createBullet('Click "Save & Enforce Content Rules" to apply changes globally across all Student, Parent, and Teacher interfaces. This action automatically logs an immutable administrative record with an exact timestamp.', 'Global Rule Enforcement ·'),

          createHeading2('4. Standardized Practice Test Question Configurator'),
          createBullet('Configure the required number of questions per practice test: Select 5, 10, 15, 20, or 25 questions.', 'Questions Per Test ·'),
          createBullet('Automated MCQ Option Shuffling is permanently enabled to ensure the correct answer is dynamically randomized and never remains at index 0.', 'Option Shuffling Enforcement ·'),
          createBullet('Writing tests are strictly enforced at 1 targeted prompt per practice session with zero MCQ options and official Band 9 exemplar answers.', 'Writing Isolation Enforcement ·'),

          createHeading2('5. Scheduled Background Jobs & 00:00 UTC Cron Automation'),
          createBullet('Navigate to "Scheduled Jobs (00:00)" to monitor autonomous background cron workers.', 'Cron Daemon Hub ·'),
          createBullet('Nightly Mock Test Generator (00:00 UTC): Synthesizes at least 5 new authentic IELTS & PTE mock examinations every midnight, complete with timestamps.', 'Automated Exam Synthesis ·'),
          createBullet('Nightly Vocabulary Expansion (00:00 UTC): Generates 100 new CEFR A1–C2 vocabulary words with pronunciations and usage examples every midnight.', 'Vocabulary Vault Expansion ·'),
          createBullet('Trigger Manual Execution: Click "Run Job Now" at any time to run the generator immediately without waiting for midnight.', 'Manual Cron Triggers ·'),

          createHeading2('6. Local Ollama AI Model Governance & Telemetry'),
          createBullet('Manage 4 tiers of local Ollama models: Phi-4 Mini (3.8B), Qwen 3 (8B), DeepSeek R1 (8B), and Llama 3.3 (8B).', 'Local AI Model Tiers ·'),
          createBullet('Monitor online status, latency (ms), parameter size, and allocated VRAM in real time.', 'Model Telemetry ·'),
          createBullet('Tune model temperature sliders (0.0 to 1.0) and toggle standby status without restarting the server.', 'Inference Tuning ·'),
          createBullet('Infrastructure Telemetry: View live CPU, Memory, VRAM, and Disk utilization gauges, active sessions, and execute one-click platform backup exports.', 'System Telemetry ·'),

          tryLoadImage('Documentation/screenshots/admin_01_dashboard_metrics.png') || new Paragraph({}),

          new Paragraph({ spacing: { before: 360 } }),
          createCallout(
            'Document Authentication & Verification',
            'This Comprehensive User Guide is generated and maintained by the EduBridge Engineering Directorate. All documented capabilities reflect the live running application architecture across all roles and developmental cohorts.',
            '1E1B4B'
          )
        ]
      }
    ]
  });

  const outputPath = path.join(process.cwd(), 'Documentation', 'EduBridge_Comprehensive_User_Guide.docx');
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Successfully generated Comprehensive User Guide at: ${outputPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

buildUserGuideDocx().catch((err) => {
  console.error('Failed to generate user guide docx:', err);
  process.exit(1);
});
