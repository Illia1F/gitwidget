'use client';

import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBuilderContext } from './builder-root';
import { SVGEmbed } from '@/components/svg-embed';

interface BuilderPreviewContentProps {
  className?: string;
}

export const BuilderPreviewContent = ({ className }: BuilderPreviewContentProps) => {
  const { config, generateURL } = useBuilderContext();
  // Loading tracked internally by SVGEmbed; keep local error and URL only
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    let isCancelled = false;

    const loadPreview = async () => {
      if (!config.username) {
        setPreviewUrl('');
        setError(null);
        return;
      }

      setError(null);

      try {
        const url = generateURL();
        if (!isCancelled) setPreviewUrl(url);
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load preview');
          setPreviewUrl('');
        }
      }
    };

    void loadPreview();

    return () => {
      isCancelled = true;
    };
  }, [config, generateURL]);

  if (!config.username) {
    return (
      <div
        className={cn(
          'bg-card text-card-foreground flex h-96 items-center justify-center rounded-lg border',
          className,
        )}
      >
        <div className="text-center">
          <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg">
            <svg
              className="text-muted-foreground h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-medium">Enter a GitHub Username</h3>
          <p className="text-muted-foreground text-sm">
            Type a GitHub username in the sidebar to see a preview of their contribution graph.
          </p>
        </div>
      </div>
    );
  }

  // Do not early-return on loading; allow <SVGEmbed> to mount and resolve its own load events

  if (error) {
    return (
      <div
        className={cn(
          'bg-card text-card-foreground flex h-96 items-center justify-center rounded-lg border',
          className,
        )}
      >
        <div className="text-center">
          <AlertCircle className="text-destructive mx-auto mb-4 h-8 w-8" />
          <h3 className="mb-2 text-lg font-medium">Error Loading Preview</h3>
          <p className="text-muted-foreground mb-4 text-sm">{error}</p>
          <p className="text-muted-foreground/70 text-xs">
            Please check the username and try again.
          </p>
        </div>
      </div>
    );
  }

  if (!previewUrl) {
    return (
      <div
        className={cn(
          'bg-card text-card-foreground flex h-96 items-center justify-center rounded-lg border',
          className,
        )}
      >
        <div className="text-center">
          <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg">
            <svg
              className="text-muted-foreground h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-8 0h8m-8 0a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-medium">No Preview Available</h3>
          <p className="text-muted-foreground text-sm">
            Unable to generate preview for this configuration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-card text-card-foreground overflow-auto p-6', className)}>
      <div className="flex min-h-96 items-center justify-center">
        <SVGEmbed
          src={previewUrl}
          className="max-w-full"
          fallback={
            <div className="bg-muted flex h-96 w-full items-center justify-center rounded-lg">
              <p className="text-muted-foreground text-sm">SVG not supported</p>
            </div>
          }
          onError={() => {
            setError('Failed to render SVG');
          }}
        />
      </div>
    </div>
  );
};
