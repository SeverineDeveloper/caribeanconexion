import { notFound } from "next/navigation";

// Rutas desconocidas dentro de /[locale] muestran el 404 traducido.
export default function CatchAllPage() {
  notFound();
}
