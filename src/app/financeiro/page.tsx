import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { FinanceiroClient } from "./FinanceiroClient";

export const dynamic = "force-dynamic";

export default async function FinanceiroPage() {
  const costCenters = await prisma.costCenter.findMany({
    orderBy: { code: "asc" },
  });

  const bankAccounts = await prisma.bankAccount.findMany({
    where: { active: true },
  });

  const totalBancos = bankAccounts.reduce((acc, b) => acc + b.currentBalance, 0);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <Header
        title="Gestão Financeira, DRE & Comissões"
        subtitle="Substituição definitiva do Trio — DRE por atividade, comissões e conciliação BPO"
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        <FinanceiroClient
          costCenters={costCenters}
          bankAccounts={bankAccounts}
          totalBancos={totalBancos}
        />
      </div>
    </div>
  );
}
