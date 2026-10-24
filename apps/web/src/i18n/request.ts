import { notFound } from "next/navigation";
import * as rootParams from "next/root-params";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

/** Un archivo por área en messages/<idioma>/. Para añadir uno, agregarlo aquí y en messages.d.ts. */
export const MESSAGE_FILES = ["common", "home", "catalog", "pages", "planner"] as const;

export default getRequestConfig(async ({ locale }) => {
  // `locale` llega si se pasa explícito (p. ej. getTranslations({ locale })); si no, del segmento.
  const candidate = locale ?? (await rootParams.locale());
  if (!hasLocale(routing.locales, candidate)) notFound();

  const parts = await Promise.all(
    MESSAGE_FILES.map(
      async (file) => (await import(`../../messages/${candidate}/${file}.json`)).default,
    ),
  );

  return {
    locale: candidate,
    messages: Object.assign({}, ...parts),
  };
});
