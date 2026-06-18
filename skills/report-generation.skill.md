---
name: report-generation
description: Generate comprehensive candidate evaluation reports
version: 1.0.0
---

# Report Generation

## Goal
Produce clear, actionable candidate evaluation reports for recruiters.

## Context
Final aggregation step that combines all intelligence layers into a readable report.

## Input
- Candidate Twin
- Role DNA
- Simulation results
- Debate results
- Trust analysis

## Output
{
  "helixScore": 0-100,
  "summary": "",
  "strengths": [],
  "risks": [],
  "recommendations": []
}

## Evaluation Criteria
- Reports must be scannable in under 30 seconds
- Every score must include a plain-English explanation

## Edge Cases
- Conflicting signals: present both sides fairly
- Insufficient data: clearly communicate uncertainty
