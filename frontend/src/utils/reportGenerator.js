export function downloadReport(data) {
  const scanTime = data.scan_timestamp
    ? new Date(data.scan_timestamp).toLocaleString()
    : new Date().toLocaleString();

  const sevColor = { CRITICAL: '#ff4040', HIGH: '#ff9500', MEDIUM: '#f5c518', LOW: '#3b9eff' };

  const anomalyRows = data.anomalies.map((a, i) => `
    <div style="page-break-inside:avoid;margin-bottom:24px;border:1px solid #e0e0e0;border-left:4px solid ${sevColor[a.severity] || '#888'};border-radius:4px;padding:16px 20px;">
      <table style="width:100%;margin-bottom:12px">
        <tr>
          <td style="font-family:monospace;font-size:15px;font-weight:bold;color:#111">${a.user}</td>
          <td style="text-align:right">
            <span style="background:${sevColor[a.severity]}22;color:${sevColor[a.severity]};border:1px solid ${sevColor[a.severity]}66;padding:3px 10px;border-radius:3px;font-family:monospace;font-size:11px;font-weight:bold">${a.severity}</span>
          </td>
        </tr>
      </table>
      <div style="font-size:16px;font-weight:600;color:#111;margin-bottom:8px">${a.behaviour}</div>
      <div style="margin-bottom:10px">
        <span style="font-family:monospace;font-size:10px;color:#888">MITRE ATT&amp;CK: </span>
        <span style="font-family:monospace;font-size:12px;color:#0066cc">${a.mitre_tactic} — ${a.mitre_technique}</span>
      </div>
      <p style="font-size:13px;color:#333;line-height:1.7;border-left:2px solid #e0e0e0;padding-left:12px;margin-bottom:12px">${a.explanation}</p>
      ${a.evidence && a.evidence.length > 0 ? `
        <div style="margin-bottom:12px">
          <div style="font-family:monospace;font-size:10px;color:#888;letter-spacing:0.1em;margin-bottom:6px">EVIDENCE</div>
          ${a.evidence.map(e => `<div style="font-family:monospace;font-size:12px;background:#f5f5f5;padding:6px 10px;border-radius:3px;margin-bottom:4px;color:#333">${e}</div>`).join('')}
        </div>
      ` : ''}
      ${a.recommendation ? `
        <div>
          <div style="font-family:monospace;font-size:10px;color:#888;letter-spacing:0.1em;margin-bottom:6px">RECOMMENDED ACTION</div>
          <div style="font-size:13px;color:#006644;background:#e6f9f3;border:1px solid #99ddc8;border-radius:4px;padding:10px 14px">${a.recommendation}</div>
        </div>
      ` : ''}
    </div>
  `).join('');

  const countBySev = sev => data.anomalies.filter(a => a.severity === sev).length;
  const usersAffected = [...new Set(data.anomalies.map(a => a.user))];

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>InsightGuard Security Report — ${data.file_name}</title>
<style>
  body { font-family: Arial, sans-serif; max-width: 860px; margin: 0 auto; padding: 40px 30px; color: #222; background: #fff; }
  @media print { body { padding: 0; } }
  h1 { font-size: 28px; margin: 0; }
  h2 { font-size: 16px; font-weight: 600; color: #111; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px; margin: 28px 0 16px; }
  .header-bar { border-bottom: 3px solid #00d4aa; padding-bottom: 20px; margin-bottom: 28px; }
  .meta { display: flex; gap: 32px; flex-wrap: wrap; margin-top: 16px; }
  .meta-item label { display: block; font-family: monospace; font-size: 10px; color: #888; letter-spacing: 0.1em; margin-bottom: 3px; }
  .meta-item span { font-family: monospace; font-size: 13px; color: #111; }
  .stats { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 24px; }
  .stat { border: 1px solid #e0e0e0; border-radius: 6px; padding: 12px 18px; flex: 1; min-width: 100px; }
  .stat label { display: block; font-family: monospace; font-size: 9px; color: #888; letter-spacing: 0.1em; margin-bottom: 6px; }
  .stat span { font-size: 24px; font-weight: 700; }
  .summary-box { background: #f7f7f7; border-left: 3px solid #00d4aa; padding: 14px 18px; border-radius: 0 4px 4px 0; margin-bottom: 24px; font-size: 14px; line-height: 1.7; color: #333; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e0e0e0; font-family: monospace; font-size: 11px; color: #aaa; }
  .print-btn { display: inline-block; margin-bottom: 24px; padding: 10px 24px; background: #00d4aa; color: #fff; border: none; border-radius: 4px; font-size: 14px; cursor: pointer; font-weight: 600; }
  @media print { .print-btn { display: none; } }
</style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">🖨 Print / Save as PDF</button>

  <div class="header-bar">
    <div style="font-family:monospace;font-size:11px;color:#00d4aa;letter-spacing:0.15em;margin-bottom:8px">INSIGHTGUARD — AI INSIDER THREAT DETECTOR</div>
    <h1>Security Incident Report</h1>
    <div class="meta">
      <div class="meta-item"><label>FILE ANALYZED</label><span>${data.file_name}</span></div>
      <div class="meta-item"><label>SCAN TIME</label><span>${scanTime}</span></div>
      <div class="meta-item"><label>ROWS ANALYZED</label><span>${data.rows_analyzed}</span></div>
      <div class="meta-item"><label>FILE SIZE</label><span>${data.file_size_kb} KB</span></div>
      <div class="meta-item"><label>OVERALL RISK</label><span style="color:${sevColor[data.risk_level] || '#888'};font-weight:bold">${data.risk_level}</span></div>
    </div>
  </div>

  <h2>Executive Summary</h2>
  <div class="summary-box">${data.summary}</div>

  <h2>Statistical Overview</h2>
  <div class="stats">
    <div class="stat"><label>TOTAL ANOMALIES</label><span>${data.anomalies.length}</span></div>
    <div class="stat"><label>CRITICAL</label><span style="color:#ff4040">${countBySev('CRITICAL')}</span></div>
    <div class="stat"><label>HIGH</label><span style="color:#ff9500">${countBySev('HIGH')}</span></div>
    <div class="stat"><label>MEDIUM</label><span style="color:#f5c518">${countBySev('MEDIUM')}</span></div>
    <div class="stat"><label>LOW</label><span style="color:#3b9eff">${countBySev('LOW')}</span></div>
    <div class="stat"><label>USERS AFFECTED</label><span>${usersAffected.length}</span></div>
  </div>
  <p style="font-family:monospace;font-size:12px;color:#888;margin-bottom:24px">Affected users: ${usersAffected.join(', ')}</p>

  <h2>Detailed Findings (${data.anomalies.length})</h2>
  ${anomalyRows}

  <div class="footer">
    Generated by InsightGuard v1.0 · Powered by Claude AI (Anthropic) · 
    Security findings mapped to MITRE ATT&amp;CK Framework · 
    Report generated: ${new Date().toISOString()} · 
    This report should be reviewed by a qualified security professional.
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `InsightGuard-Report-${Date.now()}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
