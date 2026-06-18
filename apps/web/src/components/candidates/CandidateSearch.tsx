'use client';

import { Search } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function CandidateSearch({ value, onChange }: Props) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search candidates by name, skill, or role..."
        className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-foreground text-sm outline-none focus:border-info/50 transition-colors placeholder:text-muted-foreground"
      />
    </div>
  );
}
