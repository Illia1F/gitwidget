'use client';

import { useEffect, useState } from 'react';
import { Copy, ExternalLink, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBuilderContext } from '@/contexts/builder-context';
import { cn } from '@/lib/utils';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

interface BuilderSidebarProps {
  className?: string;
}

export const BuilderSidebar = ({ className }: BuilderSidebarProps) => {
  const { config, updateConfig, generateURL, generateMarkdown, generateHTML } = useBuilderContext();
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [usernameInput, setUsernameInput] = useState<string>(config.username);
  const debouncedUsername = useDebouncedValue(usernameInput, 500);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopyStatus('copied');
    setTimeout(() => setCopyStatus('idle'), 2000);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  useEffect(() => {
    if (debouncedUsername !== config.username) {
      updateConfig({ username: debouncedUsername });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedUsername]);

  return (
    <div className={cn('space-y-8', className)}>
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-foreground text-xl font-semibold">Contributions Builder</h2>
        <p className="text-muted-foreground text-sm">Customize your GitHub contributions widget</p>
      </div>

      {/* Basic Settings */}
      <div className="space-y-6">
        <h3 className="text-foreground text-lg font-medium">Basic Settings</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-foreground text-sm font-medium">
              GitHub Username
            </Label>
            <Input
              id="username"
              placeholder="octocat"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="btn-transition border-border bg-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 focus:ring-2"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium">Theme</Label>
            <Select
              value={config.theme}
              onValueChange={(value: 'light' | 'dark') => updateConfig({ theme: value })}
            >
              <SelectTrigger className="btn-transition border-border bg-input text-foreground focus:border-primary focus:ring-primary/20 focus:ring-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-border bg-card">
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium">Year (optional)</Label>
            <Select
              value={config.year?.toString() || 'current'}
              onValueChange={(value) =>
                updateConfig({ year: value === 'current' ? undefined : parseInt(value) })
              }
            >
              <SelectTrigger className="btn-transition border-border bg-input text-foreground focus:border-primary focus:ring-primary/20 focus:ring-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-border bg-card">
                <SelectItem value="current">Last 12 months</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground text-sm font-medium">
              Custom Title (optional)
            </Label>
            <Input
              id="title"
              placeholder="My Contributions"
              value={config.title || ''}
              onChange={(e) => updateConfig({ title: e.target.value || undefined })}
              className="btn-transition border-border bg-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 focus:ring-2"
            />
          </div>
        </div>
      </div>

      {/* Display Options */}
      <div className="space-y-6">
        <h3 className="text-foreground text-lg font-medium">Display Options</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <Label
              htmlFor="month-labels"
              className="text-foreground cursor-pointer text-sm font-medium"
            >
              Show Month Labels
            </Label>
            <Switch
              id="month-labels"
              checked={config.showMonthLabels}
              onCheckedChange={(checked) => updateConfig({ showMonthLabels: checked })}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <Label
              htmlFor="weekday-labels"
              className="text-foreground cursor-pointer text-sm font-medium"
            >
              Show Weekday Labels
            </Label>
            <Switch
              id="weekday-labels"
              checked={config.showWeekdayLabels}
              onCheckedChange={(checked) => updateConfig({ showWeekdayLabels: checked })}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <Label htmlFor="legend" className="text-foreground cursor-pointer text-sm font-medium">
              Show Legend
            </Label>
            <Switch
              id="legend"
              checked={config.showLegend}
              onCheckedChange={(checked) => updateConfig({ showLegend: checked })}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <Label htmlFor="border" className="text-foreground cursor-pointer text-sm font-medium">
              Show Border
            </Label>
            <Switch
              id="border"
              checked={config.showBorder}
              onCheckedChange={(checked) => updateConfig({ showBorder: checked })}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <Label
              htmlFor="hide-title"
              className="text-foreground cursor-pointer text-sm font-medium"
            >
              Hide Title
            </Label>
            <Switch
              id="hide-title"
              checked={config.hideTitle}
              onCheckedChange={(checked) => updateConfig({ hideTitle: checked })}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <Label
              htmlFor="animations"
              className="text-foreground cursor-pointer text-sm font-medium"
            >
              Enable Animations
            </Label>
            <Switch
              id="animations"
              checked={config.enableAnimations}
              onCheckedChange={(checked) => updateConfig({ enableAnimations: checked })}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="space-y-6">
        <h3 className="text-foreground text-lg font-medium">Advanced Settings</h3>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-foreground text-sm font-medium">
              Cell Size: {config.cellSize || 12}px
            </Label>
            <Slider
              value={[config.cellSize || 12]}
              onValueChange={([value]) => updateConfig({ cellSize: value })}
              min={8}
              max={20}
              step={1}
              className="w-full"
            />
          </div>

          {config.showBorder && (
            <>
              <div className="space-y-3">
                <Label className="text-foreground text-sm font-medium">
                  Border Width: {config.borderWidth || 1}px
                </Label>
                <Slider
                  value={[config.borderWidth || 1]}
                  onValueChange={([value]) => updateConfig({ borderWidth: value })}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-foreground text-sm font-medium">
                  Border Radius: {config.borderRadius || 0}px
                </Label>
                <Slider
                  value={[config.borderRadius || 0]}
                  onValueChange={([value]) => updateConfig({ borderRadius: value })}
                  min={0}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Export */}
      <div className="space-y-6">
        <h3 className="text-foreground text-lg font-medium">Export</h3>

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
            <div className="space-y-2">
              <Label className="text-foreground text-sm font-medium">Direct URL</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={generateURL()}
                  className="border-border bg-input text-foreground font-mono text-xs"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(generateURL())}
                  className="btn-transition border-border hover:bg-muted"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="markdown" className="mt-4 space-y-3">
            <div className="space-y-2">
              <Label className="text-foreground text-sm font-medium">Markdown Code</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={generateMarkdown()}
                  className="border-border bg-input text-foreground font-mono text-xs"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(generateMarkdown())}
                  className="btn-transition border-border hover:bg-muted"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="html" className="mt-4 space-y-3">
            <div className="space-y-2">
              <Label className="text-foreground text-sm font-medium">HTML Code</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={generateHTML()}
                  className="border-border bg-input text-foreground font-mono text-xs"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(generateHTML())}
                  className="btn-transition border-border hover:bg-muted"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {copyStatus === 'copied' && (
          <div className="rounded-md border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              ✓ Copied to clipboard!
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(generateURL(), '_blank')}
            disabled={!config.username}
            className="btn-transition border-border hover:bg-muted flex-1"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button
            size="sm"
            onClick={() => {
              const link = document.createElement('a');
              link.href = generateURL();
              link.download = `${config.username}-contributions.svg`;
              link.click();
            }}
            disabled={!config.username}
            className="btn-transition bg-primary text-primary-foreground hover:bg-primary/90 flex-1"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};
