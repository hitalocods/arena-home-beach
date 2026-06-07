CREATE TYPE "StatusReserva" AS ENUM ('PENDENTE', 'CONFIRMADA', 'CANCELADA');

CREATE TABLE "quadras" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "descricao" TEXT,
    "imagem" TEXT,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "quadras_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "reservas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "quadraId" TEXT NOT NULL,
    "data" DATE NOT NULL,
    "horario" TEXT NOT NULL,
    "status" "StatusReserva" NOT NULL DEFAULT 'PENDENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "reservas_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "bloqueios" (
    "id" TEXT NOT NULL,
    "quadraId" TEXT NOT NULL,
    "data" DATE NOT NULL,
    "horario" TEXT NOT NULL,
    "motivo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "bloqueios_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "horarios" (
    "id" TEXT NOT NULL,
    "horario" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "horarios_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "produtos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "categoria" TEXT NOT NULL,
    "imagem" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "banners" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "imagem" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "quadras_nome_key" ON "quadras"("nome");
CREATE UNIQUE INDEX "reservas_quadraId_data_horario_key" ON "reservas"("quadraId", "data", "horario");
CREATE INDEX "reservas_data_status_idx" ON "reservas"("data", "status");
CREATE INDEX "reservas_telefone_idx" ON "reservas"("telefone");
CREATE UNIQUE INDEX "bloqueios_quadraId_data_horario_key" ON "bloqueios"("quadraId", "data", "horario");
CREATE INDEX "bloqueios_data_idx" ON "bloqueios"("data");
CREATE UNIQUE INDEX "horarios_horario_key" ON "horarios"("horario");
CREATE INDEX "horarios_ativo_ordem_idx" ON "horarios"("ativo", "ordem");
CREATE INDEX "produtos_categoria_ativo_idx" ON "produtos"("categoria", "ativo");
CREATE INDEX "banners_ativo_ordem_idx" ON "banners"("ativo", "ordem");

ALTER TABLE "reservas"
ADD CONSTRAINT "reservas_quadraId_fkey"
FOREIGN KEY ("quadraId") REFERENCES "quadras"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "bloqueios"
ADD CONSTRAINT "bloqueios_quadraId_fkey"
FOREIGN KEY ("quadraId") REFERENCES "quadras"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
