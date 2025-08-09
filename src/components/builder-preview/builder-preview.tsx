import { cn } from '@/lib/utils';
import { PropsWithChildren } from 'react';
import { BuilderSidebar } from './builder-sidebar';
import { BuilderPreviewContent } from './builder-preview-content';

interface RootProps extends PropsWithChildren {
  className?: string;
}

const Root = ({ className, children }: RootProps) => {
  return (
    <div className={cn('bg-background flex min-h-screen flex-col lg:flex-row', className)}>
      {children}
    </div>
  );
};

const Sidebar = () => {
  return (
    <div className="border-border bg-card w-full border-r p-6 lg:max-h-screen lg:w-80 lg:min-w-80 lg:overflow-y-auto">
      <BuilderSidebar />
    </div>
  );
};

const Preview = () => {
  return (
    <div className="bg-background flex-1 p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-foreground text-xl font-semibold">Preview</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Live preview of your contribution graph widget
        </p>
      </div>
      <div className="border-border bg-card rounded-lg border p-6 shadow-sm">
        <BuilderPreviewContent className="min-h-96" />
      </div>
    </div>
  );
};

export const Builder = {
  Root,
  Sidebar,
  Preview,
};
