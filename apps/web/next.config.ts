import path from "node:path";
import { withSentryConfig } from "@sentry/nextjs/config";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// El .env de la raíz se carga con dotenv-cli en los scripts de package.json, así llega
// también a los procesos hijos de Next. En producción las variables vienen del contenedor.
const monorepoRoot = path.join(import.meta.dirname, "../..");

// STATIC_EXPORT=1 genera solo la web pública como sitio estático (vista previa en GitHub
// Pages). Se compila una copia sin panel, API ni proxy (ver scripts/export-static.mjs).
const staticExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  ...(staticExport
    ? { output: "export", trailingSlash: true, basePath, images: { unoptimized: true } }
    : { output: "standalone" }),
  outputFileTracingRoot: monorepoRoot,
  transpilePackages: ["@cc/core", "@cc/db"],
  poweredByHeader: false,
  experimental: {
    // El servidor MCP de Next escribe .next/dev/logs en cada petición; en este monorepo
    // Turbopack vigila ese archivo y provoca un bucle de recargas en desarrollo.
    mcpServer: false,
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withSentryConfig(withNextIntl(nextConfig), {
  silent: true,
  // Sin token no se suben source maps (CI los subirá cuando exista SENTRY_AUTH_TOKEN).
  sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },
  telemetry: false,
});
