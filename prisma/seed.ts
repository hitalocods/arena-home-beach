import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const courts = [
  { nome: "Quadra 1", preco: 60, descricao: "Quadra de areia para beach tennis." },
  { nome: "Quadra 2", preco: 60, descricao: "Quadra de areia para beach tennis." },
  { nome: "Quadra 3", preco: 60, descricao: "Quadra de areia para beach tennis." },
  { nome: "Quadra 4", preco: 50, descricao: "Quadra de areia para beach tennis." },
  { nome: "Quadra 5", preco: 50, descricao: "Quadra de areia para beach tennis." },
];

async function main() {
  for (const court of courts) {
    const existing = await prisma.quadra.findFirst({
      where: { nome: court.nome },
      select: { id: true },
    });

    if (existing) {
      await prisma.quadra.update({ where: { id: existing.id }, data: court });
    } else {
      await prisma.quadra.create({ data: court });
    }
  }
}

main()
  .then(() => console.log("Seed concluído: 5 quadras configuradas."))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
