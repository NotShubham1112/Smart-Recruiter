export interface CompanyProfile {
    id: string;
    name: string;
    description: string;
    industry: string;
    size: string;
    stage: string;
    location: string;
    cultureValues: string[];
    techStack: string[];
    website?: string;
    linkedInUrl?: string;
    glassdoorRating?: number;
    createdAt: string;
    updatedAt: string;
}
export interface CompanyDNA {
    companyId: string;
    innovationIndex: number;
    stabilityIndex: number;
    growthIndex: number;
    cultureProfile: Record<string, number>;
    technicalSophistication: number;
    managementStyle: Record<string, number>;
}
//# sourceMappingURL=company.d.ts.map