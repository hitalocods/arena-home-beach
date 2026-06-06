"use client";

import { useState } from "react";
import { ImageUp, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ImageUpload() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setStatus("");
    const response = await fetch("/api/upload", { method: "POST", body: formData });
    const result = (await response.json()) as { url?: string; error?: string };
    setLoading(false);
    setStatus(result.url ? "Imagem enviada com sucesso." : result.error ?? "Falha no envio.");
  }

  return (
    <form action={handleSubmit} className="space-y-3">
      <Input name="file" type="file" accept="image/*" required className="h-11 bg-white/5" />
      <Button type="submit" variant="outline" className="w-full" disabled={loading}>
        {loading ? <LoaderCircle className="animate-spin" /> : <ImageUp />} Enviar para Vercel Blob
      </Button>
      {status && <p className="text-xs text-muted-foreground">{status}</p>}
    </form>
  );
}
