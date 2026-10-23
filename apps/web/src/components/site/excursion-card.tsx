import type { StaticImageData } from "next/image";
import Image from "next/image";
import { WhatsAppIcon } from "@/components/brand/whatsapp-icon";

export function ExcursionCard({
  image,
  category,
  title,
  tagline,
  detail,
  ctaLabel,
  whatsappUrl,
}: {
  image: StaticImageData;
  category: string;
  title: string;
  tagline: string;
  detail: string;
  ctaLabel: string;
  whatsappUrl: string;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-white shadow-card transition duration-150 hover:-translate-y-0.5 hover:shadow-raised">
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
        <h3 className="font-sans font-semibold text-ink-900 text-lg leading-snug">{title}</h3>
        <p className="mt-2 text-ink-700">{tagline}</p>
        <p className="mt-2 flex-1 text-ink-500 text-sm">{detail}</p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener"
          className="mt-5 inline-flex items-center gap-2 font-semibold text-sm text-teal-600 hover:text-teal-700"
        >
          <WhatsAppIcon className="size-4" />
          {ctaLabel}
          <span className="sr-only">: {title}</span>
        </a>
      </div>
    </article>
  );
}
