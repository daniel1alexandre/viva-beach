import { getSafeProducts, getSafeCategories } from "@/lib/data";
import { Header } from "@/components/Header";
import { LojaClient } from "./LojaClient";

export const dynamic = "force-dynamic";

export default async function LojaPage() {
  const products = await getSafeProducts();
  const categories = await getSafeCategories();

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <Header
        title="Loja (Pro Shop) & Controle de Estoque"
        subtitle="Equipamentos, vestuário, bolas e bebidas com alertas de estoque mínimo"
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        <LojaClient initialProducts={products} categories={categories} />
      </div>
    </div>
  );
}
