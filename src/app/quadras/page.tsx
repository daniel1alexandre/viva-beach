import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { QuadrasClient } from "./QuadrasClient";

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

  const customers = await prisma.customer.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <Header
        title="Agenda e Locação das 8 Quadras"
        subtitle="Grade de ocupação em tempo real, reservas avulsas e mensalistas"
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        <QuadrasClient
          courts={courts}
          initialBookings={bookings}
          customers={customers}
        />
      </div>
    </div>
  );
}
