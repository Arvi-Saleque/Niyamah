import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: "section" | "div" | "article";
  /** Vertical padding size */
  spacing?: "sm" | "md" | "lg" | "xl";
}

export function Section({
  as: Tag = "section",
  spacing = "lg",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Tag
      className={cn(
        spacing === "sm" && "py-6",
        spacing === "md" && "py-10",
        spacing === "lg" && "py-16",
        spacing === "xl" && "py-24",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
