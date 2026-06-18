### Task 13: CI/CD and Documentation

**Create `.github/workflows/ci.yml`:**
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
```

**Create `.github/workflows/docker.yml`:**
```yaml
name: Docker Build

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build API
        run: docker build -f infrastructure/docker/Dockerfile.api -t helix-api .
      - name: Build Web
        run: docker build -f infrastructure/docker/Dockerfile.web -t helix-web .
      - name: Build Orchestrator
        run: docker build -f infrastructure/docker/Dockerfile.orchestrator -t helix-orchestrator .
```

**Create `docs/architecture/overview.md`:**
```md
# Helix Architecture Overview

Helix is an AI-native recruitment intelligence platform built on a microservices architecture.

## Architecture Diagram

```
Web (Next.js 16)
    ↓
API (Fastify — thin, no AI)
    ↓
BullMQ Queue
    ↓
Orchestration Engine (LangGraph)
    ↓
MCP Services
    ↓
Databases (PostgreSQL, Neo4j, Qdrant, Redis)
```

## Key Principles

- **AI Isolation:** All AI workloads execute in the orchestration engine, not in API routes
- **Event-Driven:** Communication happens through BullMQ queues
- **Domain-Driven Design:** Each MCP service owns a bounded context
- **Explainability:** Every score includes reasoning

## Components

- **apps/web** — Next.js 16 frontend with shadcn/ui
- **apps/api** — Fastify API server (thin layer)
- **packages/** — Shared types, schemas, UI, AI SDK
- **services/*-mcp** — MCP protocol services for each intelligence domain
- **services/orchestration-engine** — LangGraph workflow orchestration
```

**Create `docs/api/endpoints.md`:**
```md
# API Endpoints

## Health

- `GET /api/health` — Basic health check
- `GET /api/health/ready` — Readiness probe

## Candidates

- `GET /api/candidates` — List candidates
- `GET /api/candidates/:id` — Get candidate detail
- `POST /api/candidates` — Create candidate

## Roles

- `GET /api/roles` — List roles
- `GET /api/roles/:id` — Get role detail
- `POST /api/roles` — Create role
```

**Create `docs/mcp/protocol.md`:**
```md
# MCP Protocol

MCP (Model Context Protocol) services expose AI capabilities as tools over HTTP.

## Request Format

```json
{
  "id": "uuid",
  "tool": "tool_name",
  "params": { ... }
}
```

## Response Format

```json
{
  "id": "uuid",
  "result": { ... },
  "error": null,
  "metadata": {
    "timestamp": "2026-01-01T00:00:00Z",
    "durationMs": 150
  }
}
```

## MCP Services

| Service | Port | Tool Examples |
|---------|------|---------------|
| Candidate Intelligence | 4101 | parse_resume, build_candidate_dna |
| Trust Intelligence | 4102 | calculate_trust_score, verify_claims |
| Role Intelligence | 4103 | parse_job_description, build_role_dna |
| Graph Intelligence | 4104 | build_career_graph, query_graph |
| Simulation Engine | 4105 | simulate_candidate_success, counterfactual_analysis |
| Recruiter Agents | 4106 | run_debate, generate_consensus |
```

**Commit:**
```bash
git add .github/ docs/
git commit -m "ci: add GitHub Actions workflows and documentation stubs"
```
