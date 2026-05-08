"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmAction } from "@/components/admin/confirm-action";
import { adminFetch } from "@/lib/admin/api-client";

interface BlacklistRemoveButtonProps {
  id: number;
}

export function BlacklistRemoveButton({ id }: BlacklistRemoveButtonProps) {
  const router = useRouter();

  const onConfirm = async () => {
    const result = await adminFetch(`/api/v1/admin/blacklist/${id}`, {
      method: "DELETE",
      successMessage: "Removed from blacklist.",
    });
    if (result.ok) router.refresh();
  };

  return (
    <ConfirmAction
      trigger={
        <Button
          variant="ghost"
          size="icon"
          aria-label="Remove from blacklist"
          className="text-[var(--color-error)] hover:text-[var(--color-error)]"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      }
      title="Remove from blacklist?"
      description="This customer will be allowed to place COD orders again."
      destructive
      confirmLabel="Remove"
      onConfirm={onConfirm}
    />
  );
}
