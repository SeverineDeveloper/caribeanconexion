import { Sparkles } from "lucide-react";

/**
 * Bloque "En breve": la respuesta corta de la página, con los datos clave en una frase.
 * Va arriba del contenido porque es lo que la gente lee primero y lo que buscadores e IAs
 * citan cuando responden una pregunta.
 */
export function KeyFacts({ label, text }: { label: string; text: string }) {
  return (
    <aside
      aria-label={label}
      className="rounded-card border border-teal-100 bg-shallows p-6 shadow-card sm:p-8"
    >
      <p className="flex items-center gap-2 text-eyebrow text-teal-700">
        <Sparkles className="size-4" strokeWidth={2} aria-hidden="true" />
        {label}
      </p>
      <p className="mt-3 max-w-[62ch] text-pretty text-ink-900 text-lead">{text}</p>
    </aside>
  );
}
