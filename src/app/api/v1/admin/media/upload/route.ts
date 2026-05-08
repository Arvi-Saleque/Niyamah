import type { NextRequest } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { apiSuccess, apiError } from "@/lib/utils/api-response";
import { rateLimit } from "@/lib/redis/rate-limit";
import { requireAdmin } from "@/lib/auth/guards";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "video/mp4",
  "video/webm",
]);

/**
 * POST /api/v1/admin/media/upload
 *
 * Multipart form-data: `file` (required), `folder` (optional).
 * Admin-only. Rate-limited 30 uploads / 10 min / IP.
 */
export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const limit = await rateLimit(req, "media-upload", 30, 600);
  if (!limit.success) {
    return apiError("TOO_MANY_REQUESTS", "Upload rate limit exceeded.", 429);
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return apiError("INVALID_FORM", "Expected multipart/form-data.", 400);
  }

  const file = form.get("file");
  const folder = (form.get("folder") as string | null) ?? "niyamah";

  if (!(file instanceof File)) {
    return apiError("FILE_REQUIRED", "Field 'file' is required.", 400);
  }
  if (file.size > MAX_BYTES) {
    return apiError("FILE_TOO_LARGE", "Maximum 8 MB per file.", 413);
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return apiError("UNSUPPORTED_TYPE", `MIME type ${file.type} not allowed.`, 415);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

  try {
    const result = await uploadToCloudinary(dataUri, {
      folder,
      resourceType: file.type.startsWith("video/") ? "video" : "image",
    });
    return apiSuccess(result, 201);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not upload file.";
    console.error("[media-upload] error:", err);
    return apiError("UPLOAD_FAILED", message, 502);
  }
}
