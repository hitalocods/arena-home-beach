import type { Metadata } from "next";
import { Clock3, MapPinned, MessageCircle, Navigation } from "lucide-react";
import { MotionReveal } from "@/components/motion-reveal";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Localização" };

export default function LocalizacaoPage() {
  const mapsUrl = "https://www.google.com/maps/search/?api=1&query=R.%20Porto%2C%201110%20-%20S%C3%A3o%20Pedro%2C%20Teresina%20-%20PI%2C%2064019-500";

  return (
    <>
      <PageHero
        eyebrow="Venha nos visitar"
        title="Fácil de chegar. Difícil querer ir embora."
        description="Estamos no bairro São Pedro, em Teresina, com uma estrutura completa esperando por você."
      />
      <section className="page-shell grid gap-6 py-10 lg:grid-cols-[1.5fr_.7fr] lg:py-14">
        <MotionReveal className="min-h-[430px] overflow-hidden rounded-3xl border border-white/10">
          <iframe
            title="Mapa da Arena Home Beach"
            src="https://www.google.com/maps?q=R.%20Porto%2C%201110%20S%C3%A3o%20Pedro%20Teresina%20PI&output=embed"
            className="h-full min-h-[430px] w-full grayscale-[.75] contrast-125"
            loading="lazy"
          />
        </MotionReveal>
        <MotionReveal delay={0.08} className="space-y-4">
          <Card className="glass border-white/10 bg-white/[0.035]">
            <CardContent className="p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary"><MapPinned /></span>
              <h2 className="mt-5 text-xl font-bold text-white">Arena Home Beach</h2>
              <p className="mt-2 leading-6 text-muted-foreground">
                R. Porto, 1110 - São Pedro<br />Teresina - PI, 64019-500
              </p>
              <Button asChild size="lg" className="mt-6 h-11 w-full font-bold">
                <a href={mapsUrl} target="_blank" rel="noreferrer"><Navigation /> Abrir rota</a>
              </Button>
            </CardContent>
          </Card>
          <Card className="glass border-white/10 bg-white/[0.035]">
            <CardContent className="space-y-5 p-6">
              <div className="flex gap-3">
                <Clock3 className="mt-0.5 size-5 text-primary" />
                <div><p className="font-bold text-white">Funcionamento</p><p className="mt-1 text-sm text-muted-foreground">Todos os dias, das 17h às 23h</p></div>
              </div>
              <div className="flex gap-3">
                <MessageCircle className="mt-0.5 size-5 text-primary" />
                <div><p className="font-bold text-white">WhatsApp</p><a href="https://wa.me/5586999815784" className="mt-1 block text-sm text-muted-foreground">+55 86 99981-5784</a></div>
              </div>
            </CardContent>
          </Card>
        </MotionReveal>
      </section>
    </>
  );
}
