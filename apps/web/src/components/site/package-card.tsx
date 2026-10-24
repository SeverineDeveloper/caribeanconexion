import { ArrowUpRight, Check, type LucideIcon } from "lucide-react";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import { WhatsAppIcon } from "@/components/brand/whatsapp-icon";

/** Tarjeta inmersiva (foto completa) para el carrusel del inicio. */
export function PackageSlide({
  image,
  icon: Icon,
  title,
  idealFor,
  ctaLabel,
  whatsappUrl,
}: {
  image: StaticImageData;
  icon: LucideIcon;
  title: string;
  idealFor: string;
  ctaLabel: string;
  whatsappUrl: string;
}) {
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener"
      className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-card text-white"
    >
      <Image
        src={image}
        alt=""
        fill
        placeholder="blur"
        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 85vw"
        className="object-cover transition duration-500 group-hover:scale-105"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-ink-900/95 via-ink-900/40 to-transparent" />
      <span className="glass absolute top-4 left-4 flex size-11 items-center justify-center rounded-full">
        <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <span className="relative p-6">
        <span className="block font-display font-semibold text-2xl">{title}</span>
        <span className="mt-2 block text-sm text-white/80">{idealFor}</span>
        <span className="mt-5 inline-flex items-center gap-1.5 font-semibold text-sm text-teal-400">
          {ctaLabel}
          <ArrowUpRight
            className="size-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={2}
            aria-hidden="true"
          />
        </span>
      </span>
    </a>
  );
}

/** Tarjeta detallada para la página de paquetes. */
export function PackageCard({
  image,
  icon: Icon,
  title,
  idealForLabel,
  idealFor,
  text,
  includesLabel,
  includes,
  customLabel,
  ctaLabel,
  whatsappUrl,
}: {
  image: StaticImageData;
  icon: LucideIcon;
  title: string;
  idealForLabel: string;
  idealFor: string;
  text: string;
  includesLabel: string;
  includes: string[];
  customLabel: string;
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
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-ink-900/60 to-transparent" />
        <span className="absolute bottom-4 left-5 flex items-center gap-3 text-white">
          <span className="glass flex size-10 items-center justify-center rounded-full">
            <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <span className="font-display font-semibold text-2xl">{title}</span>
        </span>
        <span className="absolute top-4 right-4 rounded-full bg-gold-400 px-2.5 py-1 font-semibold text-ink-900 text-xs">
          {customLabel}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <p className="text-sm text-ink-500">
          <span className="font-semibold text-ink-700">{idealForLabel}:</span> {idealFor}
        </p>
        <p className="mt-3 text-ink-700">{text}</p>
        <p className="mt-6 font-semibold text-ink-900 text-sm">{includesLabel}</p>
        <ul className="mt-3 flex flex-1 flex-col gap-2">
          {includes.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-ink-700 text-sm">
              <Check
                className="mt-0.5 size-4 shrink-0 text-teal-600"
                strokeWidth={2}
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener"
          className="mt-8 inline-flex items-center gap-2 font-semibold text-sm text-teal-600 hover:text-teal-700"
        >
          <WhatsAppIcon className="size-4" />
          {ctaLabel}
          <span className="sr-only">: {title}</span>
        </a>
      </div>
    </article>
  );
}
