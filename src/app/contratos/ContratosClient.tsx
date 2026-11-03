"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  FileSignature,
  Plus,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Printer,
  X,
  Send,
} from "lucide-react";

interface Contract {
  code: string;
  cliente: string;
  tipo: string;
  status: string;
  inicio: string;
  fim: string;
  valorMensal: number;
  total: number;
  assinatura: string;
}

export function ContratosClient({ initialContracts }: { initialContracts: Contract[] }) {
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedPdfContract, setSelectedPdfContract] = useState<Contract | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Form states
  const [cliente, setCliente] = useState("");
  const [tipo, setTipo] = useState("Plano Semestral de Beach Tennis");
  const [valorMensal, setValorMensal] = useState("380.00");
  const [assinatura, setAssinatura] = useState("Digital (ZapSign)");

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(valorMensal) || 350;
    const code = `CTR-2026-000${contracts.length + 1}`;

    const newContr: Contract = {
      code,
      cliente,
      tipo,
      status: "AGUARDANDO_ASSINATURA",
      inicio: "01/11/2026",
      fim: "30/04/2027",
      valorMensal: val,
      total: val * 6,
      assinatura,
    };

    setContracts((prev) => [newContr, ...prev]);
    setIsNewModalOpen(false);
    showToast(`Contrato ${code} gerado com sucesso para ${cliente}!`);

    setCliente("");
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
          onClick={() => setIsNewModalOpen(true)}
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
              {contracts.map((c) => (
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
                      onClick={() => setSelectedPdfContract(c)}
                      className="text-xs font-semibold text-arena-600 hover:text-arena-700 bg-arena-50 hover:bg-arena-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Ver PDF / Assinatura →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Novo Contrato */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-arena-600" />
                <span>Gerar Novo Contrato</span>
              </h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateContract} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nome do Cliente / Aluno *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mariana Vasconcelos"
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Modelo de Contrato:</label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium"
                >
                  <option value="Plano Semestral de Beach Tennis">Plano Semestral de Beach Tennis</option>
                  <option value="Plano Anual de Treinamento">Plano Anual de Treinamento</option>
                  <option value="Locação Recorrente Mensalista de Quadra">Locação Recorrente Mensalista de Quadra</option>
                  <option value="Contrato de Patrocínio de Torneio">Contrato de Patrocínio de Torneio</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Valor Mensal (R$):</label>
                  <input
                    type="number"
                    value={valorMensal}
                    onChange={(e) => setValorMensal(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-bold text-emerald-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Meio de Assinatura:</label>
                  <select
                    value={assinatura}
                    onChange={(e) => setAssinatura(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium"
                  >
                    <option value="Digital (ZapSign)">Digital (ZapSign via WhatsApp)</option>
                    <option value="Digital (Clicksign)">Digital (Clicksign via E-mail)</option>
                    <option value="Manual (Impressão e Upload)">Manual (Impressão física)</option>
                  </select>
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
                  Emitir Contrato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Visualizador de Minuta do Contrato */}
      {selectedPdfContract && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-arena-600" />
                  <span>Instrumento Particular de Prestação de Serviços</span>
                </h3>
                <p className="text-xs text-slate-500">{selectedPdfContract.code} • {selectedPdfContract.cliente}</p>
              </div>
              <button
                onClick={() => setSelectedPdfContract(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 my-3 bg-slate-50 rounded-xl border border-slate-200 font-serif text-xs leading-relaxed space-y-3">
              <div className="text-center font-bold text-sm tracking-wide border-b pb-2">
                ARENA VIVA BY BAUMANN — CONTRATO DE PRESTAÇÃO DE SERVIÇOS ESPORTIVOS
              </div>
              <p>
                <strong>CONTRATADA:</strong> ARENA VIVA ESPORTES DE AREIA LTDA.
              </p>
              <p>
                <strong>CONTRATANTE:</strong> {selectedPdfContract.cliente.toUpperCase()}.
              </p>
              <p>
                <strong>CLÁUSULA 1ª — DO OBJETO:</strong> O presente contrato tem por objeto a prestação de serviços esportivos correspondentes ao <em>{selectedPdfContract.tipo}</em>, no período de {selectedPdfContract.inicio} a {selectedPdfContract.fim}.
              </p>
              <p>
                <strong>CLÁUSULA 2ª — DO VALOR E PAGAMENTO:</strong> O Contratante pagará o valor mensal de <strong>{formatCurrency(selectedPdfContract.valorMensal)}</strong>, totalizando {formatCurrency(selectedPdfContract.total)}, com quitação via Pix, Boleto ou Cartão TON.
              </p>
              <p>
                <strong>CLÁUSULA 3ª — DAS REPOSIÇÕES E INTEMPÉRIES:</strong> Em caso de falta às aulas, o aviso prévio mínimo de 4 horas gerará crédito de reposição de 60 dias. Em locações de quadras descobertas, intempéries climáticas geram crédito em horas para reagendamento.
              </p>
              <div className="pt-6 border-t flex justify-between text-center font-sans text-[11px] text-slate-500">
                <div>_____________________________ <br /> Arena VIVA by Baumann</div>
                <div>_____________________________ <br /> {selectedPdfContract.cliente}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Status: <strong>{selectedPdfContract.status}</strong> ({selectedPdfContract.assinatura})
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 font-bold text-xs flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPdfContract(null);
                    showToast("Link de assinatura digital reenviado com sucesso por WhatsApp!");
                  }}
                  className="px-4 py-2 rounded-xl bg-arena-600 hover:bg-arena-500 text-white font-bold text-xs shadow-md shadow-arena-600/30 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar para Assinatura</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
