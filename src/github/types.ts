/**
 * GitHub GraphQL API Types
 *
 * Type definitions for GitHub GraphQL API responses
 */

// Base GraphQL response structure
export interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    type: string;
    path?: string[];
  }>;
}

// Calendar contribution types
export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
  firstDay: string;
}

export interface ContributionDay {
  contributionCount: number;
  date: string;
  weekday: number;
  contributionLevel: ContributionLevel;
}

export type ContributionLevel =
  | 'NONE'
  | 'FIRST_QUARTILE'
  | 'SECOND_QUARTILE'
  | 'THIRD_QUARTILE'
  | 'FOURTH_QUARTILE';

export const CONTRIBUTION_LEVELS: readonly ContributionLevel[] = [
  'NONE',
  'FIRST_QUARTILE',
  'SECOND_QUARTILE',
  'THIRD_QUARTILE',
  'FOURTH_QUARTILE',
] as const;

export interface ContributionCalendarResponse {
  user: {
    name: string | null;
    contributionsCollection: {
      contributionCalendar: ContributionCalendar;
    };
  };
}

// User statistics types
export interface Repository {
  name: string;
  description: string | null;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
  isFork: boolean;
  isPrivate: boolean;
  updatedAt: string;
  url: string;
}

export interface UserStats {
  login: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string;
  location: string | null;
  company: string | null;
  websiteUrl: string | null;
  twitterUsername: string | null;
  followers: {
    totalCount: number;
  };
  following: {
    totalCount: number;
  };
  repositories: {
    totalCount: number;
    nodes: Repository[];
  };
  gists: {
    totalCount: number;
  };
  contributionsCollection: {
    totalCommitContributions: number;
    totalIssueContributions: number;
    totalPullRequestContributions: number;
    totalPullRequestReviewContributions: number;
    totalRepositoryContributions: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserStatsResponse {
  user: UserStats;
}

// Aggregated/Derived types for API consumers
export interface UserProfileSummary {
  login: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string;
  location: string | null;
  company: string | null;
  websiteUrl: string | null;
  twitterUsername: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserContributionTotals {
  totalCommits: number;
  totalIssues: number;
  totalPRs: number;
  totalReviews: number;
  totalRepositories: number;
}

export interface UserPublicStatsSummary {
  followers: number;
  following: number;
  publicRepos: number;
  publicGists: number;
  totalStars: number;
  totalForks: number;
  contributions: UserContributionTotals;
}

export interface TopLanguageStat {
  language: string;
  count: number;
  color: string;
}

export interface UserStatsAggregatedResult {
  profile: UserProfileSummary;
  stats: UserPublicStatsSummary;
  repositories: Repository[];
  topLanguages: TopLanguageStat[];
}

export interface ContributionCalendarResult {
  username: string;
  name: string | null;
  dateRange: DateRange;
  calendar: ContributionCalendar;
}

// API configuration
export interface GitHubAPIConfig {
  token: string;
  endpoint?: string;
}

// Date range options for contributions
export interface DateRange {
  from: string;
  to: string;
}

// Query parameters
export interface ContributionQueryParams {
  username: string;
  year?: number;
}

export interface UserStatsQueryParams {
  username: string;
  repositoryCount?: number;
}
