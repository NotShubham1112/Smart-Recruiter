import type { TrustScore } from './trust';
import type { CareerGraphNode } from './graph';
export interface CandidateProfile {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    title?: string;
    summary?: string;
    experience: WorkExperience[];
    education: Education[];
    skills: Skill[];
    certifications: Certification[];
    projects: Project[];
    githubUrl?: string;
    portfolioUrl?: string;
    linkedInUrl?: string;
    createdAt: string;
    updatedAt: string;
}
export interface WorkExperience {
    id: string;
    company: string;
    title: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string;
    highlights: string[];
    technologies: string[];
}
export interface Education {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
    gpa?: number;
}
export interface Skill {
    name: string;
    category: SkillCategory;
    proficiency?: number;
    yearsOfExperience?: number;
}
export type SkillCategory = 'language' | 'framework' | 'database' | 'cloud' | 'tool' | 'soft' | 'domain';
export interface Certification {
    name: string;
    issuer: string;
    date: string;
    url?: string;
}
export interface Project {
    id: string;
    name: string;
    description: string;
    url?: string;
    technologies: string[];
    role?: string;
    highlights: string[];
}
export interface CandidateDNA {
    candidateId: string;
    technicalDepth: number;
    ownership: number;
    learningVelocity: number;
    adaptability: number;
    communication: number;
    leadership: number;
    domainExpertise: Record<string, number>;
    skillProficiencies: Record<string, number>;
    confidenceScore: number;
}
export interface CandidateTwin {
    candidateId: string;
    capabilityDNA: CandidateDNA;
    trustDNA: TrustScore;
    behavioralDNA: Record<string, number>;
    growthDNA: GrowthProfile;
    graphProfile: CareerGraphNode;
    confidenceScore: number;
}
export interface GrowthProfile {
    growthVelocity: number;
    careerTrajectory: CareerStage[];
    predictedNextRole?: string;
    learningRate: number;
    adaptabilityScore: number;
}
export interface CareerStage {
    role: string;
    company: string;
    startDate: string;
    endDate?: string;
    level: string;
    skillsGained: string[];
}
//# sourceMappingURL=candidate.d.ts.map