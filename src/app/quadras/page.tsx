import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
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
  Filter,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function QuadrasPage() {
  const courts = await prisma.court.findMany({
    orderBy: { courtNumber: "asc" },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const bookings = await prisma.courtBooking.findMany({
    where: {
      date: {
        gte: today,
        lt: tomorrow,
      },
    },
    include: {
      court: true,
      customer: true,
    },
  });

  // Horários das 06:00 às 23:00
  const timeSlots = [
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00", "21:00", "22:00"
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <Header
        title="Agenda e Locação das 8 Quadras"
        subtitle="Grade de ocupação em tempo real, reservas avulsas e mensalistas"
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Barra Superior de Ações e Filtros */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Hoje ({today.toLocaleDateString("pt-BR")})</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Livre
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ml-2"></span> Avulsa
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ml-2"></span> Mensalista
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 ml-2"></span> Aula / Turma
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              className="bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <CloudRain className="w-4 h-4 text-amber-600" />
              <span>Acionar Protocolo Chuva</span>
            </button>
            <button
              type="button"
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
                    <th key={court.id} className="p-3 font-bold border-r border-slate-800 text-center">
                      <div>Q{court.courtNumber} - {court.name}</div>
                      <div className="text-[10px] text-arena-400 font-normal mt-0.5">
                        {court.covered ? "Coberta" : "Descoberta"} • {court.surface}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {timeSlots.map((slot) => {
                  return (
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
                                className={`p-2 rounded-lg border text-[11px] leading-tight ${
                                  booking.bookingType === "RECORRENTE_MENSALISTA"
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
                                      booking.paymentStatus === "PAGO"
                                        ? "bg-emerald-200 text-emerald-800"
                                        : "bg-amber-200 text-amber-800"
                                    }`}
                                  >
                                    {booking.paymentStatus}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="h-12 rounded border border-dashed border-slate-200 hover:border-arena-400 hover:bg-arena-50/30 transition-all flex items-center justify-center text-slate-300 hover:text-arena-600 cursor-pointer">
                                <Plus className="w-3.5 h-3.5" />
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Políticas Homologadas da Arena VIVA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-600">
            <span className="font-bold text-slate-900 block mb-1">
              🌧️ Regra de Chuva / Intempéries (Homologada):
            </span>
            Em caso de chuva em quadras descobertas, o acionamento do protocolo gera automaticamente créditos em horas com validade de até 60 dias para remarcação.
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-600">
            <span className="font-bold text-slate-900 block mb-1">
              📅 Mensalistas Recorrentes:
            </span>
            Faturamento gerado no primeiro dia de cada ciclo com vínculo automático ao módulo financeiro e comissões dos responsáveis.
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-600">
            <span className="font-bold text-slate-900 block mb-1">
              🎁 Carteira de Cashback:
            </span>
            Reservas avulsas geram cashback na carteira digital do cliente, que pode ser abatido no próximo horário ou consumo no bar.
          </div>
        </div>
      </div>
    </div>
  );
}

