"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import type { MegaMenuCategory } from "@/components/storefront/mega-menu";

interface MobileNavProps {
  categories?: MegaMenuCategory[];
}

/** Mobile slide-in navigation using shadcn Sheet. */
export function MobileNav({ categories = [] }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b border-[var(--color-border)] px-5 py-4">
          <SheetTitle asChild>
            <Logo variant="both" />
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col overflow-y-auto py-2">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-5 py-3 text-sm font-medium transition-colors hover:bg-[var(--color-surface-alt)]"
            >
              {cat.label}
              {cat.children && <ChevronRight className="h-4 w-4 text-[var(--color-text-muted)]" />}
            </Link>
          ))}

          <div className="mt-4 border-t border-[var(--color-border)] px-5 py-4 flex flex-col gap-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/login" onClick={() => setOpen(false)}>Sign In</Link>
            </Button>
            <Button asChild className="w-full justify-start">
              <Link href="/register" onClick={() => setOpen(false)}>Create Account</Link>
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
