import { useState, useRef } from 'react'

const VERIFY_SCOPE = [
  'State medical license — all practice states (CA, TX, NV)',
  'DEA registration and schedule authority',
  'Board certification and MOC status',
  'NPDB continuous query',
  'Federal and state exclusion databases (56 lists)',
  'Malpractice insurance and claims history',
  'Hospital privileges — all active facilities',
  'Medicare/Medicaid enrollment (PECOS)',
]

const AGENTS = [
  {
    id: 'license', name: 'State Licensing Agent', icon: '📋',
    sources: ['CA Medical Board', 'TX Medical Board', 'NY Medical Board', 'FL Medical Board'],
    totalSources: 50, color: '#3b82f6',
    result: { status: 'verified', detail: 'CA License G98234 — Active, expires 6/30/2027. No disciplinary history.', risk: 'low' }
  },
  {
    id: 'npdb', name: 'NPDB Agent', icon: '🔍',
    sources: ['NPDB Continuous Query', 'Adverse Action Registry'],
    totalSources: 2, color: '#8b5cf6',
    result: { status: 'verified', detail: 'No malpractice reports. No adverse actions. Zero NPDB hits.', risk: 'low' }
  },
  {
    id: 'exclusions', name: 'Exclusions Agent', icon: '🚫',
    sources: ['OIG Exclusion Database', 'SAM.gov', 'CA Medi-Cal Exclusions', 'TX Medicaid', 'OFAC'],
    totalSources: 56, color: '#10b981',
    result: { status: 'verified', detail: 'No exclusions across all federal and state Medicaid lists. OFAC: Clear.', risk: 'low' }
  },
  {
    id: 'dea', name: 'DEA Agent', icon: '💊',
    sources: ['DEA Registration Portal', 'PDMP (CA CURES)'],
    totalSources: 2, color: '#f59e0b',
    result: { status: 'verified', detail: 'DEA BC4821973 — Active, Schedules II–V. No prescribing anomalies detected.', risk: 'low' }
  },
  {
    id: 'board', name: 'Board Certification Agent', icon: '🎓',
    sources: ['ABMS MOC Database', 'AOA Board Registry'],
    totalSources: 2, color: '#06b6d4',
    result: { status: 'verified', detail: 'ABIM Internal Medicine — Certified, MOC current, expires 12/31/2027.', risk: 'low' }
  },
  {
    id: 'training', name: 'Training Verification Agent', icon: '🏥',
    sources: ['UCSF School of Medicine', 'Stanford GME Office', 'ECFMG (if applicable)'],
    totalSources: 3, color: '#a78bfa',
    result: { status: 'verified', detail: 'Medical degree confirmed 2008 · Residency completion confirmed 2011.', risk: 'low' }
  },
  {
    id: 'pecos', name: 'PECOS / Medicare Agent', icon: '🏛',
    sources: ['CMS PECOS', 'Medicare Fee Schedule', 'CLIA'],
    totalSources: 3, color: '#34d399',
    result: { status: 'verified', detail: 'Active Medicare enrollment. NPI matches. No billing suspensions.', risk: 'low' }
  },
  {
    id: 'malpractice', name: 'Malpractice Agent', icon: '🛡',
    sources: ['ProAssurance Direct API', 'PIAA Closed Claims'],
    totalSources: 2, color: '#fb923c',
    result: { status: 'verified', detail: 'Active coverage $1M/$3M. 1 closed claim (2019, no payment). Within normal range.', risk: 'medium' }
  },
]

function AgentCard({ agent, state }) {
  const getStatusColor = () => {
    if (!state) return '#334155'
    if (state.phase === 'queued') return '#334155'
    if (state.phase === 'running') return '#3b82f6'
    if (state.result?.risk === 'low') return '#10b981'
    if (state.result?.risk === 'medium') return '#f59e0b'
    return '#ef4444'
  }

  const getStatusLabel = () => {
    if (!state || state.phase === 'queued') return { label: 'Queued', cls: 'badge-ghost' }
    if (state.phase === 'running') return { label: 'Running', cls: 'badge-info' }
    if (state.result?.risk === 'low') return { label: 'Verified', cls: 'badge-success' }
    if (state.result?.risk === 'medium') return { label: 'Review', cls: 'badge-warning' }
    return { label: 'Alert', cls: 'badge-danger' }
  }

  const status = getStatusLabel()
  const color = getStatusColor()

  return (
    <div style={{
      background: '#0f172a', border: `1px solid ${color}30`,
      borderRadius: 12, padding: 14, transition: 'all .3s',
      boxShadow: state?.phase === 'running' ? `0 0 16px ${agent.color}25` : 'none',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 18 }}>{agent.icon}</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#cbd5e1' }}>{agent.name}</span>
        </div>
        <span className={`badge ${status.cls}`}>{status.label}</span>
      </div>

      <div style={{ fontSize: 11, color: '#475569', marginBottom: 8 }}>
        Querying {agent.totalSources} source{agent.totalSources > 1 ? 's' : ''}: {agent.sources.slice(0,2).join(', ')}{agent.sources.length > 2 ? '…' : ''}
      </div>

      {state?.phase === 'running' && (
        <div style={{ marginBottom: 8 }}>
          <div className="progress">
            <div className="progress-fill" style={{ width: `${state.progress}%`, background: `linear-gradient(90deg, ${agent.color}, ${agent.color}aa)`, transition: 'width .3s' }} />
          </div>
          <div style={{ fontSize: 10, color: '#334155', marginTop: 4 }}>
            {state.currentSource && `Querying: ${state.currentSource}`}
          </div>
        </div>
      )}

      {state?.result && (
        <div style={{ fontSize: 11, color: state.result.risk === 'low' ? '#6ee7b7' : '#fbbf24', marginTop: 4, lineHeight: 1.5 }}>
          {state.result.detail}
        </div>
      )}

      {state?.elapsed && (
        <div style={{ fontSize: 10, color: '#334155', marginTop: 6 }}>
          Completed in {state.elapsed}s
        </div>
      )}
    </div>
  )
}

export default function PSVDemo() {
  const [agentStates, setAgentStates] = useState({})
  const [phase, setPhase] = useState('idle') // idle | determining | running | complete
  const [scopeVisible, setScopeVisible] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [manualDays] = useState(18)

  const runPSV = () => {
    setPhase('determining')
    setScopeVisible(0)
    setAgentStates({})
    setTotalTime(0)

    // Reveal scope items one by one
    VERIFY_SCOPE.forEach((_, i) => {
      setTimeout(() => setScopeVisible(i + 1), (i + 1) * 350)
    })

    // After scope is shown, deploy agents
    const SCOPE_DONE = VERIFY_SCOPE.length * 350 + 800
    setTimeout(() => {
      setPhase('running')
      const startTime = Date.now()

      const initialStates = {}
      AGENTS.forEach(a => { initialStates[a.id] = { phase: 'queued', progress: 0 } })
      setAgentStates(initialStates)

      AGENTS.forEach((agent, idx) => {
        const startDelay = Math.random() * 600 + idx * 150
        setTimeout(() => {
          const sources = agent.sources
          let sourceIdx = 0
          let progress = 0

          setAgentStates(prev => ({ ...prev, [agent.id]: { phase: 'running', progress: 0, currentSource: sources[0] } }))

          const interval = setInterval(() => {
            progress += Math.random() * 12 + 6
            sourceIdx = Math.min(Math.floor((progress / 100) * sources.length), sources.length - 1)

            if (progress >= 100) {
              clearInterval(interval)
              const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
              setAgentStates(prev => ({
                ...prev,
                [agent.id]: { phase: 'done', progress: 100, result: agent.result, elapsed }
              }))

              setTimeout(() => {
                setAgentStates(prev => {
                  const allDone = Object.values(prev).every(s => s.phase === 'done')
                  if (allDone) {
                    setPhase('complete')
                    setTotalTime(((Date.now() - startTime) / 1000).toFixed(1))
                  }
                  return prev
                })
              }, 200)
            } else {
              setAgentStates(prev => ({
                ...prev,
                [agent.id]: { ...prev[agent.id], progress: Math.min(progress, 99), currentSource: sources[sourceIdx] }
              }))
            }
          }, 120 + Math.random() * 60)
        }, startDelay)
      })
    }, SCOPE_DONE)
  }

  const reset = () => {
    setPhase('idle')
    setAgentStates({})
    setTotalTime(0)
    setScopeVisible(0)
  }

  const doneCount = Object.values(agentStates).filter(s => s.phase === 'done').length
  const runningCount = Object.values(agentStates).filter(s => s.phase === 'running').length

  return (
    <div style={{ padding: '32px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', borderRadius: 10, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>⚡</div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700 }}>PSV Agent Swarm</h1>
            <p style={{ color: '#64748b', fontSize: 13 }}>AI determines verification scope → deploys 8 specialist agents in parallel → produces checklist for human review</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
          <span className="badge badge-purple">AI Scope Analysis</span>
          <span className="badge badge-info">3,200+ Verification Types</span>
          <span className="badge badge-success">Parallel Processing</span>
          <span className="badge badge-cyan">Step-by-Step Audit Trail</span>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Manual PSV Time', value: `${manualDays} days`, color: '#ef4444' },
          { label: 'AI PSV Time', value: phase === 'complete' ? `${totalTime}s` : '< 4 hrs', color: '#10b981' },
          { label: 'Agents Running', value: phase === 'determining' ? '—' : runningCount.toString(), color: '#3b82f6' },
          { label: 'Sources Verified', value: phase === 'complete' ? '70+' : doneCount > 0 ? `${doneCount * 9}` : '0', color: '#8b5cf6' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center', borderColor: `${s.color}20` }}>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Provider being verified */}
      <div className="card" style={{ marginBottom: 20, borderColor: 'rgba(59,130,246,.2)', background: 'linear-gradient(135deg, #0f172a, rgba(59,130,246,.04))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>👩‍⚕️</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>Dr. Sarah Mei-Ling Chen, MD</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>Internal Medicine · NPI 1234567890 · Applying to Molina CA, TX, NV networks</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            {phase === 'idle' && <span className="badge badge-ghost">Awaiting PSV</span>}
            {phase === 'determining' && <span className="badge badge-purple"><span className="spinner" style={{width:10,height:10}} /> Analyzing Scope</span>}
            {phase === 'running' && <span className="badge badge-info"><span className="spinner" style={{width:10,height:10}} /> In Progress</span>}
            {phase === 'complete' && <span className="badge badge-success">✓ PSV Complete</span>}
          </div>
        </div>
      </div>

      {/* AI Determining Scope */}
      {(phase === 'determining' || phase === 'running' || phase === 'complete') && (
        <div className="card" style={{ marginBottom: 20, borderColor: 'rgba(139,92,246,.2)', background: 'rgba(139,92,246,.03)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#a78bfa', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.5px' }}>
            AI: Determining Verification Scope
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {VERIFY_SCOPE.slice(0, scopeVisible).map((item, i) => (
              <div key={i} className="animate-in" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#94a3b8' }}>
                <span style={{ color: '#10b981', flexShrink: 0 }}>✓</span>
                <span>{item}</span>
              </div>
            ))}
            {phase === 'determining' && scopeVisible < VERIFY_SCOPE.length && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#8b5cf6' }}>
                <span className="spinner" />
                <span>Analyzing provider profile…</span>
              </div>
            )}
          </div>
          {(phase === 'running' || phase === 'complete') && scopeVisible >= VERIFY_SCOPE.length && (
            <div style={{ marginTop: 10, fontSize: 11, color: '#10b981' }}>
              ✓ Scope confirmed — {VERIFY_SCOPE.length} verification domains identified · Deploying agents in parallel
            </div>
          )}
        </div>
      )}

      {/* Agents grid */}
      {(phase === 'running' || phase === 'complete') && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
          {AGENTS.map(agent => (
            <AgentCard key={agent.id} agent={agent} state={agentStates[agent.id]} />
          ))}
        </div>
      )}

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        {phase === 'idle' && (
          <button className="btn btn-primary btn-lg" onClick={runPSV}>
            ⚡ Deploy All Agents
          </button>
        )}
        {phase === 'determining' && (
          <button className="btn btn-outline btn-lg" disabled>
            <span className="spinner" /> Analyzing verification scope…
          </button>
        )}
        {phase === 'running' && (
          <button className="btn btn-outline btn-lg" disabled>
            <span className="spinner" /> Agents running in parallel…
          </button>
        )}
        {phase === 'complete' && (
          <>
            <button className="btn btn-success btn-lg">
              ✓ Forward to Human Review — Assign & Evaluate
            </button>
            <button className="btn btn-ghost" onClick={reset}>↺ Reset</button>
          </>
        )}

        {phase === 'complete' && (
          <div style={{ flex: 1, padding: '12px 16px', background: 'rgba(16,185,129,.08)', border: '1px solid rgba(16,185,129,.2)', borderRadius: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#10b981', marginBottom: 2 }}>
              ✓ All 8 agents complete · 70+ sources verified · {totalTime}s elapsed
            </div>
            <div style={{ fontSize: 12, color: '#64748b' }}>
              Manual PSV equivalent: 18 business days across 3 FTE credentialing specialists — eliminated.
            </div>
          </div>
        )}
      </div>

      {/* Assign & Evaluate Handoff */}
      {phase === 'complete' && (
        <div className="animate-in card" style={{ marginTop: 20, borderColor: 'rgba(59,130,246,.25)', background: 'rgba(59,130,246,.04)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#60a5fa', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.5px' }}>
            Assign & Evaluate — Human Handoff
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12 }}>
            PSV complete across all 8 verification domains. AI has produced a verification checklist and summary.
            Route to credentialing specialist for review and routing decision.
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[
              { label: 'Overall Risk', value: '⚠ Medium (1 flag)', color: '#f59e0b' },
              { label: 'Domains Verified', value: '8 / 8', color: '#10b981' },
              { label: 'AI Routing Suggestion', value: 'L3 — PRC Review', color: '#8b5cf6' },
            ].map(s => (
              <div key={s.label} style={{ flex: 1, minWidth: 120 }}>
                <div style={{ fontSize: 11, color: '#475569', marginBottom: 3 }}>{s.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit trail */}
      {(phase === 'running' || phase === 'complete') && Object.keys(agentStates).length > 0 && (
        <div style={{ marginTop: 20, padding: 14, background: '#0f172a', border: '1px solid #1e293b', borderRadius: 10 }}>
          <div style={{ fontSize: 11, color: '#475569', marginBottom: 8, fontWeight: 600 }}>AGENT DECISION LOG (AUDIT TRAIL)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, maxHeight: 160, overflow: 'auto' }}>
            {Object.entries(agentStates).filter(([,s]) => s.phase === 'done').map(([id, s]) => {
              const agent = AGENTS.find(a => a.id === id)
              return (
                <div key={id} style={{ fontSize: 11, color: '#64748b', display: 'flex', gap: 6 }}>
                  <span style={{ color: '#10b981' }}>✓</span>
                  <span>{agent?.name}: {s.result?.detail?.slice(0,60)}…</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
