"use client";

import { Pause, Play } from "lucide-react";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

/**
 * Fondo del hero: foto inmediata (LCP) y video encima cuando conviene cargarlo.
 * El video solo se descarga en pantallas ≥ 768 px, sin "ahorro de datos" y sin movimiento
 * reducido. Incluye botón de pausa (WCAG 2.2.2).
 */
export function HeroVideo({
  src,
  poster,
  alt,
}: {
  src: string;
  poster: StaticImageData;
  alt: string;
}) {
  const t = useTranslations("Common");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
      ?.saveData;
    setEnabled(wide && !reduce && !saveData);
  }, []);

  function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  return (
    <>
      <Image
        src={poster}
        alt={alt}
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="-z-20 object-cover"
      />
      {enabled && (
        <video
          ref={videoRef}
          className={`absolute inset-0 -z-20 size-full object-cover transition-opacity duration-1000 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          onCanPlay={() => setReady(true)}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
      {enabled && ready && (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? t("pauseVideo") : t("playVideo")}
          className="glass absolute top-24 right-5 z-20 flex size-11 items-center justify-center rounded-full text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 lg:top-28 lg:right-8"
        >
          {playing ? (
            <Pause className="size-4" fill="currentColor" />
          ) : (
            <Play className="size-4" fill="currentColor" />
          )}
        </button>
      )}
    </>
  );
}
