import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { TorneiosClient } from "./TorneiosClient";

export const dynamic = "force-dynamic";

export default async function TorneiosPage() {
  const sampleEvents = [
    {
      id: "ev-1",
      name: "1º Open Beach Tennis Arena VIVA",
      type: "TORNEIO",
      dateStr: "15 a 17 de Novembro",
      status: "CONFIRMADO",
      inscrições: 128,
      receitaEstimada: 32000.0,
      custoEstimado: 14000.0,
      multiCaixas: 3,
    },
    {
      id: "ev-2",
      name: "Clínica de Futevôlei com Atletas Pro",
      type: "CLINICA",
      dateStr: "28 de Novembro",
      status: "PLANEJAMENTO",
      inscrições: 24,
      receitaEstimada: 4800.0,
      custoEstimado: 1800.0,
      multiCaixas: 1,
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <Header
        title="Torneios & Eventos Corporativos"
        subtitle="Escopo V1: Gestão comercial, taxas de inscrição, patrocínios e múltiplos caixas"
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        <TorneiosClient initialEvents={sampleEvents} />
      </div>
    </div>
  );
}
