# AI in Provider Credentialing — Art of the Possible

An interactive demo app and strategic presentation exploring how **AI, Generative AI, and Agentic AI** can transform healthcare provider credentialing for managed care organizations.

Built to accompany original research on the credentialing AI landscape — mapping what exists today, who builds it, and where the highest-value opportunities sit for Medicaid MCOs.

---

## What's in This Repo

```
├── credentialing-ai-demo/      # Interactive React demo app
├── pptx-gen/                   # PowerPoint generation script
├── AI_Credentialing_ArtofPossible.pptx   # 14-slide strategic deck
└── README.md
```

---

## The Problem

Provider credentialing is a 90–120 day manual grind that costs health plans in delayed revenue, compliance risk, and operational overhead. The core bottlenecks:

- **Primary source verification (PSV)** consumes 60%+ of a credentialing specialist's day — querying 50 state boards, NPDB, OIG, DEA, ABMS, and dozens of other sources one at a time
- **Ghost networks** — providers listed as in-network who are unavailable or unlicensed — affect directory accuracy significantly (HHS OIG found 72% of behavioral health listings were inaccurate in a 2025 report)
- **Re-credentialing** runs on fixed 36-month cycles with no risk stratification
- The **REAL Health Providers Act** (signed Feb 3, 2026) mandates 90-day verification cycles and public CMS directory accuracy scores starting 2029

The research behind this project maps three layers of AI that can address these problems — and shows where production-grade solutions exist today vs. where whitespace remains.

---

## The Three Layers of AI

| Layer | Capability | Credentialing Application |
|-------|-----------|--------------------------|
| **AI & Machine Learning** | Pattern recognition across large datasets | Fraud detection, ghost network prediction, risk scoring, delay prediction |
| **Generative AI** | Reading, synthesizing, and generating language | Document extraction, committee packet narratives, compliance Q&A, provider chatbots |
| **Agentic AI** | Autonomous action and multi-step task execution | Parallel PSV across 3,200+ sources, self-directed gap resolution, always-on monitoring |

---

## 1. Interactive Demo App

A React application that simulates what an AI-native credentialing platform looks like in practice — with live animations showing AI processing in real time.

### Sections

| Tab | What It Shows |
|-----|--------------|
| **Command Center** | Platform overview, key metrics, end-to-end flow map |
| **AI Intake** | Live OCR/NLP extraction from 5 document types — watch fields populate in real time |
| **PSV Agents** | 8 specialist agents deploy in parallel across 70+ sources simultaneously |
| **Live Monitoring** | Real-time alert feed — exclusions, license lapses, NPDB hits, DEA expirations |
| **Directory AI** | ML ghost network scanner with accuracy meter and one-click provider removal |
| **Committee AI** | LLM types out a full committee packet narrative from PSV inputs |
| **ROI Analytics** | Timeline compression charts, value breakdown, state-by-state performance |

### Tech Stack

- **React 19** + **Vite 7**
- **Recharts** for analytics visualizations
- **Lucide React** for icons
- Pure CSS animations (no animation library dependency)

### Run Locally

```bash
cd credentialing-ai-demo
npm install
npm run dev
```

App runs at `http://localhost:5173`

---

## 2. PowerPoint Presentation

**`AI_Credentialing_ArtofPossible.pptx`** — a 14-slide strategic deck for presenting the AI credentialing vision to healthcare executives and technology leaders.

### Slide Structure

| # | Title | Content |
|---|-------|---------|
| 1 | **Title** | The Art of the Possible: AI · GenAI · Agentic AI |
| 2 | **The Bottleneck** | 90–120 day cycle, 3 pain points, REAL Act regulatory urgency |
| 3 | **Three Layers** | Visual hierarchy — ML → GenAI → Agentic AI |
| 4 | **AI & ML Capabilities** | 6 use cases + maturity-by-use-case table |
| 5 | **Generative AI** | 5 use cases + committee packet Before/After |
| 6 | **Agentic Architecture** | Orchestrator → specialist agents, human-in-the-loop guardrails |
| 7 | **E2E Workflow** | 5-stage journey with before/after timing per stage |
| 8 | **Document Intake** | 5-step pipeline, 6 document type extractions |
| 9 | **PSV Agent Swarm** | 8 agents, 3,200+ sources, parallel verification |
| 10 | **Directory AI** | Ghost network detection, 4 signal sources, HHS OIG data |
| 11 | **Continuous Monitoring** | Digital twin model, 8 monitored sources, 4 alert tiers |
| 12 | **Governance** | 5 governance dimensions — accuracy, bias, compliance, security, model |
| 13 | **Roadmap** | 3-phase plan: Foundation → Intelligence → Autonomy (24 months) |
| 14 | **Conclusion** | 3 strategic insights, competitive window framing |

### Regenerate the PPT

The presentation is generated programmatically using [pptxgenjs](https://gitbrent.github.io/PptxGenJS/).

```bash
cd pptx-gen
npm install
node create.js
# Output: ../AI_Credentialing_ArtofPossible.pptx
```

---

## Design Principles

**No unverifiable claims.** Every statistic in both the app and the presentation is sourced from:
- HHS OIG (October 2025 directory accuracy report)
- NCQA 2025 credentialing standards
- REAL Health Providers Act (signed Feb 3, 2026)
- Published vendor metrics (labeled as vendor-reported where applicable)
- Industry research on PSV workflows

**Human-in-the-loop guardrails are explicit throughout.** NCQA CR 2 requires a credentialing committee for adverse decisions — the demo and presentation both make clear that AI routes and prepares, but humans decide on exceptions.

---

## Research Foundation

This project is based on original research mapping the full AI credentialing landscape across 10 dimensions:

1. Application intake automation
2. Primary source verification (PSV)
3. Continuous monitoring and re-credentialing
4. Delegated credentialing oversight
5. Provider directory accuracy
6. Agentic AI architecture patterns
7. Generative AI for narrative intelligence
8. Predictive analytics and ML maturity
9. Vendor landscape (AI-native vs. automation-enhanced vs. incumbents)
10. Whitespace and highest-value opportunities

Key vendors covered include Medallion, CertifyOS, Verifiable, Assured, MD-Staff, symplr, ProviderTrust, HiLabs, Quest Analytics, Verisys, and others.

---

## Project Structure

```
credentialing-ai-demo/
├── src/
│   ├── App.jsx                     # Main layout, sidebar nav, routing
│   ├── index.css                   # Design system (tokens, utilities, animations)
│   └── components/
│       ├── IntakeDemo.jsx           # AI document extraction simulation
│       ├── PSVDemo.jsx              # Multi-agent PSV swarm
│       ├── MonitoringDemo.jsx       # Real-time monitoring alerts
│       ├── DirectoryDemo.jsx        # Ghost network ML detection
│       ├── CommitteeDemo.jsx        # LLM packet generation
│       └── AnalyticsDashboard.jsx   # ROI charts and metrics
├── package.json
└── vite.config.js

pptx-gen/
├── create.js       # Full 14-slide presentation script (Node.js + pptxgenjs)
└── package.json
```

---

## Requirements

| Tool | Version |
|------|---------|
| Node.js | 18+ |
| npm | 9+ |

No backend required. All demo data is simulated client-side.

---

## License

MIT
