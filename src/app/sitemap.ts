import type { MetadataRoute } from 'next';
import siteConfig from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();
  const routes: Array<{ path: string; priority?: number }> = [{ path: '/', priority: 1.0 }];

  return routes.map(({ path, priority }) => ({
    url: new URL(path, siteConfig.url).toString(),
    lastModified: now,
    changeFrequency: 'weekly',
    priority,
  }));
}
