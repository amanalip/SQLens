import { useState } from 'react';
import {
  Share2,
  Download,
  Moon,
  Sun,
  Eye,
  Layers,
  Check,
  Code2,
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
          <Eye size={18} color="#3b82f6" />
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
      </div>
    </header>
  );
};
