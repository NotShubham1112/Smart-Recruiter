---
name: trust-intelligence
description: Evaluate candidate claim verifiability and detect fraudulent profiles
version: 1.0.0
---

# Trust Intelligence

## Goal
Measure confidence that candidate claims are supported by evidence.

## Context
Used by the Trust Intelligence MCP to calculate trust scores and detect fraud.

## Input
- Resume text
- Work experience history
- GitHub activity
- Project details

## Output
{
  "trustScore": 0-100,
  "fraudRisk": "LOW|MEDIUM|HIGH|CRITICAL",
  "flags": []
}

## Evaluation Criteria
- Consistency across multiple data sources
- Specificity of claims
- Career progression logic

## Edge Cases
- Sparse profiles: lower confidence, not automatic fraud
- AI-generated resumes: detect patterns, not punish
