import { Prisma, StatusReserva } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { createReservation } from "@/lib/reservations";
import {
  booleanValue,
  dateToInput,
  dateValue,
  imageUrlValue,
  integerValue,
  numberValue,
  optionalString,
  phoneValue,
  requiredString,
  timeValue,
} from "@/lib/validation";

export const adminResources = [
  "quadras",
  "reservas",
  "bloqueios",
  "produtos",
  "horarios",
  "banners",
] as const;

export type AdminResource = (typeof adminResources)[number];

export function isAdminResource(value: string): value is AdminResource {
  return adminResources.includes(value as AdminResource);
}

export async function getAdminData() {
  const prisma = getPrisma();
  const [quadras, reservas, bloqueios, produtos, horarios, banners] = await Promise.all([
    prisma.quadra.findMany({ orderBy: { nome: "asc" } }),
    prisma.reservas.findMany({
      include: { quadra: { select: { nome: true } } },
      orderBy: [{ data: "desc" }, { horario: "asc" }],
      take: 300,
    }),
    prisma.bloqueio.findMany({
      include: { quadra: { select: { nome: true } } },
      orderBy: [{ data: "desc" }, { horario: "asc" }],
      take: 300,
    }),
    prisma.produto.findMany({ orderBy: [{ categoria: "asc" }, { nome: "asc" }] }),
    prisma.horario.findMany({ orderBy: [{ ordem: "asc" }, { horario: "asc" }] }),
    prisma.banner.findMany({ orderBy: [{ ordem: "asc" }, { createdAt: "desc" }] }),
  ]);

  return {
    quadras: quadras.map((item) => ({ ...item, preco: Number(item.preco) })),
    reservas: reservas.map((item) => ({ ...item, data: dateToInput(item.data) })),
    bloqueios: bloqueios.map((item) => ({ ...item, data: dateToInput(item.data) })),
    produtos: produtos.map((item) => ({ ...item, preco: Number(item.preco) })),
    horarios,
    banners,
  };
}

export async function createAdminRecord(resource: AdminResource, body: Record<string, unknown>) {
  const prisma = getPrisma();

  switch (resource) {
    case "quadras":
      return prisma.quadra.create({
        data: {
          nome: requiredString(body.nome, "Nome"),
          preco: numberValue(body.preco, "Preço"),
          descricao: optionalString(body.descricao),
          imagem: imageUrlValue(body.imagem),
          ativa: booleanValue(body.ativa),
        },
      });
    case "produtos":
      return prisma.produto.create({
        data: {
          nome: requiredString(body.nome, "Nome"),
          preco: numberValue(body.preco, "Preço"),
          categoria: requiredString(body.categoria, "Categoria"),
          imagem: imageUrlValue(body.imagem),
          ativo: booleanValue(body.ativo),
        },
      });
    case "horarios":
      return prisma.horario.create({
        data: {
          horario: timeValue(body.horario),
          ativo: booleanValue(body.ativo),
          ordem: integerValue(body.ordem),
        },
      });
    case "banners":
      return prisma.banner.create({
        data: {
          titulo: requiredString(body.titulo, "Título"),
          imagem: imageUrlValue(body.imagem, true) as string,
          ativo: booleanValue(body.ativo),
          ordem: integerValue(body.ordem),
        },
      });
    case "bloqueios": {
      const data = dateValue(body.data);
      const quadraId = requiredString(body.quadraId, "Quadra");
      const horario = timeValue(body.horario);
      return prisma.$transaction(
        async (tx) => {
          const [court, schedule, reservation] = await Promise.all([
            tx.quadra.findFirst({ where: { id: quadraId, ativa: true } }),
            tx.horario.findFirst({ where: { horario, ativo: true } }),
            tx.reservas.findFirst({
              where: {
                quadraId,
                data,
                horario,
                status: { in: [StatusReserva.PENDENTE, StatusReserva.CONFIRMADA] },
              },
            }),
          ]);
          if (!court) throw new Error("Quadra indisponível.");
          if (!schedule) throw new Error("Horário indisponível.");
          if (reservation) throw new Error("Existe uma reserva ativa neste horário.");
          return tx.bloqueio.create({
            data: {
              quadraId,
              data,
              horario,
              motivo: optionalString(body.motivo),
            },
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    }
    case "reservas":
      return createReservation({
        nome: body.nome,
        telefone: body.telefone,
        quadraId: body.quadraId,
        data: body.data,
        horario: body.horario,
      });
  }
}

export async function updateAdminRecord(
  resource: AdminResource,
  id: string,
  body: Record<string, unknown>,
) {
  const prisma = getPrisma();

  switch (resource) {
    case "quadras":
      return prisma.quadra.update({
        where: { id },
        data: {
          nome: requiredString(body.nome, "Nome"),
          preco: numberValue(body.preco, "Preço"),
          descricao: optionalString(body.descricao),
          imagem: imageUrlValue(body.imagem),
          ativa: booleanValue(body.ativa),
        },
      });
    case "produtos":
      return prisma.produto.update({
        where: { id },
        data: {
          nome: requiredString(body.nome, "Nome"),
          preco: numberValue(body.preco, "Preço"),
          categoria: requiredString(body.categoria, "Categoria"),
          imagem: imageUrlValue(body.imagem),
          ativo: booleanValue(body.ativo),
        },
      });
    case "horarios":
      return prisma.horario.update({
        where: { id },
        data: {
          horario: timeValue(body.horario),
          ativo: booleanValue(body.ativo),
          ordem: integerValue(body.ordem),
        },
      });
    case "banners":
      return prisma.banner.update({
        where: { id },
        data: {
          titulo: requiredString(body.titulo, "Título"),
          imagem: imageUrlValue(body.imagem, true) as string,
          ativo: booleanValue(body.ativo),
          ordem: integerValue(body.ordem),
        },
      });
    case "reservas": {
      const status = requiredString(body.status, "Status") as StatusReserva;
      if (!Object.values(StatusReserva).includes(status)) throw new Error("Status inválido.");
      const data = dateValue(body.data);
      const quadraId = requiredString(body.quadraId, "Quadra");
      const horario = timeValue(body.horario);
      return prisma.$transaction(
        async (tx) => {
          const [court, schedule, block, conflict] = await Promise.all([
            tx.quadra.findUnique({ where: { id: quadraId } }),
            tx.horario.findUnique({ where: { horario } }),
            tx.bloqueio.findUnique({
              where: { quadraId_data_horario: { quadraId, data, horario } },
            }),
            tx.reservas.findFirst({
              where: {
                id: { not: id },
                quadraId,
                data,
                horario,
                status: { in: [StatusReserva.PENDENTE, StatusReserva.CONFIRMADA] },
              },
            }),
          ]);
          if (!court?.ativa) throw new Error("Quadra indisponível.");
          if (!schedule?.ativo) throw new Error("Horário indisponível.");
          if (block && status !== StatusReserva.CANCELADA) {
            throw new Error("Este horário está bloqueado.");
          }
          if (conflict && status !== StatusReserva.CANCELADA) {
            throw new Error("Existe outra reserva neste horário.");
          }
          return tx.reservas.update({
            where: { id },
            data: {
              nome: requiredString(body.nome, "Nome"),
              telefone: phoneValue(body.telefone),
              quadraId,
              data,
              horario,
              status,
            },
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    }
    case "bloqueios": {
      const data = dateValue(body.data);
      const quadraId = requiredString(body.quadraId, "Quadra");
      const horario = timeValue(body.horario);
      return prisma.$transaction(
        async (tx) => {
          const reservation = await tx.reservas.findFirst({
            where: {
              quadraId,
              data,
              horario,
              status: { in: [StatusReserva.PENDENTE, StatusReserva.CONFIRMADA] },
            },
          });
          if (reservation) throw new Error("Existe uma reserva ativa neste horário.");
          return tx.bloqueio.update({
            where: { id },
            data: {
              quadraId,
              data,
              horario,
              motivo: optionalString(body.motivo),
            },
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    }
  }
}

export async function deleteAdminRecord(resource: AdminResource, id: string) {
  const prisma = getPrisma();
  switch (resource) {
    case "quadras":
      return prisma.quadra.delete({ where: { id } });
    case "reservas":
      return prisma.reservas.delete({ where: { id } });
    case "bloqueios":
      return prisma.bloqueio.delete({ where: { id } });
    case "produtos":
      return prisma.produto.delete({ where: { id } });
    case "horarios":
      return prisma.horario.delete({ where: { id } });
    case "banners":
      return prisma.banner.delete({ where: { id } });
  }
}

export async function saveUploadedImage(resource: string, id: string, url: string) {
  const prisma = getPrisma();
  switch (resource) {
    case "quadras":
      return prisma.quadra.update({ where: { id }, data: { imagem: url } });
    case "produtos":
      return prisma.produto.update({ where: { id }, data: { imagem: url } });
    case "banners":
      return prisma.banner.update({ where: { id }, data: { imagem: url } });
    default:
      throw new Error("Destino de upload inválido.");
  }
}
