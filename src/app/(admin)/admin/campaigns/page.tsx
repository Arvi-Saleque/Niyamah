"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { CampaignForm, type CampaignFormValues } from "@/components/admin/campaign-form";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/empty-state";

interface Campaign {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  bannerImage: string | null;
  startDate: string | null;
  endDate: string | null;
  status: string;
}

function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  // YYYY-MM-DDTHH:mm
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminCampaignsPage() {
  const [items, setItems] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/v1/admin/campaigns?limit=100");
    const json = await res.json();
    if (res.ok) setItems(json.data.items ?? json.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    const controller = new AbortController();
    let disposed = false;

    async function fetchCampaigns() {
      try {
        const res = await fetch("/api/v1/admin/campaigns?limit=100", {
          signal: controller.signal,
        });
        const json = await res.json();
        if (disposed) return;
        if (res.ok) setItems(json.data?.items ?? json.data ?? []);
      } catch (error) {
        if (disposed || (error instanceof DOMException && error.name === "AbortError")) {
          return;
        }
        toast.error("Failed to load campaigns");
      } finally {
        if (!disposed) setLoading(false);
      }
    }

    void fetchCampaigns();

    return () => {
      disposed = true;
      controller.abort();
    };
  }, []);

  const onSubmit = async (values: CampaignFormValues) => {
    const payload = {
      name: values.name,
      slug: values.slug,
      ...(values.description && { description: values.description }),
      ...(values.bannerImage && { bannerImage: values.bannerImage }),
      ...(values.startDate && {
        startDate: new Date(values.startDate).toISOString(),
      }),
      ...(values.endDate && {
        endDate: new Date(values.endDate).toISOString(),
      }),
      status: values.status,
    };
    const url = editing ? `/api/v1/admin/campaigns/${editing.id}` : "/api/v1/admin/campaigns";
    const res = await fetch(url, {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json?.error?.message ?? "Failed to save");
      return;
    }
    toast.success(editing ? "Campaign updated" : "Campaign created");
    setOpen(false);
    setEditing(null);
    load();
  };

  const onDelete = async (id: number) => {
    const res = await fetch(`/api/v1/admin/campaigns/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      toast.error("Failed to delete");
      return;
    }
    toast.success("Campaign deleted");
    load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
          Campaigns
        </h1>
        <Dialog
          open={open}
          onOpenChange={(o) => {
            setOpen(o);
            if (!o) setEditing(null);
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(null)}>
              <Plus className="mr-1 h-4 w-4" /> New campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit campaign" : "New campaign"}</DialogTitle>
            </DialogHeader>
            <CampaignForm
              defaultValues={
                editing
                  ? {
                      name: editing.name,
                      slug: editing.slug,
                      description: editing.description ?? "",
                      bannerImage: editing.bannerImage ?? "",
                      startDate: toLocalInput(editing.startDate),
                      endDate: toLocalInput(editing.endDate),
                      status: (editing.status as CampaignFormValues["status"]) ?? "draft",
                    }
                  : undefined
              }
              onSubmit={onSubmit}
            />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="py-12 text-center text-[var(--color-text-muted)]">Loading…</div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No campaigns yet"
          description="Create promotional campaigns and special offers."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface-alt)] text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Starts</th>
                <th className="px-4 py-3 font-medium">Ends</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-t border-[var(--color-border)]">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">{c.slug}</td>
                  <td className="px-4 py-3 uppercase">{c.status}</td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                    {c.startDate ? new Date(c.startDate).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                    {c.endDate ? new Date(c.endDate).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditing(c);
                          setOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <ConfirmDialog
                        trigger={
                          <Button size="sm" variant="outline" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        }
                        title="Delete campaign?"
                        description={`Permanently remove "${c.name}".`}
                        confirmLabel="Delete"
                        destructive
                        onConfirm={() => onDelete(c.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
