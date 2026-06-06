import Link from "next/link";
import { Waves } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="Arena Home Beach">
      <span className="neon-shadow grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground transition-transform group-hover:-rotate-3">
        <Waves className="size-5" strokeWidth={2.6} />
      </span>
      <span className={cn("leading-none", compact && "hidden sm:block")}>
        <span className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">
          Arena
        </span>
        <span className="mt-1 block text-base font-black tracking-tight text-white">
          HOME BEACH
        </span>
      </span>
    </Link>
  );
}
