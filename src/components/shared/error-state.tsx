import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/shared/typography";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

/** Error boundary fallback UI — shown when a page or section fails to load. */
export function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className,
      )}
    >
      <div className="mb-4 rounded-full bg-red-50 p-4">
        <AlertCircle className="h-10 w-10 text-[var(--color-error)]" />
      </div>
      <Heading as="h3" size="lg" className="mb-2">
        {title}
      </Heading>
      <Text variant="secondary" className="max-w-sm">
        {description}
      </Text>
      {onRetry && (
        <Button variant="outline" className="mt-6" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
