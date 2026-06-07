"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/reservas", label: "Reservas" },
  { href: "/cardapio", label: "Cardapio" },
  { href: "/localizacao", label: "Localizacao" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.055] bg-[#fcfdfa]/82 backdrop-blur-2xl">
      <div className="page-shell grid min-h-22 grid-cols-[1fr_auto_1fr] items-center py-2.5">
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-black/[0.035] hover:text-foreground",
                pathname === link.href && "bg-accent text-accent-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <BrandLogo compact className="col-start-2 justify-self-center" />
        <div className="hidden items-center justify-end gap-2 lg:flex">
          <Button asChild variant="ghost" className="rounded-full">
            <Link href="/admin">Painel</Link>
          </Button>
          <Button asChild className="soft-shadow rounded-full px-5 font-bold">
            <Link href="/reservas">Reservar quadra</Link>
          </Button>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon-lg" className="col-start-3 justify-self-end rounded-full lg:hidden" aria-label="Abrir menu">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className="border-black/[0.08] bg-[#fbfcfa]">
            <SheetHeader>
              <SheetTitle><BrandLogo /></SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-2 px-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-xl px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-black/[0.035] hover:text-foreground",
                    pathname === link.href && "bg-accent text-accent-foreground",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/admin" className="rounded-xl px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-black/[0.035] hover:text-foreground">
                Painel administrativo
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
