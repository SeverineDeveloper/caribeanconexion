import { ChevronRight } from "lucide-react";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";
import { Link } from "@/i18n/navigation";
import { jsonLd } from "@/lib/json-ld";
import { siteUrl } from "@/lib/site";

/**
 * Cabecera de las páginas interiores: foto (o fondo de marca), migas de pan con datos
 * estructurados, título y acciones.
 */
export async function PageHero({
  locale,
  path,
  eyebrow,
  title,
  lead,
  image,
  children,
}: {
  locale: string;
  /** Ruta sin idioma, p. ej. "/excursiones" */
  path: string;
  eyebrow: string;
  title: string;
  lead?: string;
  image?: StaticImageData;
  children?: ReactNode;
}) {
  const t = await getTranslations("Common");
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("home"), item: `${siteUrl}/${locale}` },
      { "@type": "ListItem", position: 2, name: eyebrow, item: `${siteUrl}/${locale}${path}` },
    ],
  };

  return (
    <section className="relative isolate overflow-hidden bg-ink-900 text-white">
      {image ? (
        <>
          <Image
            src={image}
            alt=""
            fill
            priority
            placeholder="blur"
            sizes="100vw"
            className="-z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-900/90 via-ink-900/65 to-ink-900/20" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-ink-900/50 to-transparent" />
        </>
      ) : (
        <svg
          aria-hidden="true"
          viewBox="0 0 600 260"
          className="absolute right-0 bottom-0 -z-10 w-[42rem] max-w-none opacity-80"
        >
          <circle cx="480" cy="80" r="46" fill="#CB9E55" />
          <path
            d="M60 220c60-34 120-34 180 0s120 34 180 0 100-30 180-14"
            fill="none"
            stroke="#01AEB5"
            strokeOpacity="0.5"
            strokeWidth="10"
            strokeLinecap="round"
          />
        </svg>
      )}

      <div className="container-page flex min-h-[22rem] flex-col justify-end pt-16 pb-14 lg:min-h-[30rem] lg:pb-20">
        <Reveal>
          <nav aria-label={t("breadcrumb")} className="mb-6 text-sm text-white/70">
            <ol className="flex items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-white">
                  {t("home")}
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-4" />
              </li>
              <li aria-current="page" className="text-white">
                {eyebrow}
              </li>
            </ol>
          </nav>
          <p className="text-eyebrow text-teal-400">{eyebrow}</p>
          <h1 className="mt-3 max-w-4xl text-display-xl text-white">{title}</h1>
          {lead && <p className="mt-5 max-w-2xl text-lead text-white/85">{lead}</p>}
          {children && <div className="mt-9 flex flex-col gap-3 sm:flex-row">{children}</div>}
        </Reveal>
      </div>

      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD escapado con jsonLd()
        dangerouslySetInnerHTML={jsonLd(breadcrumbLd)}
      />
    </section>
  );
}
