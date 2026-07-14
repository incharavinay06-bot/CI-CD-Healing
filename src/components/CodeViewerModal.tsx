import React, { useState } from 'react';
import { File, Download, Copy, Check, Terminal, ExternalLink } from 'lucide-react';

interface CodeViewerModalProps {
  files: { [path: string]: string };
  sessionId: string;
}

export default function CodeViewerModal({ files, sessionId }: CodeViewerModalProps) {
  const fileList = Object.keys(files);
  const [selectedFile, setSelectedFile] = useState<string>(fileList[0] || '');
  const [copied, setCopied] = useState(false);

  const activeContent = files[selectedFile] || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (fileList.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row h-[420px] font-sans transition-colors duration-300">
      {/* Sidebar List */}
      <div className="w-full md:w-56 bg-slate-50 dark:bg-[#0D1117] border-r border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden transition-colors">
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest font-mono">
            Healed Workspace Tree
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {fileList.map((path) => (
            <button
              key={path}
              onClick={() => setSelectedFile(path)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono flex items-center gap-2 transition-all cursor-pointer ${
                selectedFile === path
                  ? 'bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-bold border-l-2 border-emerald-500'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/40 hover:text-slate-800 dark:hover:bg-slate-800/40 dark:hover:text-white'
              }`}
            >
              <File className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
              <span className="truncate">{path}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Editor Panel */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#0D1117]">
        {/* Editor Actions bar */}
        <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-100/60 dark:bg-[#161B22]/60 shrink-0">
          <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
            {selectedFile}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-white rounded transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider font-mono cursor-pointer"
              title="Copy code to clipboard"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <a
              href={`/api/sessions/${sessionId}/file?path=${encodeURIComponent(selectedFile)}`}
              download={selectedFile}
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-white rounded transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider font-mono cursor-pointer"
              title="Download file"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>
          </div>
        </div>

        {/* Code View */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950 dark:bg-[#0A0C10]">
          <pre className="text-[11px] font-mono text-slate-300 dark:text-slate-200 leading-relaxed whitespace-pre select-text">
            {activeContent}
          </pre>
        </div>
      </div>
    </div>
  );
}
