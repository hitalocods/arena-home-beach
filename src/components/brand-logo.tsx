import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandLogo({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={cn("group block", className)}
      aria-label="Arena Home Beach"
    >
      <span
        className={cn(
          "soft-shadow relative block overflow-hidden rounded-2xl border border-black/[0.06] bg-white transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_16px_40px_rgba(45,75,53,.16)]",
          compact ? "h-16 w-24 sm:h-18 sm:w-28" : "h-24 w-36",
        )}
      >
        <Image
          src="/logo.png"
          alt="Logo Arena Home Beach"
          fill
          priority
          sizes="(max-width: 640px) 128px, 144px"
          className="object-contain saturate-[.68] contrast-[.9]"
        />
      </span>
    </Link>
  );
}
