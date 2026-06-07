import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { createAdminRecord, isAdminResource } from "@/lib/admin-data";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { errorMessage } from "@/lib/validation";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { resource } = await params;
  if (!isAdminResource(resource)) {
    return NextResponse.json({ error: "Módulo inválido." }, { status: 404 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const record = await createAdminRecord(resource, body);
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    const status =
      error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002" ? 409 : 400;
    return NextResponse.json({ error: errorMessage(error) }, { status });
  }
}
