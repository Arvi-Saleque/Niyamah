"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";

type Role = "superadmin" | "admin" | "manager" | "staff" | "customer";

interface StaffUser {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: Role;
  createdAt: string;
}

const ROLES: Role[] = ["superadmin", "admin", "manager", "staff"];

export default function AdminStaffPage() {
  const [rows, setRows] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/users?role=staff_all", {
        cache: "no-store",
      });
      if (res.ok) {
        const json = await res.json();
        const data = json?.data ?? json;
        setRows(Array.isArray(data) ? data : (data?.items ?? []));
      } else {
        // Fallback: filter customers list by role on the client (simple)
        const r = await fetch("/api/v1/admin/users", { cache: "no-store" });
        if (r.ok) {
          const j = await r.json();
          const all = j?.data ?? j ?? [];
          setRows(
            (Array.isArray(all) ? all : (all?.items ?? [])).filter(
              (u: StaffUser) => u.role !== "customer",
            ),
          );
        }
      }
    } catch {
      toast.error("Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void (async () => { await load(); })();
  }, []);

  const updateRole = async (id: string, role: Role) => {
    const res = await fetch(`/api/v1/admin/staff/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (!res.ok) {
      toast.error("Update failed");
      return;
    }
    toast.success("Role updated");
    void (async () => { await load(); })();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-semibold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Staff & roles
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Manage staff members and their permission levels.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-[var(--color-text-secondary)]">Loading…</p>
      ) : rows.filter((u) => u.role !== "customer").length === 0 ? (
        <EmptyState
          title="No staff members"
          description="Promote existing customers to staff roles to grant admin access."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface-alt)] text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {rows
                .filter((u) => u.role !== "customer")
                .map((u) => (
                  <tr
                    key={u.id}
                    className="border-t border-[var(--color-border)]"
                  >
                    <td className="px-4 py-3 font-medium">{u.name ?? "—"}</td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                      {u.email}
                    </td>
                    <td className="px-4 py-3">
                      <Select
                        value={u.role}
                        onValueChange={(v) => updateRole(u.id, v as Role)}
                      >
                        <SelectTrigger className="w-[160px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map((r) => (
                            <SelectItem key={r} value={r}>
                              {r}
                            </SelectItem>
                          ))}
                          <SelectItem value="customer">customer</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600"
                        onClick={() => updateRole(u.id, "customer")}
                      >
                        Revoke
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
