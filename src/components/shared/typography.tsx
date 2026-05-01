import { cn } from "@/lib/utils";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type TextVariant = "body" | "lead" | "small" | "muted" | "secondary";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
}

const headingSizes = {
  xs: "text-sm",
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
  xl: "text-2xl",
  "2xl": "text-3xl",
  "3xl": "text-4xl",
  "4xl": "text-5xl md:text-6xl",
};

/** Playfair Display heading — use instead of raw <h1>-<h6> tags. */
export function Heading({ as: Tag = "h2", size = "xl", className, children, ...props }: HeadingProps) {
  return (
    <Tag
      className={cn(
        "font-semibold leading-tight tracking-tight",
        "[font-family:var(--font-heading)]",
        headingSizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: "p" | "span" | "div";
  variant?: TextVariant;
}

const textVariants: Record<TextVariant, string> = {
  body: "text-base leading-relaxed",
  lead: "text-lg leading-relaxed",
  small: "text-sm leading-relaxed",
  muted: "text-sm text-[var(--color-text-muted)]",
  secondary: "text-base text-[var(--color-text-secondary)]",
};

/** Inter body text — use instead of raw <p> / <span> tags. */
export function Text({ as: Tag = "p", variant = "body", className, children, ...props }: TextProps) {
  return (
    <Tag className={cn(textVariants[variant], className)} {...props}>
      {children}
    </Tag>
  );
}
