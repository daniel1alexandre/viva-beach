"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  Percent,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  ArrowRight,
  Filter,
  DollarSign,
  X,
} from "lucide-react";

interface Commission {
  id: string;
  prof: string;
  aluno: string;
  contrato: string;
  turma: string;
  parcela: string;
  valor: number;
  status: string;
  statusDesc: string;
}

export function ComissoesClient({ initialCommissions }: { initialCommissions: Commission[] }) {
  const [commissions, setCommissions] = useState<Commission[]>(initialCommissions);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const totalLiberada = commissions
    .filter((c) => c.status === "LIBERADA")
    .reduce((acc, c) => acc + c.valor, 0);

  const totalPrevista = commissions
    .filter((c) => c.status === "PREVISTA")
    .reduce((acc, c) => acc + c.valor, 0);

  const handleConfirmPayout = () => {
    // Muda comissões liberadas para PAGAS
    setCommissions((prev) =>
      prev.map((c) =>
        c.status === "LIBERADA" ? { ...c, status: "PAGA", statusDesc: "Comissão paga ao colaborador" } : c
      )
    );
    setIsPayModalOpen(false);
    showToast(`Contas a pagar de ${formatCurrency(totalLiberada)} geradas com sucesso para os professores!`);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-xs font-bold">{toast}</span>
        </div>
      )}

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
          disabled={totalLiberada === 0}
          onClick={() => setIsPayModalOpen(true)}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm ${
            totalLiberada > 0
              ? "bg-arena-600 hover:bg-arena-500 text-white shadow-arena-600/30"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Gerar Contas a Pagar ({formatCurrency(totalLiberada)})</span>
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
          <div className="text-2xl font-black text-slate-900 mt-1">2</div>
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
              {commissions.map((c) => (
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
                          : c.status === "PAGA"
                          ? "bg-blue-100 text-blue-800"
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

      {/* Modal: Gerar Contas a Pagar de Comissões */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-arena-600" />
                <span>Autorizar Pagamento de Comissões</span>
              </h3>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mt-4 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 leading-relaxed">
                <strong>Regra Homologada:</strong> Apenas as comissões cujas parcelas dos alunos foram confirmadas como <em>PAGAS</em> estão liberadas para pagamento.
              </div>

              <div className="p-3 rounded-lg border border-slate-100 bg-slate-50 space-y-2">
                <div className="flex justify-between">
                  <span>Professor Lucas Beach (1 parcela):</span>
                  <span className="font-bold text-slate-900">{formatCurrency(35.0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Carlos Silveira (1 mensalidade):</span>
                  <span className="font-bold text-slate-900">{formatCurrency(50.0)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-sm">
                  <span>Total a Pagar Agora:</span>
                  <span className="text-emerald-700">{formatCurrency(totalLiberada)}</span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPayout}
                  className="px-5 py-2.5 rounded-xl bg-arena-600 hover:bg-arena-500 text-white font-bold shadow-md shadow-arena-600/30"
                >
                  Confirmar e Baixar no Financeiro
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
