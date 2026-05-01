export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--color-surface-alt)" }}>
      {/* Admin sidebar will be added in Phase 2 */}
      <div className="flex flex-1 flex-col">
        {/* Admin topbar will be added in Phase 2 */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
