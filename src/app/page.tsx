import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Clock3,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Trophy,
  UtensilsCrossed,
} from "lucide-react";
import { BookingPanel } from "@/components/booking-panel";
import { CourtVisual } from "@/components/court-visual";
import { MotionReveal } from "@/components/motion-reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPrisma, isDatabaseConfigured } from "@/lib/prisma";

const highlights = [
  { icon: Trophy, title: "5 quadras", text: "Estrutura pronta para treino, jogo e resenha." },
  { icon: Clock3, title: "Horarios flexiveis", text: "Escolha data e horario com poucos toques." },
  { icon: UtensilsCrossed, title: "Cozinha da arena", text: "Bebidas e lanches para completar a experiencia." },
];

export const dynamic = "force-dynamic";

async function getActiveBanner() {
  if (!isDatabaseConfigured()) return null;
  try {
    return await getPrisma().banner.findFirst({
      where: { ativo: true },
      orderBy: [{ ordem: "asc" }, { createdAt: "desc" }],
    });
  } catch {
    return null;
  }
}

export default async function Home() {
  const banner = await getActiveBanner();

  return (
    <>
      <section className="page-shell grid min-h-[calc(100svh-5.5rem)] items-center gap-12 py-10 sm:gap-14 sm:py-16 lg:grid-cols-[.95fr_1.05fr] lg:py-20">
        <MotionReveal>
          <Badge className="rounded-full border-primary/20 bg-white/75 px-3 py-2 text-[#527257] shadow-sm backdrop-blur">
            <Sparkles className="size-3.5" /> Sua arena em Teresina
          </Badge>
          <h1 className="mt-7 max-w-2xl text-[3rem] font-black leading-[0.96] tracking-[-0.06em] text-foreground sm:text-6xl lg:text-[4.6rem]">
            Seu jogo.
            <br />
            <span className="text-[#527257]">Sua vibe.</span>
            <br />
            Sua arena.
          </h1>
          <p className="mt-7 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Beach tennis, bons encontros e uma experiencia completa em um so lugar.
            Escolha a quadra, o horario e solicite sua reserva.
          </p>
          <div className="mt-10 grid max-w-xl gap-3.5 sm:grid-cols-2">
            <Button asChild size="lg" className="soft-shadow rounded-2xl px-6 text-base font-bold sm:col-span-2">
              <Link href="/reservas#reserva">Ver horarios e reservar <ArrowRight /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-2xl px-5 text-base">
              <Link href="/cardapio"><UtensilsCrossed /> Ver cozinha e cardapio</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-2xl px-5 text-base">
              <a href="https://wa.me/5586999815784"><MessageCircle /> Falar no WhatsApp</a>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[0.82rem] font-medium text-muted-foreground">
            <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" /> Reserva simples</span>
            <span className="flex items-center gap-2"><CalendarCheck className="size-4 text-primary" /> Confirmacao via WhatsApp</span>
          </div>
        </MotionReveal>
        <MotionReveal delay={0.12} className="relative">
          <CourtVisual className="h-[390px] sm:h-[540px]" />
          <Card className="glass absolute -bottom-5 left-4 right-4 rounded-2xl py-0 sm:left-8 sm:right-auto sm:w-72">
            <CardContent className="flex items-center gap-3 p-4">
              <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
                <MapPin className="size-5" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Estamos em</p>
                <p className="font-bold text-foreground">Sao Pedro, Teresina - PI</p>
              </div>
            </CardContent>
          </Card>
        </MotionReveal>
      </section>

      {banner && (
        <section className="page-shell py-6 sm:py-10">
          <MotionReveal className="relative h-56 overflow-hidden rounded-[2rem] border border-black/[0.07] shadow-[0_20px_60px_rgba(48,72,53,.1)] sm:h-80">
            <Image src={banner.imagem} alt={banner.titulo} fill className="object-cover" sizes="(max-width: 1280px) 100vw, 1280px" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
            <h2 className="absolute bottom-6 left-6 max-w-xl text-2xl font-black tracking-tight text-white sm:bottom-8 sm:left-8 sm:text-4xl">
              {banner.titulo}
            </h2>
          </MotionReveal>
        </section>
      )}

      <section className="page-shell section-space">
        <MotionReveal className="grid gap-4 md:grid-cols-3">
          {highlights.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="glass rounded-[1.6rem] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_26px_70px_rgba(31,45,34,.1)]">
              <CardContent className="p-7">
                <span className="grid size-12 place-items-center rounded-2xl bg-accent text-[#527257]"><Icon className="size-5" /></span>
                <h2 className="mt-6 text-lg font-bold tracking-tight text-foreground">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
              </CardContent>
            </Card>
          ))}
        </MotionReveal>
      </section>

      <section className="page-shell section-space">
        <div className="grid items-start gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-16">
          <MotionReveal>
            <p className="eyebrow">Agende em poucos passos</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] text-foreground sm:text-5xl">
              A proxima partida comeca aqui.
            </h2>
            <p className="mt-5 max-w-lg leading-7 text-muted-foreground">
              Consulte a disponibilidade das quadras, informe seus dados e envie a solicitacao.
              A equipe confirma tudo pelo WhatsApp.
            </p>
            <div className="mt-9 space-y-3">
              {["Escolha a data e a quadra", "Selecione o melhor horario", "Receba a confirmacao da equipe"].map((step, index) => (
                <div key={step} className="flex items-center gap-4 rounded-2xl border border-black/[0.045] bg-white/55 p-3.5 backdrop-blur">
                  <span className="grid size-9 place-items-center rounded-full bg-accent font-mono text-xs font-bold text-[#527257]">0{index + 1}</span>
                  <span className="text-sm font-semibold text-foreground">{step}</span>
                </div>
              ))}
            </div>
          </MotionReveal>
          <MotionReveal delay={0.1}><BookingPanel /></MotionReveal>
        </div>
      </section>

      <section className="page-shell pb-20 pt-8 sm:pb-28 sm:pt-12">
        <MotionReveal className="relative overflow-hidden rounded-[2rem] border border-[#78957b]/15 bg-gradient-to-br from-[#dcebdc] to-[#c4dbc6] p-8 text-[#1e2920] shadow-[0_24px_70px_rgba(63,93,69,.13)] sm:p-12">
          <div className="absolute -right-20 -top-32 size-80 rounded-full border-[50px] border-black/5" />
          <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em]">Arena Home Beach</p>
              <h2 className="mt-3 max-w-xl text-3xl font-black tracking-[-0.05em] sm:text-4xl">Mais que esporte. O seu ponto de encontro.</h2>
            </div>
            <Button asChild size="lg" className="h-12 rounded-2xl bg-[#202522] px-6 text-white hover:bg-[#313834]">
              <Link href="/localizacao">Ver localizacao <MapPin /></Link>
            </Button>
          </div>
        </MotionReveal>
      </section>
    </>
  );
}
