import React from 'react';
import { GitCommit, Search, ShieldCheck, ArrowRightLeft, FolderGit, Cpu, CircleCheck } from 'lucide-react';
import { TimelineStep } from '../types';

interface TimelineProps {
  timeline: TimelineStep[];
}

export default function Timeline({ timeline }: TimelineProps) {
  // Map icons to timeline steps
  const getStepIcon = (id: string) => {
    switch (id) {
      case 'clone':
        return FolderGit;
      case 'branch':
        return ArrowRightLeft;
      case 'analysis':
        return Search;
      case 'healing':
        return Cpu;
      case 'testing':
        return ShieldCheck;
      case 'commit':
        return GitCommit;
      case 'push':
        return CircleCheck;
      default:
        return Cpu;
    }
  };

  return (
    <div className="bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm font-sans transition-colors duration-300">
      <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-5 flex items-center gap-2">
        CI/CD Timeline Audit Trail
      </h3>

      <div className="relative pl-6 border-l border-slate-200 dark:border-slate-800 ml-3 space-y-6">
        {timeline.map((step) => {
          const StepIcon = getStepIcon(step.id);
          const isPending = step.status === 'pending';
          const isRunning = step.status === 'running';
          const isCompleted = step.status === 'completed';
          const isFailed = step.status === 'failed';

          return (
            <div key={step.id} className="relative group" id={`timeline-step-${step.id}`}>
              {/* Timeline dot */}
              <div
                className={`absolute -left-[35px] top-0.5 h-6.5 w-6.5 rounded-full border flex items-center justify-center transition-all ${
                  isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : isRunning
                    ? 'bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400 animate-pulse'
                    : isFailed
                    ? 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400'
                    : 'bg-slate-50 dark:bg-[#0D1117] border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600'
                }`}
              >
                <StepIcon className="h-3 w-3" />
              </div>

              {/* Step info */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1">
                <div>
                  <h4
                    className={`text-xs font-bold font-display ${
                      isCompleted
                        ? 'text-slate-800 dark:text-white'
                        : isRunning
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : isFailed
                        ? 'text-rose-600 dark:text-rose-400 font-bold'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {step.timestamp && (
                  <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 whitespace-nowrap shrink-0 mt-0.5">
                    {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
