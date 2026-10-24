import type catalog from "../../messages/es/catalog.json";
import type common from "../../messages/es/common.json";
import type home from "../../messages/es/home.json";
import type pages from "../../messages/es/pages.json";
import type planner from "../../messages/es/planner.json";
import type { routing } from "./routing";

// El español es el idioma de referencia: las claves de los demás se validan contra él.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof common & typeof home & typeof catalog & typeof pages & typeof planner;
  }
}
