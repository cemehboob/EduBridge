import React, { useState, useEffect } from 'react';
import {
  X,
  Wifi,
  WifiOff,
  Download,
  Upload,
  RotateCcw,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  FileJson,
  Server,
  RefreshCw,
  Globe
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { apiService, getCentralServerUrl, setCentralServerUrl } from '../../services/apiService';
import { sound } from '../../utils/audio';

interface OfflineSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  isOnline: boolean;
  onDataImported: () => void;
}

export const OfflineSyncModal: React.FC<OfflineSyncModalProps> = ({
  isOpen,
  onClose,
  isOnline,
  onDataImported
}) => {
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Central Server Multi-Machine Sync State
  const [serverUrlInput, setServerUrlInput] = useState<string>(() => getCentralServerUrl());
  const [serverPingStatus, setServerPingStatus] = useState<{
    tested: boolean;
    healthy: boolean;
    latencyMs?: number;
    stats?: any;
    error?: string;
  }>({ tested: false, healthy: false });
  const [isPingingServer, setIsPingingServer] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setServerUrlInput(getCentralServerUrl());
      handleTestConnection();
    }
  }, [isOpen]);

  const handleTestConnection = async (overrideUrl?: string) => {
    setIsPingingServer(true);
    setSyncStatusMsg(null);
    const target = overrideUrl !== undefined ? overrideUrl : serverUrlInput;
    const res = await apiService.health.check(target);
    setIsPingingServer(false);
    setServerPingStatus({
      tested: true,
      healthy: res.healthy,
      latencyMs: res.latencyMs,
      stats: res.stats,
      error: res.error
    });
    if (res.healthy) {
      sound.playSuccess();
    }
  };

  const handleSaveServerUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    setCentralServerUrl(serverUrlInput.trim());
    await handleTestConnection(serverUrlInput.trim());
    setSyncStatusMsg('✓ Central Server URL updated. Client is now pointing to this server.');
  };

  const handleResetServerUrl = () => {
    sound.playClick();
    setCentralServerUrl(null);
    const def = getCentralServerUrl();
    setServerUrlInput(def);
    handleTestConnection(def);
    setSyncStatusMsg('✓ Reset to auto-detected server URL.');
  };

  const handleForceFlushAndPull = async () => {
    sound.playClick();
    setIsPingingServer(true);
    try {
      const flushRes = await StorageService.flushPendingSyncQueue();
      const pullRes = await apiService.activities.getAll();
      if (pullRes && Array.isArray(pullRes.items)) {
        StorageService.saveUserActivities(pullRes.items);
      }
      sound.playLevelUp();
      setSyncStatusMsg(`✓ Synced successfully! Flushed ${flushRes.flushedActivities} pending items, pulled ${pullRes.items.length} server records.`);
      await handleTestConnection();
    } catch (err: any) {
      sound.playError();
      setSyncStatusMsg(`✕ Sync failed: ${err.message}`);
    } finally {
      setIsPingingServer(false);
    }
  };

  if (!isOpen) return null;

  const handleExport = () => {
    sound.playClick();
    const dataStr = StorageService.exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edubridge_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    sound.playSuccess();
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return;
    const ok = StorageService.importData(importText.trim());
    if (ok) {
      sound.playSuccess();
      setImportStatus('success');
      setTimeout(() => {
        onDataImported();
        onClose();
      }, 1200);
    } else {
      sound.playError();
      setImportStatus('error');
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all EduBridge progress to default enterprise state?')) {
      sound.playClick();
      StorageService.resetToDefault();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-slate-200 space-y-6 p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-indigo-600" />
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Offline-First &amp; Data Portability</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Network & Local Storage Status */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isOnline ? (
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Wifi className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <WifiOff className="w-5 h-5" />
              </div>
            )}
            <div>
              <p className="text-sm font-bold text-slate-900">
                {isOnline ? 'Online (Self-Hosted Cloud Connected)' : 'Offline First Mode Active'}
              </p>
              <p className="text-xs text-slate-500">
                All lessons, flashcards, mock tests, and notes are cached locally in your browser.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600 shrink-0">100% Synced</span>
        </div>

        {/* Central Server Multi-Machine Connection Settings */}
        <div className="p-4 rounded-2xl border border-indigo-200 bg-indigo-50/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-950">
                Central Server Multi-Machine Synchronization
              </h4>
            </div>
            {serverPingStatus.tested && (
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                serverPingStatus.healthy
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${serverPingStatus.healthy ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                <span>{serverPingStatus.healthy ? `Connected (${serverPingStatus.latencyMs}ms)` : 'Unreachable'}</span>
              </span>
            )}
          </div>

          <p className="text-xs text-slate-600">
            Configure the Central Server URL for multi-machine synchronization. When tests are completed on Machine A, they are saved centrally so administrators on Machine B can review them immediately.
          </p>

          <form onSubmit={handleSaveServerUrl} className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={serverUrlInput}
                  onChange={(e) => setServerUrlInput(e.target.value)}
                  placeholder="e.g. http://192.168.1.50:3000 or http://localhost:3000"
                  className="w-full pl-9 pr-3 py-2 text-xs font-mono rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-2xs shrink-0 cursor-pointer"
              >
                Save Server URL
              </button>
            </div>
          </form>

          {syncStatusMsg && (
            <div className="text-xs font-semibold text-indigo-900 bg-white/80 p-2.5 rounded-xl border border-indigo-100">
              {syncStatusMsg}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-indigo-100/80">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleTestConnection()}
                disabled={isPingingServer}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isPingingServer ? 'animate-spin text-indigo-600' : ''}`} />
                <span>Test Connection</span>
              </button>
              <button
                type="button"
                onClick={handleResetServerUrl}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 hover:underline"
              >
                Reset to Auto-Detect
              </button>
            </div>

            <button
              type="button"
              onClick={handleForceFlushAndPull}
              disabled={isPingingServer}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isPingingServer ? 'animate-spin' : ''}`} />
              <span>Sync All Data Now</span>
            </button>
          </div>
        </div>

        {/* Backup Export */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Data Sovereignty</h4>
          <div className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-800">Export Complete Study Vault</p>
              <p className="text-xs text-slate-500">Download your study progress, XP, resume, and mock exams as JSON.</p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* Backup Import */}
        <form onSubmit={handleImportSubmit} className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Restore Study Vault</h4>
          <textarea
            rows={3}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Paste your exported EduBridge JSON backup here to restore state..."
            className="w-full p-3 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex justify-between items-center">
            {importStatus === 'success' && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Restored successfully!
              </span>
            )}
            {importStatus === 'error' && (
              <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Invalid JSON file structure.
              </span>
            )}
            <button
              type="submit"
              disabled={!importText.trim()}
              className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-black disabled:bg-slate-300 text-white text-xs font-bold shadow-xs shrink-0"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import &amp; Restore</span>
            </button>
          </div>
        </form>

        {/* Reset */}
        <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
          <span className="text-xs text-slate-400">Need to start fresh?</span>
          <button
            onClick={handleReset}
            className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Initial State</span>
          </button>
        </div>

      </div>
    </div>
  );
};
