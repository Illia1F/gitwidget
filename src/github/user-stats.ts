import 'server-only';

/**
 * GitHub User Statistics API
 *
 * Functions to retrieve public user profile and statistics data
 */

import { createGitHubClient } from './client';
import {
  UserStatsResponse,
  UserStatsQueryParams,
  UserStatsAggregatedResult,
  UserProfileSummary,
  UserPublicStatsSummary,
  TopLanguageStat,
} from './types';
import { isValidGitHubUsername } from './utils';

/**
 * GraphQL query for user statistics
 */
const USER_STATS_QUERY = `
  query($username: String!, $repositoryCount: Int = 10) {
    user(login: $username) {
      login
      name
      bio
      avatarUrl
      location
      company
      websiteUrl
      twitterUsername
      followers {
        totalCount
      }
      following {
        totalCount
      }
      repositories(
        first: $repositoryCount, 
        orderBy: {field: UPDATED_AT, direction: DESC}, 
        privacy: PUBLIC
      ) {
        totalCount
        nodes {
          name
          description
          stargazerCount
          forkCount
          primaryLanguage {
            name
            color
          }
          isFork
          isPrivate
          updatedAt
          url
        }
      }
      gists {
        totalCount
      }
      contributionsCollection {
        totalCommitContributions
        totalIssueContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
        totalRepositoryContributions
      }
      createdAt
      updatedAt
    }
  }
`;

/**
 * Get comprehensive user statistics and profile data
 */
export const getUserStats = async (
  params: UserStatsQueryParams,
): Promise<UserStatsAggregatedResult> => {
  const { username, repositoryCount = 10 } = params;

  if (!username) {
    throw new Error('Username is required');
  }

  if (!isValidGitHubUsername(username)) {
    throw new Error('Invalid GitHub username');
  }

  if (repositoryCount < 1 || repositoryCount > 100) {
    throw new Error('Repository count must be between 1 and 100');
  }

  try {
    const client = createGitHubClient();

    const response = await client.query<UserStatsResponse>(
      USER_STATS_QUERY,
      {
        username,
        repositoryCount,
      },
      { timeoutMs: 15000 },
    );

    if (!response.data?.user) {
      throw new Error(`User '${username}' not found`);
    }

    const user = response.data.user;

    // Calculate additional statistics
    const totalStars = user.repositories.nodes.reduce((sum, repo) => sum + repo.stargazerCount, 0);

    const totalForks = user.repositories.nodes.reduce((sum, repo) => sum + repo.forkCount, 0);

    const languageStats = user.repositories.nodes
      .filter((repo) => repo.primaryLanguage && !repo.isFork)
      .reduce(
        (acc, repo) => {
          const lang = repo.primaryLanguage!.name;
          acc[lang] = (acc[lang] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

    const topLanguages: TopLanguageStat[] = Object.entries(languageStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([language, count]) => ({
        language,
        count,
        color:
          user.repositories.nodes.find((repo) => repo.primaryLanguage?.name === language)
            ?.primaryLanguage?.color || '#000000',
      }));

    const profile: UserProfileSummary = {
      login: user.login,
      name: user.name,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      location: user.location,
      company: user.company,
      websiteUrl: user.websiteUrl,
      twitterUsername: user.twitterUsername,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const stats: UserPublicStatsSummary = {
      followers: user.followers.totalCount,
      following: user.following.totalCount,
      publicRepos: user.repositories.totalCount,
      publicGists: user.gists.totalCount,
      totalStars,
      totalForks,
      contributions: {
        totalCommits: user.contributionsCollection.totalCommitContributions,
        totalIssues: user.contributionsCollection.totalIssueContributions,
        totalPRs: user.contributionsCollection.totalPullRequestContributions,
        totalReviews: user.contributionsCollection.totalPullRequestReviewContributions,
        totalRepositories: user.contributionsCollection.totalRepositoryContributions,
      },
    };

    return {
      profile,
      stats,
      repositories: user.repositories.nodes,
      topLanguages,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch user statistics: ${error.message}`);
    }
    throw new Error('Unknown error occurred while fetching user statistics');
  }
};

/**
 * Get basic user profile information
 */
export const getUserProfile = async (username: string) => {
  const result = await getUserStats({ username, repositoryCount: 5 });
  return result.profile;
};

/**
 * Get user statistics only (without repositories)
 */
export const getUserStatsOnly = async (username: string) => {
  const result = await getUserStats({ username, repositoryCount: 1 });
  return result.stats;
};

/**
 * Get user's top repositories
 */
export const getUserTopRepositories = async (username: string, count: number = 10) => {
  const result = await getUserStats({ username, repositoryCount: count });
  return result.repositories;
};
