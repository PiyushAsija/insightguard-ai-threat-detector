const SEV_ORDER = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

export default function SummaryStats({ data }) {
  const counts = SEV_ORDER.reduce((acc, s) => {
    acc[s] = data.anomalies.filter(a => a.severity === s).length;
    return acc;
  }, {});

  const usersAffected = [...new Set(data.anomalies.map(a => a.user))].length;

  const riskColor = {
    CRITICAL: 'var(--critical)',
    HIGH: 'var(--high)',
    MEDIUM: 'var(--medium)',
    LOW: 'var(--low)',
  }[data.risk_level] || 'var(--accent)';

  const scanTime = data.scan_timestamp
    ? new Date(data.scan_timestamp).toLocaleString()
    : new Date().toLocaleString();

  return (
    <div style={styles.wrap}>
      {/* Main stats row */}
      <div style={styles.statsRow}>
        <StatCard
          label="OVERALL RISK"
          value={data.risk_level}
          valueColor={riskColor}
          note="System assessment"
          large
        />
        <StatCard
          label="ANOMALIES FOUND"
          value={data.anomalies_found ?? data.anomalies.length}
          note={`${data.rows_analyzed} log entries`}
        />
        <StatCard
          label="USERS AFFECTED"
          value={usersAffected}
          note={`of ${data.total_users_analyzed ?? '–'} analyzed`}
        />
        <StatCard label="CRITICAL" value={counts.CRITICAL} valueColor="var(--critical)" note="Immediate action" />
        <StatCard label="HIGH"     value={counts.HIGH}     valueColor="var(--high)"     note="Investigate soon" />
        <StatCard label="MEDIUM"   value={counts.MEDIUM}   valueColor="var(--medium)"   note="Monitor closely" />
        <StatCard label="LOW"      value={counts.LOW}      valueColor="var(--low)"      note="Log & review" />
      </div>

      {/* Summary text */}
      <div style={styles.summaryBox}>
        <span style={styles.summaryLabel}>AI ASSESSMENT</span>
        <p style={styles.summaryText}>{data.summary}</p>
        <span style={styles.scanTime}>Scanned: {scanTime} · {data.file_name} ({data.file_size_kb} KB)</span>
      </div>
    </div>
  );
}

function StatCard({ label, value, valueColor, note, large }) {
  return (
    <div style={{ ...styles.card, ...(large ? styles.cardLarge : {}) }}>
      <div style={styles.cardLabel}>{label}</div>
      <div style={{ ...styles.cardValue, color: valueColor || 'var(--text-0)', ...(large ? styles.cardValueLarge : {}) }}>
        {value ?? 0}
      </div>
      {note && <div style={styles.cardNote}>{note}</div>}
    </div>
  );
}

const styles = {
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
    gap: 10,
  },
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '14px 16px',
  },
  cardLarge: {
    gridColumn: 'span 1',
  },
  cardLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 9,
    letterSpacing: '0.1em',
    color: 'var(--text-2)',
    marginBottom: 8,
  },
  cardValue: {
    fontFamily: 'var(--font-display)',
    fontSize: 28,
    fontWeight: 700,
    lineHeight: 1,
    marginBottom: 4,
  },
  cardValueLarge: {
    fontSize: 22,
    letterSpacing: '0.05em',
  },
  cardNote: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    color: 'var(--text-3)',
  },
  summaryBox: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  summaryLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    letterSpacing: '0.12em',
    color: 'var(--accent)',
  },
  summaryText: {
    fontSize: 14,
    color: 'var(--text-1)',
    lineHeight: 1.7,
  },
  scanTime: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--text-3)',
  },
};
