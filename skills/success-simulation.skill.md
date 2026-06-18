---
name: success-simulation
description: Predict candidate success probability for a given role
version: 1.0.0
---

# Success Simulation

## Goal
Predict the probability of candidate success in a specific role and company.

## Context
Used by the Simulation Engine MCP to run success predictions.

## Input
- Candidate Twin
- Role DNA
- Company DNA

## Output
{
  "successProbability": 0-100,
  "technicalFit": 0-100,
  "teamFit": 0-100,
  "growthPotential": 0-100,
  "retentionProbability": 0-100,
  "failureRisk": 0-100
}

## Evaluation Criteria
- Predictions must be calibrated against historical outcomes
- Confidence intervals must reflect data quality

## Edge Cases
- Missing company data: use industry averages
- Novel roles: base predictions on transferable skills
