import { Builder } from '@/components/builder-preview';

export default function Home() {
  return (
    <Builder.Root>
      <Builder.Sidebar />
      <Builder.Preview />
    </Builder.Root>
  );
}
