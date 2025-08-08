'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface SVGEmbedProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  fallback?: React.ReactNode;
  onLoad?: () => void;
  onError?: (error: React.SyntheticEvent<HTMLObjectElement, Event>) => void;
}

export const SVGEmbed = React.forwardRef<HTMLObjectElement, SVGEmbedProps>(
  ({ src, className, style, fallback, onLoad, onError, ...props }, ref) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
      setIsLoading(true);
      setHasError(false);
    }, [src]);

    const handleLoad = () => {
      setIsLoading(false);
      setHasError(false);
      onLoad?.();
    };

    const handleError = (error: React.SyntheticEvent<HTMLObjectElement, Event>) => {
      setIsLoading(false);
      setHasError(true);
      onError?.(error);
    };

    if (hasError && fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className={cn('relative w-full', className)}>
        {isLoading && (
          <div className="bg-muted/50 absolute inset-0 flex items-center justify-center rounded-lg">
            <div className="text-muted-foreground flex items-center space-x-2 text-sm">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span>Loading SVG...</span>
            </div>
          </div>
        )}
        <object
          ref={ref}
          data={src}
          type="image/svg+xml"
          className={cn(
            'bg-background block h-auto w-full rounded-lg border',
            isLoading && 'opacity-0',
            className,
          )}
          style={style}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        >
          {fallback || (
            <div className="bg-muted flex items-center justify-center rounded-lg p-8">
              <p className="text-muted-foreground text-sm">SVG not supported</p>
            </div>
          )}
        </object>
      </div>
    );
  },
);

SVGEmbed.displayName = 'SVGEmbed';
