"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { ProductForm, type ProductFormValues } from "@/components/admin/product-form";
import { ProductImageUploader } from "@/components/admin/product-image-uploader";
import { VariantManager, type VariantRow } from "@/components/admin/variant-manager";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [variants, setVariants] = useState<VariantRow[]>([]);
  const [basePrice, setBasePrice] = useState(0);

  const handleSubmit = async (values: ProductFormValues) => {
    const payload = {
      name: values.name,
      slug: values.slug,
      sku: values.sku,
      price: values.price,
      ...(values.salePrice !== undefined && { salePrice: values.salePrice }),
      shortDescription: values.shortDescription ?? null,
      description: values.description ?? null,
      status: values.isPublished ? "published" : "draft",
      initialStock: values.stock,
      images: images.map((url, i) => ({
        url,
        isPrimary: i === 0,
        sortOrder: i,
      })),
      variants: variants.length > 0
        ? variants.map((v, i) => ({
            sku: v.sku,
            sortOrder: i,
            status: true,
            ...(v.price !== values.price && { priceOverride: String(v.price) }),
            ...(v.salePrice !== "" && { salePriceOverride: String(v.salePrice) }),
            initialStock: v.stock,
            options: v.options.map((o) => ({ type: o.type, value: o.value })),
          }))
        : undefined,
    };

    const res = await fetch("/api/v1/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json?.error?.message ?? "Failed to create product");
      return;
    }
    toast.success("Product created");
    router.push(`/admin/products/${json.data.id}`);
    router.refresh();
  };

  return (
    <div>
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-3">
          <Link href="/admin/products">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to products
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
          New Product
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <ProductForm
              onSubmit={handleSubmit}
              onPriceChange={setBasePrice}
            />
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <VariantManager
              basePrice={basePrice}
              variants={variants}
              onChange={setVariants}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            Images
          </h2>
          <ProductImageUploader value={images} onChange={setImages} />
        </div>
      </div>
    </div>
  );
}
