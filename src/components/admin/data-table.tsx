"use client";

import { useState, useMemo } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from "lucide-react";

export interface DataTableColumn<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  className?: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyField: keyof T;
  isLoading?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  className?: string;
  emptyLabel?: string;
}

/** Generic, sortable, paginated data table for all admin CRUD screens. */
export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyField,
  isLoading,
  searchPlaceholder = "Search…",
  pageSize = 10,
  className,
  emptyLabel = "No records found.",
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const filtered = useMemo(() => {
    let rows = [...data];
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((r) =>
        Object.values(r).some((v) => String(v ?? "").toLowerCase().includes(q)),
      );
    }
    if (sortKey) {
      rows.sort((a, b) => {
        const av = String(a[sortKey] ?? "");
        const bv = String(b[sortKey] ?? "");
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return rows;
  }, [data, search, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (sortKey !== colKey) return <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />;
    return sortDir === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />;
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
        <Input
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="h-9 pl-9 text-sm"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--color-border)]">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={String(col.key)} className={cn("whitespace-nowrap", col.className)}>
                  {col.sortable ? (
                    <button
                      className="inline-flex items-center gap-1 hover:text-[var(--color-text-primary)]"
                      onClick={() => toggleSort(String(col.key))}
                    >
                      {col.header}
                      <SortIcon colKey={String(col.key)} />
                    </button>
                  ) : col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: pageSize }).map((_, i) => (
                  <TableRow key={i}>
                    {columns.map((col) => (
                      <TableCell key={String(col.key)}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : paged.length === 0
              ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-[var(--color-text-muted)]">
                    {emptyLabel}
                  </TableCell>
                </TableRow>
              )
              : paged.map((row) => (
                  <TableRow key={String(row[keyField])}>
                    {columns.map((col) => (
                      <TableCell key={String(col.key)} className={col.className}>
                        {col.render
                          ? col.render(row)
                          : String(row[col.key as keyof T] ?? "")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}
