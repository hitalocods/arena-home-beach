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

const highlights = [
  { icon: Trophy, title: "5 quadras", text: "Estrutura pronta para seu melhor jogo." },
  { icon: Clock3, title: "Horários flexíveis", text: "Reserve seu momento com praticidade." },
  { icon: UtensilsCrossed, title: "Bar completo", text: "Bebidas e petiscos para fechar a resenha." },
];

export default function Home() {
  return (
    <>
      <section className="page-shell grid min-h-[calc(100vh-4.5rem)] items-center gap-10 py-12 lg:grid-cols-[1.02fr_.98fr] lg:py-20">
        <MotionReveal>
          <Badge className="border-primary/20 bg-primary/10 text-primary">
            <Sparkles className="size-3.5" /> Sua arena em Teresina
          </Badge>
          <h1 className="mt-6 max-w-2xl text-5xl font-black leading-[0.95] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
            Seu jogo.
            <br />
            <span className="text-primary">Sua vibe.</span>
            <br />
            Sua arena.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Beach tennis, bons encontros e uma experiência completa em um só lugar. Escolha a quadra, o horário e venha jogar.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="neon-shadow h-12 px-6 text-base font-bold">
              <Link href="/reservas">Reservar quadra <ArrowRight /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-6 text-base">
              <a href="https://wa.me/5586999815784"><MessageCircle /> Falar no WhatsApp</a>
            </Button>
          </div>
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" /> Reserva simples</span>
            <span className="flex items-center gap-2"><CalendarCheck className="size-4 text-primary" /> Confirmação via WhatsApp</span>
          </div>
        </MotionReveal>
        <MotionReveal delay={0.12} className="relative">
          <CourtVisual className="h-[380px] sm:h-[500px]" />
          <Card className="glass absolute -bottom-5 left-4 right-4 border-white/10 py-0 sm:left-8 sm:right-auto sm:w-72">
            <CardContent className="flex items-center gap-3 p-4">
              <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
                <MapPin className="size-5" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Estamos em</p>
                <p className="font-bold text-white">São Pedro, Teresina - PI</p>
              </div>
            </CardContent>
          </Card>
        </MotionReveal>
      </section>

      <section className="page-shell py-14 sm:py-20">
        <MotionReveal className="grid gap-4 md:grid-cols-3">
          {highlights.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="glass border-white/10 bg-white/[0.035] transition-colors hover:border-primary/25">
              <CardContent className="p-6">
                <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary"><Icon /></span>
                <h2 className="mt-5 text-lg font-bold text-white">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
              </CardContent>
            </Card>
          ))}
        </MotionReveal>
      </section>

      <section className="page-shell py-14 sm:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-[.75fr_1.25fr]">
          <MotionReveal>
            <Badge className="border-primary/20 bg-primary/10 text-primary">Agende em poucos passos</Badge>
            <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
              A próxima partida começa aqui.
            </h2>
            <p className="mt-5 max-w-lg leading-7 text-muted-foreground">
              Consulte a disponibilidade das quadras e envie sua solicitação. Nossa equipe confirma tudo pelo WhatsApp.
            </p>
            <div className="mt-8 space-y-4">
              {["Escolha a data e a quadra", "Selecione o melhor horário", "Receba a confirmação da equipe"].map((step, index) => (
                <div key={step} className="flex items-center gap-3">
                  <span className="grid size-8 place-items-center rounded-full border border-primary/25 bg-primary/8 font-mono text-xs font-bold text-primary">0{index + 1}</span>
                  <span className="text-sm font-medium text-white">{step}</span>
                </div>
              ))}
            </div>
          </MotionReveal>
          <MotionReveal delay={0.1}><BookingPanel /></MotionReveal>
        </div>
      </section>

      <section className="page-shell py-14 sm:py-20">
        <MotionReveal className="relative overflow-hidden rounded-3xl border border-primary/20 bg-primary p-7 text-primary-foreground sm:p-10">
          <div className="absolute -right-20 -top-32 size-80 rounded-full border-[50px] border-black/5" />
          <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em]">Arena Home Beach</p>
              <h2 className="mt-2 max-w-xl text-3xl font-black tracking-[-0.04em] sm:text-4xl">Mais que esporte. O seu ponto de encontro.</h2>
            </div>
            <Button asChild size="lg" className="h-12 bg-black px-6 text-white hover:bg-black/80">
              <Link href="/localizacao">Como chegar <MapPin /></Link>
            </Button>
          </div>
        </MotionReveal>
      </section>
    </>
  );
}
