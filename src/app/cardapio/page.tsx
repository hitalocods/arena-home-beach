import type { Metadata } from "next";
import { Beer, Coffee, CupSoda, Sandwich, Sparkles } from "lucide-react";
import { MotionReveal } from "@/components/motion-reveal";
import { PageHero } from "@/components/page-hero";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Cardápio" };

const products = [
  { name: "Água mineral", category: "Bebidas", price: 4, icon: CupSoda, color: "from-sky-500/25" },
  { name: "Refrigerante lata", category: "Bebidas", price: 6, icon: CupSoda, color: "from-red-500/25" },
  { name: "Cerveja long neck", category: "Cervejas", price: 10, icon: Beer, color: "from-amber-500/25" },
  { name: "Energético", category: "Bebidas", price: 14, icon: Sparkles, color: "from-primary/25" },
  { name: "Sanduíche da arena", category: "Lanches", price: 18, icon: Sandwich, color: "from-orange-500/25" },
  { name: "Café espresso", category: "Quentes", price: 5, icon: Coffee, color: "from-yellow-900/40" },
];

export default function CardapioPage() {
  return (
    <>
      <PageHero
        eyebrow="Bar da Arena"
        title="Recarregue as energias."
        description="Bebidas geladas, lanches e tudo o que combina com jogo e resenha."
      />
      <section className="page-shell py-10 sm:py-14">
        <div className="mb-7 flex gap-2 overflow-x-auto pb-2">
          {["Todos", "Bebidas", "Cervejas", "Lanches", "Quentes"].map((item, index) => (
            <Badge key={item} variant={index === 0 ? "default" : "outline"} className="shrink-0 px-4 py-2">
              {item}
            </Badge>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map(({ name, category, price, icon: Icon, color }, index) => (
            <MotionReveal key={name} delay={index * 0.04}>
              <Card className="glass group h-full overflow-hidden border-white/10 bg-white/[0.035] py-0 transition-all hover:-translate-y-1 hover:border-primary/25">
                <div className={`relative grid h-40 place-items-center bg-gradient-to-br ${color} to-transparent`}>
                  <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:24px_24px]" />
                  <Icon className="size-16 text-white/85 transition-transform group-hover:scale-110" strokeWidth={1.3} />
                </div>
                <CardContent className="flex items-end justify-between p-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">{category}</p>
                    <h2 className="mt-1 font-bold text-white">{name}</h2>
                  </div>
                  <p className="font-mono text-lg font-bold text-white">R$ {price}</p>
                </CardContent>
              </Card>
            </MotionReveal>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-muted-foreground">Cardápio demonstrativo. Itens e valores podem ser atualizados no painel administrativo.</p>
      </section>
    </>
  );
}
