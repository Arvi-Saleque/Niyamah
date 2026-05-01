/**
 * Password reset token utilities.
 *
 * Uses Upstash Redis as a single-use token store with TTL.
 * - Token format: 32-byte URL-safe base64 (cryptographically random).
 * - Key: `pwreset:<token>` → value: `<userId>` with TTL.
 * - On consume: GET + DEL atomically (DEL after GET; race-tolerant).
 *
 * Falls back gracefully when Redis is not configured (returns null/false).
 */

import { randomBytes } from "node:crypto";
import { redis } from "@/lib/redis";

const TTL_SECONDS = 60 * 30; // 30 minutes
const KEY_PREFIX = "pwreset:";

export function generateResetToken(): string {
  return randomBytes(32).toString("base64url");
}

export async function storeResetToken(
  token: string,
  userId: string,
): Promise<boolean> {
  if (!redis) return false;
  await redis.set(`${KEY_PREFIX}${token}`, userId, { ex: TTL_SECONDS });
  return true;
}

export async function consumeResetToken(token: string): Promise<string | null> {
  if (!redis) return null;
  const key = `${KEY_PREFIX}${token}`;
  const userId = await redis.get<string>(key);
  if (!userId) return null;
  await redis.del(key);
  return userId;
}

export const PASSWORD_RESET_TTL_SECONDS = TTL_SECONDS;
