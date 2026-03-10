import { useState } from 'react'
import './index.css'
import IntakeDemo from './components/IntakeDemo'
import PSVDemo from './components/PSVDemo'
import MonitoringDemo from './components/MonitoringDemo'
import DirectoryDemo from './components/DirectoryDemo'
import CommitteeDemo from './components/CommitteeDemo'
import AnalyticsDashboard from './components/AnalyticsDashboard'

const NAV = [
  { id: 'overview', label: 'Command Center', icon: '⬡', desc: 'Platform overview' },
  { id: 'intake',   label: 'AI Intake',       icon: '⬡', desc: 'Document extraction' },
  { id: 'psv',      label: 'PSV Agents',      icon: '⬡', desc: 'Primary verification' },
  { id: 'monitor',  label: 'Live Monitoring', icon: '⬡', desc: 'Real-time alerts' },
  { id: 'directory',label: 'Directory AI',    icon: '⬡', desc: 'Ghost network detection' },
  { id: 'committee',label: 'Committee AI',    icon: '⬡', desc: 'Packet generation' },
  { id: 'analytics',label: 'ROI Analytics',   icon: '⬡', desc: 'Impact measurement' },
]

function Overview({ setTab }) {
  const metrics = [
    { label: 'Credentialing Time', before: '90–120 days', after: '2–5 days', icon: '⚡', color: '#3b82f6' },
    { label: 'Automation Rate', before: '0% automated', after: '70% zero-touch', icon: '🤖', color: '#10b981' },
    { label: 'Directory Accuracy', before: '~28% accurate', after: '91%+ accurate', icon: '✓', color: '#8b5cf6' },
    { label: 'Annual Value (MCO)', before: 'Status quo', after: '$100M+ opportunity', icon: '$', color: '#f59e0b' },
  ]

  const flows = [
    { step: '01', title: 'Document Intake', desc: 'AI extracts data from any document type — licenses, diplomas, CAQH exports, faxed PDFs — in seconds.', color: '#3b82f6', tab: 'intake' },
    { step: '02', title: 'Parallel PSV', desc: 'Autonomous agents verify across 3,200+ sources simultaneously. What took weeks now completes in hours.', color: '#06b6d4', tab: 'psv' },
    { step: '03', title: 'Live Monitoring', desc: 'Always-on surveillance for exclusions, license lapses, and sanctions. Alerts within minutes of changes.', color: '#10b981', tab: 'monitor' },
    { step: '04', title: 'Directory Accuracy', desc: 'ML models cross-reference claims data to detect ghost providers before regulators do.', color: '#8b5cf6', tab: 'directory' },
    { step: '05', title: 'AI Committee Packets', desc: 'LLMs synthesize PSV results, malpractice history, and risk signals into committee-ready narratives.', color: '#f59e0b', tab: 'committee' },
    { step: '06', title: 'ROI Analytics', desc: 'Track time savings, compliance risk avoidance, and revenue impact across 20+ states in real time.', color: '#ef4444', tab: 'analytics' },
  ]

  return (
    <div style={{ padding: '32px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(59,130,246,.1)', border: '1px solid rgba(59,130,246,.25)', borderRadius: 20, padding: '6px 16px', marginBottom: 20 }}>
          <span className="pulse-dot pulse-blue" />
          <span style={{ fontSize: 12, color: '#60a5fa', fontWeight: 600 }}>LIVE DEMO — MOLINA HEALTHCARE AI CREDENTIALING PLATFORM</span>
        </div>
        <h1 style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.1, marginBottom: 16, background: 'linear-gradient(135deg, #e2e8f0 0%, #60a5fa 50%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          The Future of Provider<br />Credentialing Is Autonomous
        </h1>
        <p style={{ fontSize: 18, color: '#94a3b8', maxWidth: 640, margin: '0 auto 32px', lineHeight: 1.6 }}>
          AI transforms the 90–120 day credentialing bottleneck into a 2–5 day intelligent workflow —
          protecting $100M+ in annual value across Molina's 5.8M members.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-lg" onClick={() => setTab('intake')}>
            ▶ Launch Live Demo
          </button>
          <button className="btn btn-outline btn-lg" onClick={() => setTab('analytics')}>
            View ROI Impact
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid-4" style={{ marginBottom: 48 }}>
        {metrics.map(m => (
          <div key={m.label} className="card" style={{ borderColor: `${m.color}22`, background: `linear-gradient(135deg, #0f172a, ${m.color}08)` }}>
            <div style={{ fontSize: 28, marginBottom: 12, color: m.color, fontWeight: 800 }}>{m.icon}</div>
            <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6 }}>{m.label}</div>
            <div style={{ fontSize: 13, color: '#ef4444', marginBottom: 4, textDecoration: 'line-through' }}>{m.before}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: m.color }}>{m.after}</div>
          </div>
        ))}
      </div>

      {/* Flow */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>End-to-End AI Credentialing Flow</h2>
        <p style={{ color: '#64748b', fontSize: 14 }}>Click any step to explore the interactive demo</p>
      </div>
      <div className="grid-3">
        {flows.map(f => (
          <div key={f.step}
            onClick={() => setTab(f.tab)}
            style={{ cursor: 'pointer', background: '#0f172a', border: `1px solid ${f.color}22`, borderRadius: 14, padding: 20, transition: 'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = f.color; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${f.color}22`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `${f.color}22`; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <span style={{ fontSize: 11, color: f.color, fontWeight: 700, letterSpacing: '1px' }}>STEP {f.step}</span>
              <span style={{ fontSize: 11, color: '#60a5fa' }}>Explore →</span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#e2e8f0' }}>{f.title}</div>
            <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Regulatory urgency */}
      <div style={{ marginTop: 40, background: 'rgba(239,68,68,.05)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 14, padding: 24, display: 'flex', gap: 20, alignItems: 'center' }}>
        <div style={{ fontSize: 36, flexShrink: 0 }}>⚠</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#fca5a5', marginBottom: 6 }}>Regulatory Reckoning — Act Now</div>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>
            The <strong style={{color:'#e2e8f0'}}>REAL Health Providers Act</strong> (signed Feb 3, 2026) mandates 90-day verification cycles and <strong style={{color:'#e2e8f0'}}>public directory accuracy scores</strong> by 2029.
            HHS OIG found <strong style={{color:'#fbbf24'}}>72% of behavioral health directory listings</strong> were inaccurate. Plans that delay building AI capabilities will face both regulatory fines and <strong style={{color:'#e2e8f0'}}>reputational damage in a transparent marketplace</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [tab, setTab] = useState('overview')

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: 220, flexShrink: 0, background: '#080f1c', borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', overflow: 'auto' }}>
        <div style={{ padding: '24px 16px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✦</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', lineHeight: 1.2 }}>CredentialAI</div>
              <div style={{ fontSize: 10, color: '#3b82f6', letterSpacing: '.5px' }}>MOLINA HEALTHCARE</div>
            </div>
          </div>
          <div style={{ fontSize: 10, color: '#334155', borderTop: '1px solid #1e293b', paddingTop: 8, marginTop: 8 }}>v2.4.1 · 5.8M Members · 20+ States</div>
        </div>

        <nav style={{ padding: '8px 8px', flex: 1 }}>
          {NAV.map(n => (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '10px 12px', borderRadius: 8, marginBottom: 2,
                border: 'none', cursor: 'pointer', transition: 'all .15s',
                background: tab === n.id ? 'rgba(59,130,246,.15)' : 'transparent',
                borderLeft: tab === n.id ? '2px solid #3b82f6' : '2px solid transparent',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: tab === n.id ? '#60a5fa' : '#94a3b8' }}>{n.label}</div>
              <div style={{ fontSize: 10, color: tab === n.id ? '#3b82f6' : '#475569', marginTop: 1 }}>{n.desc}</div>
            </button>
          ))}
        </nav>

        {/* Live indicator */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="pulse-dot pulse-green" />
            <span style={{ fontSize: 11, color: '#10b981' }}>All systems operational</span>
          </div>
          <div style={{ fontSize: 10, color: '#334155', marginTop: 4 }}>247 verifications active</div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto', background: '#050c1a' }}>
        {tab === 'overview'  && <Overview setTab={setTab} />}
        {tab === 'intake'    && <IntakeDemo />}
        {tab === 'psv'       && <PSVDemo />}
        {tab === 'monitor'   && <MonitoringDemo />}
        {tab === 'directory' && <DirectoryDemo />}
        {tab === 'committee' && <CommitteeDemo />}
        {tab === 'analytics' && <AnalyticsDashboard />}
      </main>
    </div>
  )
}
