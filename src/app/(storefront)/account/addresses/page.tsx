"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import {
  AddressForm,
  type AddressFormValues,
} from "@/components/storefront/address-form";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { Plus, Trash2, Pencil } from "lucide-react";

interface AddressRow {
  id: number;
  label: string | null;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  district: string;
  area: string | null;
  city: string | null;
  postalCode: string | null;
  isDefault: boolean | null;
}

export default function AddressesPage() {
  const [items, setItems] = useState<AddressRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AddressRow | "new" | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/addresses");
      const data = await res.json();
      setItems(data?.data?.items ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleSave(values: AddressFormValues) {
    const id = editing && editing !== "new" ? editing.id : null;
    const url = id ? `/api/v1/addresses/${id}` : "/api/v1/addresses";
    const method = id ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      toast.error(data?.error?.message ?? "Could not save address.");
      return;
    }
    toast.success(id ? "Address updated." : "Address added.");
    setEditing(null);
    void load();
  }

  async function handleDelete(id: number) {
    const res = await fetch(`/api/v1/addresses/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok || !data.success) {
      toast.error(data?.error?.message ?? "Could not delete.");
      return;
    }
    toast.success("Address deleted.");
    void load();
  }

  if (editing) {
    const defaults =
      editing !== "new"
        ? {
            name: editing.name,
            phone: editing.phone,
            addressLine1: editing.addressLine1,
            addressLine2: editing.addressLine2 ?? "",
            district: editing.district,
            city: editing.city ?? "",
            postalCode: editing.postalCode ?? "",
          }
        : undefined;
    return (
      <Container className="py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold">
            {editing === "new" ? "Add address" : "Edit address"}
          </h1>
          <Button variant="ghost" onClick={() => setEditing(null)}>
            Cancel
          </Button>
        </div>
        <AddressForm
          {...(defaults && { defaultValues: defaults })}
          submitLabel={editing === "new" ? "Save address" : "Update address"}
          onSubmit={handleSave}
        />
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">My Addresses</h1>
        <Button
          onClick={() => setEditing("new")}
          className="bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)]"
        >
          <Plus className="mr-1 h-4 w-4" /> New address
        </Button>
      </div>

      {loading ? (
        <div className="text-sm text-[var(--color-text-muted)]">Loading…</div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No addresses yet"
          description="Add a shipping address to make checkout faster."
          action={
            <Button onClick={() => setEditing("new")}>
              <Plus className="mr-1 h-4 w-4" /> Add address
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((a) => (
            <div
              key={a.id}
              className="rounded-xl border border-[var(--color-border)] p-4 text-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold">
                  {a.name}
                  {a.isDefault && (
                    <span className="ml-2 rounded bg-[var(--color-accent)]/10 px-2 py-0.5 text-xs text-[var(--color-accent)]">
                      Default
                    </span>
                  )}
                </span>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setEditing(a)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <ConfirmDialog
                    title="Delete address?"
                    description="This action cannot be undone."
                    confirmLabel="Delete"
                    destructive
                    onConfirm={() => handleDelete(a.id)}
                    trigger={
                      <Button size="icon" variant="ghost">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    }
                  />
                </div>
              </div>
              <p className="text-[var(--color-text-muted)]">{a.phone}</p>
              <p>{a.addressLine1}</p>
              {a.addressLine2 && <p>{a.addressLine2}</p>}
              <p>
                {a.district}
                {a.city ? `, ${a.city}` : ""}
                {a.postalCode ? ` - ${a.postalCode}` : ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}
