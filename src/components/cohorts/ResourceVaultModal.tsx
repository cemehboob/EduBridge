import React, { useState } from 'react';
import {
  X,
  Download,
  Printer,
  FileText,
  Search,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Filter
} from 'lucide-react';
import { AgeCohortId, ResourceVaultItem } from '../../types';
import { resourceVaultItems } from '../../data/ageCohortsData';
import { sound } from '../../utils/audio';

interface ResourceVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCohort?: AgeCohortId;
}

export const ResourceVaultModal: React.FC<ResourceVaultModalProps> = ({
  isOpen,
  onClose,
  defaultCohort
}) => {
  const [selectedCohort, setSelectedCohort] = useState<string>(defaultCohort || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState<ResourceVaultItem>(resourceVaultItems[0]);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const filteredItems = resourceVaultItems.filter((item) => {
    const matchesCohort = selectedCohort === 'all' || item.cohort === selectedCohort;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCohort && matchesSearch;
  });

  const handleDownload = (item: ResourceVaultItem) => {
    sound.playClick();
    const blob = new Blob([item.printableContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = item.downloadFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    sound.playSuccess();
  };

  const handlePrint = () => {
    sound.playClick();
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>${activeItem.title} - EduBridge Resource Vault</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace; padding: 30px; line-height: 1.6; color: #1e293b; }
            h1 { font-size: 20px; border-bottom: 2px solid #0284c7; padding-bottom: 8px; }
            pre { white-space: pre-wrap; font-family: monospace; background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 13px; }
            .badge { display: inline-block; padding: 4px 10px; background: #e0f2fe; color: #0369a1; border-radius: 6px; font-size: 12px; font-weight: bold; margin-bottom: 12px; }
          </style>
        </head>
        <body>
          <div class="badge">${activeItem.cohortLabel}</div>
          <h1>${activeItem.title}</h1>
          <p><strong>Category:</strong> ${activeItem.category}</p>
          <pre>${activeItem.printableContent}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const handleCopy = () => {
    sound.playClick();
    navigator.clipboard.writeText(activeItem.printableContent);
    setCopied(true);
    sound.playSuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-blue-600 to-teal-600 px-6 py-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-md">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight">EduBridge Universal Resource Vault</h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/20 text-white">
                  Ages 5 to 100+
                </span>
              </div>
              <p className="text-xs text-blue-100">
                Curated printable study sheets, cheat-sheets, and offline references for all 5 developmental stages.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Close Vault"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-500 shrink-0" />
            <select
              value={selectedCohort}
              onChange={(e) => {
                sound.playClick();
                setSelectedCohort(e.target.value);
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Developmental Stages (Ages 5–100+)</option>
              <option value="early">🧸 Ages 5–8: Little Explorers</option>
              <option value="junior">🎒 Ages 9–14: Junior Scholars</option>
              <option value="academy">🎓 Ages 15–24: Academy &amp; Exams</option>
              <option value="pro">💼 Ages 25–54: Professional Fluency</option>
              <option value="senior">🌿 Ages 55+: Golden Age</option>
            </select>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search cheat-sheets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Split Content: Left List / Right Preview */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 min-h-0 overflow-hidden">
          
          {/* List Sidebar */}
          <div className="md:col-span-5 border-r border-slate-200 overflow-y-auto p-3 space-y-2.5 bg-slate-50/50">
            {filteredItems.map((item) => {
              const isSelected = activeItem.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveItem(item);
                  }}
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all border text-left ${
                    isSelected
                      ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/10'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {item.badge}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{item.cohortLabel.split(':')[0]}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{item.description}</p>
                </div>
              );
            })}
          </div>

          {/* Right Document Preview */}
          <div className="md:col-span-7 flex flex-col min-h-0 overflow-hidden bg-white">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-3 bg-white shrink-0">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-600">{activeItem.category}</span>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">{activeItem.title}</h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <FileText className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => handleDownload(activeItem)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Document Content View */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 font-mono text-xs sm:text-sm text-slate-800 bg-slate-900 text-emerald-300 leading-relaxed rounded-b-2xl m-3 whitespace-pre-wrap selection:bg-emerald-500 selection:text-black">
              {activeItem.printableContent}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

