import React, { useState } from 'react';
import { Eye, ChevronDown, ChevronUp, CheckCircle, RefreshCw, AlertTriangle, FileCode } from 'lucide-react';
import { AppliedFix } from '../types';

interface FixesAppliedTableProps {
  fixes: AppliedFix[];
}

export default function FixesAppliedTable({ fixes }: FixesAppliedTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40">
            <CheckCircle className="h-2.5 w-2.5" /> Resolved
          </span>
        );
      case 're-evaluating':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40 animate-pulse">
            <RefreshCw className="h-2.5 w-2.5 animate-spin" /> Verifying
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40">
            <AlertTriangle className="h-2.5 w-2.5" /> Failed
          </span>
        );
    }
  };

  const getErrorTypeBadge = (type: string) => {
    const styleMap: { [key: string]: string } = {
      'syntax': 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
      'lint': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
      'type-checking': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
      'logical': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
      'test-failure': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
    };
    return (
      <span className={`px-1.5 py-0.5 text-[9px] font-mono rounded font-medium uppercase tracking-wider ${styleMap[type] || 'bg-zinc-100 text-zinc-800'}`}>
        {type}
      </span>
    );
  };

  const getSeverityBadge = (severity?: 'Critical' | 'Warning' | 'Info', errorType?: string) => {
    let resolvedSeverity: 'Critical' | 'Warning' | 'Info' = severity || 'Warning';
    if (!severity && errorType) {
      if (errorType === 'syntax' || errorType === 'test-failure') {
        resolvedSeverity = 'Critical';
      } else if (errorType === 'lint') {
        resolvedSeverity = 'Info';
      } else {
        resolvedSeverity = 'Warning';
      }
    }

    const styleMap = {
      Critical: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      Warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      Info: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${styleMap[resolvedSeverity]}`}>
        {resolvedSeverity}
      </span>
    );
  };

  if (fixes.length === 0) {
    return (
      <div className="bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-sm font-sans transition-colors duration-300">
        <FileCode className="h-8 w-8 text-slate-400 dark:text-slate-700 mx-auto mb-2" />
        <p className="text-xs text-slate-500 dark:text-slate-400">No fixes applied yet. Start a session or wait for the healing agent to process.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden font-sans transition-colors duration-300">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
          Applied Code Patches ({fixes.length})
        </h3>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
          Click any row to inspect side-by-side patch diffs
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-[#0D1117] text-[9px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-200 dark:border-slate-800">
              <th className="px-5 py-3">Where it was (File Path)</th>
              <th className="px-5 py-3">Severity</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Exactly what the Error was</th>
              <th className="px-5 py-3">What Fix was Applied</th>
              <th className="px-5 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {fixes.map((fix) => {
              const isExpanded = expandedId === fix.id;
              return (
                <React.Fragment key={fix.id}>
                  <tr
                    id={`fix-row-${fix.id}`}
                    onClick={() => toggleExpand(fix.id)}
                    className="hover:bg-slate-50 dark:hover:bg-[#1b222c] cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3.5 text-xs font-bold font-mono text-slate-800 dark:text-slate-200">
                      {fix.fileName}
                    </td>
                    <td className="px-5 py-3.5">
                      {getSeverityBadge(fix.severity, fix.errorType)}
                    </td>
                    <td className="px-5 py-3.5">
                      {getErrorTypeBadge(fix.errorType)}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-600 dark:text-slate-400 max-w-xs truncate">
                      {fix.originalIssue}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-600 dark:text-slate-400 max-w-sm truncate">
                      {fix.fixApplied}
                    </td>
                    <td className="px-5 py-3.5 text-right flex items-center justify-end gap-2.5">
                      {getStatusBadge(fix.status)}
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400 dark:text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-400 dark:text-slate-500" />}
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr id={`fix-diff-${fix.id}`} className="bg-slate-50/50 dark:bg-[#0D1117]/40">
                      <td colSpan={6} className="px-5 py-4 border-t border-slate-200 dark:border-slate-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Original Column */}
                          <div>
                            <div className="flex items-center justify-between bg-rose-500/10 border-b border-rose-500/20 px-3 py-1.5 rounded-t-lg">
                              <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider font-mono">
                                Original Code (With Failures)
                              </span>
                            </div>
                            <pre className="p-3 bg-slate-900 dark:bg-[#0D1117] border border-rose-500/10 text-[11px] font-mono text-rose-400 rounded-b-lg overflow-x-auto max-h-72 leading-relaxed whitespace-pre">
                              {fix.originalCode}
                            </pre>
                          </div>

                          {/* Healed Column */}
                          <div>
                            <div className="flex items-center justify-between bg-emerald-500/10 border-b border-emerald-500/20 px-3 py-1.5 rounded-t-lg">
                              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-mono">
                                Healed Code (All Tests Passed)
                              </span>
                            </div>
                            <pre className="p-3 bg-slate-900 dark:bg-[#0D1117] border border-emerald-500/10 text-[11px] font-mono text-emerald-400 rounded-b-lg overflow-x-auto max-h-72 leading-relaxed whitespace-pre">
                              {fix.fixedCode}
                            </pre>
                          </div>
                        </div>

                        <div className="mt-3 flex gap-2 justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const blob = new Blob([fix.fixedCode], { type: 'text/plain' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = fix.fileName;
                              a.click();
                            }}
                            className="px-3 py-1.5 text-[10px] bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            Download Corrected File
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
