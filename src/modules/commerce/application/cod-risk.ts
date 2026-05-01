import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";

export interface CodRiskInput {
  userId: string | null;
  paymentMethod: string;
  total: number;
  guestPhone?: string | null;
}

export interface CodRiskResult {
  score: number; // 0–100, higher = riskier
  reasons: string[];
  isHighRisk: boolean;
}

/**
 * Lightweight COD fraud-risk heuristic.
 * Returns a score 0–100 and reason list. >= 60 is flagged high-risk.
 */
export async function assessCodRisk(
  input: CodRiskInput,
): Promise<CodRiskResult> {
  if (input.paymentMethod !== "COD") {
    return { score: 0, reasons: [], isHighRisk: false };
  }

  let score = 0;
  const reasons: string[] = [];

  // Order value bands
  if (input.total >= 10000) {
    score += 35;
    reasons.push("High order value (≥ ৳10,000)");
  } else if (input.total >= 5000) {
    score += 20;
    reasons.push("Elevated order value (≥ ৳5,000)");
  }

  // Guest checkout
  if (!input.userId) {
    score += 25;
    reasons.push("Guest checkout (no account history)");
  }

  // Missing phone for COD is a major red flag
  if (!input.userId && !input.guestPhone) {
    score += 30;
    reasons.push("Guest checkout without phone number");
  }

  // Customer history (registered users)
  if (input.userId) {
    const [stats] = await db
      .select({
        total: sql<string>`count(*)`,
        cancelled: sql<string>`count(*) filter (where ${orders.status} = 'CANCELLED')`,
      })
      .from(orders)
      .where(eq(orders.userId, input.userId));

    const totalOrders = Number(stats?.total ?? 0);
    const cancelled = Number(stats?.cancelled ?? 0);

    if (totalOrders === 0) {
      score += 15;
      reasons.push("First order from customer");
    } else {
      const cancelRate = cancelled / totalOrders;
      if (cancelRate >= 0.5) {
        score += 35;
        reasons.push(
          `High cancellation rate (${Math.round(cancelRate * 100)}%)`,
        );
      } else if (cancelRate >= 0.25) {
        score += 20;
        reasons.push(
          `Moderate cancellation rate (${Math.round(cancelRate * 100)}%)`,
        );
      }
    }

    // Recently cancelled orders (last 30 days)
    const since = new Date();
    since.setDate(since.getDate() - 30);
    const [recent] = await db
      .select({ c: sql<string>`count(*)` })
      .from(orders)
      .where(
        and(
          eq(orders.userId, input.userId),
          eq(orders.status, "CANCELLED"),
          sql`${orders.createdAt} >= ${since.toISOString()}`,
        ),
      );
    if (Number(recent?.c ?? 0) >= 2) {
      score += 15;
      reasons.push("Multiple recent cancellations");
    }
  }

  const clamped = Math.min(100, score);
  return {
    score: clamped,
    reasons,
    isHighRisk: clamped >= 60,
  };
}
