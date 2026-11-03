import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { ClientesClient } from "./ClientesClient";

export const dynamic = "force-dynamic";

export default async function ClientesPage() {
  const customers = await prisma.customer.findMany({
    include: {
      courtBookings: true,
      classEnrollments: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <Header
        title="Clientes & Programa de Fidelidade"
        subtitle="Cadastro único com carteira digital de cashback integrado"
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        <ClientesClient initialCustomers={customers} />
      </div>
    </div>
  );
}
