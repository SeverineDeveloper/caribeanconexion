"use client";

import { Pause, Play } from "lucide-react";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import { useRef, useState } from "react";

/**
 * Clip corto sin audio de una excursión. Muestra el póster y solo descarga el video cuando
 * la persona pulsa reproducir; después se puede pausar en cualquier momento (WCAG 2.2.2).
 */
export function ExcursionVideo({
  src,
  poster,
  alt,
  playLabel,
  pauseLabel,
}: {
  /** Ruta pública sin basePath, p. ej. "/videos/excursiones/buggies.mp4". */
  src: string;
  poster: StaticImageData;
  alt: string;
  playLabel: string;
  pauseLabel: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const vertical = poster.height > poster.width;

  function toggle() {
    if (!started) {
      setStarted(true);
      setPlaying(true);
      return;
    }
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
    <div
      className={`relative overflow-hidden rounded-card bg-ink-900 ${vertical ? "mx-auto max-w-xs" : ""}`}
      style={{ aspectRatio: `${poster.width} / ${poster.height}` }}
    >
      {started ? (
        <video
          ref={videoRef}
          className="absolute inset-0 size-full object-cover"
          src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${src}`}
          autoPlay
          muted
          loop
          playsInline
          aria-label={alt}
        />
      ) : (
        <Image
          src={poster}
          alt={alt}
          fill
          placeholder="blur"
          sizes={vertical ? "20rem" : "(min-width: 1024px) 44rem, 100vw"}
          className="object-cover"
        />
      )}
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? pauseLabel : playLabel}
        className={
          started
            ? "glass absolute right-3 bottom-3 flex size-11 items-center justify-center rounded-full text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
            : "absolute inset-0 m-auto flex size-16 items-center justify-center rounded-full bg-white/95 text-ink-900 shadow-raised transition hover:scale-105 focus-visible:outline-3 focus-visible:outline-teal-400 focus-visible:outline-offset-2"
        }
      >
        {playing ? (
          <Pause className="size-4" fill="currentColor" />
        ) : (
          <Play className={started ? "size-4" : "ml-1 size-6"} fill="currentColor" />
        )}
      </button>
    </div>
  );
}
