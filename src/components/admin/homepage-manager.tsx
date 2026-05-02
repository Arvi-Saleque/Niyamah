"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ICON_KEYS } from "@/lib/icon-registry";
import {
  CheckCircle2,
  Circle,
  RotateCcw,
  Save,
  AlertTriangle,
} from "lucide-react";

interface Block {
  blockKey: string;
  data: unknown;
  isActive: boolean;
  isCustomized: boolean;
  updatedAt: string | null;
}

const BLOCK_LABELS: Record<string, { title: string; description: string }> = {
  hero: {
    title: "Editorial Hero",
    description: "Top auto-rotating hero slides with CTAs and popular links.",
  },
  ticker: {
    title: "Top Bar Ticker",
    description: "Animated trust messages above the header.",
  },
  discovery: {
    title: "Search Discovery Panel",
    description: "Hero search with trending query chips.",
  },
  needs: {
    title: "Shop by Need",
    description: "Intent tiles (For Eid, Gifts, Under ৳999, etc).",
  },
  trust: {
    title: "Trust Section",
    description: "Six promise badges that open dialogs.",
  },
  editorial: {
    title: "Editorial Block",
    description: "Three brand-story curated collection cards.",
  },
  testimonials: {
    title: "Testimonials",
    description: "Customer quotes shown on the homepage.",
  },
  whatsapp: {
    title: "WhatsApp Commerce",
    description: "Phone, message, and CTA copy. Toggle to hide button entirely.",
  },
  flashSale: {
    title: "Flash Sale",
    description: "Title and countdown duration in hours. Toggle to hide section.",
  },
};

export function HomepageManager() {
  const [blocks, setBlocks] = useState<Block[] | null>(null);
  const [active, setActive] = useState<string>("hero");
  const [draft, setDraft] = useState<string>("");
  const [draftActive, setDraftActive] = useState<boolean>(true);
  const [parseError, setParseError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const res = await fetch("/api/v1/admin/homepage", { cache: "no-store" });
    if (!res.ok) {
      toast.error("Failed to load homepage blocks");
      return;
    }
    const json = await res.json();
    const list: Block[] = json?.data ?? [];
    setBlocks(list);
    const current = list.find((b) => b.blockKey === active) ?? list[0];
    if (current) {
      setActive(current.blockKey);
      setDraft(JSON.stringify(current.data, null, 2));
      setDraftActive(current.isActive);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectBlock = (key: string) => {
    if (!blocks) return;
    const block = blocks.find((b) => b.blockKey === key);
    if (!block) return;
    setActive(key);
    setDraft(JSON.stringify(block.data, null, 2));
    setDraftActive(block.isActive);
    setParseError(null);
  };

  const validate = (): unknown | null => {
    try {
      const parsed = JSON.parse(draft);
      setParseError(null);
      return parsed;
    } catch (e) {
      setParseError(e instanceof Error ? e.message : "Invalid JSON");
      return null;
    }
  };

  const save = async () => {
    const parsed = validate();
    if (parsed === null) {
      toast.error("Fix JSON before saving");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/v1/admin/homepage/${active}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: parsed, isActive: draftActive }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        toast.error(j?.error?.message ?? "Save failed");
      } else {
        toast.success(`Saved · ${BLOCK_LABELS[active]?.title ?? active}`);
        await load();
      }
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    if (!confirm("Reset this block to default content? Your edits will be lost.")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/v1/admin/homepage/${active}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        toast.error("Reset failed");
      } else {
        toast.success("Reset to default");
        await load();
      }
    } finally {
      setSaving(false);
    }
  };

  if (!blocks) {
    return <div className="text-sm text-[var(--color-text-muted)]">Loading…</div>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
      {/* Sidebar list */}
      <aside className="space-y-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2">
        {blocks.map((b) => {
          const label = BLOCK_LABELS[b.blockKey];
          return (
            <button
              key={b.blockKey}
              type="button"
              onClick={() => selectBlock(b.blockKey)}
              className={cn(
                "flex w-full items-start gap-2 rounded-lg p-3 text-left text-sm transition-colors",
                active === b.blockKey
                  ? "bg-[var(--color-accent-light)]/50 text-[var(--color-accent-dark)]"
                  : "hover:bg-[var(--color-surface-alt)]",
              )}
            >
              {b.isActive ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              ) : (
                <Circle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 font-medium">
                  {label?.title ?? b.blockKey}
                  {b.isCustomized && (
                    <span className="rounded-full bg-[var(--color-accent)]/15 px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-accent-dark)]">
                      edited
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-[var(--color-text-muted)] line-clamp-2">
                  {label?.description}
                </p>
              </div>
            </button>
          );
        })}
      </aside>

      {/* Editor */}
      <section className="space-y-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">
              {BLOCK_LABELS[active]?.title ?? active}
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              {BLOCK_LABELS[active]?.description}
            </p>
          </div>

          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-2 text-sm">
            <input
              type="checkbox"
              checked={draftActive}
              onChange={(e) => setDraftActive(e.target.checked)}
              className="h-4 w-4 accent-[var(--color-accent)]"
            />
            Show on storefront
          </label>
        </header>

        <details className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-2 text-xs text-[var(--color-text-secondary)]">
          <summary className="cursor-pointer font-semibold text-[var(--color-text-primary)]">
            Tips & icon keys
          </summary>
          <ul className="mt-2 space-y-1 leading-relaxed">
            <li>• Edit values inside the JSON. Preserve the structure.</li>
            <li>
              • Available <strong>icon</strong> keys: <code>{ICON_KEYS.join(", ")}</code>
            </li>
            <li>
              • Tile <strong>tone</strong> options: <code>default</code>,{" "}
              <code>accent</code>, <code>danger</code>
            </li>
            <li>
              • Hero <strong>rightGradient</strong> uses Tailwind classes (e.g.{" "}
              <code>from-[#e8d5a8] via-[#d4ba85] to-[#b8893d]</code>)
            </li>
            <li>
              • Use <em>Reset to default</em> to discard your overrides anytime.
            </li>
          </ul>
        </details>

        <textarea
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setParseError(null);
          }}
          spellCheck={false}
          className="block h-[520px] w-full resize-y rounded-lg border border-[var(--color-border)] bg-white p-3 font-mono text-xs leading-relaxed outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
        />

        {parseError && (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <strong>JSON error:</strong> {parseError}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="ghost"
            onClick={reset}
            disabled={saving || !blocks.find((b) => b.blockKey === active)?.isCustomized}
            className="gap-1.5"
          >
            <RotateCcw className="h-4 w-4" /> Reset to default
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => selectBlock(active)} disabled={saving}>
              Discard changes
            </Button>
            <Button onClick={save} disabled={saving} className="gap-1.5">
              <Save className="h-4 w-4" />
              {saving ? "Saving…" : "Save block"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
