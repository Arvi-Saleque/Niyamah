"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BannerManager, type BannerItem } from "@/components/admin/banner-manager";

interface ApiBanner {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl: string | null;
  status: "active" | "inactive" | "scheduled";
  sortOrder: number;
}

export default function AdminBannersPage() {
  const [items, setItems] = useState<BannerItem[]>([]);
  const [original, setOriginal] = useState<ApiBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/banners", { cache: "no-store" });
      const json = await res.json();
      const data: ApiBanner[] = json?.data ?? [];
      setOriginal(data);
      setItems(
        data.map((b) => ({
          id: String(b.id),
          title: b.title,
          image: b.imageUrl,
          link: b.linkUrl ?? "",
          isActive: b.status === "active",
        })),
      );
    } catch {
      toast.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    let disposed = false;

    async function fetchBanners() {
      try {
        const res = await fetch("/api/v1/admin/banners", {
          cache: "no-store",
          signal: controller.signal,
        });
        const json = await res.json();
        if (disposed) return;
        const data: ApiBanner[] = json?.data ?? [];
        setOriginal(data);
        setItems(
          data.map((b) => ({
            id: String(b.id),
            title: b.title,
            image: b.imageUrl,
            link: b.linkUrl ?? "",
            isActive: b.status === "active",
          })),
        );
      } catch (error) {
        if (disposed || (error instanceof DOMException && error.name === "AbortError")) {
          return;
        }
        toast.error("Failed to load banners");
      } finally {
        if (!disposed) setLoading(false);
      }
    }

    void fetchBanners();

    return () => {
      disposed = true;
      controller.abort();
    };
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const originalIds = new Set(original.map((b) => String(b.id)));
      const currentIds = new Set(items.map((b) => b.id));

      // Deletions
      for (const o of original) {
        if (!currentIds.has(String(o.id))) {
          await fetch(`/api/v1/admin/banners/${o.id}`, { method: "DELETE" });
        }
      }

      // Creates + updates
      for (let i = 0; i < items.length; i++) {
        const it = items[i]!;
        if (!it.title || !it.image) continue;
        if (!originalIds.has(it.id)) {
          await fetch("/api/v1/admin/banners", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: it.title,
              imageUrl: it.image,
              ...(it.link && { linkUrl: it.link }),
              status: it.isActive ? "active" : "inactive",
              sortOrder: i,
            }),
          });
        } else {
          await fetch(`/api/v1/admin/banners/${it.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: it.title,
              imageUrl: it.image,
              linkUrl: it.link || null,
              status: it.isActive ? "active" : "inactive",
              sortOrder: i,
            }),
          });
        }
      }
      toast.success("Banners saved");
      await load();
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
            Banners
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Manage homepage promotional banners.
          </p>
        </div>
        <Button onClick={save} disabled={saving || loading}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
      {loading ? (
        <p className="text-sm text-[var(--color-text-secondary)]">Loading…</p>
      ) : (
        <BannerManager banners={items} onChange={setItems} />
      )}
    </div>
  );
}
