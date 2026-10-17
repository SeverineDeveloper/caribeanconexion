import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Todo menos API, panel (/admin, solo en español), internos de Next y archivos con extensión.
  matcher: "/((?!api|admin|_next|_vercel|.*\\..*).*)",
};
