---
name: recruiter-debate
description: Run multi-agent debates to evaluate candidates from multiple perspectives
version: 1.0.0
---

# Recruiter Debate

## Goal
Simulate a structured debate between specialized AI recruiters to reach consensus on candidate quality.

## Context
Used by the Recruiter Agents MCP to run debates and generate consensus rankings.

## Input
- Candidate profile
- Role requirements
- Agent configurations

## Output
{
  "agents": [],
  "consensus": { "finalScore": 0, "recommendation": "" }
}

## Evaluation Criteria
- Each agent must produce evidence-based reasoning
- Consensus must weigh all perspectives fairly

## Edge Cases
- Strong disagreement: flag for human review
- Missing agent: proceed with available agents
