import type { Metadata } from "next";
import { BookingPanel } from "@/components/booking-panel";
import { MotionReveal } from "@/components/motion-reveal";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = { title: "Reservas" };

export default function ReservasPage() {
  return (
    <>
      <PageHero
        eyebrow="Reserve sua quadra"
        title="Escolha o horario e solicite sua reserva."
        description="Selecione data, quadra, horario e informe um WhatsApp para confirmacao."
      />
      <section id="reserva" className="page-shell scroll-mt-28 py-10 sm:py-16 lg:py-20">
        <MotionReveal className="mx-auto max-w-4xl">
          <BookingPanel />
        </MotionReveal>
      </section>
    </>
  );
}
