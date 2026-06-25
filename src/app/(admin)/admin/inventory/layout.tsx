import { requireAdminPage } from "@/modules/auth/application/get-admin-access";

export default async function Layout({ children }: { children: React.ReactNode }) {
  await requireAdminPage("inventory.view");
  return children;
}
