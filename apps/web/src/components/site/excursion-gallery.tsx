"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Labels = {
  /** "Fotos de Buggies": nombre del visor. */
  gallery: string;
  /** "Ampliar foto {n} de {total}" ya con {n} y {total} sin sustituir. */
  openPhoto: string;
  viewAll: string;
  close: string;
  previous: string;
  next: string;
  /** "{n} de {total}" sin sustituir. */
  photoOf: string;
};

/** Clases de cada mosaico según cuántas fotos hay (máximo 5 visibles). */
const TILES: string[][] = [
  [],
  ["col-span-3 sm:col-span-4 sm:row-span-2"],
  ["col-span-3 sm:col-span-2 sm:row-span-2", "hidden sm:block sm:col-span-2 sm:row-span-2"],
  ["col-span-3 sm:col-span-2 sm:row-span-2", "sm:col-span-2", "sm:col-span-2"],
  ["col-span-3 sm:col-span-2 sm:row-span-2", "sm:col-span-2", "", ""],
  ["col-span-3 sm:col-span-2 sm:row-span-2", "", "", "", "hidden sm:block"],
];

const fill = (template: string, values: Record<string, number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));

/**
 * Galería de una excursión: mosaico de hasta 5 fotos y visor a pantalla completa
 * (<dialog> modal nativo con carrusel Embla, flechas del teclado y Escape para cerrar).
 */
export function ExcursionGallery({
  images,
  alts,
  labels,
}: {
  images: StaticImageData[];
  alts: string[];
  labels: Labels;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [viewportRef, api] = useEmblaCarousel({ loop: images.length > 1 });
  const [current, setCurrent] = useState(0);
  const total = images.length;
  const shown = images.slice(0, 5);
  const tiles = TILES[shown.length] ?? [];

  useEffect(() => {
    if (!api) return;
    const sync = () => setCurrent(api.selectedScrollSnap());
    api.on("select", sync);
    return () => {
      api.off("select", sync);
    };
  }, [api]);

  const open = useCallback(
    (index: number) => {
      dialogRef.current?.showModal();
      setCurrent(index);
      // El carrusel se midió oculto: se recalcula ya visible y salta a la foto elegida.
      requestAnimationFrame(() => {
        api?.reInit();
        api?.scrollTo(index, true);
      });
    },
    [api],
  );

  function onKeyDown(event: React.KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowRight") api?.scrollNext();
    if (event.key === "ArrowLeft") api?.scrollPrev();
  }

  return (
    <div className="relative">
      <ul className="grid grid-cols-3 gap-2 sm:h-[26rem] sm:grid-cols-4 sm:grid-rows-2 sm:gap-3 lg:h-[30rem]">
        {shown.map((image, i) => (
          <li
            key={image.src}
            className={`relative overflow-hidden ${i === 0 ? "aspect-[4/3] rounded-card sm:aspect-auto" : "aspect-square rounded-field sm:aspect-auto sm:rounded-card"} ${tiles[i]}`}
          >
            <button
              type="button"
              onClick={() => open(i)}
              aria-label={fill(labels.openPhoto, { n: i + 1, total })}
              className="group block size-full focus-visible:outline-3 focus-visible:outline-teal-400 focus-visible:-outline-offset-3"
            >
              <Image
                src={image}
                alt={alts[i] ?? ""}
                fill
                placeholder="blur"
                priority={i === 0}
                sizes={
                  i === 0
                    ? "(min-width: 1024px) 34rem, (min-width: 640px) 50vw, 100vw"
                    : "(min-width: 1024px) 17rem, (min-width: 640px) 25vw, 33vw"
                }
                className="object-cover transition duration-300 group-hover:scale-[1.03]"
              />
            </button>
          </li>
        ))}
      </ul>

      {total > 1 && (
        <button
          type="button"
          onClick={() => open(0)}
          className="absolute right-3 bottom-3 inline-flex h-11 items-center gap-2 rounded-full bg-white/95 px-4 font-semibold text-ink-900 text-sm shadow-raised transition hover:bg-white focus-visible:outline-3 focus-visible:outline-teal-400"
        >
          <Images className="size-5" strokeWidth={1.75} aria-hidden="true" />
          {fill(labels.viewAll, { count: total })}
        </button>
      )}

      <dialog
        ref={dialogRef}
        aria-label={labels.gallery}
        onKeyDown={onKeyDown}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-ink-900 p-0 text-white backdrop:bg-ink-900/90 open:flex open:flex-col"
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-5 lg:px-8">
          <p className="text-sm text-white/80" aria-live="polite">
            {fill(labels.photoOf, { n: current + 1, total })}
          </p>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label={labels.close}
            className="flex size-11 items-center justify-center rounded-full text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
          >
            <X className="size-6" />
          </button>
        </div>

        <div ref={viewportRef} className="min-h-0 flex-1 overflow-hidden">
          <div className="flex h-full touch-pan-y">
            {images.map((image, i) => (
              <figure
                key={image.src}
                className="flex h-full min-w-0 shrink-0 grow-0 basis-full flex-col px-5 lg:px-24"
              >
                <div className="relative min-h-0 flex-1">
                  <Image
                    src={image}
                    alt={alts[i] ?? ""}
                    fill
                    sizes="100vw"
                    className="object-contain"
                  />
                </div>
                <figcaption className="mx-auto max-w-2xl py-4 text-center text-sm text-white/75">
                  {alts[i]}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {total > 1 && (
          <div className="flex shrink-0 justify-center gap-3 pb-6 lg:pb-8">
            <button
              type="button"
              onClick={() => api?.scrollPrev()}
              aria-label={labels.previous}
              className="flex size-12 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              onClick={() => api?.scrollNext()}
              aria-label={labels.next}
              className="flex size-12 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
            >
              <ChevronRight className="size-6" />
            </button>
          </div>
        )}
      </dialog>
    </div>
  );
}
