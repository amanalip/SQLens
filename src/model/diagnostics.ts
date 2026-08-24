export type DiagnosticSeverity = 'error' | 'warning' | 'info';

export interface DiagnosticWarning {
  id: string;
  message: string;
  severity: DiagnosticSeverity;
  line?: number;
  column?: number;
  ruleId: string;
  suggestion?: string;
}
