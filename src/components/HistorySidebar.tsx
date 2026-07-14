import React from 'react';
import { History, PlayCircle, CheckCircle, XCircle, ChevronRight, Trash2, Calendar, FileText } from 'lucide-react';
import { HealingSession } from '../types';

interface HistorySidebarProps {
  sessions: Omit<HealingSession, 'files'>[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function HistorySidebar({ sessions, selectedId, onSelect, onDelete }: HistorySidebarProps) {
  return (
    <div className="bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col h-full transition-colors duration-300">
      <div className="flex items-center gap-2 mb-4 shrink-0 pb-3 border-b border-slate-200 dark:border-slate-800">
        <History className="h-4 w-4 text-slate-500 dark:text-slate-400" />
        <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
          Repository History
        </h3>
        <span className="ml-auto bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 text-[9px] font-mono px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400 font-bold uppercase">
          {sessions.length} runs
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 max-h-[400px] lg:max-h-[600px] pr-1">
        {sessions.length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 gap-1.5 text-center">
            <Calendar className="h-6 w-6 text-slate-400 dark:text-slate-700" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">No records available</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-600">Launch a session to begin logging</span>
          </div>
        ) : (
          sessions.map((sess) => {
            const isSelected = sess.id === selectedId;
            const isSuccess = sess.status === 'success';
            const isFailed = sess.status === 'failed';
            const isRunning = sess.status === 'running';

            return (
              <div
                key={sess.id}
                onClick={() => onSelect(sess.id)}
                className={`group relative p-3 rounded-lg border transition-all cursor-pointer flex flex-col gap-1.5 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/5'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0D1117] hover:bg-slate-100 dark:hover:bg-[#1b222c]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                    {new Date(sess.createdAt).toLocaleDateString()} at {new Date(sess.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  <div className="flex items-center gap-1">
                    {isSuccess && <CheckCircle className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />}
                    {isFailed && <XCircle className="h-3.5 w-3.5 text-rose-500 dark:text-rose-400" />}
                    {isRunning && <PlayCircle className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400 animate-spin" />}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(sess.id);
                      }}
                      className="p-1 opacity-0 group-hover:opacity-100 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-all"
                      title="Delete record"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="text-xs font-bold text-slate-900 dark:text-white font-display">
                  {sess.teamName} / {sess.leaderName}
                </div>

                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-mono">
                  {sess.branchName}
                </div>

                <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-slate-200 dark:border-slate-800/80 text-[10px] text-slate-500 dark:text-slate-400">
                  <span>
                    Accuracy: <span className="font-mono font-bold text-emerald-500 dark:text-emerald-400">{sess.metrics.successRate}%</span>
                  </span>
                  <span>
                    Score: <span className="font-mono font-bold text-indigo-500 dark:text-indigo-400">{sess.metrics.overallScore}</span>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
