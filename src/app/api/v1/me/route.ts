import type { NextRequest } from "next/server";
import {
  profileRepository,
  IncorrectPasswordError,
} from "@/modules/customer/infrastructure/profile.repository";
import {
  profileUpdateSchema,
  passwordChangeSchema,
} from "@/lib/validations/customer";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { requireUser } from "@/lib/auth/guards";

export async function GET() {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;
  const profile = await profileRepository.getProfile(guard.ctx.userId);
  if (!profile) return apiError("NOT_FOUND", "Profile not found.", 404);
  return apiSuccess(profile);
}

export async function PATCH(req: NextRequest) {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;
  const body = await req.json().catch(() => null);
  if (!body) return apiError("INVALID_JSON", "Invalid request body.", 400);

  // Two payload modes: profile update OR password change
  if ("currentPassword" in body || "newPassword" in body) {
    const parsed = passwordChangeSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(
        "VALIDATION_ERROR",
        "Invalid input.",
        422,
        parsed.error.flatten().fieldErrors,
      );
    }
    try {
      const result = await profileRepository.changePassword(
        guard.ctx.userId,
        parsed.data,
      );
      return apiSuccess(result);
    } catch (err) {
      if (err instanceof IncorrectPasswordError) {
        return apiError("INCORRECT_PASSWORD", err.message, 400);
      }
      throw err;
    }
  }

  const parsed = profileUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Invalid input.",
      422,
      parsed.error.flatten().fieldErrors,
    );
  }
  const updated = await profileRepository.updateProfile(
    guard.ctx.userId,
    parsed.data,
  );
  if (!updated) return apiError("NOT_FOUND", "Profile not found.", 404);
  return apiSuccess(updated);
}
