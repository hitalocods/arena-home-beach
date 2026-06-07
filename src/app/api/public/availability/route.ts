import { StatusReserva } from "@prisma/client";
import { NextResponse } from "next/server";
import { getPrisma, isDatabaseConfigured } from "@/lib/prisma";
import { dateValue, errorMessage, requiredString } from "@/lib/validation";

export async function GET(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Banco de dados não configurado." }, { status: 503 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const quadraId = requiredString(searchParams.get("quadraId"), "Quadra");
    const data = dateValue(searchParams.get("data"));
    const prisma = getPrisma();

    const [times, reservations, blocks] = await Promise.all([
      prisma.horario.findMany({
        where: { ativo: true },
        orderBy: [{ ordem: "asc" }, { horario: "asc" }],
      }),
      prisma.reservas.findMany({
        where: {
          quadraId,
          data,
          status: { in: [StatusReserva.PENDENTE, StatusReserva.CONFIRMADA] },
        },
        select: { horario: true },
      }),
      prisma.bloqueio.findMany({
        where: { quadraId, data },
        select: { horario: true },
      }),
    ]);

    const unavailable = new Set([
      ...reservations.map((item) => item.horario),
      ...blocks.map((item) => item.horario),
    ]);

    return NextResponse.json(
      times.map((item) => ({
        id: item.id,
        horario: item.horario,
        disponivel: !unavailable.has(item.horario),
      })),
    );
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 400 });
  }
}
