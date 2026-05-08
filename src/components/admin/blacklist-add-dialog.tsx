"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminFetch } from "@/lib/admin/api-client";

const REASONS = [
  { value: "REPEATED_REFUSAL", label: "Repeated COD refusal" },
  { value: "FAKE_ORDERS", label: "Fake orders" },
  { value: "FRAUD", label: "Fraud" },
  { value: "ABUSE", label: "Abuse" },
  { value: "OTHER", label: "Other" },
] as const;

export function BlacklistAddDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState<string>("REPEATED_REFUSAL");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setPhone("");
    setEmail("");
    setReason("REPEATED_REFUSAL");
    setNote("");
  };

  const submit = async () => {
    if (!phone.trim() && !email.trim()) {
      return;
    }
    setBusy(true);
    const result = await adminFetch("/api/v1/admin/blacklist", {
      method: "POST",
      body: {
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        reason,
        note: note.trim() || undefined,
      },
      successMessage: "Added to blacklist.",
    });
    setBusy(false);
    if (result.ok) {
      reset();
      setOpen(false);
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-1 h-4 w-4" /> Add to blacklist
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Block customer from COD</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label htmlFor="bl-phone">Phone</Label>
            <Input
              id="bl-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="bl-email">Email</Label>
            <Input
              id="bl-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@example.com"
              className="mt-1"
            />
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Phone or email is required (at least one).
            </p>
          </div>
          <div>
            <Label>Reason</Label>
            <Select
              value={reason}
              onValueChange={(value) => {
                if (value) setReason(value);
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="bl-note">Note</Label>
            <Textarea
              id="bl-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="mt-1"
              placeholder="Internal context (optional)…"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={busy}>
            Cancel
          </Button>
          <Button
            onClick={submit}
            disabled={busy || (!phone.trim() && !email.trim())}
          >
            {busy ? "Adding…" : "Add to blacklist"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
