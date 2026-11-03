import { Header } from "@/components/Header";
import { PdvClient } from "./PdvClient";
import {
  getSafeProducts,
  getSafeCategories,
  getSafeCustomers,
  getSafeCashRegisters,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function PdvPage() {
  const products = await getSafeProducts();
  const categories = await getSafeCategories();
  const customers = await getSafeCustomers();
  const cashRegisters = await getSafeCashRegisters();

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <Header
        title="Frente de Caixa & PDV (Multi-Caixa)"
        subtitle="Suporte a 1 caixa diário e até 3 caixas simultâneos em torneios"
      />

      <div className="flex-1 overflow-hidden p-4">
        <PdvClient
          initialProducts={products as any}
          categories={categories}
          customers={customers as any}
          cashRegisters={cashRegisters as any}
        />
      </div>
    </div>
  );
}
