'use client';

import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  repo: string; // "owner/name"
};

export function GitHubStarButton({ repo }: Props) {
  const [stars, setStars] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`https://api.github.com/repos/${repo}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (!cancelled) {
          setStars(typeof data.stargazers_count === 'number' ? data.stargazers_count : null);
        }
      } catch {
        if (!cancelled) setStars(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [repo]);

  const formatted = useMemo(() => {
    if (stars === null) return null;
    if (stars < 1000) return `${stars}`;
    if (stars < 1_000_000) return `${(stars / 1000).toFixed(1)}k`;
    return `${(stars / 1_000_000).toFixed(1)}m`;
  }, [stars]);

  return (
    <Button
      asChild
      variant="outline"
      size="sm"
      className="btn-transition border-border bg-background text-foreground hover:bg-muted hover:text-foreground shadow-sm"
      aria-label="Star on GitHub"
    >
      <a
        href={`https://github.com/${repo}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2"
      >
        <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
        <span className="text-sm font-medium">Star</span>
        <span className="text-muted-foreground ml-1 text-sm font-medium tabular-nums">
          {loading ? '…' : (formatted ?? '—')}
        </span>
      </a>
    </Button>
  );
}
