import { Header } from "@/components/Header";
import { AulasClient } from "./AulasClient";
import { getSafeClassGroups, getSafeProfessors, getSafeCourts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AulasPage() {
  const classGroups = await getSafeClassGroups();
  const professors = await getSafeProfessors();
  const courts = await getSafeCourts();

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <Header
        title="Aulas, Turmas e Mensalidades"
        subtitle="Substituição definitiva do Agil — Chamadas, reposições automáticas e contratos"
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        <AulasClient
          initialClassGroups={classGroups as any}
          professors={professors}
          courts={courts}
        />
      </div>
    </div>
  );
}
