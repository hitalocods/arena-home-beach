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
  { href: "/", label: "Início" },
  { href: "/reservas", label: "Reservas" },
  { href: "/cardapio", label: "Cardápio" },
  { href: "/localizacao", label: "Localização" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-background/80 backdrop-blur-2xl">
      <div className="page-shell flex h-18 items-center justify-between">
        <BrandLogo />
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-white",
                pathname === link.href && "bg-white/7 text-primary",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost">
            <Link href="/admin">Painel</Link>
          </Button>
          <Button asChild size="lg" className="neon-shadow font-bold">
            <Link href="/reservas">Reservar agora</Link>
          </Button>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon-lg" className="md:hidden" aria-label="Abrir menu">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className="border-white/10 bg-[#090c09]">
            <SheetHeader>
              <SheetTitle><BrandLogo /></SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-2 px-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-xl px-4 py-3 text-base font-medium text-muted-foreground",
                    pathname === link.href && "bg-primary/10 text-primary",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/admin" className="rounded-xl px-4 py-3 text-base font-medium text-muted-foreground">
                Painel administrativo
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
