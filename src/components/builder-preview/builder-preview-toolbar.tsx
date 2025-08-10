'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import {
  DownloadIcon,
  ExternalLinkIcon,
  ShareIcon,
  SunIcon,
  MoonIcon,
  PaletteIcon,
  CopyIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useBuilderContext } from '@/components/builder-preview/builder-root';

interface ExportFieldProps {
  label: string;
  value: string;
  onCopy: () => void;
}

const ExportField = ({ label, value, onCopy }: ExportFieldProps) => (
  <div className="space-y-2">
    <Label className="text-foreground text-sm font-medium">{label}</Label>
    <div className="flex gap-2">
      <Input
        readOnly
        value={value}
        className="border-border bg-input text-foreground font-mono text-xs"
      />
      <Button
        size="sm"
        variant="outline"
        onClick={onCopy}
        className="btn-transition border-border hover:bg-muted"
      >
        <CopyIcon className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

const CopySuccessMessage = () => (
  <div className="rounded-md border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
    <p className="text-sm font-medium text-green-800 dark:text-green-200">✓ Copied to clipboard!</p>
  </div>
);

const ThemeDropdown = ({
  svgTheme,
  siteTheme,
  onSvgThemeToggle,
  onSiteThemeToggle,
}: {
  svgTheme: string;
  siteTheme: string | undefined;
  onSvgThemeToggle: () => void;
  onSiteThemeToggle: () => void;
}) => (
  <DropdownMenu>
    <Tooltip>
      <TooltipTrigger asChild>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <PaletteIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Themes</span>
          </Button>
        </DropdownMenuTrigger>
      </TooltipTrigger>
      <TooltipContent>
        <p>Change themes</p>
      </TooltipContent>
    </Tooltip>
    <DropdownMenuContent align="end" className="w-48">
      <DropdownMenuLabel>SVG Theme</DropdownMenuLabel>
      <DropdownMenuItem onClick={onSvgThemeToggle}>
        {svgTheme === 'dark' ? (
          <>
            <SunIcon className="h-4 w-4" />
            Switch to Light
          </>
        ) : (
          <>
            <MoonIcon className="h-4 w-4" />
            Switch to Dark
          </>
        )}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuLabel>Website Theme</DropdownMenuLabel>
      <DropdownMenuItem onClick={onSiteThemeToggle}>
        {siteTheme === 'dark' ? (
          <>
            <SunIcon className="h-4 w-4" />
            Switch to Light
          </>
        ) : (
          <>
            <MoonIcon className="h-4 w-4" />
            Switch to Dark
          </>
        )}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export const PreviewToolbar = () => {
  const { config, updateConfig, generateURL, generateMarkdown, generateHTML } = useBuilderContext();
  const { theme: siteTheme, setTheme: setSiteTheme } = useTheme();
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  const handleDownload = () => {
    if (!config.username) return;

    const link = document.createElement('a');
    link.href = generateURL();
    link.download = `${config.username}-contributions.svg`;
    link.click();
  };

  const handleOpenInNewTab = () => {
    if (!config.username) return;

    window.open(generateURL(), '_blank');
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSvgThemeToggle = () => {
    updateConfig({ theme: config.theme === 'dark' ? 'light' : 'dark' });
  };

  const isDisabled = !config.username;

  return (
    <div className="border-border flex h-14 w-full items-center justify-between border-b px-4 lg:px-6">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        <h2 className="text-foreground text-xl font-semibold">Preview</h2>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Export Dialog */}
        <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={isDisabled} className="gap-2">
                  <ShareIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export and share your widget</p>
            </TooltipContent>
          </Tooltip>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Export & Share</DialogTitle>
              <DialogDescription>
                Choose your preferred format to export and share your contribution graph widget.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Download Section */}
              <div className="flex gap-3">
                <Button onClick={handleDownload} disabled={isDisabled} className="flex-1 gap-2">
                  <DownloadIcon className="h-4 w-4" />
                  Download SVG
                </Button>
                <Button
                  variant="outline"
                  onClick={handleOpenInNewTab}
                  disabled={isDisabled}
                  className="flex-1 gap-2"
                >
                  <ExternalLinkIcon className="h-4 w-4" />
                  Open in New Tab
                </Button>
              </div>

              {/* Export Formats */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="bg-border h-px flex-1" />
                  <span className="text-muted-foreground text-xs font-medium">OR COPY CODE</span>
                  <div className="bg-border h-px flex-1" />
                </div>

                <Tabs defaultValue="url" className="w-full">
                  <TabsList className="bg-muted grid w-full grid-cols-3">
                    <TabsTrigger
                      value="url"
                      className="data-[state=active]:bg-background data-[state=active]:text-foreground"
                    >
                      URL
                    </TabsTrigger>
                    <TabsTrigger
                      value="markdown"
                      className="data-[state=active]:bg-background data-[state=active]:text-foreground"
                    >
                      Markdown
                    </TabsTrigger>
                    <TabsTrigger
                      value="html"
                      className="data-[state=active]:bg-background data-[state=active]:text-foreground"
                    >
                      HTML
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="url" className="mt-4 space-y-3">
                    <ExportField
                      label="Direct URL"
                      value={generateURL()}
                      onCopy={() => handleCopy(generateURL())}
                    />
                  </TabsContent>

                  <TabsContent value="markdown" className="mt-4 space-y-3">
                    <ExportField
                      label="Markdown Code"
                      value={generateMarkdown()}
                      onCopy={() => handleCopy(generateMarkdown())}
                    />
                  </TabsContent>

                  <TabsContent value="html" className="mt-4 space-y-3">
                    <ExportField
                      label="HTML Code"
                      value={generateHTML()}
                      onCopy={() => handleCopy(generateHTML())}
                    />
                  </TabsContent>
                </Tabs>
              </div>

              {/* Copy Success Message */}
              {copyStatus === 'copied' && <CopySuccessMessage />}
            </div>
          </DialogContent>
        </Dialog>

        <div className="bg-border h-6 w-px" />

        <ThemeDropdown
          svgTheme={config.theme}
          siteTheme={siteTheme}
          onSvgThemeToggle={handleSvgThemeToggle}
          onSiteThemeToggle={() => setSiteTheme(siteTheme === 'dark' ? 'light' : 'dark')}
        />
      </div>
    </div>
  );
};
