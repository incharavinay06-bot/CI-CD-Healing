import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Shield, Cpu, RefreshCw, Trash2, Search, SlidersHorizontal, CheckCircle } from 'lucide-react';
import { LogLine } from '../types';

interface LogConsoleProps {
  logs: LogLine[];
  onClear: () => void;
}

export default function LogConsole({ logs, onClear }: LogConsoleProps) {
  const [filterAgent, setFilterAgent] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredLogs = logs.filter((log) => {
    const matchesAgent = filterAgent === 'all' || log.agent === filterAgent;
    const matchesLevel = filterLevel === 'all' || log.level === filterLevel;
    const matchesSearch = searchQuery === '' || log.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAgent && matchesLevel && matchesSearch;
  });

  const getAgentColor = (agent: string) => {
    switch (agent) {
      case 'repository': return 'text-sky-400';
      case 'analysis': return 'text-amber-400';
      case 'healing': return 'text-pink-400';
      case 'validation': return 'text-emerald-400';
      case 'reporting': return 'text-indigo-400';
      default: return 'text-zinc-400';
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'error': return 'text-rose-500 bg-rose-950/40 border-rose-900/60';
      case 'warn': return 'text-amber-500 bg-amber-950/40 border-amber-900/60';
      case 'success': return 'text-emerald-500 bg-emerald-950/40 border-emerald-900/60';
      case 'debug': return 'text-zinc-500 bg-zinc-950/40 border-zinc-900/60';
      default: return 'text-indigo-400 bg-indigo-950/40 border-indigo-900/60';
    }
  };

  return (
    <div className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col h-[500px] font-sans transition-colors duration-300">
      {/* Console Header */}
      <div className="bg-slate-50 dark:bg-[#161B22] px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 transition-colors duration-300">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-emerald-500 dark:text-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-slate-800 dark:text-white tracking-wider uppercase">
            Active agent execution console
          </span>
          <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700/50 text-[9px] font-mono text-slate-600 dark:text-slate-400 font-bold uppercase">
            {filteredLogs.length} lines
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClear}
            className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-850 rounded transition-colors cursor-pointer"
            title="Clear Console"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-50/50 dark:bg-[#161B22]/50 px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-3 transition-colors">
        {/* Search */}
        <div className="relative shrink-0 w-44">
          <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400 dark:text-slate-600" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stream..."
            className="w-full pl-8 pr-2.5 py-1 text-[10px] font-mono rounded bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Filter Agent */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-semibold">Agent:</span>
          <select
            value={filterAgent}
            onChange={(e) => setFilterAgent(e.target.value)}
            className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 text-[10px] font-mono rounded px-1.5 py-1 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="all">ALL AGENTS</option>
            <option value="repository">REPOSITORY</option>
            <option value="analysis">ANALYSIS</option>
            <option value="healing">HEALING</option>
            <option value="validation">VALIDATION</option>
            <option value="reporting">REPORTING</option>
            <option value="system">SYSTEM</option>
          </select>
        </div>

        {/* Filter Level */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-semibold">Severity:</span>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 text-[10px] font-mono rounded px-1.5 py-1 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="all">ALL LEVELS</option>
            <option value="info">INFO</option>
            <option value="warn">WARN</option>
            <option value="error">ERROR</option>
            <option value="success">SUCCESS</option>
          </select>
        </div>
      </div>

      {/* Terminal Display */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-slate-300 space-y-1.5 selection:bg-emerald-500/20 bg-slate-900 dark:bg-[#0A0C10]">
        {filteredLogs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-700 gap-2">
            <Terminal className="h-6 w-6 text-slate-800" />
            <span className="text-[10px] uppercase tracking-widest font-bold">Awaiting execution pipelines...</span>
          </div>
        ) : (
          filteredLogs.map((log, idx) => {
            const agentColor = getAgentColor(log.agent);
            return (
              <div key={idx} className="flex items-start gap-2 hover:bg-slate-900/40 px-1 rounded transition-colors py-0.5">
                <span className="text-[10px] text-slate-600 shrink-0 select-none">
                  [{new Date(log.timestamp).toLocaleTimeString()}]
                </span>
                
                <span className={`text-[10px] font-bold uppercase shrink-0 select-none ${agentColor}`}>
                  {log.agent.padEnd(10, ' ')}
                </span>

                <div className="flex-1 break-all leading-relaxed whitespace-pre-wrap">
                  {log.message}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
