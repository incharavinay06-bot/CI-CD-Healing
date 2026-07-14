import React from 'react';
import { CheckCircle2, Circle, Loader2, XCircle } from 'lucide-react';
import { TimelineStep } from '../types';

interface RepositoryStatusProps {
  timeline: TimelineStep[];
  currentAgent: string;
}

export default function RepositoryStatus({ timeline, currentAgent }: RepositoryStatusProps) {
  // Map steps to status sections
  const sections = [
    { id: 'clone', label: 'Clone Status' },
    { id: 'branch', label: 'Branch Creation' },
    { id: 'analysis', label: 'Analysis Status' },
    { id: 'healing', label: 'Fix Status' },
    { id: 'testing', label: 'Testing Status' },
    { id: 'push', label: 'Push Status' }
  ];

  const getStatusDisplay = (stepId: string) => {
    const step = timeline.find(s => s.id === stepId || (stepId === 'testing' && s.id === 'testing') || (stepId === 'push' && s.id === 'push'));
    
    if (!step) {
      return { text: 'Idle', color: 'text-zinc-400 dark:text-zinc-600', icon: Circle };
    }

    switch (step.status) {
      case 'completed':
        return { text: 'Successful', color: 'text-emerald-600 dark:text-emerald-400 font-medium', icon: CheckCircle2 };
      case 'running':
        return { text: 'Active', color: 'text-indigo-600 dark:text-indigo-400 font-medium animate-pulse', icon: Loader2 };
      case 'failed':
        return { text: 'Failed', color: 'text-rose-600 dark:text-rose-400 font-semibold', icon: XCircle };
      default:
        return { text: 'Pending', color: 'text-zinc-400 dark:text-zinc-600', icon: Circle };
    }
  };

  return (
    <div className="bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm h-full font-sans transition-colors duration-300">
      <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse shrink-0" />
        Repository State Engine
      </h3>

      <div className="space-y-3">
        {sections.map((sec) => {
          const { text, color, icon: Icon } = getStatusDisplay(sec.id);
          const isActive = timeline.find(s => s.id === sec.id)?.status === 'running';

          return (
            <div
              key={sec.id}
              id={`repo-status-${sec.id}`}
              className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                isActive
                  ? 'border-emerald-500 bg-emerald-500/5 shadow-[0_0_8px_rgba(16,185,129,0.05)]'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0D1117] hover:bg-slate-100 dark:hover:bg-[#1b222c]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isActive ? (
                  <Icon className="h-4 w-4 text-emerald-500 dark:text-emerald-400 animate-spin shrink-0" />
                ) : (
                  <Icon className={`h-4 w-4 shrink-0 ${
                    text === 'Successful' ? 'text-emerald-500 dark:text-emerald-400' : text === 'Failed' ? 'text-rose-500 dark:text-rose-400' : 'text-slate-400 dark:text-slate-700'
                  }`} />
                )}
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-display">{sec.label}</span>
              </div>
              <span className={`text-[10px] uppercase tracking-wider font-bold font-mono ${color}`}>{text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
