import { useState, useEffect, useRef } from 'react'

const PROVIDER_DATA = {
  name: 'Dr. Michael Torres, MD',
  specialty: 'Orthopedic Surgery',
  npi: '1567890234',
  applyingFor: 'Molina Healthcare CA, TX, AZ Networks',
  medicalSchool: 'UCLA School of Medicine, 2006',
  residency: 'Mayo Clinic Orthopedic Surgery, 2011',
  fellowship: 'Hospital for Special Surgery, Sports Medicine, 2012',
  yearsInPractice: 14,
}

const PSV_DATA = {
  licenseStatus: 'Active — CA License G77123, expires 3/31/2027',
  npdbHits: 2,
  malpractice: '2 closed claims: $180K (2019, disk herniation, partial payment), $95K (2022, infection, no payment)',
  exclusions: 'None — OIG, SAM.gov, all 56 state Medicaid lists clear',
  boardCert: 'ABOS Orthopedic Surgery — Certified, MOC current, expires 12/31/2026',
  hospitalPrivileges: 'Cedars-Sinai (Active), UCLA Health (Active), Keck Medical Center (Active)',
  dea: 'Active, Schedules II–V, expires 4/30/2026',
  references: '3/3 positive responses received — colleagues rate as "excellent" or "outstanding"',
}

const GENERATED_NARRATIVE = `CREDENTIALING COMMITTEE PACKET — CONFIDENTIAL
Provider: Dr. Michael Torres, MD | Specialty: Orthopedic Surgery | Date: ${new Date().toLocaleDateString('en-US', {month:'long',day:'numeric',year:'numeric'})}

═══════════════════════════════════════════════

EXECUTIVE SUMMARY — AI RISK ASSESSMENT: MEDIUM (REQUIRES COMMITTEE REVIEW)

Dr. Torres presents a strong overall credential profile for an experienced orthopedic surgeon with 14 years of practice. Two closed malpractice claims require committee consideration, though both fall within statistically normal ranges for the specialty. No exclusions, sanctions, or licensing issues were identified. Committee approval is recommended with standard 12-month enhanced claims monitoring.

═══════════════════════════════════════════════

1. PROFESSIONAL BACKGROUND

Dr. Torres completed his medical degree at UCLA School of Medicine (2006), followed by Orthopedic Surgery residency training at Mayo Clinic (2011) and a Sports Medicine fellowship at Hospital for Special Surgery in New York (2012). He has been in active practice for 14 years, currently holding active privileges at three major California academic medical centers.

2. LICENSURE & CERTIFICATION STATUS ✓ VERIFIED

All licensure and certification status is current and in good standing. California Medical License G77123 is active with no disciplinary history, expiring March 31, 2027. ABOS board certification is current with Maintenance of Certification up to date. DEA registration is active for Schedules II–V.

3. MALPRACTICE HISTORY ⚠ REQUIRES COMMITTEE REVIEW

NPDB query returned 2 closed reports:

  • Claim #1 (2019): Alleged incomplete resolution of disk herniation L4-L5. Partial payment $180,000. Provider maintains surgery outcome was within standard of care; settlement was for cost efficiency. Independent review rated causation as "possible but not established."

  • Claim #2 (2022): Post-operative infection following total knee arthroplasty. No payment made; claim dismissed. Complication rate consistent with published literature for this procedure type.

AI Risk Analysis: Based on PIAA benchmark data, the orthopedic surgery specialty has a mean of 1.8 claims per 10 years for surgeons with this case volume and procedure mix. Dr. Torres's rate of 2 claims over 14 years is within the expected range. No clustering by procedure type, facility, or patient population that would suggest systemic quality concerns. Risk classification: MEDIUM — routine monitoring recommended.

4. EXCLUSIONS & SANCTIONS ✓ CLEAR

Comprehensive exclusion search across OIG, SAM.gov, and all 56 state Medicaid exclusion databases returned no results. No state medical board sanctions, no FDA debarment, no OFAC matches. The provider has no history of Medicare or Medicaid billing fraud or abuse findings.

5. HOSPITAL PRIVILEGES ✓ VERIFIED

Active surgical privileges confirmed at: Cedars-Sinai Medical Center (unrestricted), UCLA Health (unrestricted), Keck Medical Center (unrestricted). No pending or completed privilege revocations or restrictions at any institution. Peer references at all three facilities uniformly positive.

6. PEER REFERENCES ✓ POSITIVE

All three required peer references responded within 10 business days. Ratings: 3/3 "excellent" or "outstanding" for clinical competence, judgment, and interpersonal conduct with patients and colleagues.

═══════════════════════════════════════════════

COMMITTEE RECOMMENDATION

APPROVE with conditions:
  ✓ Standard 36-month re-credentialing cycle
  ✓ 12-month enhanced claims monitoring (flag any new malpractice filings)
  ✓ DEA registration renewal reminder at 6 months prior to expiration
  ✓ ABOS MOC tracking — board cert renewal December 2026

Prepared by: Molina CredentialAI Platform v2.4 | Review Time: 3.2 seconds
Human Review Required Before Committee Distribution`

export default function CommitteeDemo() {
  const [phase, setPhase] = useState('idle') // idle | analyzing | generating | complete
  const [displayedText, setDisplayedText] = useState('')
  const [analysisStep, setAnalysisStep] = useState(0)
  const [riskScore, setRiskScore] = useState(null)
  const intervalRef = useRef(null)

  const ANALYSIS_STEPS = [
    { label: 'Ingesting PSV results from 70+ sources…', duration: 900 },
    { label: 'Analyzing NPDB reports and malpractice patterns…', duration: 1100 },
    { label: 'Cross-referencing specialty benchmarks (PIAA data)…', duration: 900 },
    { label: 'Scoring risk against NCQA CR criteria…', duration: 700 },
    { label: 'Drafting committee narrative…', duration: 600 },
  ]

  const runGeneration = () => {
    setPhase('analyzing')
    setAnalysisStep(0)
    setDisplayedText('')
    setRiskScore(null)

    let stepIdx = 0
    const runStep = () => {
      if (stepIdx >= ANALYSIS_STEPS.length) {
        setPhase('generating')
        setRiskScore('MEDIUM')
        // Type the narrative
        let charIdx = 0
        intervalRef.current = setInterval(() => {
          charIdx += Math.floor(Math.random() * 12) + 6
          if (charIdx >= GENERATED_NARRATIVE.length) {
            charIdx = GENERATED_NARRATIVE.length
            clearInterval(intervalRef.current)
            setPhase('complete')
          }
          setDisplayedText(GENERATED_NARRATIVE.slice(0, charIdx))
        }, 25)
        return
      }
      setAnalysisStep(stepIdx)
      stepIdx++
      setTimeout(runStep, ANALYSIS_STEPS[stepIdx - 1]?.duration || 800)
    }
    runStep()
  }

  const reset = () => {
    clearInterval(intervalRef.current)
    setPhase('idle')
    setDisplayedText('')
    setAnalysisStep(0)
    setRiskScore(null)
  }

  useEffect(() => () => clearInterval(intervalRef.current), [])

  return (
    <div style={{ padding: '32px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', borderRadius: 10, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>✦</div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700 }}>AI Committee Packet Generator</h1>
            <p style={{ color: '#64748b', fontSize: 13 }}>LLM synthesizes PSV results, malpractice history, and risk signals into committee-ready narratives</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
          <span className="badge badge-warning">LLM-Powered Synthesis</span>
          <span className="badge badge-info">3.2s Generation Time</span>
          <span className="badge badge-purple">NCQA CR 2 Compliant</span>
          <span className="badge badge-cyan">Human Review Required</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24 }}>
        {/* Left: provider card + inputs */}
        <div>
          {/* Provider */}
          <div className="card" style={{ marginBottom: 16, borderColor: 'rgba(245,158,11,.2)', background: 'linear-gradient(135deg, #0f172a, rgba(245,158,11,.03))' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#f59e0b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.5px' }}>Provider Under Review</div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #f59e0b, #ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>👨‍⚕️</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{PROVIDER_DATA.name}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>{PROVIDER_DATA.specialty}</div>
                <div style={{ fontSize: 11, color: '#475569' }}>NPI: {PROVIDER_DATA.npi}</div>
              </div>
            </div>
            {[
              ['Medical School', PROVIDER_DATA.medicalSchool],
              ['Residency', PROVIDER_DATA.residency],
              ['Fellowship', PROVIDER_DATA.fellowship],
              ['Years in Practice', `${PROVIDER_DATA.yearsInPractice} years`],
              ['Applying For', PROVIDER_DATA.applyingFor],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 8, marginBottom: 7, fontSize: 12 }}>
                <span style={{ color: '#475569', minWidth: 100, flexShrink: 0 }}>{k}:</span>
                <span style={{ color: '#94a3b8' }}>{v}</span>
              </div>
            ))}
          </div>

          {/* PSV inputs */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.5px' }}>PSV Data Inputs</div>
            {Object.entries(PSV_DATA).map(([k, v]) => {
              const labels = { licenseStatus: 'License', npdbHits: 'NPDB Hits', malpractice: 'Malpractice', exclusions: 'Exclusions', boardCert: 'Board Cert', hospitalPrivileges: 'Privileges', dea: 'DEA', references: 'References' }
              const colors = { npdbHits: '#f59e0b', malpractice: '#f59e0b', exclusions: '#10b981', licenseStatus: '#10b981' }
              return (
                <div key={k} style={{ marginBottom: 10, padding: '8px 10px', background: 'rgba(255,255,255,.02)', borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 3 }}>{labels[k] || k}</div>
                  <div style={{ fontSize: 12, color: colors[k] || '#94a3b8', lineHeight: 1.5 }}>{v}</div>
                </div>
              )
            })}
          </div>

          {/* Risk score */}
          {riskScore && (
            <div className="animate-in card" style={{ borderColor: 'rgba(245,158,11,.25)', background: 'rgba(245,158,11,.05)', textAlign: 'center', padding: 20 }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6, textTransform: 'uppercase' }}>AI Risk Classification</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#f59e0b' }}>{riskScore}</div>
              <div style={{ fontSize: 12, color: '#92400e', marginTop: 4 }}>Committee review required · Enhanced monitoring recommended</div>
            </div>
          )}
        </div>

        {/* Right: generated narrative */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Generated Committee Packet</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {phase === 'idle' && (
                <button className="btn btn-primary" onClick={runGeneration}>✦ Generate with AI</button>
              )}
              {(phase === 'analyzing' || phase === 'generating') && (
                <button className="btn btn-outline" disabled><span className="spinner" /> Generating…</button>
              )}
              {phase === 'complete' && (
                <>
                  <button className="btn btn-success btn-sm">📤 Send to Committee</button>
                  <button className="btn btn-ghost btn-sm" onClick={reset}>↺</button>
                </>
              )}
            </div>
          </div>

          {/* Analysis steps */}
          {(phase === 'analyzing' || phase === 'generating') && (
            <div className="card" style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 10 }}>AI ANALYSIS IN PROGRESS</div>
              {ANALYSIS_STEPS.map((step, i) => {
                const done = i < analysisStep
                const active = i === analysisStep && phase === 'analyzing'
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, opacity: done ? 1 : active ? 1 : 0.35 }}>
                    {done ? (
                      <span style={{ color: '#10b981', fontSize: 14 }}>✓</span>
                    ) : active ? (
                      <span className="spinner" />
                    ) : (
                      <span style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid #334155', display: 'inline-block' }} />
                    )}
                    <span style={{ fontSize: 12, color: done ? '#10b981' : active ? '#e2e8f0' : '#475569' }}>{step.label}</span>
                  </div>
                )
              })}
            </div>
          )}

          {/* Narrative output */}
          <div style={{
            background: '#0a0f1d', border: '1px solid #1e293b', borderRadius: 12,
            padding: 20, minHeight: 480, maxHeight: 560, overflow: 'auto',
            fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: 12,
            lineHeight: 1.75, color: '#94a3b8', whiteSpace: 'pre-wrap',
          }}>
            {phase === 'idle' && (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#334155', fontFamily: 'Inter, sans-serif' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>✦</div>
                <div>Click "Generate with AI" to synthesize PSV data into a committee packet</div>
                <div style={{ fontSize: 11, color: '#1e293b', marginTop: 6 }}>Takes 3–5 seconds vs. 2–3 hours manually</div>
              </div>
            )}
            {displayedText && (
              <span style={{ color: '#94a3b8' }}>
                {displayedText.split('\n').map((line, i) => {
                  if (line.startsWith('CREDENTIALING COMMITTEE') || line.startsWith('═')) return <span key={i} style={{ color: '#3b82f6' }}>{line}{'\n'}</span>
                  if (line.includes('EXECUTIVE SUMMARY')) return <span key={i} style={{ color: '#f59e0b', fontWeight: 700 }}>{line}{'\n'}</span>
                  if (line.match(/^\d\./)) return <span key={i} style={{ color: '#e2e8f0', fontWeight: 600 }}>{line}{'\n'}</span>
                  if (line.includes('✓')) return <span key={i} style={{ color: '#10b981' }}>{line}{'\n'}</span>
                  if (line.includes('⚠')) return <span key={i} style={{ color: '#f59e0b' }}>{line}{'\n'}</span>
                  if (line.includes('APPROVE')) return <span key={i} style={{ color: '#10b981', fontWeight: 700 }}>{line}{'\n'}</span>
                  return <span key={i}>{line}{'\n'}</span>
                })}
                {phase !== 'complete' && <span style={{ animation: 'blink 1s infinite', background: '#3b82f6', color: 'transparent' }}>|</span>}
              </span>
            )}
          </div>

          {phase === 'complete' && (
            <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(59,130,246,.08)', border: '1px solid rgba(59,130,246,.2)', borderRadius: 10, display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 18 }}>⚠</span>
              <div style={{ fontSize: 12, color: '#60a5fa' }}>
                <strong>NCQA CR 2 Compliance:</strong> This AI-generated narrative is for committee preparation only. A licensed physician must review adverse findings before any credentialing decision is finalized. Full audit trail preserved.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
