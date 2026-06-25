"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { BrandForm, type BrandFormValues } from "@/components/admin/brand-form";
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

interface Brand {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  featured: boolean | null;
  status: boolean | null;
}

export default function AdminBrandsPage() {
  const [items, setItems] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/v1/brands?limit=100");
    const json = await res.json();
    if (res.ok) setItems(json.data.items ?? json.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void (async () => {
      await load();
    })();
  }, []);

  const onSubmit = async (values: BrandFormValues) => {
    const payload = {
      name: values.name,
      slug: values.slug,
      ...(values.description && { description: values.description }),
      ...(values.logo && { logo: values.logo }),
      featured: values.featured,
    };
    const url = editing ? `/api/v1/brands/${editing.id}` : "/api/v1/brands";
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
    toast.success(editing ? "Brand updated" : "Brand created");
    setOpen(false);
    setEditing(null);
    load();
  };

  const onDelete = async (id: number) => {
    const res = await fetch(`/api/v1/brands/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Failed to delete");
      return;
    }
    toast.success("Brand deleted");
    load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1
          className="text-2xl font-semibold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Brands
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
              <Plus className="mr-1 h-4 w-4" /> New brand
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit brand" : "New brand"}
              </DialogTitle>
            </DialogHeader>
            <BrandForm
              defaultValues={
                editing
                  ? {
                      name: editing.name,
                      slug: editing.slug,
                      description: editing.description ?? "",
                      logo: editing.logo ?? "",
                      featured: editing.featured ?? false,
                    }
                  : undefined
              }
              onSubmit={onSubmit}
            />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="py-12 text-center text-[var(--color-text-muted)]">
          Loading…
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No brands yet"
          description="Create your first brand to associate with products."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface-alt)] text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Featured</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <tr
                  key={b.id}
                  className="border-t border-[var(--color-border)]"
                >
                  <td className="px-4 py-3 font-medium">{b.name}</td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                    {b.slug}
                  </td>
                  <td className="px-4 py-3">{b.featured ? "Yes" : "—"}</td>
                  <td className="px-4 py-3">
                    {b.status ? "Active" : "Hidden"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditing(b);
                          setOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <ConfirmDialog
                        trigger={
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        }
                        title="Delete brand?"
                        description={`Permanently remove "${b.name}".`}
                        confirmLabel="Delete"
                        destructive
                        onConfirm={() => onDelete(b.id)}
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
