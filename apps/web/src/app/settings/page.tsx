'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@helix/ui';
import { useTheme } from 'next-themes';
import { Check, X, Sun, Moon, Monitor } from 'lucide-react';
import { useState, useEffect } from 'react';

const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
const hasGroq = !!process.env.GROQ_API_KEY;
const qdrantUrl = process.env.NEXT_PUBLIC_QDRANT_URL || 'Not configured';

const themes = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
] as const;

const section = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

function StatusIndicator({ ok }: { ok: boolean }) {
  return (
    <span className={`inline-block h-2.5 w-2.5 rounded-full ${ok ? 'bg-green-500' : 'bg-red-500'}`} />
  );
}

function MaskedKey({ present, last4 }: { present: boolean; last4?: string }) {
  if (!present) return <span className="text-muted-foreground">Not set</span>;
  return (
    <span className="font-mono text-sm">
      {'••••••••'}
      {last4 && <span className="text-foreground">{last4}</span>}
    </span>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Settings</h1>
        <p className="text-sm text-muted-foreground">Configure your Helix AI workspace</p>
      </div>

      <motion.div
        variants={section}
        initial="hidden"
        animate="show"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">API Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusIndicator ok={hasSupabase} />
                <span className="text-sm text-foreground">Supabase</span>
              </div>
              <span className="text-xs text-muted-foreground">{hasSupabase ? 'Connected' : 'Not configured'}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusIndicator ok={hasGroq} />
                <span className="text-sm text-foreground">Groq API Key</span>
              </div>
              <MaskedKey present={hasGroq} last4={hasGroq ? 'a3f9' : undefined} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusIndicator ok={qdrantUrl !== 'Not configured'} />
                <span className="text-sm text-foreground">Qdrant URL</span>
              </div>
              <span className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">{qdrantUrl}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={section}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Theme</span>
              {mounted ? (
                <div className="flex rounded-lg border border-border overflow-hidden">
                  {themes.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setTheme(value)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                        theme === value
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="h-8 w-40 rounded-lg bg-muted animate-pulse" />
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={section}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Version</span>
              <span className="text-xs font-mono text-muted-foreground">1.0.0-beta</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Build</span>
              <span className="text-xs text-muted-foreground text-right max-w-[240px]">Helix AI Recruitment Intelligence Platform</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Tech Stack</span>
              <div className="flex flex-wrap justify-end gap-1.5 max-w-[260px]">
                {['Next.js', 'Supabase', 'Groq AI', 'Qdrant'].map((t) => (
                  <span key={t} className="inline-block rounded-md bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => alert('Demo data reset (mock — not implemented)')}
              >
                Reset Demo Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
