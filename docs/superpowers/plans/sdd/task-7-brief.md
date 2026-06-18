### Task 7: apps/web — Next.js Frontend

Create all files under `apps/web/`. Create directories: `apps/web/src/app/dashboard/`, `apps/web/src/app/candidates/`, `apps/web/src/app/roles/`, `apps/web/src/app/simulations/`, `apps/web/src/app/reports/`, `apps/web/src/app/trust/`, `apps/web/src/app/debates/`, `apps/web/src/app/settings/`, `apps/web/src/providers/`, `apps/web/src/store/`, `apps/web/src/services/`, `apps/web/src/lib/`, `apps/web/src/styles/`

**package.json:**
```json
{
  "name": "@helix/web",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf .next dist"
  },
  "dependencies": {
    "@helix/ui": "workspace:*",
    "@helix/types": "workspace:*",
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "zustand": "^5.0.0",
    "@tanstack/react-query": "^5.64.0",
    "react-hook-form": "^7.54.0",
    "@hookform/resolvers": "^3.9.0",
    "zod": "^3.24.0",
    "recharts": "^2.15.0",
    "lucide-react": "^0.468.0",
    "socket.io-client": "^4.8.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0",
    "next-themes": "^0.4.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.7.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "postcss": "^8.4.0"
  }
}
```

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2024",
    "lib": ["ES2024", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "skipLibCheck": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**next.config.ts:**
```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@helix/ui', '@helix/types'],
};

export default nextConfig;
```

**tailwind.config.ts:**
```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
      },
      borderRadius: { lg: 'var(--radius)', md: 'calc(var(--radius) - 2px)', sm: 'calc(var(--radius) - 4px)' },
    },
  },
};

export default config;
```

**postcss.config.mjs:**
```mjs
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
```

**components.json:**
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/styles/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

**src/styles/globals.css:**
```css
@import "tailwindcss";

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    border-color: hsl(var(--border));
  }
  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
  }
}
```

**src/lib/utils.ts:**
```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

**src/app/layout.tsx:**
```tsx
import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Providers } from '@/providers';

export const metadata: Metadata = {
  title: 'Helix - AI Recruitment Intelligence',
  description: 'AI-native candidate intelligence and hiring prediction platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

**src/app/page.tsx:**
```tsx
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/dashboard');
}
```

**src/app/dashboard/page.tsx:**
```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@helix/ui';

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Active candidates</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Open positions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Simulations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Completed this week</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

**Page stubs — create each with title + Card layout:**

`src/app/candidates/page.tsx`:
```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@helix/ui';

export default function CandidatesPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Candidate Explorer</h1>
      <Card>
        <CardHeader><CardTitle>All Candidates</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground">Candidate list and search will appear here.</p></CardContent>
      </Card>
    </div>
  );
}
```

`src/app/roles/page.tsx`:
```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@helix/ui';

export default function RolesPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Role Intelligence</h1>
      <Card>
        <CardHeader><CardTitle>All Roles</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground">Role list and analysis will appear here.</p></CardContent>
      </Card>
    </div>
  );
}
```

`src/app/simulations/page.tsx`:
```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@helix/ui';

export default function SimulationsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Simulation Results</h1>
      <Card>
        <CardHeader><CardTitle>Success Simulations</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground">Candidate success predictions will appear here.</p></CardContent>
      </Card>
    </div>
  );
}
```

`src/app/reports/page.tsx`:
```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@helix/ui';

export default function ReportsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Reports</h1>
      <Card>
        <CardHeader><CardTitle>Generated Reports</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground">Candidate reports will appear here.</p></CardContent>
      </Card>
    </div>
  );
}
```

`src/app/trust/page.tsx`:
```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@helix/ui';

export default function TrustPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Trust Intelligence</h1>
      <Card>
        <CardHeader><CardTitle>Trust Analysis</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground">Trust scores and fraud detection will appear here.</p></CardContent>
      </Card>
    </div>
  );
}
```

`src/app/debates/page.tsx`:
```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@helix/ui';

export default function DebatesPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Recruiter Debates</h1>
      <Card>
        <CardHeader><CardTitle>Agent Debate Results</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground">Multi-agent debate results will appear here.</p></CardContent>
      </Card>
    </div>
  );
}
```

`src/app/settings/page.tsx`:
```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@helix/ui';

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <Card>
        <CardHeader><CardTitle>Configuration</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground">Application settings will appear here.</p></CardContent>
      </Card>
    </div>
  );
}
```

**src/providers/index.tsx:**
```tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 1000 * 60 * 5, retry: 2 },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
```

**src/store/index.ts:**
```ts
import { create } from 'zustand';

interface AppState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  theme: 'system',
  setTheme: (theme) => set({ theme }),
}));

interface CandidateStore {
  selectedCandidateId: string | null;
  setSelectedCandidate: (id: string | null) => void;
}

export const useCandidateStore = create<CandidateStore>((set) => ({
  selectedCandidateId: null,
  setSelectedCandidate: (id) => set({ selectedCandidateId: id }),
}));
```

**src/services/api.ts:**
```ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
```

**.env.example:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

**README.md:**
```md
# @helix/web

Next.js 16 frontend for the Helix platform.

## Development

```bash
pnpm dev
```

## Pages

- /dashboard - Main dashboard
- /candidates - Candidate explorer
- /roles - Role intelligence
- /simulations - Simulation results
- /reports - Generated reports
- /trust - Trust intelligence
- /debates - Recruiter debates
- /settings - Configuration
```
