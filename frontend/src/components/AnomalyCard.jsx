import { useState } from 'react';

const SEV_CONFIG = {
  CRITICAL: { color: 'var(--critical)', dim: 'var(--critical-dim)', border: 'var(--critical-border)', glow: true },
  HIGH:     { color: 'var(--high)',     dim: 'var(--high-dim)',     border: 'var(--high-border)',     glow: false },
  MEDIUM:   { color: 'var(--medium)',   dim: 'var(--medium-dim)',   border: 'var(--medium-border)',   glow: false },
  LOW:      { color: 'var(--low)',      dim: 'var(--low-dim)',      border: 'var(--low-border)',      glow: false },
};

export default function AnomalyCard({ anomaly, index }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = SEV_CONFIG[anomaly.severity] || SEV_CONFIG.LOW;

  return (
    <div
      style={{
        ...styles.card,
        borderLeft: `3px solid ${cfg.color}`,
        animation: `fadeInUp 0.4s ease ${index * 0.06}s both`,
        ...(cfg.glow ? styles.criticalGlow : {})
      }}
    >
      {/* Card header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.username}>{anomaly.user}</span>
          <span style={{ ...styles.sevBadge, color: cfg.color, background: cfg.dim, border: `1px solid ${cfg.border}` }}>
            {anomaly.severity}
          </span>
        </div>
        <div style={styles.mitreTag}>
          <span style={styles.mitreLabel}>ATT&CK</span>
          <span style={styles.mitreTactic}>{anomaly.mitre_tactic}</span>
        </div>
      </div>

      {/* Behaviour title */}
      <div style={styles.behaviour}>{anomaly.behaviour}</div>

      {/* MITRE technique */}
      <div style={styles.technique}>
        <span style={styles.techniqueLabel}>TECHNIQUE:</span>
        <span style={{ ...styles.techniqueValue, color: cfg.color }}>{anomaly.mitre_technique}</span>
      </div>

      {/* Explanation */}
      <p style={styles.explanation}>{anomaly.explanation}</p>

      {/* Expand/collapse evidence + recommendation */}
      <button style={styles.expandBtn} onClick={() => setExpanded(e => !e)}>
        <span>{expanded ? '▲' : '▼'}</span>
        {expanded ? 'HIDE DETAILS' : 'SHOW EVIDENCE & REMEDIATION'}
      </button>

      {expanded && (
        <div style={styles.expandedSection}>
          {/* Evidence */}
          {anomaly.evidence && anomaly.evidence.length > 0 && (
            <div style={styles.evidenceBlock}>
              <div style={styles.sectionLabel}>EVIDENCE LOG ENTRIES</div>
              {anomaly.evidence.map((e, i) => (
                <div key={i} style={styles.evidenceItem}>
                  <span style={styles.evidenceNum}>{String(i + 1).padStart(2, '0')}</span>
                  <code style={styles.evidenceText}>{e}</code>
                </div>
              ))}
            </div>
          )}

          {/* Recommendation */}
          {anomaly.recommendation && (
            <div style={styles.recommendationBlock}>
              <div style={styles.sectionLabel}>RECOMMENDED ACTION</div>
              <div style={styles.recommendationText}>{anomaly.recommendation}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '18px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    transition: 'background 0.2s ease',
  },
  criticalGlow: {
    animation: 'fadeInUp 0.4s ease both, glowPulse 3s ease-in-out infinite',
    borderColor: 'var(--critical-border)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  username: {
    fontFamily: 'var(--font-mono)',
    fontSize: 15,
    fontWeight: 700,
    color: 'var(--text-0)',
    letterSpacing: '0.03em',
  },
  sevBadge: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    padding: '3px 9px',
    borderRadius: 3,
    letterSpacing: '0.08em',
    fontWeight: 700,
  },
  mitreTag: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  mitreLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 9,
    color: 'var(--text-3)',
    letterSpacing: '0.1em',
  },
  mitreTactic: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--accent)',
    padding: '2px 8px',
    border: '1px solid var(--border-strong)',
    borderRadius: 3,
    letterSpacing: '0.04em',
  },
  behaviour: {
    fontFamily: 'var(--font-display)',
    fontSize: 17,
    fontWeight: 600,
    color: 'var(--text-0)',
    lineHeight: 1.3,
  },
  technique: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  techniqueLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    color: 'var(--text-3)',
    letterSpacing: '0.08em',
  },
  techniqueValue: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    letterSpacing: '0.03em',
  },
  explanation: {
    fontSize: 14,
    color: 'var(--text-2)',
    lineHeight: 1.7,
    borderLeft: '2px solid var(--border)',
    paddingLeft: 12,
  },
  expandBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--text-2)',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    letterSpacing: '0.07em',
    alignSelf: 'flex-start',
  },
  expandedSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    borderTop: '1px solid var(--border)',
    paddingTop: 14,
    animation: 'fadeIn 0.2s ease',
  },
  sectionLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    letterSpacing: '0.12em',
    color: 'var(--text-3)',
    marginBottom: 8,
  },
  evidenceBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  evidenceItem: {
    display: 'flex',
    gap: 10,
    alignItems: 'flex-start',
  },
  evidenceNum: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--text-3)',
    minWidth: 22,
    paddingTop: 2,
  },
  evidenceText: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--text-1)',
    background: 'var(--bg-2)',
    padding: '5px 10px',
    borderRadius: 4,
    lineHeight: 1.5,
    flex: 1,
    wordBreak: 'break-all',
  },
  recommendationBlock: {},
  recommendationText: {
    fontSize: 14,
    color: 'var(--accent)',
    lineHeight: 1.7,
    background: 'var(--accent-dim)',
    border: '1px solid var(--border-strong)',
    borderRadius: 4,
    padding: '10px 14px',
  },
};
