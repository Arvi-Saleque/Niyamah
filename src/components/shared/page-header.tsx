import { cn } from "@/lib/utils";
import { Heading } from "@/components/shared/typography";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/shared/breadcrumbs";

interface PageHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
}

/** Full-width page header with title, breadcrumb trail, and optional action buttons. */
export function PageHeader({ title, breadcrumbs, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "border-b py-6",
        "border-[var(--color-border)]",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumbs items={breadcrumbs} className="mb-2" />
          )}
          <Heading as="h1" size="2xl">
            {title}
          </Heading>
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
