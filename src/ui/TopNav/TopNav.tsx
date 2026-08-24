import { useState } from 'react';
import {
  Share2,
  Download,
  Moon,
  Sun,
  Layers,
  Check,
  Code2,
  HelpCircle,
} from 'lucide-react';
import { bundledDatabases, SampleQuery } from '../../samples';
import { Theme } from '../../theme';
import styles from './TopNav.module.css';

interface TopNavProps {
  mode: 'query' | 'schema';
  onModeChange: (mode: 'query' | 'schema') => void;
  selectedDbId: string;
  onDbChange: (dbId: string) => void;
  onSelectSample: (sample: SampleQuery) => void;
  onExportPng: () => void;
  onShare: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  isLoadingDb?: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  mode,
  onModeChange,
  selectedDbId,
  onDbChange,
  onSelectSample,
  onExportPng,
  onShare,
  theme,
  onToggleTheme,
  isLoadingDb = false,
}) => {
  const [copiedShare, setCopiedShare] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const activeDb = bundledDatabases.find((db) => db.id === selectedDbId) || bundledDatabases[0];

  const handleShareClick = () => {
    onShare();
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <header className={styles.nav}>
      <div className={styles.brandGroup}>
        <div className={styles.logo}>
          <img
            src={`${import.meta.env.BASE_URL || './'}sqlens-logo.svg`}
            alt="SQLens Detective Logo"
            style={{ width: 26, height: 26 }}
          />
          <span>SQLens</span>
        </div>
        <span className={styles.tagline}>Clarity for every query</span>
      </div>

      <div className={styles.centerGroup}>
        <div className={styles.modeToggle}>
          <button
            className={`${styles.modeButton} ${mode === 'query' ? styles.active : ''}`}
            onClick={() => onModeChange('query')}
          >
            <Code2 size={13} />
            <span>Query Mode</span>
          </button>
          <button
            className={`${styles.modeButton} ${mode === 'schema' ? styles.active : ''}`}
            onClick={() => onModeChange('schema')}
          >
            <Layers size={13} />
            <span>Schema Mode</span>
          </button>
        </div>

        <div className={styles.selectGroup}>
          <select
            className={styles.select}
            value={selectedDbId}
            onChange={(e) => onDbChange(e.target.value)}
            disabled={isLoadingDb}
            title="Select SQLite database"
          >
            {bundledDatabases.map((db) => (
              <option key={db.id} value={db.id}>
                {db.name} ({db.size})
              </option>
            ))}
          </select>

          {mode === 'query' && activeDb.samples.length > 0 && (
            <select
              className={styles.select}
              defaultValue=""
              onChange={(e) => {
                const sample = activeDb.samples.find((s) => s.id === e.target.value);
                if (sample) {
                  onSelectSample(sample);
                  e.target.value = '';
                }
              }}
              title="Pick an example query"
            >
              <option value="" disabled>
                Example Queries...
              </option>
              {activeDb.samples.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className={styles.rightGroup}>
        <button
          className={styles.actionButton}
          onClick={handleShareClick}
          title="Share query via compressed URL hash"
        >
          {copiedShare ? <Check size={13} color="#10b981" /> : <Share2 size={13} />}
          <span>{copiedShare ? 'Link Copied' : 'Share'}</span>
        </button>

        <button
          className={styles.actionButton}
          onClick={onExportPng}
          title="Export graph as PNG image"
        >
          <Download size={13} />
          <span>Export PNG</span>
        </button>

        <button
          className={styles.actionButton}
          onClick={onToggleTheme}
          title="Toggle light or dark theme"
        >
          {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
        </button>

        <button
          className={styles.actionButton}
          onClick={() => setShowHelp(!showHelp)}
          title="Keyboard shortcuts and guide"
        >
          <HelpCircle size={13} />
        </button>
      </div>

      {showHelp && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setShowHelp(false)}
        >
          <div
            style={{
              background: 'var(--bg-secondary, #161d27)',
              border: '1px solid var(--border, #2a3649)',
              borderRadius: 8,
              padding: 20,
              width: 420,
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              color: 'var(--text-primary, #f3f4f6)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Keyboard Shortcuts & Tips</div>
              <button
                onClick={() => setShowHelp(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted, #6b7280)', cursor: 'pointer', fontSize: 16 }}
              >
                ×
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary, #9ca3af)' }}>Run Query</span>
                <kbd style={{ background: 'var(--bg-tertiary, #1f2937)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border, #2a3649)' }}>Ctrl + Enter</kbd>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary, #9ca3af)' }}>Autocomplete</span>
                <kbd style={{ background: 'var(--bg-tertiary, #1f2937)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border, #2a3649)' }}>Ctrl + Space</kbd>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary, #9ca3af)' }}>Inspect Node Details</span>
                <span style={{ color: 'var(--text-muted, #6b7280)' }}>Click any graph card</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary, #9ca3af)' }}>Filter Schema Tables</span>
                <span style={{ color: 'var(--text-muted, #6b7280)' }}>Search box in Schema Mode</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary, #9ca3af)' }}>Format SQL Query</span>
                <span style={{ color: 'var(--text-muted, #6b7280)' }}>Format button in Editor bar</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
