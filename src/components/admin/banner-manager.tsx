"use client";

import Image from "next/image";
import { Trash2, GripVertical, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export interface BannerItem {
  id: string;
  title: string;
  image: string;
  link?: string;
  isActive: boolean;
}

interface BannerManagerProps {
  banners: BannerItem[];
  onChange: (banners: BannerItem[]) => void;
  className?: string;
}

/** Admin drag-and-drop banner list manager (add / edit / toggle / remove). */
export function BannerManager({ banners, onChange, className }: BannerManagerProps) {
  const update = (id: string, patch: Partial<BannerItem>) =>
    onChange(banners.map((b) => (b.id === id ? { ...b, ...patch } : b)));

  const remove = (id: string) => onChange(banners.filter((b) => b.id !== id));

  const add = () =>
    onChange([
      ...banners,
      { id: crypto.randomUUID(), title: "", image: "", link: "", isActive: true },
    ]);

  return (
    <div className={cn("space-y-3", className)}>
      {banners.map((banner) => (
        <div
          key={banner.id}
          className="flex items-start gap-3 rounded-xl border border-[var(--color-border)] p-3"
        >
          <GripVertical className="mt-2 h-5 w-5 shrink-0 text-[var(--color-text-muted)] cursor-grab" />

          {/* Thumbnail */}
          <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg bg-[var(--color-surface-alt)]">
            {banner.image && (
              <Image src={banner.image} alt={banner.title} fill sizes="96px" className="object-cover" />
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <Input
              placeholder="Banner title"
              value={banner.title}
              onChange={(e) => update(banner.id, { title: e.target.value })}
              className="h-8 text-sm"
            />
            <Input
              placeholder="Image URL"
              value={banner.image}
              onChange={(e) => update(banner.id, { image: e.target.value })}
              className="h-8 text-sm"
            />
            <Input
              placeholder="Link (optional)"
              value={banner.link ?? ""}
              onChange={(e) => update(banner.id, { link: e.target.value })}
              className="h-8 text-sm"
            />
          </div>

          <div className="flex flex-col items-center gap-2">
            <Switch
              checked={banner.isActive}
              onCheckedChange={(v) => update(banner.id, { isActive: v })}
            />
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => remove(banner.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={add} className="gap-2">
        <PlusCircle className="h-4 w-4" /> Add Banner
      </Button>
    </div>
  );
}
