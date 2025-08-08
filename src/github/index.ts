/**
 * GitHub GraphQL API Module
 *
 * Main entry point for GitHub API functionality
 */

// Export all types
export * from './types';

// Export client
export { GitHubGraphQLClient, createGitHubClient } from './client';

// Export contribution functions
export {
  getContributionCalendar,
  getLast12MonthsContributions,
  getYearContributions,
} from './contributions';

// Export user statistics functions
export {
  getUserStats,
  getUserProfile,
  getUserStatsOnly,
  getUserTopRepositories,
} from './user-stats';

// Re-export commonly used types for convenience
export type {
  ContributionCalendar,
  ContributionDay,
  ContributionLevel,
  UserStats,
  Repository,
  ContributionQueryParams,
  UserStatsQueryParams,
} from './types';
