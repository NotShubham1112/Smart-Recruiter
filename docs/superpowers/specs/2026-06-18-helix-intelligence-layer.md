# Helix Intelligence Layer Design

## Overview

Build the core intelligence pipeline that transforms Helix from a scaffold into a working AI recruitment platform. Four parallel phases: Candidate Digital Twin, Trust Intelligence, Role DNA + Ranking, Multi-Agent Debate.

## Architecture

```
Resume Text / JD Text
    ↓
MCP Services (Candidate, Trust, Role, Recruiter Agents)
    ↓
AI SDK (GroqClient → Qwen3-32B / GPT-OSS-120B)
    ↓
Workflow Pipeline
    ↓
Candidate Twin + Trust Score + Role DNA + Debate
    ↓
Helix Score (0.40×Success + 0.25×Capability + 0.20×Trust + 0.10×Growth + 0.05×Confidence)
    ↓
Web UI (Ranking, Radar Charts, Agent Reasoning, Counterfactuals)
```

## Phase 1: Candidate Digital Twin

**Goal:** Transform raw resume text into a structured CandidateDNA with capability scores.

**Pipeline:**
1. `parseResume(text)` → structured CandidateProfile (sections, skills, experience, education)
2. `extractCapabilities(profile)` → CapabilityDNA (technicalDepth, ownership, learningVelocity, adaptability, communication, leadership) — each 0-100
3. `buildCandidateTwin(dna, trust, growth)` → CandidateTwin

**Implementation:**
- Update `services/candidate-intelligence-mcp/src/tools/` with real Groq-powered extraction
- Add `src/workflows/twin-generation.ts` in packages/ai
- Add radar chart visualization on candidate detail page

## Phase 2: Trust Intelligence

**Goal:** Score how trustworthy a candidate's claims are by cross-referencing evidence.

**Pipeline:**
1. `verifyClaims(profile)` → check consistency between experience, skills, education
2. `detectAnomalies(profile)` → flag unusual patterns (e.g., 10 years experience in a 5-year-old technology)
3. `calculateTrustScore(verification, anomalies, consistency)` → 0-100

**Key signals:** Resume internal consistency, career progression logic, technical specificity, evidence density, GitHub activity correlation

## Phase 3: Role DNA + Ranking

**Goal:** Convert job descriptions into capability requirements and rank candidates.

**Pipeline:**
1. `parseJobDescription(jd)` → RoleDNA (ownership, adaptability, technicalDepth, communication, leadership)
2. `matchCandidates(roleDNA, candidateTwins[])` → similarity scores per dimension
3. `calculateHelixScore(successPrediction, capabilityMatch, trustScore, growthPotential, confidence)` → final 0-100

## Phase 4: Multi-Agent Debate

**Goal:** Simulate structured debate between specialized AI recruiters.

**Agents:** CTO, Hiring Manager, Growth, Risk, Trust — each produces a score + reasoning.

**Debate flow:** Independent scoring → consensus → final recommendation (strong_hire/hire/neutral/no_hire/strong_no_hire).

**UI:** Show each agent's reasoning in an expandable card, highlight disagreements, show final consensus.

## Demo Flow

The working demo:
1. Upload JD → RoleDNA
2. Upload resumes → CandidateTwins (100 shown)
3. Trust Intelligence → flagged candidates with reasons
4. Debate → live agent reasoning
5. Ranking → sorted by Helix Score
6. Counterfactuals → "Why Candidate A won"

## File Changes

- `packages/ai/src/agents/` — New agent implementations
- `packages/ai/src/workflows/` — New pipelines (twin-generation, debate, ranking)
- `services/*-mcp/src/tools/` — Updated tool handlers with real logic
- `apps/web/src/app/candidates/[id]/page.tsx` — New detail page with radar chart
- `apps/web/src/app/trust/page.tsx` — Trust dashboard with flags
- `apps/web/src/app/dashboard/page.tsx` — Ranking list
- `apps/web/src/app/debates/page.tsx` — Agent reasoning cards

## Demo Mode vs Production Mode

- **Demo mode:** Deterministic rule-based scoring (no API keys needed) — works immediately
- **Production mode:** Groq API integration with Qwen3-32B for extraction, GPT-OSS-120B for debate
- Implement both: rule-based fallback when API key absent, AI-powered when available
