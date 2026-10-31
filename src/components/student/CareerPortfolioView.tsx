import React, { useState } from 'react';
import {
  Compass,
  Briefcase,
  Award,
  FileText,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  ExternalLink,
  Printer,
  Sparkles,
  ShieldCheck,
  QrCode
} from 'lucide-react';
import { CareerRoadmap, ResumeData, CertificateItem } from '../../types';
import { sound } from '../../utils/audio';

interface CareerPortfolioViewProps {
  roadmaps: CareerRoadmap[];
  resume: ResumeData;
  certificates: CertificateItem[];
  onUpdateResume: (updated: ResumeData) => void;
  onAskCareerAdvisor: (careerTitle: string) => void;
}

export const CareerPortfolioView: React.FC<CareerPortfolioViewProps> = ({
  roadmaps,
  resume,
  certificates,
  onUpdateResume,
  onAskCareerAdvisor
}) => {
  const [subTab, setSubTab] = useState<'navigator' | 'freelance' | 'resume' | 'certificates'>('navigator');
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>(roadmaps[0]?.id || '');
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  const activeRoadmap = roadmaps.find((r) => r.id === selectedRoadmapId) || roadmaps[0];

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Top Banner & Sub-Nav */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
              <Compass className="w-4 h-4" />
              <span>Coursera &amp; LinkedIn Learning Ecosystem</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Career Navigator &amp; Portfolio Builder
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Bridging academic mastery to verifiable employability, freelancing, and global opportunities.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              onClick={() => { sound.playClick(); setSubTab('navigator'); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                subTab === 'navigator' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Roadmaps
            </button>
            <button
              onClick={() => { sound.playClick(); setSubTab('freelance'); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                subTab === 'freelance' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Skill-to-Income
            </button>
            <button
              onClick={() => { sound.playClick(); setSubTab('resume'); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                subTab === 'resume' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ATS Resume
            </button>
            <button
              onClick={() => { sound.playClick(); setSubTab('certificates'); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                subTab === 'certificates' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Credentials
            </button>
          </div>
        </div>
      </div>

      {/* 1. Career Navigator */}
      {subTab === 'navigator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Roadmaps selection */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">Specialized Tracks</h3>
            <div className="space-y-2">
              {roadmaps.map((rm) => {
                const isSelected = activeRoadmap?.id === rm.id;
                return (
                  <button
                    key={rm.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedRoadmapId(rm.id);
                    }}
                    className={`w-full p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md border-indigo-700'
                        : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-80 block mb-1">
                      {rm.roleCategory}
                    </span>
                    <h4 className="font-bold text-sm leading-snug">{rm.title}</h4>
                    <div className="mt-2 flex items-center justify-between text-xs font-semibold opacity-90">
                      <span>{rm.avgSalary}</span>
                      <span>{rm.freelanceRate}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Detailed milestones */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">
                  {activeRoadmap.roleCategory}
                </span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                  {activeRoadmap.title}
                </h3>
              </div>

              <button
                onClick={() => onAskCareerAdvisor(activeRoadmap.title)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-xs shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Consult Llama 3.3 Advisor</span>
              </button>
            </div>

            {/* Compensation & Growth Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Annual Comp</span>
                <span className="text-sm sm:text-base font-black text-slate-900">{activeRoadmap.avgSalary}</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                <span className="text-[10px] text-emerald-700 uppercase font-bold block">Freelance Rate</span>
                <span className="text-sm sm:text-base font-black text-emerald-800">{activeRoadmap.freelanceRate}</span>
              </div>
              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100 text-center">
                <span className="text-[10px] text-indigo-700 uppercase font-bold block">Market Growth</span>
                <span className="text-sm sm:text-base font-black text-indigo-800">{activeRoadmap.demandGrowth}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{activeRoadmap.overview}</p>

            {/* Milestones Stepper */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Curriculum &amp; Practical Milestones
              </h4>
              <div className="space-y-3">
                {activeRoadmap.milestones.map((ms, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all ${
                      ms.completed ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="flex items-center gap-1.5 text-slate-800">
                        {ms.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border-2 border-slate-400 flex items-center justify-center text-[9px] text-slate-500">
                            {idx + 1}
                          </span>
                        )}
                        <span>{ms.stage}</span>
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded ${ms.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                        {ms.completed ? 'Completed' : 'In Progress'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1">
                      <strong>Deliverable Artifact:</strong> {ms.targetProject}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-1">
                      {ms.skills.map((sk, sIdx) => (
                        <span key={sIdx} className="text-[10px] font-semibold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. Skill-to-Income / Freelancing Hub */}
      {subTab === 'freelance' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">
                Learning-to-Earning Core Engine
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Freelancing &amp; High-Value Contract Blueprints
              </h3>
            </div>
            <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-xl border border-emerald-200">
              Upwork &amp; Toptal Verified Patterns
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-indigo-700 uppercase">Tier 1: Foundation Gig</span>
              <h4 className="font-extrabold text-slate-900 text-base">$45 – $65 / hr</h4>
              <p className="text-xs text-slate-600">
                Linguistic transcription, IELTS essay grading assistance, Spanish-English technical translation.
              </p>
            </div>
            <div className="p-5 bg-indigo-50/60 rounded-2xl border border-indigo-200 space-y-2">
              <span className="text-xs font-bold text-indigo-700 uppercase">Tier 2: Applied Engineering</span>
              <h4 className="font-extrabold text-slate-900 text-base">$80 – $120 / hr</h4>
              <p className="text-xs text-slate-600">
                Full-stack NestJS/React app development, PostgreSQL database indexing, PWA offline caching pipelines.
              </p>
            </div>
            <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
              <span className="text-xs font-bold text-emerald-800 uppercase">Tier 3: AI Systems Specialist</span>
              <h4 className="font-extrabold text-emerald-950 text-base">$130 – $180 / hr</h4>
              <p className="text-xs text-emerald-800">
                Self-hosted Ollama &amp; DeepSeek cluster architecture, zero-data-leakage private enterprise RAG deployments.
              </p>
            </div>
          </div>

          {/* Proposal Template Card */}
          <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-400">High-Converting Client Proposal Template (Self-Hosted AI Stack)</span>
              <span className="text-slate-400">Copy to clipboard</span>
            </div>
            <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
{`Hi [Client Name],

I noticed you are looking to integrate generative AI capabilities without recurring token fees and vendor lock-in.

I specialize in self-hosted open-source language models (Ollama, DeepSeek 8B, Qwen 3) orchestrated with TypeScript, NestJS, and PostgreSQL 17. In my latest production implementation, I deployed a 4-tier model cluster maintaining <80ms latency while operating 100% offline and HIPAA/GDPR-compliant.

Here is a quick 3-step timeline for your deliverable:
1. Containerized Ollama deployment via Docker Compose with VRAM optimization.
2. NestJS REST & streaming middleware with RBAC security and audit logs.
3. Offline-first React UI with instant client validation.

Let's schedule a 10-minute discovery call to align on your hardware requirements!`}
            </pre>
          </div>
        </div>
      )}

      {/* 3. ATS Resume Builder */}
      {subTab === 'resume' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
                ATS-Compliant Document
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Automated Resume &amp; CV Generator
              </h3>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>

          {/* Clean Printable ATS Resume Sheet */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-300 shadow-lg text-slate-900 max-w-4xl mx-auto space-y-6 print:m-0 print:p-0 print:border-none print:shadow-none">
            {/* Header */}
            <div className="border-b border-slate-300 pb-4 text-center sm:text-left sm:flex sm:justify-between sm:items-end">
              <div>
                <h2 className="text-3xl font-black tracking-tight text-slate-950">{resume.fullName}</h2>
                <p className="text-sm font-semibold text-indigo-700 mt-1">{resume.headline}</p>
              </div>
              <div className="text-xs text-slate-500 mt-2 sm:mt-0 sm:text-right font-medium">
                <p>alex.rivera@edubridge.org</p>
                <p>Verified EduBridge ID: EDU-88392</p>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                Professional Profile
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed pt-1">{resume.summary}</p>
            </div>

            {/* Skills */}
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                Technical &amp; Linguistic Competencies
              </h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {resume.skills.map((sk, i) => (
                  <span key={i} className="text-xs text-slate-800 font-medium bg-slate-100 px-2.5 py-1 rounded-md">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                Applied Engineering &amp; Project Experience
              </h4>
              {resume.experiences.map((exp, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{exp.role} · <span className="text-slate-600">{exp.company}</span></span>
                    <span className="font-mono text-slate-500">{exp.period}</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                    {exp.achievements.map((ach, aIdx) => (
                      <li key={aIdx}>{ach}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Verified Certifications */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                EduBridge Verified Credentials
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {resume.verifiedCertificates.map((cert, cIdx) => (
                  <div key={cIdx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block">{cert.title}</span>
                    <span className="text-slate-500 block">{cert.issuer} · {cert.issuedDate}</span>
                    <span className="font-mono text-[10px] text-indigo-700 font-semibold">{cert.credentialId}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 4. Verifiable Certificates */}
      {subTab === 'certificates' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">
                Cryptographic Credentials
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Verifiable Certificates of Mastery
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-200 shadow-md relative overflow-hidden flex flex-col justify-between space-y-6"
              >
                {/* Decorative border banner */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-indigo-600" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                      EduBridge Open-Source Institute
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {cert.gradeScore}
                  </span>
                </div>

                <div className="space-y-2 text-center">
                  <span className="text-xs text-slate-500 uppercase tracking-widest block">This certifies that</span>
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight">{cert.recipientName}</h4>
                  <p className="text-xs text-slate-500">has successfully demonstrated rigorous mastery in</p>
                  <h5 className="text-base font-bold text-indigo-700">{cert.title}</h5>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-xs">
                  <span className="font-bold text-slate-700 block">Demonstrated Competencies:</span>
                  <div className="flex flex-wrap gap-1">
                    {cert.skillsDemonstrated.map((sk, idx) => (
                      <span key={idx} className="bg-white px-2 py-0.5 rounded border border-slate-200 text-[10px] text-slate-700 font-medium">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Verification footer */}
                <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Credential ID:</span>
                    <span className="font-mono text-xs font-bold text-slate-800">{cert.credentialId}</span>
                  </div>

                  <div className="flex items-center gap-2 text-right">
                    <QrCode className="w-6 h-6 text-slate-800" />
                    <div>
                      <span className="text-[10px] text-emerald-600 font-bold block">Verified Hash</span>
                      <span className="font-mono text-[9px] text-slate-400">{cert.verificationHash.slice(0, 10)}...</span>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
