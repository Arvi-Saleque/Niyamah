import { NextRequest } from "next/server";
import { wishlistRepository } from "@/modules/customer/infrastructure/wishlist.repository";
import { wishlistAddSchema } from "@/lib/validations/customer";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { requireUser } from "@/lib/auth/guards";

export async function GET() {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;
  const items = await wishlistRepository.list(guard.ctx.userId);
  return apiSuccess({ items });
}

export async function POST(req: NextRequest) {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;
  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid request body.", 400);
  const parsed = wishlistAddSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Invalid input.",
      422,
      parsed.error.flatten().fieldErrors,
    );
  }
  const result = await wishlistRepository.add(
    guard.ctx.userId,
    parsed.data.productId,
    parsed.data.variantId,
  );
  return apiSuccess(result, result.added ? 201 : 200);
}
