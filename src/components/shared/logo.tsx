import Link from "next/link";
import Image from "next/image";
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
    <Image
      src="/logo.png"
      alt=""
      width={size}
      height={size}
      className="h-auto w-auto object-contain"
      aria-hidden="true"
      priority
    />
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
          className="text-xl font-semibold tracking-wide text-[#043D25]"
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

