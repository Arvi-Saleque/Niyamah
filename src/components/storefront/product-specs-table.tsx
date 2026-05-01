import { cn } from "@/lib/utils";

interface ProductSpecsTableProps {
  specs: Record<string, string>;
  className?: string;
}

/** Standalone key-value specification table for the product detail page. */
export function ProductSpecsTable({ specs, className }: ProductSpecsTableProps) {
  return (
    <table className={cn("w-full text-sm", className)}>
      <tbody>
        {Object.entries(specs).map(([key, value], i) => (
          <tr
            key={key}
            className={cn(
              "border-b border-[var(--color-border)]",
              i % 2 === 0 && "bg-[var(--color-surface-alt)]",
            )}
          >
            <td className="w-40 px-3 py-2.5 font-medium text-[var(--color-text-secondary)]">
              {key}
            </td>
            <td className="px-3 py-2.5 text-[var(--color-text-primary)]">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
