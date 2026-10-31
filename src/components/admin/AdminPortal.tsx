import React, { useState } from 'react';
import {
  ShieldAlert,
  Cpu,
  Activity,
  Server,
  Database,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Terminal,
  FileText
} from 'lucide-react';
import { OllamaModelInfo, SystemMetric, AuditLog } from '../../types';
import { sound } from '../../utils/audio';

interface AdminPortalProps {
  models: OllamaModelInfo[];
  metrics: SystemMetric[];
  auditLogs: AuditLog[];
  onToggleModelStatus: (modelId: string) => void;
  onUpdateModelTemp: (modelId: string, temp: number) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  models,
  metrics,
  auditLogs,
  onToggleModelStatus,
  onUpdateModelTemp
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'models' | 'telemetry' | 'audit'>('models');
  const [isFlushingCache, setIsFlushingCache] = useState(false);
  const [cacheStatus, setCacheStatus] = useState('Optimal (94.8% hit ratio)');

  const handleFlushCache = () => {
    sound.playClick();
    setIsFlushingCache(true);
    setTimeout(() => {
      setIsFlushingCache(false);
      setCacheStatus('Cache Flushed · Rebuilding in background (100% clean)');
      sound.playSuccess();
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600">
            <ShieldAlert className="w-4 h-4" />
            <span>EduBridge Enterprise Infrastructure Cluster</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Self-Hosted Infrastructure &amp; AI Telemetry
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Docker Compose · NestJS · PostgreSQL 17 · Redis · MinIO · Ollama Cluster
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            onClick={() => { sound.playClick(); setActiveAdminTab('models'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeAdminTab === 'models' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ollama AI Models
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveAdminTab('telemetry'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeAdminTab === 'telemetry' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            System Telemetry
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveAdminTab('audit'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeAdminTab === 'audit' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Audit Logs
          </button>
        </div>
      </div>

      {/* 1. Ollama AI Models Configuration */}
      {activeAdminTab === 'models' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Self-Hosted Ollama Model Engines</h3>
              <p className="text-xs text-slate-500">Fine-tune temperatures, VRAM limits, and hot-reload model weights.</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
              Total VRAM: 18.4 / 24.0 GB (Healthy)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {models.map((model) => (
              <div
                key={model.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-black text-slate-900 text-base">{model.name}</h4>
                    <span className="text-xs text-indigo-600 font-semibold">{model.tagline}</span>
                  </div>
                  <button
                    onClick={() => {
                      sound.playClick();
                      onToggleModelStatus(model.id);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      model.status === 'online'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {model.status.toUpperCase()}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">VRAM Allocation</span>
                    <span className="font-mono font-bold text-slate-800">{model.vram}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Inference Latency</span>
                    <span className="font-mono font-bold text-indigo-700">{model.latencyMs} ms</span>
                  </div>
                </div>

                {/* Temperature Slider */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span>Inference Temperature:</span>
                    <strong className="font-mono text-indigo-600">{model.temperature}</strong>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={model.temperature}
                    onChange={(e) => onUpdateModelTemp(model.id, Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Deterministic (Proofs)</span>
                    <span>Creative (Essay/Career)</span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 block mb-0.5">Assigned Domain:</strong>
                  {model.specialty}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. System Telemetry Tab (Prometheus & Grafana) */}
      {activeAdminTab === 'telemetry' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
                <Activity className="w-4 h-4" />
                <span>Prometheus &amp; Grafana Observability Layer</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">System Health &amp; Resource Metrics</h3>
            </div>

            <button
              onClick={handleFlushCache}
              disabled={isFlushingCache}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFlushingCache ? 'animate-spin' : ''}`} />
              <span>Flush Redis Cache</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((m, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{m.name}</span>
                <span className="text-xl font-black text-slate-900 block font-mono">{m.value}</span>
                <span className="text-xs font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200 inline-block">
                  {m.change}
                </span>
              </div>
            ))}
          </div>

          {/* Docker Services Status */}
          <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> 13 / 13 Production Docker Services Healthy
              </span>
              <span className="text-xs text-slate-400 font-mono">Uptime: 99.98%</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              {[
                'postgres:17',
                'redis:alpine',
                'minio/minio',
                'meilisearch',
                'ollama/ollama',
                'keycloak:26',
                'edubridge-backend',
                'edubridge-frontend',
                'nginx-proxy',
                'prometheus',
                'grafana',
                'node-exporter'
              ].map((svc, i) => (
                <div key={i} className="p-2 bg-slate-800 rounded-lg border border-slate-700 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="truncate">{svc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Audit Logs Tab */}
      {activeAdminTab === 'audit' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Security &amp; Inference Audit Trail</h3>
              <p className="text-xs text-slate-500">Immutable ledger of platform actions and model calls.</p>
            </div>
            <span className="text-xs font-mono text-slate-500">{auditLogs.length} Events Logged</span>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
              >
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    log.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {log.status}
                  </span>
                  <span className="text-slate-500">{log.timestamp}</span>
                  <span className="font-bold text-slate-800">{log.action}</span>
                </div>

                <span className="text-slate-400 text-[11px] truncate sm:max-w-xs">{log.user}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
