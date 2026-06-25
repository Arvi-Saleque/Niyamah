export default function AccessDeniedPage() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
      <h1 className="mb-2 text-2xl font-bold">Access Denied</h1>
      <p className="text-[var(--color-text-muted)]">
        You do not have permission to access this page. If you believe this is a mistake, please contact your store administrator.
      </p>
    </div>
  );
}
