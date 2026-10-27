"use client";

import { Button, Form, type Key } from "@heroui/react";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { type FormEvent, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { CountField, type DateRange, TripDates, ZoneSelect } from "./trip-fields";

/** Barra de búsqueda del hero: lleva a "Arma tu viaje" con los datos ya cargados. */
export function QuickPlanner() {
  const t = useTranslations("QuickPlanner");
  const router = useRouter();
  const [zone, setZone] = useState<Key | null>(null);
  const [dates, setDates] = useState<DateRange | null>(null);
  const [travelers, setTravelers] = useState(2);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query: Record<string, string> = { viajeros: String(travelers) };
    if (zone) query.zona = String(zone);
    if (dates) {
      query.llegada = dates.start.toString();
      query.salida = dates.end.toString();
    }
    router.push({ pathname: "/arma-tu-viaje", query });
  }

  return (
    <Form
      onSubmit={onSubmit}
      aria-label={t("title")}
      className="grid w-full grid-cols-1 gap-4 rounded-panel bg-white p-5 text-ink-900 shadow-raised sm:p-6 md:grid-cols-2 md:items-end lg:grid-cols-[1fr_1.5fr_0.75fr_auto] lg:gap-3 lg:p-4"
    >
      <ZoneSelect
        label={t("zone")}
        placeholder={t("zonePlaceholder")}
        value={zone}
        onChange={setZone}
      />
      <TripDates label={t("dates")} value={dates} onChange={setDates} />
      <CountField label={t("travelers")} value={travelers} onChange={setTravelers} min={1} />
      <Button type="submit" size="lg" className="w-full lg:w-auto">
        {t("submit")}
        <ArrowRight className="size-5" strokeWidth={2} aria-hidden="true" />
      </Button>
    </Form>
  );
}
