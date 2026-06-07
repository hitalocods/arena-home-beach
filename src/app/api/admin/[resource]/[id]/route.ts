import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import {
  deleteAdminRecord,
  isAdminResource,
  updateAdminRecord,
} from "@/lib/admin-data";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { errorMessage } from "@/lib/validation";

async function context(params: Promise<{ resource: string; id: string }>) {
  const values = await params;
  if (!isAdminResource(values.resource)) throw new Error("Módulo inválido.");
  return values as { resource: Parameters<typeof updateAdminRecord>[0]; id: string };
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ resource: string; id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const { resource, id } = await context(params);
    const body = (await request.json()) as Record<string, unknown>;
    return NextResponse.json(await updateAdminRecord(resource, id, body));
  } catch (error) {
    const status =
      error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002" ? 409 : 400;
    return NextResponse.json({ error: errorMessage(error) }, { status });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ resource: string; id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const { resource, id } = await context(params);
    await deleteAdminRecord(resource, id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const status =
      error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003" ? 409 : 400;
    return NextResponse.json({ error: errorMessage(error) }, { status });
  }
}
