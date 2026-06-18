# Helix Frontend V1 — Core First Design Spec

> Premium AI-native recruitment intelligence platform. Dark mode first. AI-first interaction.

**Scope:** Global layout, Dashboard, Candidate Explorer, Candidate Twin. Remaining pages stubbed.

**Visual Direction:** Hybrid of Neo Chat (AI input), Linear (sidebar/nav), Vercel (clean surfaces), Cursor (command palette).

---

## 1. Color System — Dark Mode First

Replace current HSL variables with hex-first dark tokens. Light mode secondary.

| Token | Hex | Usage |
|-------|-----|-------|
| `--background` | `#0A0A0A` | Page background |
| `--surface` | `#111111` | Sidebar, elevated surfaces |
| `--card` | `#171717` | Card backgrounds |
| `--border` | `#262626` | All borders |
| `--text` | `#FAFAFA` | Primary text |
| `--muted` | `#A1A1AA` | Secondary text, placeholders |
| `--success` | `#22C55E` | Positive scores, verified |
| `--warning` | `#F59E0B` | Caution, suspicious |
| `--danger` | `#EF4444` | Risk, flagged |
| `--info` | `#3B82F6` | Links, AI agent accents |

**Typography:**
- Font: `Inter` (Google Fonts) or system font stack
- Headings: `font-semibold` with tight letter-spacing
- Body: `font-normal` at 14-16px
- Monospace scores: `font-mono` for numbers

**Spacing:**
- Sidebar width: 240px (collapsed: 64px)
- Page padding: 32px desktop, 16px mobile
- Card padding: 24px
- Gap between cards: 16px

---

## 2. Global Layout

### Root Layout (`apps/web/src/app/layout.tsx`)

```
┌─────────────────────────────────────────────┐
│  Sidebar (240px)  │  Main Content Area       │
│                   │                          │
│  Logo             │  TopBar (optional)       │
│  Nav Items        │  ─────────────────────   │
│  ─────────────    │  {children}              │
│  Dashboard        │                          │
│  Candidates       │                          │
│  Roles            │                          │
│  Trust            │                          │
│  Debates          │                          │
│  Simulations      │                          │
│  Reports          │                          │
│  ─────────────    │                          │
│  Settings         │                          │
│                   │                          │
│  CMD+K hint       │                          │
└─────────────────────────────────────────────┘
```

### Sidebar Component

- Fixed left, full height
- Background: `--surface` (#111111)
- Border-right: 1px `--border`
- Logo at top: "Helix" wordmark with a small DNA helix icon (Lucide `Dna` or custom SVG)
- Nav items: Lucide icons + labels, active state has `--info` left border accent + subtle bg highlight
- Bottom: CMD+K hint ("⌘K" badge)
- Collapsible on mobile (hamburger menu)
- Smooth width transition with Framer Motion

### TopBar

- Sticky top, height 56px
- Background: `--background` with subtle `backdrop-blur`
- Left: Page title (dynamic)
- Right: Search trigger (opens CMD+K), notification bell, avatar dropdown
- Border-bottom: 1px `--border`

---

## 3. AI Command Center (CMD+K)

Global overlay triggered by `⌘K` / `Ctrl+K`.

### Trigger
- Keyboard shortcut: `⌘K` / `Ctrl+K`
- Click on search icon in TopBar
- Click on "⌘K" hint in Sidebar

### Overlay
- Full-screen semi-transparent backdrop (`rgba(0,0,0,0.6)`)
- Centered modal, max-width 640px
- Background: `--card` with `backdrop-blur-xl`
- Rounded-2xl, shadow-2xl

### Content
- Large text input at top: "Ask Helix anything..." placeholder
- Below input: action chips
  - "Analyze a role"
  - "Find candidates"
  - "Compare candidates"
  - "Run simulation"
  - "Generate report"
- Below chips: recent searches (if any)
- Keyboard: ↑↓ to navigate, Enter to select, Esc to close

### Design Reference
- Similar to Neo Chat's centered input but as an overlay
- Similar to Linear's command palette
- Similar to Vercel's ⌘K search

---

## 4. Dashboard Page

Route: `/`

### Hero Section

Centered, large AI prompt box (not a small input — this is the signature element).

```
┌─────────────────────────────────────────────┐
│                                             │
│            Welcome back, Recruiter          │
│                                             │
│   ┌─────────────────────────────────────┐   │
│   │  Upload a job description or ask    │   │
│   │  Helix to find exceptional          │   │
│   │  candidates.                        │   │
│   │                                     │   │
│   │  [📎 Upload JD]  [🎤 Voice]  [➤]   │   │
│   └─────────────────────────────────────┘   │
│                                             │
│   [Analyze Role] [Import Candidates]        │
│   [Run Simulation] [Generate Report]        │
│                                             │
└─────────────────────────────────────────────┘
```

- Background: subtle gradient or radial glow behind the input
- Input: large, rounded-xl, border `--border`, focus ring `--info`
- Action buttons below: pill-shaped, `--surface` background, hover → `--card`
- Framer Motion: fade-in + slight scale on mount

### Dashboard Widgets (below hero)

2-column grid on desktop, 1-column on mobile.

**Widget Cards:**
1. **Candidate Pipeline** — mini bar chart (Recharts) showing candidates by stage
2. **Top Candidates** — list of 3-5 candidates with mini helix scores
3. **Trust Alerts** — list of flagged candidates with trust scores (red/yellow)
4. **Recent Debates** — list of recent agent debates with recommendation badges
5. **Simulation Results** — success probability gauges
6. **Hiring Insights** — text-based AI insights (placeholder)

Each widget:
- Card with `--card` background
- Header with title + "View All" link
- Content area
- Framer Motion: staggered fade-in on mount

---

## 5. Candidate Explorer Page

Route: `/candidates`

### Layout

```
┌─────────────────────────────────────────────┐
│  Search Bar + Filters                        │
│  ─────────────────────────────────────────   │
│  Sort: [Helix Score ▼]  View: [Grid|List]   │
│  ─────────────────────────────────────────   │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      │
│  │Card 1│ │Card 2│ │Card 3│ │Card 4│      │
│  └──────┘ └──────┘ └──────┘ └──────┘      │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      │
│  │Card 5│ │Card 6│ │Card 7│ │Card 8│      │
│  └──────┘ └──────┘ └──────┘ └──────┘      │
└─────────────────────────────────────────────┘
```

### Search & Filters

- Full-width search input with Lucide `Search` icon
- Filter chips below: "All", "High Trust", "Low Risk", "Top Scorers"
- Sort dropdown: "Helix Score", "Trust Score", "Success Probability", "Name"
- View toggle: Grid (cards) | List (table)

### Candidate Card

```
┌─────────────────────────────────┐
│  👤  Alex Chen                  │
│      Senior Full-Stack Engineer │
│                                 │
│  Helix Score    92%  ████████  │
│  Success Prob   91%  ████████  │
│  Trust Score    89   ████████  │
│  Risk           Low  ████      │
│                                 │
│  [TypeScript] [React] [AWS]    │
│                                 │
│  [View Twin →]                  │
└─────────────────────────────────┘
```

- Background: `--card`
- Border: 1px `--border`, hover → `--info` border
- Rounded-xl
- Name: `text-lg font-semibold`
- Title: `text-sm text-muted`
- Score bars: colored progress bars (green for high, yellow mid, red low)
- Skills: small badges
- "View Twin →" link at bottom
- Framer Motion: hover scale 1.02, tap scale 0.98

### Candidate List View (alternative)

Table with columns: Name, Title, Helix Score, Success %, Trust, Risk, Actions.
Uses existing `Table` component from `@helix/ui`.

---

## 6. Candidate Twin Page (Signature Experience)

Route: `/candidates/[id]`

This is the most important page. It must feel premium and AI-native.

### Layout

```
┌─────────────────────────────────────────────┐
│  ← Back to Candidates                       │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  HEADER: Name, Title, Location      │    │
│  │  Helix Score (large), Actions       │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ Trust    │ │ Success  │ │ Growth   │   │
│  │ Score    │ │ Prob     │ │ Potential│   │
│  └──────────┘ └──────────┘ └──────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  CANDIDATE DNA — Radar Chart        │    │
│  │  6 dimensions with breakdown        │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  TRUST INTELLIGENCE                 │    │
│  │  Claims, anomalies, AI detection    │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  AGENT DEBATE                       │    │
│  │  CTO / Trust / Growth panels        │    │
│  │  with reasoning + scores            │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  COUNTERFACTUAL ANALYSIS            │    │
│  │  "What would improve ranking?"      │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  CAREER TIMELINE                    │    │
│  │  Visual work history                │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

### Header Section

- Back link: "← Back to Candidates"
- Candidate name: `text-3xl font-bold`
- Title: `text-lg text-muted`
- Location, experience years
- Large Helix Score display: circular progress or large number with color
- Action buttons: "Export", "Share", "Run Simulation", "Generate Interview"

### Score Cards Row

3 cards in a row:
1. **Trust Score** — large number + status badge (Verified/Suspicious/Flagged)
2. **Success Probability** — percentage + progress bar
3. **Growth Potential** — percentage + progress bar

### Candidate DNA Section

Radar chart (Recharts) with 6 dimensions:
- Technical Depth
- Leadership
- Ownership
- Communication
- Adaptability
- Learning Velocity

Below chart: bar breakdown of each dimension with scores.

### Trust Intelligence Section

- Overall trust score with color
- AI-Generated Probability (progress bar)
- Anomaly Score (progress bar)
- Claims verified count
- Red flags list (if any) with warning styling

### Agent Debate Section

3 agent cards side by side:
- **CTO Agent** — blue accent, score, reasoning, evidence, confidence
- **Trust Agent** — green accent, score, reasoning, evidence, confidence
- **Growth Agent** — purple accent, score, reasoning, evidence, confidence

Each card shows:
- Agent avatar/icon
- Stance: support ✅ / caution ⚠️ / neutral ➖
- Reasoning text
- Key points (+/-)
- Confidence bar

### Counterfactual Analysis

"What would improve ranking?" section:
- List of scenarios with impact scores
- Each scenario: description → score delta → outcome

### Career Timeline

Vertical timeline of work experience:
- Company name, title, dates
- Key skills used
- Connections between roles

---

## 7. Components to Build (Core First)

### New Components (create in `packages/ui/src`)

| Component | Description |
|-----------|-------------|
| `Sidebar` | Global nav sidebar with logo, nav items, collapse |
| `TopBar` | Sticky top bar with title, search, avatar |
| `CommandCenter` | CMD+K overlay with search, actions, recent |
| `CandidateCard` | Card for explorer grid/list |
| `ScoreCard` | Metric card with large number + label + progress |
| `RadarChart` | Recharts radar wrapper for DNA dimensions |
| `AgentCard` | Debate agent panel with reasoning |
| `TimelineItem` | Career timeline node |

### Updated Components

| Component | Changes |
|-----------|---------|
| `globals.css` | New dark color tokens, typography |
| `layout.tsx` | Add Sidebar + TopBar wrapper |
| `dashboard/page.tsx` | Hero AI prompt + widget grid |
| `candidates/page.tsx` | Search + filters + card grid |
| `candidates/[id]/page.tsx` | Full twin page with all sections |
| `trust/page.tsx` | Stub with placeholder |
| `debates/page.tsx` | Stub with placeholder |
| `roles/page.tsx` | Stub with placeholder |

---

## 8. File Structure

```
apps/web/src/
├── app/
│   ├── layout.tsx              # Root layout with Sidebar + TopBar
│   ├── page.tsx                # Dashboard (hero + widgets)
│   ├── candidates/
│   │   ├── page.tsx            # Explorer with search/filters/cards
│   │   └── [id]/page.tsx       # Candidate Twin (signature page)
│   ├── roles/page.tsx          # Stub
│   ├── trust/page.tsx          # Stub
│   ├── debates/page.tsx        # Stub
│   ├── simulations/page.tsx    # Stub
│   ├── reports/page.tsx        # Stub
│   └── settings/page.tsx       # Stub
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   └── CommandCenter.tsx
│   ├── candidates/
│   │   ├── CandidateCard.tsx
│   │   ├── CandidateGrid.tsx
│   │   ├── CandidateFilters.tsx
│   │   └── CandidateSearch.tsx
│   ├── twin/
│   │   ├── TwinHeader.tsx
│   │   ├── ScoreCards.tsx
│   │   ├── DNARadar.tsx
│   │   ├── TrustSection.tsx
│   │   ├── DebatePanel.tsx
│   │   ├── Counterfactuals.tsx
│   │   └── CareerTimeline.tsx
│   └── dashboard/
│       ├── HeroPrompt.tsx
│       └── WidgetGrid.tsx
├── hooks/
│   ├── useCommandCenter.ts     # CMD+K state
│   └── useCandidates.ts        # Candidate data fetching
├── lib/
│   └── mock-data.ts            # Mock candidates, roles, debates
├── providers/
│   └── index.tsx               # Existing (QueryClient + ThemeProvider)
└── styles/
    └── globals.css             # Updated dark color tokens
```

---

## 9. Dependencies to Install

```bash
# Framer Motion (not yet installed)
pnpm add framer-motion

# All other deps already present:
# next, react, zustand, tanstack-query, recharts, lucide, next-themes, tailwind, etc.
```

---

## 10. Mock Data Strategy

All data is mocked locally in `lib/mock-data.ts`. No API calls in Core First.

Mock data includes:
- 8-10 candidates with full profiles
- 5 roles with DNA
- 3-4 debates with agent arguments
- Trust reports for each candidate
- Counterfactual scenarios

---

## 11. Animation Plan (Framer Motion)

| Element | Animation |
|---------|-----------|
| Sidebar nav items | Fade-in stagger on mount |
| Dashboard hero | Scale 0.95→1 + fade-in |
| Widget cards | Staggered fade-in from bottom |
| Candidate cards | Hover: scale 1.02, tap: scale 0.98 |
| Command center | Backdrop fade, modal slide-up |
| Page transitions | Fade + slight Y translation |
| Radar chart | Animate on mount (Recharts built-in) |
| Score numbers | Count-up animation on mount |
| Agent cards | Fade-in with stagger |

---

## 12. Mobile Responsive

- Sidebar: hidden on mobile, hamburger menu toggles it
- Dashboard: single column, hero input full-width
- Candidate grid: 1 column mobile, 2 tablet, 4 desktop
- Twin page: stacked sections, full-width cards
- Command center: full-screen on mobile

---

## 13. Success Criteria

- [ ] Dark mode by default, no flash of light
- [ ] Sidebar navigation works with active states
- [ ] CMD+K opens/closes with keyboard shortcut
- [ ] Dashboard hero prompt is visually prominent
- [ ] Candidate explorer has search, filter, sort working
- [ ] Candidate Twin page shows all sections with mock data
- [ ] Radar chart renders with 6 dimensions
- [ ] Agent debate shows 3 agents with reasoning
- [ ] All animations are smooth (60fps)
- [ ] Responsive on mobile/tablet/desktop
- [ ] No TypeScript errors
- [ ] Premium feel — no placeholder UI
