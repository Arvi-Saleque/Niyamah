import { cn } from "@/lib/utils";

type StatusType =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"
  | "active"
  | "inactive"
  | "draft"
  | "published"
  | "out_of_stock"
  | "low_stock"
  | "in_stock";

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  processing: { label: "Processing", className: "bg-blue-100 text-blue-800 border-blue-200" },
  shipped: { label: "Shipped", className: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  delivered: { label: "Delivered", className: "bg-green-100 text-green-800 border-green-200" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800 border-red-200" },
  refunded: { label: "Refunded", className: "bg-orange-100 text-orange-800 border-orange-200" },
  active: { label: "Active", className: "bg-green-100 text-green-800 border-green-200" },
  inactive: { label: "Inactive", className: "bg-gray-100 text-gray-600 border-gray-200" },
  draft: { label: "Draft", className: "bg-gray-100 text-gray-600 border-gray-200" },
  published: { label: "Published", className: "bg-green-100 text-green-800 border-green-200" },
  out_of_stock: { label: "Out of Stock", className: "bg-red-100 text-red-800 border-red-200" },
  low_stock: { label: "Low Stock", className: "bg-orange-100 text-orange-800 border-orange-200" },
  in_stock: { label: "In Stock", className: "bg-green-100 text-green-800 border-green-200" },
};

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

/** Semantic colored badge for order, product, and inventory statuses. */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
