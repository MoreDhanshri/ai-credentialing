import { useState, useEffect } from 'react'

const DIRECTORY_PROVIDERS = [
  {
    id: 1, name: 'Dr. Carlos Mejia, MD', specialty: 'Psychiatry', location: 'East LA, CA',
    npi: '1234567891', lastClaim: null, claimsLast12Mo: 0, phone: '(213) 555-0142',
    inDirectory: true, directoryAccepted: true,
    ghost: true, confidence: 94,
    reason: 'Zero claims in 14 months. Phone disconnected. No active hospital privileges.',
    recommendation: 'Remove from directory immediately',
  },
  {
    id: 2, name: 'Dr. Amara Nwosu, LCSW', specialty: 'Behavioral Health', location: 'South Side Chicago, IL',
    npi: '1234567892', lastClaim: null, claimsLast12Mo: 0, phone: '(312) 555-0287',
    inDirectory: true, directoryAccepted: false,
    ghost: true, confidence: 88,
    reason: 'Never submitted a claim under this plan. Practice website shows no Molina insurance accepted.',
    recommendation: 'Contact provider — likely credentialed but not seeing Molina patients',
  },
  {
    id: 3, name: 'Dr. Jennifer Park, MD', specialty: 'OB/GYN', location: 'Mesa, AZ',
    npi: '1234567893', lastClaim: '2 days ago', claimsLast12Mo: 847, phone: '(480) 555-0334',
    inDirectory: true, directoryAccepted: true,
    ghost: false, confidence: 99,
    reason: null, recommendation: 'Active — retain in directory',
  },
  {
    id: 4, name: 'Dr. Robert Kaur, MD', specialty: 'Psychiatry', location: 'Houston, TX',
    npi: '1234567894', lastClaim: '11 months ago', claimsLast12Mo: 3, phone: '(832) 555-0519',
    inDirectory: true, directoryAccepted: true,
    ghost: true, confidence: 76,
    reason: 'Dramatic claims decline (312 → 3). May have retired or changed insurance panels.',
    recommendation: 'Attestation required — send 30-day verification notice',
  },
  {
    id: 5, name: 'Dr. Maria Santos, NP', specialty: 'Family Medicine', location: 'Miami, FL',
    npi: '1234567895', lastClaim: 'Yesterday', claimsLast12Mo: 1240, phone: '(305) 555-0672',
    inDirectory: true, directoryAccepted: true,
    ghost: false, confidence: 99,
    reason: null, recommendation: 'Active — retain in directory',
  },
  {
    id: 6, name: 'Dr. Thomas Grant, MD', specialty: 'Behavioral Health', location: 'Phoenix, AZ',
    npi: '1234567896', lastClaim: null, claimsLast12Mo: 0, phone: '(602) 555-0891',
    inDirectory: true, directoryAccepted: false,
    ghost: true, confidence: 91,
    reason: 'Listed at address that is now a dental office (verified via Google Maps AI). License shows different primary address.',
    recommendation: 'Remove immediately — wrong address',
  },
  {
    id: 7, name: 'Dr. Angela Obi, MD', specialty: 'Internal Medicine', location: 'Dallas, TX',
    npi: '1234567897', lastClaim: '3 weeks ago', claimsLast12Mo: 234, phone: '(214) 555-0156',
    inDirectory: true, directoryAccepted: true,
    ghost: false, confidence: 97,
    reason: null, recommendation: 'Active — retain in directory',
  },
  {
    id: 8, name: 'Dr. Felix Huang, MD', specialty: 'Psychiatry', location: 'Sacramento, CA',
    npi: '1234567898', lastClaim: null, claimsLast12Mo: 0, phone: '(916) 555-0423',
    inDirectory: true, directoryAccepted: false,
    ghost: true, confidence: 82,
    reason: 'NPPES shows license inactive. No response to 3 attestation attempts.',
    recommendation: 'Remove — inactive license detected',
  },
]

const SIGNAL_SOURCES = [
  { name: 'Claims Data Analysis', icon: '📊', weight: '35%', desc: 'Cross-references directory vs. actual billing activity' },
  { name: 'Multi-Channel Attestation', icon: '📱', weight: '25%', desc: 'Email portal, text, and automated outreach' },
  { name: 'NPPES / State Board', icon: '🏛', weight: '20%', desc: 'License status and address verification' },
  { name: 'Web Intelligence', icon: '🌐', weight: '10%', desc: 'Practice websites, scheduling availability' },
  { name: 'CAQH Reconciliation', icon: '🔄', weight: '10%', desc: 'Cross-checks provider self-reported data' },
]

export default function DirectoryDemo() {
  const [scanning, setScanning] = useState(false)
  const [scanned, setScanned] = useState(false)
  const [revealedCount, setRevealedCount] = useState(0)
  const [selected, setSelected] = useState(null)
  const [removed, setRemoved] = useState(new Set())
  const [accuracy, setAccuracy] = useState(72)

  const runScan = () => {
    setScanning(true)
    setRevealedCount(0)
    setScanned(false)
    setRemoved(new Set())

    let count = 0
    const interval = setInterval(() => {
      count++
      setRevealedCount(count)
      if (count >= DIRECTORY_PROVIDERS.length) {
        clearInterval(interval)
        setScanning(false)
        setScanned(true)
        setAccuracy(72)
      }
    }, 400)
  }

  const removeProvider = (id) => {
    setRemoved(prev => {
      const next = new Set(prev)
      next.add(id)
      const ghostsTotal = DIRECTORY_PROVIDERS.filter(p => p.ghost).length
      const removedGhosts = DIRECTORY_PROVIDERS.filter(p => p.ghost && next.has(p.id)).length
      setAccuracy(Math.min(91, 72 + Math.round((removedGhosts / ghostsTotal) * 19)))
      return next
    })
  }

  const ghosts = DIRECTORY_PROVIDERS.filter(p => p.ghost)
  const clean = DIRECTORY_PROVIDERS.filter(p => !p.ghost)

  return (
    <div style={{ padding: '32px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', borderRadius: 10, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🗺</div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700 }}>Provider Directory AI</h1>
            <p style={{ color: '#64748b', fontSize: 13 }}>ML-powered ghost network detection using claims data + multi-source reconciliation</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
          <span className="badge badge-danger">72% Current Accuracy (HHS OIG)</span>
          <span className="badge badge-success">91%+ with AI</span>
          <span className="badge badge-warning">REAL Health Providers Act 2026</span>
          <span className="badge badge-info">Public Scores: 2029</span>
        </div>
      </div>

      {/* Regulatory alert */}
      <div style={{ background: 'rgba(239,68,68,.06)', border: '1px solid rgba(239,68,68,.18)', borderRadius: 12, padding: 16, marginBottom: 24, display: 'flex', gap: 12 }}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>⚠</span>
        <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>
          <strong style={{ color: '#fca5a5' }}>REAL Health Providers Act (Feb 3, 2026):</strong> Requires 90-day verification cycles, 5-business-day removal of non-participating providers, and
          <strong style={{ color: '#fbbf24' }}> public CMS accuracy scores starting 2029</strong>. Current industry average: 28% accurate.
          CMS fine exposure: <strong style={{ color: '#fca5a5' }}>$25,000 per beneficiary per violation</strong>.
        </div>
      </div>

      {/* Accuracy meter + signals */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24, marginBottom: 24 }}>
        {/* Accuracy meter */}
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 20 }}>DIRECTORY ACCURACY SCORE</div>
          <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto 20px' }}>
            <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="80" cy="80" r="65" fill="none" stroke="#1e293b" strokeWidth="14" />
              <circle cx="80" cy="80" r="65" fill="none"
                stroke={accuracy < 80 ? '#ef4444' : accuracy < 90 ? '#f59e0b' : '#10b981'}
                strokeWidth="14"
                strokeDasharray={`${2 * Math.PI * 65 * accuracy / 100} 1000`}
                strokeLinecap="round"
                style={{ transition: 'all .6s ease' }}
              />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: accuracy < 80 ? '#ef4444' : accuracy < 90 ? '#f59e0b' : '#10b981' }}>{accuracy}%</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>accurate</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>
            {accuracy === 72 ? 'Before AI: Industry avg (HHS OIG 2025)' : `After removing ${removed.size} ghost provider${removed.size !== 1 ? 's' : ''}`}
          </div>
          {accuracy > 72 && (
            <div style={{ fontSize: 11, color: '#10b981', marginTop: 4 }}>
              +{accuracy - 72}pp improvement · Approaching 91% target
            </div>
          )}
          <div style={{ marginTop: 16, fontSize: 11, color: '#334155', textAlign: 'left' }}>
            <div style={{ marginBottom: 4 }}>CMS Threshold (2029): <span style={{ color: '#f59e0b' }}>≥ 85%</span></div>
            <div style={{ marginBottom: 4 }}>Current Status: <span style={{ color: accuracy >= 85 ? '#10b981' : '#ef4444' }}>{accuracy >= 85 ? '✓ Compliant' : '✗ Non-compliant'}</span></div>
            <div>Behavioral Health: <span style={{ color: '#ef4444' }}>50% accurate (worst)</span></div>
          </div>
        </div>

        {/* Signal sources */}
        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 14 }}>AI SIGNAL SOURCES (ML MODEL INPUTS)</div>
          {SIGNAL_SOURCES.map(s => (
            <div key={s.name} style={{ display: 'flex', gap: 12, marginBottom: 14, padding: '10px', background: 'rgba(255,255,255,.02)', borderRadius: 8 }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{s.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#cbd5e1' }}>{s.name}</span>
                  <span style={{ fontSize: 12, color: '#8b5cf6', fontWeight: 700 }}>{s.weight}</span>
                </div>
                <div style={{ fontSize: 11, color: '#475569', marginBottom: 5 }}>{s.desc}</div>
                <div className="progress">
                  <div className="progress-fill progress-blue" style={{ width: s.weight }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scan controls */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
        {!scanned && !scanning && (
          <button className="btn btn-primary btn-lg" onClick={runScan}>
            🔍 Run ML Ghost Detection Scan
          </button>
        )}
        {scanning && (
          <button className="btn btn-outline btn-lg" disabled>
            <span className="spinner" /> Analyzing {revealedCount} of {DIRECTORY_PROVIDERS.length} providers…
          </button>
        )}
        {scanned && (
          <>
            <button className="btn btn-outline" onClick={runScan}>↺ Rescan</button>
            <div style={{ padding: '10px 16px', background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 10 }}>
              <span style={{ fontSize: 13, color: '#fca5a5', fontWeight: 700 }}>
                ⚠ {ghosts.length} ghost providers detected out of {DIRECTORY_PROVIDERS.length} sampled · {removed.size} removed
              </span>
            </div>
          </>
        )}
      </div>

      {/* Provider grid */}
      {revealedCount > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {DIRECTORY_PROVIDERS.slice(0, revealedCount).map(p => {
            const isRemoved = removed.has(p.id)
            return (
              <div key={p.id}
                className="animate-in"
                onClick={() => setSelected(selected?.id === p.id ? null : p)}
                style={{
                  background: isRemoved ? '#0f172a' : p.ghost ? 'rgba(239,68,68,.04)' : 'rgba(16,185,129,.04)',
                  border: `1px solid ${isRemoved ? '#1e293b' : p.ghost ? 'rgba(239,68,68,.2)' : 'rgba(16,185,129,.2)'}`,
                  borderRadius: 12, padding: 14, cursor: 'pointer', transition: 'all .2s',
                  opacity: isRemoved ? 0.4 : 1,
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 2, textDecoration: isRemoved ? 'line-through' : 'none' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#475569' }}>{p.specialty} · {p.location}</div>
                  </div>
                  {isRemoved ? (
                    <span className="badge badge-ghost">Removed</span>
                  ) : p.ghost ? (
                    <span className="badge badge-danger">👻 Ghost ({p.confidence}%)</span>
                  ) : (
                    <span className="badge badge-success">✓ Active</span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#475569', marginBottom: p.ghost ? 8 : 0 }}>
                  <span>Claims 12mo: <strong style={{ color: p.claimsLast12Mo > 0 ? '#94a3b8' : '#ef4444' }}>{p.claimsLast12Mo}</strong></span>
                  <span>Last: <strong style={{ color: p.lastClaim ? '#94a3b8' : '#ef4444' }}>{p.lastClaim || 'Never'}</strong></span>
                </div>

                {p.ghost && !isRemoved && (
                  <>
                    <div style={{ fontSize: 11, color: '#fca5a5', background: 'rgba(239,68,68,.06)', padding: '6px 8px', borderRadius: 6, marginBottom: 8, lineHeight: 1.5 }}>
                      {p.reason}
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-sm" style={{ background: '#ef4444', color: 'white' }}
                        onClick={e => { e.stopPropagation(); removeProvider(p.id) }}>
                        Remove
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={e => e.stopPropagation()}>
                        Send Attestation
                      </button>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
