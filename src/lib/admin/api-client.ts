import { toast } from "sonner";

/**
 * Shape returned by all v1 API routes via apiSuccess / apiError helpers.
 * Success: { success: true, data, meta? }
 * Error  : { success: false, error: { code, message, details? } }
 */
export type ApiEnvelope<T> =
  | { success: true; data: T; meta?: Record<string, unknown> }
  | {
      success: false;
      error: { code: string; message: string; details?: unknown };
    };

export interface AdminFetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Show a sonner toast on error (default true). */
  toastOnError?: boolean;
  /** Show a sonner toast on success with this message. */
  successMessage?: string;
}

export interface AdminFetchResult<T> {
  ok: boolean;
  status: number;
  data?: T;
  meta?: Record<string, unknown>;
  error?: { code: string; message: string; details?: unknown };
}

/**
 * Thin fetch wrapper for admin client components.
 * - JSON-encodes object bodies, sets Content-Type.
 * - Parses the apiSuccess/apiError envelope.
 * - Surfaces errors via sonner unless `toastOnError: false`.
 *
 * Pattern: `const r = await adminFetch<MyShape>(url, { method: "POST", body });`
 *          `if (!r.ok) return; router.refresh();`
 */
export async function adminFetch<T = unknown>(
  url: string,
  options: AdminFetchOptions = {},
): Promise<AdminFetchResult<T>> {
  const {
    body,
    headers,
    toastOnError = true,
    successMessage,
    ...rest
  } = options;

  const init: RequestInit = {
    ...rest,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  };

  let res: Response;
  try {
    res = await fetch(url, init);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Network request failed.";
    if (toastOnError) toast.error(message);
    return { ok: false, status: 0, error: { code: "NETWORK_ERROR", message } };
  }

  let json: ApiEnvelope<T> | null = null;
  try {
    json = (await res.json()) as ApiEnvelope<T>;
  } catch {
    // Non-JSON response.
  }

  if (!res.ok || !json || json.success === false) {
    const error =
      json && json.success === false
        ? json.error
        : { code: "REQUEST_FAILED", message: `Request failed (${res.status}).` };
    if (toastOnError) toast.error(error.message);
    return { ok: false, status: res.status, error };
  }

  if (successMessage) toast.success(successMessage);
  return {
    ok: true,
    status: res.status,
    data: json.data,
    meta: json.meta,
  };
}
