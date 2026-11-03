import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import {
  UtensilsCrossed,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  User,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ComandasPage() {
  const openTabs = await prisma.orderTab.findMany({
    include: {
      customer: true,
      items: {
        include: { product: true },
      },
    },
    orderBy: { tabNumber: "asc" },
  });

  // Exemplo de comandas ativas (1 a 20)
  const simulatedTabs = [
    { number: 1, customer: "Rodrigo Almeida", itemsCount: 4, total: 68.0, status: "ABERTA", time: "18:20" },
    { number: 4, customer: "Camila Fernandes", itemsCount: 2, total: 36.0, status: "ABERTA", time: "18:45" },
    { number: 7, customer: "Mesa 3 (Torneio BT)", itemsCount: 7, total: 142.0, status: "ABERTA", time: "19:10" },
    { number: 12, customer: "Gabriel Martins", itemsCount: 3, total: 54.0, status: "EM_PAGAMENTO", time: "19:30" },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <Header
        title="Bar, Restaurante & Comandas"
        subtitle="Comandas em tempo real compartilhadas entre os caixas em dias de torneio"
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Banner Operacional */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-arena-600" />
              <span>Gestão de Comandas do Bar da Arena</span>
            </h2>
            <p className="text-xs text-slate-500">
              Operadores do Caixa 1, Caixa 2 e Caixa 3 podem consultar e fechar a mesma comanda simultaneamente.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/pdv"
              className="bg-arena-600 hover:bg-arena-500 text-white px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Abrir Comanda no PDV</span>
            </Link>
          </div>
        </div>

        {/* Resumo de Comandas Ativas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Comandas Abertas
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">4</div>
            <div className="text-xs text-emerald-600 font-medium mt-1">Consumo em andamento</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Total Acumulado em Aberto
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {formatCurrency(300.0)}
            </div>
            <div className="text-xs text-slate-500 mt-1">A receber nos caixas</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Ticket Médio do Bar
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {formatCurrency(75.0)}
            </div>
            <div className="text-xs text-slate-500 mt-1">Bebidas e porções</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Status da Cozinha / Expedição
            </span>
            <div className="text-2xl font-black text-emerald-700 mt-1">Operando</div>
            <div className="text-xs text-slate-500 mt-1">Impressora térmica ativa</div>
          </div>
        </div>

        {/* Grade de Comandas Ativas */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-bold text-slate-900 text-sm mb-4">
            Mapa de Comandas Ativas no Salão / Quadras
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {simulatedTabs.map((tab) => (
              <div
                key={tab.number}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-arena-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-lg bg-slate-900 text-arena-400 font-extrabold text-xs flex items-center justify-center">
                      #{tab.number}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                        tab.status === "ABERTA"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {tab.status}
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="text-xs font-bold text-slate-900 truncate">{tab.customer}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Aberta às {tab.time} • {tab.itemsCount} itens</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total Parcial:</span>
                    <span className="text-sm font-extrabold text-slate-900">
                      {formatCurrency(tab.total)}
                    </span>
                  </div>
                  <Link
                    href="/pdv"
                    className="text-xs font-bold text-arena-600 hover:text-arena-700 flex items-center gap-0.5"
                  >
                    <span>Lançar / Pagar</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
