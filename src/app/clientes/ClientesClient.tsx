"use client";

import { useState } from "react";
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
  X,
  CreditCard,
  UserCheck,
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  cpf: string | null;
  status: string;
  walletBalance: number;
  courtBookings: any[];
  classEnrollments: any[];
}

export function ClientesClient({ initialCustomers }: { initialCustomers: Customer[] }) {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [search, setSearch] = useState("");
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [initialCashback, setInitialCashback] = useState("0");

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.cpf && c.cpf.includes(search)) ||
      c.phone.includes(search)
  );

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const newCust: Customer = {
      id: "cust-" + Date.now(),
      name,
      cpf: cpf || null,
      phone,
      email: email || null,
      status: "ATIVO",
      walletBalance: parseFloat(initialCashback) || 0,
      courtBookings: [],
      classEnrollments: [],
    };

    setCustomers((prev) => [newCust, ...prev]);
    setIsNewModalOpen(false);
    showToast(`Cliente ${name} cadastrado com sucesso com R$ ${newCust.walletBalance.toFixed(2)} de saldo cashback!`);

    setName("");
    setCpf("");
    setPhone("");
    setEmail("");
    setInitialCashback("0");
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-400 animate-bounce">
          <CheckCircle className="w-5 h-5" />
          <span className="text-xs font-bold">{toast}</span>
        </div>
      )}

      {/* Barra de Filtros e Novo Cliente */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por nome, CPF ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-arena-500"
          />
        </div>

        <button
          type="button"
          onClick={() => setIsNewModalOpen(true)}
          className="bg-arena-600 hover:bg-arena-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm shadow-arena-600/30"
        >
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
              {filtered.map((c) => (
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
                    <button
                      type="button"
                      onClick={() => setSelectedCustomer(c)}
                      className="text-xs font-semibold text-arena-600 hover:text-arena-700 bg-arena-50 hover:bg-arena-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Ver Ficha 360°
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Novo Cliente */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-arena-600" />
                <span>Cadastrar Novo Cliente</span>
              </h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Beatriz Lima"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">CPF</label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Telefone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="(11) 90000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">E-mail</label>
                <input
                  type="email"
                  placeholder="cliente@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Crédito Inicial na Carteira (Cashback R$)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={initialCashback}
                  onChange={(e) => setInitialCashback(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white font-bold text-purple-900"
                />
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
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal / Drawer: Ficha 360° do Cliente */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-arena-100 text-arena-700 font-bold flex items-center justify-center text-sm">
                  {selectedCustomer.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedCustomer.name}</h3>
                  <p className="text-xs text-slate-500">{selectedCustomer.phone} • {selectedCustomer.cpf || "Sem CPF"}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mt-4 text-xs">
              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-purple-700 tracking-wider">
                    Carteira de Fidelidade (Cashback)
                  </span>
                  <div className="text-xl font-black text-purple-950 mt-0.5">
                    {formatCurrency(selectedCustomer.walletBalance)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const extra = prompt("Valor a adicionar/ajustar no saldo de cashback (R$):", "20");
                    if (extra && !isNaN(parseFloat(extra))) {
                      const updated = selectedCustomer.walletBalance + parseFloat(extra);
                      setSelectedCustomer({ ...selectedCustomer, walletBalance: updated });
                      setCustomers((prev) =>
                        prev.map((c) =>
                          c.id === selectedCustomer.id ? { ...c, walletBalance: updated } : c
                        )
                      );
                      showToast(`Saldo de cashback atualizado para ${formatCurrency(updated)}!`);
                    }
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg font-bold text-xs shadow-sm"
                >
                  Ajustar Saldo
                </button>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-800 block">Histórico de Atividades:</span>
                <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <span>Locações de Quadra Realizadas</span>
                  <span className="font-bold text-slate-900">{selectedCustomer.courtBookings.length} jogos</span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <span>Turmas / Aulas Matriculadas</span>
                  <span className="font-bold text-slate-900">{selectedCustomer.classEnrollments.length} turmas</span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedCustomer(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold"
                >
                  Fechar Ficha
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

