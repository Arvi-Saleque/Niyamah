"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>;
  className?: string;
}

/** Email + password login form wired with react-hook-form and Zod. */
export function LoginForm({ onSubmit, className }: LoginFormProps) {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <div className={cn("w-full max-w-sm space-y-6", className)}>
      <div className="text-center">
        <h1 className="font-heading text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">Sign in to your account</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input type="email" placeholder="you@example.com" autoComplete="email" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <Link href="/auth/forgot-password" className="text-xs text-[var(--color-accent)] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <FormControl><Input type="password" placeholder="••••••••" autoComplete="current-password" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)]"
          >
            {form.formState.isSubmitting ? "Signing in…" : "Sign In"}
          </Button>
        </form>
      </Form>
      <p className="text-center text-sm text-[var(--color-text-muted)]">
        Don&rsquo;t have an account?{" "}
        <Link href="/register" className="text-[var(--color-accent)] hover:underline">Create one</Link>
      </p>
    </div>
  );
}
