/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Enhanced Career & Portfolio Builder Types for EduBridge
 */

export type CVRegionPattern = 'UK' | 'Europe' | 'US' | 'Canada' | 'Gulf' | 'ModernTech';

export type PhotoPosition = 'top-right' | 'top-left' | 'header-center';
export type PhotoShape = 'circle' | 'rounded' | 'square';

export interface CEFRRating {
  language: string;
  proficiency: string; // e.g. "Native", "Fluent", "Professional Working"
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
}

export interface ResumeExperience {
  role: string;
  company: string;
  location?: string;
  period: string;
  achievements: string[];
}

export interface ResumeEducation {
  degree: string;
  institution: string;
  location?: string;
  year: string;
  honors?: string;
}

export interface ResumeProject {
  title: string;
  description: string;
  link?: string;
  techStack?: string[];
}

export interface EnhancedResumeData {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  nationality?: string;
  visaStatus?: string;
  linkedin?: string;
  github?: string;
  portfolioUrl?: string;
  summary: string;
  targetRegion: CVRegionPattern;
  photoUrl?: string;
  showPhoto: boolean;
  photoPosition: PhotoPosition;
  photoShape: PhotoShape;
  skills: string[];
  experiences: ResumeExperience[];
  education: ResumeEducation[];
  projects: ResumeProject[];
  languages: CEFRRating[];
  verifiedCertificates: {
    title: string;
    issuer: string;
    issuedDate: string;
    credentialId: string;
  }[];
  referencesStatement?: string;
}

export interface AIEnhancementSuggestion {
  id: string;
  category: 'summary' | 'experience' | 'skills' | 'regional' | 'impact';
  title: string;
  reason: string;
  suggestedText: string;
  sectionIndex?: number;
  itemIndex?: number;
  applied: boolean;
}

export interface CVAuditMetrics {
  overallScore: number; // 0 - 100
  atsReadability: number;
  actionVerbStrength: number;
  quantifiedImpactScore: number;
  regionalComplianceScore: number;
}
