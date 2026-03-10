import { useState, useEffect, useRef } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts'

const MONTHLY_DATA = [
  { month: 'Jan', manual: 98, aiAssisted: 72, fullAI: 31, target: 14 },
  { month: 'Feb', manual: 102, aiAssisted: 68, fullAI: 28, target: 14 },
  { month: 'Mar', manual: 95, aiAssisted: 61, fullAI: 22, target: 14 },
  { month: 'Apr', manual: 89, aiAssisted: 54, fullAI: 18, target: 14 },
  { month: 'May', manual: 94, aiAssisted: 47, fullAI: 14, target: 14 },
  { month: 'Jun', manual: 92, aiAssisted: 40, fullAI: 10, target: 14 },
]

const STATE_DATA = [
  { state: 'CA', providers: 24300, aiEnabled: 87, avgDays: 9, ghostRate: 8 },
  { state: 'TX', providers: 19800, aiEnabled: 82, avgDays: 11, ghostRate: 11 },
  { state: 'FL', providers: 14200, aiEnabled: 79, avgDays: 13, ghostRate: 14 },
  { state: 'AZ', providers: 8900, aiEnabled: 91, avgDays: 7, ghostRate: 6 },
  { state: 'IL', providers: 7400, aiEnabled: 85, avgDays: 10, ghostRate: 9 },
  { state: 'WA', providers: 5200, aiEnabled: 88, avgDays: 8, ghostRate: 7 },
  { state: 'NV', providers: 3800, aiEnabled: 76, avgDays: 15, ghostRate: 16 },
  { state: 'OH', providers: 3100, aiEnabled: 73, avgDays: 18, ghostRate: 18 },
]

const ROI_BREAKDOWN = [
  { category: 'Accelerated Revenue Access', value: 38, color: '#3b82f6', detail: '35-day faster provider activation × avg panel revenue' },
  { category: 'Compliance Risk Avoidance', value: 27, color: '#ef4444', detail: 'REAL Act fines, False Claims Act exposure, CMS sanctions' },
  { category: 'Operational Efficiency', value: 22, color: '#10b981', detail: '12 FTE reduction in credentialing ops across 20 states' },
  { category: 'Directory Accuracy Gains', value: 13, color: '#8b5cf6', detail: 'Network adequacy compliance, member access improvement' },
]

const VOLUME_TREND = [
  { week: 'W1', apps: 340, auto: 210, human: 130 },
  { week: 'W2', apps: 390, auto: 255, human: 135 },
  { week: 'W3', apps: 420, auto: 290, human: 130 },
  { week: 'W4', apps: 380, auto: 278, human: 102 },
  { week: 'W5', apps: 510, auto: 382, human: 128 },
  { week: 'W6', apps: 468, auto: 362, human: 106 },
  { week: 'W7', apps: 540, auto: 424, human: 116 },
  { week: 'W8', apps: 495, auto: 399, human: 96 },
]

function StatCard({ label, value, sub, delta, color }) {
  return (
    <div className="card" style={{ borderColor: `${color}20` }}>
      <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.4px' }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color, marginBottom: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#475569' }}>{sub}</div>}
      {delta && (
        <div style={{ fontSize: 11, color: delta.startsWith('+') ? '#10b981' : '#ef4444', marginTop: 4 }}>
          {delta} vs. pre-AI baseline
        </div>
      )}
    </div>
  )
}

const customTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px' }}>
      <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 12, color: p.color, marginBottom: 2 }}>
          {p.name}: {p.value} {p.name.includes('Days') || p.name.includes('days') ? 'days' : ''}
        </div>
      ))}
    </div>
  )
}

export default function AnalyticsDashboard() {
  const [roiMultiplier, setRoiMultiplier] = useState(1)
  const [animatedROI, setAnimatedROI] = useState(0)

  useEffect(() => {
    const target = 127
    const duration = 1500
    const steps = 60
    let step = 0
    const interval = setInterval(() => {
      step++
      setAnimatedROI(Math.round(target * (1 - Math.pow(1 - step/steps, 3))))
      if (step >= steps) clearInterval(interval)
    }, duration / steps)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ padding: '32px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)', borderRadius: 10, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📊</div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700 }}>ROI & Impact Analytics</h1>
            <p style={{ color: '#64748b', fontSize: 13 }}>Real-time measurement of AI credentialing value across Molina's 20+ state footprint</p>
          </div>
        </div>
      </div>

      {/* Top metrics */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <StatCard label="Annual Value Opportunity" value={`$${animatedROI}M`} sub="Across 5.8M members, 20 states" delta="+$127M" color="#10b981" />
        <StatCard label="Avg Credentialing Time" value="11 days" sub="Down from 98-day baseline" delta="-87 days" color="#3b82f6" />
        <StatCard label="Zero-Touch Rate" value="74%" sub="Applications with no human touch" delta="+74pp" color="#8b5cf6" />
        <StatCard label="Directory Accuracy" value="89%" sub="Up from 72% (HHS OIG baseline)" delta="+17pp" color="#f59e0b" />
      </div>

      {/* Charts row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Timeline compression */}
        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 16 }}>CREDENTIALING TIMELINE COMPRESSION (DAYS)</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MONTHLY_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11 }} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} />
              <Tooltip content={customTooltip} />
              <Line type="monotone" dataKey="manual" name="Manual (Baseline)" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 3 }} />
              <Line type="monotone" dataKey="aiAssisted" name="AI-Assisted" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 3 }} />
              <Line type="monotone" dataKey="fullAI" name="Full AI" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} />
              <Line type="monotone" dataKey="target" name="Target (14 days)" stroke="#3b82f6" strokeWidth={1} strokeDasharray="4 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
            {[['Manual', '#ef4444'], ['AI-Assisted', '#f59e0b'], ['Full AI', '#10b981'], ['Target', '#3b82f6']].map(([l, c]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
                <div style={{ width: 12, height: 2, background: c, borderRadius: 1 }} />
                <span style={{ color: '#64748b' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ROI breakdown */}
        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 16 }}>$127M VALUE BREAKDOWN</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={ROI_BREAKDOWN} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {ROI_BREAKDOWN.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const d = payload[0].payload
                return (
                  <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px', maxWidth: 200 }}>
                    <div style={{ fontSize: 12, color: d.color, fontWeight: 600, marginBottom: 4 }}>{d.category}</div>
                    <div style={{ fontSize: 13, color: '#e2e8f0', marginBottom: 4 }}>${Math.round(127 * d.value / 100)}M ({d.value}%)</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{d.detail}</div>
                  </div>
                )
              }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 8 }}>
            {ROI_BREAKDOWN.map(r => (
              <div key={r.category} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.color, flexShrink: 0 }} />
                  <span style={{ color: '#64748b' }}>{r.category}</span>
                </div>
                <span style={{ color: r.color, fontWeight: 700 }}>${Math.round(127 * r.value / 100)}M</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Weekly volume */}
        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 16 }}>WEEKLY APPLICATION VOLUME — AUTOMATION RATE</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={VOLUME_TREND} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="week" tick={{ fill: '#475569', fontSize: 11 }} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} />
              <Tooltip content={customTooltip} />
              <Area type="monotone" dataKey="auto" name="AI Automated" stackId="1" stroke="#3b82f6" fill="rgba(59,130,246,.25)" />
              <Area type="monotone" dataKey="human" name="Human Review" stackId="1" stroke="#8b5cf6" fill="rgba(139,92,246,.2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* State performance */}
        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 12 }}>STATE-LEVEL PERFORMANCE</div>
          <div style={{ maxHeight: 220, overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1e293b' }}>
                  {['State', 'Providers', 'AI %', 'Avg Days', 'Ghost Rate'].map(h => (
                    <th key={h} style={{ padding: '6px 8px', textAlign: 'left', color: '#475569', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {STATE_DATA.map(s => (
                  <tr key={s.state} style={{ borderBottom: '1px solid #0f172a' }}>
                    <td style={{ padding: '8px 8px', fontWeight: 700, color: '#e2e8f0' }}>{s.state}</td>
                    <td style={{ padding: '8px 8px', color: '#94a3b8' }}>{s.providers.toLocaleString()}</td>
                    <td style={{ padding: '8px 8px' }}>
                      <span style={{ color: s.aiEnabled >= 85 ? '#10b981' : '#f59e0b', fontWeight: 600 }}>{s.aiEnabled}%</span>
                    </td>
                    <td style={{ padding: '8px 8px' }}>
                      <span style={{ color: s.avgDays <= 10 ? '#10b981' : s.avgDays <= 15 ? '#f59e0b' : '#ef4444' }}>{s.avgDays}d</span>
                    </td>
                    <td style={{ padding: '8px 8px' }}>
                      <span style={{ color: s.ghostRate <= 8 ? '#10b981' : s.ghostRate <= 12 ? '#f59e0b' : '#ef4444' }}>{s.ghostRate}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Use case ROI table */}
      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 16 }}>TOP 10 AI USE CASES — VALUE RANKING</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {[
            { rank: 1, title: 'Automated PSV (Agentic)', saving: '$34M', time: '15+ hrs/app', urgency: 'critical' },
            { rank: 2, title: 'Continuous Exclusion Monitoring', saving: '$22M', time: 'Compliance risk', urgency: 'critical' },
            { rank: 3, title: 'Directory Accuracy AI', saving: '$18M', time: 'REAL Act mandated', urgency: 'high' },
            { rank: 4, title: 'Document Intake & Extraction', saving: '$12M', time: '3–5 hrs/app', urgency: 'high' },
            { rank: 5, title: 'Ghost Network Detection (Claims)', saving: '$11M', time: 'Regulatory fines', urgency: 'high' },
            { rank: 6, title: 'Delegated Credentialing AI', saving: '$9M', time: 'NCQA CR 9 audit', urgency: 'medium' },
            { rank: 7, title: 'Predictive Re-credentialing', saving: '$8M', time: '36-month cycle', urgency: 'medium' },
            { rank: 8, title: 'LLM Committee Packets', saving: '$6M', time: '2–3 hrs/packet', urgency: 'medium' },
            { rank: 9, title: 'Network Adequacy Prediction', saving: '$5M', time: 'Access-to-care', urgency: 'medium' },
            { rank: 10, title: 'Provider Chatbot (Status)', saving: '$2M', time: 'Call center load', urgency: 'low' },
          ].map(u => (
            <div key={u.rank} style={{ display: 'flex', gap: 12, padding: '10px', background: 'rgba(255,255,255,.02)', borderRadius: 8, alignItems: 'flex-start' }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: u.urgency === 'critical' ? '#ef444430' : u.urgency === 'high' ? '#f59e0b30' : '#3b82f630', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: u.urgency === 'critical' ? '#ef4444' : u.urgency === 'high' ? '#f59e0b' : '#3b82f6', flexShrink: 0 }}>{u.rank}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 3 }}>{u.title}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: 11, color: '#10b981', fontWeight: 700 }}>{u.saving}/yr</span>
                  <span style={{ fontSize: 11, color: '#475569' }}>{u.time} saved</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
