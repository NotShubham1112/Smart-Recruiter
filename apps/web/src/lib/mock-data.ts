// ─── Candidate Types ───────────────────────────────────────

export interface MockCandidate {
  id: string;
  name: string;
  title: string;
  location: string;
  experience: string;
  helixScore: number;
  successProbability: number;
  trustScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  growthPotential: number;
  skills: string[];
  summary: string;
  dna: {
    technicalDepth: number;
    leadership: number;
    ownership: number;
    communication: number;
    adaptability: number;
    learningVelocity: number;
  };
  trust: {
    aiGeneratedProbability: number;
    anomalyScore: number;
    verifiedClaims: number;
    totalClaims: number;
    redFlags: string[];
  };
  experience_history: {
    company: string;
    title: string;
    period: string;
    description: string;
  }[];
  education: {
    institution: string;
    degree: string;
    year: string;
  }[];
}

export interface MockRole {
  id: string;
  title: string;
  department: string;
  seniorityLevel: string;
  experienceYears: number;
  requiredSkills: string[];
  preferredSkills: string[];
  candidateCount: number;
  topScore: number;
  urgency: 'High' | 'Medium' | 'Low';
}

export interface MockDebate {
  id: string;
  candidateName: string;
  candidateId: string;
  roleTitle: string;
  recommendation: 'strong_hire' | 'hire' | 'consider' | 'pass';
  confidenceScore: number;
  date: string;
  arguments: {
    agent: 'CTO' | 'Trust' | 'Growth';
    stance: 'support' | 'caution' | 'neutral';
    points: string[];
    counterpoints: string[];
    reasoning: string;
    confidence: number;
  }[];
  synthesis: string;
  counterfactuals: {
    scenario: string;
    impact: { cto: number; trust: number; growth: number };
    outcome: string;
  }[];
}

// ─── Candidates ────────────────────────────────────────────

export const mockCandidates: MockCandidate[] = [
  {
    id: '1',
    name: 'Alex Chen',
    title: 'Senior Full-Stack Engineer',
    location: 'San Francisco, CA',
    experience: '7 years',
    helixScore: 92,
    successProbability: 91,
    trustScore: 89,
    riskLevel: 'Low',
    growthPotential: 94,
    skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL', 'Python'],
    summary: '7 years of experience building scalable web applications. Led teams of 5+ engineers at two high-growth startups. Architected systems handling 10M+ daily requests.',
    dna: {
      technicalDepth: 91,
      leadership: 74,
      ownership: 87,
      communication: 80,
      adaptability: 92,
      learningVelocity: 94,
    },
    trust: {
      aiGeneratedProbability: 12,
      anomalyScore: 0.15,
      verifiedClaims: 11,
      totalClaims: 12,
      redFlags: [],
    },
    experience_history: [
      { company: 'TechCorp', title: 'Senior Engineer', period: '2021 - Present', description: 'Led migration to microservices architecture, reducing latency by 40%. Managed team of 6 engineers.' },
      { company: 'StartupX', title: 'Full-Stack Engineer', period: '2019 - 2021', description: 'Built core product from 0 to 1. Implemented real-time collaboration features serving 50K users.' },
      { company: 'DevAgency', title: 'Junior Developer', period: '2017 - 2019', description: 'Developed client projects across fintech and healthcare. Learned React, Node.js, and cloud deployment.' },
    ],
    education: [
      { institution: 'UC Berkeley', degree: 'B.S. Computer Science', year: '2017' },
    ],
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    title: 'AI/ML Engineer',
    location: 'New York, NY',
    experience: '5 years',
    helixScore: 89,
    successProbability: 87,
    trustScore: 85,
    riskLevel: 'Low',
    growthPotential: 91,
    skills: ['Python', 'PyTorch', 'TensorFlow', 'LangChain', 'FastAPI', 'AWS', 'Kubernetes'],
    summary: 'ML engineer specializing in NLP and recommendation systems. Published 3 papers on transformer architectures. Built production ML pipelines at scale.',
    dna: {
      technicalDepth: 95,
      leadership: 65,
      ownership: 82,
      communication: 75,
      adaptability: 88,
      learningVelocity: 96,
    },
    trust: {
      aiGeneratedProbability: 8,
      anomalyScore: 0.1,
      verifiedClaims: 14,
      totalClaims: 15,
      redFlags: [],
    },
    experience_history: [
      { company: 'AILab', title: 'ML Engineer', period: '2022 - Present', description: 'Built recommendation engine serving 1M+ users. Reduced inference latency by 60% through model optimization.' },
      { company: 'DataCo', title: 'Data Scientist', period: '2020 - 2022', description: 'Developed NLP models for document classification. Achieved 94% accuracy on production dataset.' },
      { company: 'ResearchLab', title: 'Research Intern', period: '2019 - 2020', description: 'Published 2 papers on attention mechanisms. Built prototype for zero-shot learning system.' },
    ],
    education: [
      { institution: 'MIT', degree: 'M.S. Computer Science (AI)', year: '2019' },
      { institution: 'MIT', degree: 'B.S. Computer Science', year: '2017' },
    ],
  },
  {
    id: '3',
    name: 'Marcus Williams',
    title: 'Backend Engineer',
    location: 'Austin, TX',
    experience: '6 years',
    helixScore: 85,
    successProbability: 83,
    trustScore: 91,
    riskLevel: 'Low',
    growthPotential: 82,
    skills: ['Go', 'Rust', 'PostgreSQL', 'Redis', 'Kubernetes', 'gRPC', 'Linux'],
    summary: 'Systems engineer focused on high-performance backend services. Expert in distributed systems and database optimization. Contributed to 3 open-source projects.',
    dna: {
      technicalDepth: 93,
      leadership: 60,
      ownership: 85,
      communication: 70,
      adaptability: 78,
      learningVelocity: 85,
    },
    trust: {
      aiGeneratedProbability: 5,
      anomalyScore: 0.08,
      verifiedClaims: 9,
      totalClaims: 10,
      redFlags: [],
    },
    experience_history: [
      { company: 'CloudInfra', title: 'Senior Backend Engineer', period: '2021 - Present', description: 'Designed distributed task queue processing 1M jobs/day. Reduced infrastructure costs by 35%.' },
      { company: 'FinTech Co', title: 'Backend Engineer', period: '2019 - 2021', description: 'Built payment processing system handling $100M+ annually. Implemented fraud detection pipeline.' },
      { company: 'OpenSource', title: 'Contributor', period: '2018 - Present', description: 'Core contributor to 3 Go libraries. 500+ GitHub stars across projects.' },
    ],
    education: [
      { institution: 'UT Austin', degree: 'B.S. Computer Engineering', year: '2018' },
    ],
  },
  {
    id: '4',
    name: 'Emily Zhang',
    title: 'Frontend Lead',
    location: 'Seattle, WA',
    experience: '8 years',
    helixScore: 78,
    successProbability: 76,
    trustScore: 72,
    riskLevel: 'Medium',
    growthPotential: 80,
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind', 'Figma', 'Storybook', 'Cypress'],
    summary: 'Frontend specialist with deep expertise in React ecosystem. Led design system adoption across 3 product teams. Strong eye for design and UX.',
    dna: {
      technicalDepth: 82,
      leadership: 78,
      ownership: 75,
      communication: 88,
      adaptability: 72,
      learningVelocity: 70,
    },
    trust: {
      aiGeneratedProbability: 35,
      anomalyScore: 0.4,
      verifiedClaims: 6,
      totalClaims: 14,
      redFlags: ['Resume contains AI-generated language patterns', 'Most claims cannot be independently verified'],
    },
    experience_history: [
      { company: 'DesignCo', title: 'Frontend Lead', period: '2020 - Present', description: 'Led team of 4 frontend engineers. Built component library used across 5 products.' },
      { company: 'WebAgency', title: 'Senior Frontend Developer', period: '2018 - 2020', description: 'Delivered 15+ client projects. Mentored junior developers on React best practices.' },
    ],
    education: [
      { institution: 'University of Washington', degree: 'B.S. Computer Science', year: '2016' },
    ],
  },
  {
    id: '5',
    name: 'James Rodriguez',
    title: 'DevOps Engineer',
    location: 'Denver, CO',
    experience: '5 years',
    helixScore: 88,
    successProbability: 86,
    trustScore: 93,
    riskLevel: 'Low',
    growthPotential: 85,
    skills: ['AWS', 'Terraform', 'Docker', 'Kubernetes', 'GitHub Actions', 'Python', 'Bash'],
    summary: 'DevOps specialist focused on CI/CD automation and cloud infrastructure. Reduced deployment time by 70% at previous company. AWS Solutions Architect certified.',
    dna: {
      technicalDepth: 88,
      leadership: 55,
      ownership: 90,
      communication: 72,
      adaptability: 85,
      learningVelocity: 82,
    },
    trust: {
      aiGeneratedProbability: 3,
      anomalyScore: 0.05,
      verifiedClaims: 10,
      totalClaims: 10,
      redFlags: [],
    },
    experience_history: [
      { company: 'CloudFirst', title: 'DevOps Engineer', period: '2022 - Present', description: 'Automated CI/CD pipeline reducing deployment time from 2 hours to 15 minutes. Managed 50+ Kubernetes clusters.' },
      { company: 'ScaleUp', title: 'Junior DevOps', period: '2020 - 2022', description: 'Implemented Infrastructure as Code with Terraform. Set up monitoring and alerting for 200+ services.' },
    ],
    education: [
      { institution: 'Colorado State', degree: 'B.S. Information Technology', year: '2020' },
    ],
  },
  {
    id: '6',
    name: 'Priya Patel',
    title: 'Product Manager',
    location: 'Chicago, IL',
    experience: '6 years',
    helixScore: 82,
    successProbability: 80,
    trustScore: 87,
    riskLevel: 'Low',
    growthPotential: 88,
    skills: ['Product Strategy', 'User Research', 'SQL', 'Figma', 'Jira', 'A/B Testing', 'Analytics'],
    summary: 'Product manager with background in data analytics. Launched 4 products from concept to market. Strong at translating user needs into technical requirements.',
    dna: {
      technicalDepth: 65,
      leadership: 82,
      ownership: 88,
      communication: 92,
      adaptability: 85,
      learningVelocity: 78,
    },
    trust: {
      aiGeneratedProbability: 10,
      anomalyScore: 0.12,
      verifiedClaims: 8,
      totalClaims: 9,
      redFlags: [],
    },
    experience_history: [
      { company: 'ProductCo', title: 'Senior PM', period: '2021 - Present', description: 'Launched 2 products generating $5M ARR. Reduced churn by 25% through user feedback loops.' },
      { company: 'Analytics Inc', title: 'Product Analyst', period: '2019 - 2021', description: 'Built analytics dashboard used by 500+ internal users. Identified $2M in cost savings through data analysis.' },
    ],
    education: [
      { institution: 'Northwestern', degree: 'M.S. Product Management', year: '2019' },
      { institution: 'UIUC', degree: 'B.S. Statistics', year: '2017' },
    ],
  },
  {
    id: '7',
    name: 'David Kim',
    title: 'Security Engineer',
    location: 'Remote',
    experience: '4 years',
    helixScore: 86,
    successProbability: 84,
    trustScore: 90,
    riskLevel: 'Low',
    growthPotential: 83,
    skills: ['Penetration Testing', 'Python', 'SIEM', 'AWS Security', 'OWASP', 'Go', 'Linux'],
    summary: 'Security engineer specializing in cloud security and application security. Found 15+ critical vulnerabilities in bug bounty programs. CISSP certified.',
    dna: {
      technicalDepth: 90,
      leadership: 50,
      ownership: 85,
      communication: 70,
      adaptability: 82,
      learningVelocity: 88,
    },
    trust: {
      aiGeneratedProbability: 6,
      anomalyScore: 0.09,
      verifiedClaims: 11,
      totalClaims: 12,
      redFlags: [],
    },
    experience_history: [
      { company: 'SecureNet', title: 'Security Engineer', period: '2022 - Present', description: 'Led security audit for SOC 2 compliance. Implemented automated vulnerability scanning pipeline.' },
      { company: 'CyberFirm', title: 'Junior Security Analyst', period: '2020 - 2022', description: 'Conducted 50+ penetration tests. Reduced mean time to detect threats by 40%.' },
    ],
    education: [
      { institution: 'Georgia Tech', degree: 'M.S. Cybersecurity', year: '2020' },
      { institution: 'Georgia Tech', degree: 'B.S. Computer Science', year: '2018' },
    ],
  },
  {
    id: '8',
    name: 'Lisa Thompson',
    title: 'Data Engineer',
    location: 'Boston, MA',
    experience: '5 years',
    helixScore: 84,
    successProbability: 82,
    trustScore: 88,
    riskLevel: 'Low',
    growthPotential: 86,
    skills: ['Python', 'Spark', 'Airflow', 'dbt', 'Snowflake', 'SQL', 'AWS'],
    summary: 'Data engineer building production data pipelines. Expert in modern data stack. Built systems processing 1TB+ daily.',
    dna: {
      technicalDepth: 87,
      leadership: 58,
      ownership: 83,
      communication: 75,
      adaptability: 80,
      learningVelocity: 84,
    },
    trust: {
      aiGeneratedProbability: 7,
      anomalyScore: 0.11,
      verifiedClaims: 10,
      totalClaims: 11,
      redFlags: [],
    },
    experience_history: [
      { company: 'DataFlow', title: 'Senior Data Engineer', period: '2022 - Present', description: 'Built real-time data pipeline processing 1TB+ daily. Reduced data latency from 4 hours to 15 minutes.' },
      { company: 'AnalyticsCo', title: 'Data Engineer', period: '2020 - 2022', description: 'Designed and maintained data warehouse serving 200+ analysts. Implemented data quality framework.' },
    ],
    education: [
      { institution: 'Boston University', degree: 'M.S. Data Science', year: '2020' },
      { institution: 'Boston University', degree: 'B.S. Computer Science', year: '2018' },
    ],
  },
];

// ─── Roles ─────────────────────────────────────────────────

export const mockRoles: MockRole[] = [
  {
    id: '1',
    title: 'Senior Full-Stack Engineer',
    department: 'Engineering',
    seniorityLevel: 'Senior',
    experienceYears: 5,
    requiredSkills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS'],
    preferredSkills: ['Docker', 'GraphQL', 'Next.js'],
    candidateCount: 12,
    topScore: 92,
    urgency: 'High',
  },
  {
    id: '2',
    title: 'AI/ML Engineer',
    department: 'AI',
    seniorityLevel: 'Senior',
    experienceYears: 3,
    requiredSkills: ['Python', 'PyTorch', 'ML Pipelines', 'SQL'],
    preferredSkills: ['LangChain', 'FastAPI', 'Kubernetes'],
    candidateCount: 8,
    topScore: 89,
    urgency: 'Medium',
  },
  {
    id: '3',
    title: 'Backend Engineer',
    department: 'Engineering',
    seniorityLevel: 'Mid',
    experienceYears: 3,
    requiredSkills: ['Go', 'PostgreSQL', 'REST APIs', 'Docker'],
    preferredSkills: ['Kubernetes', 'Redis', 'gRPC'],
    candidateCount: 15,
    topScore: 85,
    urgency: 'Low',
  },
  {
    id: '4',
    title: 'Frontend Lead',
    department: 'Engineering',
    seniorityLevel: 'Lead',
    experienceYears: 7,
    requiredSkills: ['React', 'TypeScript', 'Design Systems', 'Team Leadership'],
    preferredSkills: ['Next.js', 'Storybook', 'Cypress'],
    candidateCount: 6,
    topScore: 78,
    urgency: 'High',
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    department: 'Infrastructure',
    seniorityLevel: 'Mid',
    experienceYears: 3,
    requiredSkills: ['AWS', 'Terraform', 'Docker', 'CI/CD'],
    preferredSkills: ['Kubernetes', 'Python', 'Monitoring'],
    candidateCount: 10,
    topScore: 88,
    urgency: 'Medium',
  },
];

// ─── Debates ───────────────────────────────────────────────

export const mockDebates: MockDebate[] = [
  {
    id: '1',
    candidateName: 'Alex Chen',
    candidateId: '1',
    roleTitle: 'Senior Full-Stack Engineer',
    recommendation: 'strong_hire',
    confidenceScore: 87,
    date: '2026-06-18',
    arguments: [
      {
        agent: 'CTO',
        stance: 'support',
        points: ['Strong technical breadth: 8 relevant technologies', 'Demonstrated leadership as Senior Engineer', '3 positions showing career progression'],
        counterpoints: ['Limited enterprise architecture experience'],
        reasoning: 'Candidate demonstrates the technical foundation and leadership trajectory needed for this role.',
        confidence: 91,
      },
      {
        agent: 'Trust',
        stance: 'support',
        points: ['3 verifiable work experiences', 'Diverse skill set across 5 categories', 'All claims verifiable'],
        counterpoints: [],
        reasoning: 'Candidate profile appears authentic with reasonable claim density.',
        confidence: 85,
      },
      {
        agent: 'Growth',
        stance: 'support',
        points: ['Broad skill acquisition: 8 skills across 5 domains', 'Currently employed — career momentum', '3 roles showing career progression'],
        counterpoints: [],
        reasoning: 'Candidate shows strong potential for growth and skill development.',
        confidence: 88,
      },
    ],
    synthesis: 'Panel unanimously supports hiring Alex Chen for Senior Full-Stack Engineer. CTO highlights technical breadth and leadership, Trust confirms authenticity, and Growth sees strong trajectory.',
    counterfactuals: [
      { scenario: 'Alex had 2 more years of leadership experience', impact: { cto: 10, trust: 5, growth: 15 }, outcome: 'Would shift from consider to hire' },
      { scenario: 'Alex had modern framework experience (React/AWS)', impact: { cto: 20, trust: 0, growth: 10 }, outcome: 'Would be strong_hire recommendation' },
      { scenario: "Alex's claims were fully verified", impact: { cto: 0, trust: 20, growth: 5 }, outcome: 'Trust concern eliminated — classification upgrade likely' },
    ],
  },
  {
    id: '2',
    candidateName: 'Sarah Johnson',
    candidateId: '2',
    roleTitle: 'AI/ML Engineer',
    recommendation: 'hire',
    confidenceScore: 82,
    date: '2026-06-18',
    arguments: [
      {
        agent: 'CTO',
        stance: 'support',
        points: ['Exceptional technical depth in ML', 'Published researcher', 'Production ML pipeline experience'],
        counterpoints: ['Less experience with large-scale distributed systems'],
        reasoning: 'Sarah has the deep ML expertise this role requires. Her research background is a strong signal.',
        confidence: 88,
      },
      {
        agent: 'Trust',
        stance: 'support',
        points: ['5 verifiable experiences', 'Published papers are verifiable', 'MIT credentials confirmed'],
        counterpoints: [],
        reasoning: 'High trust profile. Academic credentials and publications provide strong verification signals.',
        confidence: 90,
      },
      {
        agent: 'Growth',
        stance: 'caution',
        points: ['Strong learning velocity: 96/100', 'Research mindset transfers well'],
        counterpoints: ['May need guidance on production engineering practices', 'Limited team leadership experience'],
        reasoning: 'Strong technical growth potential but may need mentorship on production engineering.',
        confidence: 72,
      },
    ],
    synthesis: 'Panel recommends hiring Sarah Johnson. CTO and Trust strongly support, while Growth notes she may need production engineering mentorship.',
    counterfactuals: [
      { scenario: 'Sarah had 2 more years of production ML experience', impact: { cto: 12, trust: 3, growth: 18 }, outcome: 'Would be strong_hire recommendation' },
      { scenario: 'Sarah had distributed systems experience', impact: { cto: 15, trust: 0, growth: 10 }, outcome: 'CTO confidence would increase significantly' },
    ],
  },
  {
    id: '3',
    candidateName: 'Emily Zhang',
    candidateId: '4',
    roleTitle: 'Frontend Lead',
    recommendation: 'consider',
    confidenceScore: 65,
    date: '2026-06-17',
    arguments: [
      {
        agent: 'CTO',
        stance: 'caution',
        points: ['Strong React ecosystem knowledge', 'Design system experience'],
        counterpoints: ['8 years but only 2 listed positions — gaps?', 'AI-generated language patterns detected'],
        reasoning: 'Technical skills match but experience claims need verification.',
        confidence: 62,
      },
      {
        agent: 'Trust',
        stance: 'caution',
        points: ['Only 6 of 14 claims verifiable'],
        counterpoints: ['AI-generated language patterns detected', 'Most claims cannot be independently verified', 'Anomaly score 0.4 — above threshold'],
        reasoning: 'Trust intelligence flags significant concerns about resume authenticity.',
        confidence: 45,
      },
      {
        agent: 'Growth',
        stance: 'neutral',
        points: ['Communication score: 88/100 — strongest dimension'],
        counterpoints: ['Learning velocity below average for seniority', 'Limited technical breadth growth'],
        reasoning: 'Strong communicator but growth trajectory unclear from available data.',
        confidence: 58,
      },
    ],
    synthesis: 'Panel has reservations about Emily Zhang. Trust agent raises significant concerns about resume authenticity. Recommend additional verification before proceeding.',
    counterfactuals: [
      { scenario: "Emily's claims were fully verified", impact: { cto: 15, trust: 25, growth: 10 }, outcome: 'Would shift from consider to hire' },
      { scenario: 'Emily had additional verifiable positions', impact: { cto: 10, trust: 20, growth: 5 }, outcome: 'Trust concern would be reduced' },
    ],
  },
  {
    id: '4',
    candidateName: 'James Rodriguez',
    candidateId: '5',
    roleTitle: 'DevOps Engineer',
    recommendation: 'strong_hire',
    confidenceScore: 91,
    date: '2026-06-17',
    arguments: [
      {
        agent: 'CTO',
        stance: 'support',
        points: ['Deep AWS expertise', 'Terraform and Kubernetes proficiency', 'CI/CD automation specialist'],
        counterpoints: [],
        reasoning: 'James has exactly the technical profile needed for this DevOps role.',
        confidence: 94,
      },
      {
        agent: 'Trust',
        stance: 'support',
        points: ['10/10 claims verifiable', 'AWS certification confirmed', 'Lowest anomaly score in pool'],
        counterpoints: [],
        reasoning: 'Highest trust profile among all candidates. Every claim is verifiable.',
        confidence: 95,
      },
      {
        agent: 'Growth',
        stance: 'support',
        points: ['Ownership score: 90/100 — highest in pool', 'Consistent career progression', 'Strong automation mindset'],
        counterpoints: [],
        reasoning: 'James shows exceptional ownership and a clear growth trajectory in DevOps.',
        confidence: 85,
      },
    ],
    synthesis: 'Panel unanimously recommends strong hire for James Rodriguez. Exceptional trust profile, strong technical fit, and clear growth trajectory.',
    counterfactuals: [
      { scenario: 'James had team leadership experience', impact: { cto: 8, trust: 2, growth: 12 }, outcome: 'Would be eligible for senior/lead track' },
    ],
  },
];

// ─── Dashboard Stats ───────────────────────────────────────

export const mockDashboardStats = {
  totalCandidates: 47,
  activeRoles: 5,
  trustVerified: 32,
  debatesCompleted: 28,
  candidatesTrend: '+12',
  rolesTrend: '+2',
  verifiedPercent: '68%',
  debatesTrend: '+8',
};

// ─── Score Helpers ─────────────────────────────────────────

export function getScoreColor(score: number): string {
  if (score >= 85) return 'text-green-500';
  if (score >= 75) return 'text-yellow-500';
  if (score >= 60) return 'text-orange-500';
  return 'text-red-500';
}

export function getScoreBg(score: number): string {
  if (score >= 85) return 'bg-green-500';
  if (score >= 75) return 'bg-yellow-500';
  if (score >= 60) return 'bg-orange-500';
  return 'bg-red-500';
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Exceptional';
  if (score >= 80) return 'Strong';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Fair';
  return 'Poor';
}

export function getRiskColor(risk: string): string {
  if (risk === 'Low') return 'text-green-500';
  if (risk === 'Medium') return 'text-yellow-500';
  return 'text-red-500';
}
