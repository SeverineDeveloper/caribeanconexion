import { Sparkle } from "lucide-react";

/** Franja de destinos en movimiento continuo; se detiene al pasar el mouse o con movimiento reducido. */
export function Marquee({
  items,
  label,
  tone = "light",
}: {
  items: string[];
  label: string;
  tone?: "light" | "dark";
}) {
  const loop = [...items, ...items];
  const dark = tone === "dark";
  return (
    <section
      aria-label={label}
      className={`overflow-hidden border-y py-6 ${
        dark ? "border-white/10 bg-ink-900 text-white/90" : "border-line bg-white text-ink-900/80"
      }`}
    >
      <ul className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {loop.map((item, i) => (
          <li
            // biome-ignore lint/suspicious/noArrayIndexKey: la lista se duplica para el bucle
            key={i}
            aria-hidden={i >= items.length ? "true" : undefined}
            className="flex items-center gap-8 pr-8 font-display text-2xl italic whitespace-nowrap lg:text-3xl"
          >
            {item}
            <Sparkle className="size-4 text-gold-400" fill="currentColor" aria-hidden="true" />
          </li>
        ))}
      </ul>
    </section>
  );
}
