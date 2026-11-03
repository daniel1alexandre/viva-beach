"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  GraduationCap,
  Users,
  FileSignature,
  Percent,
  Receipt,
  UtensilsCrossed,
  ShoppingBag,
  Trophy,
  DollarSign,
  Landmark,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const navigation = [
  { name: "Painel de Gestão", href: "/", icon: LayoutDashboard },
  { name: "Agenda de Quadras", href: "/quadras", icon: CalendarDays },
  { name: "Aulas & Turmas", href: "/aulas", icon: GraduationCap },
  { name: "Clientes & Cashback", href: "/clientes", icon: Users },
  { name: "PDV & Caixas", href: "/pdv", icon: Receipt },
  { name: "Bar & Comandas", href: "/comandas", icon: UtensilsCrossed },
  { name: "Loja & Estoque", href: "/loja", icon: ShoppingBag },
  { name: "Torneios & Eventos", href: "/torneios", icon: Trophy },
  { name: "Gestão Financeira", href: "/financeiro", icon: DollarSign },
  { name: "Comissões", href: "/comissoes", icon: Percent },
  { name: "Contratos", href: "/contratos", icon: FileSignature },
  { name: "Bancos & Conciliação", href: "/bancos", icon: Landmark },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-navy-950 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 shadow-xl">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-arena-600 to-arena-400 flex items-center justify-center font-bold text-white shadow-md shadow-arena-500/20">
              V
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight">Arena VIVA</span>
              <span className="text-xs block text-arena-400 font-medium">by Baumann</span>
            </div>
          </div>
        </div>
        <span className="text-[10px] bg-arena-500/10 text-arena-400 border border-arena-500/30 px-2 py-0.5 rounded-full font-semibold">
          ERP v1.0
        </span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Operação & Gestão
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-arena-600 text-white shadow-md shadow-arena-600/30"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Quick Status */}
      <div className="p-4 border-t border-slate-800/80 bg-navy-900/50">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>8 Quadras Ativas</span>
          </div>
          <span className="text-slate-400 font-mono text-[11px]">3 Caixas Prontos</span>
        </div>
      </div>
    </aside>
  );
}

