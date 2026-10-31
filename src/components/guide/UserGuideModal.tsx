import React, { useState } from 'react';
import {
  X,
  Search,
  BookOpen,
  Sparkles,
  TreePine,
  Award,
  Bot,
  Users,
  BookOpenCheck,
  ShieldAlert,
  ChevronRight,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Lock,
  Layers,
  FileText,
  Bookmark
} from 'lucide-react';
import { UserGuideArticle, UserRole } from '../../types';
import { sound } from '../../utils/audio';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
  articles: UserGuideArticle[];
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({
  isOpen,
  onClose,
  userRole,
  articles
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticleId, setSelectedArticleId] = useState<string>(articles[0]?.id || 'guide_getting_started');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  // Strict Role-Based Visibility Filter:
  // Regular students/parents/teachers CANNOT see admin system setup items!
  const roleHierarchy: Record<UserRole, number> = {
    student: 1,
    parent: 2,
    teacher: 3,
    admin: 4
  };

  const visibleArticles = articles.filter((art) => {
    // If article requires admin, only admin can see it
    if (art.minRole === 'admin' && userRole !== 'admin') return false;
    // If article is for parent, only parent and admin can see it
    if (art.minRole === 'parent' && userRole !== 'parent' && userRole !== 'admin') return false;
    // If article is for teacher, only teacher and admin can see it
    if (art.minRole === 'teacher' && userRole !== 'teacher' && userRole !== 'admin') return false;
    return true;
  });

  const filteredArticles = visibleArticles.filter((art) => {
    const query = searchQuery.toLowerCase().trim();
    const matchSearch =
      art.title.toLowerCase().includes(query) ||
      art.summary.toLowerCase().includes(query) ||
      art.keywords.some((k) => k.toLowerCase().includes(query)) ||
      art.contentSections.some(
        (s) => s.heading.toLowerCase().includes(query) || s.text.toLowerCase().includes(query)
      );

    const matchCategory = selectedCategory === 'All' || art.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const activeArticle =
    visibleArticles.find((a) => a.id === selectedArticleId) || filteredArticles[0] || visibleArticles[0];

  const categories = ['All', ...Array.from(new Set(visibleArticles.map((a) => a.category)))];

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded">Admin Only</span>;
      case 'teacher':
        return <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">Teacher &amp; Admin</span>;
      case 'parent':
        return <span className="text-[10px] bg-pink-100 text-pink-800 font-bold px-2 py-0.5 rounded">Parent &amp; Admin</span>;
      default:
        return <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">All Learners</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col h-[90vh]">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900">EduBridge User Manual &amp; Knowledge Base</h3>
                {userRole === 'admin' ? (
                  <span className="text-[10px] bg-rose-100 text-rose-800 font-black px-2 py-0.5 rounded-full uppercase">
                    Admin Full Access
                  </span>
                ) : (
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full uppercase">
                    {userRole} Guide
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">Windows-Style Search, Category Index &amp; Illustrated Architecture</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master Explorer Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          
          {/* Left Panel: Search & Index Tree */}
          <div className="lg:col-span-4 border-r border-slate-200 bg-slate-50/50 flex flex-col h-full overflow-hidden">
            
            {/* Search Box */}
            <div className="p-4 border-b border-slate-200 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search index keywords (e.g. login, ielts, streak, docker)..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                />
              </div>

              {/* Category pills */}
              <div className="flex items-center gap-1 overflow-x-auto pt-2.5 pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-colors ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Articles Index Tree List */}
            <div className="flex-1 p-3 overflow-y-auto space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                Table of Contents ({filteredArticles.length} Topics)
              </span>

              {filteredArticles.map((art) => {
                const isSelected = activeArticle?.id === art.id;
                return (
                  <button
                    key={art.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedArticleId(art.id);
                    }}
                    className={`w-full p-3 rounded-2xl text-left border transition-all flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-white border-indigo-500 shadow-sm ring-2 ring-indigo-500/10'
                        : 'bg-white/70 border-slate-200/80 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-indigo-700 uppercase">{art.category}</span>
                        {art.minRole === 'admin' && (
                          <Lock className="w-3 h-3 text-rose-500" />
                        )}
                      </div>
                      <h4 className={`text-xs font-bold leading-snug ${isSelected ? 'text-indigo-900 font-black' : 'text-slate-800'}`}>
                        {art.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{art.summary}</p>
                    </div>

                    <ChevronRight className={`w-4 h-4 shrink-0 mt-2 ${isSelected ? 'text-indigo-600' : 'text-slate-300'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Article Reader with Pictures & Diagrams */}
          <div className="lg:col-span-8 p-6 sm:p-8 overflow-y-auto space-y-6 bg-white">
            {activeArticle ? (
              <div className="space-y-6">
                
                {/* Article Header */}
                <div className="border-b border-slate-100 pb-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                      {activeArticle.category}
                    </span>
                    {getRoleBadge(activeArticle.minRole)}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {activeArticle.title}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed font-sans">
                    {activeArticle.summary}
                  </p>
                </div>

                {/* Picture / Diagram Showcase Card */}
                {activeArticle.imagePlaceholder && (
                  <div className="rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
                    <div className={`p-6 sm:p-8 bg-gradient-to-br ${activeArticle.imagePlaceholder.accentColor} text-white space-y-3 relative overflow-hidden`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                          {activeArticle.imagePlaceholder.badge}
                        </span>
                        <Layers className="w-5 h-5 text-white/80" />
                      </div>
                      <h4 className="text-xl font-black tracking-tight">{activeArticle.imagePlaceholder.title}</h4>
                      <p className="text-xs text-white/90 max-w-md">{activeArticle.imagePlaceholder.caption}</p>
                      
                      {/* Decorative grid visualization simulating a live software diagram */}
                      <div className="pt-2 grid grid-cols-3 gap-2 text-center text-[10px] font-mono text-white/80">
                        <div className="p-2 bg-black/20 rounded-xl">Module Core</div>
                        <div className="p-2 bg-black/20 rounded-xl">Self-Hosted Layer</div>
                        <div className="p-2 bg-black/20 rounded-xl">Offline Vault</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Content Sections */}
                <div className="space-y-6">
                  {activeArticle.contentSections.map((sec, sIdx) => (
                    <div key={sIdx} className="space-y-3">
                      <h4 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-1.5">
                        {sec.heading}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {sec.text}
                      </p>

                      {sec.steps && (
                        <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                          {sec.steps.map((st, stIdx) => (
                            <li key={stIdx} className="leading-relaxed">
                              <strong>Step {stIdx + 1}:</strong> {st}
                            </li>
                          ))}
                        </ol>
                      )}

                      {sec.tip && (
                        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
                          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block">Pro Tip:</span>
                            <span>{sec.tip}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Keywords Tag Cloud */}
                <div className="pt-4 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Indexed Search Keywords
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeArticle.keywords.map((kw, i) => (
                      <button
                        key={i}
                        onClick={() => setSearchQuery(kw)}
                        className="text-[11px] font-medium bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                      >
                        #{kw}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-12 text-center text-slate-400">
                Select an article from the left navigation tree.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
