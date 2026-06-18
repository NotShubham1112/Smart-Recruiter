'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useCommandCenter } from '@/hooks/useCommandCenter';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState(240);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        useCommandCenter.getState().toggle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar onCollapse={(collapsed) => setSidebarWidth(collapsed ? 64 : 240)} />
      <div
        className="transition-all duration-200"
        style={{ marginLeft: sidebarWidth }}
      >
        <TopBar />
        <main className="min-h-[calc(100vh-56px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
