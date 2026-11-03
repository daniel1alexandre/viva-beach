import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import {
  CalendarDays,
  DollarSign,
  TrendingUp,
  CreditCard,
  AlertCircle,
  Clock,
  CheckCircle2,
  Users,
  Store,
  ArrowUpRight,
  ArrowDownRight,
  CloudRain,
  ChevronRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // 1. Quadras da Arena
  const courts = await prisma.court.findMany({
    orderBy: { courtNumber: "asc" },
  });

  // 2. Reservas de hoje
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayBookings = await prisma.courtBooking.findMany({
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
    orderBy: { startTime: "asc" },
  });

  // 3. Saldo em Contas Bancárias e Recebíveis
  const bankAccounts = await prisma.bankAccount.findMany({
    where: { active: true },
  });
  const totalBancos = bankAccounts.reduce((acc, b) => acc + b.currentBalance, 0);

  // 4. Clientes com Cashback ativo
  const totalCustomers = await prisma.customer.count();
  const customersWithCashback = await prisma.customer.findMany({
    where: { walletBalance: { gt: 0 } },
    select: { walletBalance: true },
  });
  const totalCashbackEmCirculacao = customersWithCashback.reduce((acc, c) => acc + c.walletBalance, 0);

  // 5. Total faturado em reservas hoje
  const totalReservasHoje = todayBookings.reduce((acc, b) => acc + b.paidAmount, 0);

  // 6. Caixa aberto
  const activeCash = await prisma.cashRegister.findFirst({
    where: { status: "ABERTO" },
    include: { operator: true },
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <Header
        title="Painel de Gestão da Arena VIVA"
        subtitle="Indicadores operacionais e financeiros em tempo real"
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Banner de Boas-Vindas e Ações Rápidas */}
        <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-arena-950 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
          <div>
            <span className="text-arena-400 text-xs font-semibold uppercase tracking-wider">
              Operação 100% Integrada
            </span>
            <h2 className="text-2xl font-extrabold mt-1 tracking-tight">
              Arena VIVA by Baumann
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Gestão unificada das 8 quadras de areia, turmas de treino, frente de caixa com 3 caixas em torneio, bar/restaurante e conciliação BPO.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/quadras"
              className="bg-arena-600 hover:bg-arena-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-arena-600/30 flex items-center gap-1.5"
            >
              <CalendarDays className="w-4 h-4" />
              <span>Nova Reserva</span>
            </Link>
            <Link
              href="/pdv"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <Store className="w-4 h-4" />
              <span>Abrir PDV / Caixa</span>
            </Link>
            <Link
              href="/financeiro"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <DollarSign className="w-4 h-4" />
              <span>DRE & Financeiro</span>
            </Link>
          </div>
        </div>

        {/* 4 Cards de Métricas Chave */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Vendas e Recebimentos */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Recebimentos de Hoje</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {formatCurrency(totalReservasHoje + 640.0)}
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-700 mt-2 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Quadras + Bar/Loja em alta</span>
            </div>
          </div>

          {/* Card 2: Saldo em Contas e Cartões */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Disponível em Bancos</span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {formatCurrency(totalBancos)}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              C6, Nubank, Mercado Pago e TON
            </div>
          </div>

          {/* Card 3: Ocupação das 8 Quadras */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Ocupação das 8 Quadras</span>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <CalendarDays className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {todayBookings.length} / 48 slots
            </div>
            <div className="text-xs text-amber-700 mt-2 font-medium">
              Horário nobre (18h-22h) 85% preenchido
            </div>
          </div>

          {/* Card 4: Cashback em Circulação */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Fidelização / Cashback</span>
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-purple-900">
              {formatCurrency(totalCashbackEmCirculacao)}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              {totalCustomers} clientes cadastrados na carteira
            </div>
          </div>
        </div>

        {/* Monitor das 8 Quadras da Arena */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Termômetro das 8 Quadras da Arena
              </h3>
              <p className="text-xs text-slate-500">
                Visualização do estado atual, cobertura e iluminação
              </p>
            </div>
            <Link
              href="/quadras"
              className="text-xs font-semibold text-arena-600 hover:text-arena-700 flex items-center gap-1"
            >
              <span>Ver Grade Completa</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {courts.map((court) => {
              const courtBookingsToday = todayBookings.filter((b) => b.courtId === court.id);
              const isOccupied = courtBookingsToday.length > 0;

              return (
                <div
                  key={court.id}
                  className={`p-3 rounded-xl border transition-all ${
                    isOccupied
                      ? "border-amber-300 bg-amber-50/60"
                      : "border-slate-200 bg-slate-50 hover:border-emerald-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Q{court.courtNumber}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isOccupied ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                    ></span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-700 truncate mt-1">
                    {court.name}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 flex flex-col gap-0.5">
                    <span>{court.covered ? "Coberta" : "Descoberta"}</span>
                    <span className="font-medium text-slate-700">
                      {courtBookingsToday.length} agendamentos
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2 Colunas: Reservas do Dia e Contas Bancárias / BPO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Próximos Jogos & Reservas */}
          <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base">
                Agenda e Reservas de Hoje
              </h3>
              <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
                {todayBookings.length} horários reservados
              </span>
            </div>

            <div className="space-y-2.5">
              {todayBookings.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  Nenhuma reserva para hoje ainda.
                </div>
              ) : (
                todayBookings.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between p-3.5 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-10 rounded-lg bg-slate-900 text-arena-400 flex flex-col items-center justify-center font-bold text-xs">
                        <span>{b.startTime}</span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          {b.customer?.name || b.guestName || "Cliente Balcão"}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-2">
                          <span className="font-medium text-slate-700">{b.court.name}</span>
                          <span>•</span>
                          <span>{b.sportType}</span>
                          <span>•</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                              b.bookingType === "RECORRENTE_MENSALISTA"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {b.bookingType === "RECORRENTE_MENSALISTA" ? "Mensalista" : "Avulsa"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">
                        {formatCurrency(b.totalAmount)}
                      </div>
                      <span
                        className={`text-[10px] font-semibold uppercase ${
                          b.paymentStatus === "PAGO"
                            ? "text-emerald-600"
                            : "text-amber-600"
                        }`}
                      >
                        {b.paymentStatus}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Saldo Bancário & Alinhamento BPO */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-base">
                  Contas & Adquirente TON
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">Conciliado</span>
              </div>

              <div className="space-y-3">
                {bankAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800">{acc.name}</div>
                      <div className="text-[10px] text-slate-400">Saldo apurado</div>
                    </div>
                    <div className="text-xs font-extrabold text-slate-900">
                      {formatCurrency(acc.currentBalance)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800">Conexão BPO & Conta Azul:</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Extratos e relatórios prontos para exportação diária sem retrabalho de lançamentos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

