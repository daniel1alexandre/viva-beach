import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { formatCurrency } from "@/lib/utils";
import {
  Percent,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  ArrowRight,
  Filter,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ComissoesPage() {
  const professors = await prisma.user.findMany({
    where: { role: "PROFESSOR" },
  });

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

  const totalLiberada = sampleCommissions
    .filter((c) => c.status === "LIBERADA")
    .reduce((acc, c) => acc + c.valor, 0);

  const totalPrevista = sampleCommissions
    .filter((c) => c.status === "PREVISTA")
    .reduce((acc, c) => acc + c.valor, 0);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <Header
        title="Comissões de Professores & Colaboradores"
        subtitle="Regra homologada: valor fixo por parcela paga, liberada conforme quitação do aluno"
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Banner com Regras */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Percent className="w-4 h-4 text-arena-600" />
              <span>Painel de Apuração de Comissões</span>
            </h2>
            <p className="text-xs text-slate-500">
              Liberação automática quando o aluno paga a mensalidade. Em caso de estorno, a comissão é revertida.
            </p>
          </div>

          <button
            type="button"
            className="bg-arena-600 hover:bg-arena-500 text-white px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span>Gerar Contas a Pagar</span>
          </button>
        </div>

        {/* 3 Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Comissões Liberadas (Prontas p/ Pagamento)
            </span>
            <div className="text-2xl font-black text-emerald-700 mt-1">
              {formatCurrency(totalLiberada)}
            </div>
            <div className="text-xs text-emerald-600 font-medium mt-1">
              Parcelas devidamente quitadas pelos alunos
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Comissões Previstas (A vencer)
            </span>
            <div className="text-2xl font-black text-amber-600 mt-1">
              {formatCurrency(totalPrevista)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Condicionadas ao pagamento das mensalidades
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Professores / Colaboradores Ativos
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {professoresAtivos(professors.length)}
            </div>
            <div className="text-xs text-slate-500 mt-1">Com contratos vigentes vinculados</div>
          </div>
        </div>

        {/* Tabela de Comissões */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Extrato Analítico de Comissões por Parcela</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
                  <th className="p-3">Colaborador / Professor</th>
                  <th className="p-3">Aluno & Contrato</th>
                  <th className="p-3">Turma / Modalidade</th>
                  <th className="p-3 text-center">Parcela</th>
                  <th className="p-3 text-right">Comissão Fixa</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3">Observação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sampleCommissions.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{c.prof}</td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-800">{c.aluno}</div>
                      <div className="text-[10px] font-mono text-slate-400">{c.contrato}</div>
                    </td>
                    <td className="p-3 text-slate-600">{c.turma}</td>
                    <td className="p-3 text-center font-bold text-slate-700">{c.parcela}</td>
                    <td className="p-3 text-right font-extrabold text-slate-900">
                      {formatCurrency(c.valor)}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          c.status === "LIBERADA"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 text-[11px] text-slate-500">{c.statusDesc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function professoresAtivos(count: number) {
  return count > 0 ? count : 2;
}
