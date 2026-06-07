import { NextResponse } from "next/server";
import { getPrisma, isDatabaseConfigured } from "@/lib/prisma";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Banco de dados não configurado." }, { status: 503 });
  }

  const courts = await getPrisma().quadra.findMany({
    where: { ativa: true },
    orderBy: { nome: "asc" },
  });

  return NextResponse.json(
    courts.map((court) => ({ ...court, preco: Number(court.preco) })),
  );
}
