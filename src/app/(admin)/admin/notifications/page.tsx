import { PageHeader } from "@/components/admin/page-header";
import { NotificationsInbox } from "@/components/admin/notifications-inbox";

export const dynamic = "force-dynamic";

export default function AdminNotificationsPage() {
  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Your inbox of system events: new orders, returns, low stock and more."
      />
      <NotificationsInbox />
    </div>
  );
}
