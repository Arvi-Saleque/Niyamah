import type { NextRequest } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/guards";
import { apiSuccess } from "@/lib/utils/api-response";

export async function GET(_req: NextRequest) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;
  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(500);
  return apiSuccess(rows);
}
