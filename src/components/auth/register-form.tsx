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

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSubmit: (values: Omit<RegisterFormValues, "confirmPassword">) => Promise<void>;
  className?: string;
}

/** Customer registration form with name, email, password and confirm password fields. */
export function RegisterForm({ onSubmit, className }: RegisterFormProps) {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const handleSubmit = form.handleSubmit(async ({ confirmPassword: _cp, ...values }) => {
    await onSubmit(values);
  });

  return (
    <div className={cn("w-full max-w-sm space-y-6", className)}>
      <div className="text-center">
        <h1 className="font-heading text-2xl font-bold">Create account</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">Join Niyamah today</p>
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl><Input placeholder="Rahim Uddin" autoComplete="name" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input type="email" placeholder="you@example.com" autoComplete="email" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl><Input type="password" placeholder="Min 8 characters" autoComplete="new-password" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="confirmPassword" render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl><Input type="password" placeholder="Re-enter password" autoComplete="new-password" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)]"
          >
            {form.formState.isSubmitting ? "Creating account…" : "Create Account"}
          </Button>
        </form>
      </Form>
      <p className="text-center text-sm text-[var(--color-text-muted)]">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-[var(--color-accent)] hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
