import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  Award,
  Filter,
  Download,
  Search,
  BookOpen,
  FileCheck2,
  ExternalLink
} from 'lucide-react';
import { TestConductionRecord, TestConductionType } from '../../types';
import { StorageService } from '../../services/storage';

interface VerifiedTestConductionModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
}

export const VerifiedTestConductionModal: React.FC<VerifiedTestConductionModalProps> = ({
  isOpen,
  onClose,
  studentName
}) => {
  const [logs, setLogs] = useState<TestConductionRecord[]>(() =>
    StorageService.getTestConductionLogs()
  );
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredLogs = logs.filter((log) => {
    const matchesType = filterType === 'ALL' || log.testType === filterType;
    const matchesSearch =
      log.testTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.verificationHash.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `EduBridge_Test_Conduction_Audit_${Date.now()}.json`);
    dlAnchor.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-900/50 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" /> Cryptographically Verified
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {filteredLogs.length} Verified Entries
              </span>
            </div>
            <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Official Test & Lesson Conduction Ledger</span>
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Authentic record of all lessons, standardized mock exams, and practice sets conducted by{' '}
              <span className="text-amber-300 font-bold">{studentName || 'Learner'}</span> with timestamped completion proof.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Filters */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by test title, category, or verification hash..."
              className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Type Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'ALL', label: 'All Conductions' },
              { id: 'LESSON_UNIT', label: 'Unit Lessons' },
              { id: 'MOCK_EXAM', label: 'Mock Exams' },
              { id: 'PRACTICE_TEST', label: 'Practice Tests' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterType === f.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}

            <button
              onClick={handleExportJson}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 flex items-center gap-1.5 cursor-pointer shadow-2xs ml-auto"
              title="Download audit ledger as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit</span>
            </button>
          </div>
        </div>

        {/* Records List */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1 divide-y divide-slate-100">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <FileCheck2 className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-600">No test conduction records matched your criteria.</p>
              <p className="text-xs text-slate-400">Complete an interactive lesson or practice test to generate verification logs.</p>
            </div>
          ) : (
            filteredLogs.map((log) => {
              const formattedDate = new Date(log.timestamp).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={log.id}
                  className="pt-3.5 first:pt-0 flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 rounded-2xl bg-white hover:bg-slate-50/80 border border-slate-200/80 transition-all hover:border-indigo-200 hover:shadow-xs"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                        log.testType === 'LESSON_UNIT'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : log.testType === 'MOCK_EXAM'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {log.testType.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        {log.verificationHash}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formattedDate}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-slate-900 tracking-tight">
                      {log.testTitle}
                    </h4>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span>Course: <strong className="text-slate-700">{log.category}</strong></span>
                      <span>·</span>
                      <span>Conducted by: <strong className="text-slate-700">{log.userName}</strong> ({log.userRole})</span>
                    </div>

                    {log.details && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-150">
                        {log.details}
                      </p>
                    )}
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-400 block">Performance</span>
                      <span className="text-base font-black text-indigo-700 font-mono">
                        {log.score || 'Completed'}
                      </span>
                    </div>

                    {log.xpEarned && (
                      <span className="text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        +{log.xpEarned} XP
                      </span>
                    )}

                    <span className="flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      {log.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>EduBridge Cryptographic Audit Trail • Guaranteed tamper-evident log stored in local database.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
          >
            Close Ledger
          </button>
        </div>

      </div>
    </div>
  );
};
