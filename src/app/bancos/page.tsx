import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { BancosClient } from "./BancosClient";

export const dynamic = "force-dynamic";

export default async function BancosPage() {
  const bankAccounts = await prisma.bankAccount.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  const totalBancos = bankAccounts.reduce((acc, b) => acc + b.currentBalance, 0);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <Header
        title="Bancos, Cartões & Conciliação"
        subtitle="Contas C6, Mercado Pago, Nubank e controle de recebíveis das maquininhas TON"
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        <BancosClient
          initialAccounts={bankAccounts}
          initialTotal={totalBancos}
        />
      </div>
    </div>
  );
}
