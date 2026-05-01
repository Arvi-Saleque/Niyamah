"use client";

import Link from "next/link";
import Image from "next/image";
import { Heading, Text } from "@/components/shared/typography";
import { useWishlistStore } from "@/stores/wishlist-store";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export default function AccountWishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.removeItem);

  return (
    <div>
      <Heading as="h2" size="lg" className="mb-4">
        My Wishlist
      </Heading>
      {items.length === 0 ? (
        <Text variant="muted">No items saved yet.</Text>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-[var(--color-border)] bg-white p-4"
            >
              <Link href={`/products/${item.slug}`} className="block">
                <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-[var(--color-surface-alt)]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="font-medium">{item.name}</div>
                <div className="mt-1 text-sm text-[var(--color-accent)]">
                  {formatCurrency(item.price)}
                </div>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 w-full"
                onClick={() => remove(item.productId)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
