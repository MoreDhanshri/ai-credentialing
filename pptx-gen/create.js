'use strict';
const pptxgen = require('pptxgenjs');

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.title  = 'The Art of the Possible: AI in Provider Credentialing';
pres.author = 'Healthcare AI Strategy';

// ─── Palette (NO # prefix) ──────────────────────────────────────
const C = {
  darkBg:   '0C1B33',
  darkBg2:  '0D1F38',
  darkCard: '112240',
  teal:     '0891B2',
  cyan:     '22D3EE',
  white:    'FFFFFF',
  offWhite: 'F7FAFC',
  lightBg:  'EFF6FF',
  textDark: '1A202C',
  textMid:  '4A5568',
  textDim:  '718096',
  textOn:   'E2E8F0',
  textMuted:'94A3B8',
  green:    '059669',
  amber:    'D97706',
  purple:   '7C3AED',
  blue:     '2563EB',
  rose:     'BE123C',
  border:   'E2E8F0',
};

// ─── Helpers ────────────────────────────────────────────────────
const mkS = () => ({ type:'outer', color:'000000', blur:8, offset:2, angle:135, opacity:0.1 });

function hdr(slide, title, light=false) {
  slide.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.52, fill:{color:C.darkBg}, line:{color:C.darkBg,width:0} });
  slide.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:0.06, h:0.52, fill:{color:C.teal}, line:{color:C.teal,width:0} });
  slide.addText(title, { x:0.35, y:0, w:9.3, h:0.52, valign:'middle', fontSize:17, color:C.white, bold:true, margin:0 });
}

function card(slide, x, y, w, h, accent=C.teal, bg=C.white) {
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill:{color:bg}, line:{color:C.border,width:0.5}, shadow:mkS() });
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w:0.06, h, fill:{color:accent}, line:{color:accent,width:0} });
}

function dot(slide, x, y, r, color) {
  slide.addShape(pres.shapes.OVAL, { x, y, w:r, h:r, fill:{color}, line:{color,width:0} });
}

function labelBadge(slide, x, y, w, h, text, bg, fg=C.white) {
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill:{color:bg}, line:{color:bg,width:0} });
  slide.addText(text, { x, y, w, h, align:'center', valign:'middle', fontSize:10, color:fg, bold:true, charSpacing:1, margin:0 });
}

function arrowRight(slide, x, y) {
  slide.addShape(pres.shapes.LINE, { x, y, w:0.28, h:0, line:{color:C.textDim, width:1.2} });
  slide.addText('▶', { x:x+0.18, y:y-0.12, w:0.22, h:0.22, align:'center', fontSize:9, color:C.textDim, margin:0 });
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 1 — TITLE
// ═══════════════════════════════════════════════════════════════
{
  const sl = pres.addSlide();
  sl.background = { color: C.darkBg };

  // Decorative circles — right side
  sl.addShape(pres.shapes.OVAL, { x:6.6,  y:-0.7, w:4.8, h:4.8, fill:{color:C.teal, transparency:90}, line:{color:C.teal,width:0} });
  sl.addShape(pres.shapes.OVAL, { x:7.9,  y:1.4,  w:2.8, h:2.8, fill:{color:C.cyan, transparency:85}, line:{color:C.cyan,width:0} });
  sl.addShape(pres.shapes.OVAL, { x:8.6,  y:3.8,  w:1.4, h:1.4, fill:{color:C.teal,transparency:80}, line:{color:C.teal,width:0} });

  // Left accent bar
  sl.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:0.1, h:5.625, fill:{color:C.teal}, line:{color:C.teal,width:0} });

  sl.addText('AI IN HEALTHCARE CREDENTIALING', {
    x:0.5, y:0.7, w:7, h:0.3, fontSize:10, color:C.teal, bold:true, charSpacing:3, margin:0
  });

  sl.addText('The Art of the Possible', {
    x:0.5, y:1.05, w:7.2, h:1.15, fontSize:48, color:C.white, bold:true, fontFace:'Calibri', margin:0
  });

  sl.addText([
    { text:'AI', options:{color:C.blue, bold:true} },
    { text:'  ·  ', options:{color:C.textMuted} },
    { text:'Generative AI', options:{color:C.teal, bold:true} },
    { text:'  ·  ', options:{color:C.textMuted} },
    { text:'Agentic AI', options:{color:C.cyan, bold:true} },
  ], { x:0.5, y:2.25, w:7, h:0.55, fontSize:22, margin:0 });

  sl.addText('Transforming Provider Credentialing for Managed Care', {
    x:0.5, y:2.88, w:7, h:0.38, fontSize:15, color:C.textOn, margin:0
  });

  sl.addShape(pres.shapes.LINE, { x:0.5, y:3.38, w:5.5, h:0, line:{color:C.teal,width:1.5} });

  const tags = [
    { label:'Predictive ML',      color:C.blue   },
    { label:'Generative AI',      color:C.teal   },
    { label:'Agentic Autonomy',   color:C.cyan   },
  ];
  tags.forEach((t, i) => {
    sl.addShape(pres.shapes.RECTANGLE, { x:0.5+i*2.05, y:3.58, w:1.85, h:0.42, fill:{color:t.color,transparency:78}, line:{color:t.color,width:0.75} });
    sl.addText(t.label, { x:0.5+i*2.05, y:3.58, w:1.85, h:0.42, align:'center', valign:'middle', fontSize:11, color:C.white, bold:true, margin:0 });
  });

  // Bottom strip
  sl.addShape(pres.shapes.RECTANGLE, { x:0, y:5.2, w:10, h:0.425, fill:{color:'071020'}, line:{color:'071020',width:0} });
  sl.addText('Confidential  ·  Strategic Initiative  ·  2026', {
    x:0.5, y:5.22, w:9, h:0.38, align:'center', valign:'middle', fontSize:10, color:'334155', margin:0
  });
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 2 — THE CREDENTIALING CHALLENGE
// ═══════════════════════════════════════════════════════════════
{
  const sl = pres.addSlide();
  sl.background = { color: C.offWhite };
  hdr(sl, "Today's Reality: The Credentialing Bottleneck");

  // Big stat — left
  sl.addText('90–120', {
    x:0.4, y:0.68, w:4.2, h:1.5, fontSize:82, color:C.darkBg, bold:true, fontFace:'Calibri', margin:0
  });
  sl.addText('DAY AVERAGE CREDENTIALING CYCLE', {
    x:0.4, y:2.18, w:4.0, h:0.5, fontSize:13, color:C.textMid, bold:true, margin:0, charSpacing:0.5
  });
  sl.addShape(pres.shapes.LINE, { x:0.4, y:2.78, w:3.8, h:0, line:{color:C.border,width:1} });
  sl.addText('Manual primary source verification consumes 60%+ of a credentialing specialist\'s workday — repeated across every provider, every state, every cycle.', {
    x:0.4, y:2.88, w:4.0, h:0.85, fontSize:12, color:C.textMid, margin:0
  });

  // Regulatory callout
  sl.addShape(pres.shapes.RECTANGLE, { x:0.4, y:3.85, w:4.0, h:1.42, fill:{color:C.teal,transparency:91}, line:{color:C.teal,width:0.75} });
  sl.addShape(pres.shapes.RECTANGLE, { x:0.4, y:3.85, w:0.06, h:1.42, fill:{color:C.teal}, line:{color:C.teal,width:0} });
  sl.addText('Regulatory Urgency', { x:0.55, y:3.92, w:3.75, h:0.27, fontSize:12, color:C.teal, bold:true, margin:0 });
  sl.addText('The REAL Health Providers Act (signed Feb 3, 2026) mandates 90-day verification cycles and public CMS directory accuracy scores starting 2029. Manual processes cannot meet this bar at scale.', {
    x:0.55, y:4.22, w:3.75, h:0.97, fontSize:11, color:C.textMid, margin:0
  });

  // Vertical divider
  sl.addShape(pres.shapes.LINE, { x:4.65, y:0.65, w:0, h:4.65, line:{color:C.border,width:0.75} });

  // Three pain point cards
  const pains = [
    { accent:C.blue,   icon:'R', label:'REVENUE IMPACT',  title:'Provider Activation Delays',
      desc:'Every uncredentialed provider represents delayed patient access and foregone revenue. Extended timelines across 20+ states compound the impact significantly.' },
    { accent:C.rose,   icon:'C', label:'COMPLIANCE RISK', title:'Regulatory & Liability Exposure',
      desc:'Missed exclusions, lapsed licenses, and ghost providers create False Claims Act exposure, CMS sanctions, and NCQA accreditation risk — all preventable with AI.' },
    { accent:C.amber,  icon:'O', label:'OPERATIONAL COST',title:'Manual PSV at Scale Is Unsustainable',
      desc:'Credentialing teams spend the majority of their day on repetitive verification tasks across 50 state boards, NPDB, OIG, DEA, and dozens of other primary sources.' },
  ];

  pains.forEach((p, i) => {
    const y = 0.65 + i * 1.62;
    card(sl, 4.8, y, 4.95, 1.48, p.accent);
    labelBadge(sl, 4.94, y+0.12, 1.0, 0.26, p.label, p.accent);
    sl.addText(p.title, { x:6.05, y:y+0.08, w:3.6, h:0.32, fontSize:13, bold:true, color:C.textDark, margin:0 });
    sl.addText(p.desc,  { x:4.94, y:y+0.48, w:4.68, h:0.88, fontSize:11.5, color:C.textMid, margin:0 });
  });
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 3 — THREE LAYERS OF AI  (dark)
// ═══════════════════════════════════════════════════════════════
{
  const sl = pres.addSlide();
  sl.background = { color: C.darkBg2 };

  sl.addText('Three Layers of Intelligence', {
    x:0.5, y:0.2, w:9, h:0.6, align:'center', fontSize:32, color:C.white, bold:true, fontFace:'Calibri', margin:0
  });
  sl.addText('Each layer unlocks new possibilities — together they enable autonomous credentialing', {
    x:0.5, y:0.82, w:9, h:0.3, align:'center', fontSize:13, color:C.textMuted, margin:0
  });

  const layers = [
    {
      num:'01', label:'LAYER 1', title:'AI & Machine Learning', sub:'Pattern Intelligence',
      color:C.blue, bg:'0D2347',
      items:['Fraud & anomaly detection','Ghost network prediction','Risk scoring & stratification','Credentialing delay prediction','Claims-based provider activity'],
      foot:'Finds patterns humans miss across massive datasets',
    },
    {
      num:'02', label:'LAYER 2', title:'Generative AI', sub:'Language Intelligence',
      color:C.teal, bg:'0B2438',
      items:['Document extraction (OCR + NLP + LLM)','Committee packet narrative drafting','Compliance Q&A assistants (RAG)','Adverse action letter generation','Provider-facing status chatbots'],
      foot:'Reads, synthesizes, and generates language at scale',
    },
    {
      num:'03', label:'LAYER 3', title:'Agentic AI', sub:'Autonomous Intelligence',
      color:C.cyan, bg:'092232',
      items:['Autonomous PSV across 3,200+ source types','Multi-agent parallel orchestration','Self-directed gap identification & resolution','CAPTCHA-resistant web automation','Human escalation for exceptions only'],
      foot:'Takes independent action — humans review exceptions',
    },
  ];

  layers.forEach((l, i) => {
    const x = 0.3 + i * 3.23;
    // Card
    sl.addShape(pres.shapes.RECTANGLE, { x, y:1.22, w:3.08, h:4.1, fill:{color:l.bg}, line:{color:l.color,width:1} });
    // Top band
    sl.addShape(pres.shapes.RECTANGLE, { x, y:1.22, w:3.08, h:0.52, fill:{color:l.color,transparency:25}, line:{color:l.color,width:0} });
    sl.addText(l.num,   { x:x+0.1,  y:1.22, w:0.55, h:0.52, valign:'middle', fontSize:20, color:l.color, bold:true, margin:0 });
    sl.addText(l.title, { x:x+0.62, y:1.22, w:2.38, h:0.52, valign:'middle', fontSize:13, color:C.white, bold:true, margin:0 });
    sl.addText(l.sub,   { x:x+0.14, y:1.82, w:2.8,  h:0.28, fontSize:11, color:l.color, italic:true, margin:0 });

    l.items.forEach((item, j) => {
      sl.addShape(pres.shapes.RECTANGLE, { x:x+0.14, y:2.22+j*0.44, w:0.07, h:0.22, fill:{color:l.color}, line:{color:l.color,width:0} });
      sl.addText(item, { x:x+0.28, y:2.19+j*0.44, w:2.68, h:0.28, fontSize:11, color:C.textOn, margin:0 });
    });

    // Footer value prop
    sl.addShape(pres.shapes.RECTANGLE, { x, y:4.82, w:3.08, h:0.5, fill:{color:l.color,transparency:78}, line:{color:l.color,width:0} });
    sl.addText(l.foot, { x:x+0.08, y:4.82, w:2.92, h:0.5, align:'center', valign:'middle', fontSize:10.5, color:C.white, italic:true, margin:0 });
  });

  // Arrow labels between cards
  sl.addText('builds on', { x:3.23, y:3.12, w:0.52, h:0.28, align:'center', fontSize:8, color:C.textMuted, margin:0 });
  sl.addText('▶',         { x:3.27, y:3.35, w:0.44, h:0.25, align:'center', fontSize:11, color:C.textDim, margin:0 });
  sl.addText('builds on', { x:6.46, y:3.12, w:0.52, h:0.28, align:'center', fontSize:8, color:C.textMuted, margin:0 });
  sl.addText('▶',         { x:6.50, y:3.35, w:0.44, h:0.25, align:'center', fontSize:11, color:C.textDim, margin:0 });
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 4 — AI & MACHINE LEARNING CAPABILITIES
// ═══════════════════════════════════════════════════════════════
{
  const sl = pres.addSlide();
  sl.background = { color: C.offWhite };
  hdr(sl, 'Layer 1: AI & Machine Learning — Pattern Intelligence');

  // Intro text left
  sl.addText('What ML Enables', { x:0.4, y:0.62, w:4.2, h:0.3, fontSize:13, color:C.teal, bold:true, margin:0 });
  sl.addText('Machine learning finds patterns across large datasets that are invisible to manual review — enabling proactive risk detection, predictive prioritization, and data-driven decision support across the credentialing lifecycle.', {
    x:0.4, y:0.97, w:4.1, h:0.95, fontSize:12, color:C.textMid, margin:0
  });

  // Key principle box
  sl.addShape(pres.shapes.RECTANGLE, { x:0.4, y:2.02, w:4.1, h:0.85, fill:{color:C.blue,transparency:91}, line:{color:C.blue,width:0.75} });
  sl.addShape(pres.shapes.RECTANGLE, { x:0.4, y:2.02, w:0.06, h:0.85, fill:{color:C.blue}, line:{color:C.blue,width:0} });
  sl.addText('Key Principle', { x:0.55, y:2.08, w:3.82, h:0.25, fontSize:11, color:C.blue, bold:true, margin:0 });
  sl.addText('ML models improve over time — the more credentialing data ingested, the more accurate pattern detection becomes. This is a compounding advantage for early adopters.', {
    x:0.55, y:2.33, w:3.82, h:0.48, fontSize:11, color:C.textMid, margin:0
  });

  // Maturity callout
  sl.addShape(pres.shapes.RECTANGLE, { x:0.4, y:3.02, w:4.1, h:2.22, fill:{color:C.offWhite}, line:{color:C.border,width:0.75} });
  sl.addText('Maturity by Use Case', { x:0.55, y:3.1, w:3.8, h:0.28, fontSize:12, color:C.textDark, bold:true, margin:0 });
  const maturity = [
    { label:'Fraud & exclusion risk scoring',   level:'Production',  color:C.green  },
    { label:'Ghost network ML detection',        level:'Production',  color:C.green  },
    { label:'Credentialing delay prediction',    level:'Emerging',    color:C.amber  },
    { label:'Predictive re-credentialing',       level:'Early Stage', color:C.teal   },
    { label:'Network adequacy gap modeling',     level:'Emerging',    color:C.amber  },
  ];
  maturity.forEach((m, j) => {
    sl.addShape(pres.shapes.RECTANGLE, { x:0.55, y:3.48+j*0.35, w:0.07, h:0.22, fill:{color:m.color}, line:{color:m.color,width:0} });
    sl.addText(m.label, { x:0.7, y:3.46+j*0.35, w:2.5, h:0.26, fontSize:11, color:C.textDark, margin:0 });
    labelBadge(sl, 3.28, 3.46+j*0.35, 1.08, 0.26, m.level, m.color);
  });

  // Right: 6 use case cards (2×3)
  const ucases = [
    { title:'Provider Fraud Detection',     desc:'ML screens enrollment applications for fraud risk patterns before they enter the network, enabling risk-tiered reviews.',                    color:C.rose   },
    { title:'Ghost Network Prediction',     desc:'Cross-references directory listings against claims activity. Providers with zero claims and declining utilization flagged automatically.', color:C.purple },
    { title:'Risk Scoring & Stratification',desc:'Composite risk scores combine malpractice history, quality signals, and claims anomalies to prioritize committee review.',                 color:C.blue   },
    { title:'Credentialing Delay Prediction',desc:'Predicts which applications will be delayed based on completeness, specialty, and jurisdiction — enabling early intervention.',            color:C.teal   },
    { title:'Predictive Re-credentialing',  desc:'Identifies high-risk providers for early re-credentialing review, enabling risk-based cycle prioritization vs. fixed 36-month cycles.',   color:C.amber  },
    { title:'Network Adequacy Modeling',    desc:'Forecasts which provider departures or access gaps will create 42 CFR 438.68 compliance failures before they occur.',                     color:C.green  },
  ];
  const cols = [4.72, 7.28];
  const rows = [0.62, 2.08, 3.54];
  ucases.forEach((u, i) => {
    const x = cols[i % 2];
    const y = rows[Math.floor(i / 2)];
    card(sl, x, y, 2.38, 1.34, u.color);
    sl.addText(u.title, { x:x+0.16, y:y+0.1,  w:2.1, h:0.33, fontSize:12, bold:true, color:C.textDark, margin:0 });
    sl.addText(u.desc,  { x:x+0.16, y:y+0.47, w:2.1, h:0.78, fontSize:10.5, color:C.textMid, margin:0 });
  });
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 5 — GENERATIVE AI CAPABILITIES
// ═══════════════════════════════════════════════════════════════
{
  const sl = pres.addSlide();
  sl.background = { color: C.offWhite };
  hdr(sl, 'Layer 2: Generative AI — Language Intelligence');

  sl.addText('What GenAI Adds', { x:0.4, y:0.62, w:4.2, h:0.28, fontSize:13, color:C.teal, bold:true, margin:0 });
  sl.addText('Large language models bring a distinct capability: reading, understanding, synthesizing, and generating natural language. Applied to credentialing, GenAI transforms raw verification data into structured intelligence and eliminates document-heavy manual workflows.', {
    x:0.4, y:0.95, w:4.1, h:0.95, fontSize:12, color:C.textMid, margin:0
  });

  // RAG callout
  sl.addShape(pres.shapes.RECTANGLE, { x:0.4, y:2.0, w:4.1, h:0.82, fill:{color:C.teal,transparency:90}, line:{color:C.teal,width:0.75} });
  sl.addShape(pres.shapes.RECTANGLE, { x:0.4, y:2.0, w:0.06, h:0.82, fill:{color:C.teal}, line:{color:C.teal,width:0} });
  sl.addText('RAG-Powered Compliance Intelligence', { x:0.55, y:2.07, w:3.82, h:0.25, fontSize:11, color:C.teal, bold:true, margin:0 });
  sl.addText('Retrieval-augmented generation (RAG) grounds LLMs in NCQA standards, CMS regulations (42 CFR 438.214), state rules, and organizational policies — enabling real-time compliance Q&A with cited sources.', {
    x:0.55, y:2.33, w:3.82, h:0.42, fontSize:11, color:C.textMid, margin:0
  });

  // Before/After comparison
  sl.addText('Before vs. After: Committee Packet Preparation', {
    x:0.4, y:2.95, w:4.1, h:0.27, fontSize:12, color:C.textDark, bold:true, margin:0
  });
  const baCols = [
    { x:0.4,  label:'BEFORE (Manual)', bg:'FEF2F2', ac:C.rose,  items:['2–3 hours per provider file','Data scattered across PSV printouts','Inconsistent narrative format','Error-prone manual synthesis'] },
    { x:2.55, label:'AFTER (GenAI)',   bg:'F0FDF4', ac:C.green, items:['3–5 seconds per provider file','All PSV sources automatically synthesized','Standardized narrative + risk flagging','Human reviews exceptions, not data'] },
  ];
  baCols.forEach(b => {
    sl.addShape(pres.shapes.RECTANGLE, { x:b.x, y:3.28, w:2.02, h:1.98, fill:{color:b.bg}, line:{color:C.border,width:0.75} });
    sl.addShape(pres.shapes.RECTANGLE, { x:b.x, y:3.28, w:0.06, h:1.98, fill:{color:b.ac}, line:{color:b.ac,width:0} });
    sl.addText(b.label, { x:b.x+0.13, y:3.35, w:1.8, h:0.25, fontSize:10, color:b.ac, bold:true, charSpacing:0.5, margin:0 });
    b.items.forEach((item, j) => {
      sl.addShape(pres.shapes.OVAL, { x:b.x+0.14, y:3.73+j*0.36, w:0.12, h:0.12, fill:{color:b.ac}, line:{color:b.ac,width:0} });
      sl.addText(item, { x:b.x+0.32, y:3.70+j*0.36, w:1.6, h:0.26, fontSize:11, color:C.textMid, margin:0 });
    });
  });

  // Right: 5 GenAI use case cards
  const gcases = [
    { title:'Intelligent Document Extraction',         desc:'LLM-powered OCR/NLP extracts structured data from any document type — licenses, diplomas, DEA certs, CAQH exports — with high accuracy and no templates.',     color:C.teal   },
    { title:'AI Committee Packet Narratives',          desc:'LLMs synthesize PSV results, malpractice claim patterns, sanctions history, and quality signals into structured, committee-ready narrative summaries.',            color:C.blue   },
    { title:'Compliance Q&A Assistant (RAG)',          desc:'Grounded in NCQA standards, 42 CFR regulations, and state rules. Credentialing staff get instant, cited answers to complex compliance questions.',               color:C.purple },
    { title:'Provider Status Chatbot',                 desc:'Providers ask "What is the status of my credentialing?" and receive real-time answers — reducing inbound call volume to credentialing operations centers.',     color:C.amber  },
    { title:'Adverse Action Letter Generation',        desc:'LLMs draft compliant adverse action letters incorporating regulatory requirements, credentialing findings, and appeal rights — subject to attorney review.',    color:C.rose   },
  ];
  gcases.forEach((g, i) => {
    const x = 4.72;
    const y = 0.62 + i * 0.97;
    card(sl, x, y, 5.0, 0.88, g.color);
    sl.addText(g.title, { x:x+0.16, y:y+0.08, w:4.7, h:0.28, fontSize:12, bold:true, color:C.textDark, margin:0 });
    sl.addText(g.desc,  { x:x+0.16, y:y+0.39, w:4.7, h:0.42, fontSize:11, color:C.textMid, margin:0 });
  });
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 6 — AGENTIC AI ARCHITECTURE
// ═══════════════════════════════════════════════════════════════
{
  const sl = pres.addSlide();
  sl.background = { color: C.offWhite };
  hdr(sl, 'Layer 3: Agentic AI — Autonomous End-to-End Credentialing');

  sl.addText('What Agentic AI Changes', { x:0.4, y:0.62, w:9.2, h:0.28, fontSize:13, color:C.cyan, bold:true, margin:0 });
  sl.addText('Agentic AI moves beyond generating outputs to taking autonomous actions — querying primary sources, resolving gaps, retrying failures, and escalating only when human judgment is required.', {
    x:0.4, y:0.95, w:9.2, h:0.38, fontSize:12.5, color:C.textMid, margin:0
  });

  // Orchestrator box (center top)
  sl.addShape(pres.shapes.RECTANGLE, { x:3.5, y:1.48, w:3.1, h:0.72, fill:{color:C.darkBg}, line:{color:C.teal,width:1.5}, shadow:mkS() });
  sl.addText('ORCHESTRATOR AGENT', { x:3.5, y:1.48, w:3.1, h:0.35, align:'center', valign:'middle', fontSize:11, color:C.teal, bold:true, charSpacing:1, margin:0 });
  sl.addText('Decomposes tasks · Assigns to specialists · Monitors progress · Escalates exceptions', {
    x:3.5, y:1.82, w:3.1, h:0.35, align:'center', valign:'middle', fontSize:9, color:C.textOn, margin:0
  });

  // Connector lines down
  sl.addShape(pres.shapes.LINE, { x:5.05, y:2.2,  w:0, h:0.32, line:{color:C.textDim,width:1} });
  sl.addShape(pres.shapes.LINE, { x:1.72, y:2.2,  w:3.33, h:0, line:{color:C.textDim,width:1} });
  sl.addShape(pres.shapes.LINE, { x:8.38, y:2.2,  w:-3.33, h:0, line:{color:C.textDim,width:1} });

  // Specialist agents — row
  const agents = [
    { title:'Intake Agent',      desc:'Classifies & extracts\nfrom all document types', color:C.blue,   x:0.35 },
    { title:'PSV Agent Swarm',   desc:'Parallel verification\nacross 70+ sources',      color:C.teal,   x:2.12 },
    { title:'Exclusions Agent',  desc:'OIG · SAM.gov · 56\nstate Medicaid lists',       color:C.rose,   x:3.89 },
    { title:'Compliance Agent',  desc:'Validates NCQA, CMS\n& state-specific rules',    color:C.purple, x:5.66 },
    { title:'Directory Agent',   desc:'Multi-source directory\naccuracy reconciliation', color:C.amber,  x:7.43 },
  ];

  agents.forEach(a => {
    sl.addShape(pres.shapes.RECTANGLE, { x:a.x, y:2.52, w:1.65, h:1.15, fill:{color:C.white}, line:{color:a.color,width:1}, shadow:mkS() });
    sl.addShape(pres.shapes.RECTANGLE, { x:a.x, y:2.52, w:1.65, h:0.32, fill:{color:a.color,transparency:20}, line:{color:a.color,width:0} });
    sl.addText(a.title, { x:a.x+0.08, y:2.52, w:1.5, h:0.32, valign:'middle', fontSize:11, color:C.white, bold:true, margin:0 });
    sl.addText(a.desc,  { x:a.x+0.08, y:2.87, w:1.5, h:0.72, fontSize:10,  color:C.textMid, margin:0 });
    // Connector line down from orchestrator
    sl.addShape(pres.shapes.LINE, { x:a.x+0.825, y:2.2, w:0, h:0.32, line:{color:C.textDim,width:1} });
  });

  // Monitoring agent (below, separate)
  sl.addShape(pres.shapes.RECTANGLE, { x:0.35, y:3.82, w:1.65, h:0.92, fill:{color:C.white}, line:{color:C.green,width:1}, shadow:mkS() });
  sl.addShape(pres.shapes.RECTANGLE, { x:0.35, y:3.82, w:1.65, h:0.28, fill:{color:C.green,transparency:20}, line:{color:C.green,width:0} });
  sl.addText('Monitoring Agent', { x:0.43, y:3.82, w:1.5, h:0.28, valign:'middle', fontSize:11, color:C.white, bold:true, margin:0 });
  sl.addText('Always-on surveillance\nexclusions · license lapses', { x:0.43, y:4.13, w:1.5, h:0.55, fontSize:10, color:C.textMid, margin:0 });
  sl.addText('(continuous)', { x:0.35, y:4.75, w:1.65, h:0.2, align:'center', fontSize:9, color:C.green, italic:true, margin:0 });

  // Human-in-the-loop box
  sl.addShape(pres.shapes.RECTANGLE, { x:2.4, y:3.72, w:5.4, h:1.62, fill:{color:'FFFBEB'}, line:{color:C.amber,width:1} });
  sl.addShape(pres.shapes.RECTANGLE, { x:2.4, y:3.72, w:0.06, h:1.62, fill:{color:C.amber}, line:{color:C.amber,width:0} });
  sl.addText('Critical Human-in-the-Loop Decision Points  (AI must not eliminate these)', {
    x:2.55, y:3.78, w:5.1, h:0.28, fontSize:11.5, color:C.amber, bold:true, margin:0
  });
  const hil = [
    'Adverse credentialing decisions (denial/termination) — clinical peer review + due process required (NCQA CR 2)',
    'Credentialing committee deliberation and formal recommendation',
    'Exception handling for red flags — malpractice anomalies, sanctions, criminal findings',
    'Appeal decisions — same-or-similar specialty peer reviewer required',
  ];
  hil.forEach((h, j) => {
    sl.addShape(pres.shapes.OVAL, { x:2.56, y:4.14+j*0.28, w:0.1, h:0.1, fill:{color:C.amber}, line:{color:C.amber,width:0} });
    sl.addText(h, { x:2.72, y:4.10+j*0.28, w:4.95, h:0.26, fontSize:10.5, color:C.textMid, margin:0 });
  });

  // Right: key benefits
  sl.addShape(pres.shapes.RECTANGLE, { x:8.0, y:3.72, w:1.78, h:1.62, fill:{color:C.darkBg}, line:{color:C.cyan,width:0.75} });
  sl.addText('Key Benefits', { x:8.08, y:3.78, w:1.62, h:0.28, fontSize:11, color:C.cyan, bold:true, margin:0 });
  ['Parallel processing', 'Self-healing retries', '24/7 availability', 'Full audit trail', 'Scales linearly'].forEach((b,j) => {
    sl.addShape(pres.shapes.RECTANGLE, { x:8.1, y:4.14+j*0.22, w:0.06, h:0.16, fill:{color:C.cyan}, line:{color:C.cyan,width:0} });
    sl.addText(b, { x:8.22, y:4.11+j*0.22, w:1.48, h:0.2, fontSize:10.5, color:C.textOn, margin:0 });
  });
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 7 — THE INTELLIGENT CREDENTIALING WORKFLOW
// ═══════════════════════════════════════════════════════════════
{
  const sl = pres.addSlide();
  sl.background = { color: C.offWhite };
  hdr(sl, 'The Intelligent Credentialing Journey — End to End');

  sl.addText('Five stages, each powered by AI. 60–70% of clean applications can flow with zero human touch.', {
    x:0.4, y:0.58, w:9.2, h:0.28, fontSize:12.5, color:C.textMid, margin:0
  });

  const stages = [
    { num:'1', title:'Document\nIntake',        before:'1–3 days',  after:'< 10 min', ai:'GenAI LLM/OCR',       color:C.blue,   x:0.3  },
    { num:'2', title:'Primary Source\nVerify',  before:'3–8 weeks', after:'2–8 hrs',  ai:'Agentic AI Swarm',    color:C.teal,   x:2.22 },
    { num:'3', title:'Compliance\nValidation',  before:'2–5 days',  after:'Real-time',ai:'AI Rules Engine',     color:C.purple, x:4.14 },
    { num:'4', title:'Committee\nPrep',         before:'1–3 days',  after:'3–5 min',  ai:'GenAI Narrative',     color:C.amber,  x:6.06 },
    { num:'5', title:'Approval &\nEnrollment',  before:'5–10 days', after:'Automated',ai:'AI Routing Rules',    color:C.green,  x:7.98 },
  ];

  stages.forEach((s, i) => {
    const bx = s.x;
    // Stage box
    sl.addShape(pres.shapes.RECTANGLE, { x:bx, y:1.0, w:1.8, h:2.0, fill:{color:C.white}, line:{color:s.color,width:1.2}, shadow:mkS() });
    sl.addShape(pres.shapes.RECTANGLE, { x:bx, y:1.0, w:1.8, h:0.4, fill:{color:s.color,transparency:10}, line:{color:s.color,width:0} });
    // Number circle
    dot(sl, bx+0.06, 1.06, 0.28, s.color);
    sl.addText(s.num, { x:bx+0.06, y:1.06, w:0.28, h:0.28, align:'center', valign:'middle', fontSize:14, color:C.white, bold:true, margin:0 });
    sl.addText(s.title, { x:bx+0.38, y:1.02, w:1.35, h:0.38, valign:'middle', fontSize:11.5, bold:true, color:C.white, margin:0 });
    // Before/After
    sl.addText('Before:', { x:bx+0.1, y:1.47, w:0.6, h:0.22, fontSize:9.5, color:C.textDim, margin:0 });
    sl.addText(s.before, { x:bx+0.66, y:1.47, w:1.05, h:0.22, fontSize:10, color:C.rose, bold:true, margin:0 });
    sl.addText('After:',  { x:bx+0.1, y:1.72, w:0.6, h:0.22, fontSize:9.5, color:C.textDim, margin:0 });
    sl.addText(s.after,   { x:bx+0.66, y:1.72, w:1.05, h:0.22, fontSize:10, color:C.green, bold:true, margin:0 });
    // AI label
    sl.addShape(pres.shapes.RECTANGLE, { x:bx+0.1, y:2.28, w:1.62, h:0.27, fill:{color:s.color,transparency:85}, line:{color:s.color,width:0} });
    sl.addText(s.ai, { x:bx+0.1, y:2.28, w:1.62, h:0.27, align:'center', valign:'middle', fontSize:9.5, color:s.color, bold:true, margin:0 });

    // Arrow to next
    if (i < stages.length - 1) {
      sl.addText('▶', { x:s.x+1.88, y:1.84, w:0.25, h:0.28, align:'center', fontSize:13, color:C.textDim, margin:0 });
    }
  });

  // Total time bar
  sl.addShape(pres.shapes.RECTANGLE, { x:0.3, y:3.22, w:9.45, h:0.05, fill:{color:C.border}, line:{color:C.border,width:0} });
  sl.addText('TOTAL CYCLE TIME', { x:0.3, y:3.35, w:2.0, h:0.25, fontSize:10, color:C.textDim, bold:true, charSpacing:1, margin:0 });
  [
    { label:'Manual: 90–120 days',          color:C.rose,   x:2.5  },
    { label:'AI-Assisted: ~14–30 days',     color:C.amber,  x:5.0  },
    { label:'Fully Autonomous: 2–5 days',   color:C.green,  x:7.1  },
  ].forEach(t => {
    sl.addShape(pres.shapes.OVAL, { x:t.x, y:3.37, w:0.14, h:0.14, fill:{color:t.color}, line:{color:t.color,width:0} });
    sl.addText(t.label, { x:t.x+0.2, y:3.35, w:1.95, h:0.25, fontSize:11, color:t.color, bold:true, margin:0 });
  });

  // Zero touch callout
  sl.addShape(pres.shapes.RECTANGLE, { x:0.3, y:3.75, w:9.45, h:1.55, fill:{color:C.darkBg}, line:{color:C.teal,width:1} });
  sl.addText('The Zero-Touch Vision', { x:0.5, y:3.85, w:4.0, h:0.3, fontSize:13, color:C.teal, bold:true, margin:0 });
  sl.addText('For clean provider applications — no malpractice red flags, no exclusions, no gaps — an AI-autonomous pipeline can credential and enroll without any human intervention. Estimated 60–70% of applications qualify. The credentialing committee\'s role shifts from data review to exception adjudication.', {
    x:0.5, y:4.2, w:5.8, h:0.95, fontSize:12, color:C.textOn, margin:0
  });

  // Right side of zero-touch box
  const ztItems = ['60–70% zero-touch rate (clean files)', 'Committee reviews exceptions only', 'Full audit trail for every decision'];
  ztItems.forEach((z, j) => {
    sl.addShape(pres.shapes.RECTANGLE, { x:6.6, y:3.96+j*0.42, w:0.07, h:0.25, fill:{color:C.cyan}, line:{color:C.cyan,width:0} });
    sl.addText(z, { x:6.74, y:3.93+j*0.42, w:2.9, h:0.3, fontSize:11.5, color:C.textOn, margin:0 });
  });
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 8 — DEEP DIVE: DOCUMENT INTAKE
// ═══════════════════════════════════════════════════════════════
{
  const sl = pres.addSlide();
  sl.background = { color: C.offWhite };
  hdr(sl, 'Deep Dive: Intelligent Document Intake');

  // Left description
  sl.addText('How It Works', { x:0.4, y:0.62, w:4.2, h:0.28, fontSize:13, color:C.teal, bold:true, margin:0 });
  sl.addText('An AI intake system monitors all incoming channels simultaneously — CAQH exports, portal submissions, faxed documents, emailed PDFs — and processes them through a multi-step pipeline without human involvement.', {
    x:0.4, y:0.95, w:4.2, h:0.78, fontSize:12, color:C.textMid, margin:0
  });

  // Pipeline steps
  const steps = [
    { num:'1', label:'Ingest & Classify',       desc:'Any document type from any channel',          color:C.blue   },
    { num:'2', label:'OCR + NLP Extraction',     desc:'Structured data from unstructured documents', color:C.teal   },
    { num:'3', label:'Cross-Reference & Dedup',  desc:'Match to existing provider records',          color:C.purple },
    { num:'4', label:'Gap Detection',            desc:'Identify missing required elements',           color:C.amber  },
    { num:'5', label:'Automated Outreach',       desc:'Email/portal contact for missing items',      color:C.green  },
  ];
  steps.forEach((s, j) => {
    const y = 1.88 + j * 0.66;
    sl.addShape(pres.shapes.OVAL,      { x:0.4,  y, w:0.36, h:0.36, fill:{color:s.color}, line:{color:s.color,width:0} });
    sl.addText(s.num, { x:0.4, y, w:0.36, h:0.36, align:'center', valign:'middle', fontSize:13, color:C.white, bold:true, margin:0 });
    sl.addText(s.label, { x:0.84, y:y+0.01, w:2.4,  h:0.22, fontSize:12, bold:true, color:C.textDark, margin:0 });
    sl.addText(s.desc,  { x:0.84, y:y+0.25, w:3.6,  h:0.22, fontSize:11, color:C.textMid, margin:0 });
    if (j < steps.length-1) sl.addShape(pres.shapes.LINE, { x:0.58, y:y+0.36, w:0, h:0.3, line:{color:C.border,width:1} });
  });

  // Right: what AI extracts
  sl.addText('What AI Extracts', { x:4.8, y:0.62, w:4.9, h:0.28, fontSize:13, color:C.teal, bold:true, margin:0 });

  const sources = [
    { source:'Medical License PDF',     fields:'License #, state, expiry, status, restrictions'       },
    { source:'CAQH ProView Export',     fields:'Training history, work gaps, DEA, malpractice carrier' },
    { source:'Board Certification PDF', fields:'Specialty, certifying board, MOC status, expiry'       },
    { source:'DEA Registration',        fields:'DEA #, schedules, expiry, state registration'           },
    { source:'Malpractice Certificate', fields:'Carrier, policy #, coverage amounts, expiry date'      },
    { source:'Faxed Diploma',           fields:'Medical school, graduation year, degree type'           },
  ];
  sources.forEach((s, j) => {
    const y = 0.62 + j * 0.8;
    sl.addShape(pres.shapes.RECTANGLE, { x:4.8, y, w:4.92, h:0.7, fill:{color:C.white}, line:{color:C.border,width:0.5}, shadow:mkS() });
    sl.addShape(pres.shapes.RECTANGLE, { x:4.8, y, w:0.06, h:0.7, fill:{color:C.teal}, line:{color:C.teal,width:0} });
    sl.addText(s.source, { x:4.95, y:y+0.06, w:4.6, h:0.24, fontSize:12, bold:true, color:C.textDark, margin:0 });
    sl.addText('Extracts: ' + s.fields, { x:4.95, y:y+0.34, w:4.6, h:0.28, fontSize:10.5, color:C.textMid, margin:0 });
  });
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 9 — DEEP DIVE: PSV AGENT SWARM
// ═══════════════════════════════════════════════════════════════
{
  const sl = pres.addSlide();
  sl.background = { color: C.offWhite };
  hdr(sl, 'Deep Dive: Autonomous PSV Agent Swarm');

  sl.addText('Traditional PSV consumes the most time in credentialing. AI-native agentic systems eliminate this bottleneck through parallel, autonomous multi-source verification — with full audit trails.', {
    x:0.4, y:0.58, w:9.2, h:0.38, fontSize:12.5, color:C.textMid, margin:0
  });

  // Stat cards top
  const stats = [
    { val:'3,200+', label:'Verification source types',    color:C.teal   },
    { val:'Parallel', label:'All agents run simultaneously', color:C.blue   },
    { val:'>97%',   label:'Verification success rate (vendor-reported)', color:C.green  },
    { val:'51%+',   label:'More exclusions found vs. periodic manual checks', color:C.amber },
  ];
  stats.forEach((s, i) => {
    sl.addShape(pres.shapes.RECTANGLE, { x:0.4+i*2.36, y:1.05, w:2.2, h:0.85, fill:{color:C.white}, line:{color:s.color,width:1}, shadow:mkS() });
    sl.addText(s.val,   { x:0.5+i*2.36, y:1.1,  w:2.0, h:0.42, align:'center', valign:'middle', fontSize:26, color:s.color, bold:true, fontFace:'Calibri', margin:0 });
    sl.addText(s.label, { x:0.5+i*2.36, y:1.55, w:2.0, h:0.28, align:'center', fontSize:10, color:C.textMid, margin:0 });
  });

  // Agent cards — 2×4 grid
  const agents = [
    { name:'State Licensing Agent',  sources:'50 state medical boards',             result:'License status, expiry, disciplinary history',   color:C.blue   },
    { name:'NPDB Agent',             sources:'NPDB Continuous Query, adverse actions',result:'Malpractice reports, adverse actions, 24hr alerts', color:C.purple },
    { name:'OIG / Exclusions Agent', sources:'OIG, SAM.gov, 56 state Medicaid lists',result:'Federal & state exclusions, debarment, OFAC',     color:C.rose   },
    { name:'DEA Agent',              sources:'DEA Portal, state PDMP',              result:'Registration status, schedules, prescribing anomalies', color:C.amber },
    { name:'Board Certification Agent', sources:'ABMS, AOA board registry',         result:'Specialty certification, MOC currency, expiry',  color:C.teal   },
    { name:'Training Verification Agent', sources:'Medical schools, GME programs',  result:'Degree, residency, fellowship confirmation',      color:C.green  },
    { name:'PECOS / Medicare Agent',  sources:'CMS PECOS, Medicare enrollment',    result:'Active enrollment status, billing NPI match',    color:C.blue   },
    { name:'Malpractice Agent',       sources:'Carrier direct API, PIAA data',      result:'Coverage amounts, claim history, risk pattern',   color:C.cyan   },
  ];

  agents.forEach((a, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.4 + col * 4.82;
    const y = 2.08 + row * 0.83;
    card(sl, x, y, 4.68, 0.74, a.color);
    sl.addText(a.name,    { x:x+0.15, y:y+0.06, w:4.4, h:0.25, fontSize:11.5, bold:true, color:C.textDark, margin:0 });
    sl.addText('Sources: '+a.sources, { x:x+0.15, y:y+0.32, w:4.4, h:0.19, fontSize:10, color:C.textDim,  margin:0 });
    sl.addText(a.result,              { x:x+0.15, y:y+0.51, w:4.4, h:0.18, fontSize:10, color:C.textMid,  margin:0 });
  });

  // Design principle note
  sl.addShape(pres.shapes.RECTANGLE, { x:0.4, y:5.28, w:9.22, h:0.27, fill:{color:C.darkBg}, line:{color:C.darkBg,width:0} });
  sl.addText('Design principle: Direct API connections preferred — agentic browser automation for portals without APIs — AI phone agents for telephone verification. Human validation when agents get stuck.', {
    x:0.5, y:5.29, w:9.0, h:0.24, align:'center', valign:'middle', fontSize:9.5, color:C.textLight, margin:0
  });
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 10 — PROVIDER DIRECTORY AI
// ═══════════════════════════════════════════════════════════════
{
  const sl = pres.addSlide();
  sl.background = { color: C.offWhite };
  hdr(sl, 'Provider Directory AI — Ghost Network Detection');

  sl.addText("Ghost networks — providers listed as in-network who are unavailable, unreachable, or unlicensed — represent today's most acute regulatory and reputational risk.", {
    x:0.4, y:0.58, w:9.2, h:0.38, fontSize:12.5, color:C.textMid, margin:0
  });

  // Big risk stat
  sl.addShape(pres.shapes.RECTANGLE, { x:0.4, y:1.05, w:4.4, h:1.2, fill:{color:'FEF2F2'}, line:{color:C.rose,width:1} });
  sl.addShape(pres.shapes.RECTANGLE, { x:0.4, y:1.05, w:0.06, h:1.2, fill:{color:C.rose}, line:{color:C.rose,width:0} });
  sl.addText('72%', { x:0.55, y:1.1, w:1.3, h:0.75, valign:'middle', fontSize:52, color:C.rose, bold:true, fontFace:'Calibri', margin:0 });
  sl.addText('of behavioral health directory listings were inaccurate\n(HHS OIG, October 2025)', {
    x:1.98, y:1.15, w:2.7, h:0.85, fontSize:12.5, color:C.textDark, margin:0
  });

  sl.addShape(pres.shapes.RECTANGLE, { x:4.95, y:1.05, w:4.72, h:1.2, fill:{color:'FFF7ED'}, line:{color:C.amber,width:1} });
  sl.addShape(pres.shapes.RECTANGLE, { x:4.95, y:1.05, w:0.06, h:1.2, fill:{color:C.amber}, line:{color:C.amber,width:0} });
  sl.addText('Public', { x:5.1, y:1.1, w:1.3, h:0.45, fontSize:28, color:C.amber, bold:true, margin:0 });
  sl.addText('Scores', { x:5.1, y:1.52, w:1.3, h:0.6, fontSize:20, color:C.amber, bold:true, margin:0 });
  sl.addText('CMS will publish directory accuracy scores starting plan year 2029 (REAL Health Providers Act). Plans with ghost networks face competitive and regulatory exposure in a transparent marketplace.', {
    x:6.52, y:1.1, w:3.0, h:1.0, fontSize:11, color:C.textDark, margin:0
  });

  // AI signal sources
  sl.addText('How AI Detects Ghost Providers', { x:0.4, y:2.4, w:5.5, h:0.28, fontSize:13, color:C.teal, bold:true, margin:0 });

  const signals = [
    { icon:'C', title:'Claims Data Analysis',          desc:'Cross-references directory listings with actual claims submissions. Providers with zero billing activity over 12+ months flagged as probable ghosts.',                color:C.blue   },
    { icon:'A', title:'Multi-Channel Attestation',     desc:'Automated email, portal, and text outreach cycles. Non-responsive providers escalated for manual contact and potential removal.',                                color:C.teal   },
    { icon:'N', title:'NPPES & State Board Checks',   desc:'Validates provider license status, primary address, and NPI against directory-listed address. Mismatches trigger investigation.',                                   color:C.purple },
    { icon:'W', title:'Web & Scheduling Intelligence', desc:'AI scans provider websites and scheduling platforms to detect providers no longer accepting Molina patients, not found at listed address, or no longer practicing.', color:C.amber  },
  ];
  signals.forEach((s, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.4 + col * 4.82;
    const y = 2.8 + row * 1.35;
    card(sl, x, y, 4.68, 1.22, s.color);
    dot(sl, x+0.16, y+0.16, 0.35, s.color);
    sl.addText(s.icon,  { x:x+0.16, y:y+0.16, w:0.35, h:0.35, align:'center', valign:'middle', fontSize:16, color:C.white, bold:true, margin:0 });
    sl.addText(s.title, { x:x+0.62, y:y+0.16, w:3.92, h:0.3,  fontSize:12, bold:true, color:C.textDark, margin:0 });
    sl.addText(s.desc,  { x:x+0.16, y:y+0.58, w:4.38, h:0.56, fontSize:11, color:C.textMid, margin:0 });
  });
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 11 — CONTINUOUS MONITORING
// ═══════════════════════════════════════════════════════════════
{
  const sl = pres.addSlide();
  sl.background = { color: C.offWhite };
  hdr(sl, 'Continuous Monitoring — Always-On Intelligence');

  sl.addText("NCQA's 2025 standards mandate monthly monitoring of Medicare/Medicaid exclusions and license expirations. The 'digital twin' model replaces periodic re-credentialing with always-on surveillance.", {
    x:0.4, y:0.58, w:9.2, h:0.38, fontSize:12.5, color:C.textMid, margin:0
  });

  // Left: what's monitored
  sl.addText('What AI Monitors — Continuously', { x:0.4, y:1.05, w:4.2, h:0.28, fontSize:13, color:C.green, bold:true, margin:0 });

  const monitored = [
    { src:'OIG Exclusion Database',        freq:'Daily',       color:C.rose   },
    { src:'SAM.gov Federal Debarment',     freq:'Daily',       color:C.rose   },
    { src:'NPDB Continuous Query',         freq:'Real-time',   color:C.purple },
    { src:'56 State Medical Boards',       freq:'Monthly',     color:C.blue   },
    { src:'State Medicaid Exclusion Lists',freq:'Monthly',     color:C.blue   },
    { src:'DEA Registration Status',       freq:'Weekly',      color:C.amber  },
    { src:'Board Certification MOC',       freq:'Quarterly',   color:C.teal   },
    { src:'Malpractice Coverage',          freq:'Continuous',  color:C.green  },
  ];
  monitored.forEach((m, j) => {
    const y = 1.45 + j * 0.5;
    sl.addShape(pres.shapes.RECTANGLE, { x:0.4, y, w:3.3, h:0.42, fill:{color:C.white}, line:{color:C.border,width:0.5} });
    sl.addShape(pres.shapes.OVAL,      { x:0.48, y:y+0.08, w:0.22, h:0.22, fill:{color:m.color}, line:{color:m.color,width:0} });
    sl.addText(m.src,  { x:0.78, y:y+0.06, w:2.4,  h:0.28, fontSize:11,   color:C.textDark, margin:0 });
    sl.addText(m.freq, { x:3.1,  y:y+0.06, w:0.75, h:0.28, fontSize:10.5, color:m.color, bold:true, margin:0 });
  });

  // Right: Alert types and re-cred model
  sl.addText('Alert Types & Workflow', { x:4.8, y:1.05, w:4.9, h:0.28, fontSize:13, color:C.green, bold:true, margin:0 });

  const alerts = [
    { level:'CRITICAL', color:C.rose,   sla:'< 24 hours', examples:'OIG exclusion added, DEA revoked, license suspended' },
    { level:'HIGH',     color:C.amber,  sla:'3 business days', examples:'License expiring 90 days, new NPDB report, board sanction' },
    { level:'MEDIUM',   color:C.purple, sla:'10 business days', examples:'Malpractice claim filed, coverage gap detected, board action' },
    { level:'INFO',     color:C.blue,   sla:'Next review cycle', examples:'License renewal upcoming, MOC window opening, re-cred due' },
  ];
  alerts.forEach((a, j) => {
    const y = 1.45 + j * 0.62;
    sl.addShape(pres.shapes.RECTANGLE, { x:4.8, y, w:4.92, h:0.54, fill:{color:C.white}, line:{color:a.color,width:1}, shadow:mkS() });
    labelBadge(sl, 4.82, y+0.12, 0.88, 0.3, a.level, a.color);
    sl.addText('SLA: '+a.sla, { x:5.78, y:y+0.06, w:1.58, h:0.22, fontSize:10, color:a.color, bold:true, margin:0 });
    sl.addText(a.examples,    { x:4.82, y:y+0.32, w:4.78, h:0.18, fontSize:10, color:C.textMid, margin:0 });
  });

  // Digital twin model
  sl.addShape(pres.shapes.RECTANGLE, { x:4.8, y:4.0, w:4.92, h:1.3, fill:{color:C.darkBg}, line:{color:C.green,width:1} });
  sl.addText("The 'Digital Twin' Model", { x:4.95, y:4.08, w:4.6, h:0.28, fontSize:13, color:C.green, bold:true, margin:0 });
  sl.addText('Rather than fixed 36-month re-credentialing cycles, AI maintains a real-time digital twin of each provider\'s credential status. Clean providers with no changes flow through re-credentialing with near-zero human touch. Human review is triggered only by material changes.', {
    x:4.95, y:4.4, w:4.62, h:0.82, fontSize:11.5, color:C.textOn, margin:0
  });

  // Left bottom: NCQA mandate
  sl.addShape(pres.shapes.RECTANGLE, { x:0.4, y:5.32, w:4.22, h:0.2, fill:{color:C.teal,transparency:85}, line:{color:C.teal,width:0.5} });
  sl.addText('NCQA 2025: Monthly monitoring of exclusions + license status now mandatory for Medicare/Medicaid plans', {
    x:0.42, y:5.33, w:4.18, h:0.18, align:'center', valign:'middle', fontSize:9.5, color:C.teal, margin:0
  });
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 12 — GOVERNANCE & HUMAN-IN-THE-LOOP
// ═══════════════════════════════════════════════════════════════
{
  const sl = pres.addSlide();
  sl.background = { color: C.offWhite };
  hdr(sl, 'Governance & Human-in-the-Loop — Non-Negotiable Guardrails');

  sl.addText('AI augments credentialing professionals; it does not replace the judgment and accountability that regulations require. Governance is foundational, not optional.', {
    x:0.4, y:0.58, w:9.2, h:0.38, fontSize:12.5, color:C.textMid, margin:0
  });

  // Five governance dimensions
  const dims = [
    {
      num:'1', title:'Accuracy & Patient Safety', color:C.rose,
      points:['Credentialing errors enabling unqualified providers create patient safety risk and False Claims Act liability', 'AI false negative rates must be tracked with the same rigor as false positive rates', 'Human clinical review required for all adverse credentialing decisions']
    },
    {
      num:'2', title:'Bias & Network Equity', color:C.purple,
      points:['ML models trained on historical data can perpetuate biases against providers from certain programs, geographies, or backgrounds', 'Medicaid-specific risk: models trained on commercial data may misinterpret Medicaid practice patterns', 'Regular bias audits required across protected provider characteristics']
    },
    {
      num:'3', title:'Regulatory Compliance', color:C.blue,
      points:['NCQA CR 2: A credentialing committee must make adverse decisions — full automation without oversight may violate accreditation standards', '42 CFR 438.214: Documented processes with auditable decision trails are required', 'NCQA AI Standards in Health Plan Accreditation (2027) — governance framework building must begin now']
    },
    {
      num:'4', title:'Data Security', color:C.amber,
      points:['Credentialing files contain highly sensitive PII: SSNs, DEA numbers, malpractice records, disciplinary history', 'The Change Healthcare cyberattack (2024) demonstrated systemic healthcare data vulnerability', 'AI vendor security assessments and data processing agreements are essential']
    },
    {
      num:'5', title:'Model Governance', color:C.green,
      points:['AI models must be evaluated pre-deployment and monitored ongoing for accuracy drift', 'All AI-assisted decisions require explainable audit trails — "black box" outcomes are not acceptable', 'Establish model review cadence aligned to NCQA AI Stakeholder Working Group guidance (2025+)']
    },
  ];

  dims.forEach((d, i) => {
    const col = i % 2 === 0 && i < 4 ? 0 : 1;
    const positions = [[0.4, 1.05],[4.82, 1.05],[0.4, 2.75],[4.82, 2.75],[0.4, 4.45]];
    const [x, y] = positions[i];
    const w = i === 4 ? 9.2 : 4.22;
    const h = i === 4 ? 0.95 : 1.58;
    card(sl, x, y, w, h, d.color);
    dot(sl, x+0.14, y+0.14, 0.32, d.color);
    sl.addText(d.num, { x:x+0.14, y:y+0.14, w:0.32, h:0.32, align:'center', valign:'middle', fontSize:14, color:C.white, bold:true, margin:0 });
    sl.addText(d.title, { x:x+0.56, y:y+0.16, w:w-0.7, h:0.28, fontSize:12.5, bold:true, color:C.textDark, margin:0 });
    d.points.forEach((pt, j) => {
      sl.addShape(pres.shapes.OVAL, { x:x+0.16, y:y+0.58+j*0.3, w:0.09, h:0.09, fill:{color:d.color}, line:{color:d.color,width:0} });
      sl.addText(pt, { x:x+0.32, y:y+0.54+j*0.3, w:w-0.46, h:0.26, fontSize:10.5, color:C.textMid, margin:0 });
    });
  });
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 13 — STRATEGIC ROADMAP
// ═══════════════════════════════════════════════════════════════
{
  const sl = pres.addSlide();
  sl.background = { color: C.offWhite };
  hdr(sl, 'Strategic Roadmap — Building Toward Autonomous Credentialing');

  sl.addText('A phased approach builds confidence, demonstrates value, and avoids the "big bang" integration risk. Each phase delivers standalone benefits while setting up the next.', {
    x:0.4, y:0.58, w:9.2, h:0.35, fontSize:12.5, color:C.textMid, margin:0
  });

  const phases = [
    {
      num:'1', label:'FOUNDATION', title:'Data & Integration Layer', color:C.blue,
      timeline:'Months 1–6',
      sub:'Before AI can work, the data must flow cleanly',
      initiatives:[
        'Unified provider data foundation (CAQH + NPPES + claims + credentialing)',
        'API connectivity to primary verification sources',
        'Continuous exclusions monitoring (OIG/SAM/NPDB) — highest compliance ROI',
        'Baseline directory accuracy measurement across all markets',
        'Governance framework and AI oversight committee established',
      ]
    },
    {
      num:'2', label:'INTELLIGENCE', title:'AI & GenAI Deployment', color:C.teal,
      timeline:'Months 6–15',
      sub:'Demonstrate AI value at each step of the lifecycle',
      initiatives:[
        'AI document intake and field extraction across all channels',
        'LLM committee packet generation (synthesize PSV + malpractice + risk)',
        'Ghost network ML detection using claims data',
        'Provider status chatbot for status inquiry call deflection',
        'Compliance Q&A assistant (RAG-based, NCQA + CMS grounded)',
      ]
    },
    {
      num:'3', label:'AUTONOMY', title:'Agentic AI at Scale', color:C.cyan,
      timeline:'Months 15–24',
      sub:'Deploy multi-agent orchestration for full automation',
      initiatives:[
        'Agentic PSV agent swarm — parallel verification across 70+ sources',
        'Zero-touch routing for clean applications — committee reviews exceptions',
        'Predictive re-credentialing risk stratification across 36-month cycle',
        'Multi-state agentic deployment with state-specific rule adaptation',
        'Public directory accuracy scoring readiness (CMS 2029 mandate)',
      ]
    },
  ];

  phases.forEach((p, i) => {
    const x = 0.38 + i * 3.22;
    card(sl, x, 1.05, 3.08, 4.28, p.color);
    // Phase header
    sl.addShape(pres.shapes.RECTANGLE, { x, y:1.05, w:3.08, h:0.5, fill:{color:p.color,transparency:15}, line:{color:p.color,width:0} });
    dot(sl, x+0.1, 1.12, 0.32, p.color);
    sl.addText(p.num,   { x:x+0.1, y:1.12, w:0.32, h:0.32, align:'center', valign:'middle', fontSize:15, color:C.white, bold:true, margin:0 });
    sl.addText(p.label, { x:x+0.5, y:1.12, w:2.48, h:0.18, valign:'middle', fontSize:11, color:C.white, bold:true, charSpacing:1, margin:0 });
    sl.addText(p.timeline, { x:x+0.5, y:1.3, w:2.48, h:0.16, valign:'middle', fontSize:9.5, color:C.textOn, margin:0 });
    sl.addText(p.title,   { x:x+0.1, y:1.64, w:2.88, h:0.28, fontSize:13, bold:true, color:C.textDark, margin:0 });
    sl.addText(p.sub,     { x:x+0.1, y:1.94, w:2.88, h:0.22, fontSize:10.5, color:C.textDim, italic:true, margin:0 });
    sl.addShape(pres.shapes.LINE, { x:x+0.1, y:2.22, w:2.85, h:0, line:{color:C.border,width:0.75} });
    p.initiatives.forEach((ini, j) => {
      sl.addShape(pres.shapes.RECTANGLE, { x:x+0.1, y:2.32+j*0.47, w:0.07, h:0.24, fill:{color:p.color}, line:{color:p.color,width:0} });
      sl.addText(ini, { x:x+0.24, y:2.3+j*0.47, w:2.72, h:0.36, fontSize:11, color:C.textMid, margin:0 });
    });
  });

  // Timeline bar
  sl.addShape(pres.shapes.RECTANGLE, { x:0.38, y:5.37, w:9.22, h:0.12, fill:{color:C.border}, line:{color:C.border,width:0} });
  sl.addShape(pres.shapes.RECTANGLE, { x:0.38, y:5.37, w:3.08, h:0.12, fill:{color:C.blue,transparency:50}, line:{color:C.blue,width:0} });
  sl.addShape(pres.shapes.RECTANGLE, { x:3.46, y:5.37, w:3.08, h:0.12, fill:{color:C.teal,transparency:50}, line:{color:C.teal,width:0} });
  sl.addShape(pres.shapes.RECTANGLE, { x:6.54, y:5.37, w:3.06, h:0.12, fill:{color:C.cyan,transparency:50}, line:{color:C.cyan,width:0} });
  sl.addText('Months 1–6', { x:0.38, y:5.5, w:3.08, h:0.14, align:'center', fontSize:9, color:C.blue,   margin:0 });
  sl.addText('Months 6–15', { x:3.46, y:5.5, w:3.08, h:0.14, align:'center', fontSize:9, color:C.teal,   margin:0 });
  sl.addText('Months 15–24',{ x:6.54, y:5.5, w:3.06, h:0.14, align:'center', fontSize:9, color:C.cyan,   margin:0 });
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 14 — CONCLUSION (dark)
// ═══════════════════════════════════════════════════════════════
{
  const sl = pres.addSlide();
  sl.background = { color: C.darkBg };

  // Decorative shapes
  sl.addShape(pres.shapes.OVAL, { x:7.2, y:-0.3, w:4.0, h:4.0, fill:{color:C.teal,transparency:90}, line:{color:C.teal,width:0} });
  sl.addShape(pres.shapes.OVAL, { x:8.4, y:3.6,  w:2.2, h:2.2, fill:{color:C.cyan,transparency:87}, line:{color:C.cyan,width:0} });
  sl.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:0.1, h:5.625, fill:{color:C.teal}, line:{color:C.teal,width:0} });

  sl.addText('THE WINDOW FOR COMPETITIVE ADVANTAGE IS NOW', {
    x:0.5, y:0.35, w:7.8, h:0.4, fontSize:11, color:C.teal, bold:true, charSpacing:2, margin:0
  });
  sl.addText('Three Insights to Guide Strategy', {
    x:0.5, y:0.8, w:7.8, h:0.65, fontSize:36, color:C.white, bold:true, fontFace:'Calibri', margin:0
  });
  sl.addShape(pres.shapes.LINE, { x:0.5, y:1.55, w:6, h:0, line:{color:C.teal,width:1.5} });

  const insights = [
    {
      num:'1', color:C.blue, title:'Start with the Data Layer, Not the AI Layer',
      desc:'The biggest barrier to AI credentialing is not algorithm sophistication — it is data integration. Build a unified provider data foundation connecting CAQH, NPPES, state boards, claims, and credentialing systems first.',
    },
    {
      num:'2', color:C.teal, title:'Ghost Network AI Is the Most Strategically Urgent Investment',
      desc:'With public CMS accuracy scores beginning in 2029, plans that build ML-powered directory capabilities now will have years of model training before scores become public. Those that wait will face regulatory exposure in a transparent marketplace.',
    },
    {
      num:'3', color:C.cyan, title:'The Shared Credentialing Model Will Reshape Economics',
      desc:'Emerging shared credentialing networks aim to eliminate redundant cross-plan verification. Early participation creates network effects and positions plans to benefit from industry infrastructure before it is captured.',
    },
  ];

  insights.forEach((ins, i) => {
    const y = 1.72 + i * 1.12;
    sl.addShape(pres.shapes.OVAL, { x:0.5, y:y+0.06, w:0.4, h:0.4, fill:{color:ins.color,transparency:20}, line:{color:ins.color,width:0.75} });
    sl.addText(ins.num, { x:0.5, y:y+0.06, w:0.4, h:0.4, align:'center', valign:'middle', fontSize:16, color:ins.color, bold:true, margin:0 });
    sl.addText(ins.title, { x:1.04, y:y+0.06, w:6.8, h:0.3,  fontSize:13, bold:true, color:C.white, margin:0 });
    sl.addText(ins.desc,  { x:1.04, y:y+0.4,  w:6.8, h:0.62, fontSize:11.5, color:C.textMuted, margin:0 });
  });

  // Bottom strip
  sl.addShape(pres.shapes.RECTANGLE, { x:0, y:5.2, w:10, h:0.425, fill:{color:'071020'}, line:{color:'071020',width:0} });
  sl.addText('Credentialing is not merely an administrative process — it is the gateway through which every provider enters your network, directly determining member access, compliance, and network quality.', {
    x:0.5, y:5.21, w:9, h:0.4, align:'center', valign:'middle', fontSize:10, color:'64748b', italic:true, margin:0
  });
}

// ─── Save ───────────────────────────────────────────────────────
const outPath = '/Users/Dhanshri/git/Claude/Credentialing/AI_Credentialing_ArtofPossible.pptx';
pres.writeFile({ fileName: outPath })
  .then(() => console.log('✓ Saved:', outPath))
  .catch(err => { console.error('Error:', err); process.exit(1); });
