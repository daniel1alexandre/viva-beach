"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  Calendar,
  Clock,
  CloudRain,
  Plus,
  CheckCircle,
  AlertTriangle,
  User,
  Shield,
  X,
  Sparkles,
} from "lucide-react";

interface Court {
  id: string;
  courtNumber: number;
  name: string;
  covered: boolean;
  surface: string;
}

interface Booking {
  id: string;
  courtId: string;
  startTime: string;
  endTime: string;
  sportType: string;
  bookingType: string;
  status: string;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: string;
  customer?: { name: string } | null;
  guestName?: string | null;
}

interface Customer {
  id: string;
  name: string;
}

export function QuadrasClient({
  courts,
  initialBookings,
  customers,
}: {
  courts: Court[];
  initialBookings: Booking[];
  customers: Customer[];
}) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  // Modais
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [isRainModalOpen, setIsRainModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form de Nova Reserva
  const [selectedCourtId, setSelectedCourtId] = useState(courts[0]?.id || "");
  const [selectedSlot, setSelectedSlot] = useState("18:00");
  const [bookingType, setBookingType] = useState("AVULSA");
  const [sportType, setSportType] = useState("Beach Tennis");
  const [customerId, setCustomerId] = useState("");
  const [guestName, setGuestName] = useState("");
  const [price, setPrice] = useState("110");
  const [paymentMethod, setPaymentMethod] = useState("PIX");

  // Form de Chuva
  const [rainCourtIds, setRainCourtIds] = useState<string[]>(
    courts.filter((c) => !c.covered).map((c) => c.id)
  );

  const timeSlots = [
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00", "21:00", "22:00"
  ];

  const handleOpenReserveAt = (courtId: string, slot: string) => {
    setSelectedCourtId(courtId);
    setSelectedSlot(slot);
    setIsReserveModalOpen(true);
  };

  const handleSaveBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const court = courts.find((c) => c.id === selectedCourtId);
    const customer = customers.find((c) => c.id === customerId);

    const newBooking: Booking = {
      id: "book-" + Date.now(),
      courtId: selectedCourtId,
      startTime: selectedSlot,
      endTime: getNextSlot(selectedSlot),
      sportType,
      bookingType,
      status: "CONFIRMADA",
      totalAmount: parseFloat(price) || 100,
      paidAmount: parseFloat(price) || 100,
      paymentStatus: "PAGO",
      customer: customer ? { name: customer.name } : null,
      guestName: customer ? null : guestName || "Cliente Balcão",
    };

    setBookings((prev) => [...prev, newBooking]);
    setIsReserveModalOpen(false);
    showToast(`Reserva confirmada com sucesso para ${court?.name} às ${selectedSlot}!`);
    // Limpar
    setGuestName("");
    setCustomerId("");
  };

  const handleApplyRainProtocol = () => {
    // Cancela reservas das quadras descobertas selecionadas e gera créditos
    setBookings((prev) =>
      prev.map((b) => {
        if (rainCourtIds.includes(b.courtId)) {
          return {
            ...b,
            status: "CHUVA_REMARCAR",
            paymentStatus: "CREDITO_GERADO",
          };
        }
        return b;
      })
    );
    setIsRainModalOpen(false);
    showToast("Protocolo de Chuva ativado! Créditos de 60 dias gerados para remarcação das quadras descobertas.");
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast de Sucesso */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-400 animate-bounce">
          <CheckCircle className="w-5 h-5" />
          <span className="text-xs font-bold">{successToast}</span>
        </div>
      )}

      {/* Barra Superior de Ações e Filtros */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>Hoje ({new Date().toLocaleDateString("pt-BR")})</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Livre
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ml-2"></span> Avulsa
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ml-2"></span> Mensalista
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 ml-2"></span> Aula
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 ml-2"></span> Chuva (Crédito)
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setIsRainModalOpen(true)}
            className="bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <CloudRain className="w-4 h-4 text-amber-600" />
            <span>Acionar Protocolo Chuva</span>
          </button>
          <button
            type="button"
            onClick={() => setIsReserveModalOpen(true)}
            className="bg-arena-600 hover:bg-arena-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm shadow-arena-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Reserva</span>
          </button>
        </div>
      </div>

      {/* Grade Visual das 8 Quadras */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-900 text-white border-b border-slate-800">
                <th className="p-3 font-semibold w-20 text-center border-r border-slate-800">
                  Horário
                </th>
                {courts.map((court) => (
                  <th key={court.id} className="p-3 font-bold border-r border-slate-800 text-center min-w-[140px]">
                    <div>Q{court.courtNumber} - {court.name}</div>
                    <div className="text-[10px] text-arena-400 font-normal mt-0.5">
                      {court.covered ? "Coberta" : "Descoberta"} • {court.surface}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {timeSlots.map((slot) => (
                <tr key={slot} className="hover:bg-slate-50/50">
                  <td className="p-3 font-mono font-bold text-slate-500 bg-slate-50/80 text-center border-r border-slate-200">
                    {slot}
                  </td>

                  {courts.map((court) => {
                    const booking = bookings.find(
                      (b) => b.courtId === court.id && b.startTime === slot
                    );

                    return (
                      <td
                        key={court.id}
                        className="p-1.5 border-r border-slate-100 min-w-[130px] align-top"
                      >
                        {booking ? (
                          <div
                            className={`p-2 rounded-lg border text-[11px] leading-tight transition-all ${
                              booking.status === "CHUVA_REMARCAR"
                                ? "bg-sky-50 border-sky-300 text-sky-900"
                                : booking.bookingType === "RECORRENTE_MENSALISTA"
                                ? "bg-blue-50 border-blue-200 text-blue-900"
                                : booking.bookingType === "AULA"
                                ? "bg-purple-50 border-purple-200 text-purple-900"
                                : "bg-amber-50 border-amber-200 text-amber-900"
                            }`}
                          >
                            <div className="font-bold truncate">
                              {booking.customer?.name || booking.guestName || "Reserva"}
                            </div>
                            <div className="text-[10px] opacity-80 mt-0.5">
                              {booking.sportType} • {formatCurrency(booking.totalAmount)}
                            </div>
                            <div className="mt-1 flex items-center justify-between">
                              <span
                                className={`text-[9px] px-1 py-0.2 rounded font-semibold uppercase ${
                                  booking.status === "CHUVA_REMARCAR"
                                    ? "bg-sky-200 text-sky-800"
                                    : booking.paymentStatus === "PAGO"
                                    ? "bg-emerald-200 text-emerald-800"
                                    : "bg-amber-200 text-amber-800"
                                }`}
                              >
                                {booking.status === "CHUVA_REMARCAR" ? "Crédito Gerado" : booking.paymentStatus}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenReserveAt(court.id, slot)}
                            title={`Reservar Q${court.courtNumber} às ${slot}`}
                            className="w-full h-12 rounded border border-dashed border-slate-200 hover:border-arena-500 hover:bg-arena-50/40 transition-all flex items-center justify-center text-slate-300 hover:text-arena-600 group"
                          >
                            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Nova Reserva */}
      {isReserveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-arena-600" />
                <span>Nova Reserva de Quadra</span>
              </h3>
              <button
                onClick={() => setIsReserveModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBooking} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Quadra:</label>
                  <select
                    value={selectedCourtId}
                    onChange={(e) => setSelectedCourtId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white font-medium"
                  >
                    {courts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.covered ? "Coberta" : "Descoberta"})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Horário de Início:</label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white font-medium"
                  >
                    {timeSlots.map((s) => (
                      <option key={s} value={s}>
                        {s} às {getNextSlot(s)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Modalidade:</label>
                  <select
                    value={sportType}
                    onChange={(e) => setSportType(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white"
                  >
                    <option value="Beach Tennis">Beach Tennis</option>
                    <option value="Futevôlei">Futevôlei</option>
                    <option value="Vôlei de Praia">Vôlei de Praia</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipo de Reserva:</label>
                  <select
                    value={bookingType}
                    onChange={(e) => setBookingType(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white"
                  >
                    <option value="AVULSA">Reserva Avulsa (Horário único)</option>
                    <option value="RECORRENTE_MENSALISTA">Mensalista Fixo Recorrente</option>
                    <option value="AULA">Aula / Clínica</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Cliente Cadastrado:</label>
                <select
                  value={customerId}
                  onChange={(e) => {
                    setCustomerId(e.target.value);
                    if (e.target.value) setGuestName("");
                  }}
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white"
                >
                  <option value="">Selecionar da lista ou digitar nome avulso abaixo...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {!customerId && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nome do Cliente Avulso:</label>
                  <input
                    type="text"
                    required={!customerId}
                    placeholder="Ex: João da Silva (Balcão)"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Valor Total (R$):</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Forma de Pagamento:</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium"
                  >
                    <option value="PIX">Pix (Imediato)</option>
                    <option value="CARTAO">Cartão (TON)</option>
                    <option value="DINHEIRO">Dinheiro</option>
                    <option value="SINAL_50">Sinal 50% (Saldo no check-in)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReserveModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-arena-600 hover:bg-arena-500 text-white font-bold shadow-md shadow-arena-600/30"
                >
                  Confirmar Reserva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Protocolo Chuva */}
      {isRainModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-amber-900 flex items-center gap-2">
                <CloudRain className="w-5 h-5 text-amber-600" />
                <span>Acionar Protocolo de Chuva</span>
              </h3>
              <button
                onClick={() => setIsRainModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mt-4 text-xs">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 leading-relaxed">
                <span className="font-bold block mb-1">Regra Homologada da Arena VIVA:</span>
                Ao confirmar, todos os horários agendados para hoje nas quadras descobertas serão automaticamente cancelados e o sistema gerará <strong>créditos em horas com validade de 60 dias</strong> para os clientes remarcarem sem custo adicional.
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-2">
                  Quadras Descobertas Afetadas:
                </span>
                <div className="space-y-1.5">
                  {courts
                    .filter((c) => !c.covered)
                    .map((c) => (
                      <label
                        key={c.id}
                        className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 bg-slate-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={rainCourtIds.includes(c.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setRainCourtIds((prev) => [...prev, c.id]);
                            } else {
                              setRainCourtIds((prev) => prev.filter((id) => id !== c.id));
                            }
                          }}
                          className="w-4 h-4 text-amber-600 rounded"
                        />
                        <span className="font-medium text-slate-800">
                          {c.name} (Descoberta)
                        </span>
                      </label>
                    ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRainModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={handleApplyRainProtocol}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-md shadow-amber-600/30"
                >
                  Confirmar e Gerar Créditos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getNextSlot(slot: string): string {
  const [h] = slot.split(":");
  const nextH = parseInt(h) + 1;
  return `${nextH < 10 ? "0" + nextH : nextH}:00`;
}

