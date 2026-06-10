import { useState, useEffect } from 'react';

const STEPS = [
  { label: 'PARSING ACCESS LOGS', duration: 800 },
  { label: 'CONNECTING TO CLAUDE AI', duration: 1200 },
  { label: 'ANALYSING BEHAVIOUR PATTERNS', duration: 2000 },
  { label: 'MAPPING TO MITRE ATT&CK', duration: 1500 },
  { label: 'CALCULATING RISK SCORES', duration: 1000 },
  { label: 'GENERATING INCIDENT REPORT', duration: 1000 },
];

export default function LoadingScreen() {
  const [completedSteps, setCompletedSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    let delay = 0;
    STEPS.forEach((step, i) => {
      delay += step.duration;
      const timer = setTimeout(() => {
        setCompletedSteps(prev => [...prev, i]);
        setCurrentStep(i + 1);
      }, delay);
      return () => clearTimeout(timer);
    });
  }, []);

  return (
    <div style={styles.page}>
      {/* Radar animation */}
      <div style={styles.radarWrap}>
        <div style={styles.radarOuter}>
          <div style={styles.radarMiddle}>
            <div style={styles.radarInner}>
              <div style={styles.radarCenter} />
            </div>
          </div>
          <div style={styles.radarSweep} />
        </div>
        {/* Pings */}
        <div style={{ ...styles.ping, top: '20%', left: '65%', animationDelay: '0.5s' }} />
        <div style={{ ...styles.ping, top: '60%', left: '30%', animationDelay: '1.2s' }} />
        <div style={{ ...styles.ping, top: '45%', left: '72%', animationDelay: '2s' }} />
      </div>

      {/* Terminal steps */}
      <div style={styles.terminal}>
        <div style={styles.termHeader}>
          <div style={styles.termDot} />
          <div style={{ ...styles.termDot, background: '#f59e0b' }} />
          <div style={{ ...styles.termDot, background: 'var(--accent)' }} />
          <span style={styles.termTitle}>insightguard — threat-analysis</span>
        </div>
        <div style={styles.termBody}>
          {STEPS.map((step, i) => {
            const isDone = completedSteps.includes(i);
            const isActive = currentStep === i;
            if (i > currentStep) return null;
            return (
              <div key={i} style={styles.termLine}>
                <span style={styles.termPrompt}>$</span>
                <span style={isDone ? styles.stepDone : isActive ? styles.stepActive : styles.stepPending}>
                  {step.label}
                </span>
                {isDone && <span style={styles.checkmark}>✓</span>}
                {isActive && <span style={styles.cursor}>█</span>}
              </div>
            );
          })}
          {currentStep >= STEPS.length && (
            <div style={{ ...styles.termLine, marginTop: 8 }}>
              <span style={styles.termPrompt}>$</span>
              <span style={styles.stepDone}>ANALYSIS COMPLETE — PREPARING REPORT...</span>
            </div>
          )}
        </div>
      </div>

      {/* Status */}
      <div style={styles.status}>
        <div style={styles.spinner} />
        <span style={styles.statusLabel}>AI ANALYSIS IN PROGRESS</span>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 48,
    padding: 40,
    fontFamily: 'var(--font-mono)',
  },
  radarWrap: {
    position: 'relative',
    width: 140,
    height: 140,
  },
  radarOuter: {
    width: 140,
    height: 140,
    borderRadius: '50%',
    border: '1px solid rgba(0,212,170,0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  radarMiddle: {
    width: 90,
    height: 90,
    borderRadius: '50%',
    border: '1px solid rgba(0,212,170,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarInner: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    border: '1px solid rgba(0,212,170,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarCenter: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--accent)',
  },
  radarSweep: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '50%',
    height: '50%',
    background: 'conic-gradient(from 0deg, transparent 0deg, rgba(0,212,170,0.35) 60deg, transparent 60deg)',
    transformOrigin: '0% 0%',
    animation: 'spin 2s linear infinite',
    borderRadius: '0 0 100% 0',
  },
  ping: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--critical)',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  terminal: {
    width: '100%',
    maxWidth: 520,
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  termHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '10px 16px',
    background: 'var(--bg-2)',
    borderBottom: '1px solid var(--border)',
  },
  termDot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: 'var(--critical)',
  },
  termTitle: {
    fontSize: 11,
    color: 'var(--text-2)',
    marginLeft: 8,
    letterSpacing: '0.03em',
  },
  termBody: {
    padding: '20px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    minHeight: 180,
  },
  termLine: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 13,
    animation: 'fadeInUp 0.3s ease',
  },
  termPrompt: {
    color: 'var(--accent)',
    userSelect: 'none',
  },
  stepDone: {
    color: 'var(--accent)',
    letterSpacing: '0.06em',
  },
  stepActive: {
    color: 'var(--text-0)',
    letterSpacing: '0.06em',
  },
  stepPending: {
    color: 'var(--text-3)',
    letterSpacing: '0.06em',
  },
  checkmark: {
    color: 'var(--accent)',
    marginLeft: 'auto',
    fontSize: 12,
  },
  cursor: {
    color: 'var(--text-0)',
    animation: 'blink 1s step-end infinite',
    marginLeft: 4,
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  spinner: {
    width: 16,
    height: 16,
    border: '2px solid var(--border)',
    borderTopColor: 'var(--accent)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  statusLabel: {
    fontSize: 12,
    color: 'var(--text-2)',
    letterSpacing: '0.12em',
  },
};
