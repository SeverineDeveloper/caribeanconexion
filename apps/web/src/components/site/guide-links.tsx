import { ArrowRight, BookOpen } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { findGuide, guidePath } from "@/content/guides";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

/**
 * Enlaces compactos a guías relacionadas, para el final de páginas de servicio. Enlazan el
 * contenido informativo con el comercial (y al revés), algo que buscadores e IAs valoran.
 */
export async function GuideLinks({ slugs, locale }: { slugs: string[]; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "GuidesPage" });
  const guides = slugs.flatMap((slug) => findGuide(slug) ?? []);
  if (guides.length === 0) return null;

  return (
    <nav aria-label={t("relatedGuides")}>
      <p className="text-eyebrow text-teal-700">{t("relatedGuides")}</p>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:gap-6">
        {guides.map((guide) => (
          <li key={guide.slug}>
            <Link
              href={guidePath(guide.slug)}
              className="group flex h-full items-center gap-4 rounded-card border border-line bg-white p-5 shadow-card transition duration-150 hover:-translate-y-0.5 hover:shadow-raised focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-400 sm:gap-5 sm:p-6"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                <BookOpen className="size-6" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1 text-pretty font-semibold text-ink-900">
                {guide.text[locale].title}
              </span>
              <ArrowRight
                className="size-5 shrink-0 text-teal-600 transition-transform group-hover:translate-x-0.5"
                strokeWidth={2}
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
