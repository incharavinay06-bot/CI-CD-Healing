import React, { useState } from 'react';
import { Play, Code, GitBranch, ShieldAlert, Users, User } from 'lucide-react';
import { ProjectTemplate } from '../types';
import { templates } from '../data';

interface SubmissionPanelProps {
  onStart: (data: { repoUrl: string; teamName: string; leaderName: string; templateId: string }) => void;
  isLoading: boolean;
  geminiMissing: boolean;
}

export default function SubmissionPanel({ onStart, isLoading, geminiMissing }: SubmissionPanelProps) {
  const [repoUrl, setRepoUrl] = useState('');
  const [teamName, setTeamName] = useState('SecOps_Elite');
  const [leaderName, setLeaderName] = useState('Captain_DevOps');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('python-fastapi');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({
      repoUrl: repoUrl,
      teamName,
      leaderName,
      templateId: selectedTemplate
    });
  };

  const currentTemplate = templates.find(t => t.id === selectedTemplate);

  return (
    <div className="bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 rounded-lg">
          <GitBranch className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-display font-bold text-base text-slate-900 dark:text-white tracking-tight">Project Workspace Setup</h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Target a repository and assign agents to heal pipeline breaches</p>
        </div>
      </div>

      {geminiMissing && (
        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex gap-2.5 items-start">
          <ShieldAlert className="h-5 w-5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800 dark:text-amber-300">
            <span className="font-semibold">Missing GEMINI_API_KEY:</span> Live AI healing runs will fail. Please add your key in the <span className="font-bold">Settings &gt; Secrets</span> menu of AI Studio.
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1 uppercase tracking-wider">
              <Users className="h-3 w-3 text-slate-400 dark:text-slate-500" /> Team Name
            </label>
            <input
              type="text"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Platform_SRE"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0D1117] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1 uppercase tracking-wider">
              <User className="h-3 w-3 text-slate-400 dark:text-slate-500" /> Leader Name
            </label>
            <input
              type="text"
              required
              value={leaderName}
              onChange={(e) => setLeaderName(e.target.value)}
              placeholder="e.g. Marcus_Aurelius"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0D1117] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
            Choose Broken Project Template (Safe Sandbox Playgrounds)
          </label>
          <div className="grid grid-cols-1 gap-2.5">
            {templates.map((tmpl) => (
              <label
                key={tmpl.id}
                className={`relative flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedTemplate === tmpl.id
                    ? 'border-emerald-500 bg-emerald-500/5 shadow-[0_0_10px_rgba(16,185,129,0.05)]'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0D1117] hover:bg-slate-100 dark:hover:bg-[#1b222c]'
                }`}
              >
                <input
                  type="radio"
                  name="template"
                  value={tmpl.id}
                  checked={selectedTemplate === tmpl.id}
                  onChange={() => setSelectedTemplate(tmpl.id)}
                  className="mt-1 accent-emerald-500"
                />
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-display">
                    {tmpl.name}
                    <span className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase">
                      {tmpl.language}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {tmpl.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
            Optional: Custom Remote Git Repository URL
          </label>
          <div className="relative">
            <input
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/your-org/your-repo.git"
              className="w-full pl-3 pr-20 py-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0D1117] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono transition-colors"
            />
            <span className="absolute right-2.5 top-3 text-[9px] text-slate-400 dark:text-slate-500 uppercase font-mono tracking-wider font-bold">
              HTTPS
            </span>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 leading-normal">
            If left blank, the selected playground template code will be analyzed and modified.
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          id="btn-start-healing"
          className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg ${
            isLoading
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/20 hover:shadow-emerald-900/30 active:scale-[0.98]'
          }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-emerald-400 border-t-transparent" />
              <span>Agents Operating...</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Launch Autonomous Healing Agent</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
