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
  Upload,
  Layers,
  Sparkles,
  Copy,
  Edit3,
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

interface ContractTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  updatedAt: string;
  isImported: boolean;
  fileName?: string;
  content: string;
}

export function ContratosClient({ initialContracts }: { initialContracts: Contract[] }) {
  const [activeTab, setActiveTab] = useState<"EMITIDOS" | "MODELOS">("EMITIDOS");
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  const [toast, setToast] = useState<string | null>(null);

  // Modelos de Contrato Padrão e Importados
  const [templates, setTemplates] = useState<ContractTemplate[]>([
    {
      id: "tpl-1",
      title: "Modelo Padrão — Plano Semestral de Aulas",
      category: "Aulas & Turmas",
      description: "Minuta oficial para planos semestrais de Beach Tennis, Futevôlei e Vôlei de Praia com regras de reposição.",
      updatedAt: "03/11/2026",
      isImported: false,
      content: `INSTRUMENTO PARTICULAR DE PRESTAÇÃO DE SERVIÇOS ESPORTIVOS

CONTRATADA: ARENA VIVA ESPORTES DE AREIA LTDA.
CONTRATANTE: {{NOME_CLIENTE}}, portador(a) do CPF nº {{CPF_CLIENTE}}, telefone {{TELEFONE}}.

1. OBJETO: O presente contrato tem por objeto a prestação de serviços de aulas de {{MODALIDADE}}, na turma {{NOME_TURMA}}.
2. VALOR E VIGÊNCIA: O plano vigorará de {{DATA_INICIO}} a {{DATA_FIM}}, mediante pagamento mensal de {{VALOR_MENSAL}}.
3. FALTAS E REPOSIÇÕES: O aviso de falta com antecedência mínima de 4 horas gerará 1 crédito de reposição com validade de 60 dias.`,
    },
    {
      id: "tpl-2",
      title: "Modelo Padrão — Locação Recorrente de Quadras (Mensalistas)",
      category: "Locação de Quadras",
      description: "Contrato para mensalistas com reserva fixa semanal e cláusula de créditos por intempéries/chuva.",
      updatedAt: "01/11/2026",
      isImported: false,
      content: `CONTRATO DE LOCAÇÃO RECORRENTE DE QUADRA ESPORTIVA

LOCADORA: ARENA VIVA ESPORTES DE AREIA LTDA.
LOCATÁRIO(A): {{NOME_CLIENTE}}, CPF {{CPF_CLIENTE}}.

1. QUADRA E HORÁRIO: Reserva fixa semanal na {{NOME_QUADRA}} às {{HORARIO}}.
2. VALOR: Mensalidade fixa de {{VALOR_MENSAL}} com vencimento no dia 05 de cada mês.
3. PROTOCOLO DE CHUVA: Para quadras descobertas, intempéries climáticas geram crédito em horas com validade de 60 dias para remarcação.`,
    },
    {
      id: "tpl-3",
      title: "Modelo Patrocínio e Naming Rights de Torneio",
      category: "Eventos & Torneios",
      description: "Minuta comercial para cotas de patrocínio, banners e ativação de marcas em torneios oficiais.",
      updatedAt: "28/10/2026",
      isImported: true,
      fileName: "Minuta_Patrocinio_Arena_Viva_v2.docx",
      content: `TERMO DE PARCERIA E PATROCÍNIO ESPORTIVO

PATROCINADORA: {{NOME_CLIENTE}}
EVENTO: {{NOME_EVENTO}} na Arena VIVA by Baumann.
CONTRAPARTIDAS: Aplicação de logo em backdrop, quadra central e ativação promocional.`,
    },
  ]);

  // Modais
  const [isNewContractModalOpen, setIsNewContractModalOpen] = useState(false);
  const [isNewTemplateModalOpen, setIsNewTemplateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedPdfContract, setSelectedPdfContract] = useState<Contract | null>(null);
  const [viewingTemplate, setViewingTemplate] = useState<ContractTemplate | null>(null);

  // Form de Novo Contrato Emitido
  const [cliente, setCliente] = useState("");
  const [selectedTemplateTitle, setSelectedTemplateTitle] = useState(templates[0]?.title || "");
  const [valorMensal, setValorMensal] = useState("380.00");
  const [assinatura, setAssinatura] = useState("Digital (ZapSign)");

  // Form de Criar Novo Modelo
  const [newTplTitle, setNewTplTitle] = useState("");
  const [newTplCategory, setNewTplCategory] = useState("Aulas & Turmas");
  const [newTplDescription, setNewTplDescription] = useState("");
  const [newTplContent, setNewTplContent] = useState(
    `CONTRATO DE PRESTAÇÃO DE SERVIÇOS — ARENA VIVA\n\nCONTRATANTE: {{NOME_CLIENTE}}, CPF: {{CPF_CLIENTE}}\nVALOR MENSAL: {{VALOR_MENSAL}}\nVIGÊNCIA: {{DATA_INICIO}} a {{DATA_FIM}}\n\n[Inserir cláusulas específicas do modelo...]`
  );

  // Form de Importar Modelo
  const [importTitle, setImportTitle] = useState("");
  const [importCategory, setImportCategory] = useState("Locação de Quadras");
  const [importFileName, setImportFileName] = useState("");

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(valorMensal) || 350;
    const code = `CTR-2026-000${contracts.length + 1}`;

    const newContr: Contract = {
      code,
      cliente,
      tipo: selectedTemplateTitle,
      status: "AGUARDANDO_ASSINATURA",
      inicio: "01/11/2026",
      fim: "30/04/2027",
      valorMensal: val,
      total: val * 6,
      assinatura,
    };

    setContracts((prev) => [newContr, ...prev]);
    setIsNewContractModalOpen(false);
    showToast(`Contrato ${code} emitido com sucesso para ${cliente}!`);
    setCliente("");
  };

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    const newTpl: ContractTemplate = {
      id: "tpl-" + Date.now(),
      title: newTplTitle,
      category: newTplCategory,
      description: newTplDescription || "Modelo customizado da Arena VIVA.",
      updatedAt: new Date().toLocaleDateString("pt-BR"),
      isImported: false,
      content: newTplContent,
    };

    setTemplates((prev) => [newTpl, ...prev]);
    setIsNewTemplateModalOpen(false);
    showToast(`Modelo de contrato "${newTplTitle}" criado e salvo com sucesso!`);
    setNewTplTitle("");
    setNewTplDescription("");
  };

  const handleImportTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    const newTpl: ContractTemplate = {
      id: "tpl-" + Date.now(),
      title: importTitle || "Modelo Importado",
      category: importCategory,
      description: `Arquivo importado: ${importFileName || "minuta_externa.pdf"}`,
      updatedAt: new Date().toLocaleDateString("pt-BR"),
      isImported: true,
      fileName: importFileName || "contrato_especifico.pdf",
      content: `CONTRATO ESPECÍFICO IMPORTADO PELA ARENA VIVA\n\nArquivo de Origem: ${importFileName || "minuta_externa.pdf"}\n\nVariáveis suportadas: {{NOME_CLIENTE}}, {{CPF_CLIENTE}}, {{VALOR_MENSAL}}.`,
    };

    setTemplates((prev) => [newTpl, ...prev]);
    setIsImportModalOpen(false);
    showToast(`Modelo específico "${newTpl.title}" importado com sucesso!`);
    setImportTitle("");
    setImportFileName("");
  };

  const insertMergeTag = (tag: string) => {
    setNewTplContent((prev) => prev + " " + tag);
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

      {/* Barra Superior de Ações com as Novas Opções */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileSignature className="w-4 h-4 text-arena-600" />
            <span>Módulo de Gestão & Modelos de Contrato</span>
          </h2>
          <p className="text-xs text-slate-500">
            Crie novos modelos com tags dinâmicas, importe minutas específicas em PDF/Word ou emita para alunos e clientes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200"
          >
            <Upload className="w-3.5 h-3.5 text-slate-600" />
            <span>Importar Modelo Específico</span>
          </button>

          <button
            type="button"
            onClick={() => setIsNewTemplateModalOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-arena-400" />
            <span>Criar Modelo de Contrato</span>
          </button>

          <button
            type="button"
            onClick={() => setIsNewContractModalOpen(true)}
            className="bg-arena-600 hover:bg-arena-500 text-white px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm shadow-arena-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Emitir Contrato</span>
          </button>
        </div>
      </div>

      {/* Abas: Contratos Emitidos vs Modelos Cadastrados */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab("EMITIDOS")}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === "EMITIDOS"
              ? "border-arena-600 text-arena-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileSignature className="w-4 h-4" />
          <span>Contratos Emitidos & Assinaturas ({contracts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("MODELOS")}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === "MODELOS"
              ? "border-arena-600 text-arena-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Modelos e Minutas da Arena ({templates.length})</span>
        </button>
      </div>

      {/* ABA 1: CONTRATOS EMITIDOS */}
      {activeTab === "EMITIDOS" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
                  <th className="p-3">Código</th>
                  <th className="p-3">Cliente / Contratante</th>
                  <th className="p-3">Modelo Base Utilizado</th>
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
                        Ver PDF / Minuta →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA 2: MODELOS DE CONTRATO DA ARENA */}
      {activeTab === "MODELOS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {tpl.category}
                  </span>
                  {tpl.isImported ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      Arquivo Importado
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                      Modelo do Sistema
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-sm mt-2.5">
                  {tpl.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {tpl.description}
                </p>

                {tpl.fileName && (
                  <div className="mt-2 text-[11px] font-mono bg-slate-50 border border-slate-100 p-1.5 rounded text-slate-600 truncate">
                    📎 {tpl.fileName}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setViewingTemplate(tpl)}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Visualizar Minuta
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTemplateTitle(tpl.title);
                    setIsNewContractModalOpen(true);
                  }}
                  className="bg-arena-600 hover:bg-arena-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm"
                >
                  Usar Este Modelo
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL 1: CRIAR NOVO MODELO DE CONTRATO (TEMPLATE) */}
      {isNewTemplateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-arena-600" />
                <span>Criar Novo Modelo de Contrato da Arena VIVA</span>
              </h3>
              <button
                onClick={() => setIsNewTemplateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTemplate} className="space-y-4 mt-4 text-xs flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Título do Modelo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Modelo de Aulas de Beach Tennis 2026"
                    value={newTplTitle}
                    onChange={(e) => setNewTplTitle(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Categoria / Finalidade:</label>
                  <select
                    value={newTplCategory}
                    onChange={(e) => setNewTplCategory(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium"
                  >
                    <option value="Aulas & Turmas">Aulas & Turmas</option>
                    <option value="Locação de Quadras">Locação de Quadras (Mensalistas)</option>
                    <option value="Eventos & Torneios">Eventos & Torneios</option>
                    <option value="Patrocínios & Parcerias">Patrocínios & Parcerias</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Descrição Breve:</label>
                <input
                  type="text"
                  placeholder="Ex: Aplicável a alunos matriculados nos planos semestrais e anuais"
                  value={newTplDescription}
                  onChange={(e) => setNewTplDescription(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50"
                />
              </div>

              {/* Tags dinâmicas (Merge Tags) */}
              <div>
                <span className="font-bold text-slate-700 block mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Tags Dinâmicas (Clique para inserir na minuta):</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "{{NOME_CLIENTE}}",
                    "{{CPF_CLIENTE}}",
                    "{{TELEFONE}}",
                    "{{VALOR_MENSAL}}",
                    "{{DATA_INICIO}}",
                    "{{DATA_FIM}}",
                    "{{MODALIDADE}}",
                    "{{NOME_QUADRA}}",
                    "{{REGRAS_REPOSICAO_CHUVA}}",
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => insertMergeTag(tag)}
                      className="px-2 py-1 bg-slate-100 hover:bg-purple-100 hover:text-purple-900 border border-slate-200 rounded text-[11px] font-mono text-slate-700 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Texto e Cláusulas da Minuta *</label>
                <textarea
                  rows={8}
                  required
                  value={newTplContent}
                  onChange={(e) => setNewTplContent(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-mono text-xs leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewTemplateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-arena-600 hover:bg-arena-500 text-white font-bold shadow-md shadow-arena-600/30"
                >
                  Salvar Modelo de Contrato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: IMPORTAR MODELO ESPECÍFICO */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-arena-600" />
                <span>Importar Modelo Específico de Contrato</span>
              </h3>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleImportTemplate} className="space-y-4 mt-4 text-xs">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 leading-relaxed">
                Você pode anexar um modelo próprio já utilizado pela Arena VIVA (Word, PDF ou Texto) para cadastrá-lo como minuta pronta.
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nome de Identificação do Modelo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Minuta Própria Arena VIVA 2026"
                  value={importTitle}
                  onChange={(e) => setImportTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Categoria do Modelo:</label>
                <select
                  value={importCategory}
                  onChange={(e) => setImportCategory(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium"
                >
                  <option value="Locação de Quadras">Locação de Quadras</option>
                  <option value="Aulas & Turmas">Aulas & Turmas</option>
                  <option value="Eventos & Torneios">Eventos & Torneios</option>
                  <option value="Patrocínios & Parcerias">Patrocínios & Parcerias</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Arquivo do Contrato (.pdf, .docx ou .txt) *</label>
                <input
                  type="file"
                  required
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImportFileName(file.name);
                      if (!importTitle) {
                        setImportTitle(file.name.replace(/\.[^/.]+$/, ""));
                      }
                    }
                  }}
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
                  Salvar Modelo Importado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: EMITIR CONTRATO PARA CLIENTE */}
      {isNewContractModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-arena-600" />
                <span>Emitir Contrato para Cliente</span>
              </h3>
              <button
                onClick={() => setIsNewContractModalOpen(false)}
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
                <label className="font-bold text-slate-700 block mb-1">Modelo de Contrato a Aplicar:</label>
                <select
                  value={selectedTemplateTitle}
                  onChange={(e) => setSelectedTemplateTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium"
                >
                  {templates.map((tpl) => (
                    <option key={tpl.id} value={tpl.title}>
                      {tpl.title} ({tpl.category})
                    </option>
                  ))}
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
                  onClick={() => setIsNewContractModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-arena-600 hover:bg-arena-500 text-white font-bold shadow-md shadow-arena-600/30"
                >
                  Emitir e Enviar para Assinatura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: VISUALIZAR MINUTA DO MODELO */}
      {viewingTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">{viewingTemplate.title}</h3>
                <p className="text-xs text-slate-500">{viewingTemplate.category} • Atualizado em {viewingTemplate.updatedAt}</p>
              </div>
              <button
                onClick={() => setViewingTemplate(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 my-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs whitespace-pre-wrap leading-relaxed text-slate-800">
              {viewingTemplate.content}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setViewingTemplate(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedTemplateTitle(viewingTemplate.title);
                  setViewingTemplate(null);
                  setIsNewContractModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-arena-600 hover:bg-arena-500 text-white font-bold text-xs shadow-sm"
              >
                Emitir Contrato com Este Modelo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: VISUALIZADOR DE CONTRATO EMITIDO */}
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
