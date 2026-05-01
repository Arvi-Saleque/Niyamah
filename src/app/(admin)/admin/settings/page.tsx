"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SettingsForm, type SettingsFormValues } from "@/components/admin/settings-form";

export default function AdminSettingsPage() {
  const [defaults, setDefaults] = useState<Partial<SettingsFormValues> | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/v1/admin/settings", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          const d = json?.data ?? json;
          setDefaults({
            storeName: d?.metaTitle ?? "",
            storeEmail: d?.contactEmail ?? "",
            storePhone: d?.contactPhone ?? "",
            storeAddress: d?.address ?? "",
            currency: d?.currency ?? "BDT",
            metaTitle: d?.metaTitle ?? "",
            metaDescription: d?.metaDescription ?? "",
          });
        }
      } catch {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onSubmit = async (values: SettingsFormValues) => {
    const res = await fetch("/api/v1/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contactEmail: values.storeEmail,
        contactPhone: values.storePhone,
        address: values.storeAddress,
        currency: values.currency,
        metaTitle: values.metaTitle || values.storeName,
        ...(values.metaDescription && { metaDescription: values.metaDescription }),
      }),
    });
    if (!res.ok) {
      toast.error("Save failed");
      return;
    }
    toast.success("Settings saved");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1
          className="text-2xl font-semibold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Settings
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Store information, contact details and SEO defaults.
        </p>
      </div>
      {loading ? (
        <p className="text-sm text-[var(--color-text-secondary)]">Loading…</p>
      ) : (
        <SettingsForm
          {...(defaults && { defaultValues: defaults })}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
}
