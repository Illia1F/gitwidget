/**
 * Global site configuration
 * Centralizes brand, metadata, and external links for reuse across the app.
 */

export type SiteConfig = {
  name: string;
  description: string;
  tagline: string;
  version: string;
  userAgent: string;
  url: string;
  keywords: string[];
  github: {
    owner: string;
    repo: string;
    repoFullName: string; // owner/repo
    repoUrl: string;
    issuesUrl: string;
  };
};

const githubOwner = (process.env.NEXT_PUBLIC_GITHUB_OWNER ?? 'Illia1F') as string;
const githubRepo = (process.env.NEXT_PUBLIC_GITHUB_REPO ?? 'gitwidget') as string;
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gitwidget.vercel.app') as string;

/**
 * Site configuration object
 */
export const siteConfig: SiteConfig = {
  name: 'GitWidget',
  description:
    'GitWidget lets you generate and download beautiful SVGs of your GitHub stats, contributions, and more. Customize themes, labels, borders, and more.',
  tagline: 'GitHub Stats Generator',
  version: '0.1.0',
  userAgent: 'GitWidget/0.1.0',
  url: siteUrl,
  keywords: [
    'GitWidget',
    'GitHub',
    'GitHub stats',
    'GitHub contributions',
    'SVG',
    'SVG generator',
    'profile widgets',
    'open source',
  ],
  github: {
    owner: githubOwner,
    repo: githubRepo,
    repoFullName: `${githubOwner}/${githubRepo}`,
    repoUrl: `https://github.com/${githubOwner}/${githubRepo}`,
    issuesUrl: `https://github.com/${githubOwner}/${githubRepo}/issues`,
  },
};

export default siteConfig;
