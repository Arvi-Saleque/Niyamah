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

const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Must include upper, lower, and number",
      ),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetFormValues = z.infer<typeof resetSchema>;

interface ResetPasswordFormProps {
  token: string;
  onSubmit: (values: { token: string; password: string; confirmPassword: string }) => Promise<boolean>;
  className?: string;
}

/** Reset-password form — collects new password and submits with the token. */
export function ResetPasswordForm({ token, onSubmit, className }: ResetPasswordFormProps) {
  const [done, setDone] = useState(false);

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    const ok = await onSubmit({ token, ...values });
    if (ok) setDone(true);
  });

  if (done) {
    return (
      <div className={cn("flex flex-col items-center gap-4 py-8 text-center", className)}>
        <CheckCircle2 className="h-12 w-12 text-green-500" />
        <div>
          <h2 className="font-heading text-xl font-bold">Password updated</h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            You can now sign in with your new password.
          </p>
        </div>
        <Link href="/login" className="text-sm text-[var(--color-accent)] hover:underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className={cn("w-full max-w-sm space-y-6", className)}>
      <div className="text-center">
        <h1 className="font-heading text-2xl font-bold">Set a new password</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Choose a strong password for your account.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="confirmPassword" render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)]"
          >
            {form.formState.isSubmitting ? "Updating…" : "Update password"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
