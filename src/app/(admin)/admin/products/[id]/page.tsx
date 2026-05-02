"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { ProductForm, type ProductFormValues } from "@/components/admin/product-form";
import { ProductImageUploader } from "@/components/admin/product-image-uploader";
import { VariantManager, type VariantRow } from "@/components/admin/variant-manager";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ArrowLeft, Trash2 } from "lucide-react";

interface ProductImage {
  url: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

interface FetchedProduct {
  id: number;
  name: string;
  slug: string;
  sku: string | null;
  price: string | number;
  salePrice: string | number | null;
  shortDescription: string | null;
  description: string | null;
  status: "draft" | "published" | "archived";
  images: ProductImage[];
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [defaults, setDefaults] = useState<Partial<ProductFormValues> | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [variants, setVariants] = useState<VariantRow[]>([]);
  const [basePrice, setBasePrice] = useState(0);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const res = await fetch(`/api/v1/products/${id}`);
      const json = await res.json();
      if (!res.ok) {
        toast.error("Failed to load product");
        return;
      }
      const p: FetchedProduct = json.data;
      setDefaults({
        name: p.name,
        slug: p.slug,
        sku: p.sku ?? "",
        price: Number(p.price),
        ...(p.salePrice !== null && { salePrice: Number(p.salePrice) }),
        stock: 0,
        shortDescription: p.shortDescription ?? "",
        description: p.description ?? "",
        isPublished: p.status === "published",
      });
      setImages((p.images ?? []).map((i) => i.url));
      setLoading(false);
    })();
  }, [id]);

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
      images: images.map((url, i) => ({
        url,
        isPrimary: i === 0,
        sortOrder: i,
      })),
    };
    const res = await fetch(`/api/v1/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json?.error?.message ?? "Failed to update");
      return;
    }
    toast.success("Product updated");
    router.refresh();
  };

  const handleDelete = async () => {
    const res = await fetch(`/api/v1/products/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Failed to delete");
      return;
    }
    toast.success("Product deleted");
    router.push("/admin/products");
  };

  if (loading || !defaults) {
    return <div className="py-12 text-center text-[var(--color-text-muted)]">Loading…</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-3">
            <Link href="/admin/products">
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Link>
          </Button>
          <h1
            className="text-2xl font-semibold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Edit Product
          </h1>
        </div>
        <ConfirmDialog
          trigger={
            <Button variant="outline" className="text-red-600">
              <Trash2 className="mr-1 h-4 w-4" /> Delete
            </Button>
          }
          title="Delete this product?"
          description="This action cannot be undone."
          confirmLabel="Delete"
          destructive
          onConfirm={handleDelete}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <ProductForm defaultValues={defaults} onSubmit={handleSubmit} onPriceChange={setBasePrice} />
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
