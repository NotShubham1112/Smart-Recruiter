---
name: counterfactual-analysis
description: Determine what changes would most improve a candidate's ranking
version: 1.0.0
---

# Counterfactual Analysis

## Goal
Identify which changes to a candidate's profile would most improve their success probability.

## Context
Used by the Simulation Engine MCP to generate actionable improvement suggestions.

## Input
- Current candidate profile
- Target role requirements
- Current success score

## Output
{
  "scenarios": [
    { "change": "", "currentScore": 0, "projectedScore": 0, "delta": 0 }
  ]
}

## Evaluation Criteria
- Suggestions must be realistic and actionable
- Delta must be meaningful (> 2% improvement)

## Edge Cases
- Already optimal candidates: suggest maintenance actions
- Insufficient data: return fewer, higher-confidence scenarios
