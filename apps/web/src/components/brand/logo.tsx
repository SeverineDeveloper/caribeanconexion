/** Isotipo: ola turquesa y sol dorado (mismo dibujo que app/icon.svg). */
export function LogoMark({
  className = "size-9",
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      {tone === "light" ? (
        <rect
          x="1"
          y="1"
          width="62"
          height="62"
          rx="15"
          fill="#FFFFFF"
          fillOpacity="0.08"
          stroke="#FFFFFF"
          strokeOpacity="0.18"
          strokeWidth="2"
        />
      ) : (
        <rect width="64" height="64" rx="16" fill="#0A2A4A" />
      )}
      <circle cx="42" cy="22" r="7" fill="#C9A227" />
      <path
        d="M12 40c6.7-6 13.3-6 20 0s13.3 6 20 0"
        fill="none"
        stroke="#0FB5B0"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark tone={tone} />
      <span
        className={`font-display font-semibold text-[1.3125rem] leading-none tracking-tight ${
          tone === "light" ? "text-white" : "text-ink-900"
        }`}
      >
        Conexión{" "}
        <span className={tone === "light" ? "text-teal-400" : "text-teal-600"}>Caribe</span>
      </span>
    </span>
  );
}
