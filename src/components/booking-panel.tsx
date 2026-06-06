"use client";

import { useState } from "react";
import { CalendarDays, Check, Clock3, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const courts = [
  { id: "1", name: "Quadra 1", price: 60 },
  { id: "2", name: "Quadra 2", price: 60 },
  { id: "3", name: "Quadra 3", price: 60 },
  { id: "4", name: "Quadra 4", price: 50 },
  { id: "5", name: "Quadra 5", price: 50 },
];

const times = ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];

export function BookingPanel() {
  const [selectedTime, setSelectedTime] = useState("19:00");
  const [selectedCourt, setSelectedCourt] = useState("1");

  return (
    <Card className="glass overflow-hidden border-white/10 bg-white/[0.045] py-0">
      <CardHeader className="border-b border-white/8 px-5 py-5 sm:px-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Reserva rápida</p>
            <CardTitle className="mt-1 text-xl text-white">Escolha seu horário</CardTitle>
          </div>
          <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
            <CalendarDays className="size-5" />
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-5 sm:p-7">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input id="date" type="date" defaultValue="2026-06-06" className="h-11 w-full bg-white/5" />
          </div>
          <div className="space-y-2">
            <Label>Quadra</Label>
            <Select value={selectedCourt} onValueChange={setSelectedCourt}>
              <SelectTrigger className="h-11! w-full bg-white/5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {courts.map((court) => (
                  <SelectItem value={court.id} key={court.id}>
                    {court.name} · R$ {court.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label className="mb-3 flex items-center gap-2"><Clock3 className="size-4 text-primary" /> Horários disponíveis</Label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {times.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setSelectedTime(time)}
                className={cn(
                  "rounded-xl border border-white/10 bg-white/4 px-2 py-3 text-sm font-semibold text-muted-foreground transition-all hover:border-primary/40 hover:text-white",
                  selectedTime === time && "border-primary bg-primary text-primary-foreground shadow-[0_0_20px_rgba(186,255,39,.18)]",
                )}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <div className="relative">
              <UserRound className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input id="name" placeholder="Seu nome completo" className="h-11 bg-white/5 pl-9" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">WhatsApp</Label>
            <Input id="phone" placeholder="(86) 99999-9999" className="h-11 bg-white/5" />
          </div>
        </div>
        <div className="flex flex-col gap-4 rounded-2xl border border-primary/15 bg-primary/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Resumo da reserva</p>
            <p className="mt-1 font-bold text-white">
              {courts.find((court) => court.id === selectedCourt)?.name} · {selectedTime}
            </p>
          </div>
          <Button size="lg" className="h-11 font-bold">
            <Check /> Solicitar reserva
          </Button>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          A solicitação será confirmada pela equipe via WhatsApp.
        </p>
      </CardContent>
    </Card>
  );
}
