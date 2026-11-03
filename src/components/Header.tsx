"use client";

import { Bell, CloudRain, Shield, Store, UserCheck } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title = "Painel Geral", subtitle = "Visão executiva em tempo real" }: HeaderProps) {
  const todayStr = format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR });

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0 shadow-sm">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
        <p className="text-xs text-slate-500 capitalize">{todayStr} • {subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Status do Caixa Ativo */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <Store className="w-3.5 h-3.5 text-emerald-600" />
          <span>Caixa 1: Aberto (R$ 300,00)</span>
        </div>

        {/* Protocolo de Chuva Rápido */}
        <button
          title="Ativar protocolo de cancelamento/crédito por intempéries"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-medium transition-colors"
          onClick={() => alert("Protocolo de Intempéries / Chuva: Ao confirmar para uma quadra descoberta, o sistema gerará automaticamente créditos em horas para os clientes afetados reagendarem em até 60 dias.")}
        >
          <CloudRain className="w-3.5 h-3.5 text-amber-600" />
          <span className="hidden md:inline">Protocolo Chuva</span>
        </button>

        {/* Notificações */}
        <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-arena-500"></span>
        </button>

        {/* Usuário Logado */}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
            AV
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-slate-900">Admin Arena VIVA</div>
            <div className="text-[10px] text-slate-500 font-medium">Gestão Executiva</div>
          </div>
        </div>
      </div>
    </header>
  );
}
