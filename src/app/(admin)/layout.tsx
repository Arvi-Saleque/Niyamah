import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { getCurrentAdminAccess } from "@/modules/auth/application/get-admin-access";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getCurrentAdminAccess();
  if (!ctx) redirect("/login?redirect=/admin");
  if (!ctx.permissions.has("admin.access") && !ctx.isOwner) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-surface-alt)]">
      <AdminSidebar className="hidden md:flex" permissions={ctx.isOwner ? "all" : ctx.permissions} />
      <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
        <AdminTopbar userName={ctx.name} userEmail={ctx.email} />
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
