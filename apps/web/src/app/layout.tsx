import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Providers } from '@/providers';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'Helix - AI Recruitment Intelligence',
  description: 'AI-native candidate intelligence and hiring prediction platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
