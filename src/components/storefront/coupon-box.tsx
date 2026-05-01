"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tag } from "lucide-react";

interface CouponBoxProps {
  onApply: (code: string) => Promise<{ success: boolean; message: string }>;
  appliedCode?: string;
  onRemove?: () => void;
  className?: string;
}

/** Coupon code input with apply / remove controls and inline feedback. */
export function CouponBox({ onApply, appliedCode, onRemove, className }: CouponBoxProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleApply = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    setLoading(true);
    setMessage("");
    const result = await onApply(trimmed);
    setLoading(false);
    setMessage(result.message);
    setIsError(!result.success);
    if (result.success) setCode("");
  };

  if (appliedCode) {
    return (
      <div className={cn("flex items-center gap-2 rounded-lg border border-green-300 bg-green-50 px-3 py-2", className)}>
        <Tag className="h-4 w-4 text-green-600" />
        <span className="flex-1 text-sm font-medium text-green-700">{appliedCode}</span>
        <Button variant="ghost" size="sm" onClick={onRemove} className="h-6 text-xs text-[var(--color-text-muted)]">
          Remove
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex gap-2">
        <Input
          placeholder="Coupon code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
          className="h-9 text-sm"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleApply}
          disabled={loading || !code.trim()}
        >
          {loading ? "…" : "Apply"}
        </Button>
      </div>
      {message && (
        <p className={cn("text-xs", isError ? "text-destructive" : "text-green-600")}>{message}</p>
      )}
    </div>
  );
}
