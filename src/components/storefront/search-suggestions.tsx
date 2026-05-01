import Link from "next/link";
import Image from "next/image";
import { cn, formatCurrency } from "@/lib/utils";
import { Search } from "lucide-react";

export interface SearchSuggestionItem {
  id: string;
  name: string;
  slug: string;
  image?: string;
  price?: number;
  categoryName?: string;
}

interface SearchSuggestionsProps {
  suggestions: SearchSuggestionItem[];
  query: string;
  onSelect?: () => void;
  className?: string;
}

/** Dropdown list of live search results shown below the search bar. */
export function SearchSuggestions({ suggestions, query, onSelect, className }: SearchSuggestionsProps) {
  if (!query || suggestions.length === 0) return null;

  return (
    <div
      className={cn(
        "absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg",
        className,
      )}
    >
      {suggestions.map((item) => (
        <Link
          key={item.id}
          href={`/products/${item.slug}`}
          onClick={onSelect}
          className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--color-surface-alt)]"
        >
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-[var(--color-surface-alt)]">
            {item.image ? (
              <Image src={item.image} alt={item.name} fill sizes="40px" className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Search className="h-4 w-4 text-[var(--color-text-muted)]" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium">{item.name}</p>
            {item.categoryName && (
              <p className="text-xs text-[var(--color-text-muted)]">{item.categoryName}</p>
            )}
          </div>
          {item.price !== undefined && (
            <span className="shrink-0 text-sm font-semibold text-[var(--color-accent)]">
              {formatCurrency(item.price)}
            </span>
          )}
        </Link>
      ))}
      <Link
        href={`/search?q=${encodeURIComponent(query)}`}
        onClick={onSelect}
        className="flex items-center gap-2 border-t border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-accent)] transition-colors hover:bg-[var(--color-surface-alt)]"
      >
        <Search className="h-4 w-4" />
        See all results for &ldquo;{query}&rdquo;
      </Link>
    </div>
  );
}
