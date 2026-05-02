"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface WhatsAppFloatProps {
  /** International format without + (e.g. "8801XXXXXXXXX") */
  phoneNumber?: string;
  /** Default opening message */
  message?: string;
  className?: string;
}

/** Fixed bottom-right WhatsApp button that expands to a quick-help bubble. */
export function WhatsAppFloat({
  phoneNumber = "8801700000000",
  message = "Hi Niyamah! I have a question about a product.",
  className,
}: WhatsAppFloatProps) {
  const [open, setOpen] = useState(false);

  const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className={cn("fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3", className)}>
      {open && (
        <div className="w-72 origin-bottom-right animate-in fade-in slide-in-from-bottom-4 duration-200 rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-2xl">
          <div className="mb-3 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#007A3D] text-white">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                Niyamah Support
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                Replies in minutes · 9 AM – 11 PM
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mb-3 rounded-lg bg-[var(--color-surface-alt)] px-3 py-2 text-xs leading-relaxed text-[var(--color-text-secondary)]">
            👋 Hi! Need help finding something, tracking an order, or placing a COD order?
            We&rsquo;re here.
          </p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg bg-[#007A3D] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#043D25]"
          >
            <MessageCircle className="h-4 w-4" />
            Start WhatsApp Chat
          </a>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open WhatsApp chat"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#007A3D] text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl"
      >
        {!open && (
          <span className="absolute inset-0 animate-ping rounded-full bg-[#007A3D] opacity-30" />
        )}
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
