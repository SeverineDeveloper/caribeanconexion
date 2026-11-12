/**
 * Espuma de ola para las franjas de mar profundo (`bg-deep-sea`) de ancho completo.
 * El borde ondulado lo recorta la propia franja con `mask-wave-y`, `mask-wave-top` o
 * `mask-wave-bottom`
 * (globals.css): así no hay dos capas superpuestas ni línea de costura. Esta franja
 * turquesa translúcida va justo debajo del borde, con la misma altura que la máscara.
 * La franja que la contiene debe ser `relative`.
 */
export function WaveFoam({ position }: { position: "top" | "bottom" }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1440 72"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 h-(--wave-h) w-full ${
        position === "top" ? "top-0" : "bottom-0 rotate-180"
      }`}
    >
      {/* Lo que queda por encima del borde ya está recortado: solo se ve la franja */}
      <path
        d="M0 0H1440V44C1240 72 1060 22 860 36C660 50 520 72 320 56C190 46 90 32 0 48Z"
        fill="#01AEB5"
        fillOpacity="0.22"
      />
    </svg>
  );
}
