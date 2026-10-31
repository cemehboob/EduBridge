import React, { useState } from 'react';
import {
  BookOpenCheck,
  Plus,
  HelpCircle,
  FileCheck,
  BarChart3,
  Search,
  Filter,
  Users,
  CheckCircle2,
  Sparkles,
  Layers
} from 'lucide-react';
import { CourseAssignment, QuestionBankItem } from '../../types';
import { sound } from '../../utils/audio';

interface TeacherPortalProps {
  assignments: CourseAssignment[];
  questionBank: QuestionBankItem[];
  onAddQuestion: (q: QuestionBankItem) => void;
  onAddAssignment: (a: CourseAssignment) => void;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  assignments,
  questionBank,
  onAddQuestion,
  onAddAssignment
}) => {
  const [activeTab, setActiveTab] = useState<'assignments' | 'question-bank' | 'analytics'>('assignments');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('All');

  // New question form modal
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newSubject, setNewSubject] = useState('Technology (AI)');
  const [newDifficulty, setNewDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [newType, setNewType] = useState<'Multiple Choice' | 'Essay' | 'Code' | 'Oral'>('Multiple Choice');

  // Filtered question bank
  const filteredQuestions = questionBank.filter((q) => {
    const matchSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) || q.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchSub = filterSubject === 'All' || q.subject.includes(filterSubject);
    return matchSearch && matchSub;
  });

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    sound.playSuccess();
    onAddQuestion({
      id: `qb_${Date.now()}`,
      question: newQuestionText.trim(),
      subject: newSubject,
      difficulty: newDifficulty,
      type: newType,
      tags: ['Teacher Curated', newSubject.split(' ')[0]]
    });
    setNewQuestionText('');
    setShowQuestionModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
            <BookOpenCheck className="w-4 h-4" />
            <span>Teacher Studio &amp; Curriculum Directorate</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Curriculum Builder &amp; Assessment Center
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Design rubrics, curate question banks, and monitor cohort mastery across all subjects.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            onClick={() => { sound.playClick(); setActiveTab('assignments'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'assignments' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Assignments
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveTab('question-bank'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'question-bank' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Question Bank ({questionBank.length})
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveTab('analytics'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'analytics' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cohort Analytics
          </button>
        </div>
      </div>

      {/* 1. Assignments Tab */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-lg">Active Class Cohort Assignments</h3>
            <span className="text-xs font-bold text-slate-500">Cohort Alpha (32 Enrolled)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assignments.map((asg) => (
              <div
                key={asg.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-indigo-600 uppercase tracking-wider">{asg.subject}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      asg.status === 'Graded' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {asg.status}
                    </span>
                  </div>
                  <h4 className="font-black text-slate-900 text-base leading-snug">{asg.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 font-mono">Due: {asg.dueDate}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Submissions:</span>
                    <strong className="text-slate-900">{asg.submittedCount} / {asg.totalStudents}</strong>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${(asg.submittedCount / asg.totalStudents) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-600 pt-1">
                    <span>Cohort Average:</span>
                    <strong className="text-emerald-700 font-bold">{asg.avgScore} {asg.subject.includes('IELTS') ? 'Band' : '%'}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Question Bank Tab */}
      {activeTab === 'question-bank' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Item Master Question Bank</h3>
              <p className="text-xs text-slate-500">Search and construct modular assessment sets across exams and STEM.</p>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setShowQuestionModal(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Question Item</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions or tags (e.g. Attention, Calculus, IELTS)..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-700"
            >
              <option value="All">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Technology">Technology</option>
              <option value="Language">Language</option>
              <option value="IELTS">IELTS Prep</option>
            </select>
          </div>

          {/* Questions List */}
          <div className="space-y-3">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-700">{q.subject}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 font-medium">{q.type}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    q.difficulty === 'Hard' ? 'bg-rose-100 text-rose-800' :
                    q.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {q.difficulty}
                  </span>
                </div>

                <p className="text-sm font-bold text-slate-800 leading-snug">{q.question}</p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {q.tags.map((t, idx) => (
                    <span key={idx} className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Cohort Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Cohort Mastery Distribution</h3>
            <p className="text-xs text-slate-500">Live evaluation telemetry from self-hosted automated rubrics.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 block font-bold">Class Average Band</span>
              <span className="text-2xl font-black text-indigo-600">7.3 Band</span>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-1">+0.4 Band this month</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 block font-bold">STEM Proofs Solved</span>
              <span className="text-2xl font-black text-emerald-600">418 Proofs</span>
              <span className="text-[10px] text-slate-500 block mt-1">94% DeepSeek verified</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 block font-bold">Oral Practice Hours</span>
              <span className="text-2xl font-black text-blue-600">128 Hours</span>
              <span className="text-[10px] text-slate-500 block mt-1">Whisper STT recorded</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 block font-bold">Active Daily Habit</span>
              <span className="text-2xl font-black text-amber-500">92%</span>
              <span className="text-[10px] text-slate-500 block mt-1">Cohort streak active</span>
            </div>
          </div>
        </div>
      )}

      {/* Add Question Modal */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-black text-slate-900">Add Question to Master Bank</h3>
            <form onSubmit={handleCreateQuestion} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Question Prompt</label>
                <textarea
                  rows={3}
                  required
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="Enter the assessment challenge or question prompt..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Subject</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl border border-slate-300"
                  >
                    <option value="Technology (AI)">AI &amp; Tech</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Exam Prep (IELTS)">IELTS Prep</option>
                    <option value="Language Learning">Language</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Difficulty</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as any)}
                    className="w-full p-2 text-xs rounded-xl border border-slate-300"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full p-2 text-xs rounded-xl border border-slate-300"
                  >
                    <option value="Multiple Choice">Multiple Choice</option>
                    <option value="Essay">Essay</option>
                    <option value="Code">Code</option>
                    <option value="Oral">Oral</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuestionModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
