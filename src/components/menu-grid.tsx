"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Beer, Coffee, CupSoda, Sandwich, Sparkles, UtensilsCrossed } from "lucide-react";
import { MotionReveal } from "@/components/motion-reveal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type MenuProduct = {
  id: string;
  nome: string;
  preco: number;
  categoria: string;
  imagem: string | null;
};

const icons = [CupSoda, Beer, Sandwich, Coffee, Sparkles];

export function MenuGrid({ products }: { products: MenuProduct[] }) {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const categories = useMemo(
    () => ["Todos", ...new Set(products.map((product) => product.categoria))],
    [products],
  );
  const filteredProducts =
    activeCategory === "Todos"
      ? products
      : products.filter((product) => product.categoria === activeCategory);

  if (products.length === 0) {
    return (
      <Card className="premium-surface">
        <CardContent className="grid place-items-center gap-4 p-12 text-center sm:p-20">
          <span className="grid size-14 place-items-center rounded-2xl bg-accent text-[#527257]">
            <UtensilsCrossed />
          </span>
          <div>
            <h2 className="font-bold">Cardapio em atualizacao</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Os produtos cadastrados no painel apareceram aqui automaticamente.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="hide-scrollbar mb-8 flex gap-2 overflow-x-auto pb-2 sm:mb-10">
        {categories.map((category) => {
          const selected = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className="shrink-0"
              aria-pressed={selected}
            >
              <Badge
                variant={selected ? "default" : "outline"}
                className={cn(
                  "rounded-full px-4 py-2.5 transition-all duration-300 sm:px-5",
                  !selected && "bg-white/60 hover:bg-white hover:text-foreground",
                )}
              >
                {category === "Todos" ? "Todos os itens" : category}
              </Badge>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
        {filteredProducts.map((product, index) => {
          const Icon = icons[index % icons.length];
          return (
            <MotionReveal key={product.id} delay={index * 0.03}>
              <Card className="glass group h-full overflow-hidden rounded-[1.25rem] py-0 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_28px_70px_rgba(31,45,34,.11)] sm:rounded-[1.65rem]">
                <div className="relative grid h-28 place-items-center overflow-hidden bg-gradient-to-br from-primary/12 to-muted sm:h-52">
                  {product.imagem ? (
                    <Image
                      src={product.imagem}
                      alt={product.nome}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <Icon className="size-10 text-[#627966] sm:size-14" strokeWidth={1.25} />
                  )}
                </div>
                <CardContent className="grid gap-3 p-3.5 sm:flex sm:items-end sm:justify-between sm:gap-4 sm:p-6">
                  <div className="min-w-0">
                    <p className="text-[0.58rem] font-bold uppercase tracking-[0.16em] text-[#527257] sm:text-[0.68rem] sm:tracking-[0.2em]">
                      {product.categoria}
                    </p>
                    <h2 className="mt-1.5 line-clamp-2 text-sm font-bold tracking-tight text-foreground sm:mt-2 sm:text-lg">
                      {product.nome}
                    </h2>
                  </div>
                  <p className="shrink-0 font-mono text-sm font-bold text-foreground sm:text-lg">
                    R$ {product.preco.toFixed(2).replace(".", ",")}
                  </p>
                </CardContent>
              </Card>
            </MotionReveal>
          );
        })}
      </div>
    </>
  );
}
