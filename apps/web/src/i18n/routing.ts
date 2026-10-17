import { defineRouting } from "next-intl/routing";

// Para añadir PT/IT/DE: agregar el código aquí y su archivo en messages/.
export const routing = defineRouting({
  locales: ["es", "en", "fr"],
  defaultLocale: "es",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
