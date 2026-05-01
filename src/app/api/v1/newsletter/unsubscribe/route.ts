import { NextRequest } from "next/server";
import { newsletterRepository } from "@/modules/marketing/infrastructure/newsletter.repository";
import { apiSuccess, apiError } from "@/lib/utils/api-response";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.email !== "string")
    return apiError("INVALID_JSON", "email is required.", 400);
  const ok = await newsletterRepository.unsubscribe(body.email);
  if (!ok) return apiError("NOT_FOUND", "Email not found.", 404);
  return apiSuccess({ unsubscribed: true });
}
