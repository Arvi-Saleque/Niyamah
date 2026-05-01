import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  confirmed: { label: "Confirmed", className: "bg-blue-100 text-blue-800 border-blue-200" },
  processing: { label: "Processing", className: "bg-blue-100 text-blue-800 border-blue-200" },
  shipped: { label: "Shipped", className: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  delivered: { label: "Delivered", className: "bg-green-100 text-green-800 border-green-200" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800 border-red-200" },
  returned: { label: "Returned", className: "bg-orange-100 text-orange-800 border-orange-200" },
  refunded: { label: "Refunded", className: "bg-orange-100 text-orange-800 border-orange-200" },
  partially_refunded: { label: "Partial Refund", className: "bg-orange-100 text-orange-800 border-orange-200" },
  paid: { label: "Paid", className: "bg-green-100 text-green-800 border-green-200" },
  unpaid: { label: "Unpaid", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  failed: { label: "Failed", className: "bg-red-100 text-red-800 border-red-200" },
  approved: { label: "Approved", className: "bg-green-100 text-green-800 border-green-200" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-800 border-red-200" },
  active: { label: "Active", className: "bg-green-100 text-green-800 border-green-200" },
  inactive: { label: "Inactive", className: "bg-gray-100 text-gray-600 border-gray-200" },
  draft: { label: "Draft", className: "bg-gray-100 text-gray-600 border-gray-200" },
  scheduled: { label: "Scheduled", className: "bg-blue-100 text-blue-800 border-blue-200" },
  archived: { label: "Archived", className: "bg-gray-100 text-gray-600 border-gray-200" },
  ended: { label: "Ended", className: "bg-gray-100 text-gray-600 border-gray-200" },
  published: { label: "Published", className: "bg-green-100 text-green-800 border-green-200" },
  out_of_stock: { label: "Out of Stock", className: "bg-red-100 text-red-800 border-red-200" },
  low_stock: { label: "Low Stock", className: "bg-orange-100 text-orange-800 border-orange-200" },
  in_stock: { label: "In Stock", className: "bg-green-100 text-green-800 border-green-200" },
};

interface StatusBadgeProps {
  /** Any status string — case-insensitive. Unknown values render with neutral styling. */
  status: string;
  className?: string;
}

/** Semantic colored badge for order, product, and inventory statuses. */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = status.toLowerCase();
  const config = statusConfig[key] ?? {
    label: status,
    className: "bg-gray-100 text-gray-700 border-gray-200",
  };
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
