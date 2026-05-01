import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ProductTabsProps {
  description?: string;
  specs?: Record<string, string>;
  reviewsSlot?: React.ReactNode;
  className?: string;
}

/** Tabbed section on the PDP: Description | Specifications | Reviews. */
export function ProductTabs({ description, specs, reviewsSlot, className }: ProductTabsProps) {
  return (
    <Tabs defaultValue="description" className={cn(className)}>
      <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-auto">
        {description !== undefined && (
          <TabsTrigger
            value="description"
            className="rounded-none border-b-2 border-transparent px-4 pb-3 pt-0 data-[state=active]:border-[var(--color-accent)] data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Description
          </TabsTrigger>
        )}
        {specs && (
          <TabsTrigger
            value="specs"
            className="rounded-none border-b-2 border-transparent px-4 pb-3 pt-0 data-[state=active]:border-[var(--color-accent)] data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Specifications
          </TabsTrigger>
        )}
        {reviewsSlot && (
          <TabsTrigger
            value="reviews"
            className="rounded-none border-b-2 border-transparent px-4 pb-3 pt-0 data-[state=active]:border-[var(--color-accent)] data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Reviews
          </TabsTrigger>
        )}
      </TabsList>

      {description !== undefined && (
        <TabsContent value="description" className="pt-6 prose prose-sm max-w-none">
          <p className="text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">
            {description}
          </p>
        </TabsContent>
      )}

      {specs && (
        <TabsContent value="specs" className="pt-6">
          <ProductSpecsTable specs={specs} />
        </TabsContent>
      )}

      {reviewsSlot && (
        <TabsContent value="reviews" className="pt-6">
          {reviewsSlot}
        </TabsContent>
      )}
    </Tabs>
  );
}

function ProductSpecsTable({ specs }: { specs: Record<string, string> }) {
  return (
    <table className="w-full text-sm">
      <tbody>
        {Object.entries(specs).map(([key, value], i) => (
          <tr
            key={key}
            className={cn(
              "border-b border-[var(--color-border)]",
              i % 2 === 0 && "bg-[var(--color-surface-alt)]",
            )}
          >
            <td className="w-40 px-3 py-2.5 font-medium text-[var(--color-text-secondary)]">{key}</td>
            <td className="px-3 py-2.5">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
