import { Header } from "@/components/Header";
import { ComissoesClient } from "./ComissoesClient";

export const dynamic = "force-dynamic";

export default function ComissoesPage() {
  const sampleCommissions = [
    {
      id: "com-1",
      prof: "Professor Lucas Beach",
      aluno: "Rodrigo Almeida",
      contrato: "CTR-2026-0001",
      turma: "Beach Tennis Intermediário Noite",
      parcela: "1/6",
      valor: 35.0,
      status: "LIBERADA",
      statusDesc: "Parcela quitada pelo aluno",
    },
    {
      id: "com-2",
      prof: "Professor Lucas Beach",
      aluno: "Camila Fernandes",
      contrato: "CTR-2026-0002",
      turma: "Beach Tennis Iniciante",
      parcela: "1/6",
      valor: 35.0,
      status: "PREVISTA",
      statusDesc: "Aguardando vencimento da parcela",
    },
    {
      id: "com-3",
      prof: "Carlos Silveira (Gerente)",
      aluno: "Gabriel Martins",
      contrato: "CTR-2026-0003",
      turma: "Mensalista Quadra 2",
      parcela: "1/12",
      valor: 50.0,
      status: "LIBERADA",
      statusDesc: "Parcela quitada",
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <Header
        title="Comissões de Professores & Colaboradores"
        subtitle="Regra homologada: valor fixo por parcela paga, liberada conforme quitação do aluno"
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        <ComissoesClient initialCommissions={sampleCommissions} />
      </div>
    </div>
  );
}
