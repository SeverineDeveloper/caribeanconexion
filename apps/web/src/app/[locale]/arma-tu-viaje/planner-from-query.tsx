"use client";

import { useSearchParams } from "next/navigation";
import { Planner } from "./planner";

/**
 * Lee en el cliente los datos que envía el planificador rápido (?zona, ?llegada, ?salida,
 * ?viajeros) para que la página siga siendo estática y pueda exportarse.
 */
export function PlannerFromQuery({ whatsappNumber }: { whatsappNumber: string }) {
  const query = useSearchParams();
  const travelers = Number.parseInt(query.get("viajeros") ?? "", 10);
  return (
    <Planner
      key={query.toString()}
      whatsappNumber={whatsappNumber}
      initial={{
        zone: query.get("zona") ?? undefined,
        arrival: query.get("llegada") ?? undefined,
        departure: query.get("salida") ?? undefined,
        travelers: Number.isFinite(travelers) ? travelers : undefined,
      }}
    />
  );
}
