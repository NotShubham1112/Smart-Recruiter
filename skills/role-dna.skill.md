---
name: role-dna
description: Build structured role capability requirements from job descriptions
version: 1.0.0
---

# Role DNA Extraction

## Goal
Transform unstructured job descriptions into structured role capability requirements.

## Context
Used by the Role Intelligence MCP to create RoleDNA profiles from job postings.

## Input
- Job description text
- Company context
- Required qualifications
- Preferred qualifications

## Output
{
  "roleId": "string",
  "technicalDepth": 0-100,
  "ownership": 0-100,
  "adaptability": 0-100,
  "communication": 0-100,
  "leadership": 0-100,
  "requiredSkills": { "key": 0-100 }
}

## Evaluation Criteria
- Requirements must be inferred from both explicit and implicit signals
- Skill importance must be weighted by frequency and emphasis

## Edge Cases
- Vague job descriptions: use industry benchmarks
- Conflicting requirements: prioritize based on seniority level
