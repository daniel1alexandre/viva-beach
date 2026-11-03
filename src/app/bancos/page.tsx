import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
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
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BancosPage() {
  const bankAccounts = await prisma.bankAccount.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  const totalBancos = bankAccounts.reduce((acc, b) => acc + b.currentBalance, 0);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <Header
        title="Bancos, Cartões & Conciliação"
        subtitle="Contas C6, Mercado Pago, Nubank e controle de recebíveis das maquininhas TON"
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Banner Superior */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Importar Extrato OFX</span>
            </button>
            <button
              type="button"
              className="bg-arena-600 hover:bg-arena-500 text-white px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Conciliar Agora</span>
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
          {bankAccounts.map((acc) => (
            <div
              key={acc.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between"
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
                  className="text-xs font-bold text-arena-600 hover:text-arena-700"
                >
                  Ver Extrato →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
