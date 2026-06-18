'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Mic, ArrowRight, Briefcase, Users, BarChart3, FileText } from 'lucide-react';

const quickActions = [
  { icon: Briefcase, label: 'Analyze Role' },
  { icon: Users, label: 'Import Candidates' },
  { icon: BarChart3, label: 'Run Simulation' },
  { icon: FileText, label: 'Generate Report' },
];

export function HeroPrompt() {
  const [input, setInput] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col items-center py-16 px-4"
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] bg-info/5 rounded-full blur-3xl" />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-muted-foreground text-sm mb-6"
      >
        Welcome back, Recruiter
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="w-full max-w-2xl"
      >
        <div className="relative bg-card border border-border rounded-2xl shadow-2xl overflow-hidden focus-within:border-info/50 transition-colors">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Upload a job description or ask Helix to find exceptional candidates."
            rows={3}
            className="w-full bg-transparent text-foreground text-lg px-6 py-5 outline-none resize-none placeholder:text-muted-foreground"
          />
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <div className="flex items-center gap-2">
              <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition-colors">
                <Upload className="w-5 h-5" />
              </button>
              <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition-colors">
                <Mic className="w-5 h-5" />
              </button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-info text-white rounded-lg text-sm font-medium hover:bg-info/90 transition-colors">
              <span>Analyze</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap items-center justify-center gap-3 mt-6"
      >
        {quickActions.map((action) => (
          <button
            key={action.label}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-full text-sm text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors"
          >
            <action.icon className="w-4 h-4" />
            <span>{action.label}</span>
          </button>
        ))}
      </motion.div>
    </motion.div>
  );
}
