import { cookies } from "next/headers";
import { nanoid } from "nanoid";

const COOKIE_NAME = "niyamah_sid";
const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Read or mint a guest session id stored in an http-only cookie.
 * Used to associate carts (and abandoned-cart tracking) with anonymous visitors.
 */
export async function getOrCreateSessionId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(COOKIE_NAME)?.value;
  if (existing) return existing;
  const id = nanoid(24);
  store.set(COOKIE_NAME, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ONE_YEAR,
  });
  return id;
}

export async function getSessionId(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}
