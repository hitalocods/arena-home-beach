import type { Metadata } from "next";
import { MenuGrid, type MenuProduct } from "@/components/menu-grid";
import { PageHero } from "@/components/page-hero";
import { getPrisma, isDatabaseConfigured } from "@/lib/prisma";

export const metadata: Metadata = { title: "Cardapio" };
export const dynamic = "force-dynamic";

const fallbackProducts = [
  { id: "demo-water", nome: "Agua mineral", preco: 4, categoria: "Bebidas", imagem: null },
  { id: "demo-soda", nome: "Refrigerante lata", preco: 6, categoria: "Bebidas", imagem: null },
  { id: "demo-beer", nome: "Cerveja long neck", preco: 10, categoria: "Cervejas", imagem: null },
  { id: "demo-energy", nome: "Energetico", preco: 14, categoria: "Bebidas", imagem: null },
  { id: "demo-sandwich", nome: "Sanduiche da arena", preco: 18, categoria: "Lanches", imagem: null },
  { id: "demo-coffee", nome: "Cafe espresso", preco: 5, categoria: "Quentes", imagem: null },
];

async function getProducts() {
  if (!isDatabaseConfigured()) return fallbackProducts;
  try {
    return await getPrisma().produto.findMany({
      where: { ativo: true },
      orderBy: [{ categoria: "asc" }, { nome: "asc" }],
    });
  } catch {
    return fallbackProducts;
  }
}

export default async function CardapioPage() {
  const products = (await getProducts()).map((product) => ({
    id: product.id,
    nome: product.nome,
    preco: Number(product.preco),
    categoria: product.categoria,
    imagem: product.imagem,
  })) satisfies MenuProduct[];

  return (
    <>
      <PageHero
        eyebrow="Cozinha da Arena"
        title="Pausa boa entre um jogo e outro."
        description="Bebidas geladas, lanches e opcoes praticas para acompanhar sua partida."
      />
      <section className="page-shell py-10 sm:py-16">
        <MenuGrid products={products} />
      </section>
    </>
  );
}
