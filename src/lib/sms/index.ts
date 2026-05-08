/**
 * Provider-agnostic SMS sender.
 *
 * Configure via env:
 *   SMS_PROVIDER          one of: "ssl" | "bulksmsbd" | "log" (default "log")
 *   SMS_API_KEY           API key / token
 *   SMS_API_SECRET        secret if needed (SSL Wireless)
 *   SMS_SENDER_ID         registered sender id (e.g. "Niyamah")
 *
 * If no provider is configured we fall back to a no-op that logs to the
 * console — this keeps local development and previews safe.
 *
 * Numbers should be in international format (8801XXXXXXXXX) or local 11 digit
 * (01XXXXXXXXX) — providers normalize differently so we pass through as-is.
 */

export interface SmsResult {
  sent: boolean;
  provider: string;
  reference?: string | null;
  error?: string;
}

export interface SmsPayload {
  to: string;
  message: string;
}

function normalizeBdPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("880")) return digits;
  if (digits.startsWith("0") && digits.length === 11) return `88${digits}`;
  return digits;
}

async function sendViaSslWireless(
  payload: SmsPayload,
): Promise<SmsResult> {
  const apiToken = process.env.SMS_API_KEY;
  const sid = process.env.SMS_SENDER_ID;
  if (!apiToken || !sid) {
    return { sent: false, provider: "ssl", error: "SMS_API_KEY/SMS_SENDER_ID missing" };
  }
  try {
    const res = await fetch("https://smsplus.sslwireless.com/api/v3/send-sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_token: apiToken,
        sid,
        msisdn: normalizeBdPhone(payload.to),
        sms: payload.message,
        csms_id: `niy-${Date.now()}`,
      }),
    });
    const body = (await res.json().catch(() => null)) as
      | { status?: string; smsinfo?: Array<{ reference_id?: string }> }
      | null;
    if (!res.ok || body?.status !== "SUCCESS") {
      return {
        sent: false,
        provider: "ssl",
        error: `HTTP ${res.status} ${JSON.stringify(body)}`,
      };
    }
    return {
      sent: true,
      provider: "ssl",
      reference: body?.smsinfo?.[0]?.reference_id ?? null,
    };
  } catch (err) {
    return {
      sent: false,
      provider: "ssl",
      error: err instanceof Error ? err.message : "unknown",
    };
  }
}

async function sendViaBulkSmsBd(payload: SmsPayload): Promise<SmsResult> {
  const apiKey = process.env.SMS_API_KEY;
  const senderId = process.env.SMS_SENDER_ID;
  if (!apiKey || !senderId) {
    return { sent: false, provider: "bulksmsbd", error: "SMS_API_KEY/SMS_SENDER_ID missing" };
  }
  try {
    const url = new URL("http://bulksmsbd.net/api/smsapi");
    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("type", "text");
    url.searchParams.set("number", normalizeBdPhone(payload.to));
    url.searchParams.set("senderid", senderId);
    url.searchParams.set("message", payload.message);
    const res = await fetch(url.toString());
    const text = await res.text();
    if (!res.ok || !text.includes("1001")) {
      return {
        sent: false,
        provider: "bulksmsbd",
        error: `HTTP ${res.status} ${text}`,
      };
    }
    return { sent: true, provider: "bulksmsbd" };
  } catch (err) {
    return {
      sent: false,
      provider: "bulksmsbd",
      error: err instanceof Error ? err.message : "unknown",
    };
  }
}

/**
 * Send an SMS. Best-effort — never throws.
 */
export async function sendSms(payload: SmsPayload): Promise<SmsResult> {
  const provider = (process.env.SMS_PROVIDER ?? "log").toLowerCase();

  if (provider === "ssl") return sendViaSslWireless(payload);
  if (provider === "bulksmsbd") return sendViaBulkSmsBd(payload);

  // Default — log only (safe for dev / no creds)
  console.info(
    `[sms] (no provider) → ${payload.to} | ${payload.message.slice(0, 80)}`,
  );
  return { sent: true, provider: "log" };
}
