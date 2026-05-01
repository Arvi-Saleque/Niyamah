import { cn } from "@/lib/utils";
import { Heading, Text } from "@/components/shared/typography";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  action?: React.ReactNode;
  className?: string;
}

/** Title + optional subtitle + optional action button row for page sections. */
export function SectionHeader({
  title,
  subtitle,
  align = "left",
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-8 flex items-end justify-between gap-4",
        align === "center" && "flex-col items-center text-center",
        align === "right" && "flex-row-reverse",
        className,
      )}
    >
      <div className={cn(align === "center" && "text-center")}>
        <Heading as="h2" size="2xl">
          {title}
        </Heading>
        {subtitle && (
          <Text variant="secondary" className="mt-1">
            {subtitle}
          </Text>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
