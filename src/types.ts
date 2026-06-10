export interface CodeFile {
  path: string;
  content: string;
  language: string;
}

export interface AnalysisResult {
  file: string;
  issues: Issue[];
  suggestions: string[];
  complexity: number;
}

export interface Issue {
  line: number;
  severity: 'error' | 'warning' | 'info';
  message: string;
  code: string;
}

export interface ModificationRequest {
  files: CodeFile[];
  task: string;
  constraints?: string[];
}

export interface ModificationResult {
  modified: CodeFile[];
  summary: string;
  reasoning: string;
  testCases?: string[];
}

export interface AgentConfig {
  provider: 'claude' | 'openai';
  model: string;
  temperature?: number;
  maxTokens?: number;
  apiKey: string;
}

export interface ToolResult {
  success: boolean;
  data: unknown;
  error?: string;
}
