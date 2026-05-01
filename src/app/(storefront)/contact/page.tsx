"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSending(true);
    try {
      // Simple mailto fallback — wire to API later if needed
      const subject = encodeURIComponent(`Contact: ${name}`);
      const body = encodeURIComponent(`From: ${name} <${email}>\n\n${message}`);
      window.location.href = `mailto:hello@niyamah.com?subject=${subject}&body=${body}`;
      toast.success("Opening your email app…");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <h1
        className="text-3xl font-semibold sm:text-4xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Contact us
      </h1>
      <p className="mt-3 text-[var(--color-text-secondary)]">
        We&apos;d love to hear from you. Send us a note and we&apos;ll get back
        within one business day.
      </p>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Message</label>
            <Textarea
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={sending} className="w-full sm:w-auto">
            {sending ? "Sending…" : "Send message"}
          </Button>
        </form>

        <div className="space-y-5 text-sm">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 size-5 text-[var(--color-accent)]" />
            <div>
              <div className="font-medium">Email</div>
              <a
                href="mailto:hello@niyamah.com"
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
              >
                hello@niyamah.com
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 size-5 text-[var(--color-accent)]" />
            <div>
              <div className="font-medium">Phone</div>
              <span className="text-[var(--color-text-secondary)]">
                +880 1700-000000
              </span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-5 text-[var(--color-accent)]" />
            <div>
              <div className="font-medium">Address</div>
              <span className="text-[var(--color-text-secondary)]">
                Gulshan-1, Dhaka 1212, Bangladesh
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
