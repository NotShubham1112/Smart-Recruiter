---
name: candidate-dna
description: Extract structured capability profile from candidate data
version: 1.0.0
---

# Candidate DNA Extraction

## Goal
Build a structured candidate capability profile from raw resume and portfolio data.

## Context
Used by the Candidate Intelligence MCP to transform unstructured candidate data into the CandidateDNA type.

## Input
- Raw resume text
- Project portfolio
- GitHub activity data
- Skill list

## Output
{
  "candidateId": "string",
  "technicalDepth": 0-100,
  "ownership": 0-100,
  "learningVelocity": 0-100,
  "adaptability": 0-100,
  "communication": 0-100,
  "leadership": 0-100,
  "domainExpertise": { "key": 0-100 },
  "skillProficiencies": { "key": 0-100 },
  "confidenceScore": 0-100
}

## Evaluation Criteria
- Scores should be evidence-based, not guesswork
- Confidence score reflects data quality and quantity
- Domain expertise must be justified by specific experience

## Edge Cases
- Minimal data: return low confidence, neutral scores
- Contradictory data: flag for trust analysis
- Overstated skills: calibrate based on evidence depth
