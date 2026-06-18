---
name: hidden-talent
description: Identify strong candidates that traditional ATS systems would miss
version: 1.0.0
---

# Hidden Talent Discovery

## Goal
Surface candidates who are strong fits but would be overlooked by keyword-based systems.

## Context
Post-processing step after candidate ranking to identify non-obvious matches.

## Input
- Ranked candidate list
- Role requirements
- Alternative career paths

## Output
{
  "hiddenGems": [],
  "alternativePaths": []
}

## Evaluation Criteria
- Discovered candidates must have genuine transferable skills
- Recommendations must include reasoning

## Edge Cases
- No hidden talent found: return empty results transparently
- Career changers: highlight transferable competencies
