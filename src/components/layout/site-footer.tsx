import Link from "next/link";
import { Camera, MapPin, MessageCircle } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/8 bg-black/20 py-12">
      <div className="page-shell grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <BrandLogo />
          <p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">
            Esporte, encontros e bons momentos em uma arena feita para você.
          </p>
        </div>
        <div>
          <p className="text-sm font-bold text-white">Navegação</p>
          <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
            <Link href="/reservas">Reservas</Link>
            <Link href="/cardapio">Cardápio</Link>
            <Link href="/localizacao">Localização</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-white">Contato</p>
          <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
            <a href="https://wa.me/5586999815784" className="flex items-center gap-2">
              <MessageCircle className="size-4 text-primary" /> +55 86 99981-5784
            </a>
            <span className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" /> R. Porto, 1110 - São Pedro, Teresina - PI
            </span>
            <span className="flex items-center gap-2"><Camera className="size-4 text-primary" /> @arenahomebeach</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
