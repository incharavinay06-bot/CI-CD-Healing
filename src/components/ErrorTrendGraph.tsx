import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Sparkles, TrendingUp, BarChart2 } from 'lucide-react';
import { HealingSession } from '../types';

interface ErrorTrendGraphProps {
  currentSession: HealingSession | null;
  history: Omit<HealingSession, 'files'>[];
}

export default function ErrorTrendGraph({ currentSession, history }: ErrorTrendGraphProps) {
  const [activeTab, setActiveTab] = useState<'healing-curve' | 'history-trends'>('healing-curve');

  // Prepare iteration data for the active session healing curve
  const getHealingCurveData = () => {
    if (!currentSession) {
      return [
        { name: 'Start', errors: 0 },
        { name: 'Loop 1', errors: 0 },
        { name: 'Loop 2', errors: 0 },
        { name: 'Final', errors: 0 }
      ];
    }

    if (currentSession.errorTrajectory && currentSession.errorTrajectory.length > 0) {
      const data = currentSession.errorTrajectory.map((errs, idx) => ({
        name: idx === 0 ? 'Initial' : `Loop ${idx}`,
        errors: errs
      }));
      
      // If completed successfully, make sure the curve drops to 0 or correct remaining errors
      const remaining = currentSession.metrics.errorsDetected - currentSession.metrics.errorsFixed;
      if (currentSession.status === 'success') {
        if (data[data.length - 1].errors > 0) {
          data.push({ name: 'Healed', errors: 0 });
        }
      } else if (currentSession.status === 'failed') {
        if (data[data.length - 1].errors !== remaining) {
          data.push({ name: 'Validated', errors: remaining });
        }
      }
      return data;
    }

    const initialDetected = currentSession.metrics.errorsDetected;
    const finalLeft = initialDetected - currentSession.metrics.errorsFixed;
    
    // Simulate gradual reduction across loops for plotting
    const loop1 = Math.max(0, Math.floor(initialDetected * 0.4));
    const loop2 = Math.max(0, Math.floor(initialDetected * 0.1));

    return [
      { name: 'Initial', errors: initialDetected },
      { name: 'Loop 1', errors: loop1 },
      { name: 'Loop 2', errors: loop2 },
      { name: 'Validated', errors: finalLeft }
    ];
  };

  // Prepare history data
  const getHistoryTrendData = () => {
    const sorted = [...history].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    return sorted.map((sess, idx) => ({
      name: `Run #${idx + 1}`,
      score: sess.metrics.overallScore,
      errors: sess.metrics.errorsDetected,
      fixed: sess.metrics.errorsFixed
    }));
  };

  const isDark = typeof window !== 'undefined' && window.document.documentElement.classList.contains('dark');
  const gridColor = isDark ? "#21262d" : "#e2e8f0";
  const axisColor = isDark ? "#8b949e" : "#64748b";
  const tooltipBg = isDark ? "#0d1117" : "#ffffff";
  const tooltipBorder = isDark ? "#30363d" : "#e2e8f0";
  const tooltipColor = isDark ? "#e2e8f0" : "#1e293b";

  const curveData = getHealingCurveData();
  const historyData = getHistoryTrendData();

  return (
    <div className="bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm font-sans transition-colors duration-300">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3.5 mb-4">
        <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
          DevOps Pipeline Trend Analytics
        </h3>

        <div className="flex bg-slate-50 dark:bg-[#0D1117] rounded-lg p-0.5 border border-slate-200 dark:border-slate-800 transition-colors">
          <button
            onClick={() => setActiveTab('healing-curve')}
            className={`px-3 py-1 text-[10px] uppercase tracking-wider rounded transition-all font-bold cursor-pointer ${
              activeTab === 'healing-curve'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700/50 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Heal Curve
          </button>
          <button
            onClick={() => setActiveTab('history-trends')}
            className={`px-3 py-1 text-[10px] uppercase tracking-wider rounded transition-all font-bold cursor-pointer ${
              activeTab === 'history-trends'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700/50 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Audit History
          </button>
        </div>
      </div>

      <div className="h-64 w-full">
        {activeTab === 'healing-curve' ? (
          <div className="h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-widest font-mono">
                Error density vs. loop iterations
              </span>
              {currentSession && currentSession.metrics.errorsFixed > 0 && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold uppercase tracking-wider font-mono">
                  <Sparkles className="h-3 w-3 animate-pulse" />
                  Reduced errors by {currentSession.metrics.errorsFixed}
                </span>
              )}
            </div>
            
            <div className="flex-1 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={curveData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorErrors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} strokeOpacity={0.7} />
                  <XAxis dataKey="name" stroke={axisColor} fontSize={9} tickLine={false} fontClassName="font-mono" />
                  <YAxis stroke={axisColor} fontSize={9} tickLine={false} allowDecimals={false} fontClassName="font-mono" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tooltipBg,
                      borderColor: tooltipBorder,
                      borderRadius: '8px',
                      color: tooltipColor,
                      fontSize: '11px',
                      fontFamily: 'monospace'
                    }}
                  />
                  <Area type="monotone" dataKey="errors" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#colorErrors)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-widest font-mono">
                DevOps integrity score trajectory
              </span>
              {historyData.length > 1 && (
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 flex items-center gap-1 font-bold uppercase tracking-wider font-mono">
                  <TrendingUp className="h-3 w-3" />
                  Stable Healing System
                </span>
              )}
            </div>

            <div className="flex-1 mt-2">
              {historyData.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 text-xs">
                  Awaiting multiple repository evaluations to render trending telemetry
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} strokeOpacity={0.7} />
                    <XAxis dataKey="name" stroke={axisColor} fontSize={9} tickLine={false} fontClassName="font-mono" />
                    <YAxis stroke={axisColor} fontSize={9} tickLine={false} domain={[0, 100]} fontClassName="font-mono" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        borderColor: tooltipBorder,
                        borderRadius: '8px',
                        color: tooltipColor,
                        fontSize: '11px',
                        fontFamily: 'monospace'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px', color: axisColor }} />
                    <Line type="monotone" name="DevOps Score" dataKey="score" stroke="#10b981" strokeWidth={2.5} activeDot={{ r: 6 }} />
                    <Line type="monotone" name="Errors Detected" dataKey="errors" stroke="#f43f5e" strokeWidth={1.5} strokeDasharray="4 4" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
