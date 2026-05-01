import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { getCurrentUser } from "@/lib/auth/guards";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/admin");
  if (user.role !== "admin" && user.role !== "staff" && user.role !== "manager" && user.role !== "superadmin") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <AdminSidebar className="hidden md:flex" />
      <div className="flex min-h-screen flex-1 flex-col">
        <AdminTopbar
          userName={user.email.split("@")[0] ?? "Admin"}
          userEmail={user.email}
        />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
