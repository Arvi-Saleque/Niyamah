"use client";

import { useState } from "react";
import { Gift, ArrowRight } from "lucide-react";

interface GiftBuilderSectionProps {
  whatsappPhone: string;
}

const STEPS = {
  recipient: {
    label: "Step 1 — Who is it for?",
    options: ["Parents", "Teacher", "Friend", "Family", "Newly Married"],
  },
  budget: {
    label: "Step 2 — What is your budget?",
    options: ["Under \u09f31000", "\u09f31000\u2013\u09f32500", "Premium"],
  },
  purpose: {
    label: "Step 3 — What kind of gift?",
    options: ["Quran Gift", "Prayer Gift", "Dhikr Gift", "Complete Gift Box"],
  },
} as const;

type StepKey = keyof typeof STEPS;

export function GiftBuilderSection({ whatsappPhone }: GiftBuilderSectionProps) {
  const [selections, setSelections] = useState<Partial<Record<StepKey, string>>>({});

  const toggle = (step: StepKey, value: string) =>
    setSelections((prev) => ({ ...prev, [step]: prev[step] === value ? undefined : value }));

  const isComplete = Object.keys(STEPS).every((k) => selections[k as StepKey]);

  const buildMessage = () => {
    const r = selections.recipient ?? "someone";
    const b = selections.budget ?? "any budget";
    const p = selections.purpose ?? "a gift";
    return `Assalamu Alaikum Niyamah \u2014 I am looking for ${p} for ${r}, budget ${b}. Please suggest options.`;
  };

  return (
    <section className="grid gap-6 rounded-[32px] border border-[#DED6BF] bg-[#EFE6D2] p-5 shadow-sm md:grid-cols-[1fr,360px] md:p-8">
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
          Answer three quick questions and we will suggest the right Quran, tasbih,
          prayer mat, or gift box over WhatsApp.
        </p>

        <div className="mt-7 space-y-5">
          {(Object.entries(STEPS) as [StepKey, typeof STEPS[StepKey]][]).map(([key, step]) => (
            <div key={key}>
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#687464]">
                {step.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {step.options.map((opt) => {
                  const selected = selections[key] === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggle(key, opt)}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                        selected
                          ? "border-[#007A3D] bg-[#007A3D] text-white shadow-md"
                          : "border-[#DED6BF] bg-white text-[#162018] hover:border-[#007A3D] hover:text-[#007A3D]"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <a
          href={
            isComplete
              ? `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(buildMessage())}`
              : undefined
          }
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!isComplete}
          className={`mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all ${
            isComplete
              ? "bg-[#007A3D] text-white hover:bg-[#043D25]"
              : "cursor-not-allowed bg-[#DED6BF] text-[#687464]"
          }`}
        >
          Find Gift Suggestions
          <ArrowRight className="h-4 w-4" />
        </a>
        {!isComplete && (
          <p className="mt-2 text-xs text-[#687464]">
            Choose one option from each step above.
          </p>
        )}
      </div>

      {/* Right — popular shortcuts */}
      <div className="flex flex-col justify-center gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#687464]">
          Popular Gift Ideas
        </p>
        {[
          {
            label: "Quran Gift for Parents",
            text: "Assalamu Alaikum \u2014 I want a Quran gift box for my parents, under \u09f32500.",
          },
          {
            label: "Budget Islamic Gift Box",
            text: "Assalamu Alaikum \u2014 I need an Islamic gift under \u09f31000 for a friend.",
          },
          {
            label: "Prayer Mat + Tasbih Set",
            text: "Assalamu Alaikum \u2014 Please suggest a prayer mat and tasbih gift set.",
          },
          {
            label: "Complete Gift for Newly Married",
            text: "Assalamu Alaikum \u2014 I am looking for a complete Islamic gift box for a newly married couple.",
          },
        ].map((item) => (
          <a
            key={item.label}
            href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(item.text)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-2xl border border-[#DED6BF] bg-white p-3 transition-all hover:border-[#007A3D]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF6DD] text-[#007A3D] group-hover:bg-[#007A3D] group-hover:text-white">
              <Gift className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-[#162018]">{item.label}</span>
              <span className="text-xs text-[#687464]">Ask on WhatsApp</span>
            </span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#687464] group-hover:text-[#007A3D]" />
          </a>
        ))}
      </div>
    </section>
  );
}
