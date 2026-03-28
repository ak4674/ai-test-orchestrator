# Test Orchestrator — Branding & Identity Guide

> A comprehensive reference for futuristic name options, color palettes, logo concepts, button styles, typography, and agentic UI imagery for your AI-powered QA platform.

---

## 1. Name Suggestions

### Tier 1 — Top Picks

| Name | Tagline | Why It Works |
|------|---------|--------------|
| **TestForge** | Where test cases are forged in AI fire | "Forge" implies craftsmanship + strength. Memorable, action-oriented, domain-available potential. Best overall pick. |
| **Spectra** | Full-spectrum test intelligence | Clean, modern, premium feel. Implies complete coverage — functional, edge, negative, security. Works globally. |
| **Sentinel** | Always watching. Always testing. | Conveys reliability, vigilance, and proactive quality monitoring. Strong brand recall. |
| **Kairos** | The right test at the right moment | Greek for "the perfect moment." Sophisticated, unique, stands out from typical QA tool names. |

### Tier 2 — Strong Alternatives

| Name | Tagline | Why It Works |
|------|---------|--------------|
| **QANova** | A new star in quality assurance | "Nova" = new star. QA reimagined with AI. Bold, energetic, startup-friendly. |
| **Aegis** | Shield your releases with AI-driven tests | Greek shield of Zeus — evokes protection, quality gate, defensive testing. |
| **Nexus QA** | Connecting stories to bulletproof automation | "Nexus" = connection point. Perfect metaphor for linking Jira → AI → automation code. |
| **Helix** | Spiraling from story to shipped code | DNA helix — intertwined development & testing. Implies evolution, science, precision. |

### Tier 3 — Creative Options

| Name | Tagline | Vibe |
|------|---------|------|
| **Vanguard QA** | Leading the testing frontier | Military / leadership |
| **Cortex** | The brain behind your test suite | Neural / intelligence |
| **Prism** | Refracting stories into test spectrums | Light / clarity / analysis |
| **Catalyst** | Accelerating quality at every stage | Chemistry / speed |
| **Zenith** | Peak quality. Every release. | Summit / perfection |
| **Arcane QA** | Unlock the hidden power of testing | Mystical / discovery |
| **Tensor** | AI-tensioned testing intelligence | ML / mathematical |
| **Obsidian** | Unbreakable quality assurance | Strength / premium |

---

## 2. Color Palettes

### 2.1 Cyber Neon (Recommended — enhances your current theme)

Best for: Dark futuristic dashboards, developer tools, agentic AI platforms.

| Role | Color | Hex Code | Usage |
|------|-------|----------|-------|
| Background Deep | Deep Navy | `#0a0e1a` | Main app background |
| Background Card | Dark Slate | `#111827` | Cards, panels, sidebar |
| Background Hover | Charcoal | `#1e293b` | Hover states, active items |
| Primary Accent | Cyan Glow | `#00F0FF` | Primary buttons, active nav, key metrics |
| Secondary Accent | Electric Blue | `#0066FF` | Links, secondary actions, charts |
| Success | Neon Green | `#39FF14` | Success states, "connected" indicators, passing tests |
| Danger / Critical | Hot Pink | `#FF006E` | Errors, critical priority, failed tests |
| Warning | Amber | `#F7C948` | Warnings, medium priority |
| Text Primary | White | `#F8FAFC` | Headings, primary text |
| Text Secondary | Cool Gray | `#94A3B8` | Labels, descriptions, timestamps |
| Text Muted | Slate | `#64748B` | Placeholders, disabled text |
| Border Default | Faint Glow | `#1E293B` | Card borders, dividers |
| Border Active | Cyan Dim | `rgba(0, 240, 255, 0.3)` | Active card borders, focus rings |

#### CSS Variables

```css
:root {
  --bg-deep: #0a0e1a;
  --bg-card: #111827;
  --bg-hover: #1e293b;
  --accent-primary: #00F0FF;
  --accent-secondary: #0066FF;
  --accent-success: #39FF14;
  --accent-danger: #FF006E;
  --accent-warning: #F7C948;
  --text-primary: #F8FAFC;
  --text-secondary: #94A3B8;
  --text-muted: #64748B;
  --border-default: #1E293B;
  --border-active: rgba(0, 240, 255, 0.3);
  --glow-primary: 0 0 20px rgba(0, 240, 255, 0.4);
  --glow-danger: 0 0 20px rgba(255, 0, 110, 0.4);
  --glow-success: 0 0 16px rgba(57, 255, 20, 0.3);
}
```

---

### 2.2 Plasma Violet (Premium & Bold)

Best for: Enterprise tools, premium SaaS, executive dashboards.

| Role | Color | Hex Code | Usage |
|------|-------|----------|-------|
| Background Deep | Void Black | `#0d0221` | Main background |
| Background Card | Deep Indigo | `#150734` | Cards, panels |
| Background Hover | Purple Haze | `#261447` | Hover, active states |
| Primary Accent | Vivid Violet | `#8338EC` | Primary buttons, active indicators |
| Secondary Accent | Magenta Rose | `#FF006E` | CTAs, alerts, critical items |
| Tertiary | Royal Blue | `#3A86FF` | Links, charts, info states |
| Highlight | Solar Gold | `#FFBE0B` | Badges, star ratings, premium features |
| Text Primary | Ghost White | `#F0E6FF` | Headings |
| Text Secondary | Lavender | `#A78BDB` | Labels |

#### CSS Variables

```css
:root {
  --bg-deep: #0d0221;
  --bg-card: #150734;
  --bg-hover: #261447;
  --accent-primary: #8338EC;
  --accent-secondary: #FF006E;
  --accent-tertiary: #3A86FF;
  --accent-highlight: #FFBE0B;
  --text-primary: #F0E6FF;
  --text-secondary: #A78BDB;
}
```

---

### 2.3 Deep Ocean (Calming & Professional)

Best for: Enterprise QA platforms, compliance-focused teams, healthcare/fintech.

| Role | Color | Hex Code | Usage |
|------|-------|----------|-------|
| Background Deep | Abyss | `#020617` | Main background |
| Background Card | Deep Sea | `#0f172a` | Cards, panels |
| Background Hover | Midnight Blue | `#1e3a5f` | Hover, active states |
| Primary Accent | Ocean Cyan | `#00B4D8` | Primary buttons, active states |
| Secondary Accent | Royal Blue | `#0077B6` | Secondary actions, charts |
| Tertiary | Sky Blue | `#48CAE4` | Info states, links |
| Danger | Raspberry | `#F72585` | Errors, critical alerts |
| Text Primary | Ice White | `#E2E8F0` | Headings |
| Text Secondary | Silver Blue | `#7C93B0` | Labels |

---

### 2.4 Ember Forge (Warm & Energetic)

Best for: Startup tools, creative teams, high-energy brands (pairs perfectly with "TestForge").

| Role | Color | Hex Code | Usage |
|------|-------|----------|-------|
| Background Deep | Obsidian | `#1a1a2e` | Main background |
| Background Card | Dark Sapphire | `#16213e` | Cards, panels |
| Background Hover | Gunmetal | `#2d2d44` | Hover, active states |
| Primary Accent | Forge Orange | `#FF6B35` | Primary buttons, fire accents |
| Secondary Accent | Molten Gold | `#F7C948` | Secondary actions, highlights |
| Tertiary | Electric Purple | `#E040FB` | Charts, AI indicators |
| Success | Mint Glow | `#00F5D4` | Success states, connected |
| Text Primary | Warm White | `#FFF5E6` | Headings |
| Text Secondary | Ash | `#9D8E8E` | Labels |

---

## 3. Typography System

### Recommended Font Pairings

#### Option A — Futuristic Technical (Recommended for TestForge / Sentinel)

| Role | Font | Weight | Size | Letter Spacing |
|------|------|--------|------|----------------|
| Logo / Brand | **Orbitron** | 700–900 | 20–28px | +2px |
| Section Headings | **Rajdhani** | 600–700 | 18–24px | +1px |
| Body / UI Text | **Sora** | 400–500 | 14–16px | 0 |
| Code / Monospace | **JetBrains Mono** | 400 | 13–14px | 0 |

```css
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@600;700&family=Sora:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap');

:root {
  --font-brand: 'Orbitron', monospace;
  --font-heading: 'Rajdhani', sans-serif;
  --font-body: 'Sora', sans-serif;
  --font-code: 'JetBrains Mono', monospace;
}
```

#### Option B — Clean Premium (Recommended for Spectra / Kairos)

| Role | Font | Weight | Size |
|------|------|--------|------|
| Logo / Brand | **Exo 2** | 700–900 | 22–30px |
| Section Headings | **Plus Jakarta Sans** | 600–700 | 18–24px |
| Body / UI Text | **DM Sans** | 400–500 | 14–16px |
| Code / Monospace | **Fira Code** | 400 | 13–14px |

#### Option C — Brutalist Minimal (Recommended for Aegis / Vanguard)

| Role | Font | Weight | Size |
|------|------|--------|------|
| Logo / Brand | **Space Mono** | 700 | 20–26px |
| Section Headings | **Archivo** | 600–800 | 18–24px |
| Body / UI Text | **IBM Plex Sans** | 400–500 | 14–16px |
| Code / Monospace | **IBM Plex Mono** | 400 | 13–14px |

---

## 4. Logo Concepts

### 4.1 TestForge — Anvil + Code Bracket

```
Shape:       Hexagonal shield with an anvil silhouette
Inside:      Code bracket symbols  < / >  merged into the anvil
Colors:      Gradient — #FF6B35 (forge orange) → #F7C948 (molten gold)
Background:  Dark (#1a1a2e) or transparent
Style:       Geometric, sharp edges, metallic feel
```

**SVG Description:**
- Outer hexagon with rounded corners (shield shape)
- Inner anvil formed by a trapezoidal base with a flat top
- `< />` code brackets cut into the anvil face
- Gradient fill from orange to gold (bottom to top, like heated metal)
- Optional: subtle spark particles around the top

---

### 4.2 Spectra — Prism + Light Rays

```
Shape:       Triangular prism (side view)
Inside:      A single white light beam enters from the left
             Splits into 4 colored rays exiting right
Colors:      Prism body — #8338EC (violet) with glass transparency
             Rays — #3A86FF, #39FF14, #F7C948, #FF006E
Background:  Dark (#0d0221) or transparent
Style:       Clean, geometric, editorial
```

**SVG Description:**
- Equilateral triangle (prism cross-section), filled with semi-transparent violet
- Single white line entering left vertex
- 4 diverging colored lines exiting right face
- Each ray color represents a test type (functional, edge, negative, security)

---

### 4.3 Sentinel — Eye + Shield

```
Shape:       Rounded shield / badge outline
Inside:      Stylized eye with a scanning beam
Colors:      Shield — #00B4D8 (ocean cyan) outline
             Eye iris — #00F0FF (cyan glow) with pulse animation
             Scan beam — #00F0FF at 20% opacity, sweeping arc
Background:  Dark (#020617) or transparent
Style:       Sleek, surveillance-inspired, trustworthy
```

**SVG Description:**
- Outer rounded-bottom shield outline (2px stroke, cyan)
- Inner eye shape: two curved arcs forming the eye
- Circle iris in the center with glow effect
- Optional: animated scanning beam (CSS keyframes, rotating arc)

---

### 4.4 Kairos — Hourglass + Clock

```
Shape:       Minimal hourglass merged with clock hands
Inside:      Sand particles replaced with small dots (representing test cases)
Colors:      Frame — #39FF14 (neon green)
             Dots — gradient from #39FF14 to #00B4D8
             Clock hands — #F8FAFC (white)
Background:  Dark or transparent
Style:       Elegant, philosophical, precise
```

---

### 4.5 QANova — Starburst + Q

```
Shape:       Stylized "Q" letter with starburst radiating from center
Colors:      Q outline — #FF006E (hot pink)
             Starburst rays — gradient #FF006E → #8338EC
Style:       Bold, energetic, startup-friendly
```

---

### 4.6 Aegis — Shield + Checkmark

```
Shape:       Classical shield silhouette
Inside:      Large checkmark (✓) in the center
             Horizontal scan lines across the shield (tech feel)
Colors:      Shield — #F7C948 (gold) outline
             Checkmark — #F7C948 solid
             Scan lines — #F7C948 at 15% opacity
Style:       Strong, protective, military-grade quality
```

---

## 5. Button Styles

### 5.1 Primary — Cyber Gradient

```css
.btn-primary {
  background: linear-gradient(135deg, #00F0FF, #0066FF);
  color: #000000;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 1px;
  text-transform: uppercase;
  border: none;
  border-radius: 6px;
  padding: 10px 24px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-primary:hover {
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.4);
  transform: translateY(-1px);
}
.btn-primary:active {
  transform: scale(0.96);
}
```

**Use for:** Generate Tests, Create Plan, AI Analyze, Submit

---

### 5.2 Secondary — Neon Outline

```css
.btn-secondary {
  background: transparent;
  color: #39FF14;
  border: 1.5px solid #39FF14;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 1px;
  text-transform: uppercase;
  border-radius: 6px;
  padding: 10px 24px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-secondary:hover {
  background: rgba(57, 255, 20, 0.1);
  box-shadow: 0 0 16px rgba(57, 255, 20, 0.3);
}
```

**Use for:** Sync Jira, Refresh, Re-fetch, Manual Sync

---

### 5.3 Danger — Plasma Gradient

```css
.btn-danger {
  background: linear-gradient(135deg, #FF006E, #8338EC);
  color: #FFFFFF;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 1px;
  text-transform: uppercase;
  border: none;
  border-radius: 6px;
  padding: 10px 24px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-danger:hover {
  box-shadow: 0 0 20px rgba(131, 56, 236, 0.4);
}
```

**Use for:** Delete, Remove, Disconnect, Critical Actions

---

### 5.4 Warm — Ember Gradient

```css
.btn-warm {
  background: linear-gradient(135deg, #FF6B35, #F7C948);
  color: #1a1a2e;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 1px;
  text-transform: uppercase;
  border: none;
  border-radius: 6px;
  padding: 10px 24px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-warm:hover {
  box-shadow: 0 0 18px rgba(255, 107, 53, 0.4);
}
```

**Use for:** Export Code, Download, Generate Automation

---

### 5.5 Ghost — Transparent

```css
.btn-ghost {
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-primary);
  border: 1px solid rgba(255, 255, 255, 0.15);
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 1px;
  text-transform: uppercase;
  border-radius: 6px;
  padding: 10px 24px;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: all 0.2s ease;
}
.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.3);
}
```

**Use for:** Settings, Cancel, Back, Secondary Navigation

---

### 5.6 Pulse — Animated Status

```css
.btn-pulse {
  background: #00F0FF;
  color: #0a0a1a;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 1px;
  text-transform: uppercase;
  border: none;
  border-radius: 6px;
  padding: 10px 24px;
  cursor: pointer;
  animation: pulse-glow 2s ease-in-out infinite;
}
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 5px rgba(0, 240, 255, 0.2); }
  50%      { box-shadow: 0 0 25px rgba(0, 240, 255, 0.5); }
}
```

**Use for:** Jira Live Access, Real-time Status, AI Processing indicator

---

### 5.7 Button Mapping per Feature

| Feature | Primary Action | Secondary Action | Tertiary Action |
|---------|---------------|-----------------|-----------------|
| Jira Stories | `Cyber` — Fetch Stories | `Neon` — Sync Jira | `Ghost` — Filter |
| Test Plans | `Cyber` — Generate Plan | `Neon` — Regenerate | `Ghost` — Edit |
| Test Cases | `Cyber` — Generate Cases | `Warm` — Export | `Ghost` — Bulk Select |
| Dashboard | `Pulse` — Live Status | `Neon` — Refresh | `Ghost` — Settings |
| Code Gen | `Warm` — Generate Code | `Neon` — Copy Code | `Ghost` — Change Framework |

---

## 6. Agentic UI Imagery & Iconography

### 6.1 AI Agent Visual Language

Your app is agentic (AI does the heavy lifting). Use these visual patterns to communicate "AI is working":

#### Status Indicators

| State | Visual | Color | Animation |
|-------|--------|-------|-----------|
| AI Idle | ○ Hollow circle | `#64748B` (muted) | None |
| AI Thinking | ◉ Pulsing dot | `#00F0FF` (cyan) | Pulse scale 1.0→1.3→1.0, 1.5s loop |
| AI Generating | ≋ Wave lines | `#00F0FF → #0066FF` | Horizontal wave shimmer, 2s loop |
| AI Complete | ✓ Checkmark in circle | `#39FF14` (green) | Fade in + scale bounce |
| AI Error | ✕ X in circle | `#FF006E` (pink) | Shake 3x, 0.3s |

#### Animated AI Thinking Indicator

```css
.ai-thinking {
  display: flex;
  align-items: center;
  gap: 6px;
}
.ai-thinking .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00F0FF;
  animation: ai-bounce 1.4s ease-in-out infinite;
}
.ai-thinking .dot:nth-child(2) { animation-delay: 0.16s; }
.ai-thinking .dot:nth-child(3) { animation-delay: 0.32s; }

@keyframes ai-bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1.0); opacity: 1; }
}
```

---

### 6.2 Agentic Flow Visualization

Show the AI pipeline visually in your dashboard:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  📥 FETCH   │────▶│  🧠 ANALYZE │────▶│  🧪 GENERATE│────▶│  💻 CODE    │
│  Jira Story │     │  AI Engine  │     │  Test Cases  │     │  Automation │
│             │     │             │     │              │     │             │
│  ○ Idle     │     │  ◉ Active   │     │  ○ Pending   │     │  ○ Pending  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
     Step 1              Step 2              Step 3              Step 4
```

#### CSS for Pipeline Steps

```css
.pipeline-step {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  position: relative;
  transition: all 0.3s ease;
}
.pipeline-step.active {
  border-color: var(--accent-primary);
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.15);
}
.pipeline-step.complete {
  border-color: var(--accent-success);
}
.pipeline-connector {
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, var(--accent-primary), transparent);
  animation: flow 1.5s ease-in-out infinite;
}
@keyframes flow {
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
}
```

---

### 6.3 Dashboard Card Imagery

#### Stat Cards with Glow Effect

```css
.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: 12px;
  padding: 20px;
  position: relative;
  overflow: hidden;
}
.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
  border-radius: 12px 12px 0 0;
}
.stat-card .label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 8px;
}
.stat-card .value {
  font-family: var(--font-brand);
  font-size: 32px;
  font-weight: 700;
  color: var(--accent-primary);
}
```

---

### 6.4 Chart Styling for Futuristic Dashboard

#### Automation Priority Bar Chart

```css
.chart-bar {
  background: linear-gradient(180deg, #00F0FF, #0066FF);
  border-radius: 4px 4px 0 0;
  min-width: 40px;
  transition: height 0.6s ease;
  position: relative;
}
.chart-bar:hover {
  box-shadow: 0 0 12px rgba(0, 240, 255, 0.4);
}
.chart-bar.critical { background: linear-gradient(180deg, #FF006E, #8338EC); }
.chart-bar.high     { background: linear-gradient(180deg, #0066FF, #00F0FF); }
.chart-bar.medium   { background: linear-gradient(180deg, #00F0FF, #39FF14); }
.chart-bar.low      { background: linear-gradient(180deg, #39FF14, #00B4D8); }
```

#### Test Coverage Donut Chart Colors

| Segment | Color | Hex | Meaning |
|---------|-------|-----|---------|
| Automated | Cyan | `#00F0FF` | Tests with generated automation code |
| Approved | Electric Blue | `#0066FF` | Reviewed and approved test cases |
| Draft | Amber | `#F7C948` | Work in progress |
| Pending | Hot Pink | `#FF006E` | Not yet started |
| N/A | Gray | `#374151` | No coverage |

---

### 6.5 Sidebar Navigation Icons (SVG Paths)

| Nav Item | Icon Style | Description |
|----------|-----------|-------------|
| Dashboard | Grid of 4 squares | 2×2 grid, rounded corners, one square glowing cyan |
| Jira Stories | Document with Jira logo badge | Page icon with small blue diamond overlay |
| Test Plans | Clipboard with checklist | Clipboard outline, 3 horizontal lines with checkmarks |
| Test Cases | Flask / beaker | Erlenmeyer flask with bubbles inside |
| Code Generator | Terminal with `</>` | Terminal window with code bracket symbol |

---

## 7. Micro-Interactions & Animations

### 7.1 Page Load Stagger

```css
.stagger-in > * {
  opacity: 0;
  transform: translateY(12px);
  animation: stagger-fade 0.4s ease forwards;
}
.stagger-in > *:nth-child(1) { animation-delay: 0.05s; }
.stagger-in > *:nth-child(2) { animation-delay: 0.10s; }
.stagger-in > *:nth-child(3) { animation-delay: 0.15s; }
.stagger-in > *:nth-child(4) { animation-delay: 0.20s; }

@keyframes stagger-fade {
  to { opacity: 1; transform: translateY(0); }
}
```

### 7.2 Card Hover Glow

```css
.card-glow:hover {
  border-color: rgba(0, 240, 255, 0.4);
  box-shadow: 
    0 0 15px rgba(0, 240, 255, 0.08),
    inset 0 0 15px rgba(0, 240, 255, 0.03);
  transition: all 0.3s ease;
}
```

### 7.3 Skeleton Loader (AI Processing)

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-card) 25%,
    var(--bg-hover) 50%,
    var(--bg-card) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
  border-radius: 6px;
}
@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### 7.4 Success Confetti Burst (Test Generation Complete)

```css
.success-burst {
  position: relative;
}
.success-burst::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  font-size: 24px;
  color: #39FF14;
  animation: burst 0.6s ease forwards;
}
@keyframes burst {
  0%   { transform: translate(-50%, -50%) scale(0); opacity: 0; }
  50%  { transform: translate(-50%, -50%) scale(1.4); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
}
```

---

## 8. Complete Theme Implementation Example

### Tailwind CSS Config (tailwind.config.js)

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'deep':     '#0a0e1a',
        'card':     '#111827',
        'hover':    '#1e293b',
        'cyan':     '#00F0FF',
        'electric': '#0066FF',
        'neon':     '#39FF14',
        'hotpink':  '#FF006E',
        'amber':    '#F7C948',
        'forge':    '#FF6B35',
        'violet':   '#8338EC',
        'mint':     '#00F5D4',
      },
      fontFamily: {
        brand:   ['Orbitron', 'monospace'],
        heading: ['Rajdhani', 'sans-serif'],
        body:    ['Sora', 'sans-serif'],
        code:    ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-cyan':  '0 0 20px rgba(0, 240, 255, 0.4)',
        'glow-neon':  '0 0 16px rgba(57, 255, 20, 0.3)',
        'glow-pink':  '0 0 20px rgba(255, 0, 110, 0.4)',
        'glow-forge': '0 0 18px rgba(255, 107, 53, 0.4)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer':    'skeleton-shimmer 1.5s ease-in-out infinite',
      },
    },
  },
};
```

---

## 9. Recommendation Summary

| Aspect | Best Choice | Reason |
|--------|------------|--------|
| **Name** | **TestForge** | Memorable, action-oriented, implies craftsmanship, great domain potential |
| **Runner-up Name** | **Spectra** | Clean, premium, globally friendly, implies full coverage |
| **Color Palette** | **Cyber Neon** | Matches your existing dark theme, vibrant but professional |
| **Typography** | **Orbitron + Rajdhani + Sora** | Futuristic brand font, readable UI text, technical feel |
| **Primary Button** | **Cyber Gradient** | Eye-catching for CTAs, high contrast on dark backgrounds |
| **Logo Style** | **Hexagonal Shield + Code Brackets** | Combines strength (shield) with tech identity (code) |
| **Animation** | **Stagger + Glow + Pulse** | Subtle enough for daily use, impressive on first load |

---

> **Next Step:** Pick a name and palette from above, and I can generate a pixel-perfect dashboard mockup, a complete component library, or a production-ready CSS theme file for your chosen identity.