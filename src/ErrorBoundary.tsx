import { Component, ReactNode, ErrorInfo } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in SQLens UI:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            width: '100vw',
            background: '#0f141c',
            color: '#f3f4f6',
            padding: 24,
            textAlign: 'center',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ef4444', marginBottom: 12 }}>
            <AlertCircle size={24} />
            <h1 style={{ fontSize: 18, fontWeight: 700 }}>Something went wrong</h1>
          </div>
          <pre
            style={{
              background: '#161d27',
              padding: 12,
              borderRadius: 6,
              fontSize: 12,
              color: '#ef4444',
              maxWidth: 600,
              overflowX: 'auto',
              border: '1px solid #2a3649',
              marginBottom: 16,
            }}
          >
            {this.state.error?.message || 'An unexpected error occurred.'}
          </pre>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#3b82f6',
                color: '#ffffff',
                border: 'none',
                borderRadius: 4,
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Reload Application
            </button>
            <button
              onClick={() => {
                window.location.hash = '';
                localStorage.removeItem('sqlens_theme');
                localStorage.removeItem('sqlens_editor_width');
                localStorage.removeItem('sqlens_results_height');
                localStorage.removeItem('sqlens_editor_wrap');
                window.location.reload();
              }}
              style={{
                background: 'transparent',
                color: '#9ca3af',
                border: '1px solid #2a3649',
                borderRadius: 4,
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Reset Session
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
