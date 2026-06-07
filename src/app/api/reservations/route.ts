import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "@/lib/prisma";
import { createReservation } from "@/lib/reservations";
import { errorMessage } from "@/lib/validation";

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Banco de dados não configurado." }, { status: 503 });
  }

  try {
    const body = await request.json();
    const reservation = await createReservation(body);
    return NextResponse.json({ id: reservation.id, status: reservation.status }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === "P2002" || error.code === "P2034")
    ) {
      return NextResponse.json(
        { error: "O horário foi ocupado. Escolha outra opção." },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: errorMessage(error) }, { status: 400 });
  }
}
