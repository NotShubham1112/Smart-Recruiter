# @helix/api

Thin API server for the Helix platform. Built with Fastify.

This API does NOT execute AI workloads directly. It enqueues analysis jobs to BullMQ for the orchestration engine to process.

## Development

```bash
pnpm dev
```

## Routes

- GET /api/health - Health check
- GET /api/candidates - List candidates
- POST /api/candidates - Create candidate
- GET /api/roles - List roles
- POST /api/roles - Create role
