"use client";

import Link from "next/link";
import { Bell, Search, User, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { cn } from "@/lib/utils";

interface AdminTopbarProps {
  className?: string;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
}

/** Admin panel top header: mobile menu, search, notifications, user menu. */
export function AdminTopbar({ className, userName = "Admin", userEmail, userAvatar }: AdminTopbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header
      className={cn(
        "flex h-16 items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 md:px-6",
        className,
      )}
    >
      {/* Mobile hamburger */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="Open menu"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile sidebar sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <AdminSidebar className="flex w-full border-0" />
        </SheetContent>
      </Sheet>

      {/* Search */}
      <div className="relative hidden flex-1 max-w-xs sm:flex">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
        <input
          type="search"
          placeholder="Search…"
          className="h-9 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-alt)] pl-9 pr-3 text-sm outline-none transition-colors focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[var(--color-error)]" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <Avatar className="h-7 w-7">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback className="text-xs bg-[var(--color-accent-light)] text-[var(--color-accent-dark)]">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline">{userName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <p className="font-medium">{userName}</p>
              {userEmail && <p className="text-xs text-[var(--color-text-muted)] font-normal">{userEmail}</p>}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/settings" className="flex items-center gap-2">
                <User className="h-4 w-4" /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[var(--color-error)] focus:text-[var(--color-error)]">
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
