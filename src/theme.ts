export type Theme = 'dark' | 'light';

export interface ThemeColors {
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  bgCard: string;
  border: string;
  borderSubtle: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentHover: string;
  accentMuted: string;
  success: string;
  warning: string;
  error: string;
  nodeTable: string;
  nodeJoin: string;
  nodeFilter: string;
  nodeAggregate: string;
  nodeSort: string;
  nodeOutput: string;
  nodeCte: string;
}

export const themes: Record<Theme, ThemeColors> = {
  dark: {
    bgPrimary: '#0f141c',
    bgSecondary: '#161d27',
    bgTertiary: '#1f2937',
    bgCard: '#1a222f',
    border: '#2a3649',
    borderSubtle: '#222d3d',
    textPrimary: '#f3f4f6',
    textSecondary: '#9ca3af',
    textMuted: '#6b7280',
    accent: '#3b82f6',
    accentHover: '#2563eb',
    accentMuted: 'rgba(59, 130, 246, 0.15)',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    nodeTable: '#3b82f6',
    nodeJoin: '#8b5cf6',
    nodeFilter: '#f59e0b',
    nodeAggregate: '#ec4899',
    nodeSort: '#06b6d4',
    nodeOutput: '#10b981',
    nodeCte: '#6366f1',
  },
  light: {
    bgPrimary: '#f8fafc',
    bgSecondary: '#ffffff',
    bgTertiary: '#f1f5f9',
    bgCard: '#ffffff',
    border: '#e2e8f0',
    borderSubtle: '#cbd5e1',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    accent: '#2563eb',
    accentHover: '#1d4ed8',
    accentMuted: 'rgba(37, 99, 235, 0.1)',
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    nodeTable: '#2563eb',
    nodeJoin: '#7c3aed',
    nodeFilter: '#d97706',
    nodeAggregate: '#db2777',
    nodeSort: '#0891b2',
    nodeOutput: '#059669',
    nodeCte: '#4f46e5',
  },
};
