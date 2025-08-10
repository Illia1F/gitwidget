import { BuilderPreviewContent } from './builder-preview-content';
import { PreviewToolbar } from './builder-preview-toolbar';

export const Preview = () => {
  return (
    <div className="flex-grow">
      <PreviewToolbar />
      <div className="p-6 lg:p-8">
        <div className="border-border bg-card rounded-lg border p-6 shadow-sm">
          <BuilderPreviewContent className="min-h-96" />
        </div>
      </div>
    </div>
  );
};
