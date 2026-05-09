"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Circle,
  Copy,
  Eye,
  FileJson,
  GripVertical,
  ImageIcon,
  Layout,
  MessageCircle,
  MonitorSmartphone,
  PencilLine,
  Plus,
  Quote,
  RotateCcw,
  Save,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Tag,
  Timer,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductImageUploader } from "@/components/admin/product-image-uploader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ICON_KEYS } from "@/lib/icon-registry";
import {
  HERO_THEME_PRESETS,
  HOMEPAGE_BLOCK_KEYS,
  HOMEPAGE_DEFAULTS,
  type DiscoveryData,
  type EditorialCardData,
  type EditorialData,
  type FlashSaleData,
  type HeroSlideData,
  type HeroThemeName,
  type HomepageBlockKey,
  type NeedTileData,
  type NeedsData,
  type TestimonialData,
  type TestimonialsData,
  type TickerItem,
  type TrustData,
  type TrustItemData,
  type WhatsAppData,
} from "@/modules/storefront/homepage-defaults";

interface Block {
  blockKey: string;
  data: unknown;
  isActive: boolean;
  isCustomized: boolean;
  updatedAt: string | null;
}

type ViewMode = "design" | "json";

const BLOCK_META: Record<
  HomepageBlockKey,
  {
    title: string;
    shortTitle: string;
    description: string;
    plainHelp: string;
    icon: LucideIcon;
  }
> = {
  hero: {
    title: "Homepage Slider",
    shortTitle: "Slider",
    description: "The Allfather-style product slider customers see first.",
    plainHelp:
      "Edit each slide's product image, card label, copy, big overlay text, colors, button, and product facts.",
    icon: SlidersHorizontal,
  },
  ticker: {
    title: "Top Trust Ticker",
    shortTitle: "Ticker",
    description: "Small moving messages above the storefront header.",
    plainHelp: "Use this for delivery, return, COD, support, and secure checkout promises.",
    icon: Tag,
  },
  discovery: {
    title: "Search Discovery",
    shortTitle: "Search",
    description: "The guided search panel below the hero.",
    plainHelp: "Set the search headline, placeholder, and trending searches.",
    icon: Search,
  },
  needs: {
    title: "Shop by Need",
    shortTitle: "Needs",
    description: "Intent tiles for people who do not know the exact category.",
    plainHelp: "Add tiles like gifts, Eid, office, home, premium, or budget shopping.",
    icon: Layout,
  },
  trust: {
    title: "Trust Badges",
    shortTitle: "Trust",
    description: "Clickable proof points that reduce buyer hesitation.",
    plainHelp: "Write short promises and simple details customers can understand quickly.",
    icon: ShieldCheck,
  },
  editorial: {
    title: "Editorial Collections",
    shortTitle: "Editorial",
    description: "Brand-story collection cards for premium merchandising.",
    plainHelp: "Create curated collection cards with a title, description, and link.",
    icon: ImageIcon,
  },
  testimonials: {
    title: "Testimonials",
    shortTitle: "Reviews",
    description: "Customer quotes shown near the lower homepage.",
    plainHelp: "Keep reviews short, real, and easy to scan.",
    icon: Quote,
  },
  whatsapp: {
    title: "WhatsApp Commerce",
    shortTitle: "WhatsApp",
    description: "WhatsApp CTA and floating support message.",
    plainHelp: "Set the phone number, opening message, and support section text.",
    icon: MessageCircle,
  },
  flashSale: {
    title: "Flash Sale",
    shortTitle: "Sale",
    description: "Countdown campaign block using best-selling products.",
    plainHelp: "Set the sale title and countdown duration.",
    icon: Timer,
  },
};

function isBlockKey(key: string): key is HomepageBlockKey {
  return (HOMEPAGE_BLOCK_KEYS as readonly string[]).includes(key);
}

function cloneData<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function draftString(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

const DEFAULT_HERO_SLIDE = HOMEPAGE_DEFAULTS.hero[0] as HeroSlideData;
const HERO_THEME_NAMES = Object.keys(HERO_THEME_PRESETS) as HeroThemeName[];
const HERO_LIMITS = {
  eyebrow: 28,
  productName: 30,
  titleLine: 22,
  description: 120,
  button: 18,
  bigWord: 12,
};

const HERO_IMAGE_PRESETS = [
  {
    label: "Quran",
    src: "/images/hero/hero-quran.png",
    alt: "Premium Quran with emerald and gold cover",
  },
  {
    label: "Gift Box",
    src: "/images/hero/hero-gift-box.png",
    alt: "Islamic gift box with Quran, tasbih, and prayer essentials",
  },
  {
    label: "Prayer Mat",
    src: "/images/hero/hero-prayer-mat.png",
    alt: "Folded prayer mat with tasbih beads",
  },
];

function textLength(value?: string | null) {
  return value?.trim().length ?? 0;
}

function isHeroTextTooLong(field: keyof typeof HERO_LIMITS, value?: string | null) {
  return textLength(value) > HERO_LIMITS[field];
}

function recommendedText(field: keyof typeof HERO_LIMITS) {
  const labels: Record<keyof typeof HERO_LIMITS, string> = {
    eyebrow: "Recommended under 28 characters.",
    productName: "Recommended under 30 characters.",
    titleLine: "Recommended under 22 characters per line.",
    description: "Recommended under 120 characters.",
    button: "Recommended under 18 characters.",
    bigWord: "Recommended under 12 characters.",
  };
  return labels[field];
}

export function HomepageManager({
  initialBlock = "hero",
  sliderOnly = false,
}: {
  initialBlock?: HomepageBlockKey;
  sliderOnly?: boolean;
} = {}) {
  const [blocks, setBlocks] = useState<Block[] | null>(null);
  const [active, setActive] = useState<HomepageBlockKey>(initialBlock);
  const [draftData, setDraftData] = useState<unknown>(null);
  const [draftActive, setDraftActive] = useState(true);
  const [jsonDraft, setJsonDraft] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("design");

  const activeBlock = useMemo(
    () => blocks?.find((block) => block.blockKey === active) ?? null,
    [active, blocks],
  );

  const hasUnsavedChanges = useMemo(() => {
    if (!activeBlock) return false;
    return (
      draftString(activeBlock.data) !== draftString(draftData) ||
      activeBlock.isActive !== draftActive
    );
  }, [activeBlock, draftActive, draftData]);

  function selectLoadedBlock(block: Block) {
    if (!isBlockKey(block.blockKey)) return;
    const data = cloneData(block.data);
    setActive(block.blockKey);
    setDraftData(data);
    setDraftActive(block.isActive);
    setJsonDraft(draftString(data));
    setParseError(null);
    setViewMode("design");
  }

  const load = async (preferredKey?: HomepageBlockKey) => {
    const res = await fetch("/api/v1/admin/homepage", { cache: "no-store" });
    if (!res.ok) {
      toast.error("Failed to load homepage sections");
      return;
    }

    const json = await res.json();
    const list: Block[] = (json?.data ?? []).filter((block: Block) => isBlockKey(block.blockKey));
    setBlocks(list);

    const nextKey = preferredKey ?? active ?? initialBlock;
    const current =
      list.find((block) => block.blockKey === nextKey) ??
      list.find((block) => block.blockKey === "hero") ??
      list[0];

    if (current && isBlockKey(current.blockKey)) {
      selectLoadedBlock(current);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load(initialBlock);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectBlock = (key: HomepageBlockKey) => {
    if (!blocks) return;
    const block = blocks.find((item) => item.blockKey === key);
    if (!block) return;
    selectLoadedBlock(block);
  };

  const updateDraft = (value: unknown) => {
    setDraftData(value);
    setJsonDraft(draftString(value));
    setParseError(null);
  };

  const validateJson = (): unknown | null => {
    try {
      const parsed = JSON.parse(jsonDraft);
      setParseError(null);
      return parsed;
    } catch (error) {
      setParseError(error instanceof Error ? error.message : "Invalid JSON");
      return null;
    }
  };

  const applyJsonToDesigner = () => {
    const parsed = validateJson();
    if (parsed === null) {
      toast.error("Fix the JSON before applying it");
      return;
    }
    setDraftData(parsed);
    setViewMode("design");
    toast.success("JSON applied to visual editor");
  };

  const save = async () => {
    const dataToSave = viewMode === "json" ? validateJson() : draftData;
    if (dataToSave === null) {
      toast.error("Fix the JSON before saving");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/v1/admin/homepage/${active}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: dataToSave, isActive: draftActive }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        toast.error(json?.error?.message ?? "Save failed");
      } else {
        toast.success(`Saved ${BLOCK_META[active].title}`);
        await load(active);
      }
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    if (!confirm("Reset this section to default content? Your edits will be lost.")) {
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/v1/admin/homepage/${active}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        toast.error("Reset failed");
      } else {
        toast.success("Section reset to default");
        await load(active);
      }
    } finally {
      setSaving(false);
    }
  };

  if (!blocks || draftData === null) {
    return (
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 text-sm text-[var(--color-text-secondary)] shadow-sm">
        Loading homepage editor...
      </div>
    );
  }

  const meta = BLOCK_META[active];
  const ActiveIcon = meta.icon;
  const activeIndex = HOMEPAGE_BLOCK_KEYS.indexOf(active) + 1;

  return (
    <div className="space-y-5">
      {!sliderOnly && (
        <section className="overflow-hidden rounded-2xl border border-[#2f2a22] bg-[#1a1814] text-white shadow-lg">
          <div className="grid gap-6 p-5 lg:grid-cols-[1fr,360px] lg:p-6">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-[var(--color-accent)] text-white">
                  Homepage command center
                </Badge>
                <Badge variant="outline" className="border-white/20 text-white">
                  {blocks.filter((block) => block.isActive).length} sections live
                </Badge>
                {hasUnsavedChanges && (
                  <Badge className="bg-[#f5b94f] text-[#1a1814]">Unsaved changes</Badge>
                )}
              </div>

              <div>
                <h2 className="max-w-3xl text-2xl font-semibold text-white md:text-3xl">
                  Edit the storefront like a simple checklist, not a code file.
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
                  Pick a section, change the visible words, preview the result, then save. The
                  advanced JSON editor is still here, but normal editing stays friendly.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <MiniStat label="Current section" value={meta.shortTitle} icon={ActiveIcon} />
                <MiniStat
                  label="Position"
                  value={`${activeIndex} of ${HOMEPAGE_BLOCK_KEYS.length}`}
                  icon={GripVertical}
                />
                <MiniStat
                  label="Storefront"
                  value={draftActive ? "Visible" : "Hidden"}
                  icon={draftActive ? CheckCircle2 : Circle}
                />
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-xs tracking-[0.2em] text-white/45 uppercase">Selected</p>
                  <h3 className="mt-1 text-lg font-semibold text-white">{meta.title}</h3>
                </div>
                <ActiveIcon className="h-6 w-6 text-[var(--color-accent-light)]" />
              </div>
              <p className="text-sm leading-6 text-white/70">{meta.plainHelp}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild variant="secondary" size="sm" className="gap-2">
                  <a href="/" target="_blank" rel="noreferrer">
                    <Eye className="h-4 w-4" />
                    View storefront
                  </a>
                </Button>
                <Button
                  size="sm"
                  className="gap-2"
                  onClick={save}
                  disabled={saving || !hasUnsavedChanges}
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className={cn("grid gap-5", sliderOnly ? "grid-cols-1" : "xl:grid-cols-[300px,1fr]")}>
        {!sliderOnly && (
          <aside className="space-y-3">
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-3 shadow-sm">
              <div className="mb-3 px-2">
                <p className="text-xs font-semibold tracking-[0.18em] text-[var(--color-text-muted)] uppercase">
                  Homepage sections
                </p>
              </div>
              <div className="space-y-1.5">
                {HOMEPAGE_BLOCK_KEYS.map((key, index) => {
                  const item = blocks.find((block) => block.blockKey === key);
                  const itemMeta = BLOCK_META[key];
                  const ItemIcon = itemMeta.icon;
                  const isActive = active === key;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => selectBlock(key)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all",
                        isActive
                          ? "border-[var(--color-accent)] bg-[var(--color-accent-light)]/35 shadow-sm"
                          : "border-transparent hover:border-[var(--color-border)] hover:bg-[var(--color-surface-alt)]",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                          isActive
                            ? "bg-[var(--color-accent)] text-white"
                            : "bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)]",
                        )}
                      >
                        <ItemIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[var(--color-text-muted)]">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="truncate text-sm font-semibold">{itemMeta.title}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                          <span>{item?.isActive ? "Visible" : "Hidden"}</span>
                          {item?.isCustomized && <span>Edited</span>}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        )}

        <section className="min-w-0 space-y-5">
          <div className="rounded-2xl border border-[var(--color-border)] bg-white shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--color-border)] p-4 md:p-5">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-surface-alt)] text-[var(--color-accent-dark)]">
                  <ActiveIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold">{meta.title}</h2>
                  <p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">
                    {meta.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <label className="flex h-9 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 text-sm">
                  <Switch checked={draftActive} onCheckedChange={setDraftActive} size="sm" />
                  Show section
                </label>
                {!sliderOnly && (
                  <Button
                    variant={viewMode === "design" ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setViewMode("design")}
                    className="gap-2"
                  >
                    <PencilLine className="h-4 w-4" />
                    Easy edit
                  </Button>
                )}
                {!sliderOnly && (
                  <Button
                    variant={viewMode === "json" ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setViewMode("json")}
                    className="gap-2"
                  >
                    <FileJson className="h-4 w-4" />
                    JSON
                  </Button>
                )}
              </div>
            </div>

            {viewMode === "design" ? (
              <div
                className={cn(
                  "grid gap-0",
                  sliderOnly
                    ? "xl:grid-cols-[minmax(0,1fr),420px]"
                    : "lg:grid-cols-[minmax(0,1fr),360px]",
                )}
              >
                <div className="min-w-0 p-4 md:p-5">
                  <SectionEditor blockKey={active} data={draftData} onChange={updateDraft} />
                </div>
                <div className="border-t border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 md:p-5 lg:border-t-0 lg:border-l">
                  <div className="sticky top-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold tracking-[0.18em] text-[var(--color-text-muted)] uppercase">
                          Live feel
                        </p>
                        <h3 className="mt-1 text-base font-semibold">
                          {sliderOnly ? "Slider preview" : "Simple preview"}
                        </h3>
                      </div>
                      <MonitorSmartphone className="h-5 w-5 text-[var(--color-accent-dark)]" />
                    </div>
                    <SectionPreview blockKey={active} data={draftData} isActive={draftActive} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 p-4 md:p-5">
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                  Use this only when you know the structure. The easy editor is safer for daily use.
                </div>
                <Textarea
                  value={jsonDraft}
                  onChange={(event) => {
                    setJsonDraft(event.target.value);
                    setParseError(null);
                  }}
                  spellCheck={false}
                  className="min-h-[520px] resize-y bg-white font-mono text-xs leading-relaxed"
                />
                {parseError && <ErrorBox message={parseError} />}
                <Button variant="secondary" onClick={applyJsonToDesigner} className="gap-2">
                  <FileJson className="h-4 w-4" />
                  Apply JSON to easy editor
                </Button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-white p-3 shadow-sm">
            <Button
              variant="ghost"
              onClick={reset}
              disabled={saving || !activeBlock?.isCustomized}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset to default
            </Button>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => selectBlock(active)}
                disabled={saving || !hasUnsavedChanges}
              >
                Discard changes
              </Button>
              <Button onClick={save} disabled={saving || !hasUnsavedChanges} className="gap-2">
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save section"}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.06] p-3">
      <div className="mb-2 flex items-center gap-2 text-white/55">
        <Icon className="h-4 w-4" />
        <span className="text-xs">{label}</span>
      </div>
      <p className="truncate text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function SectionEditor({
  blockKey,
  data,
  onChange,
}: {
  blockKey: HomepageBlockKey;
  data: unknown;
  onChange: (value: unknown) => void;
}) {
  switch (blockKey) {
    case "hero":
      return <HeroEditor data={data as HeroSlideData[]} onChange={onChange} />;
    case "ticker":
      return <TickerEditor data={data as { items: TickerItem[] }} onChange={onChange} />;
    case "discovery":
      return <DiscoveryEditor data={data as DiscoveryData} onChange={onChange} />;
    case "needs":
      return <NeedsEditor data={data as NeedsData} onChange={onChange} />;
    case "trust":
      return <TrustEditor data={data as TrustData} onChange={onChange} />;
    case "editorial":
      return <EditorialEditor data={data as EditorialData} onChange={onChange} />;
    case "testimonials":
      return <TestimonialsEditor data={data as TestimonialsData} onChange={onChange} />;
    case "whatsapp":
      return <WhatsAppEditor data={data as WhatsAppData} onChange={onChange} />;
    case "flashSale":
      return <FlashSaleEditor data={data as FlashSaleData} onChange={onChange} />;
    default:
      return null;
  }
}

function HeroEditor({
  data,
  onChange,
}: {
  data: HeroSlideData[];
  onChange: (value: HeroSlideData[]) => void;
}) {
  const slides = Array.isArray(data) ? data : [];
  const activeSlides = slides.filter((slide) => (slide.status ?? "active") === "active").length;
  const draftSlides = slides.length - activeSlides;

  const updateSlide = (index: number, patch: Partial<HeroSlideData>) => {
    onChange(slides.map((slide, i) => (i === index ? { ...slide, ...patch } : slide)));
  };

  const moveSlide = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= slides.length) return;
    const nextSlides = [...slides];
    const [item] = nextSlides.splice(index, 1);
    if (!item) return;
    nextSlides.splice(nextIndex, 0, item);
    onChange(nextSlides);
  };

  const updateTitleLine1 = (index: number, value: string) =>
    updateSlide(index, { titleLine1: value, title: value });

  const updateTitleLine2 = (index: number, value: string) =>
    updateSlide(index, { titleLine2: value, highlight: value });

  const updateDescription = (index: number, value: string) =>
    updateSlide(index, { description: value, subtitle: value });

  const updatePrimaryButton = (index: number, patch: Partial<{ label: string; href: string }>) => {
    const slide = slides[index];
    const current = slide?.ctaPrimary ?? { label: "Shop Now", href: "/products" };
    updateSlide(index, {
      ctaPrimary: { ...current, ...patch },
      ...(patch.label !== undefined ? { primaryButtonText: patch.label } : {}),
      ...(patch.href !== undefined ? { primaryButtonLink: patch.href } : {}),
    });
  };

  const updateInfoItem = (
    slideIndex: number,
    itemIndex: number,
    patch: Partial<{ label: string; value: string }>,
  ) => {
    const items = slides[slideIndex]?.infoItems ?? [];
    updateSlide(slideIndex, {
      infoItems: items.map((item, index) => (index === itemIndex ? { ...item, ...patch } : item)),
    });
  };

  const addSlide = () => {
    const base = cloneData(DEFAULT_HERO_SLIDE);
    const nextSlide: HeroSlideData = {
      ...base,
      id: makeId("hero"),
      status: "active",
      eyebrow: "New Arrival",
      title: "Remember Allah",
      titleLine1: "Remember Allah",
      highlight: "Every Day",
      titleLine2: "Every Day",
      subheading: "Premium Tasbih",
      productName: "Premium Tasbih",
      metadataLine: "Collection / New Arrival",
      cardName: "Tasbih",
      shortName: "Tasbih",
      decoration: "DHIKR",
      bigWord1: "DHIKR",
      bigWord2: "DAILY",
      subtitle: "Elegant tasbih selected for daily dhikr and thoughtful Islamic gifting.",
      description: "Elegant tasbih selected for daily dhikr and thoughtful Islamic gifting.",
      ctaPrimary: { label: "Shop Now", href: "/products" },
      primaryButtonText: "Shop Now",
      primaryButtonLink: "/products",
      productImage: "/images/hero/hero-prayer-mat.png",
      productImageAlt: "Folded prayer mat with tasbih beads",
      infoItems: [
        { label: "Use", value: "Daily" },
        { label: "Gift", value: "Ready" },
        { label: "Payment", value: "COD" },
      ],
      theme: "cream",
    };
    onChange([...slides, nextSlide]);
  };

  return (
    <div className="space-y-4">
      <EditorIntro
        title="Slider builder"
        body="Build premium editorial slides with fixed structure: metadata, product image, huge background words, story copy, CTA, bottom facts, and safe theme presets."
      />
      <div className="flex flex-wrap gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3 text-sm">
        <Badge variant="secondary">{slides.length} total slides</Badge>
        <Badge variant="secondary">{activeSlides} visible on storefront</Badge>
        {draftSlides > 0 && <Badge variant="outline">{draftSlides} draft hidden</Badge>}
      </div>
      {slides.map((slide, index) => {
        const infoItems = slide.infoItems ?? [];
        const hasThreeFacts = infoItems.length >= 3;

        return (
          <EditablePanel
            key={slide.id ?? index}
            title={`Slide ${index + 1}`}
            subtitle={slide.title || "Untitled hero slide"}
            onDuplicate={() => onChange([...slides, { ...cloneData(slide), id: makeId("hero") }])}
            onRemove={
              slides.length > 1 ? () => onChange(slides.filter((_, i) => i !== index)) : undefined
            }
          >
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-white p-3">
              <div>
                <p className="text-sm font-semibold">Slide order</p>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  This controls the storefront carousel order and thumbnail numbers.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => moveSlide(index, -1)}
                  disabled={index === 0}
                  className="gap-2"
                >
                  <ArrowUp className="h-4 w-4" />
                  Up
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => moveSlide(index, 1)}
                  disabled={index === slides.length - 1}
                  className="gap-2"
                >
                  <ArrowDown className="h-4 w-4" />
                  Down
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3">
              <div>
                <p className="text-sm font-semibold">Publishing status</p>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  Draft slides are saved in admin but hidden from the storefront.
                </p>
              </div>
              <label className="flex items-center gap-2 text-sm font-semibold">
                <Switch
                  checked={(slide.status ?? "active") === "active"}
                  onCheckedChange={(checked) =>
                    updateSlide(index, { status: checked ? "active" : "draft" })
                  }
                  size="sm"
                />
                {(slide.status ?? "active") === "active" ? "Active" : "Draft"}
              </label>
            </div>

            {(slide.status ?? "active") === "active" && !slide.productImage && (
              <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                No image selected. The storefront will use a safe Niyamah fallback image, but a
                product image is recommended.
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-3">
              <SafeFormField
                label="Thumbnail label"
                value={slide.shortName ?? slide.cardName}
                limitKey="productName"
              >
                <Input
                  value={slide.shortName ?? slide.cardName ?? ""}
                  onChange={(event) =>
                    updateSlide(index, {
                      shortName: event.target.value,
                    })
                  }
                />
              </SafeFormField>
              <SafeFormField label="Card name" value={slide.cardName} limitKey="productName">
                <Input
                  value={slide.cardName ?? ""}
                  onChange={(event) => updateSlide(index, { cardName: event.target.value })}
                />
              </SafeFormField>
              <SafeFormField
                label="Product name"
                value={slide.productName}
                limitKey="productName"
              >
                <Input
                  value={slide.productName ?? ""}
                  onChange={(event) => updateSlide(index, { productName: event.target.value })}
                />
              </SafeFormField>
              <SafeFormField
                label="Right metadata"
                hint="Appears under the product name in the right arch area"
                value={slide.metadataLine ?? slide.badge}
                limitKey="productName"
              >
                <Input
                  value={slide.metadataLine ?? slide.badge ?? ""}
                  onChange={(event) =>
                    updateSlide(index, {
                      metadataLine: event.target.value,
                      badge: event.target.value,
                    })
                  }
                />
              </SafeFormField>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <SafeFormField
                label="Small label"
                hint="Appears above the heading in the green copy area"
                value={slide.eyebrow}
                limitKey="eyebrow"
              >
                <Input
                  value={slide.eyebrow ?? ""}
                  onChange={(event) => updateSlide(index, { eyebrow: event.target.value })}
                />
              </SafeFormField>
              <SafeFormField label="Product promise" value={slide.subheading} limitKey="productName">
                <Input
                  value={slide.subheading ?? ""}
                  onChange={(event) => updateSlide(index, { subheading: event.target.value })}
                />
              </SafeFormField>
              <SafeFormField
                label="Title line 1"
                value={slide.titleLine1 ?? slide.title}
                limitKey="titleLine"
              >
                <Input
                  value={slide.titleLine1 ?? slide.title ?? ""}
                  onChange={(event) => updateTitleLine1(index, event.target.value)}
                />
              </SafeFormField>
              <SafeFormField
                label="Title line 2"
                value={slide.titleLine2 ?? slide.highlight}
                limitKey="titleLine"
              >
                <Input
                  value={slide.titleLine2 ?? slide.highlight ?? ""}
                  onChange={(event) => updateTitleLine2(index, event.target.value)}
                />
              </SafeFormField>
              <SafeFormField
                label="Primary button text"
                value={slide.primaryButtonText ?? slide.ctaPrimary?.label}
                limitKey="button"
              >
                <Input
                  value={slide.primaryButtonText ?? slide.ctaPrimary?.label ?? ""}
                  onChange={(event) => updatePrimaryButton(index, { label: event.target.value })}
                />
              </SafeFormField>
              <FormField label="Primary button link">
                <Input
                  value={slide.primaryButtonLink ?? slide.ctaPrimary?.href ?? ""}
                  onChange={(event) => updatePrimaryButton(index, { href: event.target.value })}
                />
              </FormField>
            </div>
            <SafeFormField
              label="Paragraph"
              hint="One or two sentences. Keep it warm and direct."
              value={slide.description ?? slide.subtitle}
              limitKey="description"
            >
              <Textarea
                value={slide.description ?? slide.subtitle ?? ""}
                onChange={(event) => updateDescription(index, event.target.value)}
                className="min-h-24"
              />
            </SafeFormField>

            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3">
              <div className="mb-3">
                <h4 className="text-sm font-semibold">Huge background words</h4>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  These are the faint oversized words behind the product and headline.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <SafeFormField
                  label="Big word 1"
                  value={slide.bigWord1 ?? slide.decoration}
                  limitKey="bigWord"
                >
                  <Input
                    value={slide.bigWord1 ?? slide.decoration ?? ""}
                    onChange={(event) =>
                      updateSlide(index, {
                        bigWord1: event.target.value.toUpperCase(),
                        decoration: event.target.value.toUpperCase(),
                      })
                    }
                  />
                </SafeFormField>
                <SafeFormField
                  label="Big word 2"
                  value={slide.bigWord2 ?? slide.highlight}
                  limitKey="bigWord"
                >
                  <Input
                    value={slide.bigWord2 ?? ""}
                    onChange={(event) =>
                      updateSlide(index, { bigWord2: event.target.value.toUpperCase() })
                    }
                  />
                </SafeFormField>
              </div>
            </div>

            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3">
              <div className="mb-3">
                <h4 className="text-sm font-semibold">Product image</h4>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  This becomes the large central hero object. Transparent PNG or clean product cutout recommended.
                </p>
              </div>
              <FormField
                label="Upload / choose product image"
                hint="Uploads to the admin media endpoint and uses the uploaded image for this slide."
              >
                <ProductImageUploader
                  value={slide.productImage ? [slide.productImage] : []}
                  maxImages={1}
                  onChange={(urls) => updateSlide(index, { productImage: urls[0] ?? "" })}
                />
              </FormField>

              <div className="mt-4">
                <p className="mb-2 text-sm font-semibold">Built-in Niyamah images</p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {HERO_IMAGE_PRESETS.map((preset) => (
                    <button
                      key={preset.src}
                      type="button"
                      onClick={() =>
                        updateSlide(index, {
                          productImage: preset.src,
                          productImageAlt: preset.alt,
                        })
                      }
                      className={cn(
                        "flex items-center gap-3 rounded-xl border bg-white p-2 text-left transition-all hover:border-[var(--color-accent)]",
                        slide.productImage === preset.src
                          ? "border-[var(--color-accent)] shadow-sm"
                          : "border-[var(--color-border)]",
                      )}
                    >
                      <div className="relative h-14 w-14 shrink-0 rounded-lg bg-[var(--color-surface-alt)]">
                        <Image
                          src={preset.src}
                          alt=""
                          fill
                          sizes="56px"
                          className="object-contain p-1.5"
                        />
                      </div>
                      <span className="text-sm font-semibold">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <details className="mt-3 rounded-lg border border-[var(--color-border)] bg-white p-3">
                <summary className="cursor-pointer text-sm font-semibold text-[var(--color-text-secondary)]">
                  Advanced image fields
                </summary>
                <div className="mt-3 grid gap-4 md:grid-cols-2">
                  <FormField label="Image URL">
                    <Input
                      value={slide.productImage ?? ""}
                      onChange={(event) => updateSlide(index, { productImage: event.target.value })}
                    />
                  </FormField>
                  <FormField label="Product image alt text">
                    <Input
                      value={slide.productImageAlt ?? ""}
                      onChange={(event) =>
                        updateSlide(index, { productImageAlt: event.target.value })
                      }
                    />
                  </FormField>
                </div>
              </details>
            </div>

            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-semibold">Bottom product facts</h4>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    Shown under the main story copy on the storefront. Keep this to three short facts.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    !hasThreeFacts &&
                    updateSlide(index, {
                      infoItems: [...infoItems, { label: "Label", value: "Value" }],
                    })
                  }
                  disabled={hasThreeFacts}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add fact
                </Button>
              </div>
              <div className="space-y-2">
                {infoItems.map((item, itemIndex) => (
                  <InlineRow
                    key={itemIndex}
                    onRemove={() =>
                      updateSlide(index, {
                        infoItems: infoItems.filter((_, i) => i !== itemIndex),
                      })
                    }
                  >
                    <Input
                      value={item.label}
                      onChange={(event) =>
                        updateInfoItem(index, itemIndex, { label: event.target.value })
                      }
                      placeholder="Label"
                    />
                    <Input
                      value={item.value}
                      onChange={(event) =>
                        updateInfoItem(index, itemIndex, { value: event.target.value })
                      }
                      placeholder="Value"
                    />
                  </InlineRow>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3">
              <h4 className="text-sm font-semibold">Theme preset</h4>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                Choose one approved preset. Random colors are locked so the storefront keeps a
                premium, consistent look.
              </p>
              <div className="mt-3 grid gap-3 md:grid-cols-4">
                {HERO_THEME_NAMES.map((themeName) => {
                  const theme = HERO_THEME_PRESETS[themeName];
                  const selected = (slide.theme ?? "cream") === themeName;
                  return (
                    <button
                      key={themeName}
                      type="button"
                      onClick={() => updateSlide(index, { theme: themeName })}
                      className={cn(
                        "rounded-xl border p-3 text-left transition-all",
                        selected
                          ? "border-[var(--color-accent)] shadow-sm"
                          : "border-[var(--color-border)] bg-white hover:border-[var(--color-accent)]",
                      )}
                    >
                      <div
                        className="mb-3 h-10 rounded-lg border"
                        style={{ backgroundColor: theme.bg, borderColor: theme.accent }}
                      />
                      <p className="text-sm font-semibold">{theme.label}</p>
                      <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                        Accent {theme.accent}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </EditablePanel>
        );
      })}
      <Button variant="outline" onClick={addSlide} className="gap-2">
        <Plus className="h-4 w-4" />
        Add slider slide
      </Button>
    </div>
  );
}

function TickerEditor({
  data,
  onChange,
}: {
  data: { items: TickerItem[] };
  onChange: (value: { items: TickerItem[] }) => void;
}) {
  const items = Array.isArray(data?.items) ? data.items : [];
  const update = (index: number, patch: Partial<TickerItem>) => {
    onChange({ items: items.map((item, i) => (i === index ? { ...item, ...patch } : item)) });
  };

  return (
    <ListEditorShell
      title="Ticker messages"
      body="Short trust messages that move across the top of the site."
      addLabel="Add message"
      onAdd={() =>
        onChange({ items: [...items, { icon: "truck", text: "Free delivery over Tk 2000" }] })
      }
    >
      {items.map((item, index) => (
        <InlineRow
          key={index}
          onRemove={() => onChange({ items: items.filter((_, i) => i !== index) })}
        >
          <IconSelect value={item.icon} onChange={(icon) => update(index, { icon })} />
          <Input
            value={item.text}
            onChange={(event) => update(index, { text: event.target.value })}
            placeholder="Ticker message"
          />
        </InlineRow>
      ))}
    </ListEditorShell>
  );
}

function DiscoveryEditor({
  data,
  onChange,
}: {
  data: DiscoveryData;
  onChange: (value: DiscoveryData) => void;
}) {
  const update = (patch: Partial<DiscoveryData>) => onChange({ ...data, ...patch });

  return (
    <div className="space-y-5">
      <EditorIntro
        title="Search discovery panel"
        body="Make the search area feel guided, helpful, and not empty."
      />
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Small label">
          <Input
            value={data.eyebrow ?? ""}
            onChange={(event) => update({ eyebrow: event.target.value })}
          />
        </FormField>
        <FormField label="Search placeholder">
          <Input
            value={data.placeholder ?? ""}
            onChange={(event) => update({ placeholder: event.target.value })}
          />
        </FormField>
      </div>
      <FormField label="Title">
        <Input
          value={data.title ?? ""}
          onChange={(event) => update({ title: event.target.value })}
        />
      </FormField>
      <FormField label="Subtitle">
        <Textarea
          value={data.subtitle ?? ""}
          onChange={(event) => update({ subtitle: event.target.value })}
          className="min-h-20"
        />
      </FormField>
      <ChipEditor
        title="Trending searches"
        items={data.trending ?? []}
        placeholder="Gift under Tk 1000"
        onChange={(trending) => update({ trending })}
      />
    </div>
  );
}

function NeedsEditor({
  data,
  onChange,
}: {
  data: NeedsData;
  onChange: (value: NeedsData) => void;
}) {
  const tiles = Array.isArray(data?.tiles) ? data.tiles : [];
  const update = (patch: Partial<NeedsData>) => onChange({ ...data, ...patch });
  const updateTile = (index: number, patch: Partial<NeedTileData>) => {
    update({ tiles: tiles.map((tile, i) => (i === index ? { ...tile, ...patch } : tile)) });
  };

  return (
    <div className="space-y-5">
      <EditorIntro
        title="Need-based shopping tiles"
        body="These are made for non-technical buyers. They pick a situation, not a category."
      />
      <SectionCopyFields data={data} onChange={update} />
      <div className="grid gap-3">
        {tiles.map((tile, index) => (
          <EditablePanel
            key={`${tile.label}-${index}`}
            title={`Tile ${index + 1}`}
            subtitle={tile.label || "Untitled tile"}
            compact
            onDuplicate={() => update({ tiles: [...tiles, cloneData(tile)] })}
            onRemove={() => update({ tiles: tiles.filter((_, i) => i !== index) })}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Tile label">
                <Input
                  value={tile.label ?? ""}
                  onChange={(event) => updateTile(index, { label: event.target.value })}
                />
              </FormField>
              <FormField label="Link">
                <Input
                  value={tile.href ?? ""}
                  onChange={(event) => updateTile(index, { href: event.target.value })}
                />
              </FormField>
              <FormField label="Icon">
                <IconSelect
                  value={tile.icon}
                  onChange={(icon) => updateTile(index, { icon })}
                  className="w-full"
                />
              </FormField>
              <FormField label="Tone">
                <Select
                  value={tile.tone ?? "default"}
                  onValueChange={(tone) =>
                    updateTile(index, { tone: tone as NeedTileData["tone"] })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="accent">Premium accent</SelectItem>
                    <SelectItem value="danger">Offer / hot</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Small badge" hint="Optional">
                <Input
                  value={tile.badge ?? ""}
                  onChange={(event) => updateTile(index, { badge: event.target.value })}
                />
              </FormField>
            </div>
          </EditablePanel>
        ))}
      </div>
      <Button
        variant="outline"
        onClick={() =>
          update({ tiles: [...tiles, { label: "New Need", href: "/products", icon: "sparkles" }] })
        }
        className="gap-2"
      >
        <Plus className="h-4 w-4" />
        Add need tile
      </Button>
    </div>
  );
}

function TrustEditor({
  data,
  onChange,
}: {
  data: TrustData;
  onChange: (value: TrustData) => void;
}) {
  const items = Array.isArray(data?.items) ? data.items : [];
  const update = (patch: Partial<TrustData>) => onChange({ ...data, ...patch });
  const updateItem = (index: number, patch: Partial<TrustItemData>) => {
    update({ items: items.map((item, i) => (i === index ? { ...item, ...patch } : item)) });
  };

  return (
    <div className="space-y-5">
      <EditorIntro
        title="Trust badge editor"
        body="These badges answer the questions that stop people from ordering."
      />
      <SectionCopyFields data={data} onChange={update} />
      {items.map((item, index) => (
        <EditablePanel
          key={item.id ?? index}
          title={`Badge ${index + 1}`}
          subtitle={item.title || "Untitled trust badge"}
          compact
          onDuplicate={() =>
            update({ items: [...items, { ...cloneData(item), id: makeId("trust") }] })
          }
          onRemove={() => update({ items: items.filter((_, i) => i !== index) })}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Title">
              <Input
                value={item.title ?? ""}
                onChange={(event) => updateItem(index, { title: event.target.value })}
              />
            </FormField>
            <FormField label="Short line">
              <Input
                value={item.short ?? ""}
                onChange={(event) => updateItem(index, { short: event.target.value })}
              />
            </FormField>
            <FormField label="Icon">
              <IconSelect
                value={item.icon}
                onChange={(icon) => updateItem(index, { icon })}
                className="w-full"
              />
            </FormField>
          </div>
          <FormField label="Details shown when clicked">
            <Textarea
              value={item.details ?? ""}
              onChange={(event) => updateItem(index, { details: event.target.value })}
              className="min-h-24"
            />
          </FormField>
        </EditablePanel>
      ))}
      <Button
        variant="outline"
        onClick={() =>
          update({
            items: [
              ...items,
              {
                id: makeId("trust"),
                icon: "shield",
                title: "New Promise",
                short: "Short customer promise",
                details: "Explain this promise in simple words.",
              },
            ],
          })
        }
        className="gap-2"
      >
        <Plus className="h-4 w-4" />
        Add trust badge
      </Button>
    </div>
  );
}

function EditorialEditor({
  data,
  onChange,
}: {
  data: EditorialData;
  onChange: (value: EditorialData) => void;
}) {
  const cards = Array.isArray(data?.cards) ? data.cards : [];
  const update = (patch: Partial<EditorialData>) => onChange({ ...data, ...patch });
  const updateCard = (index: number, patch: Partial<EditorialCardData>) => {
    update({ cards: cards.map((card, i) => (i === index ? { ...card, ...patch } : card)) });
  };

  return (
    <div className="space-y-5">
      <EditorIntro
        title="Editorial collection cards"
        body="Use these for premium brand stories and hand-picked shopping paths."
      />
      <SectionCopyFields data={data} onChange={update} />
      {cards.map((card, index) => (
        <EditablePanel
          key={`${card.title}-${index}`}
          title={`Collection ${index + 1}`}
          subtitle={card.title || "Untitled collection"}
          compact
          onDuplicate={() => update({ cards: [...cards, cloneData(card)] })}
          onRemove={() => update({ cards: cards.filter((_, i) => i !== index) })}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Small label">
              <Input
                value={card.eyebrow ?? ""}
                onChange={(event) => updateCard(index, { eyebrow: event.target.value })}
              />
            </FormField>
            <FormField label="Title">
              <Input
                value={card.title ?? ""}
                onChange={(event) => updateCard(index, { title: event.target.value })}
              />
            </FormField>
            <FormField label="Button text">
              <Input
                value={card.cta ?? ""}
                onChange={(event) => updateCard(index, { cta: event.target.value })}
              />
            </FormField>
            <FormField label="Link">
              <Input
                value={card.href ?? ""}
                onChange={(event) => updateCard(index, { href: event.target.value })}
              />
            </FormField>
            <FormField label="Gradient classes">
              <Input
                value={card.gradient ?? ""}
                onChange={(event) => updateCard(index, { gradient: event.target.value })}
              />
            </FormField>
            <FormField label="Decoration text">
              <Input
                value={card.decoration ?? ""}
                onChange={(event) => updateCard(index, { decoration: event.target.value })}
              />
            </FormField>
          </div>
          <FormField label="Description">
            <Textarea
              value={card.description ?? ""}
              onChange={(event) => updateCard(index, { description: event.target.value })}
              className="min-h-24"
            />
          </FormField>
          <label className="flex w-fit items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-2 text-sm">
            <Switch
              checked={!!card.isDark}
              onCheckedChange={(isDark) => updateCard(index, { isDark })}
              size="sm"
            />
            Dark text style
          </label>
        </EditablePanel>
      ))}
      <Button
        variant="outline"
        onClick={() =>
          update({
            cards: [
              ...cards,
              {
                eyebrow: "New",
                title: "New Collection",
                description: "Write a short story for this collection.",
                href: "/products",
                cta: "Shop Now",
                gradient: "from-[#f3efe6] via-[#ebe5d6] to-[#e2dccc]",
                decoration: "EDIT",
              },
            ],
          })
        }
        className="gap-2"
      >
        <Plus className="h-4 w-4" />
        Add collection
      </Button>
    </div>
  );
}

function TestimonialsEditor({
  data,
  onChange,
}: {
  data: TestimonialsData;
  onChange: (value: TestimonialsData) => void;
}) {
  const items = Array.isArray(data?.items) ? data.items : [];
  const updateItem = (index: number, patch: Partial<TestimonialData>) => {
    onChange({ items: items.map((item, i) => (i === index ? { ...item, ...patch } : item)) });
  };

  return (
    <ListEditorShell
      title="Customer quotes"
      body="Short quotes look more believable and fit better on mobile."
      addLabel="Add testimonial"
      onAdd={() =>
        onChange({
          items: [
            ...items,
            {
              id: makeId("review"),
              name: "Customer Name",
              rating: 5,
              body: "Write the customer's short quote here.",
              location: "Dhaka",
            },
          ],
        })
      }
    >
      {items.map((item, index) => (
        <EditablePanel
          key={item.id ?? index}
          title={`Review ${index + 1}`}
          subtitle={item.name || "Customer"}
          compact
          onDuplicate={() =>
            onChange({ items: [...items, { ...cloneData(item), id: makeId("review") }] })
          }
          onRemove={() => onChange({ items: items.filter((_, i) => i !== index) })}
        >
          <div className="grid gap-4 md:grid-cols-3">
            <FormField label="Customer name">
              <Input
                value={item.name ?? ""}
                onChange={(event) => updateItem(index, { name: event.target.value })}
              />
            </FormField>
            <FormField label="Location">
              <Input
                value={item.location ?? ""}
                onChange={(event) => updateItem(index, { location: event.target.value })}
              />
            </FormField>
            <FormField label="Rating">
              <Input
                type="number"
                min={1}
                max={5}
                value={item.rating ?? 5}
                onChange={(event) => updateItem(index, { rating: Number(event.target.value) })}
              />
            </FormField>
          </div>
          <FormField label="Quote">
            <Textarea
              value={item.body ?? ""}
              onChange={(event) => updateItem(index, { body: event.target.value })}
              className="min-h-24"
            />
          </FormField>
        </EditablePanel>
      ))}
    </ListEditorShell>
  );
}

function WhatsAppEditor({
  data,
  onChange,
}: {
  data: WhatsAppData;
  onChange: (value: WhatsAppData) => void;
}) {
  const update = (patch: Partial<WhatsAppData>) => onChange({ ...data, ...patch });

  return (
    <div className="space-y-5">
      <EditorIntro
        title="WhatsApp commerce"
        body="Make it easy for customers to ask before buying, confirm COD, or share a cart."
      />
      <label className="flex w-fit items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-2 text-sm">
        <Switch
          checked={!!data.enabled}
          onCheckedChange={(enabled) => update({ enabled })}
          size="sm"
        />
        Enable WhatsApp section and floating button
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          label="Phone number"
          hint="Use country code, no plus sign. Example: 8801700000000"
        >
          <Input
            value={data.phoneNumber ?? ""}
            onChange={(event) => update({ phoneNumber: event.target.value })}
          />
        </FormField>
        <FormField label="Primary button text">
          <Input
            value={data.ctaPrimaryLabel ?? ""}
            onChange={(event) => update({ ctaPrimaryLabel: event.target.value })}
          />
        </FormField>
        <FormField label="Secondary button text">
          <Input
            value={data.ctaSecondaryLabel ?? ""}
            onChange={(event) => update({ ctaSecondaryLabel: event.target.value })}
          />
        </FormField>
        <FormField label="Secondary button link">
          <Input
            value={data.ctaSecondaryHref ?? ""}
            onChange={(event) => update({ ctaSecondaryHref: event.target.value })}
          />
        </FormField>
      </div>
      <FormField label="Section title">
        <Input
          value={data.ctaTitle ?? ""}
          onChange={(event) => update({ ctaTitle: event.target.value })}
        />
      </FormField>
      <FormField label="Section subtitle">
        <Textarea
          value={data.ctaSubtitle ?? ""}
          onChange={(event) => update({ ctaSubtitle: event.target.value })}
          className="min-h-24"
        />
      </FormField>
      <FormField label="Default WhatsApp message">
        <Textarea
          value={data.defaultMessage ?? ""}
          onChange={(event) => update({ defaultMessage: event.target.value })}
          className="min-h-20"
        />
      </FormField>
    </div>
  );
}

function FlashSaleEditor({
  data,
  onChange,
}: {
  data: FlashSaleData;
  onChange: (value: FlashSaleData) => void;
}) {
  const update = (patch: Partial<FlashSaleData>) => onChange({ ...data, ...patch });

  return (
    <div className="space-y-5">
      <EditorIntro
        title="Flash sale setup"
        body="Keep this campaign sharp: a clear title and a countdown that feels active."
      />
      <label className="flex w-fit items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-2 text-sm">
        <Switch
          checked={!!data.enabled}
          onCheckedChange={(enabled) => update({ enabled })}
          size="sm"
        />
        Enable flash sale
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Sale title">
          <Input
            value={data.title ?? ""}
            onChange={(event) => update({ title: event.target.value })}
          />
        </FormField>
        <FormField label="Countdown hours">
          <Input
            type="number"
            min={1}
            value={data.hoursFromNow ?? 24}
            onChange={(event) => update({ hoursFromNow: Number(event.target.value) })}
          />
        </FormField>
      </div>
    </div>
  );
}

function SectionCopyFields({
  data,
  onChange,
}: {
  data: { eyebrow?: string; title?: string; subtitle?: string };
  onChange: (patch: { eyebrow?: string; title?: string; subtitle?: string }) => void;
}) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Small label">
          <Input
            value={data.eyebrow ?? ""}
            onChange={(event) => onChange({ eyebrow: event.target.value })}
          />
        </FormField>
        <FormField label="Title">
          <Input
            value={data.title ?? ""}
            onChange={(event) => onChange({ title: event.target.value })}
          />
        </FormField>
      </div>
      <FormField label="Subtitle">
        <Textarea
          value={data.subtitle ?? ""}
          onChange={(event) => onChange({ subtitle: event.target.value })}
          className="min-h-20"
        />
      </FormField>
    </div>
  );
}

function ChipEditor({
  title,
  items,
  placeholder,
  onChange,
}: {
  title: string;
  items: string[];
  placeholder: string;
  onChange: (items: string[]) => void;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold">{title}</h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...items, placeholder])}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={item}
              onChange={(event) =>
                onChange(items.map((value, i) => (i === index ? event.target.value : value)))
              }
            />
            <IconButton
              label="Remove chip"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            >
              <Trash2 className="h-4 w-4" />
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
}

function ListEditorShell({
  title,
  body,
  addLabel,
  onAdd,
  children,
}: {
  title: string;
  body: string;
  addLabel: string;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <EditorIntro title={title} body={body} />
      <div className="space-y-3">{children}</div>
      <Button variant="outline" onClick={onAdd} className="gap-2">
        <Plus className="h-4 w-4" />
        {addLabel}
      </Button>
    </div>
  );
}

function InlineRow({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <div className="grid gap-2 rounded-xl border border-[var(--color-border)] bg-white p-2 sm:grid-cols-[auto,1fr,auto] sm:items-center">
      {children}
      <IconButton label="Remove" onClick={onRemove}>
        <Trash2 className="h-4 w-4" />
      </IconButton>
    </div>
  );
}

function EditablePanel({
  title,
  subtitle,
  children,
  compact,
  onDuplicate,
  onRemove,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  compact?: boolean;
  onDuplicate?: () => void;
  onRemove?: () => void;
}) {
  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-white shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--color-border)] p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface-alt)] text-[var(--color-text-muted)]">
            <GripVertical className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold">{title}</h3>
            <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onDuplicate && (
            <IconButton label="Duplicate" onClick={onDuplicate}>
              <Copy className="h-4 w-4" />
            </IconButton>
          )}
          {onRemove && (
            <IconButton label="Remove" onClick={onRemove}>
              <Trash2 className="h-4 w-4" />
            </IconButton>
          )}
        </div>
      </div>
      <div className={cn("space-y-4", compact ? "p-4" : "p-4 md:p-5")}>{children}</div>
    </section>
  );
}

function EditorIntro({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">{body}</p>
    </div>
  );
}

function FormField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-semibold text-[var(--color-text-primary)]">{label}</span>
      {children}
      {hint && <span className="block text-xs text-[var(--color-text-muted)]">{hint}</span>}
    </label>
  );
}

function SafeFormField({
  label,
  hint,
  value,
  limitKey,
  children,
}: {
  label: string;
  hint?: string;
  value?: string | null;
  limitKey: keyof typeof HERO_LIMITS;
  children: React.ReactNode;
}) {
  const tooLong = isHeroTextTooLong(limitKey, value);
  return (
    <FormField
      label={label}
      hint={`${hint ? `${hint} ` : ""}${recommendedText(limitKey)} ${textLength(value)}/${HERO_LIMITS[limitKey]}`}
    >
      {children}
      {tooLong && (
        <span className="mt-1 flex items-start gap-1.5 text-xs font-medium text-amber-700">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          This may wrap or be shortened on the live slider.
        </span>
      )}
    </FormField>
  );
}

function IconSelect({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <Select
      value={value || ICON_KEYS[0]}
      onValueChange={(next) => {
        if (next) onChange(next);
      }}
    >
      <SelectTrigger className={cn("w-40", className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ICON_KEYS.map((key) => (
          <SelectItem key={key} value={key}>
            {key}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <div>
        <strong>JSON error:</strong> {message}
      </div>
    </div>
  );
}

function SectionPreview({
  blockKey,
  data,
  isActive,
}: {
  blockKey: HomepageBlockKey;
  data: unknown;
  isActive: boolean;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-sm",
        !isActive && "opacity-55",
      )}
    >
      {!isActive && (
        <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-2 text-xs font-semibold text-[var(--color-text-secondary)]">
          Hidden on storefront
        </div>
      )}
      {blockKey === "hero" && <HeroPreview data={data as HeroSlideData[]} />}
      {blockKey === "ticker" && <TickerPreview data={data as { items: TickerItem[] }} />}
      {blockKey === "discovery" && <DiscoveryPreview data={data as DiscoveryData} />}
      {blockKey === "needs" && <NeedsPreview data={data as NeedsData} />}
      {blockKey === "trust" && <TrustPreview data={data as TrustData} />}
      {blockKey === "editorial" && <EditorialPreview data={data as EditorialData} />}
      {blockKey === "testimonials" && <TestimonialsPreview data={data as TestimonialsData} />}
      {blockKey === "whatsapp" && <WhatsAppPreview data={data as WhatsAppData} />}
      {blockKey === "flashSale" && <FlashSalePreview data={data as FlashSaleData} />}
    </div>
  );
}

function HeroPreview({ data }: { data: HeroSlideData[] }) {
  const slide = Array.isArray(data) ? data[0] : null;
  const theme = HERO_THEME_PRESETS[slide?.theme ?? "cream"];
  const titleLine1 = slide?.titleLine1 || slide?.title || "Discover Niyamah";
  const titleLine2 = slide?.titleLine2 || slide?.highlight || "With Meaning";
  const description =
    slide?.description ||
    slide?.subtitle ||
    "Explore authentic Quran, prayer essentials, tasbih, and Islamic gifts delivered across Bangladesh.";
  const bigWord1 = slide?.bigWord1 || slide?.decoration || "NIYAMAH";
  const bigWord2 = slide?.bigWord2 || slide?.highlight || "COLLECTION";
  const metadataLine = slide?.metadataLine || slide?.badge || "Collection / New Arrival";
  return (
    <div className="overflow-hidden bg-white">
      <div
        className="relative min-h-[390px] overflow-hidden p-4"
        style={{ backgroundColor: theme.bg, color: theme.text }}
      >
        <div className="absolute inset-0 flex flex-col justify-center overflow-hidden text-[76px] font-black leading-[0.78] opacity-100">
          <span style={{ color: theme.word }}>{bigWord1}</span>
          <span style={{ color: theme.word }}>{bigWord1}</span>
          <span className="self-end" style={{ color: theme.word }}>
            {bigWord2}
          </span>
          <span className="self-end" style={{ color: theme.word }}>
            {bigWord2}
          </span>
        </div>
        <div className="pointer-events-none absolute right-7 top-10 h-64 w-44 rounded-t-full border border-current/20" />
        <div className="relative z-10 grid min-h-[330px] grid-cols-[0.95fr,1.1fr,0.8fr] gap-4">
          <div className="relative flex items-center justify-center">
            <div
              className="absolute h-40 w-40 rounded-full blur-3xl"
              style={{ backgroundColor: `${theme.accent}40` }}
            />
            {slide?.productImage ? (
              <Image
                src={slide.productImage}
                alt={slide.productImageAlt || titleLine1 || "Slider product"}
                fill
                sizes="360px"
                unoptimized
                className="object-contain drop-shadow-xl"
              />
            ) : (
              <div className="flex h-52 w-full items-center justify-center border border-current/15 bg-white/20 text-xs font-semibold opacity-70">
                Product image
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-xs font-bold" style={{ color: theme.accent }}>
              {slide?.subheading || slide?.productName || "Premium Islamic essentials"}
            </p>
            <h3 className="mt-2 text-3xl font-black leading-[0.9] uppercase" style={{ color: theme.text }}>
              <span className="block">{titleLine1}</span>
              <span className="block" style={{ color: theme.accent }}>
                {titleLine2}
              </span>
            </h3>
            <p className="mt-3 line-clamp-3 text-xs leading-5" style={{ color: theme.muted }}>
              {description}
            </p>
            <Badge
              className="mt-3 w-fit rounded-none"
              style={{ backgroundColor: theme.buttonBg, color: theme.buttonText }}
            >
              {slide?.primaryButtonText || slide?.ctaPrimary?.label || "Shop Now"}
            </Badge>
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-current/15 pt-3 text-[10px]">
              {(slide?.infoItems ?? []).slice(0, 3).map((item, index) => (
                <div key={index} className="min-w-0">
                  <span className="block truncate font-black tracking-[0.16em] uppercase" style={{ color: theme.muted }}>
                    {item.label}
                  </span>
                  <strong className="block truncate">{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-7">
            <p className="text-[9px] font-black tracking-[0.18em] uppercase" style={{ color: theme.muted }}>
              {slide?.eyebrow || "Niyamah Collection"}
            </p>
            <p className="mt-2 text-sm font-semibold">{slide?.productName || "Islamic Essentials"}</p>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: theme.accent }}>
              {metadataLine}
            </p>
            <div className="mt-5 h-px w-16" style={{ backgroundColor: theme.accent }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function TickerPreview({ data }: { data: { items: TickerItem[] } }) {
  return (
    <div className="space-y-2 p-4">
      {(data?.items ?? []).slice(0, 5).map((item, index) => (
        <div key={index} className="rounded-lg bg-[var(--color-surface-alt)] px-3 py-2 text-sm">
          {item.text}
        </div>
      ))}
    </div>
  );
}

function DiscoveryPreview({ data }: { data: DiscoveryData }) {
  return (
    <div className="p-5">
      <p className="text-xs tracking-[0.18em] text-[var(--color-accent-dark)] uppercase">
        {data.eyebrow}
      </p>
      <h3 className="mt-2 text-2xl font-semibold">{data.title}</h3>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{data.subtitle}</p>
      <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-2 text-sm text-[var(--color-text-muted)]">
        {data.placeholder}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {(data.trending ?? []).slice(0, 6).map((item) => (
          <Badge key={item} variant="secondary">
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function NeedsPreview({ data }: { data: NeedsData }) {
  return (
    <div className="p-5">
      <PreviewHeader eyebrow={data.eyebrow} title={data.title} subtitle={data.subtitle} />
      <div className="mt-4 grid grid-cols-2 gap-2">
        {(data.tiles ?? []).slice(0, 6).map((tile) => (
          <div
            key={tile.label}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3"
          >
            <p className="text-sm font-semibold">{tile.label}</p>
            {tile.badge && (
              <p className="mt-1 text-xs text-[var(--color-accent-dark)]">{tile.badge}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TrustPreview({ data }: { data: TrustData }) {
  return (
    <div className="p-5">
      <PreviewHeader eyebrow={data.eyebrow} title={data.title} subtitle={data.subtitle} />
      <div className="mt-4 space-y-2">
        {(data.items ?? []).slice(0, 4).map((item) => (
          <div key={item.id} className="rounded-xl border border-[var(--color-border)] p-3">
            <p className="text-sm font-semibold">{item.title}</p>
            <p className="text-xs text-[var(--color-text-secondary)]">{item.short}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function EditorialPreview({ data }: { data: EditorialData }) {
  return (
    <div className="p-5">
      <PreviewHeader eyebrow={data.eyebrow} title={data.title} subtitle={data.subtitle} />
      <div className="mt-4 space-y-2">
        {(data.cards ?? []).slice(0, 3).map((card) => (
          <div key={card.title} className="rounded-xl bg-[#1a1814] p-4 text-white">
            <p className="text-xs tracking-[0.16em] text-white/50 uppercase">{card.eyebrow}</p>
            <p className="mt-2 font-semibold">{card.title}</p>
            <p className="mt-1 text-xs text-white/65">{card.cta}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialsPreview({ data }: { data: TestimonialsData }) {
  const item = data.items?.[0];
  return (
    <div className="p-5">
      <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
        &ldquo;{item?.body ?? "Customer quote"}&rdquo;
      </p>
      <p className="mt-3 text-sm font-semibold">{item?.name}</p>
      <p className="text-xs text-[var(--color-text-muted)]">{item?.location}</p>
    </div>
  );
}

function WhatsAppPreview({ data }: { data: WhatsAppData }) {
  return (
    <div className="bg-[#102416] p-5 text-white">
      <Badge className="mb-4 bg-[#25D366] text-white">WhatsApp</Badge>
      <h3 className="text-2xl font-semibold text-white">{data.ctaTitle}</h3>
      <p className="mt-2 text-sm leading-6 text-white/70">{data.ctaSubtitle}</p>
      <div className="mt-4 rounded-full bg-[#25D366] px-4 py-2 text-center text-sm font-semibold">
        {data.ctaPrimaryLabel}
      </div>
    </div>
  );
}

function FlashSalePreview({ data }: { data: FlashSaleData }) {
  return (
    <div className="p-5">
      <Badge className="mb-4 bg-red-600 text-white">Campaign</Badge>
      <h3 className="text-2xl font-semibold">{data.title}</h3>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
        Countdown duration: {data.hoursFromNow} hours
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {["02d", "14h", "22m"].map((value) => (
          <div
            key={value}
            className="rounded-xl bg-[var(--color-surface-alt)] px-3 py-2 font-semibold"
          >
            {value}
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div>
      <p className="text-xs tracking-[0.18em] text-[var(--color-accent-dark)] uppercase">
        {eyebrow}
      </p>
      <h3 className="mt-2 text-2xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{subtitle}</p>
    </div>
  );
}
