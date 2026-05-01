import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** "default" = max-w-7xl | "narrow" = max-w-3xl | "wide" = max-w-screen-2xl */
  size?: "narrow" | "default" | "wide" | "full";
}

export function Container({ size = "default", className, children, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        size === "narrow" && "max-w-3xl",
        size === "default" && "max-w-7xl",
        size === "wide" && "max-w-screen-2xl",
        size === "full" && "max-w-none",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
