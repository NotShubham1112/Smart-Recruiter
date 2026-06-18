# Helix Platform Scaffold Design

## Overview

Scaffold Helix — an AI-native recruitment intelligence platform — as a pnpm monorepo with Turborepo. The project includes a Next.js 16 web app, a thin Fastify API, 7 MCP services, an orchestration engine, shared packages, skill files, and full infrastructure configs.

## Architecture

```
Web (Next.js 16)
    ↓
API (Fastify — thin, no AI)
    ↓
BullMQ Queue
    ↓
Orchestration Engine (LangGraph)
    ↓
MCP Services (Candidate, Trust, Role, Graph, Simulation, Recruiter Agents)
    ↓
Databases (PostgreSQL, Neo4j, Qdrant, Redis)
```

AI orchestration lives in `services/orchestration-engine/`, **not** in the API. This prevents AI workloads from crashing the API under load.

## Core Stack

| Layer | Technology |
|-------|-----------|
| Monorepo | pnpm + Turborepo |
| Frontend | Next.js 16, React 19, Tailwind, shadcn/ui, Zustand, TanStack Query, React Hook Form, Zod, Clerk, Recharts, Socket.IO |
| API | Node.js 22+, Fastify, BullMQ, JWT, Pino, OpenTelemetry |
| AI | Groq (Qwen3-32B, GPT-OSS-120B), LangGraph, MCP |
| Databases | PostgreSQL, Neo4j, Qdrant, Redis |
| Infra | Docker, Kubernetes, Terraform |

## Repository Structure

```
helix/
├── apps/
│   ├── web/              # Next.js 16 + shadcn/ui
│   └── api/              # Fastify — thin, no AI calls in controllers
├── packages/
│   ├── ui/               # Shared shadcn/ui components
│   ├── types/            # TypeScript interfaces (CandidateTwin, RoleDNA, etc.)
│   ├── shared/           # Zod schemas, utilities
│   └── ai/               # Prompts, workflows, agents, model router
├── services/
│   ├── candidate-intelligence-mcp/
│   ├── trust-intelligence-mcp/
│   ├── role-intelligence-mcp/
│   ├── graph-intelligence-mcp/
│   ├── simulation-engine-mcp/
│   ├── recruiter-agents-mcp/
│   └── orchestration-engine/    # LangGraph workflows, agent coordination
├── skills/                # 9 .skill.md files
├── infrastructure/
│   ├── docker/            # Dockerfiles + docker-compose.yml
│   ├── kubernetes/        # Manifests for all services
│   └── terraform/         # Modules: network, database, compute, storage, monitoring
├── docs/
│   ├── architecture/
│   ├── api/
│   └── mcp/
├── research/
└── .github/
    └── workflows/         # CI/CD: lint, typecheck, test, build, docker, deploy
```

## Component Details

### Root
- `package.json` — workspace root scripts
- `pnpm-workspace.yaml` — workspace globs (`apps/*`, `packages/*`, `services/*`)
- `turbo.json` — pipeline with caching
- `tsconfig.base.json` — strict TypeScript, ESM
- `.eslintrc.cjs`, `.prettierrc`, `.gitignore`, `.env.example`

### apps/web
- `/src/app/` — App Router pages: dashboard, candidates/[id], roles/[id], simulations, reports, trust, debates, settings
- `/src/components/` — Shared UI components
- `/src/features/` — Feature-specific components
- `/src/hooks/` — Custom hooks
- `/src/providers/` — Clerk, TanStack Query, Socket.IO providers
- `/src/store/` — Zustand stores
- `/src/services/` — API client services
- `/src/lib/` — Utilities
- `/src/types/` — Frontend-specific types
- `/src/styles/` — Global styles
- shadcn/ui components.json
- Tailwind + PostCSS config
- Next.js 16 config

### apps/api
- Thin layer: auth, CRUD, queue submission, WebSocket events, audit logs, health checks
- `/src/modules/` — auth, candidate, role, company, trust, graph, simulation, ranking, reports
- `/src/plugins/` — Fastify plugins (CORS, Helmet, JWT)
- `/src/middleware/` — Auth, logging, rate limiting
- `/src/queues/` — BullMQ queue definitions
- `/src/workers/` — BullMQ worker stubs
- `/src/db/` — PostgreSQL client (Drizzle or Kysely)
- `/src/lib/` — Pino, OpenTelemetry config

### packages/types
Production interfaces: CandidateProfile, CandidateDNA, CandidateTwin, RoleProfile, RoleDNA, CompanyProfile, TrustScore, CapabilityScore, SuccessScore, CareerGraph, SimulationResult, RecruiterDebate, CounterfactualAnalysis, MCPRequest, MCPResponse, ToolDefinition

### packages/shared
Centralized Zod schemas for: Candidate, Role, Company, Trust, Simulation, Debate, Report, Graph. Utility functions, constants, enums.

### packages/ai
- `prompts/` — Prompt templates
- `workflows/` — LangGraph workflow definitions
- `agents/` — Agent definitions
- `providers/` — Groq client
- `registry/` — Model router (Qwen3-32B for extraction/trust, GPT-OSS-120B for debate/simulation)

### services/orchestration-engine
- LangGraph execution runtime
- Agent coordination
- Workflow execution
- Memory management
- Tool routing
- Failure recovery
- BullMQ queue consumers
- Fastify MCP transport

### MCP Services (each)
Each MCP service has:
- `src/server.ts` — Fastify with MCP transport
- `src/transport.ts` — MCP protocol handler
- `src/tools/` — Individual tool implementations
- `src/schemas/` — Zod schemas for tools
- `src/services/` — Business logic
- `src/types/` — Service-specific types
- `tests/` — Test stubs
- `package.json`, `tsconfig.json`

**Candidate Intelligence MCP** — Tools: parse_resume, extract_skills, extract_capabilities, build_candidate_dna, infer_learning_velocity

**Trust Intelligence MCP** — Tools: calculate_trust_score, verify_claims, detect_resume_anomalies, detect_ai_resume_patterns, career_consistency_analysis

**Role Intelligence MCP** — Tools: parse_job_description, build_role_dna, extract_requirements, company_context_analysis

**Graph Intelligence MCP** — Tools: build_career_graph, query_graph, career_path_analysis, relationship_discovery

**Simulation Engine MCP** — Tools: simulate_candidate_success, predict_retention, predict_growth, counterfactual_analysis

**Recruiter Agents MCP** — Tools: run_cto_review, run_hiring_manager_review, run_growth_review, run_risk_review, run_debate, generate_consensus

### Skills
All markdown files with frontmatter: metadata, goal, context, inputs, outputs, evaluation criteria, examples, edge cases. Files: candidate-dna, role-dna, trust-intelligence, career-graph, success-simulation, counterfactual-analysis, recruiter-debate, hidden-talent, report-generation

### Infrastructure
- **Docker:** Dockerfiles for api, web, orchestrator; docker-compose.yml with postgres, redis, neo4j, qdrant, api, web, orchestrator
- **Terraform:** Modules for network, database, compute, storage, monitoring
- **Kubernetes:** Manifests for api, web, orchestrator, workers, postgres, redis, neo4j, qdrant, ingress

### CI/CD
GitHub Actions workflows: lint, typecheck, test, build, docker, deploy

## Implementation Order

1. Root monorepo config (pnpm-workspace, turbo, tsconfig, eslint, prettier, gitignore)
2. packages/types (no internal deps)
3. packages/shared (depends on types)
4. packages/ui (no internal deps)
5. packages/ai (depends on types, shared)
6. apps/api (depends on all packages)
7. apps/web (depends on all packages)
8. services/orchestration-engine (depends on packages/ai, types, shared)
9. MCP services (6 independent services, depends on types, shared)
10. skills/ (static files)
11. infrastructure/ (Docker, K8s, Terraform)
12. docs/ and .github/ (CI/CD)

## Generation Rules
- Strict TypeScript, ESM, no `any` types
- Barrel files (index.ts) for every module
- package.json + tsconfig.json for every workspace
- README.md per package
- `.env.example` files
- ~80-100 files with realistic implementations and stubs

## Dashboard Pages
- `/dashboard` — Landing
- `/candidates` — List
- `/candidates/[id]` — Twin view
- `/roles` — List
- `/roles/[id]` — Role intelligence
- `/simulations` — Simulation results
- `/reports` — Reports
- `/trust` — Trust intelligence dashboard
- `/debates` — Recruiter debate viewer
- `/settings` — Authentication/settings
