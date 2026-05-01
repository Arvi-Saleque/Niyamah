import Link from "next/link";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface TableActionsProps {
  viewHref?: string;
  editHref?: string;
  onDelete?: () => void;
  extraItems?: { label: string; onClick: () => void; destructive?: boolean }[];
}

/** Row-level action menu (view / edit / delete) used in admin data tables. */
export function TableActions({ viewHref, editHref, onDelete, extraItems }: TableActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Row actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {viewHref && (
          <DropdownMenuItem asChild>
            <Link href={viewHref} className="flex items-center gap-2">
              <Eye className="h-4 w-4" /> View
            </Link>
          </DropdownMenuItem>
        )}
        {editHref && (
          <DropdownMenuItem asChild>
            <Link href={editHref} className="flex items-center gap-2">
              <Pencil className="h-4 w-4" /> Edit
            </Link>
          </DropdownMenuItem>
        )}
        {extraItems?.map((item) => (
          <DropdownMenuItem
            key={item.label}
            onClick={item.onClick}
            className={item.destructive ? "text-destructive focus:text-destructive" : ""}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
        {onDelete && (
          <DropdownMenuItem
            onClick={onDelete}
            className="text-destructive focus:text-destructive flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
