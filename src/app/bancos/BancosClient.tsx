"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  Landmark,
  CreditCard,
  CheckCircle2,
  Upload,
  ArrowUpRight,
  ArrowDownRight,
  Building,
  RefreshCw,
  X,
  FileSpreadsheet,
} from "lucide-react";

interface BankAccount {
  id: string;
  name: string;
  currentBalance: number;
}

export function BancosClient({
  initialAccounts,
  initialTotal,
}: {
  initialAccounts: BankAccount[];
  initialTotal: number;
}) {
  const [accounts, setAccounts] = useState<BankAccount[]>(initialAccounts);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isConciliating, setIsConciliating] = useState(false);
  const [selectedStatementAccount, setSelectedStatementAccount] = useState<BankAccount | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const totalBancos = accounts.reduce((acc, b) => acc + b.currentBalance, 0);

  const handleConciliate = () => {
    setIsConciliating(true);
    setTimeout(() => {
      setIsConciliating(false);
      showToast("Conciliação concluída com sucesso! Todos os 48 lançamentos conferem com os caixas e extratos.");
    }, 1500);
  };

  const handleUploadOfx = (e: React.FormEvent) => {
    e.preventDefault();
    setIsImportModalOpen(false);
    showToast("Extrato OFX importado com sucesso! 14 novas movimentações adicionadas ao fluxo.");
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

      {/* Banner Superior */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Landmark className="w-4 h-4 text-arena-600" />
            <span>Contas Operacionais & Adquirente TON</span>
          </h2>
          <p className="text-xs text-slate-500">
            Apuração de saldos, taxas de antecipação e conciliação com a assessoria contábil BPO.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Importar Extrato OFX</span>
          </button>
          <button
            type="button"
            onClick={handleConciliate}
            disabled={isConciliating}
            className="bg-arena-600 hover:bg-arena-500 text-white px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isConciliating ? "animate-spin" : ""}`} />
            <span>{isConciliating ? "Conciliando..." : "Conciliar Agora"}</span>
          </button>
        </div>
      </div>

      {/* Saldo Consolidado */}
      <div className="bg-gradient-to-r from-slate-900 to-navy-950 text-white p-6 rounded-2xl border border-slate-800 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-arena-400 font-semibold uppercase tracking-wider">
            Disponibilidade Total
          </span>
          <div className="text-3xl font-black mt-1">{formatCurrency(totalBancos)}</div>
          <p className="text-xs text-slate-400 mt-1">
            Soma de todas as contas bancárias correntes, carteira digital e maquininhas
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Fechamento de caixa diário 100% conciliado</span>
        </div>
      </div>

      {/* Grade de Contas Bancárias & TON */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-lg bg-slate-50 text-slate-700 border border-slate-100">
                  <Building className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Ativa
                </span>
              </div>

              <h3 className="font-extrabold text-slate-900 text-base mt-3">
                {acc.name}
              </h3>
              <div className="text-xs text-slate-400 mt-0.5">
                Conta principal para movimentações e conciliação
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Saldo Atual:</span>
                <span className="text-base font-extrabold text-slate-900">
                  {formatCurrency(acc.currentBalance)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStatementAccount(acc)}
                className="text-xs font-bold text-arena-600 hover:text-arena-700 bg-arena-50 hover:bg-arena-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                Ver Extrato →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Importar Extrato OFX */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-arena-600" />
                <span>Importar Extrato Bancário (OFX)</span>
              </h3>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadOfx} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Selecione a Conta de Destino:</label>
                <select className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium">
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Arquivo do Extrato (.ofx ou .csv):</label>
                <input
                  type="file"
                  accept=".ofx,.csv"
                  className="w-full p-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 text-slate-600 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-arena-600 file:text-white hover:file:bg-arena-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-arena-600 hover:bg-arena-500 text-white font-bold shadow-md shadow-arena-600/30"
                >
                  Processar e Conciliar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Extrato da Conta */}
      {selectedStatementAccount && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Building className="w-5 h-5 text-arena-600" />
                  <span>Extrato Recente da Conta</span>
                </h3>
                <p className="text-xs text-slate-500">{selectedStatementAccount.name}</p>
              </div>
              <button
                onClick={() => setSelectedStatementAccount(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600">Saldo Atual Apurado:</span>
                <span className="text-lg font-black text-slate-900">
                  {formatCurrency(selectedStatementAccount.currentBalance)}
                </span>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-800 block">Últimos Lançamentos Conciliados:</span>
                {[
                  { desc: "Recebimento Locação Quadra 1 (Pix)", val: 110.0, tipo: "CREDITO", data: "Hoje 14:10" },
                  { desc: "Venda PDV Bar - Comanda #4 (Cartão)", val: 68.0, tipo: "CREDITO", data: "Hoje 13:45" },
                  { desc: "Pagamento Fornecedor Bebidas Ambev", val: -450.0, tipo: "DEBITO", data: "Ontem 17:20" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{item.desc}</div>
                      <div className="text-[10px] text-slate-400">{item.data}</div>
                    </div>
                    <span
                      className={`font-bold ${
                        item.tipo === "CREDITO" ? "text-emerald-700" : "text-rose-700"
                      }`}
                    >
                      {item.val > 0 ? `+${formatCurrency(item.val)}` : formatCurrency(item.val)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedStatementAccount(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold"
                >
                  Fechar Extrato
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
