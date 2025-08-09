/**
 * GitHub API Utility Functions
 *
 * Helper functions for working with GitHub API data
 */

import { ContributionDay, ContributionLevel } from './types';

/**
 * Get contribution level intensity (0-4)
 */
export const getContributionLevelIntensity = (level: ContributionLevel): number => {
  const intensityMap: Record<ContributionLevel, number> = {
    NONE: 0,
    FIRST_QUARTILE: 1,
    SECOND_QUARTILE: 2,
    THIRD_QUARTILE: 3,
    FOURTH_QUARTILE: 4,
  };

  return intensityMap[level];
};

/**
 * Calculate contribution statistics from calendar data
 */
export const calculateContributionStats = (days: ContributionDay[]) => {
  if (!Array.isArray(days) || days.length === 0) {
    return {
      totalContributions: 0,
      activeDays: 0,
      totalDays: 0,
      maxDailyContributions: 0,
      averageDailyContributions: 0,
      longestStreak: 0,
      currentStreak: 0,
      activityRate: 0,
    };
  }

  const total = days.reduce((sum, day) => sum + day.contributionCount, 0);
  const activeDays = days.filter((day) => day.contributionCount > 0).length;
  const maxDaily = Math.max(0, ...days.map((day) => day.contributionCount));
  const avgDaily = total / days.length;

  // Calculate longest streak
  let currentStreak = 0;
  let longestStreak = 0;

  for (const day of days) {
    if (day.contributionCount > 0) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  // Calculate current streak (from the end)
  let currentStreakFromEnd = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].contributionCount > 0) {
      currentStreakFromEnd++;
    } else {
      break;
    }
  }

  return {
    totalContributions: total,
    activeDays,
    totalDays: days.length,
    maxDailyContributions: maxDaily,
    averageDailyContributions: Math.round(avgDaily * 100) / 100,
    longestStreak,
    currentStreak: currentStreakFromEnd,
    activityRate: Math.round((activeDays / days.length) * 100 * 100) / 100, // percentage
  };
};

/**
 * Group contribution days by month
 */
export const groupContributionsByMonth = (days: ContributionDay[]) => {
  const monthGroups: Record<string, ContributionDay[]> = {};

  days.forEach((day) => {
    const date = new Date(day.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!monthGroups[monthKey]) {
      monthGroups[monthKey] = [];
    }
    monthGroups[monthKey].push(day);
  });

  return Object.entries(monthGroups).map(([month, monthDays]) => ({
    month,
    days: monthDays,
    totalContributions: monthDays.reduce((sum, day) => sum + day.contributionCount, 0),
  }));
};

/**
 * Format GitHub date string to readable format
 */
export const formatGitHubDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format large numbers with K/M suffixes
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

/**
 * Validate GitHub username format
 */
export const isValidGitHubUsername = (username: string): boolean => {
  // GitHub username rules:
  // - May only contain alphanumeric characters or single hyphens
  // - Cannot begin or end with a hyphen
  // - Maximum 39 characters
  const usernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
  return usernameRegex.test(username);
};

/**
 * Calculate account age in days
 */
export const calculateAccountAge = (createdAt: string): number => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Get relative time string (e.g., "2 days ago")
 */
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;

  return `${Math.floor(diffDays / 365)} years ago`;
};
