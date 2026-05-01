"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Container } from "@/components/shared/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

const profileSchema = z.object({
  name: z.string().min(2, "At least 2 characters").max(120),
  phone: z
    .string()
    .min(7, "Enter a valid phone")
    .max(20)
    .regex(/^[+0-9\s-]+$/, "Invalid phone format")
    .or(z.literal("")),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, "At least 8 characters"),
    newPassword: z
      .string()
      .min(8, "At least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Must include upper, lower, and number",
      ),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", phone: "" },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  useEffect(() => {
    fetch("/api/v1/me")
      .then((r) => r.json())
      .then((data) => {
        const p = data?.data;
        if (p) {
          profileForm.reset({ name: p.name ?? "", phone: p.phone ?? "" });
          setEmail(p.email ?? "");
        }
      })
      .finally(() => setLoading(false));
  }, [profileForm]);

  async function handleProfileSubmit(values: ProfileForm) {
    const payload: Record<string, string> = { name: values.name };
    if (values.phone) payload.phone = values.phone;
    const res = await fetch("/api/v1/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      toast.error(data?.error?.message ?? "Could not update profile.");
      return;
    }
    toast.success("Profile updated.");
  }

  async function handlePasswordSubmit(values: PasswordForm) {
    const res = await fetch("/api/v1/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      toast.error(data?.error?.message ?? "Could not change password.");
      return;
    }
    toast.success("Password updated.");
    passwordForm.reset();
  }

  return (
    <Container className="py-8">
      <h1 className="font-heading mb-6 text-2xl font-bold">My Profile</h1>

      {loading ? (
        <div className="text-sm text-[var(--color-text-muted)]">Loading…</div>
      ) : (
        <div className="max-w-xl space-y-10">
          {/* Profile section */}
          <section className="space-y-4 rounded-xl border border-[var(--color-border)] p-6">
            <h2 className="font-heading text-lg font-semibold">Personal info</h2>
            <Form {...profileForm}>
              <form
                onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
                className="space-y-4"
              >
                <div>
                  <FormLabel className="text-sm">Email</FormLabel>
                  <Input value={email} disabled className="mt-1" />
                </div>
                <FormField
                  control={profileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="01XXXXXXXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={profileForm.formState.isSubmitting}
                  className="bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)]"
                >
                  {profileForm.formState.isSubmitting ? "Saving…" : "Save changes"}
                </Button>
              </form>
            </Form>
          </section>

          <Separator />

          {/* Password section */}
          <section className="space-y-4 rounded-xl border border-[var(--color-border)] p-6">
            <h2 className="font-heading text-lg font-semibold">Change password</h2>
            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current password</FormLabel>
                      <FormControl>
                        <Input type="password" autoComplete="current-password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New password</FormLabel>
                      <FormControl>
                        <Input type="password" autoComplete="new-password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm new password</FormLabel>
                      <FormControl>
                        <Input type="password" autoComplete="new-password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={passwordForm.formState.isSubmitting}
                  className="bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)]"
                >
                  {passwordForm.formState.isSubmitting ? "Updating…" : "Update password"}
                </Button>
              </form>
            </Form>
          </section>
        </div>
      )}
    </Container>
  );
}
