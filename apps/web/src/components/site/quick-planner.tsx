"use client";

import { Button, Form, type Key } from "@heroui/react";
import { ArrowRight, CalendarDays, type LucideIcon, MapPin, UsersRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { type FormEvent, type ReactNode, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import {
  CountField,
  type DateRange,
  type FieldPopover,
  TripDates,
  ZoneSelect,
} from "./trip-fields";

/** Los menús salen justo debajo del segmento, alineados con el texto. */
const SEGMENT_POPOVER: FieldPopover = {
  className: "min-w-64",
  offset: 16,
  placement: "bottom start",
};

/**
 * Segmento de la barra: ícono y campo sin borde. Los estados (hover, foco, menú abierto)
 * y las líneas divisorias están en globals.css (.trip-bar__segment).
 */
function Segment({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <div className="trip-bar__segment group/segment">
      {/* Solo donde sobra ancho: en móvil y en md–lg las fechas no cabrían */}
      <span className="hidden size-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600 transition-colors duration-150 group-hover/segment:bg-white group-focus-within/segment:bg-teal-600 group-focus-within/segment:text-white sm:flex md:hidden xl:flex">
        <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

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
    // Marco de vidrio sobre el video y, dentro, la barra blanca: píldora de una fila desde lg.
    <div className="glass rounded-[2.5rem] p-1.5 shadow-raised lg:rounded-full">
      <Form
        onSubmit={onSubmit}
        aria-label={t("title")}
        className="trip-bar grid w-full grid-cols-1 rounded-panel bg-white p-1.5 text-ink-900 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.6fr)_minmax(0,0.8fr)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.45fr)_minmax(0,0.9fr)_auto] lg:rounded-full"
      >
        <Segment icon={MapPin}>
          <ZoneSelect
            label={t("zone")}
            placeholder={t("zonePlaceholder")}
            value={zone}
            onChange={setZone}
            popover={SEGMENT_POPOVER}
          />
        </Segment>
        <Segment icon={CalendarDays}>
          <TripDates
            label={t("dates")}
            value={dates}
            onChange={setDates}
            popover={SEGMENT_POPOVER}
          />
        </Segment>
        <Segment icon={UsersRound}>
          <CountField label={t("travelers")} value={travelers} onChange={setTravelers} min={1} />
        </Segment>
        <Button
          type="submit"
          size="lg"
          className="trip-bar__submit group/submit mt-1.5 w-full gap-3 md:col-span-3 lg:col-span-1 lg:mt-0 lg:ms-1.5 lg:w-auto lg:self-stretch"
        >
          {t("submit")}
          <span className="flex size-7 items-center justify-center rounded-full bg-ink-900/10 transition-transform duration-150 ease-out group-hover/submit:translate-x-0.5">
            <ArrowRight className="size-4" strokeWidth={2.25} aria-hidden="true" />
          </span>
        </Button>
      </Form>
    </div>
  );
}
