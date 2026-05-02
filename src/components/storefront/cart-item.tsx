import Image from "next/image";
import { Trash2 } from "lucide-react";
import { QuantityStepper } from "@/components/shared/quantity-stepper";
import { PriceText } from "@/components/shared/price-text";
import { Button } from "@/components/ui/button";
import { useCartStore, type CartItem } from "@/stores/cart-store";
import { cn } from "@/lib/utils";

interface CartItemProps {
  item: CartItem;
  className?: string;
}

/** Single line item inside the cart drawer or full cart page. */
export function CartItemRow({ item, className }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className={cn("flex gap-3 py-3", className)}>
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--color-surface-alt)]">
        {item.image && (
          <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <p className="line-clamp-2 text-sm font-medium leading-snug">{item.name}</p>
        {item.options && Object.keys(item.options).length > 0 && (
          <p className="text-xs text-[var(--color-text-muted)]">
            {Object.entries(item.options)
              .map(([key, value]) => `${key}: ${value}`)
              .join(" / ")}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between">
          <QuantityStepper
            value={item.quantity}
            min={1}
            max={99}
            onChange={(q) => updateQuantity(item.id, q)}
            size="sm"
          />
          <PriceText price={item.price} size="sm" />
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0 text-[var(--color-text-muted)] hover:text-destructive"
        onClick={() => removeItem(item.id)}
        aria-label="Remove item"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
