import React from 'react';
import { AlertCircle, CheckCircle2, Award, Zap, Percent } from 'lucide-react';
import { Metrics } from '../types';

interface MetricsCardsProps {
  metrics: Metrics;
  status: string;
}

export default function MetricsCards({ metrics, status }: MetricsCardsProps) {
  const items = [
    {
      id: 'detected',
      name: 'Errors Detected',
      value: metrics.errorsDetected,
      icon: AlertCircle,
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/40',
      borderColor: 'border-rose-100 dark:border-rose-900/40',
      description: 'Total syntax & logical failures'
    },
    {
      id: 'fixed',
      name: 'Errors Fixed',
      value: metrics.errorsFixed,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
      borderColor: 'border-emerald-100 dark:border-emerald-900/40',
      description: 'Patched files compiled'
    },
    {
      id: 'rate',
      name: 'Success Rate',
      value: `${metrics.successRate}%`,
      icon: Percent,
      color: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/40',
      borderColor: 'border-cyan-100 dark:border-cyan-900/40',
      description: 'Resolved issue proportion'
    },
    {
      id: 'iterations',
      name: 'Iterations Used',
      value: `${metrics.iterationsUsed}/3`,
      icon: Zap,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40',
      borderColor: 'border-amber-100 dark:border-amber-900/40',
      description: 'Healing feedback loops'
    },
    {
      id: 'score',
      name: 'DevOps Score',
      value: `${metrics.overallScore}/100`,
      icon: Award,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/40',
      borderColor: 'border-indigo-100 dark:border-indigo-900/40',
      description: 'Reliability benchmark'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            id={`metric-card-${item.id}`}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161B22] shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none">
                {item.name}
              </span>
              <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/30">
                <Icon className={`h-3.5 w-3.5 ${item.color}`} />
              </div>
            </div>
            <div className="flex items-end justify-between mt-2 gap-2">
              <span className="text-3xl font-light text-slate-900 dark:text-white tracking-tight leading-none font-mono">
                {status === 'idle' ? '—' : item.value}
              </span>
              <span className={`text-[9px] uppercase tracking-wider font-semibold font-mono ${item.color}`}>
                Active
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 leading-tight">
              {item.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
