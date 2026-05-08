/**
 * Steadfast Courier API adapter.
 * Docs: https://portal.packzy.com/api/documentation
 *
 * Required env:
 *   STEADFAST_API_KEY
 *   STEADFAST_SECRET_KEY
 *   STEADFAST_BASE_URL  (optional, defaults to https://portal.packzy.com/api/v1)
 *
 * No-ops gracefully when keys are missing so admin actions never crash in dev.
 */

export interface SteadfastCreateInput {
  invoice: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  cod_amount: number;
  note?: string;
}

export interface SteadfastConsignment {
  consignment_id: number | string;
  invoice: string;
  tracking_code: string;
  status: string;
}

export interface SteadfastResult {
  ok: boolean;
  consignment?: SteadfastConsignment;
  raw?: unknown;
  error?: string;
}

export async function createSteadfastConsignment(
  input: SteadfastCreateInput,
): Promise<SteadfastResult> {
  const apiKey = process.env.STEADFAST_API_KEY;
  const secret = process.env.STEADFAST_SECRET_KEY;
  const baseUrl =
    process.env.STEADFAST_BASE_URL ?? "https://portal.packzy.com/api/v1";

  if (!apiKey || !secret) {
    console.warn(
      "[steadfast] STEADFAST_API_KEY/SECRET not set — returning stub success",
    );
    // Return a deterministic stub so the caller still records a shipment row.
    return {
      ok: true,
      consignment: {
        consignment_id: `stub-${input.invoice}`,
        invoice: input.invoice,
        tracking_code: `STUB${Date.now().toString().slice(-8)}`,
        status: "in_review",
      },
    };
  }

  try {
    const res = await fetch(`${baseUrl}/create_order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": apiKey,
        "Secret-Key": secret,
      },
      body: JSON.stringify(input),
    });
    const body = (await res.json().catch(() => null)) as
      | { status?: number; consignment?: SteadfastConsignment; message?: string }
      | null;

    if (!res.ok || body?.status !== 200 || !body.consignment) {
      return {
        ok: false,
        raw: body,
        error: body?.message ?? `HTTP ${res.status}`,
      };
    }

    return { ok: true, consignment: body.consignment, raw: body };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "unknown",
    };
  }
}
