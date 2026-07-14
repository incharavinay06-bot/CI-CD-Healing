export interface LogLine {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success' | 'debug';
  agent: 'system' | 'repository' | 'analysis' | 'healing' | 'validation' | 'reporting';
  message: string;
}

export interface TimelineStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  timestamp?: string;
}

export interface AppliedFix {
  id: string;
  fileName: string;
  errorType: 'syntax' | 'lint' | 'type-checking' | 'logical' | 'test-failure';
  originalIssue: string;
  fixApplied: string;
  originalCode: string;
  fixedCode: string;
  status: 'resolved' | 're-evaluating' | 'failed';
  severity?: 'Critical' | 'Warning' | 'Info';
}

export interface Metrics {
  errorsDetected: number;
  errorsFixed: number;
  successRate: number;
  iterationsUsed: number;
  overallScore: number;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  language: 'python' | 'typescript' | 'react' | 'java' | 'c' | 'cpp' | 'go';
  files: { [path: string]: string };
}

export interface HealingSession {
  id: string;
  repoUrl: string;
  teamName: string;
  leaderName: string;
  branchName: string;
  status: 'idle' | 'running' | 'success' | 'failed';
  currentAgent: 'none' | 'repository' | 'analysis' | 'healing' | 'validation' | 'reporting';
  metrics: Metrics;
  timeline: TimelineStep[];
  appliedFixes: AppliedFix[];
  logs: LogLine[];
  files: { [path: string]: string };
  createdAt: string;
  errorTrajectory?: number[];
}
