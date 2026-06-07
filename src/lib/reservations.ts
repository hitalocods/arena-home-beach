import { Prisma, StatusReserva } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import {
  dateValue,
  phoneValue,
  requiredString,
  timeValue,
  todayInSaoPaulo,
} from "@/lib/validation";

export type ReservationInput = {
  nome: unknown;
  telefone: unknown;
  quadraId: unknown;
  data: unknown;
  horario: unknown;
};

export function parseReservationInput(input: ReservationInput) {
  const dataText = requiredString(input.data, "Data", 10);
  if (dataText < todayInSaoPaulo()) {
    throw new Error("Não é possível reservar uma data passada.");
  }

  return {
    nome: requiredString(input.nome, "Nome", 100),
    telefone: phoneValue(input.telefone),
    quadraId: requiredString(input.quadraId, "Quadra", 100),
    data: dateValue(dataText),
    horario: timeValue(input.horario),
  };
}

export async function createReservation(input: ReservationInput) {
  const data = parseReservationInput(input);
  const prisma = getPrisma();

  return prisma.$transaction(
    async (tx) => {
      const [court, schedule, block, existing] = await Promise.all([
        tx.quadra.findFirst({ where: { id: data.quadraId, ativa: true } }),
        tx.horario.findFirst({ where: { horario: data.horario, ativo: true } }),
        tx.bloqueio.findUnique({
          where: {
            quadraId_data_horario: {
              quadraId: data.quadraId,
              data: data.data,
              horario: data.horario,
            },
          },
        }),
        tx.reservas.findUnique({
          where: {
            quadraId_data_horario: {
              quadraId: data.quadraId,
              data: data.data,
              horario: data.horario,
            },
          },
        }),
      ]);

      if (!court) throw new Error("Quadra indisponível.");
      if (!schedule) throw new Error("Horário indisponível.");
      if (block) throw new Error("Este horário está bloqueado.");
      if (existing && existing.status !== StatusReserva.CANCELADA) {
        throw new Error("Este horário acabou de ser reservado.");
      }

      if (existing) {
        return tx.reservas.update({
          where: { id: existing.id },
          data: { ...data, status: StatusReserva.PENDENTE },
        });
      }

      return tx.reservas.create({ data });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );
}
