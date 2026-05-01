import { NextRequest } from "next/server";
import { wishlistRepository } from "@/modules/customer/infrastructure/wishlist.repository";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { requireUser } from "@/lib/auth/guards";

interface Ctx {
  params: Promise<{ productId: string }>;
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;
  const { productId: raw } = await params;
  const productId = Number(raw);
  if (!Number.isInteger(productId) || productId <= 0)
    return apiError("INVALID_ID", "Invalid product id.", 400);
  const ok = await wishlistRepository.remove(guard.ctx.userId, productId);
  if (!ok) return apiError("NOT_FOUND", "Item not in wishlist.", 404);
  return apiSuccess({ removed: true });
}
