import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  href?: string;
  className?: string;
  /** "text" = text-only, "image" = image-only, "both" = image + text side by side */
  variant?: "text" | "image" | "both";
  imageSize?: number;
}

function LogoMark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="36" height="36" rx="8" fill="var(--color-accent)" />
      <text
        x="18"
        y="25"
        textAnchor="middle"
        fontSize="20"
        fontWeight="700"
        fontFamily="Georgia, serif"
        fill="#ffffff"
      >
        N
      </text>
    </svg>
  );
}

export function Logo({ href = "/", className, variant = "both", imageSize = 36 }: LogoProps) {
  const content = (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {(variant === "image" || variant === "both") && (
        <LogoMark size={imageSize} />
      )}
      {(variant === "text" || variant === "both") && (
        <span
          className="text-xl font-semibold tracking-wide"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Niyamah
        </span>
      )}
    </span>
  );

  return (
    <Link href={href} className="focus-visible:rounded outline-none">
      {content}
    </Link>
  );
}

