import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { formatCurrency } from "@/lib/utils";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  CreditCard,
  Building,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Percent,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FinanceiroPage() {
  const costCenters = await prisma.costCenter.findMany({
    orderBy: { code: "asc" },
  });

  const bankAccounts = await prisma.bankAccount.findMany({
    where: { active: true },
  });

  const commissions = await prisma.commission.findMany({
    include: {
      user: true,
      contract: {
        include: { customer: true },
      },
    },
    orderBy: { dueDate: "asc" },
  });

  const totalBancos = bankAccounts.reduce((acc, b) => acc + b.currentBalance, 0);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <Header
        title="Gestão Financeira, DRE & Comissões"
        subtitle="Substituição definitiva do Trio — DRE por atividade, comissões e conciliação BPO"
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Barra de Ações Rápidas & Exportação BPO */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Ambiente de Trabalho Financeiro da Arena VIVA
            </h2>
            <p className="text-xs text-slate-500">
              Dados integrados com PDV, reservas e turmas para conciliação da assessoria BPO.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200"
              onClick={() => {}}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar para BPO (Conta Azul)</span>
            </button>
            <button
              className="bg-arena-600 hover:bg-arena-500 text-white px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              onClick={() => {}}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Novo Lançamento</span>
            </button>
          </div>
        </div>

        {/* 3 Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Saldo Total em Contas e Cartões
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {formatCurrency(totalBancos)}
            </div>
            <div className="text-xs text-emerald-600 mt-2 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Conciliado com extratos bancários</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Contas a Receber (Próximos 30 dias)
            </span>
            <div className="text-2xl font-black text-blue-900 mt-1">
              {formatCurrency(28450.0)}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Mensalidades de turmas e mensalistas de quadra
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Contas a Pagar Previstas
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {formatCurrency(14300.0)}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Fornecedores, energia, folha e manutenção de areia
            </div>
          </div>
        </div>

        {/* DRE Gerencial por Centro de Custo */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                DRE Gerencial — Resultado por Centro de Receita / Atividade
              </h3>
              <p className="text-xs text-slate-500">
                Acompanhamento individualizado de margem de contribuição
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-full text-slate-700">
              Competência Vigente
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
                  <th className="p-3">Centro de Custo</th>
                  <th className="p-3 text-right">Receitas Brutas</th>
                  <th className="p-3 text-right">Custos Diretos</th>
                  <th className="p-3 text-right">Margem de Contribuição</th>
                  <th className="p-3 text-right">% Margem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: "01 - Locação de Quadras", rec: 34200.0, cust: 5800.0 },
                  { name: "02 - Aulas e Turmas", rec: 26800.0, cust: 9400.0 },
                  { name: "03 - Bar e Restaurante", rec: 19450.0, cust: 8900.0 },
                  { name: "04 - Loja / Pro Shop", rec: 8600.0, cust: 4200.0 },
                  { name: "05 - Eventos e Torneios", rec: 12000.0, cust: 3500.0 },
                ].map((row) => {
                  const margem = row.rec - row.cust;
                  const pct = ((margem / row.rec) * 100).toFixed(1);
                  return (
                    <tr key={row.name} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">{row.name}</td>
                      <td className="p-3 text-right font-medium text-emerald-700">
                        {formatCurrency(row.rec)}
                      </td>
                      <td className="p-3 text-right font-medium text-rose-700">
                        {formatCurrency(row.cust)}
                      </td>
                      <td className="p-3 text-right font-bold text-slate-900">
                        {formatCurrency(margem)}
                      </td>
                      <td className="p-3 text-right font-semibold text-slate-700">{pct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Módulo de Comissões de Professores e Colaboradores */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Percent className="w-4 h-4 text-arena-600" />
                <span>Apuração de Comissões dos Professores e Vendedores</span>
              </h3>
              <p className="text-xs text-slate-500">
                Regra homologada: valor fixo por parcela paga, liberada somente após quitação pelo aluno
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {[
              {
                prof: "Professor Lucas Beach",
                aluno: "Rodrigo Almeida",
                plano: "Turma Beach Noite",
                valor: 35.0,
                status: "LIBERADA",
                obs: "Parcela 1/6 paga pelo aluno",
              },
              {
                prof: "Professor Lucas Beach",
                aluno: "Camila Fernandes",
                plano: "Turma Beach Iniciante",
                valor: 35.0,
                status: "PREVISTA",
                obs: "Aguardando pagamento da parcela",
              },
            ].map((c, i) => (
              <div
                key={i}
                className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900">{c.prof}</span>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Aluno: {c.aluno} • {c.plano} ({c.obs})
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold text-slate-900 text-sm">
                    {formatCurrency(c.valor)}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      c.status === "LIBERADA"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
