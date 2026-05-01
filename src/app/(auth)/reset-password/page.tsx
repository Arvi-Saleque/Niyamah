"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  if (!token) {
    return (
      <div className="w-full max-w-sm space-y-4 text-center">
        <h1 className="font-heading text-2xl font-bold">Invalid link</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          This password reset link is missing its token.
        </p>
        <Link
          href="/forgot-password"
          className="text-sm text-[var(--color-accent)] hover:underline"
        >
          Request a new reset link
        </Link>
      </div>
    );
  }

  async function handleReset(values: {
    token: string;
    password: string;
    confirmPassword: string;
  }): Promise<boolean> {
    try {
      const res = await fetch("/api/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data?.error?.message ?? "Could not reset password.");
        return false;
      }
      toast.success("Password updated.");
      return true;
    } catch {
      toast.error("Network error. Please try again.");
      return false;
    }
  }

  return <ResetPasswordForm token={token} onSubmit={handleReset} />;
}
