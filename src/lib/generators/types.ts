export type Theme = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  accent: string;
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
}

export interface ContributionThemeColors extends ThemeColors {
  contributionLevels: {
    none: string;
    low: string;
    medium: string;
    high: string;
    highest: string;
  };
}

export interface SVGGeneratorOptions {
  theme: Theme;
  width?: number;
  height?: number;
  title?: string;
  hideTitle?: boolean;
  customColors?: Partial<ThemeColors>;
}

export interface ContributionGridOptions extends SVGGeneratorOptions {
  showMonthLabels?: boolean;
  showWeekdayLabels?: boolean;
  showLegend?: boolean;
  cellSize?: number;
  cellSpacing?: number;
  cornerRadius?: number;
  showBorder?: boolean;
  borderWidth?: number;
  borderRadius?: number;
  enableAnimations?: boolean;
}

export interface StatsCardOptions extends SVGGeneratorOptions {
  showAvatar?: boolean;
  showTopLanguages?: boolean;
  showContributionStats?: boolean;
  maxLanguages?: number;
  compactMode?: boolean;
}
