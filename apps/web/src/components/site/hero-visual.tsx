import { CircleCheck } from "lucide-react";

type Day = { label: string; title: string; text: string };

/**
 * Composición del hero: ilustración de marca (hasta tener fotos reales del cliente)
 * y una tarjeta "Mi viaje" que muestra la promesa: todo organizado en un itinerario.
 */
export function HeroVisual({
  tripLabel,
  tripTitle,
  days,
  confirmed,
}: {
  tripLabel: string;
  tripTitle: string;
  days: Day[];
  confirmed: string;
}) {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div className="relative aspect-[4/3] overflow-hidden rounded-panel shadow-raised sm:aspect-[4/5]">
        <BeachIllustration />
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

function BeachIllustration() {
  return (
    <svg
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="absolute inset-0 size-full"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#DDF3F2" />
          <stop offset="1" stopColor="#FBF3E6" />
        </linearGradient>
        <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0FB5B0" />
          <stop offset="1" stopColor="#087571" />
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="url(#sky)" />
      <circle cx="292" cy="118" r="46" fill="#C9A227" opacity="0.9" />
      <circle cx="292" cy="118" r="74" fill="#C9A227" opacity="0.12" />
      <path d="M0 258c60-14 120-14 200 0s140 14 200 0v242H0z" fill="url(#sea)" />
      <path
        d="M0 300c50-12 100-12 150 0s100 12 150 0 70-10 100-4"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.35"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M40 338c40-9 80-9 120 0s80 9 120 0"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.25"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M0 392c90-30 190-34 400-6v114H0z" fill="#F3E7D3" />
      <path d="M0 430c110-22 230-24 400 2v68H0z" fill="#E6D5B8" />
      {/* Palmera (a la derecha: la tarjeta "Mi viaje" cubre la esquina inferior izquierda) */}
      <g transform="translate(410 -20) scale(-1 1)">
        <path
          d="M86 490c6-60 4-138-12-196"
          stroke="#2F6B4F"
          strokeWidth="9"
          fill="none"
          strokeLinecap="round"
        />
        <path d="M74 294c-30-10-58-4-80 14 28-4 52 0 80-14z" fill="#2F6B4F" />
        <path d="M74 294c-14-28-40-42-70-40 26 10 46 22 70 40z" fill="#2F6B4F" />
        <path d="M74 294c18-26 46-36 76-30-26 6-50 16-76 30z" fill="#2F6B4F" />
        <path d="M74 294c28-6 56 4 74 26-26-10-50-16-74-26z" fill="#2F6B4F" />
        <path d="M74 294c-2-30 12-56 38-70-14 22-24 44-38 70z" fill="#2F6B4F" />
      </g>
    </svg>
  );
}
