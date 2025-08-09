import type { Metadata } from 'next';
import { Builder } from '@/components/builder-preview';
import siteConfig from '@/config/site';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s • ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function Home() {
  return (
    <Builder.Root className="flex-grow">
      <Builder.Sidebar />
      <Builder.Preview />
    </Builder.Root>
  );
}
