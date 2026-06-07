import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { saveUploadedImage } from "@/lib/admin-data";
import { errorMessage } from "@/lib/validation";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Configure BLOB_READ_WRITE_TOKEN para habilitar uploads." },
      { status: 503 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const resource = formData.get("resource");
  const entityId = formData.get("entityId");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Selecione uma imagem válida." }, { status: 400 });
  }

  if (!ACCEPTED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Formato não suportado. Use JPG, PNG, WebP ou AVIF." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "A imagem deve ter no máximo 5 MB." }, { status: 400 });
  }

  try {
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
    const folder = typeof resource === "string" ? resource : "uploads";
    const blob = await put(`arena/${folder}/${safeName}`, file, {
      access: "public",
      addRandomSuffix: true,
    });

    if (typeof resource === "string" && typeof entityId === "string" && entityId) {
      await saveUploadedImage(resource, entityId, blob.url);
    }

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 400 });
  }
}
