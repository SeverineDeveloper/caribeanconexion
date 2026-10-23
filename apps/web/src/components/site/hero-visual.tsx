import { CircleCheck } from "lucide-react";
import Image from "next/image";
import heroPhoto from "@/assets/images/hero-playa.jpg";

type Day = { label: string; title: string; text: string };

/**
 * Composición del hero: foto del Caribe (catálogo del cliente, provisional hasta tener alta
 * resolución) y una tarjeta "Mi viaje" que muestra la promesa: todo en un itinerario.
 */
export function HeroVisual({
  imageAlt,
  tripLabel,
  tripTitle,
  days,
  confirmed,
}: {
  imageAlt: string;
  tripLabel: string;
  tripTitle: string;
  days: Day[];
  confirmed: string;
}) {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div className="relative aspect-[4/3] overflow-hidden rounded-panel shadow-raised sm:aspect-square">
        <Image
          src={heroPhoto}
          alt={imageAlt}
          fill
          priority
          placeholder="blur"
          sizes="(min-width: 1024px) 42vw, (min-width: 640px) 28rem, 100vw"
          className="object-cover"
        />
      </div>

      {/* Móvil: debajo de la imagen, solapada en parte. Desde sm: flotando sobre la esquina. */}
      <div className="relative z-10 mx-4 -mt-20 rounded-card bg-white/95 p-5 shadow-raised ring-1 ring-line backdrop-blur sm:absolute sm:bottom-8 sm:-left-8 sm:mx-0 sm:mt-0 sm:w-80 sm:p-6 lg:-left-14">
        <p className="text-eyebrow text-teal-600">{tripLabel}</p>
        <p className="mt-1 font-semibold text-ink-900">{tripTitle}</p>
        <ol className="mt-4 flex flex-col gap-3">
          {days.map((day) => (
            <li key={day.label} className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0 rounded-full bg-sand-100 px-2.5 py-1 font-semibold text-ink-700 text-xs">
                {day.label}
              </span>
              <span className="text-sm leading-snug">
                <span className="block font-medium text-ink-900">{day.title}</span>
                <span className="text-ink-500">{day.text}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-palm-600/10 px-3 py-1.5 font-semibold text-palm-600 text-sm">
          <CircleCheck className="size-4" strokeWidth={2} aria-hidden="true" />
          {confirmed}
        </p>
      </div>
    </div>
  );
}
