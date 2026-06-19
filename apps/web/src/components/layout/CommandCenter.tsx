'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Briefcase, Users, GitCompare, BarChart3, FileText, ArrowRight } from 'lucide-react';
import { useCommandCenter } from '@/hooks/useCommandCenter';

const actions = [
  { icon: Briefcase, label: 'Analyze a role', description: 'Parse a job description into Role DNA' },
  { icon: Users, label: 'Find candidates', description: 'Search and filter candidates' },
  { icon: GitCompare, label: 'Compare candidates', description: 'Side-by-side comparison' },
  { icon: BarChart3, label: 'Run simulation', description: 'Predict candidate success' },
  { icon: FileText, label: 'Generate report', description: 'Create hiring report' },
];

export function CommandCenter() {
  const { isOpen, close } = useCommandCenter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        useCommandCenter.getState().toggle();
      }
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [close]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredActions = actions.filter(
    (a) => a.label.toLowerCase().includes(query.toLowerCase()) || a.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
          onClick={close}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
              <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                placeholder="Ask Helix anything..."
                className="flex-1 bg-transparent text-foreground text-lg outline-none placeholder:text-muted-foreground"
              />
              <kbd className="px-2 py-0.5 bg-background border border-border rounded text-xs text-muted-foreground">ESC</kbd>
            </div>

            {/* Actions */}
            <div className="py-2 max-h-80 overflow-y-auto">
              <div className="px-4 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</div>
              {filteredActions.map((action, i) => (
                <button
                  key={action.label}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    i === selectedIndex ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
                  }`}
                  onMouseEnter={() => setSelectedIndex(i)}
                >
                  <action.icon className="w-5 h-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{action.label}</div>
                    <div className="text-xs text-muted-foreground truncate">{action.description}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                </button>
              ))}
              {filteredActions.length === 0 && (
                <div className="px-4 py-8 text-center text-muted-foreground text-sm">
                  No results for &ldquo;{query}&rdquo;
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-border flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-background border border-border rounded">↑↓</kbd> navigate</span>
              <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-background border border-border rounded">↵</kbd> select</span>
              <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-background border border-border rounded">esc</kbd> close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
