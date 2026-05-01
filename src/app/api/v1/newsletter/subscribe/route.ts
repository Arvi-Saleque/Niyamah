import { NextRequest } from "next/server";
import { newsletterRepository } from "@/modules/marketing/infrastructure/newsletter.repository";
import { newsletterSubscribeSchema } from "@/lib/validations/marketing";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { rateLimit } from "@/lib/redis/rate-limit";

export async function POST(req: NextRequest) {
  const limit = await rateLimit(req, "newsletter-subscribe", 5, 60);
  if (!limit.success) return apiError("TOO_MANY_REQUESTS", "Too many attempts.", 429);

  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid body.", 400);
  const parsed = newsletterSubscribeSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid input.", 422, parsed.error.flatten().fieldErrors);
  }
  const result = await newsletterRepository.subscribe(parsed.data);
  return apiSuccess(result, result.isNew ? 201 : 200);
}
