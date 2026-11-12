import { formatDuration, formatUsd } from "@cc/core";
import { Check } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";
import { EXCURSIONS, excursionPath } from "@/content/excursions";
import type { GuideBlock, GuideSection } from "@/content/guides";
import { ROUTE_KEYS, VEHICLE_KEYS } from "@/content/services";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { RichText } from "./rich-text";

/** Cuerpo de una guía: secciones con H2 y bloques de texto, listas y tablas. */
export async function GuideBody({
  sections,
  locale,
}: {
  sections: GuideSection[];
  locale: Locale;
}) {
  return (
    <div className="flex flex-col gap-12 lg:gap-14">
      {sections.map((section) => (
        <Reveal key={section.heading}>
          <section>
            <h2 className="text-balance text-display-md text-ink-900">{section.heading}</h2>
            <div className="mt-5 flex flex-col gap-5">
              {section.blocks.map((block, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: bloques fijos de un texto estático
                <Block key={i} block={block} locale={locale} />
              ))}
            </div>
          </section>
        </Reveal>
      ))}
    </div>
  );
}

async function Block({ block, locale }: { block: GuideBlock; locale: Locale }) {
  switch (block.type) {
    case "p":
      return (
        <p className="max-w-[62ch] text-pretty text-ink-700 text-lg leading-relaxed">
          <RichText text={block.text} />
        </p>
      );
    case "list":
      return (
        <ul className="flex max-w-[62ch] flex-col gap-3">
          {block.items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-ink-700 text-lg leading-relaxed">
              <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                <Check className="size-4" strokeWidth={2.25} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <RichText text={item} />
              </span>
            </li>
          ))}
        </ul>
      );
    case "table":
      return <DataTable head={block.head} rows={block.rows} />;
    case "excursionTable":
      return <ExcursionTable locale={locale} />;
    case "transferRoutes":
      return <TransferRoutesTable locale={locale} />;
    case "transferVehicles":
      return <TransferVehiclesTable locale={locale} />;
  }
}

/** Tabla con cabecera; la primera columna identifica la fila. */
function DataTable({ head, rows }: { head: ReactNode[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-card border border-line bg-white shadow-card">
      <table className="w-full border-collapse text-left">
        <thead className="bg-teal-50">
          <tr>
            {head.map((cell, i) => (
              <th
                // biome-ignore lint/suspicious/noArrayIndexKey: columnas fijas
                key={i}
                scope="col"
                className="px-4 py-3.5 font-semibold text-ink-900 text-sm sm:px-6"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: filas fijas
            <tr key={r} className="border-line border-t">
              {row.map((cell, c) =>
                c === 0 ? (
                  <th
                    // biome-ignore lint/suspicious/noArrayIndexKey: columnas fijas
                    key={c}
                    scope="row"
                    className="px-4 py-3.5 font-semibold text-ink-900 sm:px-6"
                  >
                    {cell}
                  </th>
                ) : (
                  // biome-ignore lint/suspicious/noArrayIndexKey: columnas fijas
                  <td key={c} className="px-4 py-3.5 text-ink-700 sm:px-6">
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const tableLink =
  "text-teal-700 underline decoration-teal-300 underline-offset-4 hover:text-teal-800";

/** Todas las excursiones con su duración y precio "desde", según el catálogo. */
async function ExcursionTable({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  return (
    <DataTable
      head={[
        t("GuidesPage.table.activity"),
        t("GuidesPage.table.duration"),
        t("GuidesPage.table.price"),
      ]}
      rows={EXCURSIONS.map((excursion) => {
        const title = t(`Excursions.items.${excursion.key}.title`);
        return [
          excursion.hasPage ? (
            <Link key="title" href={excursionPath(excursion.slug)} className={tableLink}>
              {title}
            </Link>
          ) : (
            title
          ),
          excursion.durationMinutes
            ? formatDuration(excursion.durationMinutes)
            : t("GuidesPage.table.variable"),
          excursion.priceFromUsd === undefined
            ? t("GuidesPage.table.onRequest")
            : formatUsd(excursion.priceFromUsd, locale),
        ];
      })}
    />
  );
}

/** Rutas más pedidas desde el aeropuerto PUJ (mismos datos que la página de traslados). */
async function TransferRoutesTable({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  return (
    <DataTable
      head={[t("GuidesPage.table.route"), t("GuidesPage.table.time")]}
      rows={ROUTE_KEYS.map((route) => [
        t(`Transfers.routes.${route}.to`),
        t(`Transfers.routes.${route}.time`),
      ])}
    />
  );
}

/** Vehículos disponibles para traslados, con capacidad y uso recomendado. */
async function TransferVehiclesTable({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  return (
    <DataTable
      head={[
        t("GuidesPage.table.vehicle"),
        t("GuidesPage.table.capacity"),
        t("GuidesPage.table.idealFor"),
      ]}
      rows={VEHICLE_KEYS.map((vehicle) => [
        t(`Transfers.vehicles.${vehicle}.name`),
        t(`Transfers.vehicles.${vehicle}.capacity`),
        t(`Transfers.vehicles.${vehicle}.idealFor`),
      ])}
    />
  );
}
