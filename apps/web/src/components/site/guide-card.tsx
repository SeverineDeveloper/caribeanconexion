import { ArrowRight, BookOpen } from "lucide-react";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

export type GuideCardProps = {
  href: `/guias/${string}`;
  image?: StaticImageData;
  label: string;
  title: string;
  description: string;
  cta: string;
};

/** Tarjeta de una guía (índice /guias y guías relacionadas). Toda la tarjeta enlaza. */
export function GuideCard({ href, image, label, title, description, cta }: GuideCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-white shadow-card transition duration-150 hover:-translate-y-0.5 hover:shadow-raised has-[a:focus-visible]:ring-3 has-[a:focus-visible]:ring-teal-400">
      <div className="relative aspect-[16/9] overflow-hidden bg-deep-sea">
        {image && (
          <Image
            src={image}
            alt=""
            fill
            placeholder="blur"
            sizes="(min-width: 1024px) 24rem, (min-width: 640px) 45vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        )}
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 font-semibold text-ink-900 text-xs shadow-card">
          <BookOpen className="size-3.5 text-teal-600" strokeWidth={2} aria-hidden="true" />
          {label}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <h3 className="text-balance font-sans font-semibold text-ink-900 text-lg leading-snug">
          {/* El ::after cubre toda la tarjeta: un solo enlace, con el título como nombre. */}
          <Link href={href} className="outline-none after:absolute after:inset-0 after:z-10">
            {title}
          </Link>
        </h3>
        <p className="mt-2 text-pretty text-ink-700">{description}</p>
        <span
          aria-hidden="true"
          className="mt-auto inline-flex items-center gap-2 pt-6 font-semibold text-teal-700"
        >
          {cta}
          <ArrowRight
            className="size-5 transition-transform group-hover:translate-x-0.5"
            strokeWidth={2}
          />
        </span>
      </div>
    </article>
  );
}
