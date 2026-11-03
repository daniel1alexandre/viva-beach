import { Header } from "@/components/Header";
import { ClientesClient } from "./ClientesClient";
import { getSafeCustomers } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ClientesPage() {
  const customers = await getSafeCustomers();

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <Header
        title="Clientes & Programa de Fidelidade"
        subtitle="Cadastro único com carteira digital de cashback integrado"
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        <ClientesClient initialCustomers={customers as any} />
      </div>
    </div>
  );
}
