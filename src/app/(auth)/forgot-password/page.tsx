"use client";

import { toast } from "sonner";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  async function handleForgot(email: string) {
    try {
      const res = await fetch("/api/v1/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data?.error?.message ?? "Could not send reset email.");
        return;
      }
      toast.success("If that email exists, a reset link is on its way.");
    } catch {
      toast.error("Network error. Please try again.");
    }
  }

  return <ForgotPasswordForm onSubmit={handleForgot} />;
}
