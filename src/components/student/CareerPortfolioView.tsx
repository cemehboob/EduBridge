import React, { useState, useRef } from 'react';
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
  QrCode,
  Upload,
  Download,
  FileDown,
  Globe,
  Sliders,
  Camera,
  Eye,
  EyeOff,
  Check,
  RefreshCw,
  X,
  FileCode,
  ChevronDown,
  ChevronUp,
  UserCheck
} from 'lucide-react';
import { CareerRoadmap, ResumeData, CertificateItem } from '../../types';
import {
  CVRegionPattern,
  EnhancedResumeData,
  AIEnhancementSuggestion,
  PhotoPosition,
  PhotoShape
} from '../../types/career';
import { ResumeEnhancementService } from '../../services/resumeEnhancementService';
import { ResumeExportService } from '../../services/resumeExportService';
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

  // Enhanced Resume & AI Architecture States
  const [enhancedResume, setEnhancedResume] = useState<EnhancedResumeData>(() =>
    ResumeEnhancementService.initializeEnhancedResume(resume)
  );
  const [aiAudit, setAiAudit] = useState(() =>
    ResumeEnhancementService.analyzeAndGenerateEnhancements(
      ResumeEnhancementService.initializeEnhancedResume(resume)
    )
  );
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showPhotoControls, setShowPhotoControls] = useState<boolean>(false);
  const [showAiAuditPanel, setShowAiAuditPanel] = useState<boolean>(true);
  const [rawCvText, setRawCvText] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const activeRoadmap = roadmaps.find((r) => r.id === selectedRoadmapId) || roadmaps[0];

  const handlePrint = () => {
    sound.playClick();
    ResumeExportService.exportToPDF(enhancedResume);
  };

  const handleExportWord = () => {
    sound.playClick();
    ResumeExportService.exportToWord(enhancedResume);
  };

  const handleRegionSwitch = (region: CVRegionPattern) => {
    sound.playClick();
    const updated = ResumeEnhancementService.adaptToRegion(enhancedResume, region);
    setEnhancedResume(updated);
    setAiAudit(ResumeEnhancementService.analyzeAndGenerateEnhancements(updated));
  };

  const handleApplySuggestion = (suggestion: AIEnhancementSuggestion) => {
    sound.playClick();
    const updated = ResumeEnhancementService.applyEnhancement(enhancedResume, suggestion);
    setEnhancedResume(updated);
    setAiAudit(ResumeEnhancementService.analyzeAndGenerateEnhancements(updated));
  };

  const handleApplyAllSuggestions = () => {
    sound.playClick();
    const updated = ResumeEnhancementService.applyAllEnhancements(enhancedResume, aiAudit.suggestions);
    setEnhancedResume(updated);
    setAiAudit(ResumeEnhancementService.analyzeAndGenerateEnhancements(updated));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setRawCvText(content);
        const parsed = ResumeEnhancementService.parseUploadedResume(content, enhancedResume);
        setEnhancedResume(parsed);
        setAiAudit(ResumeEnhancementService.analyzeAndGenerateEnhancements(parsed));
        setShowUploadModal(false);
      }
    };
    reader.readAsText(file);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setEnhancedResume((prev) => ({
          ...prev,
          photoUrl: dataUrl,
          showPhoto: true
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleParseManualText = () => {
    sound.playClick();
    if (!rawCvText.trim()) return;
    const parsed = ResumeEnhancementService.parseUploadedResume(rawCvText, enhancedResume);
    setEnhancedResume(parsed);
    setAiAudit(ResumeEnhancementService.analyzeAndGenerateEnhancements(parsed));
    setShowUploadModal(false);
  };

  const loadSampleProfile = (name: 'alex' | 'sarah' | 'tariq') => {
    sound.playClick();
    let sample = '';
    if (name === 'alex') {
      sample = `Alex Rivera\nLondon, United Kingdom\nalex.rivera@edubridge.org | +44 7700 900123 | github.com/alexrivera-ai\n\nFull-Stack Software Engineer & AI Systems Specialist\nMotivated technologist specializing in high-performance web systems and open-source AI infrastructure. Demonstrated expertise in TypeScript, React, and Ollama model deployment.\n\nSkills: TypeScript, React, Node.js, Next.js, PostgreSQL, Docker, Ollama, DeepSeek, Python\n\nExperience:\nSenior AI Solutions Engineer at NovaTech Dynamics (2023 - Present)\n- Engineered decentralized multi-model Ollama pipelines, reducing inference latency by 45%\n- Orchestrated zero-downtime PostgreSQL migrations supporting 250,000+ daily active learners\nFull-Stack Web Architect at Global EduTech Solutions (2021 - 2023)\n- Spearheaded interactive assessment engines achieving 99.98% uptime`;
    } else if (name === 'sarah') {
      sample = `Sarah Jenkins\nNew York, United States\nsarah.jenkins@cloudbridge.io | +1 (212) 555-0199 | linkedin.com/in/sarahjenkins-cloud\n\nPrincipal DevOps & Cloud Infrastructure Architect\nHigh-impact cloud transformation leader with 7+ years orchestrating AWS, Kubernetes, and enterprise microservices. Passionate about automated CI/CD and cost efficiency.\n\nSkills: Kubernetes, Terraform, AWS, Docker, Python, Go, Prometheus, CI/CD, Helm, Linux\n\nExperience:\nLead Cloud Engineer at Enterprise Cloudworks (2022 - Present)\n- Architected multi-region Kubernetes clusters across US-East and EU-Central, lowering cloud spend by 38%\n- Automated zero-trust security postures and compliance audits across 60+ microservices\nDevOps Specialist at FinScale Systems (2019 - 2022)\n- Deployed automated GitOps pipelines processing 120+ microservice deployments daily`;
    } else {
      sample = `Tariq Al-Mansoor\nDubai, United Arab Emirates\ntariq.almansoor@gulftech.ae | +971 50 123 4567 | linkedin.com/in/tariq-almansoor\n\nEnterprise AI Solutions & Database Systems Lead\nExecutive technologist specializing in enterprise database architectures, distributed LLM orchestration, and high-security fintech platforms across the GCC region.\n\nSkills: PostgreSQL 17, Distributed LLMs, Python, TypeScript, Kafka, Enterprise Cloud, Docker, Redis\n\nExperience:\nHead of Enterprise AI Systems at Emirates Tech Solutions (2022 - Present)\n- Spearheaded sovereign Arabic-English LLM cluster deployment delivering 99.99% availability for 400k+ banking users\n- Directed cross-border database clustering across UAE and Saudi cloud regions with <12ms sync latency`;
    }
    setRawCvText(sample);
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

      {/* 3. ATS & Regional Resume Builder */}
      {subTab === 'resume' && (
        <div className="space-y-6">
          {/* Header & Main Toolbar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
                <Globe className="w-4 h-4" />
                <span>Multi-Regional CV &amp; AI Portfolio Architect</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                Regional CV Builder &amp; Optimizer
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload your profile, auto-adapt across UK, Europass, US, Canada, Gulf, or Modern Tech standards, optimize with AI, customize photo display, and export to Word &amp; PDF.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => { sound.playClick(); setShowUploadModal(true); }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>Upload / Import Profile</span>
              </button>

              <button
                onClick={() => { sound.playClick(); setShowPhotoControls(!showPhotoControls); }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold shadow-xs transition-all ${
                  showPhotoControls
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Photo Settings</span>
              </button>

              <button
                onClick={() => { sound.playClick(); setShowAiAuditPanel(!showAiAuditPanel); }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold shadow-xs transition-all ${
                  showAiAuditPanel
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>AI Audit ({aiAudit.metrics.overallScore}%)</span>
              </button>

              <button
                onClick={handleExportWord}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all"
                title="Download formatted Microsoft Word document (.doc)"
              >
                <FileDown className="w-4 h-4" />
                <span>Word (.doc)</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all"
                title="Open print-to-PDF dialog"
              >
                <Printer className="w-4 h-4" />
                <span>PDF Document</span>
              </button>
            </div>
          </div>

          {/* Regional Pattern Switcher Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { id: 'UK', flag: '🇬🇧', title: 'UK Standard', sub: '2-Page British Standard' },
              { id: 'Europe', flag: '🇪🇺', title: 'Europass', sub: 'Official CEFR Matrix' },
              { id: 'US', flag: '🇺🇸', title: 'US Resume', sub: '1-Page ATS & EEOC Safe' },
              { id: 'Canada', flag: '🇨🇦', title: 'Canada CV', sub: 'Bilingual Tech Format' },
              { id: 'Gulf', flag: '🇦🇪', title: 'Gulf / GCC', sub: 'Executive + Visa & Photo' },
              { id: 'ModernTech', flag: '⚡', title: 'Modern Tech', sub: 'GitHub & Tech Stacks' }
            ].map((reg) => {
              const isSelected = enhancedResume.targetRegion === reg.id;
              return (
                <button
                  key={reg.id}
                  onClick={() => handleRegionSwitch(reg.id as CVRegionPattern)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                      : 'bg-white border-slate-200/90 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{reg.flag}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div className="mt-2 font-bold text-xs">{reg.title}</div>
                  <div className={`text-[10px] truncate ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {reg.sub}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Photo Customization Drawer */}
          {showPhotoControls && (
            <div className="bg-white rounded-3xl p-6 border border-indigo-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-sm font-black text-slate-900">
                    Portrait Photo Customization &amp; Display Preferences
                  </h4>
                </div>
                <button
                  onClick={() => setShowPhotoControls(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                {/* Photo Upload & Preview */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {enhancedResume.photoUrl ? (
                      <img
                        src={enhancedResume.photoUrl}
                        alt="Profile preview"
                        className={`w-14 h-14 object-cover border-2 border-indigo-500 shadow-xs ${
                          enhancedResume.photoShape === 'circle'
                            ? 'rounded-full'
                            : enhancedResume.photoShape === 'rounded'
                            ? 'rounded-xl'
                            : 'rounded-none'
                        }`}
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                        <Camera className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => photoInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200"
                    >
                      Upload Picture
                    </button>
                    <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, or WebP</p>
                  </div>
                </div>

                {/* Show/Hide Toggle */}
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-1.5">Visibility:</span>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setEnhancedResume((prev) => ({ ...prev, showPhoto: !prev.showPhoto }));
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      enhancedResume.showPhoto
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-slate-100 border-slate-300 text-slate-600'
                    }`}
                  >
                    {enhancedResume.showPhoto ? (
                      <>
                        <Eye className="w-4 h-4 text-emerald-600" />
                        <span>Displaying on CV</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4 text-slate-400" />
                        <span>Hidden (EEOC Safe)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Shape Selector */}
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-1.5">Shape:</span>
                  <div className="flex items-center gap-1">
                    {[
                      { id: 'circle', label: 'Circle' },
                      { id: 'rounded', label: 'Rounded' },
                      { id: 'square', label: 'Square' }
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          sound.playClick();
                          setEnhancedResume((prev) => ({ ...prev, photoShape: s.id as PhotoShape }));
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                          enhancedResume.photoShape === s.id
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Position Selector */}
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-1.5">Placement:</span>
                  <div className="flex items-center gap-1">
                    {[
                      { id: 'top-right', label: 'Top-Right' },
                      { id: 'top-left', label: 'Top-Left' },
                      { id: 'header-center', label: 'Center' }
                    ].map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          sound.playClick();
                          setEnhancedResume((prev) => ({ ...prev, photoPosition: p.id as PhotoPosition }));
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                          enhancedResume.photoPosition === p.id
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Regional Advisory */}
              <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-[11px] text-indigo-900 leading-relaxed">
                💡 <strong>Regional Advisory:</strong> In the US and Canada, anti-discrimination laws (EEOC) strongly recommend omitting photos. In Europe (Europass) and the Gulf (UAE, Saudi Arabia), professional portraits are widely appreciated. You have complete flexibility to display or hide your photo according to your wish!
              </div>
            </div>
          )}

          {/* AI Audit & Suggestions Panel */}
          {showAiAuditPanel && (
            <div className="bg-white rounded-3xl p-6 border border-amber-200/90 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900">
                      AI Career Audit &amp; Regional ATS Analyzer
                    </h4>
                    <p className="text-xs text-slate-500">
                      Evaluated against {enhancedResume.targetRegion} recruitment benchmarks and ATS parsing engines.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {aiAudit.suggestions.some((s) => !s.applied) && (
                    <button
                      onClick={handleApplyAllSuggestions}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-xs transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Accept All AI Enhancements</span>
                    </button>
                  )}
                  <button
                    onClick={() => setShowAiAuditPanel(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                    Overall ATS Score
                  </span>
                  <span className="text-2xl font-black text-amber-950 mt-1 block">
                    {aiAudit.metrics.overallScore}%
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                    ATS Readability
                  </span>
                  <span className="text-2xl font-black text-emerald-950 mt-1 block">
                    {aiAudit.metrics.atsReadability}%
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">
                    Action Verbs
                  </span>
                  <span className="text-2xl font-black text-blue-950 mt-1 block">
                    {aiAudit.metrics.actionVerbStrength}%
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 block">
                    Quantified Impact
                  </span>
                  <span className="text-2xl font-black text-purple-950 mt-1 block">
                    {aiAudit.metrics.quantifiedImpactScore}%
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-200 col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 block">
                    {enhancedResume.targetRegion} Compliance
                  </span>
                  <span className="text-2xl font-black text-indigo-950 mt-1 block">
                    {aiAudit.metrics.regionalComplianceScore}%
                  </span>
                </div>
              </div>

              {/* Suggestions List */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-700 block">
                  Actionable AI Enhancements &amp; Corrections:
                </span>
                {aiAudit.suggestions.map((sug) => (
                  <div
                    key={sug.id}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      sug.applied
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : 'bg-white border-amber-200 hover:border-amber-300 shadow-xs'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900">
                          {sug.category}
                        </span>
                        <h5 className="font-bold text-xs text-slate-900">{sug.title}</h5>
                      </div>
                      <p className="text-xs text-slate-600">{sug.reason}</p>
                      <div className="text-[11px] font-mono text-indigo-700 bg-indigo-50/50 p-2 rounded-lg border border-indigo-100 mt-1">
                        {sug.suggestedText}
                      </div>
                    </div>

                    <div>
                      {sug.applied ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                          <Check className="w-4 h-4" />
                          <span>Applied</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApplySuggestion(sug)}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all whitespace-nowrap"
                        >
                          Apply Enhancement
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload & Import CV Modal / Drawer */}
          {showUploadModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900">
                        Upload or Paste Profile / CV
                      </h4>
                      <p className="text-xs text-slate-500">
                        Our intelligent parser extracts your experience, education, skills, and projects automatically.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* File Upload Drop Zone */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.json,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-indigo-200 rounded-2xl p-6 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all space-y-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                      <FileCode className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold text-slate-800">
                      Click to browse or drop your CV file (.txt, .json, .doc)
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Instant client-side parsing without server transmission
                    </p>
                  </div>
                </div>

                {/* Instant Preset Profiles for 1-Click Testing */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">
                    Or select a verified sample profile:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      onClick={() => loadSampleProfile('alex')}
                      className="p-2.5 rounded-xl border border-slate-200 text-left hover:border-indigo-500 hover:bg-indigo-50/50 transition-all"
                    >
                      <span className="text-xs font-bold text-slate-900 block">Alex Rivera</span>
                      <span className="text-[10px] text-slate-500 block">Full-Stack &amp; AI Systems (London)</span>
                    </button>
                    <button
                      onClick={() => loadSampleProfile('sarah')}
                      className="p-2.5 rounded-xl border border-slate-200 text-left hover:border-indigo-500 hover:bg-indigo-50/50 transition-all"
                    >
                      <span className="text-xs font-bold text-slate-900 block">Sarah Jenkins</span>
                      <span className="text-[10px] text-slate-500 block">DevOps Architect (New York)</span>
                    </button>
                    <button
                      onClick={() => loadSampleProfile('tariq')}
                      className="p-2.5 rounded-xl border border-slate-200 text-left hover:border-indigo-500 hover:bg-indigo-50/50 transition-all"
                    >
                      <span className="text-xs font-bold text-slate-900 block">Tariq Al-Mansoor</span>
                      <span className="text-[10px] text-slate-500 block">Enterprise AI Lead (Dubai)</span>
                    </button>
                  </div>
                </div>

                {/* Paste Area */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-700 block">
                    Paste raw CV / LinkedIn text:
                  </span>
                  <textarea
                    value={rawCvText}
                    onChange={(e) => setRawCvText(e.target.value)}
                    placeholder="Paste CV or LinkedIn profile here..."
                    rows={6}
                    className="w-full text-xs font-mono p-3 rounded-2xl border border-slate-200 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleParseManualText}
                    disabled={!rawCvText.trim()}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-all"
                  >
                    Parse &amp; Convert Profile
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Clean Printable & Regional CV Sheet */}
          <div className={`bg-white rounded-3xl p-8 sm:p-12 border shadow-lg text-slate-900 max-w-4xl mx-auto space-y-6 print:m-0 print:p-0 print:border-none print:shadow-none ${
            enhancedResume.targetRegion === 'Europe'
              ? 'border-blue-400'
              : enhancedResume.targetRegion === 'Gulf'
              ? 'border-amber-300'
              : 'border-slate-300'
          }`}>

            {/* Regional Branding Banner for Europass */}
            {enhancedResume.targetRegion === 'Europe' && (
              <div className="bg-[#0e4194] text-white p-4 -mx-8 sm:-mx-12 -mt-8 sm:-mt-12 rounded-t-3xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest block text-blue-200">
                    European Union Curriculum Vitae
                  </span>
                  <h3 className="text-lg font-black tracking-tight">Europass Standard Format</h3>
                </div>
                <span className="text-xs font-mono bg-blue-800 px-3 py-1 rounded-lg border border-blue-700">
                  CEFR Verified
                </span>
              </div>
            )}

            {/* Header Section with Dynamic Photo Placement */}
            <div className={`border-b border-slate-300 pb-5 ${
              enhancedResume.photoPosition === 'header-center' && enhancedResume.showPhoto
                ? 'text-center flex flex-col items-center'
                : enhancedResume.photoPosition === 'top-left' && enhancedResume.showPhoto
                ? 'flex flex-row items-center gap-6'
                : 'sm:flex sm:justify-between sm:items-start gap-6'
            }`}>
              
              {/* Photo when Top-Left */}
              {enhancedResume.showPhoto && enhancedResume.photoUrl && enhancedResume.photoPosition === 'top-left' && (
                <img
                  src={enhancedResume.photoUrl}
                  alt={enhancedResume.fullName}
                  className={`w-24 h-24 object-cover border-2 border-indigo-400 shadow-md ${
                    enhancedResume.photoShape === 'circle'
                      ? 'rounded-full'
                      : enhancedResume.photoShape === 'rounded'
                      ? 'rounded-2xl'
                      : 'rounded-none'
                  }`}
                />
              )}

              {/* Photo when Header-Center */}
              {enhancedResume.showPhoto && enhancedResume.photoUrl && enhancedResume.photoPosition === 'header-center' && (
                <img
                  src={enhancedResume.photoUrl}
                  alt={enhancedResume.fullName}
                  className={`w-24 h-24 object-cover border-2 border-indigo-400 shadow-md mb-3 ${
                    enhancedResume.photoShape === 'circle'
                      ? 'rounded-full'
                      : enhancedResume.photoShape === 'rounded'
                      ? 'rounded-2xl'
                      : 'rounded-none'
                  }`}
                />
              )}

              {/* Identity & Contact Details */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-3xl font-black tracking-tight text-slate-950">
                    {enhancedResume.fullName}
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-800">
                    {enhancedResume.targetRegion}
                  </span>
                </div>
                <p className="text-sm font-semibold text-indigo-700">{enhancedResume.headline}</p>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-600 font-medium pt-1">
                  <span>{enhancedResume.location}</span>
                  <span>•</span>
                  <span>{enhancedResume.email}</span>
                  <span>•</span>
                  <span>{enhancedResume.phone}</span>
                  {enhancedResume.linkedin && (
                    <>
                      <span>•</span>
                      <span>{enhancedResume.linkedin}</span>
                    </>
                  )}
                  {enhancedResume.github && (
                    <>
                      <span>•</span>
                      <span>{enhancedResume.github}</span>
                    </>
                  )}
                </div>

                {/* Regional specific status: Nationality / Visa (UK, Europe, Gulf) */}
                {(enhancedResume.targetRegion === 'Gulf' || enhancedResume.targetRegion === 'Europe' || enhancedResume.targetRegion === 'UK') && (
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 pt-1 font-mono">
                    {enhancedResume.nationality && <span>Nationality: {enhancedResume.nationality}</span>}
                    {enhancedResume.visaStatus && <span>| Visa: {enhancedResume.visaStatus}</span>}
                  </div>
                )}
              </div>

              {/* Photo when Top-Right (Default) */}
              {enhancedResume.showPhoto && enhancedResume.photoUrl && enhancedResume.photoPosition === 'top-right' && (
                <div className="mt-3 sm:mt-0 flex justify-end">
                  <img
                    src={enhancedResume.photoUrl}
                    alt={enhancedResume.fullName}
                    className={`w-24 h-24 object-cover border-2 border-indigo-400 shadow-md ${
                      enhancedResume.photoShape === 'circle'
                        ? 'rounded-full'
                        : enhancedResume.photoShape === 'rounded'
                        ? 'rounded-2xl'
                        : 'rounded-none'
                    }`}
                  />
                </div>
              )}
            </div>

            {/* Professional Summary */}
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 flex items-center justify-between">
                <span>{enhancedResume.targetRegion === 'US' ? 'Executive Summary' : 'Professional Profile'}</span>
                <span className="text-[10px] text-slate-400 font-normal">ATS Standard</span>
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed pt-1">
                {enhancedResume.summary}
              </p>
            </div>

            {/* Skills & Competencies */}
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                {enhancedResume.targetRegion === 'ModernTech' ? 'Core Tech Stack & Architectures' : 'Technical & Linguistic Competencies'}
              </h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {enhancedResume.skills.map((sk, i) => (
                  <span
                    key={i}
                    className={`text-xs font-medium px-2.5 py-1 rounded-md ${
                      enhancedResume.targetRegion === 'ModernTech'
                        ? 'bg-slate-900 text-slate-100'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                {enhancedResume.targetRegion === 'UK' ? 'Career & Project History' : 'Applied Engineering & Professional Experience'}
              </h4>
              {enhancedResume.experiences.map((exp, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>
                      {exp.role} · <span className="text-slate-600">{exp.company}</span>
                      {exp.location && <span className="text-slate-400 font-normal"> ({exp.location})</span>}
                    </span>
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

            {/* Education Section */}
            {enhancedResume.education && enhancedResume.education.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                  Education &amp; Academic Qualifications
                </h4>
                <div className="space-y-2 text-xs">
                  {enhancedResume.education.map((edu, eIdx) => (
                    <div key={eIdx} className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-slate-900 block">{edu.degree}</span>
                        <span className="text-slate-600 block">{edu.institution} {edu.location && `· ${edu.location}`}</span>
                        {edu.honors && <span className="text-indigo-700 text-[11px] font-semibold">{edu.honors}</span>}
                      </div>
                      <span className="font-mono text-slate-500">{edu.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CEFR Language Grid (Europass & Regional) */}
            {enhancedResume.languages && enhancedResume.languages.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                  {enhancedResume.targetRegion === 'Europe' ? 'Mother Tongue & CEFR Language Proficiency' : 'Language Proficiencies'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {enhancedResume.languages.map((lang, lIdx) => (
                    <div key={lIdx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">{lang.language}</span>
                        <span className="text-slate-500 text-[11px] block">{lang.proficiency}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-indigo-100 text-indigo-800">
                        {lang.cefrLevel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verified Certifications */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                EduBridge Verified Credentials &amp; Standards
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {enhancedResume.verifiedCertificates.map((cert, cIdx) => (
                  <div key={cIdx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block">{cert.title}</span>
                    <span className="text-slate-500 block">{cert.issuer} · {cert.issuedDate}</span>
                    <span className="font-mono text-[10px] text-indigo-700 font-semibold">{cert.credentialId}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* References Statement (UK, Canada, Europe) */}
            {enhancedResume.referencesStatement && (
              <div className="pt-2 border-t border-slate-200 text-xs text-slate-500 text-center font-medium italic">
                {enhancedResume.referencesStatement}
              </div>
            )}

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
