import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";

export interface RateLimitResult {
  success: boolean;
  remaining?: number;
  reset?: number;
}

/**
 * Rate limits a request by IP + action key.
 * Falls back to allow-all when Redis is not configured.
 *
 * @param req     The incoming Next.js request
 * @param action  A key that namespaces this rate limit (e.g. "login", "register")
 * @param limit   Max number of requests
 * @param window  Window size in seconds
 */
export async function rateLimit(
  req: NextRequest,
  action: string,
  limit: number,
  window: number,
): Promise<RateLimitResult> {
  if (!redis) {
    // Redis not configured — allow all requests in local dev
    return { success: true };
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const identifier = `rate_limit:${action}:${ip}`;

  const ratelimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, `${window} s`),
    prefix: "niyamah",
  });

  const result = await ratelimiter.limit(identifier);

  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
  };
}
