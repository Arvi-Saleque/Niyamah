"use client";

import { useState } from "react";
import {
  Sparkles,
  X,
  Gift,
  Shirt,
  Wallet,
  Scale,
  Truck,
  MessageCircle,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickPrompt {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  prompt: string;
}

const QUICK_PROMPTS: QuickPrompt[] = [
  {
    icon: Gift,
    label: "Find a gift",
    prompt: "Help me find a gift for my sister under ৳1500.",
  },
  {
    icon: Shirt,
    label: "Build my outfit",
    prompt: "Suggest an outfit for an Eid family dinner.",
  },
  {
    icon: Wallet,
    label: "Find under budget",
    prompt: "Show me best-selling products under ৳999.",
  },
  {
    icon: Scale,
    label: "Compare products",
    prompt: "Help me compare two products side by side.",
  },
  {
    icon: Truck,
    label: "Delivery & COD info",
    prompt: "Tell me about delivery times and Cash on Delivery in my district.",
  },
];

interface AssistantDrawerProps {
  whatsappPhone: string;
  /** Optional override for the brand greeting line. */
  greeting?: string;
}

/** Floating "AI Shopping Assistant" trigger + slide-in drawer. */
export function AssistantDrawer({
  whatsappPhone,
  greeting = "Hi! I'm the Niyamah Assistant. How can I help you shop today?",
}: AssistantDrawerProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const sendToWhatsApp = (message: string) => {
    const text = message.trim();
    if (!text) return;
    const url = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
    setInput("");
  };

  return (
    <>
      {/* Floating trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open shopping assistant"
        className={cn(
          "fixed bottom-24 right-6 z-40 flex items-center gap-2 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dark)] px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl",
          // Sit just above the WhatsApp float on the right
          "sm:bottom-28",
          open && "pointer-events-none opacity-0",
        )}
      >
        <Sparkles className="h-4 w-4" />
        <span className="hidden sm:inline">Shopping Assistant</span>
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-label="Shopping Assistant"
        className={cn(
          "fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-md flex-col border-l border-[var(--color-border)] bg-white shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-gradient-to-br from-[#1a1814] to-[#3a342a] p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)]/30">
              <Sparkles className="h-5 w-5 text-[var(--color-accent-light)]" />
            </div>
            <div>
              <p className="text-sm font-semibold">Niyamah Assistant</p>
              <p className="text-[10px] text-white/60">Personal shopping helper · BD</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="rounded-full p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Greeting bubble */}
          <div className="mb-4 max-w-[85%] rounded-2xl rounded-tl-sm bg-[var(--color-surface-alt)] p-3 text-sm text-[var(--color-text-primary)]">
            {greeting}
          </div>

          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Quick options
          </p>
          <div className="grid grid-cols-1 gap-2">
            {QUICK_PROMPTS.map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => sendToWhatsApp(p.prompt)}
                  className="group flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-white p-3 text-left transition-all hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:shadow-md"
                >
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-light)]/50 text-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-white">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {p.label}
                    </p>
                    <p className="truncate text-xs text-[var(--color-text-muted)]">
                      {p.prompt}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="mt-6 text-center text-[10px] text-[var(--color-text-muted)]">
            Pick an option or type your own question — we&apos;ll continue the chat
            on WhatsApp.
          </p>
        </div>

        {/* Footer input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendToWhatsApp(input);
          }}
          className="border-t border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3"
        >
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your shopping question…"
              className="h-11 flex-1 rounded-full border border-[var(--color-border)] bg-white px-4 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-white transition-colors hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Send to WhatsApp"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={() =>
              sendToWhatsApp("Hi Niyamah, I'd like help choosing a product.")
            }
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#007A3D] py-2 text-xs font-semibold text-white transition-colors hover:bg-[#043D25]"
          >
            <MessageCircle className="h-3.5 w-3.5" /> Continue on WhatsApp
          </button>
        </form>
      </aside>
    </>
  );
}
