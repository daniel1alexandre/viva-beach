"use client";

import { useState } from "react";
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
  Plus,
  X,
  FileText,
} from "lucide-react";

interface CostCenter {
  id: string;
  code: string;
  name: string;
}

interface BankAccount {
  id: string;
  name: string;
  currentBalance: number;
}

export function FinanceiroClient({
  costCenters,
  bankAccounts,
  totalBancos,
}: {
  costCenters: CostCenter[];
  bankAccounts: BankAccount[];
  totalBancos: number;
}) {
  const [isNewEntryModalOpen, setIsNewEntryModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Form states
  const [entryType, setEntryType] = useState("DESPESA");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [costCenterId, setCostCenterId] = useState(costCenters[0]?.id || "");
  const [bankAccountId, setBankAccountId] = useState(bankAccounts[0]?.id || "");
  const [dueDate, setDueDate] = useState("2026-11-15");

  const [dreRows, setDreRows] = useState([
    { name: "01 - Locação de Quadras", rec: 34200.0, cust: 5800.0 },
    { name: "02 - Aulas e Turmas", rec: 26800.0, cust: 9400.0 },
    { name: "03 - Bar e Restaurante", rec: 19450.0, cust: 8900.0 },
    { name: "04 - Loja / Pro Shop", rec: 8600.0, cust: 4200.0 },
    { name: "05 - Eventos e Torneios", rec: 12000.0, cust: 3500.0 },
  ]);

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount) || 0;
    const cc = costCenters.find((c) => c.id === costCenterId);

    if (entryType === "RECEITA") {
      setDreRows((prev) =>
        prev.map((r) =>
          r.name.includes(cc?.code || "") ? { ...r, rec: r.rec + val } : r
        )
      );
    } else {
      setDreRows((prev) =>
        prev.map((r) =>
          r.name.includes(cc?.code || "") ? { ...r, cust: r.cust + val } : r
        )
      );
    }

    setIsNewEntryModalOpen(false);
    showToast(`Lançamento de ${entryType.toLowerCase()} ("${description}") registrado com sucesso no valor de ${formatCurrency(val)}!`);

    setDescription("");
    setAmount("");
  };

  const handleExportContaAzul = () => {
    // Simula geração de arquivo CSV para download
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Data;CentroDeCusto;Descricao;Valor;Tipo;ContaBancaria\n" +
      dreRows
        .map(
          (r) =>
            `2026-11-03;${r.name};Receita Consolidada;${r.rec};CREDITO;Banco C6\n` +
            `2026-11-03;${r.name};Custos Operacionais;${r.cust};DEBITO;Banco C6`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `extrato_bpo_conta_azul_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsExportModalOpen(false);
    showToast("Arquivo de exportação BPO / Conta Azul gerado e baixado com sucesso!");
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
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar para BPO (Conta Azul)</span>
          </button>
          <button
            type="button"
            onClick={() => setIsNewEntryModalOpen(true)}
            className="bg-arena-600 hover:bg-arena-500 text-white px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
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
              {dreRows.map((row) => {
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

      {/* Modal: Novo Lançamento Financeiro */}
      {isNewEntryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-arena-600" />
                <span>Novo Lançamento Financeiro</span>
              </h3>
              <button
                onClick={() => setIsNewEntryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEntry} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setEntryType("DESPESA")}
                  className={`p-2.5 rounded-xl font-bold border transition-all ${
                    entryType === "DESPESA"
                      ? "bg-rose-50 border-rose-300 text-rose-800"
                      : "bg-slate-50 border-slate-200 text-slate-600"
                  }`}
                >
                  Contas a Pagar (Despesa)
                </button>
                <button
                  type="button"
                  onClick={() => setEntryType("RECEITA")}
                  className={`p-2.5 rounded-xl font-bold border transition-all ${
                    entryType === "RECEITA"
                      ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                      : "bg-slate-50 border-slate-200 text-slate-600"
                  }`}
                >
                  Contas a Receber (Receita)
                </button>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Descrição do Lançamento *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Fornecedor Cervejas Heineken ou Aluguel de Quadra"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Valor (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Vencimento:</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Centro de Custo:</label>
                  <select
                    value={costCenterId}
                    onChange={(e) => setCostCenterId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium"
                  >
                    {costCenters.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Conta Bancária:</label>
                  <select
                    value={bankAccountId}
                    onChange={(e) => setBankAccountId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium"
                  >
                    {bankAccounts.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewEntryModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-arena-600 hover:bg-arena-500 text-white font-bold shadow-md shadow-arena-600/30"
                >
                  Confirmar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Exportação BPO / Conta Azul */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Download className="w-5 h-5 text-arena-600" />
                <span>Exportar Dados para BPO Financeiro</span>
              </h3>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mt-4 text-xs">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 leading-relaxed">
                <strong>Alinhamento BPO Homologado:</strong> O sistema gera o arquivo estruturado de conciliação diária com todas as baixas do PDV, receitas de mensalidades e despesas por centro de custo para importação direta no Conta Azul, sem necessidade de digitação dupla.
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-slate-800">Selecione o Formato:</span>
                <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                  <input type="radio" name="format" defaultChecked className="text-arena-600" />
                  <span className="font-semibold text-slate-900">CSV Padrão Conta Azul / Excel</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                  <input type="radio" name="format" className="text-arena-600" />
                  <span className="font-semibold text-slate-900">Extrato Bancário OFX (C6 / Nubank / MP)</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleExportContaAzul}
                  className="px-5 py-2.5 rounded-xl bg-arena-600 hover:bg-arena-500 text-white font-bold shadow-md shadow-arena-600/30 flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar Arquivo Agora</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
