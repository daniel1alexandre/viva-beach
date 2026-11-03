import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { formatCurrency } from "@/lib/utils";
import {
  Trophy,
  Calendar,
  Users,
  DollarSign,
  Plus,
  Store,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TorneiosPage() {
  const events = await prisma.eventTournament.findMany({
    include: { costCenter: true },
    orderBy: { startDate: "asc" },
  });

  // Torneios simulados para exibição rica inicial
  const sampleEvents = [
    {
      id: "ev-1",
      name: "1º Open Beach Tennis Arena VIVA",
      type: "TORNEIO",
      dateStr: "15 a 17 de Novembro",
      status: "CONFIRMADO",
      inscrições: 128,
      receitaEstimada: 32000.0,
      custoEstimado: 14000.0,
      multiCaixas: 3,
    },
    {
      id: "ev-2",
      name: "Clínica de Futevôlei com Atletas Pro",
      type: "CLINICA",
      dateStr: "28 de Novembro",
      status: "PLANEJAMENTO",
      inscrições: 24,
      receitaEstimada: 4800.0,
      custoEstimado: 1800.0,
      multiCaixas: 1,
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <Header
        title="Torneios & Eventos Corporativos"
        subtitle="Escopo V1: Gestão comercial, taxas de inscrição, patrocínios e múltiplos caixas"
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Banner com Regra Homologada */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-arena-600" />
              <span>Gestão Comercial & Financeira de Torneios</span>
            </h2>
            <p className="text-xs text-slate-500">
              Controle individualizado de receitas de atletas e patrocínio com DRE próprio por evento.
            </p>
          </div>

          <button
            type="button"
            className="bg-arena-600 hover:bg-arena-500 text-white px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Torneio / Evento</span>
          </button>
        </div>

        {/* Lista de Eventos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sampleEvents.map((ev) => {
            const lucroEstimado = ev.receitaEstimada - ev.custoEstimado;

            return (
              <div
                key={ev.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-arena-100 text-arena-800">
                      {ev.type}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {ev.status}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base mt-2">
                    {ev.name}
                  </h3>

                  <div className="text-xs text-slate-500 mt-2 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ev.dateStr}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ev.inscrições} atletas confirmados</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ev.multiCaixas} caixas configurados para o evento</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Resultado Previsto:</span>
                    <span className="text-sm font-extrabold text-emerald-700">
                      +{formatCurrency(lucroEstimado)}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="text-xs font-bold text-arena-600 hover:text-arena-700"
                  >
                    Ver DRE do Evento →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
