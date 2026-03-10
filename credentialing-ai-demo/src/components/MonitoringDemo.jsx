import { useState, useEffect, useRef } from 'react'

const PROVIDERS = [
  { id: 1, name: 'Dr. Marcus Okonkwo, MD', npi: '1082945673', specialty: 'Psychiatry', state: 'TX', status: 'active' },
  { id: 2, name: 'Dr. Priya Patel, DO', npi: '1234098765', specialty: 'Family Medicine', state: 'AZ', status: 'active' },
  { id: 3, name: 'Dr. James Whitfield, MD', npi: '1567832094', specialty: 'Internal Medicine', state: 'CA', status: 'active' },
  { id: 4, name: 'Dr. Ana Rodriguez, NP', npi: '1890234567', specialty: 'Nurse Practitioner', state: 'FL', status: 'active' },
  { id: 5, name: 'Dr. Kevin Zhao, MD', npi: '1345678901', specialty: 'Cardiology', state: 'IL', status: 'active' },
  { id: 6, name: 'Dr. Linda Osei, MD', npi: '1678923456', specialty: 'OB/GYN', state: 'WA', status: 'active' },
]

const ALERT_TEMPLATES = [
  {
    type: 'exclusion', severity: 'critical',
    title: 'OIG Exclusion Added',
    detail: (p) => `${p.name} added to OIG exclusion list at 03:14 AM. License suspended by state board pending investigation. Immediate removal from all networks required.`,
    action: 'Remove from all networks immediately',
    provider: 2,
    icon: '🚨', color: '#ef4444',
    regulation: '42 CFR §1001 — False Claims Act exposure if not acted upon within 24 hours',
  },
  {
    type: 'license_expiry', severity: 'high',
    title: 'License Expiring in 45 Days',
    detail: (p) => `${p.name}'s ${p.state} medical license expires on ${new Date(Date.now() + 45*24*3600000).toLocaleDateString()}. Re-credentialing window opens now. Auto-initiated renewal outreach.`,
    action: 'Begin recredentialing workflow',
    provider: 0,
    icon: '⚠️', color: '#f59e0b',
    regulation: 'NCQA CR 1.A — 120-day verification window',
  },
  {
    type: 'malpractice', severity: 'medium',
    title: 'New NPDB Report Filed',
    detail: (p) => `New malpractice settlement report filed against ${p.name} — $220K settlement, neurological injury claim. This is provider's 2nd NPDB report in 3 years. Risk score elevated.`,
    action: 'Escalate to medical director review',
    provider: 4,
    icon: '⚖️', color: '#f59e0b',
    regulation: 'NCQA CR 2 — Credentialing committee review required',
  },
  {
    type: 'dea', severity: 'high',
    title: 'DEA Registration Expired',
    detail: (p) => `${p.name}'s DEA registration BC4831290 expired yesterday. Provider is actively seeing patients. Prescribing controlled substances without valid DEA is a federal violation.`,
    action: 'Notify provider; restrict prescribing access',
    provider: 5,
    icon: '💊', color: '#ef4444',
    regulation: '21 U.S.C. §841 — Unauthorized controlled substance prescribing',
  },
  {
    type: 'sanction', severity: 'medium',
    title: 'State Medicaid Sanction',
    detail: (p) => `${p.name} received administrative sanction from TX HHSC for billing irregularities. 90-day monitoring period initiated. Claims will be reviewed for anomalies.`,
    action: 'Flag for enhanced monitoring',
    provider: 1,
    icon: '🔍', color: '#8b5cf6',
    regulation: '42 CFR 438.214 — MCO must act on sanctions within 10 business days',
  },
]

function AlertCard({ alert, onAck, onEscalate }) {
  const sev = {
    critical: { color: '#ef4444', bg: 'rgba(239,68,68,.08)', border: 'rgba(239,68,68,.2)' },
    high:     { color: '#f59e0b', bg: 'rgba(245,158,11,.08)', border: 'rgba(245,158,11,.2)' },
    medium:   { color: '#8b5cf6', bg: 'rgba(139,92,246,.08)', border: 'rgba(139,92,246,.2)' },
  }[alert.severity]

  return (
    <div className="animate-in" style={{ background: sev.bg, border: `1px solid ${sev.border}`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 20 }}>{alert.icon}</span>
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: sev.color }}>{alert.title}</span>
            <span className={`badge badge-${alert.severity === 'critical' ? 'danger' : alert.severity === 'high' ? 'warning' : 'purple'}`} style={{ marginLeft: 8 }}>{alert.severity}</span>
          </div>
        </div>
        <span style={{ fontSize: 11, color: '#475569' }}>{new Date().toLocaleTimeString()}</span>
      </div>
      <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, marginBottom: 8 }}>{alert.detail}</p>
      <div style={{ fontSize: 11, color: sev.color, background: `${sev.color}12`, padding: '5px 10px', borderRadius: 6, marginBottom: 10 }}>
        📋 {alert.regulation}
      </div>
      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>
        <strong style={{ color: '#94a3b8' }}>Recommended Action:</strong> {alert.action}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {alert.severity === 'critical' && (
          <button className="btn btn-sm" style={{ background: '#ef4444', color: 'white' }} onClick={() => onEscalate(alert)}>
            🚨 Escalate Now
          </button>
        )}
        <button className="btn btn-outline btn-sm" onClick={() => onAck(alert.id)}>
          ✓ Acknowledge
        </button>
        <button className="btn btn-ghost btn-sm">View Full Record</button>
      </div>
    </div>
  )
}

export default function MonitoringDemo() {
  const [alerts, setAlerts] = useState([])
  const [monitoring, setMonitoring] = useState(false)
  const [alertIdx, setAlertIdx] = useState(0)
  const [stats, setStats] = useState({ checks: 0, exclusions: 0, expirations: 0, clean: 0 })
  const [escalated, setEscalated] = useState([])
  const timerRef = useRef(null)
  const statsRef = useRef(null)

  const startMonitoring = () => {
    setMonitoring(true)
    setAlerts([])
    setAlertIdx(0)
    setStats({ checks: 0, exclusions: 0, expirations: 0, clean: 0 })

    // Generate alerts over time
    const times = [1800, 3400, 5500, 7200, 9800]
    ALERT_TEMPLATES.forEach((t, i) => {
      setTimeout(() => {
        const provider = PROVIDERS[t.provider]
        setAlerts(prev => [{
          ...t,
          id: Date.now() + i,
          detail: t.detail(provider),
          providerName: provider.name,
        }, ...prev])
        setStats(prev => ({
          ...prev,
          exclusions: t.type === 'exclusion' ? prev.exclusions + 1 : prev.exclusions,
          expirations: t.type === 'license_expiry' || t.type === 'dea' ? prev.expirations + 1 : prev.expirations,
        }))
      }, times[i] || (i * 2000 + 1000))
    })

    // Continuous stats ticking
    statsRef.current = setInterval(() => {
      setStats(prev => ({
        ...prev,
        checks: prev.checks + Math.floor(Math.random() * 50 + 30),
        clean: prev.clean + Math.floor(Math.random() * 40 + 20),
      }))
    }, 800)
  }

  const stopMonitoring = () => {
    setMonitoring(false)
    clearInterval(statsRef.current)
  }

  const ackAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id))
  }

  const escalateAlert = (alert) => {
    setEscalated(prev => [...prev, alert])
    ackAlert(alert.id)
  }

  useEffect(() => () => { clearInterval(statsRef.current) }, [])

  return (
    <div style={{ padding: '32px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)', borderRadius: 10, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>👁</div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700 }}>Continuous Monitoring Dashboard</h1>
            <p style={{ color: '#64748b', fontSize: 13 }}>Always-on surveillance across OIG, NPDB, SAM.gov, 56 state boards, and DEA</p>
          </div>
          {monitoring && (
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.25)', borderRadius: 20, padding: '6px 14px' }}>
              <span className="pulse-dot pulse-green" />
              <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>LIVE MONITORING</span>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
          <span className="badge badge-success">43M+ Verifications/Year</span>
          <span className="badge badge-info">Monthly NCQA Mandate</span>
          <span className="badge badge-warning">24hr Alert SLA</span>
          <span className="badge badge-danger">51% More Exclusions Found</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Verifications Run', value: stats.checks.toLocaleString(), color: '#3b82f6', icon: '🔄' },
          { label: 'Providers Clean', value: stats.clean.toLocaleString(), color: '#10b981', icon: '✓' },
          { label: 'Exclusions Found', value: stats.exclusions, color: '#ef4444', icon: '🚨' },
          { label: 'Expirations Flagged', value: stats.expirations, color: '#f59e0b', icon: '⏰' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center', borderColor: `${s.color}20` }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>{s.label}</div>
            {monitoring && s.label === 'Verifications Run' && (
              <div style={{ fontSize: 10, color: '#334155', marginTop: 2 }}>↑ live</div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 24 }}>
        {/* Left: provider roster */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: '#94a3b8' }}>MONITORED PROVIDERS (SAMPLE)</div>
            <div style={{ fontSize: 11, color: '#334155', marginBottom: 10 }}>Showing 6 of 127,400 active providers</div>
            {PROVIDERS.map((p, i) => {
              const hasAlert = alerts.some(a => a.providerName === p.name)
              return (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #1e293b' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `hsl(${i*40},50%,25%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>👤</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#475569' }}>{p.specialty} · {p.state}</div>
                  </div>
                  {hasAlert ? (
                    <span className="pulse-dot pulse-red" />
                  ) : monitoring ? (
                    <span className="pulse-dot pulse-green" />
                  ) : (
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#334155', display: 'inline-block' }} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Monitoring sources */}
          <div className="card">
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: '#94a3b8' }}>SOURCE COVERAGE</div>
            {[
              { source: 'OIG Exclusion Database', freq: 'Daily', status: 'connected' },
              { source: 'SAM.gov (Federal Debarment)', freq: 'Daily', status: 'connected' },
              { source: 'NPDB Continuous Query', freq: 'Real-time', status: 'connected' },
              { source: '56 State Medical Boards', freq: 'Monthly', status: 'connected' },
              { source: 'DEA Registration Portal', freq: 'Weekly', status: 'connected' },
              { source: 'State Medicaid Exclusions', freq: 'Monthly', status: 'connected' },
            ].map(s => (
              <div key={s.source} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #1e293b', fontSize: 12 }}>
                <span style={{ color: '#94a3b8' }}>{s.source}</span>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ color: '#475569' }}>{s.freq}</span>
                  <span style={{ color: '#10b981', fontSize: 10 }}>● Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: alerts feed */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              Live Alert Feed
              {alerts.length > 0 && <span style={{ marginLeft: 8, background: '#ef4444', color: 'white', borderRadius: 12, padding: '1px 8px', fontSize: 11 }}>{alerts.length}</span>}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {!monitoring && <button className="btn btn-success" onClick={startMonitoring}>▶ Start Monitoring</button>}
              {monitoring && <button className="btn btn-outline" onClick={stopMonitoring}>■ Pause</button>}
            </div>
          </div>

          {!monitoring && alerts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#334155' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>👁</div>
              <div style={{ fontSize: 14, marginBottom: 6 }}>Monitoring Inactive</div>
              <div style={{ fontSize: 12, color: '#1e293b' }}>Click "Start Monitoring" to simulate live alerts</div>
            </div>
          )}

          {monitoring && alerts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#334155' }}>
              <div style={{ fontSize: 13 }}>Scanning 127,400 providers…</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 12 }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', animation: `pulse 1.4s ${i*0.2}s infinite` }} />
                ))}
              </div>
            </div>
          )}

          <div style={{ maxHeight: 520, overflow: 'auto' }}>
            {alerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} onAck={ackAlert} onEscalate={escalateAlert} />
            ))}
          </div>

          {escalated.length > 0 && (
            <div style={{ marginTop: 12, padding: 12, background: 'rgba(239,68,68,.05)', border: '1px solid rgba(239,68,68,.15)', borderRadius: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#fca5a5', marginBottom: 6 }}>ESCALATED TO MEDICAL DIRECTOR</div>
              {escalated.map((e, i) => (
                <div key={i} style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>✓ {e.title} — {e.providerName}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
