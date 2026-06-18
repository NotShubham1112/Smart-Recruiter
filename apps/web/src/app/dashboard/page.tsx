import { HeroPrompt } from '@/components/dashboard/HeroPrompt';
import { WidgetGrid } from '@/components/dashboard/WidgetGrid';

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <HeroPrompt />
      <WidgetGrid />
    </div>
  );
}
