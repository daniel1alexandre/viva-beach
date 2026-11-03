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
  Users,
  Shield,
  X,
  Sparkles,
  GraduationCap,
  Trash2,
  Phone,
  Check,
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
  professorName?: string | null;
  students?: string[];
}

interface Customer {
  id: string;
  name: string;
  phone?: string;
}

interface Professor {
  id: string;
  name: string;
  role?: string;
}

export function QuadrasClient({
  courts,
  initialBookings,
  customers,
  professors = [],
}: {
  courts: Court[];
  initialBookings: Booking[];
  customers: Customer[];
  professors?: Professor[];
}) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  // Modais
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [isRainModalOpen, setIsRainModalOpen] = useState(false);
  const [selectedBookingDetail, setSelectedBookingDetail] = useState<Booking | null>(null);
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

  // Estado especial para AULAS (vários alunos e professor)
  const [selectedProfessor, setSelectedProfessor] = useState(
    professors[0]?.name || "Professor Lucas Beach"
  );
  const [studentList, setStudentList] = useState<string[]>([]);
  const [currentStudentInput, setCurrentStudentInput] = useState("");

  // Input para adicionar aluno no modal de detalhes
  const [detailStudentInput, setDetailStudentInput] = useState("");

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
    setBookingType("AVULSA");
    setStudentList([]);
    setCurrentStudentInput("");
    setIsReserveModalOpen(true);
  };

  const handleOpenReserveForClass = () => {
    setBookingType("AULA");
    setPrice("240");
    setStudentList([]);
    setCurrentStudentInput("");
    setIsReserveModalOpen(true);
  };

  // Adicionar aluno na lista do formulário de criação
  const handleAddStudent = () => {
    const raw = currentStudentInput.trim();
    if (!raw) return;

    // Permite adicionar múltiplos nomes separados por vírgula ou ponto-e-vírgula
    const names = raw
      .split(/[,;]+/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0 && !studentList.includes(n));

    if (names.length > 0) {
      setStudentList((prev) => [...prev, ...names]);
      setCurrentStudentInput("");
    }
  };

  const handleRemoveStudent = (indexToRemove: number) => {
    setStudentList((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSaveBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const court = courts.find((c) => c.id === selectedCourtId);
    const customer = customers.find((c) => c.id === customerId);

    const isClass = bookingType === "AULA";
    const finalStudents = isClass
      ? studentList.length > 0
        ? studentList
        : [guestName || customer?.name || "Aluno 1"]
      : undefined;

    const newBooking: Booking = {
      id: "book-" + Date.now(),
      courtId: selectedCourtId,
      startTime: selectedSlot,
      endTime: getNextSlot(selectedSlot),
      sportType,
      bookingType,
      status: "CONFIRMADA",
      totalAmount: parseFloat(price) || (isClass ? 240 : 100),
      paidAmount: parseFloat(price) || (isClass ? 240 : 100),
      paymentStatus: "PAGO",
      customer: customer ? { name: customer.name } : null,
      guestName: isClass
        ? `Turma de Treino (${finalStudents?.length || 0} alunos)`
        : customer
        ? null
        : guestName || "Cliente Balcão",
      professorName: isClass ? selectedProfessor : undefined,
      students: finalStudents,
    };

    setBookings((prev) => [...prev, newBooking]);
    setIsReserveModalOpen(false);

    if (isClass) {
      showToast(
        `Aula confirmada para ${court?.name} às ${selectedSlot} com ${finalStudents?.length} alunos matriculados!`
      );
    } else {
      showToast(`Reserva confirmada com sucesso para ${court?.name} às ${selectedSlot}!`);
    }

    // Limpar estados
    setGuestName("");
    setCustomerId("");
    setStudentList([]);
    setCurrentStudentInput("");
  };

  // Adicionar aluno diretamente na aula aberta nos detalhes
  const handleAddStudentToDetail = () => {
    if (!selectedBookingDetail || !detailStudentInput.trim()) return;

    const raw = detailStudentInput.trim();
    const newNames = raw
      .split(/[,;]+/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    if (newNames.length === 0) return;

    const currentStudents = selectedBookingDetail.students || [];
    const updatedStudents = [...currentStudents, ...newNames];

    const updatedBooking: Booking = {
      ...selectedBookingDetail,
      students: updatedStudents,
      guestName: `Turma de Treino (${updatedStudents.length} alunos)`,
    };

    setBookings((prev) =>
      prev.map((b) => (b.id === selectedBookingDetail.id ? updatedBooking : b))
    );
    setSelectedBookingDetail(updatedBooking);
    setDetailStudentInput("");
    showToast(`${newNames.length} aluno(s) incluído(s) na aula com sucesso!`);
  };

  // Remover aluno na aula aberta nos detalhes
  const handleRemoveStudentFromDetail = (indexToRemove: number) => {
    if (!selectedBookingDetail || !selectedBookingDetail.students) return;

    const updatedStudents = selectedBookingDetail.students.filter(
      (_, idx) => idx !== indexToRemove
    );

    const updatedBooking: Booking = {
      ...selectedBookingDetail,
      students: updatedStudents,
      guestName: `Turma de Treino (${updatedStudents.length} alunos)`,
    };

    setBookings((prev) =>
      prev.map((b) => (b.id === selectedBookingDetail.id ? updatedBooking : b))
    );
    setSelectedBookingDetail(updatedBooking);
    showToast("Aluno removido da lista da aula.");
  };

  const handleApplyRainProtocol = () => {
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
    showToast(
      "Protocolo de Chuva ativado! Créditos de 60 dias gerados para remarcação das quadras descobertas."
    );
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4500);
  };

  return (
    <div className="space-y-6">
      {/* Toast de Sucesso */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-400 animate-bounce">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold">{successToast}</span>
        </div>
      )}

      {/* Barra Superior de Ações e Filtros */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>Hoje ({new Date().toLocaleDateString("pt-BR")})</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 font-medium">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Livre
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Avulsa
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Mensalista
            </span>
            <span className="inline-flex items-center gap-1.5 font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Aula / Turma (Lista de Alunos)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> Chuva (Crédito)
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleOpenReserveForClass}
            className="bg-purple-50 hover:bg-purple-100 border border-purple-300 text-purple-800 px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <GraduationCap className="w-4 h-4 text-purple-600" />
            <span>Agendar Aula / Turma</span>
          </button>
          <button
            type="button"
            onClick={() => setIsRainModalOpen(true)}
            className="bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <CloudRain className="w-4 h-4 text-amber-600" />
            <span>Protocolo Chuva</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setBookingType("AVULSA");
              setIsReserveModalOpen(true);
            }}
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
                  <th
                    key={court.id}
                    className="p-3 font-bold border-r border-slate-800 text-center min-w-[150px]"
                  >
                    <div>
                      Q{court.courtNumber} - {court.name}
                    </div>
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
                        className="p-1.5 border-r border-slate-100 min-w-[150px] align-top"
                      >
                        {booking ? (
                          <div
                            onClick={() => setSelectedBookingDetail(booking)}
                            title="Clique para ver os alunos e detalhes do agendamento"
                            className={`p-2.5 rounded-xl border text-[11px] leading-tight transition-all cursor-pointer hover:shadow-md ${
                              booking.status === "CHUVA_REMARCAR"
                                ? "bg-sky-50 border-sky-300 text-sky-900"
                                : booking.bookingType === "AULA"
                                ? "bg-purple-50/90 border-purple-300 text-purple-950 hover:border-purple-400"
                                : booking.bookingType === "RECORRENTE_MENSALISTA"
                                ? "bg-blue-50 border-blue-200 text-blue-900 hover:border-blue-300"
                                : "bg-amber-50 border-amber-200 text-amber-900 hover:border-amber-300"
                            }`}
                          >
                            {/* Cabeçalho do Card */}
                            <div className="flex items-start justify-between gap-1 font-bold">
                              <span className="flex items-center gap-1 truncate">
                                {booking.bookingType === "AULA" ? (
                                  <>
                                    <GraduationCap className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                                    <span className="truncate">
                                      {booking.professorName || "Aula / Turma"}
                                    </span>
                                  </>
                                ) : (
                                  <span className="truncate">
                                    {booking.customer?.name ||
                                      booking.guestName ||
                                      "Reserva"}
                                  </span>
                                )}
                              </span>

                              {/* Badge de Alunos se for AULA */}
                              {booking.bookingType === "AULA" &&
                                booking.students &&
                                booking.students.length > 0 && (
                                  <span className="bg-purple-200/90 text-purple-900 text-[10px] px-1.5 py-0.2 rounded-full font-black shrink-0">
                                    {booking.students.length} alunos
                                  </span>
                                )}
                            </div>

                            {/* Conteúdo Específico de AULA: Lista de Alunos Visível */}
                            {booking.bookingType === "AULA" &&
                            booking.students &&
                            booking.students.length > 0 ? (
                              <div className="mt-1.5 space-y-1 bg-white/70 p-1.5 rounded-lg border border-purple-100">
                                <div className="text-[10px] font-bold text-purple-900 flex items-center gap-1">
                                  <Users className="w-3 h-3 text-purple-600 shrink-0" />
                                  <span>Alunos do Horário:</span>
                                </div>
                                <div className="space-y-0.5">
                                  {booking.students.slice(0, 3).map((st, i) => (
                                    <div
                                      key={i}
                                      className="text-[10px] font-medium text-slate-800 flex items-center gap-1 truncate"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></span>
                                      <span className="truncate">{st}</span>
                                    </div>
                                  ))}
                                  {booking.students.length > 3 && (
                                    <div className="text-[9px] font-bold text-purple-700 pl-2.5">
                                      + {booking.students.length - 3} outros alunos...
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="text-[10px] opacity-80 mt-0.5">
                                {booking.sportType} •{" "}
                                {formatCurrency(booking.totalAmount)}
                              </div>
                            )}

                            {/* Rodapé do Card */}
                            <div className="mt-2 flex items-center justify-between text-[9px]">
                              <span
                                className={`px-1.5 py-0.5 rounded font-extrabold uppercase ${
                                  booking.status === "CHUVA_REMARCAR"
                                    ? "bg-sky-200 text-sky-800"
                                    : booking.bookingType === "AULA"
                                    ? "bg-purple-200 text-purple-900"
                                    : booking.paymentStatus === "PAGO"
                                    ? "bg-emerald-200 text-emerald-800"
                                    : "bg-amber-200 text-amber-800"
                                }`}
                              >
                                {booking.status === "CHUVA_REMARCAR"
                                  ? "Crédito"
                                  : booking.bookingType === "AULA"
                                  ? "Aula"
                                  : booking.paymentStatus}
                              </span>

                              <span className="font-extrabold text-slate-700">
                                {formatCurrency(booking.totalAmount)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenReserveAt(court.id, slot)}
                            title={`Reservar Q${court.courtNumber} às ${slot}`}
                            className="w-full h-14 rounded-lg border border-dashed border-slate-200 hover:border-arena-500 hover:bg-arena-50/40 transition-all flex items-center justify-center text-slate-300 hover:text-arena-600 group"
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

      {/* Modal: Nova Reserva / Nova Aula */}
      {isReserveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                {bookingType === "AULA" ? (
                  <>
                    <GraduationCap className="w-5 h-5 text-purple-600" />
                    <span>Agendar Aula / Turma de Alunos</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5 text-arena-600" />
                    <span>Nova Reserva de Quadra</span>
                  </>
                )}
              </h3>
              <button
                onClick={() => setIsReserveModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBooking} className="space-y-4 mt-4 text-xs">
              {/* Tipo de Reserva */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Finalidade do Horário:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBookingType("AVULSA");
                      setPrice("110");
                    }}
                    className={`p-2 rounded-lg border font-bold text-center transition-all ${
                      bookingType === "AVULSA"
                        ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Avulsa
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBookingType("RECORRENTE_MENSALISTA");
                      setPrice("100");
                    }}
                    className={`p-2 rounded-lg border font-bold text-center transition-all ${
                      bookingType === "RECORRENTE_MENSALISTA"
                        ? "bg-blue-600 text-white border-blue-700 shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Mensalista
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBookingType("AULA");
                      setPrice("240");
                    }}
                    className={`p-2 rounded-lg border font-bold text-center transition-all ${
                      bookingType === "AULA"
                        ? "bg-purple-600 text-white border-purple-700 shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    🎓 Aula / Turma
                  </button>
                </div>
              </div>

              {/* Quadra e Horário */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Quadra:
                  </label>
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
                  <label className="font-bold text-slate-700 block mb-1">
                    Horário de Início:
                  </label>
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

              {/* Modalidade Esportiva */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Modalidade:
                </label>
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

              {/* SEÇÃO DINÂMICA: SE FOR AULA -> INCLUSÃO DE MÚLTIPLOS ALUNOS */}
              {bookingType === "AULA" ? (
                <div className="space-y-3 bg-purple-50/80 p-3.5 rounded-xl border border-purple-200">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-purple-950 flex items-center gap-1.5 text-xs">
                      <GraduationCap className="w-4 h-4 text-purple-700" />
                      <span>Alunos desta Aula:</span>
                    </label>
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-purple-200 text-purple-900">
                      {studentList.length} aluno(s) incluído(s)
                    </span>
                  </div>

                  {/* Professor da Aula */}
                  <div>
                    <label className="text-[11px] font-semibold text-purple-900 block mb-1">
                      Professor Responsável:
                    </label>
                    <select
                      value={selectedProfessor}
                      onChange={(e) => setSelectedProfessor(e.target.value)}
                      className="w-full p-2 rounded-lg border border-purple-200 bg-white font-semibold text-purple-950"
                    >
                      {professors.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                      <option value="Professor Convidado / Substituto">
                        Professor Convidado / Substituto
                      </option>
                    </select>
                  </div>

                  {/* Campo para Incluir Alunos */}
                  <div>
                    <label className="text-[11px] font-semibold text-purple-900 block mb-1">
                      Digitar ou Selecionar Aluno:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        list="students-list-suggestion"
                        placeholder="Nome do aluno (ou vários separados por vírgula)..."
                        value={currentStudentInput}
                        onChange={(e) => setCurrentStudentInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddStudent();
                          }
                        }}
                        className="flex-1 p-2 rounded-lg border border-purple-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                      <datalist id="students-list-suggestion">
                        {customers.map((c) => (
                          <option key={c.id} value={c.name} />
                        ))}
                      </datalist>
                      <button
                        type="button"
                        onClick={handleAddStudent}
                        className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 shrink-0 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-purple-700 mt-1">
                      💡 <strong>Dica:</strong> Pressione <em>Enter</em> para adicionar ou cole vários nomes separados por vírgula (Ex: <em>Carlos, Amanda, Gabriel</em>).
                    </p>
                  </div>

                  {/* Lista de Alunos Adicionados (Chips) */}
                  {studentList.length > 0 ? (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">
                        Lista de Chamada ({studentList.length}):
                      </span>
                      <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-white rounded-lg border border-purple-100">
                        {studentList.map((st, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-100 text-purple-950 text-xs font-semibold border border-purple-200"
                          >
                            <User className="w-3 h-3 text-purple-600" />
                            <span>{st}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveStudent(idx)}
                              className="text-purple-400 hover:text-red-600 ml-1 rounded-full p-0.5 transition-colors"
                              title="Remover este aluno"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-2 text-[11px] text-purple-600 italic bg-white/50 rounded-lg border border-dashed border-purple-200">
                      Nenhum aluno incluído ainda. Digite os nomes acima para identificar os alunos do horário.
                    </div>
                  )}
                </div>
              ) : (
                /* SE NÃO FOR AULA -> FORMULÁRIO PADRÃO DE CLIENTE ÚNICO */
                <div className="space-y-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Cliente Cadastrado:
                    </label>
                    <select
                      value={customerId}
                      onChange={(e) => {
                        setCustomerId(e.target.value);
                        if (e.target.value) setGuestName("");
                      }}
                      className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white"
                    >
                      <option value="">
                        Selecionar da lista ou digitar nome avulso abaixo...
                      </option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {!customerId && (
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Nome do Cliente Avulso:
                      </label>
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
                </div>
              )}

              {/* Valores e Pagamento */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Valor Total (R$):
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Forma de Pagamento:
                  </label>
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

              {/* Botões do Rodapé */}
              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsReserveModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 rounded-xl text-white font-bold shadow-md transition-all ${
                    bookingType === "AULA"
                      ? "bg-purple-600 hover:bg-purple-500 shadow-purple-600/30"
                      : "bg-arena-600 hover:bg-arena-500 shadow-arena-600/30"
                  }`}
                >
                  {bookingType === "AULA"
                    ? `Confirmar Aula (${studentList.length} alunos)`
                    : "Confirmar Reserva"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Detalhes do Agendamento / Chamada de Alunos da Aula */}
      {selectedBookingDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                {selectedBookingDetail.bookingType === "AULA" ? (
                  <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="p-2 rounded-xl bg-arena-100 text-arena-700">
                    <Calendar className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedBookingDetail.bookingType === "AULA"
                      ? "Detalhes da Aula e Lista de Alunos"
                      : "Detalhes da Reserva de Quadra"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Horário: {selectedBookingDetail.startTime} às{" "}
                    {selectedBookingDetail.endTime} •{" "}
                    {selectedBookingDetail.sportType}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedBookingDetail(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {/* Informações Principais */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Tipo de Agendamento
                  </span>
                  <div className="font-extrabold text-slate-900 mt-0.5">
                    {selectedBookingDetail.bookingType === "AULA"
                      ? "Aula / Treino em Turma"
                      : selectedBookingDetail.bookingType === "RECORRENTE_MENSALISTA"
                      ? "Mensalista Recorrente"
                      : "Locação Avulsa"}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Valor & Status
                  </span>
                  <div className="font-extrabold text-emerald-600 mt-0.5 flex items-center gap-1.5">
                    <span>{formatCurrency(selectedBookingDetail.totalAmount)}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold uppercase">
                      {selectedBookingDetail.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Se for Aula -> Gerenciamento Completo dos Alunos */}
              {selectedBookingDetail.bookingType === "AULA" ? (
                <div className="space-y-3 bg-purple-50/60 p-4 rounded-xl border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-purple-950 block">
                        Professor da Turma:
                      </span>
                      <span className="text-xs font-extrabold text-purple-800">
                        {selectedBookingDetail.professorName || "Professor Lucas Beach"}
                      </span>
                    </div>

                    <span className="bg-purple-200 text-purple-900 font-black px-2.5 py-1 rounded-full text-xs">
                      {selectedBookingDetail.students?.length || 0} alunos confirmados
                    </span>
                  </div>

                  {/* Lista de Alunos Matriculados */}
                  <div>
                    <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wider block mb-2">
                      Alunos Participantes deste Horário:
                    </span>

                    {selectedBookingDetail.students &&
                    selectedBookingDetail.students.length > 0 ? (
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {selectedBookingDetail.students.map((student, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-lg bg-white border border-purple-100 shadow-2xs hover:bg-purple-50/40"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px] flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <span className="font-bold text-slate-800 text-xs">
                                {student}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveStudentFromDetail(idx)}
                              className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors"
                              title="Remover aluno da aula"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-purple-600 italic bg-white rounded-lg border border-dashed border-purple-200">
                        Nenhum aluno registrado nesta aula ainda.
                      </div>
                    )}
                  </div>

                  {/* Incluir Aluno Rápido Diretamente nesta Aula */}
                  <div className="pt-2 border-t border-purple-200/70">
                    <label className="text-[11px] font-bold text-purple-900 block mb-1">
                      Incluir Novo Aluno nesta Turma:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        list="detail-students-suggestion"
                        placeholder="Nome do aluno (ou vários por vírgula)..."
                        value={detailStudentInput}
                        onChange={(e) => setDetailStudentInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddStudentToDetail();
                          }
                        }}
                        className="flex-1 p-2 rounded-lg border border-purple-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                      <datalist id="detail-students-suggestion">
                        {customers.map((c) => (
                          <option key={c.id} value={c.name} />
                        ))}
                      </datalist>
                      <button
                        type="button"
                        onClick={handleAddStudentToDetail}
                        className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-sm shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Incluir</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Detalhes de Reserva Normal */
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Cliente Responsável:</span>
                    <span className="font-extrabold text-slate-900">
                      {selectedBookingDetail.customer?.name ||
                        selectedBookingDetail.guestName ||
                        "Cliente Balcão"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Modalidade:</span>
                    <span>{selectedBookingDetail.sportType}</span>
                  </div>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedBookingDetail(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-sm"
                >
                  Fechar
                </button>
              </div>
            </div>
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
                <span className="font-bold block mb-1">
                  Regra Homologada da Arena VIVA:
                </span>
                Ao confirmar, todos os horários agendados para hoje nas quadras
                descobertas serão automaticamente cancelados e o sistema gerará{" "}
                <strong>créditos em horas com validade de 60 dias</strong> para
                os clientes remarcarem sem custo adicional.
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
                              setRainCourtIds((prev) =>
                                prev.filter((id) => id !== c.id)
                              );
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
