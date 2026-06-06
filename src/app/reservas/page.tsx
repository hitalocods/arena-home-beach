import type { Metadata } from "next";
import { CircleCheck, Headphones, ShieldCheck } from "lucide-react";
import { BookingPanel } from "@/components/booking-panel";
import { MotionReveal } from "@/components/motion-reveal";
import { PageHero } from "@/components/page-hero";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Reservas" };

const benefits = [
  { icon: CircleCheck, title: "Disponibilidade clara", text: "Veja os horários livres e escolha com facilidade." },
  { icon: ShieldCheck, title: "Confirmação segura", text: "A equipe valida sua solicitação diretamente pelo WhatsApp." },
  { icon: Headphones, title: "Atendimento próximo", text: "Precisou de ajuda? Estamos a uma mensagem de distância." },
];

export default function ReservasPage() {
  return (
    <>
      <PageHero
        eyebrow="Reserve sua quadra"
        title="Seu horário, sua quadra, seu jogo."
        description="Selecione as opções abaixo para solicitar uma reserva na Arena Home Beach."
      />
      <section className="page-shell grid gap-8 py-10 lg:grid-cols-[1fr_2fr] lg:py-14">
        <MotionReveal className="space-y-4">
          {benefits.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="glass border-white/10 bg-white/[0.035]">
              <CardContent className="flex gap-4 p-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></span>
                <div>
                  <h2 className="font-bold text-white">{title}</h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
                </div>
              </CardContent>
            </Card>
          ))}
          <p className="px-2 text-xs leading-5 text-muted-foreground">
            Valores por hora: Quadras 1, 2 e 3 por R$ 60. Quadras 4 e 5 por R$ 50.
          </p>
        </MotionReveal>
        <MotionReveal delay={0.08}><BookingPanel /></MotionReveal>
      </section>
    </>
  );
}
