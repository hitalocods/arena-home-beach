"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, House, MapPin, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Início", icon: House },
  { href: "/reservas", label: "Reservar", icon: CalendarDays },
  { href: "/cardapio", label: "Cardápio", icon: UtensilsCrossed },
  { href: "/localizacao", label: "Local", icon: MapPin },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-4 rounded-2xl border border-white/10 bg-[#0b0e0b]/95 p-1.5 shadow-2xl backdrop-blur-xl md:hidden">
      {items.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold text-muted-foreground",
            pathname === href && "bg-primary/12 text-primary",
          )}
        >
          <Icon className="size-4.5" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
