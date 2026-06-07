import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const courts = [
  { nome: "Quadra 1", preco: 60, descricao: "Quadra de areia para beach tennis." },
  { nome: "Quadra 2", preco: 60, descricao: "Quadra de areia para beach tennis." },
  { nome: "Quadra 3", preco: 60, descricao: "Quadra de areia para beach tennis." },
  { nome: "Quadra 4", preco: 50, descricao: "Quadra de areia para beach tennis." },
  { nome: "Quadra 5", preco: 50, descricao: "Quadra de areia para beach tennis." },
];

const times = [
  "08:00",
  "09:00",
  "10:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];

async function main() {
  await prisma.$transaction([
    ...courts.map((court) =>
      prisma.quadra.upsert({
        where: { nome: court.nome },
        update: court,
        create: court,
      }),
    ),
    ...times.map((time, index) =>
      prisma.horario.upsert({
        where: { horario: time },
        update: { ordem: index, ativo: true },
        create: { horario: time, ordem: index },
      }),
    ),
  ]);

  console.log(`Seed concluído: ${courts.length} quadras e ${times.length} horários.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
