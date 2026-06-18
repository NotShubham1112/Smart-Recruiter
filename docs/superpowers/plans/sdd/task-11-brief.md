### Task 11: Skills Directory

Create 9 skill markdown files in `skills/` directory.

**1. skills/candidate-dna.skill.md:**
```md
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
```

**2. skills/role-dna.skill.md:**
```md
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
```

**3. skills/trust-intelligence.skill.md:**
```md
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
```

**4. skills/career-graph.skill.md:**
```md
---
name: career-graph
description: Build and query career knowledge graphs from candidate data
version: 1.0.0
---

# Career Graph Analysis

## Goal
Represent careers as graphs to discover hidden relationships and patterns.

## Context
Used by the Graph Intelligence MCP to build and query career knowledge graphs.

## Input
- Candidate work history
- Skills and technologies
- Project contributions

## Output
{
  "nodes": [],
  "edges": [],
  "insights": []
}

## Evaluation Criteria
- Graph density should reflect career complexity
- Edge weights should represent relationship strength

## Edge Cases
- Linear careers: simple graphs still provide insights
- Career changers: multiple domain clusters
```

**5. skills/success-simulation.skill.md:**
```md
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
```

**6. skills/counterfactual-analysis.skill.md:**
```md
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
```

**7. skills/recruiter-debate.skill.md:**
```md
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
```

**8. skills/hidden-talent.skill.md:**
```md
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
```

**9. skills/report-generation.skill.md:**
```md
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
```

**Commit:**
```bash
git add skills/
git commit -m "docs(skills): add AI skill definitions for all intelligence layers"
```
