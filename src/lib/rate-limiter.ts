import { NextRequest, NextResponse } from 'next/server';

interface RateLimitRecord {
  timestamps: number[];
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  cleanupInterval: number;
}

interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number;
  remainingRequests?: number;
}

class SlidingWindowRateLimiter {
  private store = new Map<string, RateLimitRecord>();
  private config: RateLimitConfig;
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor(config: RateLimitConfig) {
    this.config = config;
    this.startCleanup();
  }

  /**
   * Start periodic cleanup of old records
   */
  private startCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  /**
   * Clean up old records that haven't been used recently
   */
  private cleanup(): void {
    const now = Date.now();
    const cutoffTime = now - this.config.windowMs * 2; // Keep records for 2x window for safety

    for (const [key, record] of this.store.entries()) {
      if (record.timestamps.length === 0) {
        this.store.delete(key);
        continue;
      }

      const lastTimestamp = record.timestamps[record.timestamps.length - 1];
      if (lastTimestamp < cutoffTime) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Remove timestamps outside the current sliding window
   */
  private cleanupTimestamps(timestamps: number[], currentTime: number): number[] {
    const windowStart = currentTime - this.config.windowMs;
    return timestamps.filter((timestamp) => timestamp > windowStart);
  }

  /**
   * Check if request is allowed and update rate limit state
   */
  checkRequest(identifier: string): RateLimitResult {
    const currentTime = Date.now();
    let record = this.store.get(identifier);

    if (!record) {
      record = { timestamps: [] };
      this.store.set(identifier, record);
    }

    // Clean up old timestamps outside the sliding window
    record.timestamps = this.cleanupTimestamps(record.timestamps, currentTime);

    // Check if we're at the limit
    if (record.timestamps.length >= this.config.maxRequests) {
      const oldestTimestamp = record.timestamps[0];
      const retryAfter = Math.ceil((oldestTimestamp + this.config.windowMs - currentTime) / 1000);

      return {
        allowed: false,
        retryAfter: Math.max(retryAfter, 1),
        remainingRequests: 0,
      };
    }

    // Add current request timestamp
    record.timestamps.push(currentTime);

    return {
      allowed: true,
      remainingRequests: this.config.maxRequests - record.timestamps.length,
    };
  }

  /**
   * Get current rate limit status without making a request
   */
  getStatus(identifier: string): {
    requestCount: number;
    remainingRequests: number;
  } {
    const currentTime = Date.now();
    const record = this.store.get(identifier);

    if (!record) {
      return {
        requestCount: 0,
        remainingRequests: this.config.maxRequests,
      };
    }

    const validTimestamps = this.cleanupTimestamps(record.timestamps, currentTime);

    return {
      requestCount: validTimestamps.length,
      remainingRequests: Math.max(0, this.config.maxRequests - validTimestamps.length),
    };
  }

  /**
   * Clear rate limit data for a specific identifier
   */
  reset(identifier: string): void {
    this.store.delete(identifier);
  }

  /**
   * Clear all rate limit data
   */
  resetAll(): void {
    this.store.clear();
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.store.clear();
  }
}

// Default rate limiter instance
const defaultRateLimiter = new SlidingWindowRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,
  cleanupInterval: 60 * 1000, // Clean up every minute
});

/**
 * Higher-Order Component for rate limiting middleware
 */
export function withRateLimit(
  config?: Partial<RateLimitConfig>,
  rateLimiter?: SlidingWindowRateLimiter,
) {
  const limiter =
    rateLimiter ||
    (config
      ? new SlidingWindowRateLimiter({
          windowMs: 60 * 1000,
          maxRequests: 100,
          cleanupInterval: 60 * 1000,
          ...config,
        })
      : defaultRateLimiter);

  return function rateLimitMiddleware(
    handler: (req: NextRequest) => NextResponse | Promise<NextResponse>,
  ) {
    return async function wrappedHandler(req: NextRequest): Promise<NextResponse> {
      try {
        const clientIp = getClientIp(req);
        const result = limiter.checkRequest(clientIp);
        if (!result.allowed) {
          return new NextResponse(
            JSON.stringify({
              error: 'Too many requests. Please try again later.',
              retryAfter: result.retryAfter,
            }),
            {
              status: 429,
              headers: {
                'Content-Type': 'application/json',
                'Retry-After': result.retryAfter?.toString() || '60',
                'X-RateLimit-Limit': limiter['config'].maxRequests.toString(),
                'X-RateLimit-Remaining': '0',
                'X-RateLimit-Reset': new Date(
                  Date.now() + (result.retryAfter || 60) * 1000,
                ).toISOString(),
              },
            },
          );
        }

        // Add rate limit headers to successful responses
        const response = await handler(req);

        // Add rate limit info headers
        response.headers.set('X-RateLimit-Limit', limiter['config'].maxRequests.toString());
        response.headers.set('X-RateLimit-Remaining', (result.remainingRequests || 0).toString());
        response.headers.set(
          'X-RateLimit-Reset',
          new Date(Date.now() + limiter['config'].windowMs).toISOString(),
        );

        return response;
      } catch (error) {
        console.error('Rate limiting error:', error);
        // In case of errors, allow the request to proceed
        return handler(req);
      }
    };
  };
}

/**
 * Extract client IP from request
 */
function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const cfConnectingIp = req.headers.get('cf-connecting-ip');

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  if (realIp) {
    return realIp.trim();
  }

  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  return 'unknown';
}

export { SlidingWindowRateLimiter, type RateLimitConfig, type RateLimitResult };
