import { Builder } from '@/components/builder-preview';

export default function Home() {
  return (
    <Builder.Root className="flex-grow">
      <Builder.Sidebar />
      <Builder.Preview />
    </Builder.Root>
  );
}
