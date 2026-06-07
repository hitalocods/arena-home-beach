"use client";

import { FormEvent, useState } from "react";
import { LockKeyhole, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: form.get("password") }),
    });
    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(result.error ?? "Nao foi possivel entrar.");
      return;
    }
    window.location.reload();
  }

  return (
    <div className="page-shell grid min-h-[72svh] place-items-center py-12">
      <Card className="premium-surface w-full max-w-md">
        <CardHeader className="px-6 pt-7 sm:px-8 sm:pt-8">
          <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-accent text-[#527257]">
            <LockKeyhole />
          </span>
          <CardTitle className="text-2xl font-bold tracking-tight">Acesso administrativo</CardTitle>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Entre para gerenciar reservas, horarios, cardapio e banners da arena.
          </p>
        </CardHeader>
        <CardContent className="px-6 pb-7 sm:px-8 sm:pb-8">
          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="admin-password">Senha do painel</Label>
              <Input id="admin-password" name="password" type="password" required autoComplete="current-password" className="h-12 rounded-xl bg-white/85 px-3.5" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button size="lg" className="w-full rounded-xl" disabled={loading}>
              {loading && <LoaderCircle className="animate-spin" />}
              {loading ? "Entrando..." : "Acessar painel"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
