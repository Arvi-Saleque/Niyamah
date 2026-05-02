"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Gift, ArrowRight, MessageCircle, Loader2, Sparkles } from "lucide-react";
import { ProductCard, type ProductCardData } from "@/components/storefront/product-card";
import { findGiftSuggestions, type GiftBudget, type GiftPurpose } from "@/modules/storefront/gift-finder";

interface GiftBuilderSectionProps {
  whatsappPhone: string;
}

const RECIPIENTS = ["Parents", "Teacher", "Friend", "Family", "Newly Married"] as const;
const BUDGETS: GiftBudget[] = ["Under ৳1000", "৳1000–৳2500", "Premium"];
const PURPOSES: GiftPurpose[] = ["Quran Gift", "Prayer Gift", "Dhikr Gift", "Complete Gift Box"];

type Recipient = (typeof RECIPIENTS)[number];

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
  const [budget, setBudget] = useState<GiftBudget | undefined>();
  const [purpose, setPurpose] = useState<GiftPurpose | undefined>();
  const [results, setResults] = useState<ProductCardData[] | null>(null);
  const [pending, startTransition] = useTransition();

  const isComplete = !!(recipient && budget && purpose);

  const runSearch = (r: Recipient, b: GiftBudget, p: GiftPurpose) => {
    startTransition(async () => {
      const items = await findGiftSuggestions({ recipient: r, budget: b, purpose: p });
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

  const whatsappMessage = `Assalamu Alaikum Niyamah — I am looking for ${purpose ?? "a gift"} for ${
    recipient ?? "someone"
  }, budget ${budget ?? "any"}. Please suggest options.`;

  return (
    <section className="rounded-[32px] border border-[#DED6BF] bg-[#EFE6D2] p-5 shadow-sm md:p-8">
      <div className="grid gap-6 md:grid-cols-[1fr,360px]">
        {/* Left — steps */}
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#007A3D]">
            <Gift className="h-3.5 w-3.5" />
            Gift Finder
          </div>
          <h2 className="text-3xl font-semibold text-[#162018] md:text-4xl">
            Build a Meaningful<br className="hidden md:block" /> Islamic Gift
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-[#687464]">
            Answer three quick questions and we will instantly show matching Quran,
            tasbih, prayer mat, or gift box options from our shop.
          </p>

          <div className="mt-7 space-y-5">
            <StepGroup label="Step 1 — Who is it for?">
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
            <StepGroup label="Step 2 — What is your budget?">
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
            <StepGroup label="Step 3 — What kind of gift?">
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
              className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all ${
                isComplete && !pending
                  ? "bg-[#007A3D] text-white hover:bg-[#043D25]"
                  : "cursor-not-allowed bg-[#DED6BF] text-[#687464]"
              }`}
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Finding...
                </>
              ) : (
                <>
                  Find Gift Suggestions
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
            {results && (
              <button
                type="button"
                onClick={reset}
                className="text-sm font-semibold text-[#687464] underline-offset-4 hover:text-[#007A3D] hover:underline"
              >
                Reset
              </button>
            )}
          </div>
          {!isComplete && (
            <p className="mt-2 text-xs text-[#687464]">Choose one option from each step above.</p>
          )}
        </div>

        {/* Right — popular shortcuts */}
        <div className="flex flex-col justify-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#687464]">
            Popular Picks
          </p>
          {(
            [
              { recipient: "Parents", budget: "৳1000–৳2500", purpose: "Quran Gift", label: "Quran Gift for Parents" },
              { recipient: "Friend", budget: "Under ৳1000", purpose: "Dhikr Gift", label: "Budget Tasbih Gift" },
              { recipient: "Family", budget: "৳1000–৳2500", purpose: "Prayer Gift", label: "Prayer Mat + Tasbih" },
              { recipient: "Newly Married", budget: "Premium", purpose: "Complete Gift Box", label: "Complete Gift Box" },
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
              className="group flex items-center gap-3 rounded-2xl border border-[#DED6BF] bg-white p-3 text-left transition-all hover:border-[#007A3D]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF6DD] text-[#007A3D] group-hover:bg-[#007A3D] group-hover:text-white">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-[#162018]">{preset.label}</span>
                <span className="text-xs text-[#687464]">Show matches instantly</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#687464] group-hover:text-[#007A3D]" />
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="mt-8 border-t border-[#DED6BF] pt-7">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C9A24A]">
                Gift Suggestions
              </p>
              <h3 className="mt-1 text-2xl font-semibold text-[#162018]">
                {results.length > 0
                  ? `${results.length} match${results.length === 1 ? "" : "es"} for ${recipient}`
                  : "No exact matches yet"}
              </h3>
              <p className="mt-1 text-sm text-[#687464]">
                {purpose} · {budget}
              </p>
            </div>
            <a
              href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#007A3D] px-4 py-2 text-sm font-semibold text-[#007A3D] hover:bg-[#007A3D] hover:text-white"
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
            <div className="rounded-2xl border border-dashed border-[#DED6BF] bg-white p-8 text-center">
              <p className="text-sm text-[#687464]">
                We couldn&apos;t find a perfect match. Try adjusting the budget, or
              </p>
              <Link
                href="/products"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#007A3D] hover:underline"
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
      <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#687464]">
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
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
        selected
          ? "border-[#007A3D] bg-[#007A3D] text-white shadow-md"
          : "border-[#DED6BF] bg-white text-[#162018] hover:border-[#007A3D] hover:text-[#007A3D]"
      }`}
    >
      {children}
    </button>
  );
}
