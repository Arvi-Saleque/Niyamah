"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

const forgotSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => Promise<void>;
  className?: string;
}

/** Forgot-password form — collects email and sends reset link via Resend. */
export function ForgotPasswordForm({ onSubmit, className }: ForgotPasswordFormProps) {
  const [sent, setSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const form = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const handleSubmit = form.handleSubmit(async ({ email }) => {
    await onSubmit(email);
    setSubmittedEmail(email);
    setSent(true);
  });

  if (sent) {
    return (
      <div className={cn("flex flex-col items-center gap-4 py-8 text-center", className)}>
        <CheckCircle2 className="h-12 w-12 text-green-500" />
        <div>
          <h2 className="font-heading text-xl font-bold">Check your email</h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            We sent a reset link to <span className="font-medium">{submittedEmail}</span>
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => { setSent(false); form.reset(); }}>
          Resend
        </Button>
        <Link href="/login" className="text-sm text-[var(--color-accent)] hover:underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className={cn("w-full max-w-sm space-y-6", className)}>
      <div className="text-center">
        <h1 className="font-heading text-2xl font-bold">Forgot password?</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Enter your email and we&rsquo;ll send a reset link.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input type="email" placeholder="you@example.com" autoComplete="email" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)]"
          >
            {form.formState.isSubmitting ? "Sending…" : "Send Reset Link"}
          </Button>
        </form>
      </Form>
      <p className="text-center text-sm text-[var(--color-text-muted)]">
        Remembered your password?{" "}
        <Link href="/login" className="text-[var(--color-accent)] hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
