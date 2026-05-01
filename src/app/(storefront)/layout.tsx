export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header will be added in Phase 2 */}
      <main className="flex-1">{children}</main>
      {/* Footer will be added in Phase 2 */}
    </div>
  );
}
