import React, { useState, useEffect } from 'react';
import { Sparkles, Terminal, Moon, Sun, Download, RefreshCw, AlertCircle, PlayCircle, Layers, FileText, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import SubmissionPanel from './components/SubmissionPanel';
import MetricsCards from './components/MetricsCards';
import RepositoryStatus from './components/RepositoryStatus';
import Timeline from './components/Timeline';
import FixesAppliedTable from './components/FixesAppliedTable';
import LogConsole from './components/LogConsole';
import HistorySidebar from './components/HistorySidebar';
import ErrorTrendGraph from './components/ErrorTrendGraph';
import CodeViewerModal from './components/CodeViewerModal';
import { generatePDFReport } from './utils/pdfGenerator';

import { HealingSession, LogLine, TimelineStep, AppliedFix, Metrics } from './types';

export default function App() {
  const [sessions, setSessions] = useState<Omit<HealingSession, 'files'>[]>([]);
  const [activeSession, setActiveSession] = useState<HealingSession | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [toasts, setToasts] = useState<{ id: string; text: string; type: 'success' | 'warn' | 'error' }[]>([]);
  const [geminiMissing, setGeminiMissing] = useState(false);

  // Load theme on startup
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Toast notifier helper
  const showToast = (text: string, type: 'success' | 'warn' | 'error' = 'success') => {
    const id = Math.random().toString();
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Fetch session list
  const fetchSessionList = async () => {
    try {
      const res = await fetch('/api/sessions');
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch (err) {
      console.error("Failed to load historical sessions:", err);
    }
  };

  // Fetch single session detail
  const fetchSessionDetail = async (id: string, updateActive = true) => {
    try {
      const res = await fetch(`/api/sessions/${id}`);
      if (res.ok) {
        const data: HealingSession = await res.json();
        if (updateActive) {
          setActiveSession(data);
        }
        
        // Detect if gemini key configuration is missing from logs
        const isMissingKey = data.logs.some(l => l.message.includes("GEMINI_API_KEY is not configured"));
        if (isMissingKey) {
          setGeminiMissing(true);
        }
        return data;
      }
    } catch (err) {
      console.error("Failed to fetch session detail:", err);
    }
    return null;
  };

  // Start mount fetches
  useEffect(() => {
    fetchSessionList();
  }, []);

  // Polling mechanism for active running sessions
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const poll = async () => {
      if (!selectedSessionId) return;
      const data = await fetchSessionDetail(selectedSessionId);
      
      if (data && data.status === 'running') {
        timer = setTimeout(poll, 1500);
      } else if (data) {
        // Complete! Refresh history sidebar too
        fetchSessionList();
        if (data.status === 'success') {
          showToast(`Autonomous Healing complete: Success score ${data.metrics.overallScore}/100!`, 'success');
        } else {
          showToast(`Autonomous pipeline concluded with failures. Review logs.`, 'error');
        }
      }
    };

    if (selectedSessionId) {
      poll();
    }

    return () => clearTimeout(timer);
  }, [selectedSessionId]);

  const handleStartSession = async (submission: { repoUrl: string; teamName: string; leaderName: string; templateId: string }) => {
    try {
      showToast("Repository Agent dispatched: Setting up workspace...", "success");
      const res = await fetch('/api/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to start session.");
      }

      const { sessionId } = await res.json();
      setSelectedSessionId(sessionId);
      
      // Promptly refresh history sidebar with new loading item
      fetchSessionList();
    } catch (err: any) {
      showToast(err.message || "Pipeline launch aborted", "error");
      if (err.message.includes("GEMINI_API_KEY")) {
        setGeminiMissing(true);
      }
    }
  };

  const handleDeleteSession = async (id: string) => {
    // Simply remove local session element
    setSessions(prev => prev.filter(s => s.id !== id));
    if (selectedSessionId === id) {
      setSelectedSessionId(null);
      setActiveSession(null);
    }
    showToast("Audit log session cleared.", "warn");
  };

  const handleClearLogs = () => {
    if (activeSession) {
      setActiveSession(prev => prev ? { ...prev, logs: [] } : null);
      showToast("Console terminal logs cleared.", "warn");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0C10] text-slate-800 dark:text-slate-200 transition-colors duration-300 font-sans">
      
      {/* Absolute Toast Container */}
      <div className="fixed top-5 right-5 z-50 space-y-2 max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-3.5 rounded-xl shadow-xl border text-xs font-medium flex items-center gap-2.5 pointer-events-auto bg-white dark:bg-[#161B22] border-slate-200 dark:border-slate-800 ${
                t.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' :
                t.type === 'warn' ? 'text-amber-600 dark:text-amber-400' :
                'text-rose-600 dark:text-rose-400'
              }`}
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{t.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Primary Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0D1117]/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)] shrink-0 animate-pulse"></div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-display font-bold text-base tracking-tight text-slate-900 dark:text-white uppercase">
                  HEALER.AI
                </h1>
                <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase">
                  Autonomous DevOps Agent
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Self-healing CI/CD pipeline controller powered by Gemini GenAI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {activeSession && (
              <button
                onClick={() => generatePDFReport(activeSession)}
                className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer transition-all"
              >
                <Download className="h-3.5 w-3.5" />
                Download Full Report
              </button>
            )}

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Top metrics dashboard bar */}
        <MetricsCards
          metrics={activeSession ? activeSession.metrics : { errorsDetected: 0, errorsFixed: 0, successRate: 0, iterationsUsed: 0, overallScore: 0 }}
          status={activeSession ? activeSession.status : 'idle'}
        />

        {/* Primary Functional Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Controls & History */}
          <div className="lg:col-span-4 space-y-6">
            <SubmissionPanel
              onStart={handleStartSession}
              isLoading={activeSession?.status === 'running'}
              geminiMissing={geminiMissing}
            />

            <HistorySidebar
              sessions={sessions}
              selectedId={selectedSessionId}
              onSelect={(id) => setSelectedSessionId(id)}
              onDelete={handleDeleteSession}
            />
          </div>

          {/* Right Live Operations Visualizers */}
          <div className="lg:col-span-8 space-y-6">
            
            {!activeSession ? (
              // Idle Welcome Card
              <div className="bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[480px] transition-colors duration-300">
                <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/20">
                  <PlayCircle className="h-8 w-8 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                  Ready to Dispatch Autonomous DevOps Loop
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
                  Provide custom repositories or select a sandbox project template in the configuration panel, then trigger live AI healing to analyze stack traces and repair code breaches.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" /> Repository Agent
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Analysis Agent
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> Healing Agent
                  </span>
                </div>
              </div>
            ) : (
              // Active Run Dashboards
              <div className="space-y-6">
                
                {/* Visual Agent Header indicator */}
                <div className="bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm transition-colors duration-300">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Terminal className="h-4.5 w-4.5" />
                      </div>
                      {activeSession.status === 'running' && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-[10px] font-mono font-bold uppercase text-indigo-600 dark:text-indigo-400">
                        Active Branch: {activeSession.branchName}
                      </div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-white">
                        Analyzing: <span className="font-mono text-slate-500 dark:text-slate-400">{activeSession.repoUrl}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeSession.status === 'running' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        <RefreshCw className="h-3 w-3 animate-spin" /> Active Agent: {activeSession.currentAgent.toUpperCase()}
                      </span>
                    )}

                    {activeSession.status === 'success' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Pipeline Healed
                      </span>
                    )}

                    {activeSession.status === 'failed' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        <AlertCircle className="h-3.5 w-3.5" /> Pipeline Failed
                      </span>
                    )}

                    <button
                      onClick={() => generatePDFReport(activeSession)}
                      className="sm:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                      title="Download Full Report"
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Status and Chronological Timeline Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <RepositoryStatus
                    timeline={activeSession.timeline}
                    currentAgent={activeSession.currentAgent}
                  />
                  <Timeline
                    timeline={activeSession.timeline}
                  />
                </div>

                {/* Error Reduction curves & Trend Charts */}
                <ErrorTrendGraph
                  currentSession={activeSession}
                  history={sessions}
                />

                {/* Live Output Console Logging Terminal */}
                <LogConsole
                  logs={activeSession.logs}
                  onClear={handleClearLogs}
                />

                {/* Applied Patches Table */}
                <FixesAppliedTable
                  fixes={activeSession.appliedFixes}
                />

                {/* Code Workspace File browser */}
                {Object.keys(activeSession.files).length > 0 && (
                  <CodeViewerModal
                    files={activeSession.files}
                    sessionId={activeSession.id}
                  />
                )}

              </div>
            )}

          </div>

        </div>

      </main>

      {/* Decorative footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 mt-20 py-8 bg-white dark:bg-[#0D1117] text-center text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">
        <p>HEALER.AI • Autonomous CI/CD Healing Agent • Google AI Studio Build Applet</p>
      </footer>
    </div>
  );
}
