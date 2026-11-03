import { Header } from "@/components/Header";
import { QuadrasClient } from "./QuadrasClient";
import { getSafeCourts, getSafeBookings, getSafeCustomers } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function QuadrasPage() {
  const courts = await getSafeCourts();
  const bookings = await getSafeBookings();
  const customers = await getSafeCustomers();

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <Header
        title="Agenda e Locação das 8 Quadras"
        subtitle="Grade de ocupação em tempo real, reservas avulsas e mensalistas"
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        <QuadrasClient
          courts={courts}
          initialBookings={bookings as any}
          customers={customers}
        />
      </div>
    </div>
  );
}
