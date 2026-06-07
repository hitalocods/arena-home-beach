"use client";

import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { ImageUp, LoaderCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ImageUpload({
  resource,
  value,
  onChange,
}: {
  resource: "quadras" | "produtos" | "banners";
  value?: string;
  onChange: (url: string) => void;
}) {
  const [preview, setPreview] = useState(value ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function selectFile(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    setFile(selected);
    setError("");
    if (selected) setPreview(URL.createObjectURL(selected));
  }

  async function upload() {
    if (!file) return;
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.set("file", file);
    formData.set("resource", resource);

    try {
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const result = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error ?? "Falha no envio.");
      setPreview(result.url);
      onChange(result.url);
      setFile(null);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Falha no envio.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      {(preview || value) && (
        <div className="relative h-36 overflow-hidden rounded-xl border bg-muted">
          <Image src={preview || value || ""} alt="Prévia da imagem" fill unoptimized className="object-cover" />
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="absolute right-2 top-2 bg-white/90"
            onClick={() => {
              setPreview("");
              setFile(null);
              onChange("");
            }}
          >
            <X />
          </Button>
        </div>
      )}
      <Input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={selectFile} className="h-11 bg-white/80" />
      {file && (
        <Button type="button" variant="outline" className="w-full" disabled={loading} onClick={upload}>
          {loading ? <LoaderCircle className="animate-spin" /> : <ImageUp />}
          {loading ? "Enviando..." : "Enviar imagem"}
        </Button>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
