"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface VariantOption {
  type: string;  // e.g. "Color", "Size"
  value: string; // e.g. "Red", "XL"
}

export interface VariantRow {
  id: string; // local temp ID
  options: VariantOption[];
  sku: string;
  price: number;
  salePrice: number | "";
  stock: number;
}

interface VariantManagerProps {
  basePrice: number; // inherit from product
  variants: VariantRow[];
  onChange: (variants: VariantRow[]) => void;
  className?: string;
}

// ── Preset option types ────────────────────────────────────────────────────────
const PRESET_TYPES = ["Color", "Size", "Material", "Style", "Weight"];
const PRESET_VALUES: Record<string, string[]> = {
  Color: ["Black", "White", "Red", "Blue", "Green", "Yellow", "Gray", "Navy", "Pink"],
  Size: ["XS", "S", "M", "L", "XL", "XXL", "3XL", "Free Size"],
  Material: ["Cotton", "Polyester", "Silk", "Linen", "Wool"],
  Style: ["Regular", "Slim Fit", "Oversized"],
  Weight: ["250g", "500g", "1kg", "2kg"],
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

/** Generate all combinations of option type→value arrays. */
function cartesian(groups: { type: string; values: string[] }[]): VariantOption[][] {
  if (groups.length === 0) return [];
  return groups.reduce<VariantOption[][]>(
    (acc, group) =>
      acc.flatMap((combo) =>
        group.values.map((val) => [...combo, { type: group.type, value: val }])
      ),
    [[]]
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function OptionTypeSection({
  optionType,
  values,
  onAddValue,
  onRemoveValue,
  onRemoveType,
}: {
  optionType: string;
  values: string[];
  onAddValue: (v: string) => void;
  onRemoveValue: (v: string) => void;
  onRemoveType: () => void;
}) {
  const [inputVal, setInputVal] = useState("");
  const presets = PRESET_VALUES[optionType] ?? [];
  const unusedPresets = presets.filter((p) => !values.includes(p));

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-[var(--color-text-primary)]">{optionType}</span>
        <button
          type="button"
          onClick={onRemoveType}
          className="text-[var(--color-error)] hover:opacity-80"
          aria-label={`Remove ${optionType}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Current values */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {values.map((v) => (
          <Badge
            key={v}
            className="gap-1 cursor-pointer bg-[var(--color-accent-light)] text-[var(--color-accent-dark)] hover:bg-red-100 hover:text-red-700"
            onClick={() => onRemoveValue(v)}
          >
            {v} ×
          </Badge>
        ))}
        {values.length === 0 && (
          <span className="text-xs text-[var(--color-text-muted)]">No values yet</span>
        )}
      </div>

      {/* Quick-add presets */}
      {unusedPresets.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {unusedPresets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onAddValue(p)}
              className="rounded-full border border-dashed border-[var(--color-border)] px-2 py-0.5 text-xs text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              + {p}
            </button>
          ))}
        </div>
      )}

      {/* Custom value input */}
      <div className="flex gap-2">
        <Input
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const v = inputVal.trim();
              if (v && !values.includes(v)) { onAddValue(v); setInputVal(""); }
            }
          }}
          placeholder={`Add custom ${optionType.toLowerCase()}…`}
          className="h-8 text-sm"
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            const v = inputVal.trim();
            if (v && !values.includes(v)) { onAddValue(v); setInputVal(""); }
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
}

// ── Main VariantManager ────────────────────────────────────────────────────────

export function VariantManager({ basePrice, variants, onChange, className }: VariantManagerProps) {
  // Option groups: { type: string, values: string[] }[]
  const [optionGroups, setOptionGroups] = useState<{ type: string; values: string[] }[]>([]);
  const [newTypeName, setNewTypeName] = useState("");
  const [expanded, setExpanded] = useState(true);

  // ── Option group helpers ───────────────────────────────────────────────────

  const addOptionType = (typeName: string) => {
    const name = typeName.trim();
    if (!name || optionGroups.some((g) => g.type === name)) return;
    const updated = [...optionGroups, { type: name, values: [] }];
    setOptionGroups(updated);
    setNewTypeName("");
    regenerateVariants(updated);
  };

  const removeOptionType = (typeName: string) => {
    const updated = optionGroups.filter((g) => g.type !== typeName);
    setOptionGroups(updated);
    regenerateVariants(updated);
  };

  const addValue = (typeName: string, value: string) => {
    const updated = optionGroups.map((g) =>
      g.type === typeName ? { ...g, values: [...g.values, value] } : g
    );
    setOptionGroups(updated);
    regenerateVariants(updated);
  };

  const removeValue = (typeName: string, value: string) => {
    const updated = optionGroups.map((g) =>
      g.type === typeName ? { ...g, values: g.values.filter((v) => v !== value) } : g
    );
    setOptionGroups(updated);
    regenerateVariants(updated);
  };

  // ── Auto-generate variants from option combinations ────────────────────────

  const regenerateVariants = (groups: { type: string; values: string[] }[]) => {
    const filledGroups = groups.filter((g) => g.values.length > 0);
    if (filledGroups.length === 0) { onChange([]); return; }
    const combos = cartesian(filledGroups);
    const newVariants: VariantRow[] = combos.map((combo) => {
      const label = combo.map((o) => o.value).join("-");
      // Preserve existing row data if the combo already exists
      const existing = variants.find((v) =>
        v.options.length === combo.length &&
        combo.every((o) => v.options.some((vo) => vo.type === o.type && vo.value === o.value))
      );
      return existing ?? {
        id: uid(),
        options: combo,
        sku: label.toLowerCase().replace(/\s+/g, "-"),
        price: basePrice,
        salePrice: "",
        stock: 0,
      };
    });
    onChange(newVariants);
  };

  // ── Variant row edit helpers ───────────────────────────────────────────────

  const updateVariant = (id: string, field: keyof VariantRow, value: unknown) => {
    onChange(variants.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
  };

  const removeVariant = (id: string) => {
    onChange(variants.filter((v) => v.id !== id));
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
          Product Variants
        </h3>
        <button
          type="button"
          onClick={() => setExpanded((x) => !x)}
          className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {expanded ? "Collapse" : "Expand"}
        </button>
      </div>

      {expanded && (
        <>
          {/* Step 1: Option types */}
          <div className="space-y-3">
            {optionGroups.map((group) => (
              <OptionTypeSection
                key={group.type}
                optionType={group.type}
                values={group.values}
                onAddValue={(v) => addValue(group.type, v)}
                onRemoveValue={(v) => removeValue(group.type, v)}
                onRemoveType={() => removeOptionType(group.type)}
              />
            ))}

            {/* Add option type */}
            <div className="flex gap-2">
              <div className="flex flex-1 gap-1.5 flex-wrap">
                {PRESET_TYPES.filter((t) => !optionGroups.some((g) => g.type === t)).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => addOptionType(t)}
                    className="flex items-center gap-1 rounded-full border border-dashed border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                  >
                    <Plus className="h-3 w-3" /> {t}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); addOptionType(newTypeName); }
                  }}
                  placeholder="Custom type…"
                  className="h-8 w-36 text-sm"
                />
                <Button type="button" size="sm" variant="outline" onClick={() => addOptionType(newTypeName)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Step 2: Generated variant table */}
          {variants.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-alt)]">
                    <th className="px-3 py-2 text-left font-medium text-[var(--color-text-secondary)]">Variant</th>
                    <th className="px-3 py-2 text-left font-medium text-[var(--color-text-secondary)]">SKU</th>
                    <th className="px-3 py-2 text-left font-medium text-[var(--color-text-secondary)]">Price</th>
                    <th className="px-3 py-2 text-left font-medium text-[var(--color-text-secondary)]">Sale</th>
                    <th className="px-3 py-2 text-left font-medium text-[var(--color-text-secondary)]">Stock</th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {variants.map((v) => (
                    <tr key={v.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-alt)]">
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap gap-1">
                          {v.options.map((o) => (
                            <Badge key={o.type} variant="secondary" className="text-xs">
                              {o.type}: {o.value}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          value={v.sku}
                          onChange={(e) => updateVariant(v.id, "sku", e.target.value)}
                          className="h-7 min-w-[100px] text-xs"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          type="number"
                          min={0}
                          step={0.01}
                          value={String(v.price)}
                          onChange={(e) => updateVariant(v.id, "price", parseFloat(e.target.value) || 0)}
                          className="h-7 w-24 text-xs"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          type="number"
                          min={0}
                          step={0.01}
                          value={v.salePrice === "" ? "" : String(v.salePrice)}
                          onChange={(e) =>
                            updateVariant(v.id, "salePrice", e.target.value === "" ? "" : parseFloat(e.target.value) || 0)
                          }
                          placeholder="—"
                          className="h-7 w-24 text-xs"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          type="number"
                          min={0}
                          step={1}
                          value={String(v.stock)}
                          onChange={(e) => updateVariant(v.id, "stock", parseInt(e.target.value) || 0)}
                          className="h-7 w-20 text-xs"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => removeVariant(v.id)}
                          className="text-[var(--color-error)] hover:opacity-80"
                          aria-label="Remove variant"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border-t border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-2">
                <p className="text-xs text-[var(--color-text-muted)]">
                  {variants.length} variant{variants.length !== 1 ? "s" : ""} · Edit SKU, price, sale price and stock per row
                </p>
              </div>
            </div>
          )}

          {optionGroups.length === 0 && (
            <p className="text-xs text-[var(--color-text-muted)]">
              Add an option type (e.g. Color, Size) to generate variants automatically.
            </p>
          )}
        </>
      )}
    </div>
  );
}
