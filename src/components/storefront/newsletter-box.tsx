"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";

interface NewsletterBoxProps {
  onSubscribe: (email: string) => Promise<void>;
  className?: string;
}

/** Email newsletter subscription box for the homepage / footer. */
export function NewsletterBox({ onSubscribe, className }: NewsletterBoxProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    await onSubscribe(email.trim());
    setLoading(false);
    setDone(true);
  };

  return (
    <div className={cn("rounded-2xl bg-[var(--color-accent)] px-8 py-10 text-center text-white", className)}>
      <Mail className="mx-auto mb-4 h-8 w-8 opacity-80" />
      <h3 className="font-heading text-2xl font-bold">Stay in the Loop</h3>
      <p className="mt-1 text-sm opacity-80">Get exclusive deals and new arrivals straight to your inbox.</p>
      {done ? (
        <p className="mt-6 font-medium">🎉 You&rsquo;re subscribed!</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 w-full max-w-xs border-white/30 bg-white/10 text-white placeholder:text-white/60 focus:border-white"
          />
          <Button type="submit" disabled={loading} className="h-11 bg-white text-[var(--color-accent)] hover:bg-white/90">
            {loading ? "…" : "Subscribe"}
          </Button>
        </form>
      )}
    </div>
  );
}
