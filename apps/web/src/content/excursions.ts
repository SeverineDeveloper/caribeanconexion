import {
  EXCURSION_MEDIA,
  type ExcursionMedia,
  type ExcursionSlug,
} from "./generated/excursion-media";

/**
 * Excursiones del catálogo. Datos del cliente (docs/catalog, noviembre de 2026) y del
 * catálogo PDF (docs/brand/originales). Contenido provisional: en M1 sale del catálogo
 * administrable del panel, con la misma forma (precio, duración, horarios y galería).
 *
 * Fotos y videos: tools/media/procesar_catalogo.py genera las imágenes y
 * generated/excursion-media.ts. Las actividades con galería tienen página propia.
 */
export const EXCURSION_CATEGORIES = ["sea", "adventure", "culture", "nature"] as const;
export type ExcursionCategory = (typeof EXCURSION_CATEGORIES)[number];

/** Clave en messages/*.json → Excursions.items.<key> (y ExcursionPages.<key> si tiene página). */
export type ExcursionKey =
  | "saonaClasica"
  | "saonaVip"
  | "catalina"
  | "yacht"
  | "buggies"
  | "snorkeling"
  | "parasailing"
  | "speedboat"
  | "diving"
  | "horseback"
  | "zipline"
  | "fishing"
  | "partyBoat"
  | "santoDomingo"
  | "samana";

/** Actividades con ficha completa: tienen textos en ExcursionPages. */
export type ExcursionPageKey = Extract<
  ExcursionKey,
  | "yacht"
  | "buggies"
  | "snorkeling"
  | "parasailing"
  | "speedboat"
  | "diving"
  | "horseback"
  | "zipline"
  | "fishing"
>;

export type ExcursionSchedule = {
  /** Hora de salida "HH:MM" (24 h). */
  from: string;
  /** Hora de regreso "HH:MM", si se conoce. */
  to?: string;
  label?: "sunset" | "exclusive";
};

type ExcursionData = {
  slug: ExcursionSlug;
  category: ExcursionCategory;
  /** Precio "desde", por persona, en USD. Sin precio se muestra "a cotizar". */
  priceFromUsd?: number;
  durationMinutes?: number;
  schedules?: ExcursionSchedule[];
  /** Opera todos los días. */
  daily?: boolean;
};

export type Excursion = ExcursionData &
  ExcursionMedia &
  ({ key: ExcursionPageKey; hasPage: true } | { key: ExcursionKey; hasPage: false });

/** Orden de aparición en la web. */
const DATA: (ExcursionData & { key: ExcursionKey })[] = [
  { slug: "saona-clasica", key: "saonaClasica", category: "sea" },
  { slug: "yate-de-lujo", key: "yacht", category: "sea" },
  {
    slug: "buggies",
    key: "buggies",
    category: "adventure",
    priceFromUsd: 37,
    durationMinutes: 240,
    schedules: [
      { from: "08:00", to: "12:00" },
      { from: "11:00", to: "15:00" },
      { from: "14:00", to: "18:00" },
    ],
  },
  {
    slug: "snorkeling",
    key: "snorkeling",
    category: "sea",
    priceFromUsd: 34,
    schedules: [
      { from: "08:30" },
      { from: "09:30" },
      { from: "11:00" },
      { from: "13:00" },
      { from: "14:00" },
      { from: "15:00" },
    ],
  },
  {
    slug: "parasailing",
    key: "parasailing",
    category: "adventure",
    priceFromUsd: 55,
    daily: true,
    schedules: [{ from: "10:00", to: "16:30" }],
  },
  { slug: "saona-vip", key: "saonaVip", category: "sea" },
  {
    slug: "lancha-rapida",
    key: "speedboat",
    category: "sea",
    priceFromUsd: 73,
    durationMinutes: 210,
    schedules: [
      { from: "08:00", to: "12:00" },
      { from: "11:00", to: "14:00" },
      { from: "15:00", to: "18:00", label: "sunset" },
    ],
  },
  { slug: "isla-catalina", key: "catalina", category: "sea" },
  {
    slug: "buceo",
    key: "diving",
    category: "sea",
    schedules: [
      { from: "07:00", to: "18:00" },
      { from: "07:00", to: "12:00", label: "exclusive" },
    ],
  },
  {
    slug: "cabalgata",
    key: "horseback",
    category: "nature",
    priceFromUsd: 35,
    durationMinutes: 120,
  },
  {
    slug: "tirolesa",
    key: "zipline",
    category: "adventure",
    priceFromUsd: 60,
    schedules: [
      { from: "08:00", to: "12:00" },
      { from: "12:00", to: "16:00" },
    ],
  },
  {
    slug: "pesca",
    key: "fishing",
    category: "sea",
    priceFromUsd: 96,
    daily: true,
    schedules: [
      { from: "07:00", to: "12:00" },
      { from: "12:00", to: "18:00" },
    ],
  },
  { slug: "party-boat", key: "partyBoat", category: "sea" },
  { slug: "samana", key: "samana", category: "nature" },
  { slug: "santo-domingo", key: "santoDomingo", category: "culture" },
];

const PAGE_KEYS = new Set<ExcursionKey>([
  "yacht",
  "buggies",
  "snorkeling",
  "parasailing",
  "speedboat",
  "diving",
  "horseback",
  "zipline",
  "fishing",
]);

function isPageKey(key: ExcursionKey): key is ExcursionPageKey {
  return PAGE_KEYS.has(key);
}

export const EXCURSIONS: Excursion[] = DATA.map((data) => {
  const media = EXCURSION_MEDIA[data.slug];
  const { key } = data;
  // Página propia solo si hay fotos propias y textos de ficha.
  return isPageKey(key) && media.gallery.length > 0
    ? { ...data, ...media, key, hasPage: true }
    : { ...data, ...media, hasPage: false };
});

export type ExcursionWithPage = Extract<Excursion, { hasPage: true }>;

export function excursionsWithPage(): ExcursionWithPage[] {
  return EXCURSIONS.filter((e): e is ExcursionWithPage => e.hasPage);
}

export function excursionPath(slug: string): `/excursiones/${string}` {
  return `/excursiones/${slug}`;
}

/** Código de origen para el mensaje de WhatsApp (ver @cc/core extractOriginCode). */
export function excursionOriginCode(slug: string): string {
  return `CC-EXC-${slug.toUpperCase()}`;
}
