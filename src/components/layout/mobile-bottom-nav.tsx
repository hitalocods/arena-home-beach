"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, House, MapPin, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Inicio", icon: House },
  { href: "/reservas", label: "Reservar", icon: CalendarDays },
  { href: "/cardapio", label: "Cardapio", icon: UtensilsCrossed },
  { href: "/localizacao", label: "Local", icon: MapPin },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-3 bottom-[max(.75rem,env(safe-area-inset-bottom))] z-50 grid grid-cols-4 rounded-[1.4rem] border border-black/[0.06] bg-white/92 p-1.5 shadow-[0_18px_50px_rgba(30,48,35,.16)] backdrop-blur-2xl lg:hidden">
      {items.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-semibold text-muted-foreground transition-all duration-300",
            pathname === href && "bg-accent text-accent-foreground",
          )}
        >
          <Icon className="size-4.5" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
