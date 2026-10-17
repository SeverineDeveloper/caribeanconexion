import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: { default: "Panel", template: "%s · Panel Conexión Caribe" },
  robots: { index: false, follow: false },
};

// Raíz propia del panel: solo en español y fuera del enrutado por idioma.
export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="es" className={`light ${fontVariables}`} data-theme="light">
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
