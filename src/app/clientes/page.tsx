import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { formatCurrency } from "@/lib/utils";
import {
  Users,
  Sparkles,
  Search,
  Plus,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ClientesPage() {
  const customers = await prisma.customer.findMany({
    include: {
      courtBookings: true,
      classEnrollments: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <Header
        title="Clientes & Programa de Fidelidade"
        subtitle="Cadastro único com carteira digital de cashback integrado"
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Barra Superior */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Base Unificada de Clientes (CRM)
            </h2>
            <p className="text-xs text-slate-500">
              O mesmo cliente pontua cashback em quadras, bar, loja e aulas.
            </p>
          </div>

          <button className="bg-arena-600 hover:bg-arena-500 text-white px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Novo Cliente</span>
          </button>
        </div>

        {/* Tabela de Clientes */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
                  <th className="p-3">Cliente / CPF</th>
                  <th className="p-3">Contato</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Locações / Aulas</th>
                  <th className="p-3 text-right">Saldo de Cashback (Carteira)</th>
                  <th className="p-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{c.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{c.cpf || "Sem CPF cadastrado"}</div>
                    </td>
                    <td className="p-3 text-slate-600">
                      <div>{c.phone}</div>
                      <div className="text-[11px] text-slate-400">{c.email || "Sem e-mail"}</div>
                    </td>
                    <td className="p-3 text-center">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 text-center text-slate-600">
                      {c.courtBookings.length} reservas • {c.classEnrollments.length} turmas
                    </td>
                    <td className="p-3 text-right">
                      <div className="font-extrabold text-purple-900 text-sm flex items-center justify-end gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        <span>{formatCurrency(c.walletBalance)}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Disponível no PDV</span>
                    </td>
                    <td className="p-3 text-center">
                      <button className="text-xs font-semibold text-arena-600 hover:text-arena-700">
                        Ver Ficha →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
