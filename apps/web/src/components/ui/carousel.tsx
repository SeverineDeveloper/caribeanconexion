"use client";

import { Button } from "@heroui/react";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Children, type ReactNode, useCallback, useEffect, useState } from "react";

/** A partir de aquí, barra de progreso con contador en lugar de puntos. */
const MAX_DOTS = 8;

/**
 * Carrusel accesible (Embla): arrastre táctil, flechas, puntos y autoplay opcional que se
 * detiene al interactuar y no se activa con movimiento reducido.
 */
export function Carousel({
  children,
  label,
  slideClassName = "basis-[85%] sm:basis-1/2 lg:basis-1/3",
  autoplay = false,
  loop = false,
  tone = "light",
}: {
  children: ReactNode;
  label: string;
  slideClassName?: string;
  autoplay?: boolean;
  loop?: boolean;
  tone?: "light" | "dark";
}) {
  const t = useTranslations("Common");
  const [reduceMotion, setReduceMotion] = useState(true);
  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const [viewportRef, api] = useEmblaCarousel(
    { align: "start", loop, containScroll: "trimSnaps" },
    autoplay && !reduceMotion
      ? [Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })]
      : [],
  );
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const sync = useCallback(() => {
    if (!api) return;
    setSelected(api.selectedScrollSnap());
    setSnaps(api.scrollSnapList());
    setCanPrev(api.canScrollPrev());
    setCanNext(api.canScrollNext());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    sync();
    api.on("select", sync).on("reInit", sync);
    return () => {
      api.off("select", sync).off("reInit", sync);
    };
  }, [api, sync]);

  const slides = Children.toArray(children);
  const dark = tone === "dark";
  const arrowClass = dark
    ? "border-white/30 text-white hover:bg-white/10"
    : "border-field-border bg-white text-ink-900";

  return (
    <section aria-roledescription={t("carousel")} aria-label={label}>
      <div ref={viewportRef} className="overflow-hidden">
        <div className="-ml-5 flex touch-pan-y lg:-ml-6">
          {slides.map((slide, i) => (
            // biome-ignore lint/a11y/useSemanticElements: patrón de carrusel de WAI-ARIA APG (role="group" + aria-roledescription="slide"); <fieldset> no aplica
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: el orden de las diapositivas es fijo
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={t("slideOf", { n: i + 1, total: slides.length })}
              className={`min-w-0 shrink-0 grow-0 pl-5 lg:pl-6 ${slideClassName}`}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {snaps.length > 1 && (
        <div className="mt-8 flex items-center justify-between gap-6">
          {snaps.length > MAX_DOTS ? (
            // Con muchas posiciones los puntos ocupaban dos filas en móvil: barra de progreso
            // y contador. Cada diapositiva ya anuncia «n de total» a los lectores de pantalla.
            <div aria-hidden="true" className="flex items-center gap-3">
              <span
                className={`relative h-1 w-20 overflow-hidden rounded-full ${dark ? "bg-white/20" : "bg-ink-900/10"}`}
              >
                <span
                  className={`absolute inset-y-0 left-0 rounded-full transition-[width] duration-300 ${dark ? "bg-teal-400" : "bg-teal-600"}`}
                  style={{ width: `${((selected + 1) / snaps.length) * 100}%` }}
                />
              </span>
              <span
                className={`font-semibold text-sm tabular-nums ${dark ? "text-white/80" : "text-ink-700"}`}
              >
                {selected + 1} / {snaps.length}
              </span>
            </div>
          ) : (
            // Punto visible de 8 px dentro de un área táctil de 24 px.
            <div className="-mx-2 flex flex-wrap">
              {snaps.map((snap, i) => (
                <button
                  key={snap}
                  type="button"
                  aria-label={t("goToSlide", { n: i + 1 })}
                  aria-current={i === selected ? "true" : undefined}
                  onClick={() => api?.scrollTo(i)}
                  className="flex h-6 min-w-6 items-center justify-center px-1"
                >
                  <span
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === selected
                        ? `w-8 ${dark ? "bg-teal-400" : "bg-teal-600"}`
                        : `w-2 ${dark ? "bg-white/30" : "bg-ink-900/20"}`
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Button
              isIconOnly
              variant="outline"
              aria-label={t("prevSlide")}
              isDisabled={!canPrev}
              onPress={() => api?.scrollPrev()}
              className={arrowClass}
            >
              <ChevronLeft className="size-5" strokeWidth={2} />
            </Button>
            <Button
              isIconOnly
              variant="outline"
              aria-label={t("nextSlide")}
              isDisabled={!canNext}
              onPress={() => api?.scrollNext()}
              className={arrowClass}
            >
              <ChevronRight className="size-5" strokeWidth={2} />
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
