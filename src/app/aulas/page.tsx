import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { AulasClient } from "./AulasClient";

export const dynamic = "force-dynamic";

export default async function AulasPage() {
  const classGroups = await prisma.classGroup.findMany({
    include: {
      professor: true,
      court: true,
      enrollments: {
        include: {
          customer: true,
          replacementCredits: true,
        },
      },
    },
    orderBy: { startTime: "asc" },
  });

  const professors = await prisma.user.findMany({
    where: { role: "PROFESSOR" },
  });

  const courts = await prisma.court.findMany({
    orderBy: { courtNumber: "asc" },
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <Header
        title="Aulas, Turmas e Mensalidades"
        subtitle="Substituição definitiva do Agil — Chamadas, reposições automáticas e contratos"
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        <AulasClient
          initialClassGroups={classGroups}
          professors={professors}
          courts={courts}
        />
      </div>
    </div>
  );
}
