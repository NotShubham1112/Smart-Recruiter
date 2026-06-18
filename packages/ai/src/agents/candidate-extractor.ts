import type {
  CandidateProfile,
  WorkExperience,
  Education,
  Skill,
  SkillCategory,
  Certification,
  Project,
  CandidateDNA,
} from '@helix/types';

const LANGUAGE_KEYWORDS = new Set([
  'javascript', 'typescript', 'python', 'java', 'c#', 'c++', 'csharp',
  'go', 'golang', 'rust', 'swift', 'kotlin', 'ruby', 'php', 'scala',
  'elixir', 'clojure', 'dart', 'lua', 'perl', 'haskell', 'sql', 'bash',
  'shell', 'html', 'css', 'sass', 'less', 'graphql',
]);

const FRAMEWORK_KEYWORDS = new Set([
  'react', 'angular', 'vue', 'svelte', 'next.js', 'nuxt', 'express',
  'django', 'flask', 'spring', 'rails', 'laravel', 'asp.net', 'node.js',
  'deno', 'tailwind', 'bootstrap', 'jquery', 'redux', 'apollo', 'prisma',
  'typeorm', 'sequelize', 'mongoose', 'hibernate', 'mybatis', 'fastapi',
  'nestjs', 'remix', 'gatsby', 'nx', 'turborepo', 'shadcn',
]);

const DATABASE_KEYWORDS = new Set([
  'postgresql', 'postgres', 'mysql', 'sqlite', 'mongodb', 'redis',
  'elasticsearch', 'cassandra', 'dynamodb', 'mariadb', 'oracle', 'sql server',
  'mssql', 'firebase', 'supabase', 'couchdb', 'neo4j', 'influxdb', 'cosmosdb',
  'bigquery', 'redshift', 'snowflake', 'databricks',
]);

const CLOUD_KEYWORDS = new Set([
  'aws', 'azure', 'gcp', 'google cloud', 'amazon web services', 'cloud',
  'docker', 'kubernetes', 'k8s', 'terraform', 'ansible', 'jenkins',
  'github actions', 'gitlab ci', 'circleci', 'serverless', 'lambda', 'ec2',
  's3', 'cloudfront', 'route53', 'cloudflare', 'heroku', 'vercel', 'netlify',
]);

const TOOL_KEYWORDS = new Set([
  'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence', 'vscode',
  'webstorm', 'intellij', 'vim', 'npm', 'yarn', 'pnpm', 'webpack', 'vite',
  'rollup', 'esbuild', 'babel', 'eslint', 'prettier', 'jest', 'mocha',
  'cypress', 'playwright', 'selenium', 'puppeteer', 'postman', 'swagger',
  'figma', 'sketch', 'adobe', 'datadog', 'grafana', 'prometheus', 'sentry',
]);

const DOMAIN_KEYWORDS = new Set([
  'machine learning', 'deep learning', 'nlp', 'computer vision', 'data science',
  'data engineering', 'devops', 'security', 'blockchain', 'iot', 'embedded',
  'mobile', 'web', 'api', 'microservices', 'distributed systems',
  'system design', 'architecture', 'agile', 'scrum', 'kanban', 'ci/cd',
  'mlops', 'llm', 'generative ai', 'artificial intelligence',
]);

const LEADERSHIP_TITLES = new Set([
  'lead', 'senior', 'staff', 'principal', 'architect', 'manager',
  'director', 'head', 'chief', 'vp', 'vice president', 'cto', 'ceo',
  'founder', 'co-founder', 'team lead', 'tech lead', 'lead engineer',
]);

const SECTION_HEADERS: [RegExp, string][] = [
  [/^summary$/im, 'summary'],
  [/^about$/im, 'summary'],
  [/^profile$/im, 'summary'],
  [/^professional\s+summary$/im, 'summary'],
  [/^(?:work\s*)?experience$/im, 'experience'],
  [/^work\s*history$/im, 'experience'],
  [/^employment$/im, 'experience'],
  [/^professional\s+experience$/im, 'experience'],
  [/^education$/im, 'education'],
  [/^academics?$/im, 'education'],
  [/^skills$/im, 'skills'],
  [/^technologies$/im, 'skills'],
  [/^competencies$/im, 'skills'],
  [/^technical\s+skills$/im, 'skills'],
  [/^certifications?$/im, 'certifications'],
  [/^projects?$/im, 'projects'],
];

function extractEmail(text: string): string {
  const match = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  return match?.[0] ?? '';
}

function extractPhone(text: string): string {
  const match = text.match(/[\+]?[\d\(\)\-\s]{7,20}/);
  return match?.[0]?.trim() ?? '';
}

function extractName(lines: string[]): string {
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('http') && !trimmed.includes('@')) {
      return trimmed;
    }
  }
  return '';
}

function splitIntoSections(text: string): Map<string, string> {
  const sections = new Map<string, string>();
  const lines = text.split('\n');

  let currentSection = 'header';
  let currentContent: string[] = [];

  for (const line of lines) {
    const matched = SECTION_HEADERS.find(([re]) => re.test(line));
    if (matched) {
      if (currentContent.length > 0) {
        sections.set(currentSection, currentContent.join('\n').trim());
      }
      currentSection = matched[1];
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  if (currentContent.length > 0) {
    sections.set(currentSection, currentContent.join('\n').trim());
  }

  return sections;
}

function extractSummary(sections: Map<string, string>): string | undefined {
  const content = sections.get('summary');
  return content?.trim() || undefined;
}

function extractExperience(sections: Map<string, string>): WorkExperience[] {
  const content = sections.get('experience');
  if (!content) return [];

  const lines = content.split('\n').map((l) => l.trim()).filter(Boolean);
  const experiences: WorkExperience[] = [];
  let currentExp: Partial<WorkExperience> | null = null;
  let descLines: string[] = [];
  let idCounter = 0;

  for (const line of lines) {
    const roleMatch = line.match(/(.+?)\s+(?:at|@|-)\s+(.+?)$/);
    if (roleMatch) {
      if (currentExp) {
        currentExp.description = descLines.join(' ');
        experiences.push({
          ...(currentExp as WorkExperience),
          id: `exp-${idCounter++}`,
          highlights: [],
          technologies: [],
        });
        descLines = [];
      }
      const title = roleMatch[1]?.trim() ?? '';
      const company = roleMatch[2]?.trim() ?? '';
      currentExp = { title, company };
    } else if (currentExp) {
      descLines.push(line);
    }
  }

  if (currentExp) {
    currentExp.description = descLines.join(' ');
    experiences.push({
      ...(currentExp as WorkExperience),
      id: `exp-${idCounter++}`,
      highlights: [],
      technologies: [],
    });
  }

  return experiences;
}

function extractEducation(sections: Map<string, string>): Education[] {
  const content = sections.get('education');
  if (!content) return [];

  const degreePattern = /(Bachelor|Master|PhD|Ph\.D\.|B\.|M\.|BSc|MS|BA|MA|B\.S\.|M\.S\.|B\.A\.|M\.A\.|Associate|Doctorate|MBA)/i;
  const lines = content.split('\n').map((l) => l.trim()).filter(Boolean);
  const educationEntries: Education[] = [];
  let idCounter = 0;

  let current: Partial<Education> | null = null;

  for (const line of lines) {
    if (degreePattern.test(line)) {
      if (current) {
        educationEntries.push({
          ...(current as Education),
          id: `edu-${idCounter++}`,
        });
      }
      current = {
        degree: line,
      };
      const institutionMatch = line.match(/at\s+(.+?)$|[-–]\s+(.+?)$/);
      if (institutionMatch) {
        current.institution = (institutionMatch[1] ?? institutionMatch[2] ?? '').trim();
        current.degree = line.replace(/at\s+(.+?)$|[-–]\s+(.+?)$/, '').trim();
      }
    } else if (current && !current.institution && line.length > 2) {
      current.institution = line;
    }
  }

  if (current) {
    educationEntries.push({
      ...(current as Education),
      id: `edu-${idCounter++}`,
    });
  }

  return educationEntries.map((e) => ({
    ...e,
    institution: e.institution || 'Unknown Institution',
    field: e.field || '',
    startDate: '',
    endDate: undefined,
  }));
}

function categorizeSkill(name: string): SkillCategory {
  const lower = name.toLowerCase();
  if (LANGUAGE_KEYWORDS.has(lower)) return 'language';
  if (FRAMEWORK_KEYWORDS.has(lower)) return 'framework';
  if (DATABASE_KEYWORDS.has(lower)) return 'database';
  if (CLOUD_KEYWORDS.has(lower)) return 'cloud';
  if (TOOL_KEYWORDS.has(lower)) return 'tool';
  if (DOMAIN_KEYWORDS.has(lower)) return 'domain';
  return 'tool';
}

function extractSkills(sections: Map<string, string>): Skill[] {
  const content = sections.get('skills');
  if (!content) return [];

  const skillNames = content.split(/[,|•\-\/\n]+/).map((s) => s.trim()).filter(Boolean);
  const seen = new Set<string>();

  return skillNames
    .filter((name) => {
      const lower = name.toLowerCase();
      if (seen.has(lower)) return false;
      seen.add(lower);
      return true;
    })
    .map((name) => ({
      name,
      category: categorizeSkill(name),
    }));
}

function extractProjects(sections: Map<string, string>): Project[] {
  const content = sections.get('projects');
  if (!content) return [];
  return [];
}

function extractCertifications(_sections: Map<string, string>): Certification[] {
  return [];
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function extractCandidateProfile(text: string): CandidateProfile {
  const sections = splitIntoSections(text);
  const lines = text.split('\n');

  const profile: CandidateProfile = {
    id: crypto.randomUUID(),
    fullName: extractName(lines),
    email: extractEmail(text),
    phone: extractPhone(text),
    summary: extractSummary(sections),
    experience: extractExperience(sections),
    education: extractEducation(sections),
    skills: extractSkills(sections),
    certifications: extractCertifications(sections),
    projects: extractProjects(sections),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return profile;
}

export function inferCapabilityDNA(profile: CandidateProfile): CandidateDNA {
  const { experience, skills, projects, summary } = profile;

  const expCount = experience.length;
  const skillCount = skills.length;
  const projectCount = projects.length;

  const techSkills = skills.filter(
    (s) => s.category === 'language' || s.category === 'framework' || s.category === 'database' || s.category === 'cloud',
  );
  const techSkillCount = techSkills.length;

  const categories = new Set(skills.map((s) => s.category));
  const uniqueCategories = categories.size;

  const companies = new Set(experience.map((e) => e.company));
  const uniqueCompanyCount = companies.size;

  const leadTitleCount = experience.filter((e) => {
    const words = e.title.toLowerCase().split(/\s+/);
    return words.some((w) => LEADERSHIP_TITLES.has(w));
  }).length;

  const hasLeadershipTitle = leadTitleCount > 0;
  const summaryLen = summary?.length ?? 0;

  const technicalDepth = clamp(skillCount * 5 + techSkillCount * 3 + expCount * 8, 0, 100);
  const learningVelocity = clamp(skillCount * 4 + uniqueCategories * 10, 0, 100);
  const ownership = clamp((hasLeadershipTitle ? 30 : 0) + projectCount * 10 + expCount * 5, 0, 100);
  const adaptability = clamp(uniqueCategories * 12 + uniqueCompanyCount * 10, 0, 100);
  const leadership = clamp(leadTitleCount * 20 + (expCount > 5 ? 10 : 0), 0, 100);
  const communication = clamp(Math.min(summaryLen / 10, 50) + expCount * 5, 0, 100);

  return {
    candidateId: profile.id,
    technicalDepth,
    learningVelocity,
    ownership,
    adaptability,
    communication,
    leadership,
    domainExpertise: {},
    skillProficiencies: {},
    confidenceScore: 75,
  };
}
