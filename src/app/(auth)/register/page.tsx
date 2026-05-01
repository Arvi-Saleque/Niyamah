"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  const router = useRouter();

  async function handleRegister(values: {
    name: string;
    email: string;
    password: string;
  }) {
    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data?.error?.message ?? "Registration failed.");
        return;
      }

      // Auto sign-in after successful registration
      const signInResult = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast.success("Account created. Please sign in.");
        router.push("/login");
        return;
      }

      toast.success("Welcome to Niyamah!");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    }
  }

  return <RegisterForm onSubmit={handleRegister} />;
}
