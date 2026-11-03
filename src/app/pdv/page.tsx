import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { PdvClient } from "./PdvClient";

export const dynamic = "force-dynamic";

export default async function PdvPage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: { category: true },
    orderBy: { name: "asc" },
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const customers = await prisma.customer.findMany({
    orderBy: { name: "asc" },
  });

  const cashRegisters = await prisma.cashRegister.findMany({
    include: { operator: true },
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <Header
        title="Frente de Caixa & PDV (Multi-Caixa)"
        subtitle="Suporte a 1 caixa diário e até 3 caixas simultâneos em torneios"
      />

      <div className="flex-1 overflow-hidden p-4">
        <PdvClient
          initialProducts={products}
          categories={categories}
          customers={customers}
          cashRegisters={cashRegisters}
        />
      </div>
    </div>
  );
}
