"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  Code,
  ImagePlus,
  Layout,
  Loader2,
  Lock,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { adminFetch } from "@/lib/admin/api-client";
import { cn } from "@/lib/utils";
import {
  type NavFeatureColumn,
  type NavLink,
  type NavListColumn,
  type NavPanel,
  type NavTemplate,
  type NavTile,
  type NavigationData,
} from "@/modules/storefront/navigation-defaults";

interface NavigationManagerProps {
  initial: NavigationData;
}

type ViewMode = "design" | "json";

const TEMPLATE_LABELS: Record<NavTemplate, string> = {
  "feature-columns": "Feature columns",
  "mega-list": "Mega list",
  "image-tiles": "Image tiles",
};

const TEMPLATE_DESCRIPTIONS: Record<NavTemplate, string> = {
  "feature-columns": "Image + heading + sub-links per column. Used by NEW.",
  "mega-list": "Column heading + flat link list. No images. Like Men/Women.",
  "image-tiles": "Row of square image tiles with label below.",
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function emptyLink(): NavLink {
  return { label: "New link", href: "/" };
}

function emptyFeatureColumn(): NavFeatureColumn {
  return {
    title: "New column",
    href: "/",
    tone: "from-[#f5f1e7] to-[#e7eadf]",
    links: [emptyLink()],
  };
}

function emptyListColumn(): NavListColumn {
  return {
    title: "New column",
    href: "/",
    links: [emptyLink(), emptyLink()],
  };
}

function emptyTile(): NavTile {
  return {
    label: "New tile",
    href: "/",
    tone: "from-[#f5f1e7] to-[#e7eadf]",
  };
}

function makeEmptyPanel(template: NavTemplate): NavPanel {
  const base = { id: uid(), label: "New menu", href: "/" };
  if (template === "feature-columns") {
    return { ...base, template, columns: [emptyFeatureColumn()] };
  }
  if (template === "mega-list") {
    return { ...base, template, columns: [emptyListColumn(), emptyListColumn()] };
  }
  return { ...base, template, tiles: [emptyTile(), emptyTile(), emptyTile()] };
}

export function NavigationManager({ initial }: NavigationManagerProps) {
  const router = useRouter();
  const [panels, setPanels] = useState<NavPanel[]>(initial.panels);
  const [viewMode, setViewMode] = useState<ViewMode>("design");
  const [jsonDraft, setJsonDraft] = useState<string>(() =>
    JSON.stringify({ panels: initial.panels }, null, 2),
  );
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => ({
    [initial.panels[0]?.id ?? ""]: true,
  }));

  const isDirty = useMemo(
    () => JSON.stringify(panels) !== JSON.stringify(initial.panels),
    [panels, initial.panels],
  );

  const updatePanel = useCallback((id: string, updater: (p: NavPanel) => NavPanel) => {
    setPanels((prev) => prev.map((p) => (p.id === id ? updater(p) : p)));
  }, []);

  const movePanel = (id: string, direction: -1 | 1) => {
    setPanels((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx < 0) return prev;
      const target = idx + direction;
      // Pinned panel stays in slot 0; cannot move into slot 0 either.
      if (prev[idx].pinned) return prev;
      if (target < 0 || target >= prev.length) return prev;
      if (prev[target].pinned) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const removePanel = (id: string) => {
    setPanels((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target?.pinned) return prev;
      return prev.filter((p) => p.id !== id);
    });
  };

  const addPanel = (template: NavTemplate) => {
    const panel = makeEmptyPanel(template);
    setPanels((prev) => [...prev, panel]);
    setExpanded((prev) => ({ ...prev, [panel.id]: true }));
  };

  const handleSave = async () => {
    setSaving(true);
    const r = await adminFetch("/api/v1/admin/navigation", {
      method: "PUT",
      body: { data: { panels }, isActive: true },
      successMessage: "Navigation saved",
    });
    setSaving(false);
    if (r.ok) router.refresh();
  };

  const handleReset = async () => {
    if (!confirm("Reset the navigation menu to built-in defaults? Your customisations will be lost.")) {
      return;
    }
    setResetting(true);
    const r = await adminFetch<{ data: NavigationData }>("/api/v1/admin/navigation", {
      method: "DELETE",
      successMessage: "Navigation reset to defaults",
    });
    setResetting(false);
    if (r.ok && r.data?.data) {
      setPanels(r.data.data.panels);
      setJsonDraft(JSON.stringify(r.data.data, null, 2));
      router.refresh();
    }
  };

  // ── JSON view sync ─────────────────────────────────────
  const switchToJson = () => {
    setJsonDraft(JSON.stringify({ panels }, null, 2));
    setJsonError(null);
    setViewMode("json");
  };

  const applyJson = () => {
    try {
      const parsed = JSON.parse(jsonDraft) as NavigationData;
      if (!parsed || !Array.isArray(parsed.panels)) {
        throw new Error("Top-level `panels` array missing");
      }
      setPanels(parsed.panels);
      setJsonError(null);
      setViewMode("design");
      toast.success("Applied JSON to design view");
    } catch (e) {
      setJsonError(e instanceof Error ? e.message : "Invalid JSON");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card p-4">
        <div>
          <h2 className="text-lg font-semibold">Navigation menu</h2>
          <p className="text-sm text-muted-foreground">
            Control the storefront mega-menu. Choose a template per panel and edit columns, links and images.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-md border bg-background p-1">
            <button
              type="button"
              onClick={() => (viewMode === "json" ? applyJson() : null)}
              className={cn(
                "flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-medium transition",
                viewMode === "design" ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              <Layout className="h-3.5 w-3.5" /> Design
            </button>
            <button
              type="button"
              onClick={switchToJson}
              className={cn(
                "flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-medium transition",
                viewMode === "json" ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              <Code className="h-3.5 w-3.5" /> JSON
            </button>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={resetting || saving}
          >
            {resetting ? (
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            ) : (
              <RotateCcw className="mr-2 h-3.5 w-3.5" />
            )}
            Reset to defaults
          </Button>
          <Button type="button" size="sm" onClick={handleSave} disabled={saving || !isDirty}>
            {saving ? (
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="mr-2 h-3.5 w-3.5" />
            )}
            Save changes
          </Button>
        </div>
      </div>

      {viewMode === "json" ? (
        <div className="space-y-3 rounded-lg border bg-card p-4">
          <Textarea
            value={jsonDraft}
            onChange={(e) => setJsonDraft(e.target.value)}
            className="min-h-[480px] font-mono text-xs"
            spellCheck={false}
          />
          {jsonError && <p className="text-sm text-destructive">{jsonError}</p>}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setJsonDraft(JSON.stringify({ panels }, null, 2))}
            >
              Format
            </Button>
            <Button type="button" size="sm" onClick={applyJson}>
              Apply to design
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {panels.map((panel, idx) => (
            <PanelEditor
              key={panel.id}
              panel={panel}
              index={idx}
              total={panels.length}
              expanded={!!expanded[panel.id]}
              onToggleExpand={() =>
                setExpanded((prev) => ({ ...prev, [panel.id]: !prev[panel.id] }))
              }
              onMoveUp={() => movePanel(panel.id, -1)}
              onMoveDown={() => movePanel(panel.id, 1)}
              onRemove={() => removePanel(panel.id)}
              onChange={(updater) => updatePanel(panel.id, updater)}
            />
          ))}

          <AddPanelControl onAdd={addPanel} />
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Panel editor
// ──────────────────────────────────────────────────────────

function PanelEditor(props: {
  panel: NavPanel;
  index: number;
  total: number;
  expanded: boolean;
  onToggleExpand: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onChange: (updater: (p: NavPanel) => NavPanel) => void;
}) {
  const { panel, index, total, expanded, onToggleExpand, onMoveUp, onMoveDown, onRemove, onChange } = props;

  return (
    <div className="rounded-lg border bg-card">
      {/* Header */}
      <div className="flex items-center gap-2 border-b p-3">
        <button
          type="button"
          onClick={onToggleExpand}
          className="flex flex-1 items-center gap-3 text-left"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-semibold">
            {index + 1}
          </span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{panel.label || "Untitled"}</span>
              {panel.pinned && <Lock className="h-3 w-3 text-muted-foreground" />}
            </div>
            <span className="text-xs text-muted-foreground">
              {TEMPLATE_LABELS[panel.template]} · {panel.href}
            </span>
          </div>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={onMoveUp}
            disabled={index === 0 || panel.pinned}
            className="h-8 w-8"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={onMoveDown}
            disabled={index === total - 1 || panel.pinned}
            className="h-8 w-8"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={onRemove}
            disabled={panel.pinned}
            className="h-8 w-8 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Body */}
      {expanded && (
        <div className="space-y-5 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <LabelledInput
              label="Top label"
              value={panel.label}
              onChange={(v) => onChange((p) => ({ ...p, label: v }))}
            />
            <LabelledInput
              label="Top link href"
              value={panel.href}
              onChange={(v) => onChange((p) => ({ ...p, href: v }))}
            />
          </div>
          <div className="rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">
            <span className="font-semibold">Template:</span> {TEMPLATE_LABELS[panel.template]} —{" "}
            {TEMPLATE_DESCRIPTIONS[panel.template]}
          </div>

          {panel.template === "feature-columns" && (
            <FeatureColumnsEditor
              panel={panel}
              onChange={(cols) =>
                onChange((p) =>
                  p.template === "feature-columns" ? { ...p, columns: cols } : p,
                )
              }
            />
          )}
          {panel.template === "mega-list" && (
            <MegaListEditor
              panel={panel}
              onChange={(cols) =>
                onChange((p) => (p.template === "mega-list" ? { ...p, columns: cols } : p))
              }
            />
          )}
          {panel.template === "image-tiles" && (
            <ImageTilesEditor
              panel={panel}
              onChange={(tiles) =>
                onChange((p) => (p.template === "image-tiles" ? { ...p, tiles } : p))
              }
            />
          )}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Template-specific editors
// ──────────────────────────────────────────────────────────

function FeatureColumnsEditor({
  panel,
  onChange,
}: {
  panel: Extract<NavPanel, { template: "feature-columns" }>;
  onChange: (columns: NavFeatureColumn[]) => void;
}) {
  const updateCol = (idx: number, updater: (c: NavFeatureColumn) => NavFeatureColumn) =>
    onChange(panel.columns.map((c, i) => (i === idx ? updater(c) : c)));
  const removeCol = (idx: number) => onChange(panel.columns.filter((_, i) => i !== idx));
  const addCol = () => onChange([...panel.columns, emptyFeatureColumn()]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Columns ({panel.columns.length})</h4>
        <Button type="button" size="sm" variant="outline" onClick={addCol}>
          <Plus className="mr-1 h-3.5 w-3.5" /> Add column
        </Button>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {panel.columns.map((col, idx) => (
          <div key={idx} className="space-y-3 rounded-md border bg-background p-3">
            <div className="flex items-start gap-3">
              <ImageField
                value={col.image}
                onChange={(url) => updateCol(idx, (c) => ({ ...c, image: url }))}
              />
              <div className="flex-1 space-y-2">
                <LabelledInput
                  label="Heading"
                  value={col.title}
                  onChange={(v) => updateCol(idx, (c) => ({ ...c, title: v }))}
                />
                <LabelledInput
                  label="Heading link"
                  value={col.href}
                  onChange={(v) => updateCol(idx, (c) => ({ ...c, href: v }))}
                />
                <LabelledInput
                  label="Tone (gradient classes — only used when no image)"
                  value={col.tone ?? ""}
                  onChange={(v) => updateCol(idx, (c) => ({ ...c, tone: v || undefined }))}
                  placeholder="from-[#f5f1e7] to-[#e7eadf]"
                />
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => removeCol(idx)}
                className="h-8 w-8 text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <LinkListEditor
              links={col.links}
              onChange={(links) => updateCol(idx, (c) => ({ ...c, links }))}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function MegaListEditor({
  panel,
  onChange,
}: {
  panel: Extract<NavPanel, { template: "mega-list" }>;
  onChange: (columns: NavListColumn[]) => void;
}) {
  const updateCol = (idx: number, updater: (c: NavListColumn) => NavListColumn) =>
    onChange(panel.columns.map((c, i) => (i === idx ? updater(c) : c)));
  const removeCol = (idx: number) => onChange(panel.columns.filter((_, i) => i !== idx));
  const addCol = () => onChange([...panel.columns, emptyListColumn()]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Columns ({panel.columns.length})</h4>
        <Button type="button" size="sm" variant="outline" onClick={addCol}>
          <Plus className="mr-1 h-3.5 w-3.5" /> Add column
        </Button>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {panel.columns.map((col, idx) => (
          <div key={idx} className="space-y-3 rounded-md border bg-background p-3">
            <div className="flex items-start gap-2">
              <div className="flex-1 space-y-2">
                <LabelledInput
                  label="Heading"
                  value={col.title}
                  onChange={(v) => updateCol(idx, (c) => ({ ...c, title: v }))}
                />
                <LabelledInput
                  label="Heading link"
                  value={col.href}
                  onChange={(v) => updateCol(idx, (c) => ({ ...c, href: v }))}
                />
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => removeCol(idx)}
                className="h-8 w-8 text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <LinkListEditor
              links={col.links}
              onChange={(links) => updateCol(idx, (c) => ({ ...c, links }))}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ImageTilesEditor({
  panel,
  onChange,
}: {
  panel: Extract<NavPanel, { template: "image-tiles" }>;
  onChange: (tiles: NavTile[]) => void;
}) {
  const updateTile = (idx: number, updater: (t: NavTile) => NavTile) =>
    onChange(panel.tiles.map((t, i) => (i === idx ? updater(t) : t)));
  const removeTile = (idx: number) => onChange(panel.tiles.filter((_, i) => i !== idx));
  const addTile = () => onChange([...panel.tiles, emptyTile()]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Tiles ({panel.tiles.length})</h4>
        <Button type="button" size="sm" variant="outline" onClick={addTile}>
          <Plus className="mr-1 h-3.5 w-3.5" /> Add tile
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {panel.tiles.map((tile, idx) => (
          <div key={idx} className="space-y-3 rounded-md border bg-background p-3">
            <div className="flex items-start gap-3">
              <ImageField
                value={tile.image}
                onChange={(url) => updateTile(idx, (t) => ({ ...t, image: url }))}
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => removeTile(idx)}
                className="h-8 w-8 text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <LabelledInput
              label="Label"
              value={tile.label}
              onChange={(v) => updateTile(idx, (t) => ({ ...t, label: v }))}
            />
            <LabelledInput
              label="Link href"
              value={tile.href}
              onChange={(v) => updateTile(idx, (t) => ({ ...t, href: v }))}
            />
            <LabelledInput
              label="Tone (gradient — used when no image)"
              value={tile.tone ?? ""}
              onChange={(v) => updateTile(idx, (t) => ({ ...t, tone: v || undefined }))}
              placeholder="from-[#f5f1e7] to-[#e7eadf]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Shared helpers
// ──────────────────────────────────────────────────────────

function LinkListEditor({
  links,
  onChange,
}: {
  links: NavLink[];
  onChange: (links: NavLink[]) => void;
}) {
  const update = (idx: number, patch: Partial<NavLink>) =>
    onChange(links.map((l, i) => (i === idx ? { ...l, ...patch } : l)));
  const remove = (idx: number) => onChange(links.filter((_, i) => i !== idx));
  const add = () => onChange([...links, emptyLink()]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">
          Sub-links ({links.length})
        </span>
        <Button type="button" size="sm" variant="ghost" onClick={add} className="h-7 px-2 text-xs">
          <Plus className="mr-1 h-3 w-3" /> Add link
        </Button>
      </div>
      {links.map((link, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <Input
            value={link.label}
            onChange={(e) => update(idx, { label: e.target.value })}
            placeholder="Label"
            className="h-8 text-xs"
          />
          <Input
            value={link.href}
            onChange={(e) => update(idx, { href: e.target.value })}
            placeholder="/href"
            className="h-8 flex-1 text-xs"
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => remove(idx)}
            className="h-8 w-8 text-destructive"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
    </div>
  );
}

function LabelledInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 text-sm"
      />
    </label>
  );
}

function ImageField({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (url: string | undefined) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const uploadingRef = useRef(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    // Prevent re-entrant uploads (e.g. from the browser firing onChange on input reset)
    if (uploadingRef.current) return;
    uploadingRef.current = true;
    const file = files[0];
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/v1/admin/media/upload", { method: "POST", body: fd });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json) {
        toast.error(json?.error?.message ?? "Upload failed");
        return;
      }
      const url: string | undefined = json?.data?.url ?? json?.url;
      if (!url) {
        toast.error("Upload returned no URL");
        return;
      }
      onChange(url);
      toast.success("Image uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      uploadingRef.current = false;
      // Clear the input value without triggering onChange
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border bg-muted">
      {value ? (
        <>
          <Image src={value} alt="" fill sizes="96px" className="object-cover" />
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
            aria-label="Remove image"
          >
            <X className="h-3 w-3" />
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-full w-full flex-col items-center justify-center gap-1 text-xs text-muted-foreground hover:bg-muted/70"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="h-4 w-4" />
          )}
          <span>{uploading ? "Uploading" : "Image"}</span>
        </button>
      )}
      {value && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute bottom-1 left-1 rounded bg-black/60 p-1 text-white hover:bg-black/80"
          aria-label="Replace image"
        >
          <Pencil className="h-3 w-3" />
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}

function AddPanelControl({ onAdd }: { onAdd: (template: NavTemplate) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-dashed bg-muted/20 p-4">
      {!open ? (
        <Button type="button" variant="outline" onClick={() => setOpen(true)} className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Add new menu panel
        </Button>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Choose a template</h4>
            <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {(Object.keys(TEMPLATE_LABELS) as NavTemplate[]).map((tpl) => (
              <button
                key={tpl}
                type="button"
                onClick={() => {
                  onAdd(tpl);
                  setOpen(false);
                }}
                className="rounded-md border bg-background p-3 text-left transition hover:border-primary hover:shadow-sm"
              >
                <div className="text-sm font-semibold">{TEMPLATE_LABELS[tpl]}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {TEMPLATE_DESCRIPTIONS[tpl]}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
