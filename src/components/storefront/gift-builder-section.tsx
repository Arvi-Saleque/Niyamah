"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowRight, Gift, Loader2, MessageCircle, Sparkles } from "lucide-react";
import { ProductCard, type ProductCardData } from "@/components/storefront/product-card";
import { findGiftSuggestions, type GiftBudget, type GiftPurpose } from "@/modules/storefront/gift-finder";

interface GiftBuilderSectionProps {
  whatsappPhone: string;
}

const RECIPIENTS = ["Mother", "Father", "Teacher", "Friend", "Kids"] as const;
const BUDGETS = ["Under Tk 1000", "Tk 1000-Tk 2000", "Premium"] as const;
const PURPOSES = ["Eid", "Ramadan", "Birthday", "Hajj/Umrah", "Thank You"] as const;

type Recipient = (typeof RECIPIENTS)[number];

function toGiftBudget(value: (typeof BUDGETS)[number]): GiftBudget {
  if (value === "Premium") return "Premium";
  if (value === "Under Tk 1000") return "Under Tk 1000" as GiftBudget;
  return "Tk 1000-Tk 2000" as GiftBudget;
}

function toGiftPurpose(value: (typeof PURPOSES)[number]): GiftPurpose {
  if (value === "Ramadan" || value === "Eid" || value === "Birthday") return "Complete Gift Box" as GiftPurpose;
  if (value === "Hajj/Umrah") return "Prayer Gift" as GiftPurpose;
  return "Quran Gift" as GiftPurpose;
}

function toCardData(items: Awaited<ReturnType<typeof findGiftSuggestions>>): ProductCardData[] {
  return items.map((p) => ({
    id: p.id,
    ...(p.variantId && { variantId: p.variantId }),
    slug: p.slug,
    name: p.name,
    image: p.image,
    price: p.price,
    ...(p.originalPrice !== undefined && { originalPrice: p.originalPrice }),
    inStock: p.inStock,
  }));
}

export function GiftBuilderSection({ whatsappPhone }: GiftBuilderSectionProps) {
  const [recipient, setRecipient] = useState<Recipient | undefined>();
  const [budget, setBudget] = useState<(typeof BUDGETS)[number] | undefined>();
  const [purpose, setPurpose] = useState<(typeof PURPOSES)[number] | undefined>();
  const [results, setResults] = useState<ProductCardData[] | null>(null);
  const [pending, startTransition] = useTransition();

  const isComplete = !!(recipient && budget && purpose);

  const runSearch = (
    nextRecipient: Recipient,
    nextBudget: (typeof BUDGETS)[number],
    nextPurpose: (typeof PURPOSES)[number],
  ) => {
    startTransition(async () => {
      const items = await findGiftSuggestions({
        recipient: nextRecipient,
        budget: toGiftBudget(nextBudget),
        purpose: toGiftPurpose(nextPurpose),
      });
      setResults(toCardData(items));
    });
  };

  const handleFind = () => {
    if (!isComplete) return;
    runSearch(recipient!, budget!, purpose!);
  };

  const reset = () => {
    setRecipient(undefined);
    setBudget(undefined);
    setPurpose(undefined);
    setResults(null);
  };

  const whatsappMessage = `Assalamu Alaikum Niyamah - I am looking for ${purpose ?? "a gift"} for ${
    recipient ?? "someone"
  }, budget ${budget ?? "any"}. Please suggest options.`;

  return (
    <section className="border border-[#d9c38b]/55 bg-[#efe6d2] p-5 shadow-[0_28px_80px_rgba(18,61,42,0.12)] md:p-8">
      <div className="grid gap-8 md:grid-cols-[1fr,360px]">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-[#123d2a]">
            <Gift className="h-3.5 w-3.5" />
            Gift Finder
          </div>
          <h2 className="text-3xl font-black leading-tight text-[#123d2a] md:text-4xl">
            Find the Perfect<br className="hidden md:block" /> Islamic Gift
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#52675b]">
            Answer three quick questions and find Quran, tasbih, prayer mat, or
            gift box ideas for the person and occasion you care about.
          </p>

          <div className="mt-7 space-y-5">
            <StepGroup label="Who is it for?">
              {RECIPIENTS.map((opt) => (
                <Chip
                  key={opt}
                  selected={recipient === opt}
                  onClick={() => setRecipient(recipient === opt ? undefined : opt)}
                >
                  {opt}
                </Chip>
              ))}
            </StepGroup>
            <StepGroup label="Budget?">
              {BUDGETS.map((opt) => (
                <Chip
                  key={opt}
                  selected={budget === opt}
                  onClick={() => setBudget(budget === opt ? undefined : opt)}
                >
                  {opt}
                </Chip>
              ))}
            </StepGroup>
            <StepGroup label="Occasion?">
              {PURPOSES.map((opt) => (
                <Chip
                  key={opt}
                  selected={purpose === opt}
                  onClick={() => setPurpose(purpose === opt ? undefined : opt)}
                >
                  {opt}
                </Chip>
              ))}
            </StepGroup>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleFind}
              disabled={!isComplete || pending}
              className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-black uppercase tracking-[0.12em] transition-all ${
                isComplete && !pending
                  ? "bg-[#123d2a] text-white hover:bg-[#0b2d1e]"
                  : "cursor-not-allowed bg-[#d6c8a8] text-[#52675b]"
              }`}
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Finding
                </>
              ) : (
                <>
                  Find My Gift
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
            {results && (
              <button
                type="button"
                onClick={reset}
                className="text-sm font-semibold text-[#52675b] underline-offset-4 hover:text-[#123d2a] hover:underline"
              >
                Reset
              </button>
            )}
          </div>
          {!isComplete && (
            <p className="mt-2 text-xs text-[#52675b]">Choose one option from each row above.</p>
          )}
        </div>

        <div className="flex flex-col justify-center gap-3">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#8a6422]">
            Popular shortcuts
          </p>
          {(
            [
              { recipient: "Mother", budget: "Tk 1000-Tk 2000", purpose: "Eid", label: "Eid Gift for Mother" },
              { recipient: "Father", budget: "Under Tk 1000", purpose: "Ramadan", label: "Ramadan Tasbih Gift" },
              { recipient: "Teacher", budget: "Tk 1000-Tk 2000", purpose: "Thank You", label: "Thank You Gift" },
              { recipient: "Friend", budget: "Premium", purpose: "Hajj/Umrah", label: "Premium Gift Box" },
            ] as const
          ).map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setRecipient(preset.recipient);
                setBudget(preset.budget);
                setPurpose(preset.purpose);
                runSearch(preset.recipient, preset.budget, preset.purpose);
              }}
              className="group flex items-center gap-3 border border-[#d9c38b]/55 bg-white p-3 text-left transition-all hover:border-[#123d2a]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f8f1e3] text-[#123d2a] group-hover:bg-[#123d2a] group-hover:text-white">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-[#123d2a]">{preset.label}</span>
                <span className="text-xs text-[#52675b]">Show matches instantly</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#52675b] group-hover:text-[#123d2a]" />
            </button>
          ))}
        </div>
      </div>

      {results && (
        <div className="mt-8 border-t border-[#d9c38b]/55 pt-7">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#8a6422]">
                Gift Suggestions
              </p>
              <h3 className="mt-1 text-2xl font-black text-[#123d2a]">
                {results.length > 0
                  ? `${results.length} match${results.length === 1 ? "" : "es"} for ${recipient}`
                  : "No exact matches yet"}
              </h3>
              <p className="mt-1 text-sm text-[#52675b]">
                {purpose} - {budget}
              </p>
            </div>
            <a
              href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[#123d2a] px-4 py-2 text-sm font-semibold text-[#123d2a] hover:bg-[#123d2a] hover:text-white"
            >
              <MessageCircle className="h-4 w-4" />
              Ask on WhatsApp
            </a>
          </div>

          {results.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-[#d9c38b] bg-white p-8 text-center">
              <p className="text-sm text-[#52675b]">
                We could not find a perfect match. Try adjusting the budget, or
              </p>
              <Link
                href="/products"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#123d2a] hover:underline"
              >
                Browse all products <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function StepGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2.5 text-xs font-black uppercase tracking-[0.2em] text-[#52675b]">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-4 py-2 text-sm font-semibold transition-all ${
        selected
          ? "border-[#123d2a] bg-[#123d2a] text-white shadow-md"
          : "border-[#d9c38b]/65 bg-white text-[#123d2a] hover:border-[#123d2a]"
      }`}
    >
      {children}
    </button>
  );
}
