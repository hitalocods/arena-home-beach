"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  Check,
  Clock3,
  LoaderCircle,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Court = {
  id: string;
  nome: string;
  preco: number;
};

type TimeSlot = {
  id: string;
  horario: string;
  disponivel: boolean;
};

const fallbackCourts: Court[] = [
  { id: "demo-1", nome: "Quadra 1", preco: 60 },
  { id: "demo-2", nome: "Quadra 2", preco: 60 },
  { id: "demo-3", nome: "Quadra 3", preco: 60 },
  { id: "demo-4", nome: "Quadra 4", preco: 50 },
  { id: "demo-5", nome: "Quadra 5", preco: 50 },
];

const fallbackTimes: TimeSlot[] = ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"].map(
  (horario) => ({ id: `demo-${horario}`, horario, disponivel: true }),
);

function today() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function BookingPanel() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [times, setTimes] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedCourt, setSelectedCourt] = useState("");
  const [date, setDate] = useState(today);
  const [loadingCourts, setLoadingCourts] = useState(true);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    fetch("/api/public/courts")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setCourts(data);
        if (data[0]) {
          setLoadingTimes(true);
          setSelectedCourt(data[0].id);
        }
      })
      .catch(() => {
        setCourts(fallbackCourts);
        setSelectedCourt(fallbackCourts[0].id);
        setTimes(fallbackTimes);
        setDemoMode(true);
      })
      .finally(() => setLoadingCourts(false));
  }, []);

  useEffect(() => {
    if (!selectedCourt || !date) return;

    const controller = new AbortController();
    fetch(`/api/public/availability?quadraId=${selectedCourt}&data=${date}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setTimes(data);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          if (selectedCourt.startsWith("demo-")) {
            setTimes(fallbackTimes);
            setDemoMode(true);
          } else {
            setMessage({ type: "error", text: error.message });
          }
        }
      })
      .finally(() => setLoadingTimes(false));

    return () => controller.abort();
  }, [date, selectedCourt]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    if (!selectedTime) {
      setMessage({ type: "error", text: "Escolha um horario disponivel para continuar." });
      return;
    }
    if (demoMode) {
      setMessage({
        type: "error",
        text: "As reservas online serao liberadas assim que o banco de dados for conectado.",
      });
      return;
    }

    const formData = new FormData(event.currentTarget);
    setSubmitting(true);

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formData.get("nome"),
          telefone: formData.get("telefone"),
          quadraId: selectedCourt,
          data: date,
          horario: selectedTime,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      setMessage({
        type: "success",
        text: "Solicitacao enviada. A equipe vai confirmar sua reserva pelo WhatsApp.",
      });
      event.currentTarget.reset();
      setSelectedTime("");
      setTimes((current) =>
        current.map((slot) =>
          slot.horario === selectedTime ? { ...slot, disponivel: false } : slot,
        ),
      );
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Nao foi possivel concluir a reserva.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const selectedCourtData = courts.find((court) => court.id === selectedCourt);

  return (
    <Card className="premium-surface overflow-hidden py-0">
      <CardHeader className="border-b border-black/[0.055] bg-white/45 px-5 py-6 sm:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Reserva online</p>
            <CardTitle className="mt-2 text-2xl font-bold tracking-tight text-foreground">
              Escolha quadra e horario
            </CardTitle>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Preencha em 3 passos. A reserva fica pendente ate confirmacao da equipe.
            </p>
          </div>
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent text-[#527257]">
            <CalendarDays className="size-5" />
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-5 sm:p-8">
        <form onSubmit={submit} className="space-y-7">
          <div className="grid grid-cols-3 gap-2 rounded-2xl border border-black/[0.045] bg-white/55 p-2.5">
            {["Data", "Horario", "Contato"].map((step, index) => (
              <div key={step} className="text-center">
                <span className="mx-auto grid size-7 place-items-center rounded-full bg-accent text-xs font-bold text-[#527257]">{index + 1}</span>
                <p className="mt-1.5 text-[10px] font-semibold text-muted-foreground sm:text-xs">{step}</p>
              </div>
            ))}
          </div>
          {demoMode && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
              Modo demonstracao: os horarios aparecem para visualizacao, mas a confirmacao online depende da conexao com o banco.
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Data do jogo</Label>
              <Input
                id="date"
                type="date"
                value={date}
                min={today()}
                onChange={(event) => {
                  setLoadingTimes(true);
                  setSelectedTime("");
                  setDate(event.target.value);
                }}
                required
                className="h-12 w-full rounded-xl bg-white/85 px-3.5"
              />
            </div>
            <div className="space-y-2">
              <Label>Quadra</Label>
              {loadingCourts ? (
                <Skeleton className="h-12 w-full rounded-xl" />
              ) : (
                <Select
                  value={selectedCourt}
                  onValueChange={(value) => {
                    setLoadingTimes(true);
                    setSelectedTime("");
                    setSelectedCourt(value);
                  }}
                >
                  <SelectTrigger className="h-12! w-full rounded-xl bg-white/85 px-3.5">
                    <SelectValue placeholder="Selecione uma quadra" />
                  </SelectTrigger>
                  <SelectContent>
                    {courts.map((court) => (
                      <SelectItem value={court.id} key={court.id}>
                        {court.nome} - R$ {court.preco}/h
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <Label className="flex items-center gap-2">
                <Clock3 className="size-4 text-primary" /> Horarios disponiveis
              </Label>
              <span className="text-xs text-muted-foreground">Toque em um horario</span>
            </div>
            {loadingTimes ? (
              <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-12 rounded-xl" />
                ))}
              </div>
            ) : times.length ? (
              <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
                {times.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={!slot.disponivel}
                    onClick={() => setSelectedTime(slot.horario)}
                    className={cn(
                      "min-h-12 rounded-xl border border-black/[0.065] bg-white/75 px-2 py-3 text-sm font-semibold text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-foreground hover:shadow-sm disabled:cursor-not-allowed disabled:bg-muted/70 disabled:text-muted-foreground/45 disabled:line-through",
                      selectedTime === slot.horario &&
                        "border-primary bg-primary text-primary-foreground shadow-[0_8px_22px_rgba(67,105,72,.14)]",
                    )}
                  >
                    {slot.horario}
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground">
                Nenhum horario ativo para esta data.
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do responsavel</Label>
              <div className="relative">
                <UserRound className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <Input
                  id="name"
                  name="nome"
                  required
                  maxLength={100}
                  placeholder="Ex.: Ana Silva"
                  className="h-12 rounded-xl bg-white/85 pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">WhatsApp para confirmacao</Label>
              <Input
                id="phone"
                name="telefone"
                required
                inputMode="tel"
                placeholder="(86) 99999-9999"
                className="h-12 rounded-xl bg-white/85 px-3.5"
              />
            </div>
          </div>

          <div className="flex flex-col gap-5 rounded-2xl border border-[#739078]/15 bg-[#edf5ed] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Resumo da solicitacao</p>
              <p className="mt-1 font-bold text-foreground">
                {selectedCourtData?.nome ?? "Selecione a quadra"} -{" "}
                {selectedTime || "escolha o horario"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Confirmacao final pelo WhatsApp.</p>
            </div>
            <Button
              size="lg"
              className="w-full rounded-xl font-bold sm:w-auto"
              disabled={submitting || !selectedCourt || !selectedTime}
            >
              {submitting ? <LoaderCircle className="animate-spin" /> : <Check />}
              {submitting ? "Enviando..." : "Solicitar reserva"}
            </Button>
          </div>

          {message && (
            <div
              role="status"
              className={cn(
                "flex items-start gap-2 rounded-xl border p-3 text-sm leading-6",
                message.type === "success"
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-red-200 bg-red-50 text-red-700",
              )}
            >
              {message.type === "success" ? (
                <Check className="mt-1 size-4 shrink-0" />
              ) : (
                <AlertCircle className="mt-1 size-4 shrink-0" />
              )}
              {message.text}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
