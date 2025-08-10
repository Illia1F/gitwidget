import Link from 'next/link';
import { GitHubStarButton } from '@/components/github-star-button';
import { ThemeToggle } from '@/components/theme-toggle';
import { GitHubIcon } from '@/components/icons/github-icon';
import siteConfig from '@/config/site';

export function SiteHeader() {
  return (
    <header className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
          aria-label="Go to homepage"
        >
          <div
            className="from-primary to-primary/50 dark:to-accent flex size-8 items-center justify-center rounded-md bg-gradient-to-br shadow-sm"
            aria-hidden="true"
          >
            <GitHubIcon className="text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg leading-none font-semibold">{siteConfig.name}</span>
              <span className="from-primary to-primary/80 text-primary-foreground inline-flex animate-pulse items-center rounded-full bg-gradient-to-r px-2 py-0.5 text-xs font-medium shadow-sm">
                BETA
              </span>
            </div>
            <span className="text-muted-foreground text-xs leading-none">{siteConfig.tagline}</span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <GitHubStarButton repo={siteConfig.github.repoFullName} />
        </div>
      </div>
    </header>
  );
}
