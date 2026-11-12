import { ArrowRight } from "lucide-react";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import { WhatsAppIcon } from "@/components/brand/whatsapp-icon";
import { Link } from "@/i18n/navigation";

export type ExcursionCardProps = {
  image: StaticImageData;
  category: string;
  title: string;
  tagline: string;
  detail: string;
  /** Precio ya formateado ("Desde US$37") o "Precio a cotizar". */
  price: string;
  /** "por persona", solo si hay precio. */
  priceUnit?: string;
  ctaLabel: string;
  /** Con página propia, toda la card enlaza a ella; si no, el CTA abre WhatsApp. */
  href?: `/excursiones/${string}`;
  whatsappUrl: string;
};

export function ExcursionCard({
  image,
  category,
  title,
  tagline,
  detail,
  price,
  priceUnit,
  ctaLabel,
  href,
  whatsappUrl,
}: ExcursionCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-white shadow-card transition duration-150 hover:-translate-y-0.5 hover:shadow-raised has-[a:focus-visible]:ring-3 has-[a:focus-visible]:ring-teal-400">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={image}
          alt=""
          fill
          placeholder="blur"
          sizes="(min-width: 1280px) 18rem, (min-width: 640px) 45vw, 100vw"
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 font-semibold text-ink-900 text-xs shadow-card">
          {category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-balance font-sans font-semibold text-ink-900 text-lg leading-snug">
          {href ? (
            // El ::after cubre toda la card: un solo enlace por card, con el título como nombre.
            <Link href={href} className="outline-none after:absolute after:inset-0 after:z-10">
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>
        <p className="mt-2 text-pretty text-ink-700">{tagline}</p>
        <p className="mt-2 flex-1 text-ink-500 text-sm">{detail}</p>
        <p className="mt-5 border-line border-t pt-4">
          <span className="font-semibold text-ink-900">{price}</span>
          {priceUnit && <span className="text-ink-500 text-sm"> · {priceUnit}</span>}
        </p>
        {href ? (
          <span
            aria-hidden="true"
            className="mt-3 inline-flex items-center gap-1.5 font-semibold text-sm text-teal-600 group-hover:text-teal-700"
          >
            {ctaLabel}
            <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
          </span>
        ) : (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener"
            className="tap-area mt-3 inline-flex items-center gap-2 font-semibold text-sm text-teal-600 hover:text-teal-700"
          >
            <WhatsAppIcon className="size-4" />
            {ctaLabel}
            <span className="sr-only">: {title}</span>
          </a>
        )}
      </div>
    </article>
  );
}
