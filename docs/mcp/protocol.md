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
