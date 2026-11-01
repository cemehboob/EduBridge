/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Resume Parser, Regional Converter, and AI Enhancement Service for EduBridge
 */

import {
  CVRegionPattern,
  EnhancedResumeData,
  ResumeExperience,
  AIEnhancementSuggestion,
  CVAuditMetrics,
  PhotoPosition,
  PhotoShape
} from '../types/career';
import { ResumeData } from '../types';

export class ResumeEnhancementService {
  /**
   * Converts existing basic ResumeData into EnhancedResumeData with full regional fields.
   */
  public static initializeEnhancedResume(base: ResumeData): EnhancedResumeData {
    return {
      fullName: base.fullName || 'Alex Rivera',
      headline: base.headline || 'Full-Stack Software Engineer & AI Systems Specialist',
      email: 'alex.rivera@edubridge.org',
      phone: '+44 7700 900123',
      location: 'London, United Kingdom',
      nationality: 'British',
      visaStatus: 'Eligible to work in UK, EU & US',
      linkedin: 'linkedin.com/in/alex-rivera-tech',
      github: 'github.com/alexrivera-ai',
      portfolioUrl: 'https://alexrivera.dev',
      summary: base.summary || 'Motivated technologist and multilingual learner specializing in high-performance web systems and open-source AI infrastructure. Demonstrated expertise in TypeScript, React, PostgreSQL, and Ollama model deployment with a 14-day study streak and verified mastery certifications.',
      targetRegion: 'UK',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      showPhoto: false, // Default false for UK/US anti-bias guidelines, user can toggle on anytime
      photoPosition: 'top-right',
      photoShape: 'circle',
      skills: base.skills && base.skills.length > 0 ? base.skills : [
        'TypeScript', 'React 19', 'Next.js', 'NestJS', 'PostgreSQL 17', 'Docker',
        'Ollama & Open-Source LLMs', 'DeepSeek 8B', 'Tailwind CSS', 'CI/CD Pipelines'
      ],
      experiences: (base.experiences || []).map((exp) => ({
        role: exp.role,
        company: exp.company,
        location: 'Remote / London',
        period: exp.period,
        achievements: exp.achievements
      })),
      education: (base.education || [
        {
          degree: 'B.S. in Computer Science (First Class Honours)',
          institution: 'University of London',
          location: 'London, UK',
          year: '2022 - 2026',
          honors: 'Top 5% Cohort Distinction'
        }
      ]).map(ed => ({
        degree: ed.degree,
        institution: ed.institution,
        location: 'London, UK',
        year: ed.year,
        honors: 'Honours'
      })),
      projects: [
        {
          title: 'EduBridge Universal Learning & AI Problem Solver',
          description: 'Architected offline-first PWA digital classroom featuring self-hosted AI models, OCR canvas, and multi-exam preparation suites.',
          link: 'github.com/alexrivera-ai/edubridge',
          techStack: ['React', 'TypeScript', 'Tailwind', 'Ollama', 'Vite']
        },
        {
          title: 'High-Throughput RAG Pipeline & Semantic Search',
          description: 'Engineered hybrid dense-sparse vector search over 200,000 technical manuals with p95 query latency under 45ms.',
          link: 'github.com/alexrivera-ai/rag-pipeline',
          techStack: ['PostgreSQL 17', 'pgvector', 'Docker', 'NestJS']
        }
      ],
      languages: [
        { language: 'English', proficiency: 'Native / Bilingual', cefrLevel: 'C2' },
        { language: 'Spanish', proficiency: 'Professional Working', cefrLevel: 'B2' },
        { language: 'French', proficiency: 'Elementary', cefrLevel: 'A2' }
      ],
      verifiedCertificates: base.verifiedCertificates || [
        {
          title: 'Full-Stack Web Architecture Mastery',
          issuer: 'EduBridge Institute',
          issuedDate: 'October 2026',
          credentialId: 'EB-CERT-88492'
        },
        {
          title: 'Self-Hosted AI & LLM Systems Specialist',
          issuer: 'Coursera & Linux Foundation',
          issuedDate: 'September 2026',
          credentialId: 'LF-AI-77291'
        }
      ],
      referencesStatement: 'References and verified credential hashes available upon request.'
    };
  }

  /**
   * Parses uploaded raw resume text or JSON into structured EnhancedResumeData.
   */
  public static parseUploadedResume(text: string, current: EnhancedResumeData): EnhancedResumeData {
    // 1. Try JSON parsing
    try {
      const parsed = JSON.parse(text);
      if (parsed.fullName || parsed.name) {
        return {
          ...current,
          fullName: parsed.fullName || parsed.name || current.fullName,
          headline: parsed.headline || parsed.title || current.headline,
          email: parsed.email || current.email,
          phone: parsed.phone || current.phone,
          location: parsed.location || current.location,
          summary: parsed.summary || parsed.about || current.summary,
          skills: Array.isArray(parsed.skills) ? parsed.skills : current.skills,
          experiences: Array.isArray(parsed.experiences) ? parsed.experiences : current.experiences,
          education: Array.isArray(parsed.education) ? parsed.education : current.education
        };
      }
    } catch {
      // Continue to natural language / text parsing
    }

    // 2. Natural language / Line-by-line heuristic parser
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return current;

    const extracted: Partial<EnhancedResumeData> = {};

    // First non-empty line is likely the name if < 40 chars
    if (lines[0] && lines[0].length < 40 && !lines[0].includes('@')) {
      extracted.fullName = lines[0].replace(/^(name\s*:\s*)/i, '');
    }

    // Find email and phone
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) extracted.email = emailMatch[0];

    const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch) extracted.phone = phoneMatch[0];

    // Find summary block
    const summaryHeaderIdx = lines.findIndex((l) => /^(summary|profile|about me|objective|professional summary)/i.test(l));
    if (summaryHeaderIdx !== -1 && lines[summaryHeaderIdx + 1]) {
      extracted.summary = lines.slice(summaryHeaderIdx + 1, summaryHeaderIdx + 4).join(' ');
    }

    // Find skills block (either "Skills: React, Node" on same line or header followed by items)
    const skillsLineIdx = lines.findIndex((l) => /^(skills|technical skills|competencies|technologies)/i.test(l));
    if (skillsLineIdx !== -1) {
      const line = lines[skillsLineIdx];
      let skillsStr = '';
      if (line.includes(':')) {
        skillsStr = line.split(':')[1];
      } else if (lines[skillsLineIdx + 1]) {
        skillsStr = lines[skillsLineIdx + 1];
      }

      if (skillsStr) {
        const rawSkills = skillsStr
          .split(/[,•|·]/)
          .map((s) => s.trim())
          .filter((s) => s.length > 1);
        if (rawSkills.length > 0) extracted.skills = rawSkills;
      }
    }

    // Find experience block
    const expLineIdx = lines.findIndex((l) => /^(experience|work experience|employment history|career history)/i.test(l));
    if (expLineIdx !== -1) {
      const expLines = lines.slice(expLineIdx + 1);
      const parsedExperiences: ResumeExperience[] = [];
      let currentExp: ResumeExperience | null = null;

      for (const el of expLines) {
        if (/^(education|certifications|credentials|projects|languages|references)/i.test(el)) {
          break; // Next section reached
        }

        if (el.startsWith('-') || el.startsWith('•') || el.startsWith('*')) {
          const bullet = el.replace(/^[-•*]\s*/, '').trim();
          if (currentExp && bullet) {
            currentExp.achievements.push(bullet);
          }
        } else if (el.includes(' at ') || el.includes(' - ') || el.includes('|') || el.includes('(')) {
          if (currentExp) {
            parsedExperiences.push(currentExp);
          }
          
          let role = el;
          let company = 'Company';
          let period = 'Recent';

          if (el.includes(' at ')) {
            const parts = el.split(' at ');
            role = parts[0].trim();
            company = parts[1].split('(')[0].trim();
          }

          const periodMatch = el.match(/\(([^)]+)\)/);
          if (periodMatch) {
            period = periodMatch[1].trim();
          }

          currentExp = {
            role,
            company,
            period,
            achievements: []
          };
        }
      }

      if (currentExp) {
        parsedExperiences.push(currentExp);
      }

      if (parsedExperiences.length > 0) {
        extracted.experiences = parsedExperiences;
      }
    }

    return {
      ...current,
      ...extracted
    };
  }

  /**
   * Adapts resume formatting, labels, and spelling conventions to regional patterns.
   */
  public static adaptToRegion(resume: EnhancedResumeData, targetRegion: CVRegionPattern): EnhancedResumeData {
    const updated = { ...resume, targetRegion };

    switch (targetRegion) {
      case 'UK':
        // UK Standard: "Curriculum Vitae", British English (optimised, specialised), photo hidden by default
        updated.summary = this.convertToBritishEnglish(updated.summary);
        updated.referencesStatement = 'References and verified credential hashes available upon request.';
        break;

      case 'Europe':
        // Europe (Europass): CEFR language levels, driving license/citizenship clarity, photo optional/encouraged
        updated.showPhoto = true;
        updated.referencesStatement = 'Europass compliant dossier. Certified European reference framework.';
        break;

      case 'US':
        // US Standard: Strict anti-bias regulations strongly discourage photos on resumes
        updated.showPhoto = false;
        updated.summary = this.convertToAmericanEnglish(updated.summary);
        updated.referencesStatement = undefined; // US resumes omit "References upon request" to save space
        break;

      case 'Canada':
        // Canada: Clean achievement-driven structure, no photo
        updated.showPhoto = false;
        updated.referencesStatement = 'Available upon request.';
        break;

      case 'Gulf':
        // Gulf (UAE, KSA, Qatar): Professional portrait photo standard, nationality & visa status prominent
        updated.showPhoto = true;
        updated.referencesStatement = 'Verified references, educational attestations, and background checks available immediately.';
        break;

      case 'ModernTech':
        // Creative / Tech: Visual badges, GitHub & live links prominent, custom photo
        updated.showPhoto = true;
        updated.photoShape = 'rounded';
        break;
    }

    return updated;
  }

  /**
   * Generates AI audit score and targeted high-impact recommendations.
   */
  public static analyzeAndGenerateEnhancements(resume: EnhancedResumeData): {
    metrics: CVAuditMetrics;
    suggestions: AIEnhancementSuggestion[];
  } {
    const suggestions: AIEnhancementSuggestion[] = [];

    let atsScore = 82;
    let actionScore = 78;
    let impactScore = 75;
    let regionalScore = 85;

    // Check Summary
    if (!resume.summary.includes('%') && !resume.summary.includes('$') && !resume.summary.includes('reduced') && !resume.summary.includes('scaled')) {
      suggestions.push({
        id: 'sug-summary-metrics',
        category: 'summary',
        title: 'Inject High-ROI Quantifiable Metrics into Executive Summary',
        reason: 'Hiring managers and ATS filters prioritize candidates who state tangible business impact and scale in the opening 3 lines.',
        suggestedText: 'Results-driven technologist with verified expertise in high-performance distributed systems and self-hosted AI architecture. Proven track record of scaling offline-first PWA applications to 150k+ active learners while reducing cloud inference overhead by 40%.',
        applied: false
      });
      atsScore -= 5;
      impactScore -= 10;
    }

    // Check Action Verbs in Experiences
    const firstExp = resume.experiences[0];
    if (firstExp && firstExp.achievements.length > 0) {
      const hasWeakVerb = firstExp.achievements.some((a) => /^(helped|worked on|responsible for|assisted)/i.test(a));
      if (hasWeakVerb || firstExp.achievements.length < 3) {
        suggestions.push({
          id: 'sug-exp-power-verbs',
          category: 'experience',
          title: 'Upgrade Work Experience with Executive Action Verbs',
          reason: 'Replace passive phrases ("worked on", "helped") with authoritative engineering action verbs ("Architected", "Spearheaded", "Benchmarked").',
          suggestedText: 'Spearheaded full-stack architectural redesign utilizing NestJS microservices and PostgreSQL 17, slashing p95 latency from 240ms to 58ms across 50,000 daily queries.',
          sectionIndex: 0,
          itemIndex: 0,
          applied: false
        });
        actionScore -= 12;
      }
    }

    // Regional Compliance Check
    if (resume.targetRegion === 'US' && resume.showPhoto) {
      suggestions.push({
        id: 'sug-us-photo',
        category: 'regional',
        title: 'US Compliance: Disable Profile Picture for ATS Equal Opportunity Screening',
        reason: 'Most US corporate applicant tracking systems and legal departments reject resumes with photos to avoid EEOC liability.',
        suggestedText: 'Turn off photo display on US Resume layout to maintain 100% US corporate compliance.',
        applied: false
      });
      regionalScore -= 15;
    } else if (resume.targetRegion === 'Europe' && !resume.languages.some((l) => l.cefrLevel)) {
      suggestions.push({
        id: 'sug-eu-cefr',
        category: 'regional',
        title: 'European Format: Standardize Languages into CEFR Levels (A1–C2)',
        reason: 'Europass and EU employers expect standard Common European Framework of Reference for Languages (CEFR) grading.',
        suggestedText: 'English (C2 Proficient), Spanish (B2 Independent), French (A2 Basic).',
        applied: false
      });
      regionalScore -= 10;
    }

    // Skills Taxonomy Check
    if (resume.skills.length < 8) {
      suggestions.push({
        id: 'sug-skills-expansion',
        category: 'skills',
        title: 'Expand Technical Skills with High-Demand Market Keywords',
        reason: 'ATS scanners search for exact matches across databases, testing frameworks, and cloud orchestration.',
        suggestedText: 'Docker Compose, PostgreSQL 17, GraphQL, Redis Caching, Jest / Vitest, CI/CD GitHub Actions',
        applied: false
      });
      atsScore -= 8;
    }

    const overallScore = Math.min(98, Math.round((atsScore + actionScore + impactScore + regionalScore) / 4));

    return {
      metrics: {
        overallScore,
        atsReadability: atsScore,
        actionVerbStrength: actionScore,
        quantifiedImpactScore: impactScore,
        regionalComplianceScore: regionalScore
      },
      suggestions
    };
  }

  /**
   * Applies an AI enhancement to the resume.
   */
  public static applyEnhancement(resume: EnhancedResumeData, suggestion: AIEnhancementSuggestion): EnhancedResumeData {
    const updated = { ...resume };

    switch (suggestion.category) {
      case 'summary':
        updated.summary = suggestion.suggestedText;
        break;

      case 'experience':
        if (updated.experiences.length > 0) {
          const expIdx = suggestion.sectionIndex ?? 0;
          const currentExp = { ...updated.experiences[expIdx] };
          currentExp.achievements = [suggestion.suggestedText, ...currentExp.achievements.slice(1)];
          updated.experiences = [
            ...updated.experiences.slice(0, expIdx),
            currentExp,
            ...updated.experiences.slice(expIdx + 1)
          ];
        }
        break;

      case 'regional':
        if (updated.targetRegion === 'US') {
          updated.showPhoto = false;
        } else if (updated.targetRegion === 'Europe' || updated.targetRegion === 'Gulf') {
          updated.showPhoto = true;
        }
        break;

      case 'skills':
        const newSkills = suggestion.suggestedText.split(',').map((s) => s.trim());
        const combined = Array.from(new Set([...updated.skills, ...newSkills]));
        updated.skills = combined;
        break;
    }

    return updated;
  }

  /**
   * Applies all pending AI suggestions in one click.
   */
  public static applyAllEnhancements(
    resume: EnhancedResumeData,
    suggestions: AIEnhancementSuggestion[]
  ): EnhancedResumeData {
    let current = { ...resume };
    for (const sug of suggestions) {
      current = this.applyEnhancement(current, sug);
    }
    return current;
  }

  private static convertToBritishEnglish(str: string): string {
    return str
      .replace(/\boptimize\b/g, 'optimise')
      .replace(/\boptimized\b/g, 'optimised')
      .replace(/\boptimizing\b/g, 'optimising')
      .replace(/\banalyze\b/g, 'analyse')
      .replace(/\banalyzed\b/g, 'analysed')
      .replace(/\bspecialize\b/g, 'specialise')
      .replace(/\bspecialized\b/g, 'specialised')
      .replace(/\bprogram\b/g, 'programme')
      .replace(/\bcenter\b/g, 'centre');
  }

  private static convertToAmericanEnglish(str: string): string {
    return str
      .replace(/\boptimise\b/g, 'optimize')
      .replace(/\boptimised\b/g, 'optimized')
      .replace(/\banalyse\b/g, 'analyze')
      .replace(/\banalysed\b/g, 'analyzed')
      .replace(/\bspecialise\b/g, 'specialize')
      .replace(/\bspecialised\b/g, 'specialized')
      .replace(/\bprogramme\b/g, 'program')
      .replace(/\bcentre\b/g, 'center');
  }
}
