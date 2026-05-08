import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  href?: string;
  className?: string;
  linkClassName?: string;
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
      className="h-auto max-h-full w-auto object-contain"
      aria-hidden="true"
      priority
    />
  );
}

export function Logo({
  href = "/",
  className,
  linkClassName,
  variant = "both",
  imageSize = 36,
}: LogoProps) {
  const content = (
    <span className={cn("inline-flex items-center gap-2 overflow-hidden", className)}>
      {(variant === "image" || variant === "both") && (
        <LogoMark size={imageSize} />
      )}
    </span>
  );

  return (
    <Link href={href} className={cn("focus-visible:rounded outline-none", linkClassName)}>
      {content}
    </Link>
  );
}

