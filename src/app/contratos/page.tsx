import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { formatCurrency } from "@/lib/utils";
import {
  FileSignature,
  Plus,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ContratosPage() {
  const sampleContracts = [
    {
      code: "CTR-2026-0001",
      cliente: "Rodrigo Almeida",
      tipo: "Plano Semestral de Beach Tennis",
      status: "ATIVO",
      inicio: "01/11/2026",
      fim: "30/04/2027",
      valorMensal: 380.0,
      total: 2280.0,
      assinatura: "Digital (ZapSign)",
    },
    {
      code: "CTR-2026-0002",
      cliente: "Camila Fernandes",
      tipo: "Plano Trimestral Beach Iniciante",
      status: "AGUARDANDO_ASSINATURA",
      inicio: "05/11/2026",
      fim: "05/02/2027",
      valorMensal: 350.0,
      total: 1050.0,
      assinatura: "Link enviado por WhatsApp",
    },
    {
      code: "CTR-2026-0003",
      cliente: "Gabriel Martins",
      tipo: "Locação Recorrente Mensalista (Quadra 2)",
      status: "ATIVO",
      inicio: "01/10/2026",
      fim: "30/09/2027",
      valorMensal: 400.0,
      total: 4800.0,
      assinatura: "Física (PDF anexado)",
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <Header
        title="Gestão & Geração de Contratos"
        subtitle="Modelos personalizados da Arena VIVA, assinatura digital e controle de vigência"
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Banner Superior */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileSignature className="w-4 h-4 text-arena-600" />
              <span>Contratos de Aulas, Mensalistas e Eventos</span>
            </h2>
            <p className="text-xs text-slate-500">
              Preenchimento automático com dados do cliente e comissão vinculada ao professor.
            </p>
          </div>

          <button
            type="button"
            className="bg-arena-600 hover:bg-arena-500 text-white px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Contrato</span>
          </button>
        </div>

        {/* Tabela de Contratos */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Contratos Registrados na Arena</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
                  <th className="p-3">Código</th>
                  <th className="p-3">Cliente / Contratante</th>
                  <th className="p-3">Tipo / Descrição</th>
                  <th className="p-3">Vigência</th>
                  <th className="p-3 text-right">Valor Mensal</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3">Assinatura</th>
                  <th className="p-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sampleContracts.map((c) => (
                  <tr key={c.code} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-900">{c.code}</td>
                    <td className="p-3 font-semibold text-slate-800">{c.cliente}</td>
                    <td className="p-3 text-slate-600">{c.tipo}</td>
                    <td className="p-3 text-slate-500">{c.inicio} a {c.fim}</td>
                    <td className="p-3 text-right font-extrabold text-slate-900">
                      {formatCurrency(c.valorMensal)}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          c.status === "ATIVO"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 text-[11px]">{c.assinatura}</td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        className="text-xs font-semibold text-arena-600 hover:text-arena-700"
                      >
                        Ver PDF →
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
