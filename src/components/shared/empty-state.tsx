import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/shared/typography";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
}

/** Used when lists, search results, or cart are empty. */
export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className,
      )}
    >
      {Icon && (
        <div className="mb-4 rounded-full bg-[var(--color-surface-alt)] p-4">
          <Icon className="h-10 w-10 text-[var(--color-text-muted)]" />
        </div>
      )}
      <Heading as="h3" size="lg" className="mb-2">
        {title}
      </Heading>
      {description && (
        <Text variant="secondary" className="max-w-sm">
          {description}
        </Text>
      )}
      {action && (
        <Button className="mt-6" asChild={!!action.href}>
          {action.href ? (
            <a href={action.href}>{action.label}</a>
          ) : (
            <button onClick={action.onClick}>{action.label}</button>
          )}
        </Button>
      )}
    </div>
  );
}
