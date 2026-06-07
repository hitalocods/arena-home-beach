# Arena Home Beach

Sistema de reservas e gestão da Arena Home Beach com Next.js 16, Prisma, Neon PostgreSQL e Vercel Blob.

## Instalação

```bash
npm install
```

Copie `.env.example` para `.env.local` e configure:

```env
DATABASE_URL="postgresql://..."
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
ADMIN_PASSWORD="uma-senha-forte"
SESSION_SECRET="um-segredo-aleatorio-com-pelo-menos-32-caracteres"
```

Use a connection string **pooled** do Neon em `DATABASE_URL`, sempre com `sslmode=require`.

## Banco de dados

Para criar uma migration durante o desenvolvimento:

```bash
npx prisma migrate dev
```

Para gerar o Prisma Client:

```bash
npx prisma generate
```

Para inserir as cinco quadras e os horários iniciais:

```bash
npx prisma db seed
```

Em produção, aplique migrations versionadas com:

```bash
npx prisma migrate deploy
```

Atalhos equivalentes:

```bash
npm run db:migrate
npm run db:generate
npm run db:seed
npm run db:deploy
```

## Desenvolvimento

```bash
npm run dev
```

O painel fica em `/admin`. A autenticação usa cookie `HttpOnly`, assinado com `SESSION_SECRET`.

## Vercel Blob

Crie uma Blob Store no projeto Vercel. A variável `BLOB_READ_WRITE_TOKEN` será disponibilizada automaticamente. Os uploads:

- aceitam JPG, PNG, WebP e AVIF;
- têm limite de 5 MB;
- exigem sessão administrativa;
- retornam URL pública;
- são salvos nos registros de banners, quadras e produtos.

## Deploy na Vercel

1. Conecte o repositório à Vercel.
2. Instale Neon e Vercel Blob pelo Marketplace.
3. Configure `ADMIN_PASSWORD` e `SESSION_SECRET`.
4. Execute `npx prisma migrate deploy` usando a mesma `DATABASE_URL`.
5. Faça o deploy.

O script `vercel-build` executa `prisma generate && next build`. Migrations não são executadas durante o build para evitar concorrência entre deployments.

## Validação

```bash
npm run lint
npm run build
```

As regras de reserva são validadas no servidor e protegidas por transação serializável, índice único de quadra/data/horário e verificação de bloqueios.
