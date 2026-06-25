"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";

interface StaffUser {
  id: string;
  name: string | null;
  email: string;
  isActive: boolean;
  roleId: number;
  roleName: string;
  roleKey: string;
  createdAt: string;
  isCurrentUser?: boolean;
  isOwner?: boolean;
}

interface RoleDef {
  key: string;
  name: string;
}

export default function AdminStaffPage() {
  const [rows, setRows] = useState<StaffUser[]>([]);
  const [roles, setRoles] = useState<RoleDef[]>([]);
  const [loading, setLoading] = useState(true);
  const [addEmail, setAddEmail] = useState("");
  const [addRole, setAddRole] = useState("viewer");
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/staff", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setRows(json.data?.staff ?? []);
        if (json.data?.assignableRoles) {
          setRoles(json.data.assignableRoles);
          if (!json.data.assignableRoles.find((r: RoleDef) => r.key === addRole)) {
            setAddRole(json.data.assignableRoles[0]?.key || "");
          }
        }
      }
    } catch {
      toast.error("Failed to load staff");
    } finally {
      setLoading(false);
    }
  }, [addRole]);

  useEffect(() => {
    let mounted = true;
    void Promise.resolve().then(() => {
      if (mounted) void load();
    });
    return () => { mounted = false; };
  }, [load]);

  const updateRole = async (id: string, roleKey: string) => {
    const res = await fetch(`/api/v1/admin/staff/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roleKey }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      toast.error(err.error?.message || "Update failed");
      return;
    }
    toast.success("Role updated");
    void load();
  };

  const revokeAccess = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this user's admin access?")) return;
    const res = await fetch(`/api/v1/admin/staff/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      toast.error(err.error?.message || "Revoke failed");
      return;
    }
    toast.success("Access revoked");
    void load();
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await fetch("/api/v1/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: addEmail, roleKey: addRole }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error?.message || "Failed to add staff");
        return;
      }
      toast.success("Staff member added");
      setAddEmail("");
      void load();
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
          Staff & roles
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Manage staff members and their permission levels.
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
        <h2 className="mb-4 text-sm font-medium">Add staff member</h2>
        <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-4">
          <div className="grid gap-2">
            <label className="text-xs font-medium text-[var(--color-text-secondary)]">
              User Email
            </label>
            <Input
              type="email"
              required
              placeholder="customer@example.com"
              value={addEmail}
              onChange={(e) => setAddEmail(e.target.value)}
              className="w-64"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs font-medium text-[var(--color-text-secondary)]">
              Role
            </label>
            <Select value={addRole} onValueChange={(v) => { if (v) setAddRole(v); }}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r.key} value={r.key}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={adding || roles.length === 0}>
            {adding ? "Adding..." : "Add Staff"}
          </Button>
        </form>
      </div>

      {loading ? (
        <p className="text-sm text-[var(--color-text-secondary)]">Loading…</p>
      ) : rows.length === 0 ? (
        <EmptyState
          title="No staff members"
          description="Add an existing user to a staff role to grant them admin access."
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
              {rows.map((u) => (
                <tr key={u.id} className="border-t border-[var(--color-border)]">
                  <td className="px-4 py-3 font-medium">
                    {u.name || "—"}
                    {u.isCurrentUser && <span className="ml-2 text-xs text-blue-600 font-semibold">(You)</span>}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">{u.email}</td>
                  <td className="px-4 py-3">
                    <Select
                      value={u.roleKey}
                      onValueChange={(v) => { if (v) updateRole(u.id, v); }}
                      disabled={u.isOwner || u.isCurrentUser || roles.length === 0}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((r) => (
                          <SelectItem key={r.key} value={r.key}>
                            {r.name}
                          </SelectItem>
                        ))}
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
                      disabled={u.isOwner || u.isCurrentUser}
                      onClick={() => revokeAccess(u.id)}
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
