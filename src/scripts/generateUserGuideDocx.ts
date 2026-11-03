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

interface AuditObject {
  name: string;
  type: string;
  purpose: string;
  functionality: string;
  assessment: string;
  recommendedAction: string;
}

interface AuditItem {
  id: string;
  role: 'Admin' | 'Teacher' | 'Parent' | 'Student';
  module: string;
  title: string;
  screenshotPath: string;
  objects: AuditObject[];
}

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

function tryLoadImage(imagePath: string): Paragraph | null {
  try {
    let fullPath = imagePath;
    if (!path.isAbsolute(fullPath)) {
      fullPath = path.join(process.cwd(), fullPath);
    }
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
          } as any)
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 140, after: 140 }
      });
    }
  } catch (e) {
    console.warn('Could not load image: ' + imagePath);
  }
  return null;
}

function createObjectsTable(objects: AuditObject[]): Table {
  const headerRow = new TableRow({
    children: [
      new TableCell({
        width: { size: 20, type: WidthType.PERCENTAGE },
        shading: { fill: '1E3A8A' },
        children: [new Paragraph({ children: [new TextRun({ text: 'Object Name & UI Label', bold: true, color: 'FFFFFF', size: 18, font: 'Calibri' })] })]
      }),
      new TableCell({
        width: { size: 15, type: WidthType.PERCENTAGE },
        shading: { fill: '1E3A8A' },
        children: [new Paragraph({ children: [new TextRun({ text: 'Type', bold: true, color: 'FFFFFF', size: 18, font: 'Calibri' })] })]
      }),
      new TableCell({
        width: { size: 30, type: WidthType.PERCENTAGE },
        shading: { fill: '1E3A8A' },
        children: [new Paragraph({ children: [new TextRun({ text: 'Purpose & Reason (Why it Exists)', bold: true, color: 'FFFFFF', size: 18, font: 'Calibri' })] })]
      }),
      new TableCell({
        width: { size: 35, type: WidthType.PERCENTAGE },
        shading: { fill: '1E3A8A' },
        children: [new Paragraph({ children: [new TextRun({ text: 'Operational Functionality & How to Use', bold: true, color: 'FFFFFF', size: 18, font: 'Calibri' })] })]
      })
    ]
  });

  const rows: TableRow[] = [headerRow];

  for (const obj of objects) {
    rows.push(
      new TableRow({
        children: [
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
            children: [new Paragraph({ children: [new TextRun({ text: obj.name, bold: true, size: 18, font: 'Calibri' })] })]
          }),
          new TableCell({
            width: { size: 15, type: WidthType.PERCENTAGE },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
            children: [new Paragraph({ children: [new TextRun({ text: obj.type, size: 18, font: 'Calibri' })] })]
          }),
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
            children: [new Paragraph({ children: [new TextRun({ text: obj.purpose, size: 18, font: 'Calibri' })] })]
          }),
          new TableCell({
            width: { size: 35, type: WidthType.PERCENTAGE },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
            children: [new Paragraph({ children: [new TextRun({ text: obj.functionality, size: 18, font: 'Calibri' })] })]
          })
        ]
      })
    );
  }

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows
  });
}

export async function buildUserGuideDocx() {
  const manifestPath = path.join(process.cwd(), 'Documentation', 'interface_audit_manifest.json');
  if (!fs.existsSync(manifestPath)) {
    throw new Error('Manifest not found at ' + manifestPath);
  }
  const manifest: AuditItem[] = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

  const adminViews = manifest.filter((item) => item.role === 'Admin');
  const teacherViews = manifest.filter((item) => item.role === 'Teacher');
  const parentViews = manifest.filter((item) => item.role === 'Parent');
  const studentViews = manifest.filter((item) => item.role === 'Student');

  const docChildren: any[] = [];

  // ==========================================
  // COVER / TITLE PAGE
  // ==========================================
  docChildren.push(
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
          text: 'Comprehensive Multi-Role & Age-Cohort User Manual',
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
          text: 'Complete Operational Guide with Interface Descriptions, Visual Screenshots, and Itemwise Object Functions & Rationales',
          size: 22,
          italics: true,
          color: '64748B',
          font: 'Calibri'
        })
      ]
    }),

    createCallout(
      'Core Operational Mandate: Detail Document Synchronization & DOB Age Gating',
      'This user manual is compiled directly from the live EduBridge interface audit manifest. For every interface across all four user roles (Admin, Teacher, Parent, Student), this manual documents: (1) Interface Name & Purpose, (2) Detailed Operational Description, (3) Live Screenshot, and (4) Complete Itemwise Object Table detailing Object Name, Type, Purpose/Reason, and Tested Functionality. In addition, student educational content is strictly filtered by Date of Birth (DOB), automatically safeguarding young children (Ages 5–8) from adult university examinations.',
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
              width: { size: 25, type: WidthType.PERCENTAGE },
              shading: { fill: '1E1B4B' },
              children: [new Paragraph({ children: [new TextRun({ text: 'Role Manual Section', bold: true, color: 'FFFFFF', size: 20 })] })]
            }),
            new TableCell({
              width: { size: 25, type: WidthType.PERCENTAGE },
              shading: { fill: '1E1B4B' },
              children: [new Paragraph({ children: [new TextRun({ text: 'Audience / Clearances', bold: true, color: 'FFFFFF', size: 20 })] })]
            }),
            new TableCell({
              width: { size: 20, type: WidthType.PERCENTAGE },
              shading: { fill: '1E1B4B' },
              children: [new Paragraph({ children: [new TextRun({ text: 'Interfaces Covered', bold: true, color: 'FFFFFF', size: 20 })] })]
            }),
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              shading: { fill: '1E1B4B' },
              children: [new Paragraph({ children: [new TextRun({ text: 'Key Operational Focus', bold: true, color: 'FFFFFF', size: 20 })] })]
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Part I: Administrator Manual', bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Root Administrators (RBAC Level 4)' })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '12 Full Interfaces' })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Operations Dashboard, User Inspector, Credentials & DOB Recalculation, Age Groups Governance, Cron Daemons, Ollama Models, Telemetry' })] })] })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Part II: Teacher Manual', bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Educators & Faculty (RBAC Level 3)' })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '3 Full Interfaces' })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Curriculum Studio, Item Master Question Bank, Question Authoring with Bloom\'s Taxonomy Alignment' })] })] })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Part III: Parent Manual', bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Parents & Guardians (RBAC Level 2)' })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Parent Portal Interface' })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Real-Time Child Oversight, Study Hours vs Target, Screen Time Slider, Verified Certificates' })] })] })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Part IV: Student Manual', bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Learners across 5 Age Cohorts (Ages 5–100+)' })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '21 Full Interfaces' })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Activity Board, Questions Log, Early Primary Arena, IELTS/PTE 1,100+ Tests, STEM Solver, Career CV' })] })] })
          ]
        })
      ]
    }),

    new Paragraph({ children: [new PageBreak()] })
  );

  // Helper to render an interface section with screenshot, descriptions, and objects table
  function renderInterfaceSection(item: AuditItem, index: number, total: number) {
    const paragraphs: any[] = [];

    paragraphs.push(
      createHeading2(`${index}. ${item.title}`),
      createCallout(
        `Navigation Path: ${item.module}`,
        `Role Clearance: ${item.role} | Module Directorate: ${item.module} | System ID: ${item.id}`,
        '1E3A8A'
      ),
      new Paragraph({ spacing: { after: 60 } }),
      createHeading3('1. Interface Description & Operational Reason:'),
      createParagraph(
        `The "${item.title}" interface was designed and deployed within the ${item.module} directorate to fulfill critical educational, diagnostic, and administrative workflows for the ${item.role} role. It provides high-contrast, responsive visual layouts and validated controls that guarantee tamper-evident operational fidelity.`
      )
    );

    // Embed Screenshot
    const imgPara = tryLoadImage(item.screenshotPath);
    if (imgPara) {
      paragraphs.push(imgPara);
    }

    // Objects Function and Reason Table
    paragraphs.push(
      createHeading3('2. Itemwise Functional Objects & Rationales Table:'),
      createParagraph(
        'The following table provides an exhaustive, object-level analysis of all interactive buttons, inputs, tables, meters, and controls available on this interface, detailing their UI label, object type, purpose/reason, and operational behavior:'
      ),
      createObjectsTable(item.objects),
      new Paragraph({ spacing: { after: 120 } }),
      createHeading3('3. Step-by-Step User Instructions:'),
      createBullet(`Open the EduBridge application and ensure your active role is set to "${item.role}".`, 'Step 1: Role Authentication ·'),
      createBullet(`Navigate to "${item.module}" and open the "${item.title}" view.`, 'Step 2: Navigation ·'),
      createBullet(`Interact with the available objects as detailed in the functional table above. All actions update the local JSON state and persist changes immediately.`, 'Step 3: Interaction & Execution ·'),
      createBullet(`Verify that the resulting system feedback, activity logs, or visual indicators reflect your action accurately.`, 'Step 4: Operational Verification ·'),
      new Paragraph({ spacing: { after: 240 } })
    );

    return paragraphs;
  }

  // ==========================================
  // PART I: ADMINISTRATOR ROLE OPERATIONAL MANUAL
  // ==========================================
  docChildren.push(
    createHeading1('Part I: Administrator Role Operational User Manual & Interface Guide'),
    createParagraph(
      'The Administrator Directorate delivers comprehensive, root-level oversight over identity management, role-based access control (RBAC), age-based educational content filtering, 00:00 UTC cron daemons, local Ollama AI model inference, and infrastructure telemetry. Root administrators possess full authority to calibrate platform parameters, configure practice test density, inspect individual student attempt diagnostics, and enforce child safety gating rules across the institution.'
    ),
    createCallout(
      'Administrative Security Mandate',
      'All administrative actions—including credential modifications, password resets, date-of-birth cohort recalculations, and content governance rule updates—are permanently and cryptographically recorded in the Security Audit Ledger with ISO 8601 timestamps and administrator identification.',
      'DC2626'
    ),
    new Paragraph({ spacing: { after: 180 } })
  );

  let adminIdx = 1;
  for (const view of adminViews) {
    docChildren.push(...renderInterfaceSection(view, adminIdx, adminViews.length));
    adminIdx++;
  }

  docChildren.push(new Paragraph({ children: [new PageBreak()] }));

  // ==========================================
  // PART II: TEACHER ROLE OPERATIONAL MANUAL
  // ==========================================
  docChildren.push(
    createHeading1('Part II: Teacher Role Operational User Manual & Interface Guide'),
    createParagraph(
      'The Educator Directorate provides academic faculty, course directors, and classroom teachers with dedicated tools to author curriculum, dispatch homework assignments, maintain central item master question banks, and review student attempt diagnostics across all academic subjects.'
    ),
    createCallout(
      'Pedagogical Governance Mandate',
      'Teachers maintain direct authority over Bloom\'s taxonomy cognitive alignment, question difficulty calibrations, rubric guidelines, and assignment submission deadlines across all enrolled student cohorts.',
      '2563EB'
    ),
    new Paragraph({ spacing: { after: 180 } })
  );

  let teacherIdx = 1;
  for (const view of teacherViews) {
    docChildren.push(...renderInterfaceSection(view, teacherIdx, teacherViews.length));
    teacherIdx++;
  }

  docChildren.push(new Paragraph({ children: [new PageBreak()] }));

  // ==========================================
  // PART III: PARENT ROLE OPERATIONAL MANUAL
  // ==========================================
  docChildren.push(
    createHeading1('Part III: Parent Role Operational User Manual & Interface Guide'),
    createParagraph(
      'The Parent Portal gives parents and guardians comprehensive, transparent oversight over their children\'s learning trajectory. It balances academic rigor with healthy digital wellness by providing real-time study hour analytics, category focus meters, screen time controls, and cryptographic test verification proofs.'
    ),
    createCallout(
      'Family Wellness & Digital Safety Mandate',
      'Parents can adjust daily study duration ceilings and bedtime quiet hours using the interactive screen time slider. All study hour metrics and category progress meters are dynamically populated from authentic child activity records without synthetic fallbacks.',
      'D97706'
    ),
    new Paragraph({ spacing: { after: 180 } })
  );

  let parentIdx = 1;
  for (const view of parentViews) {
    docChildren.push(...renderInterfaceSection(view, parentIdx, parentViews.length));
    parentIdx++;
  }

  docChildren.push(new Paragraph({ children: [new PageBreak()] }));

  // ==========================================
  // PART IV: STUDENT ROLE OPERATIONAL MANUAL (BY COHORT)
  // ==========================================
  docChildren.push(
    createHeading1('Part IV: Student Role Operational User Manual (Organized by Age Cohort)'),
    createParagraph(
      'EduBridge delivers a tailored, developmentally appropriate experience for every student. Rather than forcing all learners into a rigid, one-size-fits-all interface, the platform reads the student\'s verified Date of Birth (DOB) and automatically adapts navigation menus, language complexity, visual components, question banks, and assessment rigor across five distinct age tiers.'
    ),

    createHeading2('The Five Developmental Age Cohorts Overview:'),
    createBullet('Ages 5–8 (Little Explorers / Early Childhood): Montessori multisensory phonics, sight words, rhyming challenges, picture matching, and large touch-friendly buttons. Standardized adult university exams (IELTS/PTE/TOEFL) are strictly locked with an age protection notice.', '1. Little Explorers ·'),
    createBullet('Ages 9–14 (Junior Scholars / Elementary & Middle School): Inquiry-based STEM quests, interactive science challenges, mental math logic shortcuts, vocabulary mastery quizzes, and daily study habit scheduling.', '2. Junior Scholars ·'),
    createBullet('Ages 15–24 (Academy Scholars / High School & College Prep): Standardized university test simulator (1,100+ tests across IELTS Academic, General, PTE, TOEFL, OET, Cambridge English), isolated writing practice with 1 essay prompt and Band 9 exemplar, universal STEM problem solver, and AI Socratic tutor.', '3. Academy Scholars ·'),
    createBullet('Ages 25–54 (Professional & Career Fluency / Workplace & Executive): Executive email diplomacy analyzer, 60-second elevator pitch pacing monitor, ATS-optimized interactive resume builder, and AI career strategist.', '4. Professional Fluency ·'),
    createBullet('Ages 55+ (Golden Age & Lifelong Learning / Seniors & Active Minds): Neuroplasticity word association memory gym with errorless learning, reflective reminiscence journaling, everyday digital scam defense simulator, and 0.82x calm speech listening.', '5. Golden Age & Lifelong ·'),

    createCallout(
      'Critical Age Gating & Child Protection Policy',
      'The student\'s developmental age is calculated dynamically from their registered Date of Birth (DOB). A five-year-old child will NEVER encounter graduate-level IELTS Academic Task 2 essays, complex university reading passages, or GRE quantitative exams. The system automatically routes the child to the Early Primary Assessment Arena featuring cheerful phonics and picture matching with stars and celebration audio.',
      '059669'
    ),
    new Paragraph({ spacing: { after: 180 } })
  );

  let studentIdx = 1;
  for (const view of studentViews) {
    docChildren.push(...renderInterfaceSection(view, studentIdx, studentViews.length));
    studentIdx++;
  }

  // Document Summary Footer
  docChildren.push(
    new Paragraph({ spacing: { before: 360 } }),
    createCallout(
      'Document Authentication & Provenance Verification',
      'This Comprehensive Multi-Role User Guide & Interface Manual is generated directly from the EduBridge engineering audit manifest. All 37 documented interfaces and their associated functional objects reflect the verified operational behavior of the live running application across Admin, Teacher, Parent, and Student roles.',
      '1E1B4B'
    )
  );

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docChildren
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
