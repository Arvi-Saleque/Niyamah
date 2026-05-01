export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ backgroundColor: "var(--color-surface-alt)" }}
    >
      <div
        className="w-full max-w-md rounded-xl p-8 shadow-sm"
        style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
      >
        {children}
      </div>
    </div>
  );
}
