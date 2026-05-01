"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

/**
 * Root client-side providers — wraps the app in NextAuth SessionProvider
 * so `useSession()` and `signIn()` work in client components.
 */
export function Providers({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
