import Link from "next/link";
import { Camera, MapPin, MessageCircle } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/[0.055] bg-white/55 py-14 backdrop-blur-sm sm:py-16">
      <div className="page-shell grid gap-10 md:grid-cols-[1.4fr_1fr_1fr] md:gap-14">
        <div>
          <BrandLogo compact />
          <p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">
            Esporte, encontros e bons momentos em uma arena feita para voce.
          </p>
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">Navegacao</p>
          <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
            <Link href="/reservas" className="transition-colors hover:text-foreground">Reservas</Link>
            <Link href="/cardapio" className="transition-colors hover:text-foreground">Cardapio</Link>
            <Link href="/localizacao" className="transition-colors hover:text-foreground">Localizacao</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">Contato</p>
          <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
            <a href="https://wa.me/5586999815784" className="flex items-center gap-2 transition-colors hover:text-foreground">
              <MessageCircle className="size-4 text-primary" /> +55 86 99981-5784
            </a>
            <span className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" /> R. Porto, 1110 - Sao Pedro, Teresina - PI
            </span>
            <span className="flex items-center gap-2"><Camera className="size-4 text-primary" /> @arenahomebeach</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
