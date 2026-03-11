import { useState, useEffect, useRef } from 'react'

const DOCUMENTS = [
  { name: 'Dr_Sarah_Chen_Medical_License_CA.pdf', size: '142 KB', type: 'State Medical License', icon: '📄' },
  { name: 'ABMS_Board_Certification_Internal_Medicine.pdf', size: '89 KB', type: 'Board Certification', icon: '🎓' },
  { name: 'DEA_Registration_BC4821973.pdf', size: '67 KB', type: 'DEA Registration', icon: '💊' },
  { name: 'Malpractice_Insurance_ProAssurance_2025.pdf', size: '203 KB', type: 'Malpractice Certificate', icon: '🛡' },
  { name: 'CAQH_ProView_Export_1047382.xml', size: '418 KB', type: 'CAQH Export', icon: '📊' },
]

const EXTRACTED_FIELDS = [
  { label: 'Full Legal Name', value: 'Sarah Mei-Ling Chen, MD', confidence: 99, source: 'Medical License' },
  { label: 'NPI Number', value: '1234567890', confidence: 100, source: 'NPPES (Live Query)' },
  { label: 'State License #', value: 'G 98234 (CA)', confidence: 98, source: 'CA Medical Board' },
  { label: 'License Expiration', value: 'June 30, 2027', confidence: 99, source: 'CA Medical Board' },
  { label: 'DEA Number', value: 'BC4821973', confidence: 100, source: 'DEA Registration PDF' },
  { label: 'DEA Schedule', value: 'Schedules II–V', confidence: 97, source: 'DEA Registration PDF' },
  { label: 'Board Certification', value: 'Internal Medicine — ABIM', confidence: 99, source: 'ABMS Direct API' },
  { label: 'Board Cert. Expiration', value: 'December 31, 2027', confidence: 98, source: 'ABMS Direct API' },
  { label: 'Malpractice Carrier', value: 'ProAssurance Indemnity', confidence: 99, source: 'Certificate PDF' },
  { label: 'Coverage Amount', value: '$1M / $3M per occurrence/aggregate', confidence: 97, source: 'Certificate PDF' },
  { label: 'Medical School', value: 'UCSF School of Medicine, 2008', confidence: 96, source: 'CAQH Export' },
  { label: 'Residency', value: 'Stanford Internal Medicine, 2011', confidence: 95, source: 'CAQH Export' },
  { label: 'CAQH ID', value: '10473820', confidence: 100, source: 'CAQH ProView' },
  { label: 'Tax ID (EIN)', value: '94-XXXXX12', confidence: 100, source: 'CAQH Export' },
]

const GAPS = [
  { field: 'Hospital Privileges', status: 'missing', action: 'Auto-requesting from Stanford Medicine' },
  { field: 'Work History (2015–2016)', status: 'gap', action: 'Provider outreach triggered — email sent' },
]

export default function IntakeDemo() {
  const [phase, setPhase] = useState('idle') // idle | uploading | scanning | extracting | complete
  const [uploadProgress, setUploadProgress] = useState(0)
  const [scanProgress, setScanProgress] = useState(0)
  const [extractedCount, setExtractedCount] = useState(0)
  const [selectedDoc, setSelectedDoc] = useState(0)
  const timerRef = useRef(null)

  const runDemo = () => {
    setPhase('uploading')
    setUploadProgress(0)
    setScanProgress(0)
    setExtractedCount(0)

    // Upload phase
    let up = 0
    const t1 = setInterval(() => {
      up = Math.min(up + Math.random() * 15 + 5, 100)
      setUploadProgress(Math.round(up))
      if (up >= 100) {
        clearInterval(t1)
        setPhase('scanning')
        let sp = 0
        const t2 = setInterval(() => {
          sp = Math.min(sp + Math.random() * 8 + 3, 100)
          setScanProgress(Math.round(sp))
          if (sp >= 100) {
            clearInterval(t2)
            setPhase('extracting')
            let count = 0
            const t3 = setInterval(() => {
              count++
              setExtractedCount(count)
              if (count >= EXTRACTED_FIELDS.length) {
                clearInterval(t3)
                setTimeout(() => setPhase('complete'), 600)
              }
            }, 180)
          }
        }, 90)
      }
    }, 80)
  }

  const reset = () => {
    setPhase('idle')
    setUploadProgress(0)
    setScanProgress(0)
    setExtractedCount(0)
  }

  const isRunning = phase !== 'idle' && phase !== 'complete'

  return (
    <div style={{ padding: '32px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', borderRadius: 10, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📥</div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700 }}>Portal & AI Intake</h1>
            <p style={{ color: '#64748b', fontSize: 13 }}>Credentialing need assessment → CAQH auto-pull → MCO eligibility (FME) → AI completeness evaluation</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
          <span className="badge badge-info">Portal Assessment</span>
          <span className="badge badge-success">CAQH Auto-Pull</span>
          <span className="badge badge-purple">MCO Eligibility (FME)</span>
          <span className="badge badge-cyan">AI Completeness Check</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 24 }}>
        {/* Left: document queue + controls */}
        <div>
          {/* Before / After */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            {[
              { label: 'Manual Process', value: '8 days', sub: 'avg intake time', color: '#ef4444' },
              { label: 'AI-Assisted', value: '< 10 min', sub: 'with auto-extraction', color: '#10b981' },
            ].map(m => (
              <div key={m.label} className="card" style={{ textAlign: 'center', borderColor: `${m.color}22` }}>
                <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: m.color }}>{m.value}</div>
                <div style={{ fontSize: 11, color: '#475569' }}>{m.sub}</div>
              </div>
            ))}
          </div>

          {/* Document Queue */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: '#94a3b8' }}>CAQH AUTO-PULLED DOCUMENTS</div>
            {DOCUMENTS.map((doc, i) => (
              <div key={i}
                onClick={() => setSelectedDoc(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 8, marginBottom: 6,
                  cursor: 'pointer', transition: 'all .15s',
                  background: selectedDoc === i ? 'rgba(59,130,246,.1)' : 'rgba(255,255,255,.02)',
                  border: `1px solid ${selectedDoc === i ? 'rgba(59,130,246,.3)' : 'transparent'}`,
                }}
              >
                <span style={{ fontSize: 18 }}>{doc.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</div>
                  <div style={{ fontSize: 11, color: '#475569' }}>{doc.type} · {doc.size}</div>
                </div>
                {phase === 'complete' && (
                  <span style={{ color: '#10b981', fontSize: 14 }}>✓</span>
                )}
                {isRunning && i <= selectedDoc && (
                  <span className="spinner" />
                )}
              </div>
            ))}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: 8 }}>
            {phase === 'idle' && (
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={runDemo}>
                ▶ Run Portal Assessment
              </button>
            )}
            {isRunning && (
              <button className="btn btn-outline" style={{ flex: 1 }} disabled>
                <span className="spinner" /> Processing…
              </button>
            )}
            {phase === 'complete' && (
              <>
                <button className="btn btn-success" style={{ flex: 1 }}>
                  ✓ Proceed to PSV
                </button>
                <button className="btn btn-ghost" onClick={reset}>↺</button>
              </>
            )}
          </div>
        </div>

        {/* Right: extraction output */}
        <div>
          {/* Processing phases */}
          {(isRunning || phase === 'complete') && (
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: '#94a3b8' }}>AI PROCESSING PIPELINE</div>
              {[
                { label: '1. Portal Assessment + CAQH Auto-Pull', key: 'uploading', prog: uploadProgress, color: '#3b82f6' },
                { label: '2. MCO Eligibility Check (FME)', key: 'scanning', prog: scanProgress, color: '#06b6d4' },
                { label: '3. AI Completeness Evaluation', key: 'extracting', prog: Math.round((extractedCount / EXTRACTED_FIELDS.length) * 100), color: '#8b5cf6' },
              ].map(p => {
                const done = p.key === 'uploading' ? uploadProgress >= 100 :
                             p.key === 'scanning' ? scanProgress >= 100 :
                             extractedCount >= EXTRACTED_FIELDS.length
                const active = (p.key === 'uploading' && phase === 'uploading') ||
                               (p.key === 'scanning' && phase === 'scanning') ||
                               (p.key === 'extracting' && (phase === 'extracting' || phase === 'complete'))
                return (
                  <div key={p.key} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 12, color: done ? '#10b981' : active ? '#e2e8f0' : '#475569' }}>
                        {done ? '✓ ' : active ? '⟳ ' : '○ '}{p.label}
                      </span>
                      <span style={{ fontSize: 12, color: p.color, fontWeight: 600 }}>{done ? '100%' : active ? `${p.prog}%` : '—'}</span>
                    </div>
                    <div className="progress">
                      <div className="progress-fill" style={{ width: `${done ? 100 : active ? p.prog : 0}%`, background: p.color, transition: 'width .3s' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Portal Assessment Result */}
          {uploadProgress >= 100 && (
            <div className="animate-in card" style={{ marginBottom: 16, borderColor: 'rgba(16,185,129,.2)', background: 'rgba(16,185,129,.04)' }}>
              <div style={{ fontSize: 11, color: '#10b981', fontWeight: 700, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.5px' }}>Portal Assessment Result</div>
              {[
                ['Delegated Agreement', 'Not applicable'],
                ['Existing Credential on File', 'None found'],
                ['MCO Eligibility (FME)', 'Confirmed ✓'],
                ['Decision', 'New credentialing required'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                  <span style={{ color: '#475569' }}>{k}</span>
                  <span style={{ color: v.includes('✓') || v === 'Confirmed ✓' ? '#10b981' : '#94a3b8', fontWeight: v === 'New credentialing required' ? 600 : 400 }}>{v}</span>
                </div>
              ))}
            </div>
          )}

          {/* Extracted fields */}
          <div className="card" style={{ maxHeight: 420, overflow: 'auto' }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
              <span>COMPLETENESS EVALUATION</span>
              {extractedCount > 0 && <span style={{ color: '#10b981', fontWeight: 700 }}>{extractedCount}/{EXTRACTED_FIELDS.length} fields</span>}
            </div>

            {phase === 'idle' && (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#334155' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
                <div style={{ fontSize: 13 }}>Click "Run Portal Assessment" to see the full intake flow</div>
              </div>
            )}

            {extractedCount === 0 && isRunning && phase !== 'extracting' && (
              <div style={{ padding: '16px 0' }}>
                {[1,2,3,4,5].map(i => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div className="skeleton" style={{ height: 12, width: `${40 + i*10}%`, marginBottom: 4 }} />
                    <div className="skeleton" style={{ height: 14, width: `${50 + i*8}%` }} />
                  </div>
                ))}
              </div>
            )}

            {EXTRACTED_FIELDS.slice(0, extractedCount).map((f, i) => (
              <div key={i} className="animate-in" style={{ marginBottom: 10, padding: '8px 10px', background: 'rgba(255,255,255,.02)', borderRadius: 8, border: '1px solid rgba(255,255,255,.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 11, color: '#475569' }}>{f.label}</span>
                  <span style={{ fontSize: 11, color: f.confidence > 97 ? '#10b981' : '#f59e0b' }}>
                    {f.confidence}% confidence
                  </span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 2 }}>{f.value}</div>
                <div style={{ fontSize: 11, color: '#3b82f6' }}>Source: {f.source}</div>
              </div>
            ))}
          </div>

          {/* Gap alerts */}
          {phase === 'complete' && (
            <div className="card" style={{ marginTop: 16, borderColor: 'rgba(245,158,11,.2)' }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: '#f59e0b' }}>⚠ GAPS AUTO-DETECTED — OUTREACH INITIATED</div>
              {GAPS.map((g, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'rgba(245,158,11,.05)', borderRadius: 8, marginBottom: 8, border: '1px solid rgba(245,158,11,.12)' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fbbf24' }}>{g.field}</div>
                    <div style={{ fontSize: 11, color: '#92400e' }}>{g.action}</div>
                  </div>
                  <span className="badge badge-warning">{g.status}</span>
                </div>
              ))}
              <div style={{ marginTop: 10, padding: '8px 10px', background: 'rgba(16,185,129,.05)', borderRadius: 8, border: '1px solid rgba(16,185,129,.12)' }}>
                <span style={{ fontSize: 12, color: '#10b981' }}>✓ 12 of 14 required fields complete · AI evaluation: Complete — Ready to proceed to PSV</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
