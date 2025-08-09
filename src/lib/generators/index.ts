// Export types
export * from './types';

// Export themes
export { getTheme, getContributionLevelColor, lightTheme, darkTheme } from './themes';

// Export utilities
export * from './svg-utils';

// Export generators
export { generateContributionsGridSVG } from './contributions';

// Re-export commonly used types
export type {
  Theme,
  SVGGeneratorOptions,
  ContributionGridOptions,
  StatsCardOptions,
  ThemeColors,
  ContributionThemeColors,
} from './types';
