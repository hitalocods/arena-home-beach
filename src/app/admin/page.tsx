import type { Metadata } from "next";
import { CalendarDays, CircleDollarSign, Clock3, ImageIcon, LayoutDashboard, MoreHorizontal, UsersRound } from "lucide-react";
import { ImageUpload } from "@/components/admin/image-upload";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata: Metadata = { title: "Painel Administrativo" };

const reservations = [
  { name: "Marcos Silva", court: "Quadra 1", date: "06 jun", time: "19:00", status: "Confirmada" },
  { name: "Ana Beatriz", court: "Quadra 3", date: "06 jun", time: "20:00", status: "Pendente" },
  { name: "Pedro Lima", court: "Quadra 4", date: "07 jun", time: "18:00", status: "Confirmada" },
  { name: "Lucas Rocha", court: "Quadra 2", date: "07 jun", time: "21:00", status: "Pendente" },
];

const stats = [
  { label: "Reservas hoje", value: "12", note: "+3 desde ontem", icon: CalendarDays },
  { label: "Ocupação", value: "78%", note: "Horário de pico 19h", icon: UsersRound },
  { label: "Faturamento", value: "R$ 680", note: "Estimativa do dia", icon: CircleDollarSign },
  { label: "Próxima reserva", value: "18:00", note: "Quadra 4", icon: Clock3 },
];

export default function AdminPage() {
  return (
    <div className="page-shell py-8 sm:py-12">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <Badge className="border-primary/20 bg-primary/10 text-primary"><LayoutDashboard className="size-3.5" /> Gestão da arena</Badge>
          <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">Painel administrativo</h1>
          <p className="mt-2 text-sm text-muted-foreground">Visão geral da operação da Arena Home Beach.</p>
        </div>
        <Button className="font-bold"><CalendarDays /> Nova reserva</Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, note, icon: Icon }) => (
          <Card key={label} className="glass border-white/10 bg-white/[0.035]">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <p className="text-sm text-muted-foreground">{label}</p>
                <Icon className="size-4 text-primary" />
              </div>
              <p className="mt-3 font-mono text-2xl font-bold text-white">{value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="reservas" className="mt-8">
        <TabsList className="w-full justify-start overflow-x-auto bg-white/5 sm:w-auto">
          <TabsTrigger value="reservas">Reservas</TabsTrigger>
          <TabsTrigger value="quadras">Quadras</TabsTrigger>
          <TabsTrigger value="produtos">Produtos</TabsTrigger>
          <TabsTrigger value="midia">Mídia</TabsTrigger>
        </TabsList>
        <TabsContent value="reservas">
          <Card className="glass mt-4 overflow-hidden border-white/10 bg-white/[0.035] py-0">
            <CardHeader className="border-b border-white/8 py-5"><CardTitle className="text-base text-white">Próximas reservas</CardTitle></CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>Cliente</TableHead><TableHead>Quadra</TableHead><TableHead>Data</TableHead><TableHead>Horário</TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader>
                <TableBody>
                  {reservations.map((item) => (
                    <TableRow key={`${item.name}-${item.time}`}>
                      <TableCell className="font-medium text-white">{item.name}</TableCell>
                      <TableCell>{item.court}</TableCell><TableCell>{item.date}</TableCell><TableCell className="font-mono">{item.time}</TableCell>
                      <TableCell><Badge variant="outline" className={item.status === "Confirmada" ? "border-primary/25 text-primary" : "border-amber-400/25 text-amber-300"}>{item.status}</Badge></TableCell>
                      <TableCell><Button variant="ghost" size="icon-sm"><MoreHorizontal /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="quadras">
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[60, 60, 60, 50, 50].map((price, index) => (
              <Card key={index} className="glass border-white/10 bg-white/[0.035]"><CardContent className="p-5"><div className="flex items-center justify-between"><h2 className="font-bold text-white">Quadra {index + 1}</h2><Badge className="bg-primary/10 text-primary">Ativa</Badge></div><p className="mt-5 font-mono text-2xl font-bold text-white">R$ {price}<span className="text-xs font-normal text-muted-foreground"> / hora</span></p></CardContent></Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="produtos">
          <Card className="glass mt-4 border-white/10 bg-white/[0.035]"><CardContent className="p-8 text-center text-sm text-muted-foreground">Cadastre e organize os itens exibidos no cardápio.</CardContent></Card>
        </TabsContent>
        <TabsContent value="midia">
          <Card className="glass mt-4 max-w-xl border-white/10 bg-white/[0.035]">
            <CardHeader><CardTitle className="flex items-center gap-2 text-base text-white"><ImageIcon className="size-4 text-primary" /> Upload de imagens</CardTitle></CardHeader>
            <CardContent><ImageUpload /></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
