"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { formatCurrency } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Zone {
  id: number;
  name: string;
  districts: string[] | null;
  deliveryDaysMin: number;
  deliveryDaysMax: number;
}
interface Rate {
  id: number;
  zoneId: number;
  name: string;
  price: string;
  freeAboveAmount: string | null;
}

export default function AdminShippingPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [rates, setRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/shipping/zones", {
        cache: "no-store",
      });
      const json = await res.json();
      const data = json?.data ?? {};
      setZones(data.zones ?? []);
      setRates(data.rates ?? []);
    } catch {
      toast.error("Failed to load shipping");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const deleteZone = async (id: number) => {
    const res = await fetch(`/api/v1/admin/shipping/zones/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) return toast.error("Delete failed");
    toast.success("Zone deleted");
    void load();
  };

  const deleteRate = async (id: number) => {
    const res = await fetch(`/api/v1/admin/shipping/rates/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) return toast.error("Delete failed");
    toast.success("Rate deleted");
    void load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-semibold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Shipping
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Define delivery zones and shipping rates.
          </p>
        </div>
        <ZoneDialog onDone={load} />
      </div>

      {loading ? (
        <p className="text-sm text-[var(--color-text-secondary)]">Loading…</p>
      ) : zones.length === 0 ? (
        <EmptyState
          title="No shipping zones"
          description="Add your first zone to start charging shipping."
        />
      ) : (
        <div className="space-y-4">
          {zones.map((z) => (
            <div
              key={z.id}
              className="rounded-2xl border border-[var(--color-border)] bg-white p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-medium">{z.name}</h2>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    {(z.districts ?? []).length} districts ·{" "}
                    {z.deliveryDaysMin}–{z.deliveryDaysMax} days
                  </p>
                  {z.districts && z.districts.length > 0 && (
                    <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                      {z.districts.join(", ")}
                    </p>
                  )}
                </div>
                <ConfirmDialog
                  trigger={
                    <Button size="sm" variant="ghost" className="text-red-600">
                      <Trash2 className="size-4" />
                    </Button>
                  }
                  title="Delete zone?"
                  description="All rates in this zone will also be deleted."
                  confirmLabel="Delete"
                  destructive
                  onConfirm={() => deleteZone(z.id)}
                />
              </div>

              <div className="mt-4 border-t border-[var(--color-border)] pt-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">
                    Rates
                  </h3>
                  <RateDialog zoneId={z.id} onDone={load} />
                </div>
                {rates.filter((r) => r.zoneId === z.id).length === 0 ? (
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    No rates defined.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {rates
                      .filter((r) => r.zoneId === z.id)
                      .map((r) => (
                        <div
                          key={r.id}
                          className="flex items-center justify-between rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm"
                        >
                          <span className="font-medium">{r.name}</span>
                          <div className="flex items-center gap-3">
                            <span>{formatCurrency(Number(r.price))}</span>
                            {r.freeAboveAmount && (
                              <span className="text-xs text-[var(--color-text-secondary)]">
                                Free above {formatCurrency(Number(r.freeAboveAmount))}
                              </span>
                            )}
                            <ConfirmDialog
                              trigger={
                                <Button size="sm" variant="ghost">
                                  <Trash2 className="size-4" />
                                </Button>
                              }
                              title="Delete rate?"
                              confirmLabel="Delete"
                              destructive
                              onConfirm={() => deleteRate(r.id)}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ZoneDialog({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [districts, setDistricts] = useState("");
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(3);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/v1/admin/shipping/zones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          districts: districts
            .split(",")
            .map((d) => d.trim())
            .filter(Boolean),
          deliveryDaysMin: min,
          deliveryDaysMax: max,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Zone created");
      setName("");
      setDistricts("");
      setMin(1);
      setMax(3);
      setOpen(false);
      onDone();
    } catch {
      toast.error("Create failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" /> Add zone
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New shipping zone</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">
              Districts (comma separated)
            </label>
            <Input
              value={districts}
              onChange={(e) => setDistricts(e.target.value)}
              placeholder="Dhaka, Gazipur, Narayanganj"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Min days</label>
              <Input
                type="number"
                min={0}
                value={min}
                onChange={(e) => setMin(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Max days</label>
              <Input
                type="number"
                min={0}
                value={max}
                onChange={(e) => setMax(Number(e.target.value))}
              />
            </div>
          </div>
          <Button onClick={submit} disabled={!name || saving} className="w-full">
            {saving ? "Saving…" : "Create zone"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RateDialog({
  zoneId,
  onDone,
}: {
  zoneId: number;
  onDone: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Standard");
  const [price, setPrice] = useState(0);
  const [freeAbove, setFreeAbove] = useState<number | "">("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/v1/admin/shipping/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zoneId,
          name,
          price,
          ...(typeof freeAbove === "number" && { freeAboveAmount: freeAbove }),
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Rate created");
      setOpen(false);
      onDone();
    } catch {
      toast.error("Create failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="size-4" /> Add rate
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New shipping rate</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Price (৳)</label>
            <Input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-sm font-medium">
              Free above (optional, ৳)
            </label>
            <Input
              type="number"
              min={0}
              value={freeAbove}
              onChange={(e) =>
                setFreeAbove(e.target.value === "" ? "" : Number(e.target.value))
              }
            />
          </div>
          <Button onClick={submit} disabled={!name || saving} className="w-full">
            {saving ? "Saving…" : "Create rate"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
