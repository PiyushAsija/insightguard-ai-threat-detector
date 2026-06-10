import { useState, useRef, useCallback } from 'react';

export default function UploadZone({ onAnalyze, error }) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = useCallback((file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Please upload a CSV file.');
      return;
    }
    setSelectedFile(file);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const handleInputChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    if (selectedFile) onAnalyze(selectedFile);
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>⬡</div>
          <div>
            <div style={styles.logoName}>INSIGHTGUARD</div>
            <div style={styles.logoSub}>AI INSIDER THREAT DETECTOR</div>
          </div>
        </div>
        <div style={styles.headerMeta}>
          <span style={styles.statusDot} />
          <span style={styles.statusText}>SYSTEM ONLINE</span>
        </div>
      </header>

      {/* Main Upload Area */}
      <main style={styles.main}>
        <div style={styles.centerCol}>
          {/* Title block */}
          <div style={styles.titleBlock}>
            <div style={styles.tagline}>SECURITY OPERATIONS CENTER</div>
            <h1 style={styles.title}>Detect Insider Threats<br />with AI Analysis</h1>
            <p style={styles.subtitle}>
              Upload your user access logs. Our AI analyzes behaviour patterns,
              maps findings to MITRE ATT&amp;CK, and generates an incident report in seconds.
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div style={styles.errorBanner}>
              <span style={{ color: 'var(--critical)', marginRight: 8 }}>⚠</span>
              {error}
            </div>
          )}

          {/* Drop Zone */}
          <div
            style={{
              ...styles.dropZone,
              ...(isDragging ? styles.dropZoneActive : {}),
              ...(selectedFile ? styles.dropZoneSelected : {})
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !selectedFile && fileInputRef.current?.click()}
          >
            {/* Corner accents */}
            <div style={{ ...styles.corner, top: -1, left: -1, borderTop: '2px solid var(--accent)', borderLeft: '2px solid var(--accent)' }} />
            <div style={{ ...styles.corner, top: -1, right: -1, borderTop: '2px solid var(--accent)', borderRight: '2px solid var(--accent)' }} />
            <div style={{ ...styles.corner, bottom: -1, left: -1, borderBottom: '2px solid var(--accent)', borderLeft: '2px solid var(--accent)' }} />
            <div style={{ ...styles.corner, bottom: -1, right: -1, borderBottom: '2px solid var(--accent)', borderRight: '2px solid var(--accent)' }} />

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleInputChange}
              style={{ display: 'none' }}
            />

            {selectedFile ? (
              <div style={styles.fileSelected}>
                <div style={styles.fileIcon}>📋</div>
                <div style={styles.fileName}>{selectedFile.name}</div>
                <div style={styles.fileSize}>
                  {(selectedFile.size / 1024).toFixed(1)} KB · CSV File Ready
                </div>
                <button
                  style={styles.changeBtn}
                  onClick={(e) => { e.stopPropagation(); setSelectedFile(null); fileInputRef.current?.click(); }}
                >
                  Change File
                </button>
              </div>
            ) : (
              <div style={styles.dropContent}>
                <div style={styles.uploadIcon}>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="23" stroke="var(--accent)" strokeWidth="1" strokeDasharray="4 3" />
                    <path d="M24 32V20M24 20L18 26M24 20L30 26" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 34h16" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                  </svg>
                </div>
                <div style={styles.dropTitle}>
                  {isDragging ? 'DROP TO ANALYZE' : 'DROP CSV LOG FILE HERE'}
                </div>
                <div style={styles.dropOr}>— or —</div>
                <button style={styles.browseBtn} onClick={() => fileInputRef.current?.click()}>
                  Browse Files
                </button>
              </div>
            )}
          </div>

          {/* Format hint */}
          <div style={styles.formatHint}>
            <span style={styles.hintLabel}>REQUIRED COLUMNS</span>
            <div style={styles.columns}>
              {['username', 'timestamp', 'action', 'resource', 'ip_address'].map(col => (
                <code key={col} style={styles.colBadge}>{col}</code>
              ))}
            </div>
            <span style={styles.hintNote}>Max 5,000 rows · 2MB limit · CSV only</span>
          </div>

          {/* Analyze button */}
          {selectedFile && (
            <button style={styles.analyzeBtn} onClick={handleSubmit}>
              <span style={styles.analyzeBtnIcon}>▶</span>
              RUN THREAT ANALYSIS
            </button>
          )}

          {/* Sample CSV note */}
          <div style={styles.sampleNote}>
            Don't have a log file? Use the <strong style={{ color: 'var(--accent)' }}>sample-logs.csv</strong> included in the project folder to test.
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <span>InsightGuard v1.0 · OWASP Top 10 Tested</span>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'var(--font-body)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 40px',
    borderBottom: '1px solid var(--border)',
    backdropFilter: 'blur(10px)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },
  logoIcon: {
    fontSize: 28,
    color: 'var(--accent)',
    lineHeight: 1,
  },
  logoName: {
    fontFamily: 'var(--font-display)',
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: '0.15em',
    color: 'var(--text-0)',
  },
  logoSub: {
    fontFamily: 'var(--font-mono)',
    fontSize: 9,
    letterSpacing: '0.1em',
    color: 'var(--text-2)',
  },
  headerMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    display: 'inline-block',
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: 'var(--accent)',
    animation: 'pulse 2s ease-in-out infinite',
  },
  statusText: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--accent)',
    letterSpacing: '0.1em',
  },
  main: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 24px',
  },
  centerCol: {
    width: '100%',
    maxWidth: 600,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 28,
  },
  titleBlock: {
    textAlign: 'center',
  },
  tagline: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.15em',
    color: 'var(--accent)',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 48,
    fontWeight: 700,
    lineHeight: 1.1,
    color: 'var(--text-0)',
    marginBottom: 16,
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: 16,
    color: 'var(--text-2)',
    lineHeight: 1.7,
    maxWidth: 480,
    margin: '0 auto',
  },
  errorBanner: {
    width: '100%',
    padding: '12px 16px',
    background: 'var(--critical-dim)',
    border: '1px solid var(--critical-border)',
    borderRadius: 6,
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    color: 'var(--text-1)',
  },
  dropZone: {
    width: '100%',
    minHeight: 220,
    border: '1px dashed var(--border-strong)',
    borderRadius: 12,
    background: 'var(--accent-dim)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
    padding: 32,
  },
  dropZoneActive: {
    borderColor: 'var(--accent)',
    background: 'rgba(0, 212, 170, 0.12)',
    borderStyle: 'solid',
  },
  dropZoneSelected: {
    borderStyle: 'solid',
    borderColor: 'var(--border-strong)',
    cursor: 'default',
  },
  corner: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 2,
  },
  dropContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  uploadIcon: {
    opacity: 0.8,
  },
  dropTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 18,
    fontWeight: 600,
    letterSpacing: '0.08em',
    color: 'var(--text-0)',
  },
  dropOr: {
    fontSize: 12,
    color: 'var(--text-3)',
  },
  browseBtn: {
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    padding: '8px 20px',
    background: 'transparent',
    border: '1px solid var(--border-strong)',
    borderRadius: 4,
    color: 'var(--accent)',
    cursor: 'pointer',
    letterSpacing: '0.05em',
  },
  fileSelected: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  fileIcon: {
    fontSize: 36,
  },
  fileName: {
    fontFamily: 'var(--font-mono)',
    fontSize: 14,
    color: 'var(--accent)',
    letterSpacing: '0.03em',
  },
  fileSize: {
    fontSize: 13,
    color: 'var(--text-2)',
  },
  changeBtn: {
    marginTop: 4,
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    padding: '6px 14px',
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 4,
    color: 'var(--text-2)',
    cursor: 'pointer',
  },
  formatHint: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  hintLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    letterSpacing: '0.12em',
    color: 'var(--text-3)',
  },
  columns: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  colBadge: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    padding: '4px 10px',
    background: 'var(--bg-2)',
    border: '1px solid var(--border)',
    borderRadius: 4,
    color: 'var(--accent)',
  },
  hintNote: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--text-3)',
    marginTop: 4,
  },
  analyzeBtn: {
    fontFamily: 'var(--font-display)',
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: '0.1em',
    padding: '16px 48px',
    background: 'var(--accent)',
    border: 'none',
    borderRadius: 6,
    color: '#05080f',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    justifyContent: 'center',
    animation: 'fadeInUp 0.3s ease',
  },
  analyzeBtnIcon: {
    fontSize: 14,
  },
  sampleNote: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--text-3)',
    textAlign: 'center',
    lineHeight: 1.6,
  },
  footer: {
    padding: '16px 40px',
    borderTop: '1px solid var(--border)',
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--text-3)',
    textAlign: 'center',
    letterSpacing: '0.05em',
  },
};
