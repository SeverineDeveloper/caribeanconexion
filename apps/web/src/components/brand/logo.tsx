import Image from "next/image";
import horizontalOnDark from "@/assets/brand/logo-horizontal-dark.png";
import horizontalOnLight from "@/assets/brand/logo-horizontal-light.png";
import markOnLight from "@/assets/brand/logo-mark.png";
import markOnDark from "@/assets/brand/logo-mark-dark.png";
import stackedOnDark from "@/assets/brand/logo-stacked-dark.png";

// Recursos generados desde docs/brand/originales (ver docs/DESIGN.md §7).
// `on` indica el fondo sobre el que se muestra el logo.
type On = "light" | "dark";

/** Logotipo horizontal: símbolo + "CONEXIÓN CARIBE". Alto por defecto de 44 px. */
export function Logo({
  on = "light",
  className = "h-11 w-auto",
  priority,
}: {
  on?: On;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={on === "dark" ? horizontalOnDark : horizontalOnLight}
      alt="Conexión Caribe"
      className={className}
      priority={priority}
    />
  );
}

/** Solo el símbolo (infinito). */
export function LogoMark({
  on = "light",
  className = "h-9 w-auto",
}: {
  on?: On;
  className?: string;
}) {
  return (
    <Image
      src={on === "dark" ? markOnDark : markOnLight}
      alt=""
      aria-hidden
      className={className}
    />
  );
}

/** Logotipo vertical con el lema, para fondos oscuros amplios. */
export function LogoStacked({ className = "h-40 w-auto" }: { className?: string }) {
  return (
    <Image
      src={stackedOnDark}
      alt="Conexión Caribe · Tu viaje, nuestra conexión."
      className={className}
    />
  );
}
