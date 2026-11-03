"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  Trophy,
  Calendar,
  Users,
  DollarSign,
  Plus,
  Store,
  CheckCircle2,
  X,
  FileText,
} from "lucide-react";

interface TournamentEvent {
  id: string;
  name: string;
  type: string;
  dateStr: string;
  status: string;
  inscrições: number;
  receitaEstimada: number;
  custoEstimado: number;
  multiCaixas: number;
}

export function TorneiosClient({ initialEvents }: { initialEvents: TournamentEvent[] }) {
  const [events, setEvents] = useState<TournamentEvent[]>(initialEvents);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedDreEvent, setSelectedDreEvent] = useState<TournamentEvent | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [type, setType] = useState("TORNEIO");
  const [dateStr, setDateStr] = useState("10 a 12 de Dezembro");
  const [inscrições, setInscrições] = useState("64");
  const [receitaEstimada, setReceitaEstimada] = useState("16000");
  const [custoEstimado, setCustoEstimado] = useState("6000");
  const [multiCaixas, setMultiCaixas] = useState("2");

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: TournamentEvent = {
      id: "ev-" + Date.now(),
      name,
      type,
      dateStr,
      status: "PLANEJAMENTO",
      inscrições: parseInt(inscrições) || 32,
      receitaEstimada: parseFloat(receitaEstimada) || 0,
      custoEstimado: parseFloat(custoEstimado) || 0,
      multiCaixas: parseInt(multiCaixas) || 1,
    };

    setEvents((prev) => [...prev, newEvent]);
    setIsNewModalOpen(false);
    showToast(`Torneio/Evento "${name}" cadastrado com sucesso!`);

    setName("");
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
          onClick={() => setIsNewModalOpen(true)}
          className="bg-arena-600 hover:bg-arena-500 text-white px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Torneio / Evento</span>
        </button>
      </div>

      {/* Lista de Eventos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {events.map((ev) => {
          const lucroEstimado = ev.receitaEstimada - ev.custoEstimado;

          return (
            <div
              key={ev.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
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
                    <span>{ev.inscrições} atletas estimados</span>
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
                  onClick={() => setSelectedDreEvent(ev)}
                  className="text-xs font-bold text-arena-600 hover:text-arena-700 bg-arena-50 hover:bg-arena-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Ver DRE do Evento →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Novo Torneio */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-arena-600" />
                <span>Cadastrar Torneio ou Evento</span>
              </h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nome do Evento *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Torneio de Fim de Ano Arena VIVA"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipo de Evento:</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium"
                  >
                    <option value="TORNEIO">Torneio Esportivo</option>
                    <option value="CLINICA">Clínica / Workshop</option>
                    <option value="CORPORATIVO">Evento Corporativo</option>
                    <option value="ANIVERSARIO">Festa / Aniversário</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Período / Datas:</label>
                  <input
                    type="text"
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Previsão de Atletas/Pessoas:</label>
                  <input
                    type="number"
                    value={inscrições}
                    onChange={(e) => setInscrições(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Caixas Simultâneos PDV:</label>
                  <select
                    value={multiCaixas}
                    onChange={(e) => setMultiCaixas(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium"
                  >
                    <option value="1">1 Caixa (Normal)</option>
                    <option value="2">2 Caixas (Médio)</option>
                    <option value="3">3 Caixas (Torneio Grande)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Receita Estimada (R$):</label>
                  <input
                    type="number"
                    value={receitaEstimada}
                    onChange={(e) => setReceitaEstimada(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-bold text-emerald-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Custos Previstos (R$):</label>
                  <input
                    type="number"
                    value={custoEstimado}
                    onChange={(e) => setCustoEstimado(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-bold text-rose-800"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-arena-600 hover:bg-arena-500 text-white font-bold shadow-md shadow-arena-600/30"
                >
                  Confirmar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: DRE do Evento */}
      {selectedDreEvent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-arena-600" />
                  <span>DRE Individualizado do Evento</span>
                </h3>
                <p className="text-xs text-slate-500">{selectedDreEvent.name}</p>
              </div>
              <button
                onClick={() => setSelectedDreEvent(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mt-4 text-xs">
              <div className="space-y-2">
                <span className="font-bold text-slate-800 block">Composição de Receitas:</span>
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 flex justify-between">
                  <span>Taxas de Inscrição ({selectedDreEvent.inscrições} atletas)</span>
                  <span className="font-bold text-emerald-800">
                    {formatCurrency(selectedDreEvent.receitaEstimada * 0.7)}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 flex justify-between">
                  <span>Cotas de Patrocínio & Apoio</span>
                  <span className="font-bold text-emerald-800">
                    {formatCurrency(selectedDreEvent.receitaEstimada * 0.3)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-800 block">Custos Diretos do Evento:</span>
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-100 flex justify-between">
                  <span>Premiação em Dinheiro & Troféus</span>
                  <span className="font-bold text-rose-800">
                    -{formatCurrency(selectedDreEvent.custoEstimado * 0.6)}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-100 flex justify-between">
                  <span>Arbitragem, Staff e Bolas</span>
                  <span className="font-bold text-rose-800">
                    -{formatCurrency(selectedDreEvent.custoEstimado * 0.4)}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm font-black">
                <span className="text-slate-900">Resultado Líquido do Evento:</span>
                <span className="text-emerald-700">
                  +{formatCurrency(selectedDreEvent.receitaEstimada - selectedDreEvent.custoEstimado)}
                </span>
              </div>

              <div className="pt-4 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedDreEvent(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold"
                >
                  Fechar DRE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
