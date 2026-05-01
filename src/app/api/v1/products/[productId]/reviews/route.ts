import { NextRequest } from "next/server";
import { reviewRepository } from "@/modules/customer/infrastructure/review.repository";
import { wishlistRepository } from "@/modules/customer/infrastructure/wishlist.repository";
import { reviewCreateSchema } from "@/lib/validations/customer";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { requireUser } from "@/lib/auth/guards";
import { rateLimit } from "@/lib/redis/rate-limit";

interface Ctx {
  params: Promise<{ productId: string }>;
}

export async function GET(req: NextRequest, { params }: Ctx) {
  const { productId: raw } = await params;
  const productId = Number(raw);
  if (!Number.isInteger(productId) || productId <= 0)
    return apiError("INVALID_ID", "Invalid product id.", 400);

  const page = Number(req.nextUrl.searchParams.get("page") ?? "1");
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? "10");
  if (!Number.isInteger(page) || page < 1)
    return apiError("INVALID_PAGE", "Invalid page.", 400);
  if (!Number.isInteger(limit) || limit < 1 || limit > 50)
    return apiError("INVALID_LIMIT", "Invalid limit.", 400);

  const [list, stats] = await Promise.all([
    reviewRepository.listForProduct(productId, { page, limit }),
    reviewRepository.statsForProduct(productId),
  ]);

  return apiSuccess(
    { items: list.items, stats },
    200,
    { page: list.page, limit: list.limit, total: list.total },
  );
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const limit = await rateLimit(req, "review-create", 5, 60);
  if (!limit.success)
    return apiError("TOO_MANY_REQUESTS", "Too many reviews.", 429);

  const guard = await requireUser();
  if ("error" in guard) return guard.error;

  const { productId: raw } = await params;
  const productId = Number(raw);
  if (!Number.isInteger(productId) || productId <= 0)
    return apiError("INVALID_ID", "Invalid product id.", 400);

  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid request body.", 400);
  const parsed = reviewCreateSchema.safeParse({ ...body, productId });
  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Invalid input.",
      422,
      parsed.error.flatten().fieldErrors,
    );
  }

  const verified = await wishlistRepository.userBoughtProduct(
    guard.ctx.userId,
    productId,
  );

  const review = await reviewRepository.create(
    guard.ctx.userId,
    parsed.data,
    verified,
  );

  return apiSuccess(review, 201);
}
