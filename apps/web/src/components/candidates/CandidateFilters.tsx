'use client';

const filters = [
  { id: 'all', label: 'All' },
  { id: 'high-trust', label: 'High Trust' },
  { id: 'low-risk', label: 'Low Risk' },
  { id: 'top-scorers', label: 'Top Scorers' },
];

interface Props {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function CandidateFilters({ activeFilter, onFilterChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      {filters.map((f) => (
        <button
          key={f.id}
          onClick={() => onFilterChange(f.id)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeFilter === f.id
              ? 'bg-info text-white'
              : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
