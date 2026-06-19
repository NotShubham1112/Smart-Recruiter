'use client';

import { HeroPrompt } from '@/components/dashboard/HeroPrompt';
import { WidgetGrid } from '@/components/dashboard/WidgetGrid';
import { useCandidates } from '@/hooks/useCandidates';
import { useDebates } from '@/hooks/useDebates';
import { useRoles } from '@/hooks/useRoles';

export default function DashboardPage() {
  const { data: candidates } = useCandidates();
  const { data: debates } = useDebates();
  const { data: roles } = useRoles();

  const stats = {
    totalCandidates: candidates?.length || 0,
    activeRoles: roles?.length || 0,
    trustVerified: (candidates || []).filter((c) => c.trust && c.trust.trust_score >= 70).length,
    debatesCompleted: debates?.length || 0,
  };

  return (
    <div className="min-h-screen">
      <HeroPrompt />
      <WidgetGrid stats={stats} />
    </div>
  );
}
