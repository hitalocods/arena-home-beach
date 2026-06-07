"use client";

import Link from "next/link";
import { AlertTriangle, House, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="page-shell grid min-h-[65vh] place-items-center py-12">
      <Card className="glass max-w-lg">
        <CardContent className="grid place-items-center gap-4 p-8 text-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-amber-50 text-amber-700">
            <AlertTriangle />
          </span>
          <div>
            <h1 className="text-xl font-bold">Não foi possível carregar esta página</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Verifique a conexão e tente novamente.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={reset}><RefreshCw /> Tentar novamente</Button>
            <Button asChild variant="outline">
              <Link href="/"><House /> Voltar ao início</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
