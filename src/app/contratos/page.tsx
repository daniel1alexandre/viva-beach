import { Header } from "@/components/Header";
import { ContratosClient } from "./ContratosClient";

export const dynamic = "force-dynamic";

export default function ContratosPage() {
  const sampleContracts = [
    {
      code: "CTR-2026-0001",
      cliente: "Rodrigo Almeida",
      tipo: "Plano Semestral de Beach Tennis",
      status: "ATIVO",
      inicio: "01/11/2026",
      fim: "30/04/2027",
      valorMensal: 380.0,
      total: 2280.0,
      assinatura: "Digital (ZapSign)",
    },
    {
      code: "CTR-2026-0002",
      cliente: "Camila Fernandes",
      tipo: "Plano Trimestral Beach Iniciante",
      status: "AGUARDANDO_ASSINATURA",
      inicio: "05/11/2026",
      fim: "05/02/2027",
      valorMensal: 350.0,
      total: 1050.0,
      assinatura: "Link enviado por WhatsApp",
    },
    {
      code: "CTR-2026-0003",
      cliente: "Gabriel Martins",
      tipo: "Locação Recorrente Mensalista (Quadra 2)",
      status: "ATIVO",
      inicio: "01/10/2026",
      fim: "30/09/2027",
      valorMensal: 400.0,
      total: 4800.0,
      assinatura: "Física (PDF anexado)",
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <Header
        title="Gestão & Geração de Contratos"
        subtitle="Modelos personalizados da Arena VIVA, assinatura digital e controle de vigência"
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        <ContratosClient initialContracts={sampleContracts} />
      </div>
    </div>
  );
}
