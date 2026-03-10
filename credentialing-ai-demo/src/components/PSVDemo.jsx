import { useState, useEffect, useRef } from 'react'

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

      {/* Sources */}
      <div style={{ fontSize: 11, color: '#475569', marginBottom: 8 }}>
        Querying {agent.totalSources} source{agent.totalSources > 1 ? 's' : ''}: {agent.sources.slice(0,2).join(', ')}{agent.sources.length > 2 ? '…' : ''}
      </div>

      {/* Progress */}
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

      {/* Result */}
      {state?.result && (
        <div style={{ fontSize: 11, color: state.result.risk === 'low' ? '#6ee7b7' : '#fbbf24', marginTop: 4, lineHeight: 1.5 }}>
          {state.result.detail}
        </div>
      )}

      {/* Time */}
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
  const [phase, setPhase] = useState('idle') // idle | running | complete
  const [totalTime, setTotalTime] = useState(0)
  const [manualDays] = useState(18)
  const timerRef = useRef(null)

  const runPSV = () => {
    setPhase('running')
    setAgentStates({})
    const startTime = Date.now()

    // Initialize all as queued
    const initialStates = {}
    AGENTS.forEach(a => { initialStates[a.id] = { phase: 'queued', progress: 0 } })
    setAgentStates(initialStates)

    // Stagger agent starts
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

            // Check if all done
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
  }

  const reset = () => {
    setPhase('idle')
    setAgentStates({})
    setTotalTime(0)
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
            <p style={{ color: '#64748b', fontSize: 13 }}>8 autonomous agents verify across 70+ sources simultaneously</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
          <span className="badge badge-info">3,200+ Verification Types</span>
          <span className="badge badge-success">Parallel Processing</span>
          <span className="badge badge-warning">CAPTCHA-Resistant</span>
          <span className="badge badge-purple">Step-by-Step Audit Trail</span>
          <span className="badge badge-cyan">&gt;97% Success Rate</span>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Manual PSV Time', value: `${manualDays} days`, color: '#ef4444' },
          { label: 'AI PSV Time', value: phase === 'complete' ? `${totalTime}s` : '< 4 hrs', color: '#10b981' },
          { label: 'Agents Running', value: runningCount.toString(), color: '#3b82f6' },
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
            {phase === 'running' && <span className="badge badge-info"><span className="spinner" style={{width:10,height:10}} /> In Progress</span>}
            {phase === 'complete' && <span className="badge badge-success">✓ PSV Complete</span>}
          </div>
        </div>
      </div>

      {/* Agents grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
        {AGENTS.map(agent => (
          <AgentCard key={agent.id} agent={agent} state={agentStates[agent.id]} />
        ))}
      </div>

      {/* Controls + result */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        {phase === 'idle' && (
          <button className="btn btn-primary btn-lg" onClick={runPSV}>
            ⚡ Deploy All Agents
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
              ✓ Forward to Committee Prep
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

      {/* Legend */}
      {phase !== 'idle' && (
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
