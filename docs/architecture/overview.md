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
