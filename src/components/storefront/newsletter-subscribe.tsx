"use client";

import { useState } from "react";
import { toast } from "sonner";
import { NewsletterBox } from "@/components/storefront/newsletter-box";

interface Props {
  className?: string;
}

/** Client wrapper that subscribes via the newsletter API. */
export function NewsletterSubscribe({ className }: Props) {
  const [_, setStatus] = useState<"idle" | "ok" | "err">("idle");

  async function handle(email: string) {
    try {
      const res = await fetch("/api/v1/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "homepage-footer" }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.error?.message ?? "Could not subscribe.");
        setStatus("err");
        return;
      }
      toast.success("Subscribed! Check your inbox for a welcome email.");
      setStatus("ok");
    } catch {
      toast.error("Network error. Try again.");
      setStatus("err");
    }
  }

  return <NewsletterBox onSubscribe={handle} {...(className && { className })} />;
}
