'use client';

import { usePathname } from 'next/navigation';
import { Search, Bell, User } from 'lucide-react';
import { useCommandCenter } from '@/hooks/useCommandCenter';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/candidates': 'Candidate Explorer',
  '/roles': 'Role Intelligence',
  '/trust': 'Trust Intelligence',
  '/debates': 'Agent Debates',
  '/simulations': 'Simulations',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

export function TopBar() {
  const pathname = usePathname();
  const { open } = useCommandCenter();
  const title = pageTitles[pathname] || 'Helix';

  return (
    <header className="sticky top-0 z-30 h-14 bg-background/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>

      <div className="flex items-center gap-3">
        {/* Search trigger */}
        <button
          onClick={open}
          className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors"
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
          <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-[10px]">⌘K</kbd>
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
        </button>

        {/* Avatar */}
        <button className="w-8 h-8 rounded-full bg-info/20 flex items-center justify-center text-info hover:bg-info/30 transition-colors">
          <User className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
