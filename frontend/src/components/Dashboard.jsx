import { useState } from 'react';
import SummaryStats from './SummaryStats';
import AnomalyCard from './AnomalyCard';
import { downloadReport } from '../utils/reportGenerator';

const FILTERS = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

export default function Dashboard({ data, onReset }) {
  const [filter, setFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('severity');
  const [downloading, setDownloading] = useState(false);

  const SEV_ORDER = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

  const filtered = data.anomalies
    .filter(a => filter === 'ALL' || a.severity === filter)
    .sort((a, b) => {
      if (sortBy === 'severity') return (SEV_ORDER[a.severity] ?? 4) - (SEV_ORDER[b.severity] ?? 4);
      if (sortBy === 'user') return a.user.localeCompare(b.user);
      return 0;
    });

  const handleDownload = () => {
    setDownloading(true);
    try {
      downloadReport(data);
    } finally {
      setTimeout(() => setDownloading(false), 1500);
    }
  };

  const filterCount = (f) => f === 'ALL'
    ? data.anomalies.length
    : data.anomalies.filter(a => a.severity === f).length;

  const filterColor = { CRITICAL: 'var(--critical)', HIGH: 'var(--high)', MEDIUM: 'var(--medium)', LOW: 'var(--low)', ALL: 'var(--accent)' };

  return (
    <div style={styles.page}>
      {/* Top bar */}
      <header style={styles.header}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>⬡</div>
          <div>
            <div style={styles.logoName}>INSIGHTGUARD</div>
            <div style={styles.logoSub}>THREAT ANALYSIS COMPLETE</div>
          </div>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.downloadBtn} onClick={handleDownload} disabled={downloading}>
            {downloading ? '⏳ Generating...' : '⬇ Download Report'}
          </button>
          <button style={styles.newScanBtn} onClick={onReset}>
            ↺ New Scan
          </button>
        </div>
      </header>

      <main style={styles.main}>
        {/* Summary stats */}
        <SummaryStats data={data} />

        {/* Filter + Sort row */}
        <div style={styles.controls}>
          <div style={styles.filterRow}>
            {FILTERS.map(f => {
              const count = filterCount(f);
              const isActive = filter === f;
              return (
                <button
                  key={f}
                  style={{
                    ...styles.filterBtn,
                    ...(isActive ? {
                      background: filterColor[f] + '15',
                      borderColor: filterColor[f],
                      color: filterColor[f],
                    } : {})
                  }}
                  onClick={() => setFilter(f)}
                >
                  {f}
                  <span style={{
                    ...styles.filterCount,
                    background: isActive ? filterColor[f] : 'var(--bg-2)',
                    color: isActive ? (f === 'MEDIUM' ? '#111' : '#fff') : 'var(--text-2)',
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
          <div style={styles.sortRow}>
            <span style={styles.sortLabel}>SORT:</span>
            <select
              style={styles.sortSelect}
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="severity">Severity</option>
              <option value="user">Username</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div style={styles.resultsLabel}>
          <span style={styles.resultsCount}>{filtered.length}</span>
          <span style={styles.resultsText}>
            {filter === 'ALL' ? 'anomalies detected' : `${filter} severity anomalies`}
          </span>
        </div>

        {/* Cards grid */}
        {filtered.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>✓</div>
            <div style={styles.emptyTitle}>No {filter} anomalies found</div>
            <div style={styles.emptyNote}>Switch the filter to see other severity levels</div>
          </div>
        ) : (
          <div style={styles.cardGrid}>
            {filtered.map((anomaly, i) => (
              <AnomalyCard key={`${anomaly.user}-${i}`} anomaly={anomaly} index={i} />
            ))}
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        InsightGuard v1.0 · MITRE ATT&amp;CK Framework · All findings should be reviewed by a qualified security analyst
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 32px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg-1)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    backdropFilter: 'blur(12px)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  logoIcon: {
    fontSize: 24,
    color: 'var(--accent)',
  },
  logoName: {
    fontFamily: 'var(--font-display)',
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: '0.15em',
    color: 'var(--text-0)',
  },
  logoSub: {
    fontFamily: 'var(--font-mono)',
    fontSize: 9,
    letterSpacing: '0.1em',
    color: 'var(--accent)',
  },
  headerActions: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
  },
  downloadBtn: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    padding: '9px 18px',
    background: 'var(--accent)',
    border: 'none',
    borderRadius: 5,
    color: '#05080f',
    cursor: 'pointer',
    fontWeight: 700,
    letterSpacing: '0.04em',
  },
  newScanBtn: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    padding: '9px 16px',
    background: 'transparent',
    border: '1px solid var(--border-strong)',
    borderRadius: 5,
    color: 'var(--text-1)',
    cursor: 'pointer',
    letterSpacing: '0.04em',
  },
  main: {
    flex: 1,
    padding: '32px',
    maxWidth: 1100,
    margin: '0 auto',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
  },
  filterRow: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap',
  },
  filterBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    padding: '7px 12px',
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 4,
    color: 'var(--text-2)',
    cursor: 'pointer',
    letterSpacing: '0.06em',
    transition: 'all 0.15s ease',
  },
  filterCount: {
    fontSize: 10,
    padding: '1px 6px',
    borderRadius: 10,
    fontWeight: 700,
  },
  sortRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  sortLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    color: 'var(--text-3)',
    letterSpacing: '0.1em',
  },
  sortSelect: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    padding: '6px 10px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 4,
    color: 'var(--text-1)',
    cursor: 'pointer',
  },
  resultsLabel: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 8,
  },
  resultsCount: {
    fontFamily: 'var(--font-display)',
    fontSize: 32,
    fontWeight: 700,
    color: 'var(--text-0)',
    lineHeight: 1,
  },
  resultsText: {
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    color: 'var(--text-2)',
    letterSpacing: '0.04em',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))',
    gap: 14,
  },
  emptyState: {
    padding: '60px 40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  emptyIcon: {
    fontSize: 40,
    color: 'var(--accent)',
  },
  emptyTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 22,
    color: 'var(--text-0)',
  },
  emptyNote: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--text-3)',
  },
  footer: {
    padding: '14px 32px',
    borderTop: '1px solid var(--border)',
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--text-3)',
    textAlign: 'center',
    letterSpacing: '0.04em',
  },
};
