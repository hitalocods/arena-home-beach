"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  CircleDollarSign,
  Clock3,
  ImageIcon,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  UsersRound,
} from "lucide-react";
import { ImageUpload } from "@/components/admin/image-upload";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Resource = "quadras" | "reservas" | "bloqueios" | "produtos" | "horarios" | "banners";
type RecordValue = string | number | boolean | null | undefined;
type Item = Record<string, RecordValue | { nome: string }>;
type AdminData = Record<Resource, Item[]>;

const resources: { id: Resource; label: string }[] = [
  { id: "reservas", label: "Reservas" },
  { id: "quadras", label: "Quadras" },
  { id: "bloqueios", label: "Bloqueios" },
  { id: "produtos", label: "Cardapio" },
  { id: "horarios", label: "Horarios" },
  { id: "banners", label: "Banners" },
];

const emptyData: AdminData = {
  quadras: [],
  reservas: [],
  bloqueios: [],
  produtos: [],
  horarios: [],
  banners: [],
};

function defaultForm(resource: Resource): Record<string, RecordValue> {
  const common = { ativo: true };
  switch (resource) {
    case "quadras":
      return { nome: "", preco: 60, descricao: "", imagem: "", ativa: true };
    case "reservas":
      return { nome: "", telefone: "", quadraId: "", data: "", horario: "", status: "PENDENTE" };
    case "bloqueios":
      return { quadraId: "", data: "", horario: "", motivo: "" };
    case "produtos":
      return { nome: "", preco: 0, categoria: "", imagem: "", ...common };
    case "horarios":
      return { horario: "", ordem: 0, ...common };
    case "banners":
      return { titulo: "", imagem: "", ordem: 0, ...common };
  }
}

function Field({
  label,
  name,
  value,
  type = "text",
  onChange,
  required = true,
}: {
  label: string;
  name: string;
  value: RecordValue;
  type?: string;
  onChange: (name: string, value: RecordValue) => void;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={`field-${name}`}>{label}</Label>
      <Input
        id={`field-${name}`}
        type={type}
        value={String(value ?? "")}
        required={required}
        onChange={(event) =>
          onChange(name, type === "number" ? Number(event.target.value) : event.target.value)
        }
        className="h-10 bg-white/80"
      />
    </div>
  );
}

export function AdminDashboard() {
  const [data, setData] = useState<AdminData>(emptyData);
  const [active, setActive] = useState<Resource>("reservas");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, RecordValue>>(defaultForm("reservas"));
  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const notify = useCallback((type: "success" | "error", text: string) => {
    setToast({ type, text });
    window.setTimeout(() => setToast(null), 3500);
  }, []);

  const load = useCallback(async () => {
    await Promise.resolve();
    setLoading(true);
    try {
      const response = await fetch("/api/admin/data", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setData(result);
    } catch (error) {
      notify("error", error instanceof Error ? error.message : "Falha ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/admin/data", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        setData(result);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          notify("error", error instanceof Error ? error.message : "Falha ao carregar dados.");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [notify]);

  function openCreate() {
    setEditingId(null);
    setForm(defaultForm(active));
    setDialogOpen(true);
  }

  function openEdit(item: Item) {
    setEditingId(String(item.id));
    const next = Object.fromEntries(
      Object.entries(item).filter(([, value]) => typeof value !== "object"),
    ) as Record<string, RecordValue>;
    setForm({ ...defaultForm(active), ...next });
    setDialogOpen(true);
  }

  function change(name: string, value: RecordValue) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(
        editingId ? `/api/admin/${active}/${editingId}` : `/api/admin/${active}`,
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setDialogOpen(false);
      notify("success", editingId ? "Registro atualizado." : "Registro criado.");
      await load();
    } catch (error) {
      notify("error", error instanceof Error ? error.message : "Falha ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/${active}/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setDeleteTarget(null);
      notify("success", "Registro excluido.");
      await load();
    } catch (error) {
      notify("error", error instanceof Error ? error.message : "Falha ao excluir.");
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  const confirmed = data.reservas.filter((item) => item.status === "CONFIRMADA").length;
  const estimated = data.reservas
    .filter((item) => item.status !== "CANCELADA")
    .reduce((total, item) => {
      const court = data.quadras.find((courtItem) => courtItem.id === item.quadraId);
      return total + Number(court?.preco ?? 0);
    }, 0);
  const stats = [
    { label: "Reservas", value: data.reservas.length, icon: CalendarDays },
    { label: "Confirmadas", value: confirmed, icon: UsersRound },
    { label: "Horarios ativos", value: data.horarios.filter((item) => item.ativo).length, icon: Clock3 },
    { label: "Receita estimada", value: `R$ ${estimated}`, icon: CircleDollarSign },
  ];

  return (
    <div className="page-shell py-8 sm:py-14">
      {toast && (
        <div
          role="status"
          className={cn(
            "fixed inset-x-4 top-24 z-[80] rounded-2xl border bg-white/95 px-4 py-3 text-sm shadow-[0_18px_55px_rgba(31,45,34,.16)] backdrop-blur-xl sm:left-auto sm:right-6 sm:max-w-sm",
            toast.type === "success" ? "border-green-200 text-green-800" : "border-red-200 text-red-700",
          )}
        >
          {toast.text}
        </div>
      )}

      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <Badge className="rounded-full border-primary/15 bg-white/70 px-3 py-2 text-[#527257] shadow-sm">
            <LayoutDashboard className="size-3.5" /> Gestao da arena
          </Badge>
          <h1 className="mt-5 text-3xl font-black tracking-[-0.055em] text-foreground sm:text-5xl">
            Painel administrativo
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Gerencie reservas, horarios, cardapio e conteudos da arena.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <Button variant="outline" className="rounded-xl" onClick={load} disabled={loading}>
            <RefreshCw className={cn(loading && "animate-spin")} /> Atualizar
          </Button>
          <Button variant="outline" className="rounded-xl" onClick={logout}>
            <LogOut /> Sair
          </Button>
        </div>
      </div>

      <div className="mt-9 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="glass rounded-2xl">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start justify-between">
                <p className="text-sm text-muted-foreground">{label}</p>
                <span className="grid size-8 place-items-center rounded-xl bg-accent text-[#527257]"><Icon className="size-4" /></span>
              </div>
              <p className="mt-4 font-mono text-xl font-bold tracking-tight text-foreground sm:text-2xl">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="hide-scrollbar mt-9 flex gap-2 overflow-x-auto pb-2">
        {resources.map((resource) => (
          <Button
            key={resource.id}
            variant={active === resource.id ? "default" : "outline"}
            className="shrink-0 rounded-full px-4"
            onClick={() => setActive(resource.id)}
          >
            {resource.label}
          </Button>
        ))}
      </div>

      <Card className="glass mt-4 overflow-hidden rounded-[1.65rem] py-0">
        <div className="flex items-center justify-between gap-4 border-b px-5 py-5 sm:px-6">
          <div>
            <h2 className="font-bold">{resources.find((item) => item.id === active)?.label}</h2>
            <p className="text-xs text-muted-foreground">{data[active].length} registros</p>
          </div>
          <Button className="rounded-xl" onClick={openCreate}><Plus /> <span className="hidden sm:inline">Novo registro</span><span className="sm:hidden">Novo</span></Button>
        </div>
        {loading ? (
          <div className="space-y-3 p-5 sm:p-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-2xl" />
            ))}
          </div>
        ) : data[active].length === 0 ? (
          <div className="grid place-items-center gap-4 p-12 text-center sm:p-16">
            <span className="grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
              {active === "banners" ? <ImageIcon /> : <LayoutDashboard />}
            </span>
            <div>
              <p className="font-semibold">Nenhum registro encontrado</p>
              <p className="mt-1 text-sm text-muted-foreground">Crie o primeiro item deste modulo.</p>
            </div>
          </div>
        ) : (
          <ResourceTable
            resource={active}
            items={data[active]}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
          />
        )}
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[88svh] overflow-y-auto rounded-t-[1.75rem] sm:max-w-xl sm:rounded-2xl">
          <form onSubmit={save}>
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar registro" : "Novo registro"}</DialogTitle>
              <DialogDescription>Preencha os dados e confirme para salvar no Neon.</DialogDescription>
            </DialogHeader>
            <div className="my-6 grid gap-5 sm:grid-cols-2">
              <ResourceForm
                resource={active}
                form={form}
                editing={Boolean(editingId)}
                data={data}
                onChange={change}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" className="rounded-xl" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" className="rounded-xl" disabled={saving}>
                {saving && <LoaderCircle className="animate-spin" />}
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir registro?</DialogTitle>
            <DialogDescription>Esta acao e permanente e nao pode ser desfeita.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={remove} disabled={saving}>
              {saving ? <LoaderCircle className="animate-spin" /> : <Trash2 />} Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ResourceTable({
  resource,
  items,
  onEdit,
  onDelete,
}: {
  resource: Resource;
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}) {
  function itemContent(item: Item) {
    const court = typeof item.quadra === "object" ? item.quadra : null;
    const title = String(
      item.nome ?? item.titulo ?? item.horario ?? court?.nome ?? "Registro",
    );
    const details =
      resource === "reservas" || resource === "bloqueios"
        ? `${item.data} - ${item.horario}`
        : resource === "quadras" || resource === "produtos"
          ? `R$ ${item.preco}`
          : `Ordem ${item.ordem}`;
    const status =
      resource === "reservas"
        ? String(item.status)
        : Boolean(item.ativa ?? item.ativo)
          ? "Ativo"
          : "Inativo";
    return { title, details, status };
  }

  return (
    <>
      <div className="grid gap-3 p-4 sm:hidden">
        {items.map((item) => {
          const content = itemContent(item);
          return (
            <div key={String(item.id)} className="rounded-2xl border border-black/[0.055] bg-white/65 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-foreground">{content.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{content.details}</p>
                </div>
                <StatusBadge status={content.status} />
              </div>
              <div className="mt-4 flex justify-end gap-2 border-t border-black/[0.05] pt-3">
                <Button variant="outline" size="sm" className="rounded-xl" onClick={() => onEdit(item)}><Pencil /> Editar</Button>
                <Button variant="ghost" size="sm" className="rounded-xl text-destructive" onClick={() => onDelete(item)}><Trash2 /> Excluir</Button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="hidden overflow-x-auto sm:block">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Registro</TableHead>
            <TableHead>Detalhes</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Acoes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const content = itemContent(item);

            return (
              <TableRow key={String(item.id)}>
                <TableCell className="min-w-44 font-medium">{content.title}</TableCell>
                <TableCell className="min-w-36 text-muted-foreground">{content.details}</TableCell>
                <TableCell>
                  <StatusBadge status={content.status} />
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => onEdit(item)}><Pencil /></Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => onDelete(item)}><Trash2 /></Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        </Table>
      </div>
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toUpperCase();
  return (
    <Badge
      variant="outline"
      className={cn(
        "shrink-0 rounded-full px-2.5",
        (normalized === "ATIVO" || normalized === "CONFIRMADA") &&
          "border-green-200 bg-green-50 text-green-700",
        normalized === "PENDENTE" && "border-amber-200 bg-amber-50 text-amber-700",
        (normalized === "INATIVO" || normalized === "CANCELADA") &&
          "border-zinc-200 bg-zinc-50 text-zinc-600",
      )}
    >
      {status}
    </Badge>
  );
}

function ResourceForm({
  resource,
  form,
  editing,
  data,
  onChange,
}: {
  resource: Resource;
  form: Record<string, RecordValue>;
  editing: boolean;
  data: AdminData;
  onChange: (name: string, value: RecordValue) => void;
}) {
  return (
    <>
      {(resource === "quadras" || resource === "produtos") && (
        <>
          <Field label="Nome" name="nome" value={form.nome} onChange={onChange} />
          <Field label="Preco" name="preco" type="number" value={form.preco} onChange={onChange} />
        </>
      )}
      {resource === "quadras" && (
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="descricao">Descricao</Label>
          <Textarea id="descricao" value={String(form.descricao ?? "")} onChange={(event) => onChange("descricao", event.target.value)} />
        </div>
      )}
      {resource === "produtos" && (
        <Field label="Categoria" name="categoria" value={form.categoria} onChange={onChange} />
      )}
      {resource === "horarios" && (
        <Field label="Horario" name="horario" type="time" value={form.horario} onChange={onChange} />
      )}
      {resource === "banners" && (
        <Field label="Titulo" name="titulo" value={form.titulo} onChange={onChange} />
      )}
      {(resource === "horarios" || resource === "banners") && (
        <Field label="Ordem" name="ordem" type="number" value={form.ordem} onChange={onChange} />
      )}
      {(resource === "reservas" || resource === "bloqueios") && (
        <>
          <SelectField
            label="Quadra"
            value={String(form.quadraId ?? "")}
            options={data.quadras.map((court) => [String(court.id), String(court.nome)])}
            onChange={(value) => onChange("quadraId", value)}
          />
          <Field label="Data" name="data" type="date" value={form.data} onChange={onChange} />
          <SelectField
            label="Horario"
            value={String(form.horario ?? "")}
            options={data.horarios.map((time) => [String(time.horario), String(time.horario)])}
            onChange={(value) => onChange("horario", value)}
          />
        </>
      )}
      {resource === "reservas" && (
        <>
          <Field label="Nome" name="nome" value={form.nome} onChange={onChange} />
          <Field label="WhatsApp" name="telefone" value={form.telefone} onChange={onChange} />
          {editing && (
            <SelectField
              label="Status"
              value={String(form.status)}
              options={[
                ["PENDENTE", "Pendente"],
                ["CONFIRMADA", "Confirmada"],
                ["CANCELADA", "Cancelada"],
              ]}
              onChange={(value) => onChange("status", value)}
            />
          )}
        </>
      )}
      {resource === "bloqueios" && (
        <Field label="Motivo" name="motivo" value={form.motivo} onChange={onChange} required={false} />
      )}
      {(resource === "quadras" || resource === "produtos" || resource === "banners") && (
        <div className="sm:col-span-2">
          <Label className="mb-2 block">Imagem</Label>
          <ImageUpload
            resource={resource}
            value={String(form.imagem ?? "")}
            onChange={(url) => onChange("imagem", url)}
          />
        </div>
      )}
      {(resource === "quadras" || resource === "produtos" || resource === "horarios" || resource === "banners") && (
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={Boolean(form[resource === "quadras" ? "ativa" : "ativo"])}
            onChange={(event) =>
              onChange(resource === "quadras" ? "ativa" : "ativo", event.target.checked)
            }
            className="size-4 accent-primary"
          />
          Ativo
        </label>
      )}
    </>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[][];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <select
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border bg-white/85 px-3 text-sm outline-none transition-shadow focus:ring-3 focus:ring-ring/20"
      >
        <option value="">Selecione</option>
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>{optionLabel}</option>
        ))}
      </select>
    </div>
  );
}
